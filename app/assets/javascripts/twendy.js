
function drawGlobe() {

	var width = 660;
	var height = 660;

	var sens = 0.25;
	var centered;

	var svg = d3.select(".globe-container")
		.append('svg')
			.attr('width', width)
			.attr('height', height);

	var projection = d3.geo.orthographic()
		.scale(width / 2.3)
		.translate([width / 2, height / 2])
		.rotate([0, -10, 0])
		.clipAngle(90);

	var graticule = d3.geo.graticule();

	var path = d3.geo.path()
		.projection(projection);

	var groupPaths = svg.append('g')
	  .attr('class', 'all-path');

	// draw a circle for the globe
	groupPaths.append('path')
		.datum({type:'Sphere'})
			.attr('class', 'sphere')
			.attr('d', path);

	// draw the globe graticule lines
	groupPaths.append('path')
		.datum(graticule)
			.attr('class', 'graticule')
			.attr('d', path);

	queue()
		.defer(d3.json, "world-110m.json")
		.await(ready);

	function ready(error, world) {
		var countries = topojson.feature(world, world.objects.countries).features;

		// draw all the globe's countries
		groupPaths.selectAll('.country')
			.data(countries)
			.enter()
				.append('path')
				.attr('class', 'country')
				.attr('d', path)
				.on("click", clicked);

		function clicked(d) {
			if (d3.event.defaultPrevented) return; // click suppressed

	    d3.transition()
	      .duration(300)
	      .tween("rotate", function() {
	        var p = d3.geo.centroid(d),
	            r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
	        return function(t) {
	          projection.rotate(r(t));
	          svg.selectAll('path').attr('d', path);
	        };
	      })
	    	.transition()
	  		.each("end", function(){
	  			var x, y, k;
				  if (d && centered !== d) {
				    var centroid = path.centroid(d);
				    x = centroid[0];
				    y = centroid[1];
				    k = 3;
				    centered = d;
				  } else {
				    x = width / 2;
				    y = height / 2;
				    k = 1;
				    centered = null;
				  }
				  groupPaths.selectAll("path")
				    .classed("active", centered && function(d) { return d === centered; });

				  groupPaths.transition()
				    .duration(800)
				    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
				    .style("stroke-width", 1.5 / k + "px");
			  });
		} // end of clicked function

		svg.call(d3.behavior.drag()
	    .origin(function() {
	    	var r = projection.rotate();
	    	return { x: r[0] / sens, y: -r[1] / sens };
	    })
	    .on("drag", function() {
	      var rotate = projection.rotate();
	      projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
	      svg.selectAll('path').attr('d', path);
	    }));
	}
}

$(function() {
	drawGlobe();
});
