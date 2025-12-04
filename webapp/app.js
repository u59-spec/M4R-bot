// Telegram WebApp init
const tg = window.Telegram.WebApp;
tg.expand();

const ageYes = document.getElementById('ageYes');
const ageGate = document.getElementById('ageGate');
const catalog = document.getElementById('catalog');
const msg = document.getElementById('msg');

ageYes.onclick = () => {
  ageGate.style.display = 'none';
  catalog.style.display = 'block';
};

// bouton commande
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('order')) {
    const name = e.target.dataset.name;
    const payload = { product: name, user: tg.initDataUnsafe?.user?.id || 'unknown' };
    tg.sendData(JSON.stringify(payload));
    msg.innerText = 'Commande envoyée au bot ✅';
  }
});
