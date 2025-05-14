const express = require("express");
const path = require("path");
const app = express();
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

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

app.post("/video-downloader", async (req, res) => {
  const token = req.body.token;
  const secretKey = "6LcibDcrAAAAAAdPG53CcDVRHUAKtsf94bPQwFsw"; // Your Secret Key

  if (!token) {
    return res
      .status(400)
      .json({ verified: false, error: "No token provided" });
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${token}`,
      }
    );

    const data = await response.json();

    if (data.success) {
      res.json({ verified: true });
    } else {
      console.log("reCAPTCHA failed:", data);
      res.status(403).json({ verified: false, error: data["error-codes"] });
    }
  } catch (err) {
    console.error("Error verifying CAPTCHA:", err);
    res.status(500).json({ verified: false, error: "Server error" });
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public", "404.html"));
});
