const express = require("express");
const path = require("path");
const app = express();
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ytdl = require("@distube/ytdl-core");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

app.use(express.json());

require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.use(express.static("public"));

app.locals.encodeURIComponent = encodeURIComponent;

app.listen(3000);

app
  .get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  })
  .get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "about.html"));
  })
  .get("/FAQs", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "faqs.html"));
  })
  .get("/instructions", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "instructions.html"));
  })
  .get("/yt-to-mp3", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "yttomp3.html"));
  })
  .get("/terms-of-service", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "tos.html"));
  })
  .get("/spotify-downloader", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "spotifydownloader.html"));
  })
  .get("/video-downloader", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "videodownloader.html"));
  });

app.post("/video-downloader", async (req, res) => {
  const token = req.body.token;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const videoURL = req.body.VidDownloaderURLInput;

  if (!token) {
    return res
      .status(400)
      .json({ verified: false, error: "No token provided" });
  }

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ success: "false", error: "Not a valid URL" });
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const data = await response.json();
    if (!data.success) {
      res
        .status(403)
        .json({ success: false, error: "CAPTCHA verification failed" });
    }
    res.json({
      success: true,
      downloadPage: `/download-video?videoURL=${encodeURIComponent(videoURL)}`,
    });
  } catch (err) {
    console.error("Error verifying CAPTCHA:", err);
    res.status(500).json({ verified: false, error: "Server error" });
  }
});

app.get("/download-video", async (req, res) => {
  const url = req.query.videoURL;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send("Invalid or missing YouTube URL");
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails.pop().url;
    const durationSeconds = parseInt(info.videoDetails.lengthSeconds, 10);

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    const videoDuration =
      hours > 0
        ? `${hours}:${String(minutes).padStart(2, "0")}:${String(
            seconds
          ).padStart(2, "0")}`
        : `${minutes}:${String(seconds).padStart(2, "0")}`;

    res.render("downloadvideo", { title, url, thumbnail, videoDuration });
  } catch (err) {
    console.error("Render error:", err);
    res.status(500).send("Failed to fetch video info");
  }
});

app.get("/fetch-mp4", async (req, res) => {
  const url = req.query.videoURL;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send("Invalid or missing YouTube URL");
  }

  try {
    const info = await ytdl.getInfo(url);
    const title =
      "[SKYDOWNLOAD] " +
        info.videoDetails?.title?.replace(/[^a-zA-Z0-9]/g, "_") || "video";

    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
    res.setHeader("Content-Type", "video/mp4");

    // Choose the best video+audio format in MP4 container
    const stream = ytdl(url, {
      quality: "highest", // chooses best video+audio combined format
      filter: (format) =>
        format.container === "mp4" && format.hasVideo && format.hasAudio,
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).send("Error streaming video");
    });

    stream.pipe(res);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).send("Failed to download MP4");
  }
});

app.post("/spotify-downloader", async (req, res) => {
  const token = req.body.token;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return res
      .status(400)
      .json({ verified: false, error: "No token provided" });
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (data.success) {
      res.json({ verified: true, redirect: "/home" });
    } else {
      console.log("reCAPTCHA failed:", data);
      res.status(403).json({ verified: false, error: data["error-codes"] });
    }
  } catch (err) {
    console.error("Error verifying CAPTCHA:", err);
    res.status(500).json({ verified: false, error: "Server error" });
  }
});

app.post("/yt-to-mp3", async (req, res) => {
  const token = req.body.token;
  const url = req.body.YTToMP3URLInput;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, error: "Missing CAPTCHA token" });
  }

  if (!ytdl.validateURL(url)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid YouTube URL" });
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secretKey);
    params.append("response", token);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (!data.success) {
      return res
        .status(403)
        .json({ success: false, error: "CAPTCHA verification failed" });
    }

    // Everything good: send a download link to trigger next step
    res.json({
      success: true,
      downloadPage: `/download-mp3?url=${encodeURIComponent(url)}`,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.get("/download-mp3", async (req, res) => {
  const url = req.query.url;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send("Invalid or missing YouTube URL");
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails.pop().url;

    res.render("downloadmp3", { title, url, thumbnail, videoDuration });
  } catch (err) {
    console.error("Render error:", err);
    res.status(500).send("Failed to fetch video info");
  }
});
app.get("/fetch-mp3", async (req, res) => {
  const url = req.query.url;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send("Invalid or missing YouTube URL");
  }

  try {
    const info = await ytdl.getInfo(url);
    const title =
      "[SKYDOWNLOAD] " +
        info.videoDetails?.title?.replace(/[^a-zA-Z0-9]/g, "_") || "video";
    res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);

    const stream = ytdl(url, { quality: "highestaudio" });

    ffmpeg(stream)
      .audioBitrate(128)
      .format("mp3")
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        res.status(500).send("Error processing audio");
      })
      .pipe(res, { end: true });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).send("Failed to download MP3");
  }
});
