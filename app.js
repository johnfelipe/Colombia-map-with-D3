var chart_width     =   800;
var chart_height    =   600;
var centered;

var color = d3.scaleLinear() 
    .domain([1, 20])
    .clamp(true)
    .range(['#fff', '#409A99']);

var projection = d3.geoMercator()
    .scale(12000/ 2 / Math.PI)
    .center([-74, 4.5])
    .translate([chart_width / 2, chart_height / 2]);;

var path = d3.geoPath()
    .projection(projection);

    
// Create SVG
var svg = d3.select("#chart")
    .append("svg")
    .attr("width", chart_width)
    .attr("height", chart_height);

// Add background
svg.append('rect')
  .attr('class', 'background')
  .attr('width', chart_width)
  .attr('height', chart_height)

var g = svg.append('g');
 
var mapLayer = g.append('g')
  .classed('map-layer', true);

//Data

d3.json("colombia-dep.json").then(function(data){
    var features = data.features;

    // Update color scale domain based on data
  color.domain([0, d3.max(features, nameLength)]);

   
  mapLayer.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('fill', fillFn)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .attr('d', path);
})



function mouseover(d){
    // Highlight hovered province
    d3.select(this).style('fill', '#00b2ff');
  
  }

function mouseout(d){
    // Reset province color
    mapLayer.selectAll('path')
      .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
  
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