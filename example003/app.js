// -------------------------------------------------------------
// require
const fs = require("fs");
const express = require("express");
const zlib = require("zlib");
const request = require("request");
const crypto = require("crypto");
// -------------------------------------------------------------

// -------------------------------------------------------------
// express
const app = express();
app.use(express.static("public"));
// -------------------------------------------------------------

// -------------------------------------------------------------
// param
const PORT = process.argv[2];
const IPFS_API_PATH = process.argv[3];
console.log("-----------------------------------");
console.log(`PORT: ${PORT}`);
console.log(`IPFS_API_PATH: ${IPFS_API_PATH}`);
console.log("-----------------------------------");
// -------------------------------------------------------------

// -------------------------------------------------------------
// deback
function commandLog(command, args) {
	console.log("\u001b[34m" + command + "\u001b[0m", args);
}
function errerLog(args) {
	console.log("\u001b[31m" + "error" + "\u001b[0m", args);
}
// -------------------------------------------------------------

// -------------------------------------------------------------
// SSE
let CLIENTS = {};

function serverSentEvents(jsonData) {
	const message = `data: ${jsonData}\n\n`;
	for (let id in CLIENTS) {
		// メッセージの送信 \n\nが必要
		CLIENTS[id].write(message);
	}
}

app.get("/sse_events/", function(req, res) {
	const uuid = crypto.randomUUID();
	req.id = uuid;
	res.id = uuid;

	req.socket.setTimeout(Number.MAX_VALUE)
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		Connection: "keep-alive",
	})
	res.write('\n');
	req.on("close", function() {
		delete CLIENTS[this.id];
	})
	CLIENTS[res.id] = res;
})
// -------------------------------------------------------------

// -------------------------------------------------------------
// IPFS
async function multibase_encode(str) {
	const command = "multibase/encode?b=base64url";
	return ipfs_call(command, str)
}

async function multibase_decode(str) {
	const command = "multibase/decode";
	return ipfs_call(command, str)
}

async function ipfs_call(command, str) {
	return new Promise( function(resolve, reject) {
		const options = {
			method: "POST",
			url: `${IPFS_API_PATH}${command}`
		}
		if (str) {
			options.headers = { "Content-Type": "multipart/form-data" }
			options.formData = { "data" : str }
		}
		request(options, function(error, response, body) {
			if (error) { reject(error); return }
			resolve([response.statusCode, body]);
		})
	})
}
// -------------------------------------------------------------

// -------------------------------------------------------------
// cliant event
let PEER_ID

app.post("/init", async function(req, res, next) {
	commandLog("init");

	ipfs_call("id").then( function(output) {
		PEER_ID = output[1]["ID"];
		res.status(output[0]).send(output[1]);
	}).catch( function(error) {
		errerLog(error)
		next();
	})
})

app.post("/evens", async function(req, res, next) {
	commandLog("/evens", req.query.command);

	ipfs_call(req.query.command).then( function(output) {
		res.status(output[0]).send(output[1]);
	}).catch( function(error) {
		errerLog(error)
		next();
	})
})
// -------------------------------------------------------------

// -------------------------------------------------------------
// pubsub
var SUBSCRIBE_REQUEST
var ENC_TOPIC
var INTERVAL_KEY

async function publish(message) {
	commandLog("publish", ENC_TOPIC);

	const options = {
		method: "POST",
		url: `${IPFS_API_PATH}pubsub/pub?arg=${ENC_TOPIC}`,
		headers: {"Content-Type": "multipart/form-data"},
		formData : { "data" : message }
	}

	request
		.post(options)
		.on("response", function(response) {
			console.log(response.statusCode)
		})
}

async function pubsub_peers() {
	ipfs_call(`pubsub/peers?arg=${ENC_TOPIC}`).then( function(output) {
		if (output[0] != 200) { return }
		const peers = JSON.parse(output[1]).Strings;
		const jsonData = JSON.stringify({"type" : "pubsub_peers", "data": peers });
		serverSentEvents(jsonData);
	}).catch( function(error) {
		errerLog(error);
	})
}

app.post("/disconnect", async function(req, res, next) {
	if (SUBSCRIBE_REQUEST) {
		SUBSCRIBE_REQUEST.abort();
		SUBSCRIBE_REQUEST = undefined;
	}
})

app.post("/subscribe", async function(req, res, next) {
	if (SUBSCRIBE_REQUEST) {
		SUBSCRIBE_REQUEST.abort();
		SUBSCRIBE_REQUEST = undefined;
	}

	const topic = req.query.topic;
	commandLog("subscribe", topic);

	const resp = await multibase_encode(topic).catch(function (err) { console.log(err) });

	console.log("resp", resp);
	if (resp[0] != 200) { return };
	ENC_TOPIC = resp[1];
	console.log("ENC_TOPIC", ENC_TOPIC);

	SUBSCRIBE_REQUEST = request
		.post(`${IPFS_API_PATH}pubsub/sub?arg=${ENC_TOPIC}`)
		.on("data", async function(data) {
			commandLog("pubsub/sub data", ENC_TOPIC);

			const obj = JSON.parse(data.toString());
			const decode_message = await multibase_decode(obj.data);
			if (decode_message[0] != 200) { return };
			const message_data = Buffer.from( decodeURIComponent(decode_message[1]), "base64");
			const inflated = zlib.inflateRawSync( message_data );
			console.log(inflated.toString("utf8"));
			const messageObj = JSON.parse(inflated.toString("utf8"));

			messageObj.id = obj.from;
			serverSentEvents( JSON.stringify( messageObj ) );
		})
		.on("error", async function(error) {
			errerLog(error);
		})

	clearInterval(INTERVAL_KEY);
	INTERVAL_KEY = setInterval(pubsub_peers, 5000);
	pubsub_peers();
})

app.post("/send_message", async function(req, res, next) {
	const message = req.query.message;
	commandLog("send_message", message);

	const timestamp = Date.now();
	const jsonData = JSON.stringify( { "type" : "message", "timestamp": timestamp, "data": message } );
	const deflated = zlib.deflateRawSync( Buffer.from(jsonData, 'utf8') ).toString('base64');
	console.log("deflated");
	console.log(deflated);
	publish( encodeURIComponent(deflated) );

	res.send("complete");
})
// -------------------------------------------------------------

app.listen(PORT, function() {
	console.log(`Start server port:${PORT}`);
})