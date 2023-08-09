var pages = [{
    ID: 1,
    location: "../HTML/index.html",
    text: "Home"
},{
    ID: 2,
    location: "../HTML/learning.html",
    text: "Learning"
},{
    ID: 3,
    location: "../HTML/art.html",
    text: "Art"
},{
    ID: 4,
    location: "../HTML/design.html",
    text: "Design"
},{
    ID: 5,
    location: "../HTML/blog.html",
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

//to top

const toTop = document.querySelector(".to-Top");

window.addEventListener("scroll", () => {
    if(window.scrollY > 100){
        toTop.classList.add("active");
    }else{
        toTop.classList.remove("active");
    }
})