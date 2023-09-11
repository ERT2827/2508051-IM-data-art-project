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
        duration: "10-20",
        quantity: 0
    },{
        duration: "20+",
        quantity: 0
    },
];

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
    
    graph1();
    graph3(timeActive);
    graph2();
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

    var width = 600,
    height = 600;
    var margin = { top: 60, right: 160, bottom: 88, left: 105 };


    var svg = d3.select("#second")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    activeRatio.forEach(function (d) {
        d.date = d3.timeParse("%Y")(d.date)
    })

    var data = Object.assign(activeRatio.map(({key, date, quantity}) => ({key, date, quantity})), {y: "Quantity"})

    var render = data => {
        var title = 'Active VS inactive sattelites.';
        
        var xValue = d => d.date;
        var xAxisLabel = 'Data (Year)';
        
        var yValue = d => d.quantity;
        var circleRadius = 6;
        var yAxisLabel = 'Active Satellites (Blue) Inactive Sattelites (Red)';
        
        var colorValue = d => d.city;
        
        var innerWidth = width - margin.left - margin.right;
        var innerHeight = height - margin.top - margin.bottom;

        
        var xScale = d3.scaleTime()
          .domain(d3.extent(data, xValue))
          .range([0, innerWidth])
          .nice();
        
        var yScale = d3.scaleLinear()
          .domain(d3.extent(data, yValue))
          .range([innerHeight, 0])
          .nice();
        
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        
        var g = svg.append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
        
        var xAxis = d3.axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickPadding(15);
        
        var yAxis = d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickPadding(10);
        
        var yAxisG = g.append('g').call(yAxis);
        yAxisG.selectAll('.domain').remove();
        
        yAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', -60)
            .attr('x', -innerHeight / 2)
            .attr('fill', 'black')
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
            .text(yAxisLabel);
        
        var xAxisG = g.append('g').call(xAxis)
          .attr('transform', `translate(0,${innerHeight})`);
        
        xAxisG.select('.domain').remove();
        
        xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 80)
            .attr('x', innerWidth / 2)
            .attr('fill', 'black')
            .text(xAxisLabel);
        
        var lineGenerator = d3.line()
          .x(d => xScale(xValue(d)))
          .y(d => yScale(yValue(d)))
          .curve(d3.curveBasis);
        
        var lastYValue = d =>
          yValue(d.values[d.values.length - 1]);
        
        var nested = d3.nest()
          .key(colorValue)
          .entries(data)
          .sort((a, b) =>
            descending(lastYValue(a), lastYValue(b))
          );
        
        console.log(nested);
        
        colorScale.domain(nested.map(d => d.key));
        
        g.selectAll('.line-path').data(nested)
          .enter().append('path')
            .attr('class', 'line-path')
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => colorScale(d.key));
        
        g.append('text')
            .attr('class', 'title')
            .attr('y', -10)
            .text(title);
        
        svg.append('g')
          .attr('transform', `translate(790,121)`)
          .call(d3.colorLegend, {
            colorScale,
            circleRadius: 13,
            spacing: 30,
            textOffset: 15
          });
      };

    render(data);
      
}

function graph3(){

   // set the dimensions and margins of the graph
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#third")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
    .domain(d3.range(timeActive.length))
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
    

    var y = d3.scaleLinear()
    .domain([0, 40])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    svg.selectAll("mybar")
    .data(timeActive)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return x(i); })
    .attr("y", function(d) { return y(d.quantity); })
    .attr("width", x.bandwidth() - 1)
    .attr("height", function(d) { return height - y(d.quantity); })
    .attr("fill", "#69b3a2")
    
}