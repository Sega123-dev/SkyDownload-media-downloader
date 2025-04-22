const navigationBar = document.querySelector("[data-nav]");
const headerText = document.querySelector("[data-header]");
window.onscroll = () => {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    navigationBar.classList.add("effect");
  } else {
    navigationBar.classList.remove("effect");
  }
};

function typeWriter() {
  let videosString = "videos";
  let i = 0;
  if (i < headerText.length) {
    headerText.innerHTML += videosString.charAt(i);
    i++;
    setTimeout(typeWriter, 1000);
  }
}

typeWriter();
