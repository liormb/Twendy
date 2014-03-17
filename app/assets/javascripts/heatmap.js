
function heatMap(error, data) { 
  var gridSize = 46;
	var rectMargin = 4;
  var margin = { top: 94, right: 0, bottom: 0, left: 0 };
  var width  = (gridSize + rectMargin) * 12 - rectMargin;
  var height = (gridSize + rectMargin) * 10 - rectMargin + 30;
	var colors = ['rgba(120,120,120,.7)','#e56230','#dc7840','#d38b52','#c0a265','#a8b778','#89ca8c','#77c79f','#61c4b2','#45c1c4','#45a9c4'];
	var intervals = ["now", "2 hr", "4 hr", "6 hr", "10 hr", "12 hr", "14 hr", "16 hr", "18 hr", "20 hr", "22 hr", "24 hr"];

  // building the color scale palete
  var colorScale = d3.scale.quantile()
    .domain([0, 5, d3.max(data, function(d){ return d.rank; })])
    .range(colors);

  // building the chart
  var svg = d3.select(".chart-container")
  	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // build the interval
  var intervalLabels = svg.selectAll(".intervalLabel")
      .data(intervals)
      .enter().append("text")
        .text(function(d) { return d; })
        .attr("x", function(d, i) { return i * (gridSize + rectMargin); })
        .attr("y", height - 6)
        .style("text-anchor", "middle")
        .attr('fill', 'white')
        .attr("transform", "translate(" + gridSize / 2 + ", -6)");

  // building the heat-map rectangles
  var heatMap = svg.selectAll('.trend')
    .data(data).enter()
     .append('rect')
      .attr('x', function(d){ return (d.interval / 2) * (gridSize + rectMargin) - gridSize - rectMargin; })
      .attr('y', function(d){ return d.trend * (gridSize + rectMargin) - gridSize - rectMargin; })
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('class', 'interval bordered')
      .attr('width', gridSize)
      .attr('height', gridSize);

  // filling the rectangles with colors upon their rank
  heatMap.style("fill", function(d) { return colorScale(d.rank); });

  // adding title to every rectangle
  // heatMap.append("title").text(function(d) { return d.rank; });
   
  // building the color legend   
  var legend = svg.selectAll(".legend")
    .data([0].concat(colorScale.quantiles()), function(d) { return d; })
    .enter().append("g")
      .attr("class", "legend");

  legend.append("rect")
    .attr("x", function(d, i) { return (gridSize / 3) * i; })
    .attr("y", -26)
    .attr("width", gridSize / 3)
    .attr("height", gridSize / 3)
    .style("fill", function(d, i) { return (i+1 < colors.length) ? colors[i+1] : 'rgba(0,0,0,0)'; });

  legend.append("text")
    .attr("class", "intervalLabel")
    .text(function(d, i) { return (i < 10) ? "rank " + Math.round(i+1) : "Not Ranked"; })
    .attr("x", function(d, i) { return gridSize * i; })
    .attr("y", height + gridSize);

  var tooltip = d3.select('.heatmap-container')
    .append('span')
    .attr('class', 'trend-tooltip');

  heatMap
    .on("mouseover", function(d){
      tooltip.text(function(){
        return (d.rank) ? "rank " + d.rank : '';
      })
      .style('top', (d3.event.pageY - 110) + 'px')
      .style('left', (d3.event.pageX - 220) + 'px')
      .style('display', function(){
        return (d.rank) ? 'block' : 'none';
      });
    })
    .on('mousemove', function(d){
      tooltip.style('top', (d3.event.pageY - 110) + 'px')
      .style('left', (d3.event.pageX - 200) + 'px');
    })
    .on("mouseout", function(d){
      tooltip.style('display', 'none');
    });
}

function eventHandler() {
	$('#close-heatmap-button').on('click', function(event){
		$('.heatmap-container').fadeOut(300);
	});
}

$(function() {
	eventHandler();
});
