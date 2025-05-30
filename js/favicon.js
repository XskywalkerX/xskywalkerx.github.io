function setFavicon(color) {
const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
link.rel = 'icon';
link.href = color === 'dark'
    ? './assets/images/jedi-dark.svg'
    : './assets/images/jedi.svg';
document.head.appendChild(link);
}

const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
setFavicon(darkMode.matches ? 'dark' : 'light');

darkMode.addEventListener('change', e => {
setFavicon(e.matches ? 'dark' : 'light');
});