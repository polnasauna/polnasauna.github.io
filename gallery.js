"use strict";

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
  "img/IMG20230529152630.jpg",
  "img/IMG20230529153846.jpg",
  "img/IMG-20220420-WA0000.jpg",
  "img/IMG20230529153059.jpg",
  "img/IMG-20220420-WA0003.jpg",
  "img/IMG20230529153910.jpg",
  "img/IMG-20220420-WA0005.jpg",
  "img/IMG-20220420-WA0006.jpg",
  "img/IMG-20220420-WA0009.jpg",
  "img/IMG-20220420-WA0010.jpg",
  "img/IMG-20220726-WA0002.jpg",
  "img/IMG-20220726-WA0003.jpg",
  "img/IMG-20220801-WA0000.jpg",
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
  return sliderImg.setAttribute("src", images[i]);
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
