window.addEventListener("load", function () {
  const intro = document.getElementById("intro-screen");
  const main = document.getElementById("main-content");

  if (!localStorage.getItem("visited")) {
    setTimeout(() => {
      document.body.classList.add("loaded");
      localStorage.setItem("visited", "true");
    }, 3000);
  } else {
    intro.style.display = "none";
    document.body.classList.add("loaded");
  }
});