var chart_width     =   800;
var chart_height    =   600;


var projection = d3.geoMercator()
    .scale(12000/ 2 / Math.PI)
    .center([-74, 4.5])
    .translate([chart_width / 2, chart_height / 2]);;

var path = d3.geoPath()
    .projection(projection);


// Create SVG
var svg             =   d3.select("#chart")
    .append("svg")
    .attr("width", chart_width)
    .attr("height", chart_height);

//Data

d3.json("colombia-dep.json").then(function(data){
    svg.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', "#116576")
        .on('mouseover', mouseover)
        .attr('d', path);
})



function mouseover(d){
    // Highlight hovered province
    d3.select(this).style('fill', '#00b2ff');
  
  }


