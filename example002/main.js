import MSE from "./MSE.js"

const url = "./data.json";
const response = await fetch(url);
const value = await response.text();
const paths = JSON.parse(value);
const list = document.getElementById('list');

const isBrave = (navigator.brave && await navigator.brave.isBrave() || false);
const basePath = isBrave ? "ipfs://" : "http://127.0.0.1:8080/ipfs/";

for (const imgInfo of paths["images"]) {
	var filePath = basePath + imgInfo.path;
	console.log(filePath);
	var clone = image_template.content.cloneNode(true);
	clone.querySelector(".title").innerText = imgInfo.title;
	clone.querySelector(".image").src = filePath;
	document.getElementById("list").appendChild(clone);
}

for (const videoInfo of paths["videos"]) {
	const filePath = basePath + videoInfo.path;
	console.log(filePath);
	const clone = video_template.content.cloneNode(true);
	clone.querySelector(".title").innerText = videoInfo.title;
	clone.querySelector(".video").src = filePath;
	document.getElementById('list').appendChild(clone);
}

for (const dashInfo of paths["dash"]) {
	const filePath = basePath + dashInfo.path;
	console.log(filePath);
	const clone = video_template.content.cloneNode(true);
	clone.querySelector(".title").innerText = dashInfo.title;
	const video = clone.querySelector(".video");
	const mse = new MSE().init(video, filePath + "/", dashInfo.mpd);
	document.getElementById("list").appendChild(clone);
}

class fLoader extends Hls.DefaultConfig.loader {
	constructor(config) {
		super(config);
		const fPath = config.fPath;
		const load = this.load.bind(this);
		this.load = function (context, config, callbacks) {
			const flagmentFileName = context.url.match(".+/(.+?)([\?#;].*)?$")[1];
			context.url = fPath + flagmentFileName;
			load(context, config, callbacks);
		}
	}
}
Hls.DefaultConfig.fLoader = fLoader;

for (const hlsInfo of paths["hls"]) {
	const clone = video_template.content.cloneNode(true);
	clone.querySelector(".title").innerText = hlsInfo.title;
	const video = clone.querySelector(".video");
	const hlsBasePath = basePath + hlsInfo.path + "/";
	const m3u8Path = hlsBasePath + hlsInfo.m3u8;
	console.log(hlsBasePath);
	console.log(m3u8Path);
	if (Hls.isSupported()) {
		const hls = new Hls();
		hls.config.fPath = hlsBasePath
		hls.loadSource(m3u8Path);
		hls.attachMedia(video);
	} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = m3u8Path;
	}
	document.getElementById("list").appendChild(clone);
}
