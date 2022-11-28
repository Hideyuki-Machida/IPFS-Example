// -------------------------------------------------------------
// params
const searchParams = new URLSearchParams(window.location.search)
const IPFS_REMOTE_ID = searchParams.get("IPFS_REMOTE_ID")
const TOPIC = searchParams.get("TOPIC")

document.getElementById("remote_id").value = IPFS_REMOTE_ID;
document.getElementById("topic").value = TOPIC;
// -------------------------------------------------------------

// -------------------------------------------------------------
// SSE
new EventSource("/sse_events/").onmessage = async function(event) {
	console.log("@onmessage");
	console.log(event.data);

	const messageObj = JSON.parse(event.data);

	switch (messageObj.type) {
		case "pubsub_peers": 
			ELM_PUBSUB_PEERS.value = messageObj.data;
			break
		case "message": 
			const date = new Date(messageObj.timestamp);
			const clone = message_template.content.cloneNode(true);
			clone.querySelector(".id").innerText = messageObj.id;
			clone.querySelector(".time").innerText = date;
			clone.querySelector(".message").innerText = messageObj.data;
			ELM_MESSAGE_LIST.appendChild(clone);
			ELM_MESSAGE_LIST.scrollTo(0, ELM_MESSAGE_LIST.scrollHeight);
			break
	}
}
// -------------------------------------------------------------

// -------------------------------------------------------------
let IPFS_OWN_ID

const ELM_MESSAGE_LIST = document.getElementById("message_list")
const ELM_PUBSUB_PEERS = document.getElementById("pubsub_peers");

async function api(command) {
	const response = await fetch(command, {method: "POST"});
	if (response.status == 200) {
		console.log(response);
		return response.json();
	} else {
		alert(`API ERROR: ${command}`);
	}
}

async function init() {
	const command = "/init";
	const res = await api(command);
	IPFS_OWN_ID = res.ID;
	document.getElementById("own_id").value = IPFS_OWN_ID;
}

async function remote(remote_id) {
	const command = `/evens?command=id?arg=${remote_id}`;
	return api(command)
}

async function pubsub_peers(remote_id) {
	const command = `/evens?command=pubsub/peers`;
	const res = await api(command);
	const ids = res.Strings;
	for (const id of ids) {
		if (remote_id == id) {
			return true
		}
	}
	return false
}

async function connet(remoteObj) {
	const address = remoteObj.Addresses;
	for (const addres of address) {
		try {
			const command = `/evens?command=swarm/connect?arg=${addres}`;
			const res = await api(command);
			if ( res.Strings[0].match(/success/) ) {
				return
			}
			console.log(res);
		} catch {
			
		}
	}
}

async function subscribe(topic) {
	const command = `/subscribe?topic=${topic}`;
	fetch(command, {method: "POST"})
	.catch(function(error) {
		console.log(error);
	})
}

async function publish(message) {
	const command = `/send_message?message=${message}`;
	fetch(command, {method: "POST"})
	.catch(function(error) {
		console.log(error);
	})
}
// -------------------------------------------------------------

// -------------------------------------------------------------
const ELM_CONNECT_BUTTON = document.getElementById('connect_button');
ELM_CONNECT_BUTTON.addEventListener("click", async function(event) {

	const ipfs_remote_id = document.getElementById("remote_id").value;
	const topic = document.getElementById("topic").value;

	var is_connect = await pubsub_peers(ipfs_remote_id);
	if (!is_connect) {
		const remoteObj = await remote(ipfs_remote_id);
		await connet(remoteObj);
		is_connect = await pubsub_peers(ipfs_remote_id);
	}
	
	subscribe(topic);
})

const ELM_DISCONNECT_BUTTON = document.getElementById("disconnect_button");
ELM_DISCONNECT_BUTTON.addEventListener("click", async function(event) {
	const command = "/disconnect";
	await fetch(command, {method: "POST"})
})

const ELM_SEND_BUTTON = document.getElementById("send_button");
const ELM_MESSAGE_INPUT = document.getElementById("message_input");
ELM_SEND_BUTTON.addEventListener("click", function(event) {
	const message = encodeURIComponent( ELM_MESSAGE_INPUT.value );
	const command = `/send_message?message=${ message }`;

	fetch(command, {method: "POST"});
})
// -------------------------------------------------------------

// -------------------------------------------------------------
// init
const res = await init();
console.log("init", res);

if (IPFS_REMOTE_ID && TOPIC) {
	var is_connect = await pubsub_peers(IPFS_REMOTE_ID);
	console.log("is_connect: ", is_connect);

	if (!is_connect) {
		const remoteObj = await remote(IPFS_REMOTE_ID);
		await connet(remoteObj);
	}
	
	subscribe(TOPIC);
}
// -------------------------------------------------------------
