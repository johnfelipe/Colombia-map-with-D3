var chart_width     =   800;
var chart_height    =   600;
var centered;

var color = d3.scaleLinear() 
    .domain([1, 20])
    .clamp(true)
    .range(['white', '#409A99']);

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
  .style('fill', '1135c2')
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
    d3.select(this).style('fill', '#20c997');

  
  }

function mouseout(d){
    // Reset province color
    mapLayer.selectAll('path')
      .style('fill', function(d){return centered && d===centered ? '#20c997' : fillFn(d);});
  
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




  //canvas

  var x = d3.scaleLinear()
  .domain([-1, 1])
  .range([20, 500]);

  var steps = 5
  //Discrete diverging scale
  var color_threshold = d3.scaleThreshold()
    .domain(d3.range(-1 + 2/steps, 1, 2/steps) ) //[-.6, -.2, .2, .6]
    .range(d3.schemeGnBu[steps]); //=> 5 colors in an array

  //Continuous diverging scale
  var color_sequential = d3.scaleSequential(d3.interpolateGnBu)
    .domain([-1, 1]);


  function drawWithCanvas() {
    //Cleanup
    d3.select("#canvasExample").select("canvas").remove();
    // Background canvas for quick drawing of 2k lines
    var canvas = d3.select("#canvasExample").append("canvas")
      .attr("width", 1500)
      .attr("height", 100);
    var ctx = canvas.node().getContext("2d");
    //Translucent svg on top to show the axis
    var svg = d3.select("#canvasExample").append("svg")
      .attr("width", 1500)
      .attr("height", 100)
      .style("position", "absolute")
      .style("top", 0)
      .style("left", 0);

    // Let's add an axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, 50)")
      .call(d3.axisTop(x));

    
    d3.range(-1, 1, 0.0001)
      .forEach(function (d) {
        ctx.beginPath();
        ctx.strokeStyle = color_threshold(d);
        ctx.moveTo(x(d), 50);
        ctx.lineTo(x(d), 70);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = color_sequential(d);
        ctx.moveTo(x(d), 80);
        ctx.lineTo(x(d), 100);
        ctx.stroke();
      });
  } // drawWithCanvas


  // Setup button
  d3.select("#btnCanvas").on("click", function () {

    var t0 = performance.now();
    drawWithCanvas();
    var t1 = performance.now();
    
  } );
 

  