var designIMG = [{
    id: 1,
    img: "../multimedia/Logo.png",
    desc: "The NASA logo",
    alt: "The NASA logo"
    
},{
    id: 2,
    img: "../multimedia/star-galaxy.gif",
    desc: "A gif of sparkling stars",
    alt: "The gif I use for my background"
},{
    id: 3,
    img: "../multimedia/Text Sample.png",
    desc: "A sample image of my font style",
    alt: "A text sample",
},{
    id: 4,
    img: "../multimedia/colorScheme.jpg",
    desc: "My current basic color pallete.",
    alt: "A color palette",
},{
    id: 5,
    img: "../multimedia/Basic ideas.jpg",
    desc: "These are my first, basic wireframes.",
    alt: "My basic wireframes",
},{
    id: 6,
    img: "../multimedia/Knaflic.png",
    desc: "An excerpt from Knaflic, showing the kind of information that they offer.",
    alt: "An excerpt from Knaflic",
},{
    id: 7,
    img: "../multimedia/updatedIdeas.jpg",
    desc: "An update to my basic wireframes to reflect the current site. I would normally do more, but that's not currently possible with my injury.",
    alt: "My updated rough wireframes",
},{
    id: 8,
    img: "../multimedia/Art2.jpg",
    desc: "A 2D representation of what I ultimately want to make in 3d for my final art piece.",
    alt: "Stars being blotted out by red",
},{
    id: 9,
    img: "../multimedia/Learningpage.jpg",
    desc: "A wireframe of my learning page. This was made before the crunch, since I had more I wanted to work out.",
    alt: "A drawing of the learning page",
},{
    id: 10,
    img: "../multimedia/genericWireframe.jpg",
    desc: "A wireframe showing a vertical slice of my site's features.",
    alt: "A wireframe showing multiple features",
},{
    id: 11,
    img: "../multimedia/Wireframept2.jpg",
    desc: "A continuation of the last wireframe. I would normally go page by page, but I lost too much time wrangling APIs for that.",
    alt: "A wireframe showing multiple features",
},{
    id: 12,
    img: "../multimedia/VisualizationFrames.jpg",
    desc: "Visualizations of what I want for my data visualizations. Current 1 and 3 are implemented.",
    alt: "An image with graphs",
},{
    id: 13,
    img: "../multimedia/mobileFrame.jpg",
    desc: "A small wireframe showing the unique features of the mobile site.",
    alt: "A picture of the mobile home page",
},{
    id: 14,
    img: "../multimedia/Graphs.jpg",
    desc: "This image summarizes all my graphs in one place.",
    alt: "A picture of all four graphs",
},{
    id: 15,
    img: "../multimedia/homeUpdated.png",
    desc: "An updated wireframe of my home page discussing why I changed it.",
    alt: "A wireframe of the updated home page",
},{
    id: 16,
    img: "../multimedia/Essay4images/Artframe.jpg",
    desc: "A wireframe that I used to plan my final iteration of the art piece.",
    alt: "A wireframe of the final art piece",
},{
    id: 17,
    img: "../multimedia/Sortframe.jpg",
    desc: "A wireframe of a discarded sorting visualization plan.",
    alt: "A wireframe of a sorting visualizer",
},{
    id: 18,
    img: "../multimedia/Artframe2.jpg",
    desc: "The first wireframe of the final art piece. It ended up a little different.",
    alt: "A wireframe of the final final art piece.",
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
var sectionCenter = document.querySelector(".image-Gallery");

displayGallery(designIMG);

function displayGallery(galleryItems){
    var displayGallery = galleryItems.map(function (galleryItem){
      return `<div class="galleryItem">
        <img src="${galleryItem.img}" alt="${galleryItem.alt}" onclick="OpenFull(this.src, this.alt)">
        <div class="desc font italic">${galleryItem.desc}</div></div>`;
    }).join("");
  
    sectionCenter.innerHTML = displayGallery;
  }