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

function showToast(msg, timeout) {
  const toast = document.createElement('div');
  toast.className="toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), timeout);
}
