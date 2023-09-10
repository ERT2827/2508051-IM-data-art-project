var url = "https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories?api_key=93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ";

var totalSat = 0;

var launchDecade = [];

var activeRatio = [];

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

    file = await res.json()

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
        activeRatio[a + 15].quantity = inactiveQ;
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
            activeRatio[15].activeQuantity += 1;
        }
    }

    activeRatio[15].inactiveQuantity = inactiveQ;




    console.log(totalSat);
    
    graph1();
    graph2();
}


categorize();





//GRAPH 1

function graph1() {      
    var w=700;
    var h=700;

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
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.quantity})])
        .range([ h, 0]);
    svg.append("g")
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




//Graph 2

function graph2() {
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    w = 460 - margin.left - margin.right,
    h = 400 - margin.top - margin.bottom;

    activeRatio.forEach(function (d) {
        d.date = d3.timeParse("%Y")(d.date)
    })

    var data = Object.assign(activeRatio.map(({date, activeQuantity, inactiveQuantity}) => ({date, activeQuantity, inactiveQuantity})))

    var sumstat = d3.nest()
        .key(d => d.year)
        .entries(data);

    var svg = d3.select("#second")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
    	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([0, w]);
    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .call(d3.axisBottom(xScale));

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.quantity})])
        .range([ h, 0]);
    svg.append("g")
        .call(d3.axisLeft(yScale));

    var res = sumstat.map(function(d){ return d.key }) // list of group names
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
      
    d3.select("svg")
        .selectAll(".line")
        .append("g")
        .attr("class", "line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("d", function (d) {
            return d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.spending)).curve(d3.curveCardinal)
                (d.values)
        })
        .attr("fill", "none")
        .attr("stroke", d => color(d.key))
        .attr("stroke-width", 2)
    

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
        .text("life expectancy (years)");
}