
function drawGlobe(twitterCountries) {
	
	var width = screen.width;
	var height = screen.height - 140;

	var $arrows = $('.rotate-button');
	var scaleFactor = 5;
	var sens = 0.25;
	var autoRotate = true;
	var elipseTime = false;
	var angle = -20;
	var speed = -1e-2;
 	var start = Date.now();
 	var stop = 0;
  var centered;
	var showHeatMap;

	var svg = d3.select(".globe-container")
		.append('svg')
			.attr('width', width)
			.attr('height', height);

	projection = d3.geo.orthographic()
		.scale(width / scaleFactor)
		.translate([width / 2, height / 2])
		.rotate([0, angle * 2])
		.clipAngle(95);

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
		var tooltip = d3.select('.globe-container').append('span').attr('class', 'country-tooltip');

		countries = countries.filter(function(d) {
	    return names.some(function(n) {
	      if (d.id == n.id) return d.name = n.name;
	    });
	  }).sort(function(a, b) {
	    return a.name.localeCompare(b.name);
	  });

		// draw all the globe's countries
		var globe = groupPaths.selectAll('.country')
			.data(countries).enter()
			.append('path')
				.attr('class', function(d) {
					return (twitterCountries.indexOf(d.name) == -1) ? 'country' : 'country twitter-country';
				})
				.attr('d', path);

		// make the globe rotate
		d3.timer(function(){
			if (autoRotate) {
				var rotate = projection.rotate();
	    	projection.rotate([speed * (Date.now() - start) + stop, angle]);
	    	groupPaths.selectAll('path').attr('d', path);
	  	}
		});

		// change globe rotating direction
		$arrows.on('click', function(event){
			if (elipseTime) {	
				start = Date.now();
				elipseTime = false;
			}
			stop = speed * (Date.now() - start) + stop;
			start = Date.now();

			speed = (event.target.id == 'rotate-left') ? -1e-2 : 1e-2;
			if ((angle <= -90 && angle > -270) || (angle >= 90 && angle < 270)) 
				speed = (speed == 1e-2) ? -1e-2 : 1e-2;

			autoRotate = true;
		});

		// events processing
		globe
			.on("mouseover", function(d){
				tooltip.text(d.name)
					.style('top', (d3.event.pageY - 15) + 'px')
	      	.style('left', (d3.event.pageX + 7) + 'px')
	      	.style('display', 'block');

				if (twitterCountries.indexOf(d.name) > -1) {
					groupPaths.selectAll("path")
						.classed('active-country', false);
				}
			})
			.on('mousemove', function(d){
				tooltip.style('top', (d3.event.pageY - 15) + 'px')
				.style('left', (d3.event.pageX + 7) + 'px');
			})
			.on("mouseout", function(d){
				tooltip.style('display', 'none');
			})
			.on('click', function(d){
				// click suppressed for drags events
				if (d3.event.defaultPrevented) return;

				autoRotate = false;
				tooltip.style('display', 'none');
				$arrows.fadeOut(300);
				
		    d3.transition()
		      .duration(function(){
		      	return (d && centered !== d) ? 600 : 0;
		      })
		      .tween("rotate", function() {
		        var p = d3.geo.centroid(d);
		        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
		        stop = -p[0];
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
					    showHeatMap = true;
					  } else {
					    x = width / 2;
					    y = height / 2;
					    k = 1;
					    centered = null;
					    showHeatMap = false;

					    if ($('.heatmap-container').css('display') != "none")
					    	$('.heatmap-container').fadeOut(300);

					    d3.transition()
					      .duration(800)
					      .tween("rotate", function() {
					      	console.log("2st duration");
					        r = d3.interpolate(projection.rotate(), [stop, angle]);
					        return function(t) {
					          projection.rotate(r(t));
					          groupPaths.selectAll('path').attr('d', path);
					        };
					      })
					    	.transition()
					  		.each("end", function(){
		    					start = Date.now();
		    					autoRotate = true;
		    					$arrows.fadeIn(300);
					  		});
					  }

					  groupPaths.selectAll("path")
					    .classed("active-country", centered && function(d) { return d === centered; });

					  groupPaths.transition()
					    .duration(800)
					    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
					    .style("stroke-width", 1.5 / k + "px")
					    .each("end", function(){
					    	if (showHeatMap && twitterCountries.indexOf(d.name) > -1) {
					    		var trends_list = new TrendsList;
									trends_list.fetch(d.name);
					    	} else {
					    		groupPaths.selectAll("path")
					    			.classed("active-country", false);
					    	}
					    });
				  });
			});

		// drag event
		svg.call(d3.behavior.drag()
	    .origin(function() {
	    	var r = projection.rotate();
	    	return { x: r[0] / sens, y: -r[1] / sens };
	    })
	    .on("drag", function() {
	    	autoRotate = false;
	      var rotate = projection.rotate();
	      projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
	      svg.selectAll('path').attr('d', path);
	      angle = -d3.event.y * sens;
	      while (angle >= 360 || angle <= -360){ 
	      	(angle > 0) ? angle -= 360 : angle += 360; 
	      }
	      stop = d3.event.x * sens;
	      elipseTime = true;
	    }));

	} // end of ready function
} // end of drawGlobe function
