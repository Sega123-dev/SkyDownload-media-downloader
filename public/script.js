const navigationBar = document.querySelector("[data-nav]");
const headerText = document.querySelector("[data-header]");
const hamburgerMenuIcon = document.querySelector("[data-hamburger]");

window.onscroll = () => {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    navigationBar.classList.add("effect");
  } else {
    navigationBar.classList.remove("effect");
  }
};
let TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName("typewrite");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-type");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }

  var css = document.createElement("style");
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
  document.body.appendChild(css);
};
function toggleHamburger() {
  let anchors = document.querySelectorAll("[data-anchors]");
  anchors.forEach((anchor) => {
    if (anchor.style.display === "none") {
      anchor.style.display = "block";
    } else {
      anchor.style.display = "none";
    }
  });
  hamburgerMenuIcon.style.cursor = "pointer";
}

let widgetIdVidDownloader;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-vd");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = grecaptcha.getResponse(widgetIdVidDownloader);
    if (!token) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    const url = document.getElementById("VidDownloaderURLInput").value.trim();

    try {
      const res = await fetch("/video-downloader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Change 'url' to 'YTToMP3URLInput' to match backend
        body: JSON.stringify({ token, VidDownloaderURLInput: url }),
      });

      const data = await res.json();

      if (data.success && data.downloadPage) {
        window.location.href = data.downloadPage;
      } else {
        document.getElementById("responseMessageVidDownloader").innerText =
          data.error || "Failed to verify or convert.";
      }
    } catch (err) {
      console.error("Error:", err);
      document.getElementById("responseMessageVidDownloader").innerText =
        "An error occurred.";
    }
    document.getElementById("responseMessageVidDownloader").innerText =
      data.verified
        ? "CAPTCHA Verified. Proceeding..."
        : "CAPTCHA Verification Failed.";
    grecaptcha.reset(widgetIdVidDownloader);
  });
});

let widgetIdSpotDownloader;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-sd");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = grecaptcha.getResponse(widgetIdSpotDownloader);
    if (!token) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    const url = document.getElementById("SpotDownloaderURLInput").value;

    const res = await fetch("/spotify-downloader", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, url }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.redirect) {
          window.location.href = data.redirect;
        } else {
          console.error(`Failed redirecting to ${data.redirect}`);
        }
      });

    const data = await res.json();
    document.getElementById("responseMessageSpotDownloader").innerText =
      data.verified
        ? "CAPTCHA Verified. Proceeding..."
        : "CAPTCHA Verification Failed.";
    grecaptcha.reset(widgetIdSpotDownloader);
  });
});

let widgetIdYtToMP3;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-yt");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = grecaptcha.getResponse(widgetIdYtToMP3);
    if (!token) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    const url = document.getElementById("YTToMP3URLInput").value.trim();

    try {
      const res = await fetch("/yt-to-mp3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Change 'url' to 'YTToMP3URLInput' to match backend
        body: JSON.stringify({ token, YTToMP3URLInput: url }),
      });

      const data = await res.json();

      if (data.success && data.downloadPage) {
        window.location.href = data.downloadPage;
      } else {
        document.getElementById("responseMessageYtToMP3").innerText =
          data.error || "Failed to verify or convert.";
      }
    } catch (err) {
      console.error("Error:", err);
      document.getElementById("responseMessageYtToMP3").innerText =
        "An error occurred.";
    }
    document.getElementById("responseMessageYtToMP3").innerText = data.verified
      ? "CAPTCHA Verified. Proceeding..."
      : "CAPTCHA Verification Failed.";
    grecaptcha.reset(widgetIdYtToMP3);
  });
});
const videoDurationHolder = document.getElementById("vid-duration").innerText;
const vidDurationMessage = document.getElementById("duration-message");

function extractDuration() {
  if (videoDurationHolder.length >= 7) {
    vidDurationMessage.style.display = "block";
  } else if (videoDurationHolder.length == 5) {
    const minuteDigit = Number(videoDurationHolder[0]);
    if (minuteDigit >= 3) vidDurationMessage.style.display = "block";
  }
}
extractDuration();
