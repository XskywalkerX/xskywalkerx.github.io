window.addEventListener("load", function () {
    const loader = document.getElementById("loader-wrapper");

    document.body.classList.add("loaded");

    loader.classList.add("hide");
    setTimeout(() => loader.style.display = "none", 500); // espera a transição
});

function showLoader() {
    const loader = document.getElementById("loader-wrapper");
    loader.classList.remove("hide");
    loader.style.display = "flex";
    document.body.classList.remove("loaded");
}