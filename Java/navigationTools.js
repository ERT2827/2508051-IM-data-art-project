var pages = [{
    ID: 1,
    location: "../index.html",
    text: "Home"
},{
    ID: 2,
    location: "learning.html",
    text: "Learning"
},{
    ID: 3,
    location: "art.html",
    text: "Art Piece 1"
},{
    ID: 4,
    location: "art2.html",
    text: "Art Piece 2"
},{
    ID: 5,
    location: "design.html",
    text: "Design"
},{
    ID: 6,
    location: "blog.html",
    text: "Blog"
},{
    ID: 7,
    location: "../multimedia/Logo.png",
    text: "Logo"
}]

var pagesInd = [{
    ID: 1,
    location: "index.html",
    text: "Home"
},{
    ID: 2,
    location: "HTML/learning.html",
    text: "Learning"
},{
    ID: 3,
    location: "HTML/art.html",
    text: "Art Piece 1"
},{
    ID: 4,
    location: "HTML/art2.html",
    text: "Art Piece 2"
},{
    ID: 5,
    location: "HTML/design.html",
    text: "Design"
},{
    ID: 6,
    location: "HTML/blog.html",
    text: "Blog"
},{
    ID: 7,
    location: "multimedia/Logo.png",
    text: "Logo"
}]

//changes

//top bar

var fileName = location.href.split("/").slice(-1); 
console.log(fileName);

var topBarArea = document.querySelector(".navArea");

    if(fileName == "index.html" || fileName == ""){
        displayTopBar(pagesInd);
    }else{
        displayTopBar(pages);
    }

    

function displayTopBar(pageses){
    // var displayTopBar = pageses.map(function (pageses){
    //     return `<li><a href="${pageses.location}">${pageses.text}</a></li>`;
    //   }).join(" ");

    // topBarArea.innerHTML = displayTopBar;

    var wrapr = document.querySelector('.wrapper');

    var nav = document.createElement('nav');
    nav.classList.add('logo');
    var logoLink = document.createElement('a');
    logoLink.href = `${pageses[0].location}`;
    var img = document.createElement('img');
    img.src = `${pageses[6].location}`;
    img.alt = "Logo";

    var ul = document.createElement('ul');
    ul.classList.add('navArea');

    
    wrapr.append(nav);
    nav.append(logoLink);
    logoLink.append(img);
    wrapr.append(ul);

    var linkList = document.querySelector('.navArea')

    pageses.pop();

    var displayTopBar = pageses.map(function (pageses){
        return `<li><a href="${pageses.location}">${pageses.text}</a></li>`;
    }).join(" ");

    linkList.innerHTML = displayTopBar;

    
}

//Sidebar

var sideBarArea = document.getElementById("sideChick");

if(sideBarArea != null){
    if(fileName == "index.html" || fileName == ""){
        displaysideBar(pagesInd);
    }else{
        displaysideBar(pages);
    }
}

function displaysideBar(pageses) {
    var aside = document.getElementById("sideChick");

    var nav = document.createElement("nav");

    aside.append(nav);

    // pageses.pop();

    var displaysideBar = pageses.map(function (pageses){
        return `<li><a href="${pageses.location}">${pageses.text}</a></li>`;
    }).join(" ");

    nav.innerHTML = displaysideBar;
}

//to top

var toTopper = document.querySelector(".toTop");

window.addEventListener("scroll", () => {
    if(window.scrollY > 100){
        toTopper.classList.add("active");
    }else{
        toTopper.classList.remove("active");
    }
})

//active page display
var activePage = window.location.pathname;
var navLinks = document.querySelectorAll('nav a')
    .forEach(link => {
        if(link.href.includes(`${activePage}`)){
            link.classList.add('currentPage');
        }
    })