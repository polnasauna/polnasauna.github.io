"use strict";

const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});

document.querySelectorAll(".image-container img").forEach((image) => {
  image.onclick = () => {
    document.querySelector(".pop-img").style.display = "block";
    document.querySelector(".pop-img img").src = image.getAttribute("src");
  };
});

// document
//   .querySelector(".pop-img")
//   .addEventListener("keydown", function (event) {
//     if (event.key === "ArrowRight") {
//       function prev() {
//         if (i <= 0) i = images.length;
//         i--;
//         return sliderImg.setAttribute("src", "img/" + images[i]);
//       }
//     }
//   });

document.querySelector(".menu").onclick = () => {
  document.querySelector(".menu").style.display = "none";
  document.querySelector(".toggler").setAttribute = "checked";
};

document.querySelector(".pop-img").onclick = () => {
  document.querySelector(".pop-img").style.display = "none";
};

document.querySelector(".pop-img span").onclick = () => {
  document.querySelector(".pop-img").style.display = "none";
};

let pop = document.querySelector(".pop-img");

window.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    pop.style.display = "none";
  }
});

let sliderImg = document.querySelector(".slider-img");
let images = [
  "IMG-20220420-WA0000.jpg",
  "IMG-20220420-WA0001.jpg",
  "IMG-20220420-WA0003.jpg",
  "IMG-20220420-WA0004.jpg",
  "IMG-20220420-WA0005.jpg",
  "IMG-20220420-WA0006.jpg",
  "IMG-20220420-WA0009.jpg",
  "IMG-20220420-WA0010.jpg",
  "IMG-20220726-WA0001.jpg",
  "IMG-20220726-WA0002.jpg",
  "IMG-20220726-WA0003.jpg",
];
let i = 0; // Current image index

function prev() {
  if (i <= 0) i = images.length;
  i--;
  // i = i % image.length;
  return setImage();
}

function next() {
  if (i >= images.length - 1) i = -1;
  i++;
  return setImage();
}

function setImage() {
  return sliderImg.setAttribute("src", "img/" + images[i]);
}

window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    next();
  }
});

window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    prev();
  }
});

document.querySelector(".btn-prev").addEventListener("click", function (e) {
  e.stopPropagation();
});

document.querySelector(".btn-next").addEventListener("click", function (e) {
  e.stopPropagation();
});
