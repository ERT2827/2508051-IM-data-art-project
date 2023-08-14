var pages = [{
    ID: 1,
    location: "index.html",
    text: "Home"
},{
    ID: 2,
    location: "learning.html",
    text: "Learning"
},{
    ID: 3,
    location: "art.html",
    text: "Art"
},{
    ID: 4,
    location: "design.html",
    text: "Design"
},{
    ID: 5,
    location: "blog.html",
    text: "Blog"
},]

//top bar

const topBarArea = document.querySelector(".nav-Area");

    displayTopBar(pages);

function displayTopBar(pageses){
    var displayTopBar = pageses.map(function (pageses){
        return `<li><a href="${pageses.location}">${pageses.text}</a></li>`;
      }).join(" ");

    topBarArea.innerHTML = displayTopBar;
}

//Sidebar

const sideBarArea = document.getElementById("sideChick");

if(sideBarArea != null){
    displaysideBar(pages);
}

function displaysideBar(pageses) {
    var displaysideBar = pageses.map(function (pageses){
        return `<li><a href="${pageses.location}">${pageses.text}</a></li>`;
      }).join(" ");

      sideBarArea.innerHTML = displaysideBar;
}

//to top

const toTop = document.querySelector(".to-Top");

window.addEventListener("scroll", () => {
    if(window.scrollY > 100){
        toTop.classList.add("active");
    }else{
        toTop.classList.remove("active");
    }
})