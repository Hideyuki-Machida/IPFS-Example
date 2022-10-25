import MSE from "./MSE.js"

const images = [
	{title: "jpg", path: "img_facemesh_001.jpg"},
	{title: "png", path: "img_segmentation_001.png"},
]

const videos = [
	{title: "mp4", path: "pexels-anthony-shkraba-production-8688822-s.mp4"},
	{title: "fmp4", path: "fmp4_pexels-mikhail-nilov-8670824-s.mp4"},
]

const dash = [
	{title: "dash", mpd: "out_dash.mpd", path: "dash"}
]

const hls = [
	{title: "hls", m3u8: "video.m3u8", path: "hls"}
]

for (const imgInfo of images) {
	var filePath = "./img/" + imgInfo.path;
	console.log(filePath);
	var clone = image_template.content.cloneNode(true);
	clone.querySelector(".title").innerText = imgInfo.title;
	clone.querySelector(".image").src = filePath;
	document.getElementById("list").appendChild(clone);
}

for (const videoInfo of videos) {
	const filePath = "./video/" + videoInfo.path;
	console.log(filePath);
	const clone = video_template.content.cloneNode(true);
	clone.querySelector(".title").innerText = videoInfo.title;
	clone.querySelector(".video").src = filePath;
	document.getElementById('list').appendChild(clone);
}

for (const dashInfo of dash) {
	const filePath = "./video/" + dashInfo.path;
	console.log(filePath);
	const clone = video_template.content.cloneNode(true);
	clone.querySelector(".title").innerText = dashInfo.title;
	const video = clone.querySelector(".video");
	const mse = new MSE().init(video, filePath + "/", dashInfo.mpd);
	document.getElementById("list").appendChild(clone);
}

for (const hlsInfo of hls) {
	const filePath = "./video/" + hlsInfo.path + "/" + hlsInfo.m3u8;
	console.log(filePath);
	const clone = video_template.content.cloneNode(true);
	clone.querySelector(".title").innerText = hlsInfo.title;
	const video = clone.querySelector(".video");
	if (Hls.isSupported()) {
		const hls = new Hls();
		hls.loadSource(filePath);
		hls.attachMedia(video);
	} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = videoSrc;
	}
	document.getElementById("list").appendChild(clone);
}
