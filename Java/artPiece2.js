var Transtime = 500;

var usefulFile = [];

var colCount = 0;

var colors = ["green", "coral", "blueviolet", "darkslategray"]

//Get buttons
var closeBut, magBut;

closeBut = document.getElementById("#closeButton");
magBut = document.getElementById("#magnitudeButton");

//Create SVG
    var height = window.innerHeight * 0.7,
    width = window.innerWidth * 0.5;

    var margin = {top: 10, right: 30, bottom: 45, left: 30};

    //CREATE SVG + outlines
    var svg = d3.select("#domain").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

//Get Data Function

async function getData() {
    var res = await fetch(" https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ",{
        method:"GET"
        })

    if (res != undefined) {
        file = await res.json();
        console.log(file);

        usefulFile = file.near_earth_objects;

        console.log(usefulFile);

        return(usefulFile);
    }else{
        console.log("Something isn't right here.");
        return null;
    }


}

async function createArt() {
    var asteroidData = await getData();
    
    for (var i = 0; i < asteroidData.length; i++) {
        var closecalls = asteroidData[i].close_approach_data.length;
        Object.assign(asteroidData[i], {closeCalls : closecalls});

        var tempdate = new Date(asteroidData[i].orbital_data.first_observation_date);
        asteroidData[i].orbital_data.first_observation_date = tempdate;
    }

    console.log(asteroidData);
    
    
    // Create the horizontal and vertical scales.

    var x = d3.scaleTime()
        .domain(d3.extent(asteroidData, function(d) { return d.orbital_data.first_observation_date; }))
        .range([margin.left, width - margin.right]);
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("class", "axisBlack")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([0, (d3.max(asteroidData, function(d) { return d.closeCalls}) + 10)])
        .range([ height - margin.bottom, 0]);
    svg.append("g")
        .attr("transform", "translate(" + (margin.left) + ", 0)")
        .attr("class", "axisBlack")
        .attr("id", "yAxis")
        .call(d3.axisLeft(y));

    var r = d3.scaleSqrt().domain([1, 100]).range([5, 15]);

    //colorscale

    var colorScale = d3.scaleOrdinal(d3.schemePastel1);


// Compute the density contours.
    var contours = d3.contourDensity()
        .x(d => x(d.orbital_data.first_observation_date))
        .y(d => y(d.closeCalls))
        .size([width, height])
        .bandwidth(30)
        .thresholds(30)
        (asteroidData);

    // Append the contours.
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .selectAll()
        .data(contours)
        .join("path")
        .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
        .attr("d", d3.geoPath())
        .attr("id", "conts")
        .style("stroke", generateColor());

    // Append dots.
    svg.append("g")
        .attr("stroke", "black")
        .selectAll()
        .data(asteroidData)
        .join("circle")
        .attr("cx", d => x(d.orbital_data.first_observation_date))
        .attr("cy", d => y(d.closeCalls))
        .attr("r", d => r((d.estimated_diameter.kilometers.estimated_diameter_max + d.estimated_diameter.kilometers.estimated_diameter_min) / 2))
        .style('fill', function(d, i) {    
            if (d.is_potentially_hazardous_asteroid) {
                return "red";
            } else{
                return "blue";
            }})
        .on('mouseover', (event, datum) => showInfo(datum))
        // .on("mouseout", hideInfo());

        function showInfo(d) {
            document.getElementById("name").textContent = "Name: " + d.name;
            document.getElementById("id").textContent = "ID: " + d.id;
            document.getElementById("date").textContent = d.orbital_data.first_observation_date;
            document.getElementById("date").datetime = d.orbital_data.first_observation_date;
            document.getElementById("magnitude").textContent = "Absolute Magnitude: " + d.absolute_magnitude_h;
            document.getElementById("radius").textContent = "Radius (KM, estimated): " + ((d.estimated_diameter.kilometers.estimated_diameter_max + d.estimated_diameter.kilometers.estimated_diameter_min) / 2);
            document.getElementById("calls").textContent = "Close Calls: " + d.closeCalls;
        }

        // function hideInfo() {
        //     document.getElementById("name").textContent = "Name: " + d.name;
        //     document.getElementById("id").textContent = "ID: " + d.id;
        //     document.getElementById("date").textContent = "First Observed: ";
        //     document.getElementById("date").datetime = "";
        //     document.getElementById("magnitude").textContent = "Absolute Magnitude: " + d.id;
        //     document.getElementById("radius").textContent = "Radius (KM, estimated): " + ((d.estimated_diameter.kilometers.estimated_diameter_max + d.estimated_diameter.kilometers.estimated_diameter_min) / 2);

        // }


        magBut.addEventListener("click", changeParam("mag"));
        closeBut.addEventListener("click", changeParam("closeCalls"));

}

function changeParam(selection) {
    var x = d3.scaleTime()
        .domain(d3.extent(usefulFile, function(d) { return d.orbital_data.first_observation_date; }))
        .range([margin.left, width - margin.right]);
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("class", "axisBlack")
        .call(d3.axisBottom(x));
    
    var r = d3.scaleSqrt().domain([1, 100]).range([5, 15]);

    
    console.log(selection + " is selected");
    if (selection == "closeCalls") {
        var y = d3.scaleLinear()
        .domain([0, (d3.max(usefulFile, function(d) { return d.closeCalls}) + 5)])
        .range([ height - margin.bottom, 0]);
        svg.select("#yAxis")
        .transition()
        .duration(Transtime)
        .call(d3.axisLeft(y));

        //Contour stuff
        var paths = d3.selectAll("#conts");

        var contours = d3.contourDensity()
        .x(d => x(d.orbital_data.first_observation_date))
        .y(d => y(d.closeCalls))
        .size([width, height])
        .bandwidth(30)
        .thresholds(30)
        (usefulFile);

        paths
        .data(contours)
        .transition()
        .delay(function(d,i){return(i*3)})
        .duration(Transtime)
        .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
        .attr("d", d3.geoPath())
        .style("stroke", generateColor());;
        
        svg.selectAll("circle")
        .data(usefulFile)
        .transition()
        .duration(Transtime)
        .attr("cx", d => x(d.orbital_data.first_observation_date))
        .attr("cy", d => y(d.closeCalls))
        .attr("r", d => r((d.estimated_diameter.kilometers.estimated_diameter_max + d.estimated_diameter.kilometers.estimated_diameter_min) / 2));
    }else{
        var y = d3.scaleLinear()
        .domain([0, (d3.max(usefulFile, function(d) { return d.absolute_magnitude_h}) + 5)])
        .range([ height - margin.bottom, 0]);
        svg.select("#yAxis")
        .transition()
        .duration(Transtime)
        .call(d3.axisLeft(y));
        

        //Contour stuff
        var paths = d3.selectAll("#conts");

        var contours = d3.contourDensity()
        .x(d => x(d.orbital_data.first_observation_date))
        .y(d => y(d.absolute_magnitude_h))
        .size([width, height])
        .bandwidth(30)
        .thresholds(30)
        (usefulFile);

        paths
        .data(contours)
        .transition()
        .delay(function(d,i){return(i*3)})
        .duration(Transtime)
        .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
        .attr("d", d3.geoPath())
        .style("stroke", generateColor());;
        
        svg.selectAll("circle")
        .data(usefulFile)
        .transition()
        .delay(function(d,i){return(i*3)})
        .duration(Transtime)
        .attr("cx", d => x(d.orbital_data.first_observation_date))
        .attr("cy", d => y(d.absolute_magnitude_h))
        .attr("r", d => r((d.estimated_diameter.kilometers.estimated_diameter_max + d.estimated_diameter.kilometers.estimated_diameter_min) / 2));
    }
    

}

function generateColor() {
    var randVal = Math.floor(Math.random() * 4)

    return colors[randVal];
}

createArt();



