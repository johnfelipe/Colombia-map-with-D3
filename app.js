var chart_width     =   800;
var chart_height    =   600;


var projection = d3.geoMercator()
    .scale(12000/ 2 / Math.PI)
    .center([-74, 4.5])
    .translate([chart_width / 2, chart_height / 2]);;

var path = d3.geoPath()
    .projection(projection);


var color = d3.scaleLinear() 
    .domain([1, 20])
    .range(['#fff', '#409A99']);

    
// Create SVG
var svg             =   d3.select("#chart")
    .append("svg")
    .attr("width", chart_width)
    .attr("height", chart_height);

//Data

d3.json("colombia-dep.json").then(function(data){
    var features = data.features;

    // Update color scale domain based on data
  color.domain([0, d3.max(features, nameLength)]);

   
    svg.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', fillFn)
        .on('mouseover', mouseover)
        .attr('d', path);
})



function mouseover(d){
    // Highlight hovered province
    d3.select(this).style('fill', '#00b2ff');
  
  }


// Get province name
function nameFn(d){
    return d && d.properties ? d.properties.NOMBRE_DPT : null;
  }


 // Get province name length
function nameLength(d){
    var n = nameFn(d);
    return n ? n.length : 0;
  }

  // Get province color
function fillFn(d){
    return color(nameLength(d));
  }