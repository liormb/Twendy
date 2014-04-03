
function drawGlobe(twitterCountries) {


	var width = screen.width;
	var height = screen.height - 140;
	var scaleFactor = 5;
	var zoomOutSens = 0.2;
	var zoomInSens = 0.06;
	var sens = zoomOutSens;
	var autoRotate = true;
	var angle = -40;
	var speed = -1e-2;
 	var start = Date.now();
 	var stop = 0;
 	var restartTime;
  var centered;
  var lastCountry;
	var showHeatMap;
	var $arrows = $('button.rotate-button');
	var $topArrow = $('.top-helper-arrow');
	var $bottomArrow = $('.bottom-helper-arrow');

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
					var className = 'country ' + d.name.replace(/\s+/g, '-');
					return (twitterCountries.indexOf(d.name) > -1) ? className + ' twitter-country' : className;
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
			if (restartTime) start = Date.now();
			stop = speed * (Date.now() - start) + stop;
			start = Date.now();
			speed = (event.target.id == 'rotate-left') ? 1e-2 : -1e-2;
			if (angle <= -180 && angle > -360) speed = (event.target.id == 'rotate-left') ? -1e-2 : 1e-2;
			autoRotate = true;
			restartTime = false;
		}).hover(
			function(){
				$topArrow.removeClass().addClass('top-helper-arrow');
				$bottomArrow.removeClass().addClass('bottom-helper-arrow');

				if (event.target.id == 'rotate-left') {
					$topArrow.addClass('top-arrow-left');
					$bottomArrow.addClass('bottom-arrow-right');
				} else {
					$topArrow.addClass('top-arrow-right');
					$bottomArrow.addClass('bottom-arrow-left');
				}

				$('.top-helper-arrow, .bottom-helper-arrow').stop(true).animate({opacity: 1}, 1500, function(){
					$(this).stop(true).animate({opacity: 0}, 500);
				});
			},
			function(){
				$('.top-helper-arrow, .bottom-helper-arrow').stop(true).animate({opacity: 0}, 500, function(){
					$topArrow.removeClass().addClass('top-helper-arrow');
					$bottomArrow.removeClass().addClass('bottom-helper-arrow');
				});
			}
		);

		// events processing
		globe
			.on("mouseover", function(d){
				tooltip.text(d.name)
					.style('top', (d3.event.pageY - 15) + 'px')
	      	.style('left', (d3.event.pageX + 7) + 'px')
	      	.style('display', 'block');
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

				if (lastCountry) lastCountry.classList.remove('selected-country');
				this.classList.add('selected-country');
				lastCountry = this;

				currentCountry = d.name;
				sens = zoomInSens;
				autoRotate = false;
				tooltip.style('display','none');
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
					        r = d3.interpolate(projection.rotate(), [stop, angle]);
					        return function(t) {
					          projection.rotate(r(t));
					          groupPaths.selectAll('path').attr('d', path);
					        };
					      })
					    	.transition()
					  		.each("end", function(){
					  			restartTime = false;
					  			sens = zoomOutSens;
		    					start = Date.now();
		    					autoRotate = true;
		    					lastCountry.classList.remove('selected-country');
		    					$arrows.fadeIn(300);
					  		});
					  };

					  groupPaths.transition()
					    .duration(800)
					    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
					    .style("stroke-width", 1.5 / k + "px")
					    .each("end", function(){
					    	if (showHeatMap && twitterCountries.indexOf(d.name) > -1) {
					    		var trends_list = new TrendsList;
									trends_list.fetch(d.name, heatMapState);
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
	      restartTime = true;
	    }));

	} // end of ready function
} // end of drawGlobe function
