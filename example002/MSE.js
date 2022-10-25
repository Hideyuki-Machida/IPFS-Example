export default class MSE {
	async init(video, basePath, file) {
		this.video = video;
		this.basePath = basePath;
		const response = await fetch(basePath + file);
		if (response.ok) {
			const xmlString = await response.text();
			const parser = new window.DOMParser();
			const mpd = parser.parseFromString( xmlString , "text/xml");

			const representation = mpd.getElementsByTagName("Representation")[0];
			const mimeType = representation.getAttribute("mimeType");
			const codecs = representation.getAttribute("codecs");
			const type = mimeType + '; codecs="' + codecs + '"';

			const segmentTemplate = mpd.getElementsByTagName("SegmentTemplate")[0];
			const startNumber = segmentTemplate.getAttribute("startNumber");
			const timescale = segmentTemplate.getAttribute("timescale");
			const duration = segmentTemplate.getAttribute("duration");

			this.mpd = mpd;
			this.type = type;
			this.segmentCount = Number(startNumber);
			this.segmentNum = Number(duration / timescale);

			this.ms = new MediaSource();
	
			this.initVideo();
		}
	}

	completeMediaSegment() {
		this.ms.endOfStream();
		this.sb.removeEventListener('updateend', this.appendMediaSegment);
	}

	async appendMediaSegment() {
		if (this.segmentNum < this.segmentCount) {
			this.completeMediaSegment();
			return
		}

		const media = this.mpd.getElementsByTagName("SegmentTemplate")[0].getAttribute("media");
		const url = this.basePath + media.replace("$Number$", this.segmentCount);
		const response = await fetch(url);

		if (response.ok) {
			const arrayBuffer = await response.arrayBuffer();
			this.sb.appendBuffer(arrayBuffer);
			this.segmentCount += 1;
		} else {
			this.completeMediaSegment();
		}
	}

	async appendInitSegment() {
		const url = this.basePath + this.mpd.getElementsByTagName("SegmentTemplate")[0].getAttribute("initialization");
		const response = await fetch(url);
		if (response.ok) {
			const arrayBuffer = await response.arrayBuffer();
			this.sb.appendBuffer(arrayBuffer);
		} else {
			this.completeMediaSegment();
		}
	}

	initSourceBuffer() {
		this.sb = this.ms.addSourceBuffer(this.type);
		this.sb.addEventListener("updateend", this.appendMediaSegment.bind(this), false);
		this.appendInitSegment();
	}		

	initVideo() {
		this.ms.addEventListener("sourceopen", this.initSourceBuffer.bind(this), false);
		this.video.src = URL.createObjectURL(this.ms);
	}
}