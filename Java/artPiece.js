var dateInput = document.querySelector("#datepicker");
var currentDate =new Date().toISOString().slice(0, 10);
dateInput.max=currentDate;
dateInput.min="1995-06-16";

var Pictures = [];


//SVG
    var height = window.innerHeight,
    width = window.innerWidth;

    //CREATE SVG + outlines
    var svg = d3
       .select('#domain')
       .append("svg")   
       .attr("width", width)
       .attr("height", height);


function generateRandomDate(from, to) {
    return new Date(
      from.getTime() +
        Math.random() * (to.getTime() - from.getTime()),
    );
  }

async function getData(date) {
    var file;

    if (date != undefined) {
        var res = await fetch("https://api.nasa.gov/planetary/apod?api_key=93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ" + date,{
        method:"GET"
        })
    }else{
        var res = await fetch("https://api.nasa.gov/planetary/apod?api_key=93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ&date=2023-10-09&",{
        method:"GET"
        })
    }    

    if (res != undefined) {
        file = await res.json();
    }else{
        console.log("Something isn't right here.");
        return null;
    }
    
    console.log(file);

    return(file);
}

async function createArray() {
    I = 0;
    
    while (I < 8) {
        var dateInput = generateRandomDate(new Date(1996, 1, 1), new Date());
        dateInput = dateInput.toISOString().slice(0, 10);
        var newDate = "&date="+dateInput+"&";

        var tempfile = await getData(newDate);

        Pictures.push(tempfile);

        I += 1;
    }

    // console.log(Pictures);

    return(Pictures);
}

function createArt(data){
    svg.selectAll("*").remove();
    
    var rScale = d3.scaleSqrt().domain([19000000, 21000000]).range([55, 70]);


    //prune values
    for (var i = 0; i < data.length; i++) {
        if(data[i].media_type == "video"){
            data.splice(i, 1); 
        }else if (typeof data[i].date == "string"){
            data[i].date = data[i].date.replace('-', '');
            data[i].date = data[i].date.replace('-', '');
            data[i].date = parseInt(data[i].date);
        }
    }

    console.log(data);

    

    //CREATE FORCES
    var forceX = d3.forceX(width / 2).strength(0.05);
    var forceY = d3.forceY(height / 2).strength(0.03);
    var forceCollide = d3.forceCollide((d) => rScale(d.date) + 2);
    var expandCollide = d3.forceCollide((d) => rScale(d.date) + 12);

    var simulation = d3
    .forceSimulation()
    .force("forceX", forceX)
    .force("forceY", forceY)
    .force("forceCollide", forceCollide);

    //DRAW CIRCLES
    function drawCircles(data) {
    var defs = svg.append("defs");
    defs
        .selectAll()
        .data(data)
        .enter()
        .append("pattern")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("id", (d) => d.date)
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", (d) => d.hdurl);

    var circles = svg
        .selectAll()
        .data(data)
        .enter()
        .append("circle")
        .attr("r", (d) => rScale(d.date))
        .style("fill", (d) => `url(#${d.date})`)
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('100')
                .attr("r", (d) => rScale(d.date) + 10);
                simulation.force("forceCollide", expandCollide).alphaTarget(0.3).restart();
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('200')
                 .attr("r", (d) => rScale(d.date));
                 simulation.force("forceCollide", forceCollide).alphaTarget(0.3).restart();
        
        })
        .on('click', (event, datum) => displayInfo(datum));

    function ticked() {
        circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    simulation.nodes(data).on("tick", ticked);

    

    //end of drawCircles function
    }

    drawCircles(data);

}

function displayInfo(d) {
    document.getElementById("displayArea").style.visibility = "visible";
    
    document.getElementById("title").textContent = d.title;

    var date1 = d.date.toString();
    var date2 = date1.slice(0, 4) + "-" + date1.slice(4, 6) + "-" + date1.slice(6);

    document.getElementById("date").textContent = date2;
    document.getElementById("date").datetime = date2;
    document.getElementById("pic").src = d.hdurl;
    document.getElementById("explanation").textContent = d.explanation;
}


async function initialize() {
    var files = await createArray();

    createArt(files);
}

async function addBall(date) {
    var tempfile = await getData(date);

    Pictures.push(tempfile);

    createArt(Pictures);
}

initialize();

dateInput.addEventListener('change',(e)=>{
    var newdate = "&date="+dateInput.value+"&";
    e.preventDefault();
    addBall(newdate);
   })