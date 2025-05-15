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
  // INJECT CSS
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

let widgetId;

function onloadCallback() {
  widgetId = grecaptcha.render("recaptcha-container", {
    sitekey: "6LcibDcrAAAAAFqRmszWzSZOy6O0wrEK1CiYkteo", // Your Site Key
    theme: "light",
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = grecaptcha.getResponse(widgetId);
    if (!token) {
      alert("Please complete the reCAPTCHA.");
      return;
    }

    const url = document.getElementById("YTtoMP3URLInput").value;

    const res = await fetch("/video-downloader", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, url }),
    });

    const data = await res.json();
    document.getElementById("responseMessage").innerText = data.verified
      ? "CAPTCHA Verified. Proceeding..."
      : "CAPTCHA Verification Failed.";
  });
});
