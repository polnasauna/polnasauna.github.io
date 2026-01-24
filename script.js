"use strict";

const toTop = document.querySelector(".to-top");

if (toTop) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
      toTop.classList.add("active");
    } else {
      toTop.classList.remove("active");
    }
  });
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'red',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    zIndex: 1000,
    fontSize: '14px',
    opacity: '0.9'
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}
