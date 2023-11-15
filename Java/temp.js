//I transferred all my workings here to clean up the live code,
//please ignore any mistakes here since it isn't actually used anywhere.
//I'm only keeping this for future reference

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

async function createArt(data){
    var rScale = d3.scaleSqrt().domain([19000000, 21000000]).range([55, 70]);


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



//Art piece 2 prototypes

async function createArt() {
    var asteroidData = await getData();
    
    for (let i = 0; i < asteroidData.length; i++) {
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
        .call(d3.axisLeft(y));

    var r = d3.scaleSqrt().domain([1, 100]).range([5, 15]);

// Compute the density contours.
    const contours = d3.contourDensity()
        .x(d => x(d.orbital_data.first_observation_date))
        .y(d => y(d.closeCalls))
        .size([width, height])
        .bandwidth(30)
        .thresholds(30)
        (asteroidData);

    // Append the contours.
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .selectAll()
        .data(contours)
        .join("path")
        .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
        .attr("d", d3.geoPath());

    // Append dots.
    svg.append("g")
        .attr("stroke", "white")
        .selectAll()
        .data(asteroidData)
        .join("circle")
        .attr("cx", d => x(d.orbital_data.first_observation_date))
        .attr("cy", d => y(d.closeCalls))
        .attr("r", d => r((d.estimated_diameter.kilometers.estimated_diameter_max + d.estimated_diameter.kilometers.estimated_diameter_min) / 2));
}


var res = await fetch(" https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ",{
        method:"GET"
        })

    if (res != undefined) {
        file = await res.json();
        console.log(file);

        var usefulFile = file.near_earth_objects;

        console.log(usefulFile);

        return usefulFile;
    }else{
        console.log("Something isn't right here.");
        return null;
    }

    //Mergesort attempt 1

    container = svg.append("g").attr('transform', `translate(${margin.top}, ${margin.left})`)
    .attr("id", "container");

var numLines = names.length;

x = d3.scaleBand()
.range([margin.left, width - margin.right])
.domain(d3.range(numLines));

y = d3.scaleLinear()
.range([height - margin.bottom, margin.top])
.domain([20, 0]);


update = async (allData) => {

    var data = allData[0]
    var dataIDs = allData[1];
    x.domain(dataIDs);
    var rects = d3.select("#container").selectAll(".rects")
        .data(data, d => d.id)
    rects
        .join(
        enter => enter.append("rect")
                .classed('rects', true)
                .attr('x', d => x(d.id))
                .attr('y', d => height - d.absolute_magnitude_h)
                .attr('width', x.bandwidth())
                .attr('height', d => d.absolute_magnitude_h)
                .attr("fill", "steelblue")
                .attr("stroke", "steelblue")
                .attr("stroke-linecap", "round")
                .attr("stroke-opacity", 0.1)
                .style("opacity", d => d.status != "inactive" ? 1 : 0.6),
        update => update.call(e => e.transition()
                .duration(100)
                .delay(0)
                .attr('x', d => x(d.id)) 
                .attr("stroke-opacity", 0.1)
                .style("opacity", d => d.status != "inactive" ? 1 : 0.6)
            )                                      
        )      
}

startAnimation = async() => {
for (var x of animate()){
  var ans = await x.then(d => d);
  console.log(ans + "Blimbo");
  await update(animationStep(ans));
}

}

function* animate() {
for (var i = 0; i < result.length; i++) {
    yield Promises.delay(50,i);
}
}

animationStep = (count) => {
    var resultIds = result[count].data.map(d => d.id);

    var updatedSet = new Set(resultIds);
    var resultLocations = [];

  if(result[count].type == 'conquer'){
        //this part is where the halves are merged together, will update the domain for new bar locations
        freshdata.forEach((d,i) => {
            if(updatedSet.has(d.id)){
              resultLocations.push(i); 
            } 
        })
        resultLocations = resultLocations.sort(function(a, b) {return a - b;});
        //get the old array indices for the updated items and then sort them and update freshdataIds
        for(var i in resultIds){
          var resultId = resultIds[i];
          var newLocation = resultLocations[i];
          freshdataIds[newLocation] = resultId; 
        }

}
  //for the animation
  freshdata.forEach(d => {
      if(updatedSet.has(d.id)){
          d.status = result[count].type;
      }else{
          d.status = "inactive";
      }
  })

  return [freshdata,freshdataIds];
}

sortList = (data) => {
//merge sort function, returns steps for animation

    var animationSteps = [];

    const mergeSort = (d) => {
          //for the animation
          if(d.length){
            var dCopy = JSON.parse(JSON.stringify(d));
            var step = {type: "divide", data:dCopy};
            animationSteps.push(step);
            
          }
          //base case
          if(d.length < 2){
            return d;
          }
          //divide the array in half
          var midPoint = Math.floor(d.length/2);
          var left = d.slice(0,midPoint);
          var right = d.slice(midPoint,d.length);
          //sort left and right sides recursively
          left = mergeSort(left);
          right = mergeSort(right);


          var solution = [];
  
          //merge the sorted halves together
          while(left.length && right.length){
                if(left[0].absolute_magnitude_h < right[0].absolute_magnitude_h){
                  solution.push(left.shift());
                }else{
                  solution.push(right.shift());
                }
              }
          while(left.length){
            solution.push(left.shift());
          }
          while(right.length){
            solution.push(right.shift());
          }
      
          //for visualization
          if(solution.length){
              var sCopy = JSON.parse(JSON.stringify(solution));
                 animationSteps.push({type: "conquer", data: sCopy});
          }
  
          return solution;
  }

  

var mSort = mergeSort(freshdata);
console.log(animationSteps);

return animationSteps;

}

await update([freshdata, freshdataIds])    
await startAnimation();

result = sortList(freshdata);
