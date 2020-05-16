const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const url = require("url");
const { isURL } = require("./helpers");
const downloader = new YoutubeMp3Downloader({
  ffmpegPath: process.env.FFMPEG_PATH,
  outputPath: process.env.OUTPUT_PATH,
  youtubeVideoQuality: "highest",
  queueParallelism: 10,
  progressTimeout: 50,
});

module.exports = {
  download: function (videoIdOrLink, fileName) {
    return new Promise((resolve, reject) => {
      let videoId = videoIdOrLink;

      if (isURL(videoIdOrLink)) {
        let urlQueryObj = url.parse(videoIdOrLink, true).query;
        videoId = urlQueryObj.v;
      }

      if (!videoId) {
        throw new Error("Missing video id.");
      }

      downloader.download(videoId, fileName);

      downloader.on("finished", function (err, data) {
        resolve(data);
      });

      downloader.on("error", function (err) {
        reject(err);
      });
    });
  },
  downloader,
};
