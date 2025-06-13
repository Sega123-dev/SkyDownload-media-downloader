# SkyDownload-media-downloader

SkyDownload is a website and open-source software that is used for downloading videos from youtube in both MP3 and MP4 format.Website has the following features and pages:

- Downloading Youtube videos in various resolutions through a youtube video link(if supported).
- Downloading audio from youtube videos in the best quality through a youtube video link(128 bitrate).
- 404 page for invalid GET requests.
- Terms of Service page to guide you through our legal labels.
- Page for downloading videos.
- Page for downloading audios.
- Simple instruction page on how to download the media content.
- Simple routing through NodeJS router.
- Page that describes about the software and website.
- Website pages where the data is scraped and ready to be downloaded.
- FAQ(Frequently Asked Questions) page.
- reCaptcha implemented for safety from bot traffic.
- Simple dark-themed UI design.
- Website is responsive and accessible easily.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.We suggest you to download the compressed ZIP file from the GitHub page.See in the Prerequisites what you need to install on your machine so you can make this app running

### Prerequisites

Install the ExpressJS for handling back-end processing of youtube requests.

```
npm run express
```

Install the latest version of FFmpeg software for converting audio and video into MP3 and MP4.

```
npm run ffmpeg fluent-ffmpeg @ffmpeg-installer/ffmpeg
```

Install the FFmpeg software on your machine from the [FFmpeg Official Website](https://ffmpeg.org/).

Run this command to install the latest version of JavaScript library ytdl-core for handling youtube requests

```
npm install @distube/ytdl-core@latest
```

Install the dotenv library for accessing your environment variables safely(use your own env variables).

```
npm install dotenv
```

Use the EJS view engine for easy access to fetched back-end data.

```
npm install ejs
```

Other dependencies used in this software for fetching and parsing data:

```
npm install path node-fetch body-parser uuid
```



**Note:** These softwares can be deprecated due to constant limitations of Youtube.Do not use VPN when using our website or anything that can disrupt the streaming process.


### Installing

In the server.js paste this code for getting all needed dependencies and libraries to be up and running(it should be already at the top of the server.js file).

```
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
```

## Built With

- [Express](https://expressjs.com/) – Fast, unopinionated, minimalist web framework for Node.js  
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) – Core programming language for the web  
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) – Markup language for creating web pages  
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) – Style sheet language for designing web content  
- [EJS (Embedded JavaScript Templates)](https://ejs.co/) – Templating engine for generating HTML with JavaScript  
- [ytdl-core](https://github.com/fent/node-ytdl-core) – YouTube video downloader library for Node.js  
- [Webpack](https://webpack.js.org/) – Static module bundler for modern JavaScript applications  

## Authors

* **Sega123-dev** - *Worked mostly on the app and implemented all design and functionality* - [Sega123-dev](https://github.com/Sega123-dev)
* **KebabDev** - *Implemented accessibility* - [KebabDev](https://github.com/KebabDev)

## Acknowledgments

* I don't promote piracy,this software is made for learning purposes only.
* Downloading results may vary based on the user region,youtube restrictions,DRM restrictions and availability.
* Files like node_modules,.env,package.json and package-lock.json are not pushed to this repo.

If there are issues with the software or you feel like your rights are violated,feel free to contact me.
