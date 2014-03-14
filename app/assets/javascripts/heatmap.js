
function heatMap(error, data) { 
	var rectMargin = 3;
  var margin = { top: 0, right: 0, bottom: 0, left: 0 };
  var width = Math.floor((screen.width-50) * 0.8) - margin.left - margin.right;
  var height = Math.floor((screen.height-150) * 0.8) - margin.top - margin.bottom;
  var buckets = 10;
	var colors = ['rgba(40,40,40,.4)','rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)','rgb(217,217,217)','rgb(188,128,189)'];
	var intervals = ["Now", "-2 hours", "-4 hr", "-6 hr", "-10 hr", "-12 hr", "-14 hr", "-16 hr", "-18 hr", "-20 hr", "-22 hr", "-24 hr"];
  var trends = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10"];
  var gridSize = 50;//Math.floor(width / intervals.length),
  var legendElementWidth = gridSize;

  // building the color scale palete
  var colorScale = d3.scale.quantile()
    .domain([0, 5, d3.max(data, function(d) { return d.rank; })])
    .range(colors);

  // building the chart
  var svg = d3.select(".chart-container")
  	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // build the trends
  // var timeLabels = svg.selectAll(".trendLabel")
  //     .data(trends)
  //     .enter().append("text")
  //       .text(function (d) { return d; })
  //       .attr("x", 0)
  //       .attr("y", function (d, i) { return i * gridSize; })
  //       .style("text-anchor", "end")
  //       .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
  //       .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "trendLabel mono axis axis-worktime" : "trendLabel mono axis"); });

  // build the interval
  // var dayLabels = svg.selectAll(".intervalLabel")
  //     .data(intervals)
  //     .enter().append("text")
  //       .text(function(d) { return d; })
  //       .attr("x", function(d, i) { return i * gridSize; })
  //       .attr("y", 0)
  //       .style("text-anchor", "middle")
  //       .attr("transform", "translate(" + gridSize / 2 + ", -6)")
  //       .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "intervalLabel mono axis axis-workweek" : "intervalLabel mono axis"); });

  // building the heat-map rectangles
  var heatMap = svg.selectAll('.trend')
    .data(data).enter()
     .append('rect')
      .attr('x', function(d){ return (d.interval / 2) * (gridSize + rectMargin) - gridSize - rectMargin; })
      .attr('y', function(d){ return d.trend * (gridSize + rectMargin) - gridSize - rectMargin; })
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('class', 'interval bordered')
      .attr('width', gridSize)
      .attr('height', gridSize);

  // fiiling the rectangles with colors upon their rank
  heatMap.style("fill", function(d) { return colorScale(d.rank); });

  // adding title to every rectangle
  heatMap.append("title").text(function(d) { return d.rank; });
   
  // building the color legend   
  // var legend = svg.selectAll(".legend")
  //     .data([0].concat(colorScale.quantiles()), function(d) { return d; })
  //     .enter().append("g")
  //     .attr("class", "legend");

  // legend.append("rect")
  //   .attr("x", function(d, i) { return legendElementWidth * i; })
  //   .attr("y", height)
  //   .attr("width", legendElementWidth)
  //   .attr("height", gridSize / 2)
  //   .style("fill", function(d, i) { return colors[i]; });

  // legend.append("text")
  //   .attr("class", "mono")
  //   .text(function(d, i) { return (i < 10) ? "rank " + Math.round(i+1) : "Not Ranked"; })
  //   .attr("x", function(d, i) { return legendElementWidth * i; })
  //   .attr("y", height + gridSize);
}

function eventHandler() {
	$('#close-heatmap-button').on('click', function(event){
		$('.heatmap-container').fadeOut(300);
	});
}

$(function() {
	eventHandler();
});
