const navigationBar = document.querySelector("#nav");
const headerText = document.querySelector();
window.onscroll = () => {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    navigationBar.classList.add("effect");
  } else {
    navigationBar.classList.remove("effect");
  }
};
window.onload = () => {
  let videosString = "videos";
  for (let i = 0; i < videosString.length; i++) {}
};
