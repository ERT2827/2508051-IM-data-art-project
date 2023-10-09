var url = "https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories?api_key=93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ";

var totalSat = 0;

var launchDecade = [];

var activeRatio = [];

var timeActive = [
    {
        duration: "1-5",
        quantity: 0
    },{
        duration: "6-10",
        quantity: 0
    },
    {
        duration: "11-20",
        quantity: 0
    },{
        duration: "20+",
        quantity: 0
    },
];

var interactiveData = [];

function populateDates(dateArray) {
    var d = 1950;
    
    while (d <= 2020) {
        var datie = {date: d, quantity: 0};
        dateArray.push(datie);
        d += 5;
    }

    var datie = {date: 2023, quantity: 0};
    dateArray.push(datie);
}

function populateActive(r) {
    var d = 1950;

    while (d <= 2020) {
        var datie = {key: "active", date: d, quantity: 0};
        r.push(datie);
        d += 5;
    }

    var datie = {key: "active", date: 2023, quantity: 0};
    r.push(datie);

    d = 1950;
    
    while(d <= 2020){
        datie = {key: "inactive", date: d, quantity: 0};
        r.push(datie);
        d += 5
    }
    
    datie = {key: "inactive", date: 2023, quantity: 0};
    r.push(datie);

    console.log(activeRatio);   

}

populateDates(launchDecade);
populateActive(activeRatio);

async function gainData() {
    var file;

    var res = await fetch("https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories?api_key=93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ",{
        method:"GET",
        headers: {
            "Accept": "application/json;"
        }
    })

    file = await res.json();

    console.log(file);

    return file;

}

async function categorize() {
    var usefulFile = await gainData();

    //active sattelites by half decade
    var usefulItems = usefulFile.Observatory[1];

    var d = 1950;

    while (d <= 2020) {
        for (i = 0; i < usefulItems.length; i++) {
            var ST = usefulItems[i].StartTime[1];
            ST = ST.slice(0,4);
            ST = parseInt(ST);
            if (ST < d) {
                totalSat += 1;
                
                var a = (d - 1950) / 5;
                launchDecade[a].quantity += 1;
                usefulItems.splice(i, 1);
            }
        }
        d += 5;
    }

    for (i = 0; i < usefulItems.length; i++) {
        var ST = usefulItems[i].StartTime[1];
        ST = ST.slice(0,4);
        ST = parseInt(ST);
        if (ST < 2023) {
            totalSat += 1;
            
            launchDecade[15].quantity += 1;
            usefulItems.splice(i, 1);
        }
    }    


    //inactive sattelites by half decade

    usefulFile = await gainData();

    usefulItems = usefulFile.Observatory[1];
    

    d = 1950;

    var inactiveQ = 0;

    while (d <= 2020){
        var a = (d - 1950) / 5;

        for (i = 0; i < usefulItems.length; i++) {
            var ST = usefulItems[i].StartTime[1];
            ST = ST.slice(0,4);
            ST = parseInt(ST);
            
            var ET = usefulItems[i].EndTime[1];
            ET = ET.slice(0, 4);
            ET = parseInt(ET);

            if(ET < d){
                inactiveQ += 1;
                usefulItems.splice(i, 1);
            }else if(ST < d){   
                activeRatio[a].quantity += 1;
            }
        }
        activeRatio[a + 16].quantity = inactiveQ;
        d += 5;
    }

    for (i = 0; i < usefulItems.length; i++) {
        var ST = usefulItems[i].StartTime[1];
        ST = ST.slice(0,4);
        ST = parseInt(ST);
        
        var ET = usefulItems[i].EndTime[1];
        ET = ET.slice(0, 4);
        ET = parseInt(ET);

        if(ET < 2023){
            inactiveQ += 1;
            usefulItems.splice(i, 1);
        }else{   
            activeRatio[15].quantity += 1;
        }
    }

    activeRatio[31].quantity = inactiveQ;

    //Duration
    usefulItems = usefulFile.Observatory[1];


    for (i = 0; i < usefulItems.length; i++) {
        var ST = usefulItems[i].StartTime[1];
        ST = ST.slice(0,4);
        ST = parseInt(ST);
        
        var ET = usefulItems[i].EndTime[1];
        ET = ET.slice(0, 4);
        ET = parseInt(ET);

        if(ET - ST <= 5){
            timeActive[0].quantity += 1
        }else if(ET - ST > 5 && ET - ST <= 10 ){
            timeActive[1].quantity += 1
        }else if(ET - ST > 10 && ET - ST <= 20 ){
            timeActive[2].quantity += 1
        }else{
            timeActive[3].quantity += 1
        }
    }

    console.log(timeActive);



    var liveCount = document.getElementById("liveData");
    liveCount.innerText = totalSat;

    //data for the interactive array

    usefulFile = await gainData();

    usefulItems = usefulFile.Observatory[1];

    var date = new Date();

    var yaar = 2022;

    var stillActive = false;
    
    usefulItems.forEach(e => {
        var dt = e.EndTime[1].slice(0, 4)
        
        if (dt > yaar) {
            stillActive = true;
        }else{
            stillActive = false;
        }

        var buildor = {obsvName: e.Name, startTime: e.StartTime[1].slice(0, 4), endTime: e.EndTime[1].slice(0, 4), active: stillActive}

        interactiveData.push(buildor);
    });

    console.log(interactiveData)

    

    
    graph1();
    graph3();
    graph2();
    graph4();
}


categorize();





//GRAPH 1

function graph1() {      
    var w=700;
    var h=550;

    var margin = {top: 10, right: 10, bottom: 30, left: 60};

    launchDecade.forEach(function (d) {
        d.date = d3.timeParse("%Y")(d.date)
    })

    var data = Object.assign(launchDecade.map(({date, quantity}) => ({date, quantity})), {y: "Quantity"})

    var svg = d3.select("#first")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
    	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([0, w]);
    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .attr("class", "axisBlack")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.quantity})])
        .range([ h, 0]);
    svg.append("g")
        .attr("class", "axisBlack")
        .call(d3.axisLeft(y));

    svg.append("path")
        .datum(launchDecade)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.quantity) })
        )

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", w)
        .attr("y", h - 6)
        .text("Year (in half decades)");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Sattelites launched");
    
}

function graph2() {
    var w=700;
    var h=550;

    var margin = {top: 10, right: 10, bottom: 30, left: 60};

    activeRatio.forEach(function (d) {
            d.date = d3.timeParse("%Y")(d.date)
        })
    
    var data = Object.assign(activeRatio.map(({key, date, quantity}) => ({date, quantity})), {y: "Quantity"})
        
    var activeArr = data.slice(0, data.length / 2);
    

    var inactiveArr = data.slice(data.length / 2, data.length)

    var svg = d3.select("#second")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
    	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([0, w]);
    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .attr("class", "axisBlack")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.quantity})])
        .range([ h, 0]);
    svg.append("g")
        .attr("class", "axisBlack")
        .call(d3.axisLeft(y));

    svg.append("path")
        .datum(activeArr)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.quantity) })
        )

    svg.append("path")
        .datum(inactiveArr)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.quantity) })
        )

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", w)
        .attr("y", h - 6)
        .text("Year (in half decades)");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Active (Blue), Inactive (Red)");
    
}

function graph3(){

    var data = Object.assign(timeActive.map(({duration, quantity}) => ({duration, quantity})), {y: "Quantity"})

    console.log(data);

   // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#third")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d.duration; }))
        .padding(0.2);
    svg.append("g")
        .attr("class", "axisBlack")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


    var y = d3.scaleLinear()
    .domain([0, 40])
    .range([ height, 0]);
    
    svg.append("g")
    .attr("class", "axisBlack")
    .call(d3.axisLeft(y));

    svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.duration); })
    .attr("y", function(d) { return y(d.quantity); })
    .attr("width", x.bandwidth() - 4)
    .attr("height", function(d) { return height - y(d.quantity); })
    .attr("fill", "darkblue")

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Number of years active.");
        

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Quantity");

    svg.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text("Active time of Satellites.");
    
}

function graph4() {
    launchDecade.forEach(function (d) {
        d.startTime = d3.timeParse("%Y")(d.startTime)
        d.endTime = d3.timeParse("%Y")(d.endTime)
    })
    
    var data = Object.assign(interactiveData.map(({obsvName, startTime, endTime, active}) => ({obsvName, startTime, endTime, active})));


    console.log(data);

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 650 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#fourth")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.startTime; }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axisBlack")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.endTime; }))
        .range([height, 0]);
    svg.append("g")
    .attr("class", "axisBlack")
    .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.startTime); } )
    .attr("cy", function (d) { return y(d.endTime); } )
    .attr("r", 3)
    .style('fill', function(d, i) {    
        if (d.active) {
            return "blue";
        } else{
            return "black";
        }})
    .on('mouseover', (event, datum) => showtooltip(datum))
    .on('mousemove', movetooltip)
    .on("mouseout", hidetooltip);


    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Launch Year");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Decommission year");

    //make tooltip'
    var tooltip = 
    d3.select('#fourth')
    .append('div')
    .style('opacity', 0)
    .style("width", "150px")
    .style("height", "200px")
    .style("border-radius", "5px")
    .style("padding", "12px")
    .style("background-color", "#000")
    .style("color", "#FFF")
    .style("position", "relative");

    //hide/show tooltip
    function showtooltip(d) {
    tooltip
        .transition()
        .duration(250)
        .style('opacity', 1)
        .style("left", d3.pointer(event)[0])
        .style("top", d3.pointer(event)[1]);

    var curStatus;

    if(d.active){
        curStatus = "Active";
    }else{
        curStatus = "Inactive";
    }

    tooltip.html('name: ' + d.obsvName + ', status: ' + curStatus);
    console.log('name: ' + d.obsvName + ', status: ' + d.active);
    }

    function movetooltip(){
    tooltip
    .style("left", d3.pointer(event)[0])
    .style("top", d3.pointer(event)[1]);
    }

    function hidetooltip() {
    tooltip.style("opacity", 0);
}
}
