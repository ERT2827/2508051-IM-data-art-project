var designIMG = [{
    id: 1,
    img: "multimedia/Logo.png",
    desc: "The NASA logo",
    alt: "The NASA logo"
},{
    id: 2,
    img: "multimedia/star-galaxy.gif",
    desc: "A silly lil gif",
    alt: "A gif of sparkling stars"
},]


var fullImgBox = document.getElementById("fullIMGBox");
var fullIMG = document.getElementById("fullIMG");

function OpenFull(pic, texzt){
    fullImgBox.style.display = "flex";
    fullIMG.src = pic; 
    fullIMG.alt = texzt;
}

function CloseFull(){
    fullImgBox.style.display = "none";
}

//Gallery populator

var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);

var sectionCenter = document.querySelector(".image-Gallery");

if(filename == "design.html"){
    displayGallery(designIMG);
}else if(filename == "portfolio.html"){
    displayGallery(portfolioIMG)
}


function displayGallery(galleryItems){
    var displayGallery = galleryItems.map(function (galleryItem){
      return `<div class="galleryItem">
        <img src="${galleryItem.img}" alt="${galleryItem.alt}" onclick="OpenFull(this.src, this.alt)">
        <div class="desc font italic">${galleryItem.desc}</div></div>`;
    }).join("");
  
    sectionCenter.innerHTML = displayGallery;
  }