const express = require("express");
const path = require("path");
const app = express();
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.listen(3000);

app.use(express.static(path.join(__dirname, "../public"))); // Serve static files

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
