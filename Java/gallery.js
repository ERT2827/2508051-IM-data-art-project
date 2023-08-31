var designIMG = [{
    id: 1,
    img: "multimedia/Logo.png",
    desc: "The NASA logo",
    alt: "The NASA logo"
    
},{
    id: 2,
    img: "multimedia/star-galaxy.gif",
    desc: "A gif of sparkling stars",
    alt: "The gif I use for my background"
},{
    id: 3,
    img: "multimedia/Text Sample.png",
    desc: "A sample image of my font style",
    alt: "A text sample",
},{
    id: 4,
    img: "multimedia/colorScheme.jpg",
    desc: "My current basic color pallete.",
    alt: "A color palette",
},{
    id: 5,
    img: "multimedia/Basic ideas.jpg",
    desc: "These are my first, basic wireframes.",
    alt: "My basic wireframes",
},{
    id: 6,
    img: "multimedia/Knaflic.png",
    desc: "An excerpt from Knaflic, showing the kind of information that they offer.",
    alt: "An excerpt from Knaflic",
},{
    id: 7,
    img: "multimedia/updatedIdeas.jpg",
    desc: "An update to my basic wireframes to reflect the current site. I would normally do more, but that's not currently possible with my injury.",
    alt: "My updated rough wireframes",
},{
    id: 8,
    img: "multimedia/Art2.jpg",
    desc: "A poor 2D representation of what I ultimately want to make in 3d for my final art piece.",
    alt: "Stars being blotted out by red",
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
var fileName = url.substring(url.lastIndexOf('/')+1);

var sectionCenter = document.querySelector(".image-Gallery");

if(fileName == "design.html"){
    displayGallery(designIMG);
}else if(fileName == "portfolio.html"){
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