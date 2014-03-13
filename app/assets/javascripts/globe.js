
function drawGlobe(twitter_countries) {

	var width = screen.width;
	var height = screen.height - 100;

	var scale_factor = 5;
	var sens = 0.25;
	var centered;

	var svg = d3.select(".globe-container")
		.append('svg')
			.attr('width', width)
			.attr('height', height);

	var projection = d3.geo.orthographic()
		.scale(width / scale_factor)
		.translate([width / 2, height / 2])
		.rotate([0, -25, 0])
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
		.defer(d3.tsv, "world-country-names.tsv")
		.await(ready);

	function ready(error, world, names) {
		var countries = topojson.feature(world, world.objects.countries).features;

		countries = countries.filter(function(d) {
	    return names.some(function(n) {
	      if (d.id == n.id) return d.name = n.name;
	    });
	  }).sort(function(a, b) {
	    return a.name.localeCompare(b.name);
	  });

	  test1 = countries;
	  test2 = names;
	  test3 = twitter_countries;

		// draw all the globe's countries
		var globe = groupPaths.selectAll('.country')
			.data(countries)
			.enter()
				.append('path')
				.attr('class', function(d) {
					return (twitter_countries.indexOf(d.name) == -1) ? 'country' : 'country twitter-country';
				})
				.attr('d', path)
				.on("click", clicked);

		globe.append('title')
			.text(function(d) { return d.name; });

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
	} // end of ready function
} // end of drawGlobe function
