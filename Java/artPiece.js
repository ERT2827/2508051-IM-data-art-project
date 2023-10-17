var key = "93Z3SaQ0E6FBtDpLhnaZUcLhi5vPX2fyGg1zs2MJ";


//Create SVG
    var width=970,
    height=550,
    margin = {top: 10, right: 10, bottom: 30, left: 60};

var svg = d3.select("#domain")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("mouseMove", moveNode);


// Create spheres

var numNodes = 100
var nodes = d3.range(numNodes).map(function(d) {
	return {radius: Math.random() * 25}
})

var simulation = d3.forceSimulation(nodes)
	.force('charge', d3.forceManyBody().strength(-1))
	.force('center', d3.forceCenter(width / 2, height / 2))
	.force('collision', d3.forceCollide().radius(function(d) {
		return d.radius
	}))
    .alphaDecay(0.1)
	.on('tick', ticked);

function ticked() {
	var u = d3.select('svg')
		.selectAll('circle')
		.data(nodes)
		.join('circle')
		.attr('r', function(d) {
			return d.radius
		})
		.attr('cx', function(d) {
			return d.x
		})
		.attr('cy', function(d) {
			return d.y
		})
        .style("fill", "steelblue")
        simulation.start();
}

//nodemover

function moveNode() {
    var m = d3.mouse(this);

    force.nodes()[0].x = m[0];
    force.nodes()[0].y = m[1];
}