//I transferred all my workings here to clean up the live code,
//please ignore any mistakes here since it isn't actually used anywhere.


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
       .attr("height", height)
       .attr("id", "displaySpace");

    var defs = svg.append("defs");

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
    
    while (I < 5) {
        var dateInput = generateRandomDate(new Date(1996, 1, 1), new Date());
        dateInput = dateInput.toISOString().slice(0, 10);
        var newDate = "&date="+dateInput+"&";

        var tempfile = await getData(newDate);

        Pictures.push(tempfile);

        I += 1;
    }

    console.log(Pictures);

    return(Pictures);
}

async function createArt(){
    var rScale = d3.scaleSqrt().domain([19000000, 21000000]).range([55, 70]);
    
    
    var data = await createArray();

    //prune values
   for (var i = 0; i < data.length; i++) {
    if(data[i].media_type == "video"){
        data.splice(i, 1); 
    }else{
        data[i].date = data[i].date.replace('-', '');
        data[i].date = data[i].date.replace('-', '');
        data[i].date = parseInt(data[i].date);
    }

    

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

    simulation.nodes(data).on("tick", ticked);

    function ticked() {
        circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    //end of drawCircles function
    }
    

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

async function addBall(date) {
    var rScale = d3.scaleSqrt().domain([19000000, 21000000]).range([55, 70]);

    var file = await getData(date);

    console.log(file);

    file.date = file.date.replace('-', '');
    file.date = file.date.replace('-', '');
    file.date = parseInt(file.date);

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

    //create cirle
    defs
        .selectAll()
        .data(file)
        .enter()
        .append("pattern")
        .merge()
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
        .data(file)
        .enter()
        .append("circle")
        .merge()
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

        simulation.nodes(file).on("tick", ticked);

        function ticked() {
            circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        }
}

createArt();




dateInput.addEventListener('change',(e)=>{
    var newdate = "&date="+dateInput.value+"&";
    e.preventDefault();
    addBall(newdate);
   })

   //Third attempt

//    // Specify the dimensions of the chart.
//    var width = 928;
//    var height = width;
//    var margin = 0.2; // to avoid clipping the root circle stroke
  
   
   
//    // Specify the number format for values.
//    var format = d3.format(",d");

//    // Create a categorical color scale.
//    var color = d3.scaleOrdinal(d3.schemeTableau10);

//    // Create the pack layout.
//    var pack = d3.pack()
//        .size([width - margin * 2, height - margin * 2])
//        .padding(3);

//    // Compute the hierarchy from the (flat) data; expose the values
//    // for each node; lastly apply the pack layout.
//    var root = pack(d3.hierarchy({children: data})
//        .sum(d => d.date/10));

//    // Create the SVG container.
//    var svg = d3
//        .select('#domain')
//        .append("svg")
//        .attr("width", width)
//        .attr("height", height)
//        .attr("viewBox", [-margin, -margin, width, height])
//        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
//        .attr("text-anchor", "middle");

//    // Place each (leaf) node according to the layout’s x and y values.
//    var node = svg.append("g")
//        .selectAll()
//        .data(root.leaves())
//        .join("g")
//        .attr("transform", d => `translate(${d.x},${d.y})`);

//    // Add a filled circle.
//    node.append("circle")
//        .attr("fill-opacity", 0.7)
//        .attr("fill", "steelblue")
//        .attr("r", (Math.random() * (24 - 20)) + 20);


//    return Object.assign(svg.node(), {scales: {color}});

   //Second attempt

//    //dimensions
//    var height = window.innerHeight,
//    width = window.innerWidth;

//    //create svg
//    var svg = d3
//    .select('#myGraph')
//    .append("svg")
//    .attr('height', height)
//    .attr('width', width);

//    //forces
//    var forceX = d3.forceX(width/2).strength(0.04);
//    var forceY = d3.forceY(height/2).strength(0.03);
//    var forceCollider = d3.forceCollide(51);

//    var simulation = d3.forceSimulation()
//    .force('forceX', forceX)
//    .force('forceY', forceY)
//    .force('forceCol', forceCollider)

//    //Data
//    var APOD = await getData();

//    function drawBubbles(data) {
//        var defs = svg.append('defs');
   
//        defs
//        .selectAll()
//        // .data(data)
//        .append("pattern")
//        .attr('height', '100%')
//        .attr('width', '100%')
//        .attr('patternContentUnits', 'objectBoundingBox')
//        // .append('image')
//        // .attr("width", 10)
//        // .attr('preserveAspectRation', 'none')
//        // .attr('xlink:href', "https://apod.nasa.gov/apod/image/2310/DistortedSunrise_Chasiotis_2442.jpg");
       
//        var circles = svg
//        .selectAll()
//        // .data(data)
//        .enter()
//        .append('circle')
//        .attr('r', ((Math.random() * (24 - 20)) + 20))
//        // .style("fill", `url(#https://apod.nasa.gov/apod/image/2310/DistortedSunrise_Chasiotis_2442.jpg)`);

       

//        function ticked() {
//            circles
//            .attr('cx', d => d.x)
//            .attr('cy', d => d.y)
//        }

//        simulation
//        .nodes(data)
//        .on('tick', ticked)
//    }

//    drawBubbles(APOD)


   // first attempt
//    var APOD = await getData();

//     //Create SVG
//     var width=970,
//     height=550,
//     margin = {top: 10, right: 10, bottom: 30, left: 60};

//     var svg = d3.select("#domain")
//             .append("svg")
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + margin.bottom)
//             .append("g")
//             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//     // Create spheres

//     var numNodes = 25
//     var nodes = d3.range(numNodes).map(function(d) {
//         return {radius: (Math.random() * (24 - 20)) + 20}
//     })

//     var simulation = d3.forceSimulation(nodes)
//         .force('charge', d3.forceManyBody().strength(-1))
//         .force('center', d3.forceCenter(width / 2, height / 2))
//         .force('collision', d3.forceCollide().radius(function(d) {
//             return d.radius
//         }))
//         .alphaDecay(0.1)
//         .on('tick', ticked);

//     function ticked() {
//         var u = d3.select('svg')
//             .selectAll('circle')
//             .data(nodes)
//             .join('circle')
//             .attr('r', function(d) {
//                 return d.radius
//             })
//             .attr('cx', function(d) {
//                 return d.x
//             })
//             .attr('cy', function(d) {
//                 return d.y
//             })
//             .attr("class", "pictureCircle")
//             .style("fill", "steelblue");
        
        
//     }
