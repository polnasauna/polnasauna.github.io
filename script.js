"use strict";

// const bannerMessage =
//   "V zimných mesiacoch nemusí byť prístupová cesta prejazdná osobným autom.  Za pochopenie ďakujeme.";

const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});

// window.addEventListener("load", () => {
//   document.getElementById("bannerMessage").innerHTML = bannerMessage;
// });
