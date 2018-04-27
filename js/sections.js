/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.

  var width = 600;
  var height = 520;
  var margin = { top: 0, left: 100, bottom: 40, right: 10 };

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // Sizing for the grid visualization
  var squareSize = 10;
  var squarePad = 2;
  var numPerRow = width / (squareSize + squarePad);

  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

  // We will set the domain when the
  // data is processed.
  // @v4 using new scale names
  var xBarScale = d3.scaleLinear()
    .range([0, width]);

  // The bar chart display is horizontal
  // so we can use an ordinal scale
  // to get width and y locations.
  // @v4 using new scale type
  var yBarScale = d3.scaleBand()
    .paddingInner(0.08)
    .domain([0, 1, 2])
    .range([0, height - 50], 0.1, 0.1);

  // Color is determined just by the index of the bars
  var barColors = { 0: '#008080', 1: '#399785', 2: '#5AAF8C' };

  // You could probably get fancy and
  // use just one axis, modifying the
  // scale, but I will use two separate
  // ones to keep things easy.
  // @v4 using new axis name
  var xAxisBar = d3.axisBottom()
    .scale(xBarScale)
    .ticks(10);

  //AXES AND SCALES FOR FIRST HPD CHART

  var xLineScale = d3.scaleTime().rangeRound([0, width]);
  var yLineScale = d3.scaleLinear().rangeRound([height, 0]);
  var xAxisLine = d3.axisBottom().scale(xLineScale)
  var yAxisLine = d3.axisLeft().scale(yLineScale)


  //AXES AND SCALES FOR HPD BAR CHART

  var xHPDBarScale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.05)
    .align(0.1);

  var xHPDAxis = d3.axisBottom(xHPDBarScale)
  .tickFormat(d3.timeFormat("%Y"));

  var yHPDBarScale = d3.scaleLinear()
    .rangeRound([height, 0]);

  var zHPDBarScale = d3.scaleOrdinal()
    .range(["red"]);

  var activateFunctions = [];

  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    selection.each(function (rawData) {

      //Some small processing with the other datasets

      otherData.forEach(function (d) {

        //This is where I parse the "otherData"
        var parseTime = d3.timeParse("%Y-%m-%d");
        d.receiveddate = parseTime(d.receiveddate);
        return d;
      });

      otherData2.forEach(function (d) {

        var parseTime = d3.timeParse("%Y-%m-%d");
        d.date = parseTime(d.date);
        d.A = +d.A;
        d.B = +d.B;
        d.C = +d.C;
        d.total = +(d.A+d.B+d.C);
        return d;

      });

      otherData3.forEach(function (d) {

        var parseTime = d3.timeParse("%Y-%m-%d");
        d.date = parseTime(d.date);
        d.Lead = +d.Lead;
        d.Mold = +d.Mold;
        d.Gas = +d.Gas;
        d.Heat = +d.Heat;
        d.Pests = +d.Pests;
        return d;

      });


      //Here's the various data.
      hpdData = otherData;
      hpdClass = otherData2;
      hpdCategorical = otherData3;

      // HPD Line Chart

      xLineScale.domain(d3.extent(hpdData, function(d) { return d.receiveddate; }));

      //HPD BAR CHART

      xHPDBarScale.domain(hpdCategorical.map(function(d) { return d.date; }));
      yHPDBarScale.domain([0, d3.max(hpdCategorical, function(d) {return (d.Lead + d.Mold + d.Gas + d.Heat + d.Pests)})]).nice();
      zHPDBarScale.domain(hpdCategorical.columns.slice(1));

      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([wordData]);
      var svgE = svg.enter().append('svg');
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);

      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', height + margin.top + margin.bottom);

      svg.append('g');


      //Put the map in a different div. different svg! an external svg! omg!

      d3.xml("myharlemmap.svg").mimeType("image/svg+xml").get(function(error, documentFragment) {
      if (error) {console.log(error); return;}

      var svgNode = documentFragment.getElementsByTagName("svg")[0];

      document.querySelector('.container1').appendChild(svgNode);
      
      var innerSVG = d3.select('.container1').selectAll('svg');
      console.log(innerSVG);

      innerSVG.append('text')
      .attr('y', height)
      .attr('x', width/2)
      .transition()
      .delay(1000)
      .duration(1200)
      .attr('class', 'title openvis-title highlight')
      .attr('x', width/2)
      .attr('y', height/2 )
      .text('Life')
      .attr('opacity', .75);

    innerSVG.append('text')
      .attr('y', height)
      .attr('x', width/2)
      .transition()
      .delay(1000)
      .duration(2200)
      .attr('class', 'title openvis-title highlight')
      .attr('x', width/2)
      .attr('y', 330)
      .text('Under')
      .attr('opacity', .75);

   innerSVG.append('text')
      .attr('y', height)
      .attr('x', width/2)
      .transition()
      .delay(1000)
      .duration(4000)
      .attr('class', 'title openvis-title highlight')
      .attr('x', 500)
      .attr('y', 420)
      .text('Lease')
      .attr('opacity', .75);

    d3.csv("data/outputforjack.csv", function(data) {
    var descr_data=data;

    innerSVG.selectAll('.building_polygon')
      .datum(descr_data)
      .on("mouseover", function(data){
        innerSVG.selectAll('.complaint-text')
                .transition()
                .delay(2000)
                .attr('opacity', 0);
        innerSVG.selectAll('.complaint-circle')
                .transition()
                .delay(2000)
                .attr('opacity',0);

            descr=descr_data[this.id]['description']
            words=descr.split(" ");
            x=this.getBBox().x;
            y=this.getBBox().y;
            r=Math.log(descr.length)*Math.log(descr.length)*1.5

            var getRandomWord = function () {
              index = Math.floor(Math.random() * words.length)
              return words[index];
            };
            console.log("x and y", x, y)
            d3.select(this)
              .style('fill', 'white');
            innerSVG.append('circle')
              .classed('complaint-circle', true)
              .attr('cy', y)
              .attr('cx', x)
              .attr('r', 1)
              .attr('fill', 'white')
              .attr('z-index', 1000)
              .attr('cx', function() {if (x < 100) { return x+40;} else { return x-40;}})
              .attr('opacity',.75)
              .transition()
              .duration(2000)
              .attr('cy', function() {if (y<height/2) {return y+y/2;} else { return y-y/2;}})
              .attr('r', r);
            console.log("DATA FROM:", descr);

            innerSVG.append('text')
              .classed('complaint-text', true)
              .attr('y', y)
              .attr('x', x)
              .attr('font-size', 15)
              .attr('color', 'red')
              .attr('text-anchor', 'middle')
              .transition()
              .duration(2000)
              .attr('y', function() {if (y<height/2) {return y+y/2;} else { return y-y/2;}})
              .attr('x', function() {if (x < 100) { return x+40;} else { return x-40;}})
              .text("..."+getRandomWord()+"...")
            })
            .on("mouseout", function() {
              d3.select(this).style('fill', "#ef233c");
            });
            });


      });

      // this group element will be used to contain all
      // other elements.
      g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // perform some preprocessing on raw data
      var wordData = getWords(rawData);

      // in my line chart, the x axis is time

      // filter to just include filler words
      var fillerWords = getFillerWords(wordData);

      // get the counts of filler words for the
      // bar chart display
      var fillerCounts = groupByWord(fillerWords);
      // set the bar scale's domain
      var countMax = d3.max(fillerCounts, function (d) { return d.value;});
      xBarScale.domain([0, countMax]);


      setupVis(wordData, fillerCounts, hpdData, hpdClass, hpdCategorical);

      setupSections();
    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param wordData - data object for each word.
   * @param hpdData - data object for hpd_harlem
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  var setupVis = function (wordData, fillerCounts, hpdData, hpdClass, hpdCategorical) {

  //axes
  //********************************************************************************

//titles
//********************************************************************************


          // count filler word count title
    g.append('text')
      .attr('class', 'title count-title highlight')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5))
      .text('49 Buildings');

    g.append('text')
      .attr('class', 'sub-title count-title')
      .attr('x', width / 2)
      .attr('y', (height / 4.7) + (2 * height / 5))
      .text('in East Harlem');

    g.selectAll('.count-title')
      .attr('opacity', 0);

//portfolio squares
//********************************************************************************
    var squares = g.selectAll('.square')
                    .data(wordData, function (d) { return d.word; });
    var squaresE = squares.enter()
      .append('rect')
      .classed('square', true);

    squares = squares.merge(squaresE)
      .attr('width', squareSize)
      .attr('height', squareSize)
      .attr('fill', '#fff')
      .classed('fill-square', function (d) { return d.filler; })
      .attr('x', function (d) { return d.x;})
      .attr('y', function (d) { return d.y;})
      .attr('opacity', 0);

//Total Harlem/EE Lines
//********************************************************************************
    var x = d3.scaleTime().rangeRound([0, width]);
    var y = d3.scaleLinear().rangeRound([height, 0]);



    var maxY = d3.max(hpdData, function(d) { return +(d.East_Harlem_Count*3078);} );
    x.domain(d3.extent(hpdData, function(d) { return d.receiveddate; }));
    y.domain([0, maxY]);

    lineEE = d3.line()
            .x(function (d){ return x(d.receiveddate);})
            .y(function (d) { return y((+d.Emerald_Equity_Count)*49);});

    lineHarlem = d3.line()
              .x(function (d) { return x(d.receiveddate);})
              .y(function (d) { return y((+d.East_Harlem_Count)*3078);});


//the Per unit lines
//********************************************************************************
    var xPU = d3.scaleTime().rangeRound([0, width]);
    var yPU = d3.scaleLinear().rangeRound([height, 0]);

    var maxYPU = d3.max(hpdData, function(d) { return +(d.Emerald_Equity_Count);} );

    xPU.domain(d3.extent(hpdData, function(d) { return d.receiveddate; }));
    yPU.domain([0, maxYPU]);


    line1 = d3.line()
            .x(function (d){ return xPU(d.receiveddate);})
            .y(function (d) { return yPU(d.Emerald_Equity_Count);});

    line2 = d3.line()
              .x(function (d) { return xPU(d.receiveddate);})
              .y(function (d) { return yPU(d.East_Harlem_Count);});

//the hpd categorial stacked bar chart
//********************************************************************************
    var hpdX = d3.scaleTime().rangeRound([0, width]);
    var hpdY = d3.scaleLinear().rangeRound([height, height/2]);

    hpdYmax= d3.max(hpdClass, function(d) { return (d.total)/3;});
    hpdX.domain(d3.extent(hpdClass, function(d) { return d.date; }));
    hpdY.domain([0, hpdYmax]);

    lineHPDA = d3.line()
      .x(function (d){return hpdX(d.date); })
      .y(function (d){return hpdY(d.A); })

    lineHPDB = d3.line()
      .x(function (d){return hpdX(d.date); })
      .y(function (d){return hpdY(d.B); })

    lineHPDC = d3.line()
      .x(function (d){return hpdX(d.date); })
      .y(function (d){return hpdY(d.C); })

//Time to start putting things on the actual page. but transparently
//********************************************************************************

    g.append('path')
      .classed('line-chart1', true)
      .datum(hpdData)
      .attr("fill", "none")
      .attr('stroke', 'red')
      .attr('stroke-linejoin', "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineEE)
      .attr('opacity', 0);

    g.append("path")
      .classed('line-chart2', true)
      .datum(hpdData)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr('d', lineHarlem)
      .attr('opacity', 0);

//hpd violation classes
//********************************************************************************


  g.append("path")
      .classed('class-line-chart-A', true)
      .datum(hpdClass)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", .75)
      .attr('d', lineHPDA)
      .attr('opacity', 0);

  g.append("path")
      .classed('class-line-chart-B', true)
      .datum(hpdClass)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", .5)
      .attr('d', lineHPDB)
      .attr('opacity', 0);

  g.append("path")
      .classed('class-line-chart-C', true)
      .datum(hpdClass)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", .75)
      .attr('d', lineHPDC)
      .attr('opacity', 0);


//*********************************************************************************************
  g.selectAll(".hpd-bar-lead")
    .data(hpdCategorical)
  .enter().append("rect")
    .classed("hpd-bar-lead hpd-bar", true)
    .attr("fill", "red")
    .attr("width", xHPDBarScale.bandwidth())
    .attr("x", function(d) {return xHPDBarScale(d.date);})
    .attr("y", function(d) {return yHPDBarScale(d.Lead)- 3*height/4;})
    .attr("height", function(d) {return +(height- yHPDBarScale(d.Lead));})
    .attr('opacity', 0);

g.selectAll(".hpd-bar-mold")
    .data(hpdCategorical)
  .enter().append("rect")
    .classed("hpd-bar-mold hpd-bar", true)
    .attr("fill", "grey")
    .attr("width", xHPDBarScale.bandwidth())
    .attr("x", function(d) {return xHPDBarScale(d.date);})
    .attr("y", function(d) {return yHPDBarScale(d.Mold) - 2*height/4})
    .attr("height", function(d) {return +(height - yHPDBarScale(d.Mold));})
    .attr('opacity', 0);

g.selectAll(".hpd-bar-gas hpd-bar")
    .data(hpdCategorical)
  .enter().append("rect")
    .classed("hpd-bar-gas hpd-bar", true)
    .attr("fill", "white")
    .attr("width", xHPDBarScale.bandwidth())
    .attr("x", function(d) {return xHPDBarScale(d.date);})
    .attr("y", function(d) {return yHPDBarScale(d.Gas) - height/4;})
    .attr("height", function(d) {return +(height - yHPDBarScale(d.Gas));})
    .attr('opacity', 0);

g.selectAll(".hpd-bar-heat")
    .data(hpdCategorical)
  .enter().append("rect")
    .classed("hpd-bar-heat hpd-bar", true)
    .attr("fill", "black")
    .attr("width", xHPDBarScale.bandwidth())
    .attr("x", function(d) {return xHPDBarScale(d.date);})
    .attr("y", function(d) {return yHPDBarScale(d.Heat)})
    .attr("height", function(d) {return +(height - yHPDBarScale(d.Heat));})
    .attr('opacity', 0);



};

//These are all the sections
//********************************************************************************
  var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showFillerTitle;
    activateFunctions[2] = showHighlightGrid;
    activateFunctions[3] = showTotalLine;
    activateFunctions[4] = showPerUnitLine;
    activateFunctions[5] = showHPDClassA;
    activateFunctions[6] = showHPDClassB;
    activateFunctions[7] = showHPDClassC;
    activateFunctions[8] = showHPDBar;

  };

//Functions to manage the transitions
//Hide elements from before and after
//********************************************************************************
  function showTitle() {
    hidexAxis();
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.openvis-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  }


  function showFillerTitle() {
    hidexAxis();
    g.selectAll('.openvis-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.count-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  }

  /**
   * showGrid - square grid
   *
   * hides: filler count title
   * hides: filler highlight in grid
   * shows: square grid
   *
   */
  function showHighlightGrid() {
    hidexAxis();
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.square')
      .transition()
      .duration(600)
      .delay(function (d) {
        return 5 * d.row;
      })
      .attr('opacity', 1.0)
      .attr('fill', '#ddd');

    g.selectAll('.bar')
      .transition()
      .duration(1500)
      .attr('width', 0);

    g.selectAll('.bar-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.line-chart')
      .transition()
      .duration(0)
      .style('opacity',0);


    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 1.0)
      .attr('fill', '#ddd');

    // use named transition to ensure
    // move happens even if other
    // transitions are interrupted.
    g.selectAll('.fill-square')
      .transition('move-fills')
      .duration(1000)
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y;
      });

    g.selectAll('.fill-square')
      .transition()
      .duration(1000)
      .attr('opacity', 1.0)
      .attr('fill', function (d) { return d.filler ? '#ef233c' : '#edf2f4'; });

     g.selectAll('.line-chart1')
      .transition()
      .duration(0)
      .style('opacity',0);

     g.selectAll('.line-chart2')
      .transition()
      .duration(0)
      .style('opacity',0);
  }


function showTotalLine() {
    g.selectAll('.square')
      .transition()
      .delay(0)
      .duration(600)
      .attr('opacity', 0);

    g.selectAll('.fill-square')
      .transition()
      .duration(600)
      .attr('opacity', 0);

    g.selectAll('.line-chart1')
      .datum(hpdData)
      .transition()
      .delay(600)
      .duration(800)
      .attr("d", lineEE)
      .style('opacity',1);

    g.selectAll('.line-chart2')
      .datum(hpdData)
      .transition()
      .delay(600)
      .duration(600)
      .attr("d", lineHarlem)
      .style('opacity',1)
  }


function showPerUnitLine() {
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xLineScale))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.selectAll('.line-chart1')
      .datum(hpdData)
      .transition()
      .attr("d", line1)
      .delay(600)
      .duration(600)
      .style('opacity',1);

    g.selectAll('.line-chart2')
      .datum(hpdData)
      .transition()
      .attr("d", line2)
      .delay(600)
      .duration(600)
      .style('opacity',1);

    g.selectAll('.class-line-chart-A')
      .transition()
      .duration(0)
      .style('opacity',0)
  }

  function showHPDClassA() {

     g.selectAll('.line-chart1')
      .transition()
      .duration(0)
      .style('opacity',0);

    g.selectAll('.line-chart2')
      .transition()
      .duration(0)
      .style('opacity',0);

    g.selectAll('.class-line-chart-A')
      .transition()
      .delay(800)
      .duration(800)
      .style('opacity',1)

    g.selectAll('.class-line-chart-B')
      .transition()
      .duration(0)
      .style('opacity',0);

  }

function showHPDClassB() {

    g.selectAll('.class-line-chart-B')
      .transition()
      .duration(800)
      .style('opacity',1);

    g.selectAll('.class-line-chart-C')
      .transition()
      .duration(0)
      .style('opacity',0);

  }

function showHPDClassC() {

    g.selectAll('.class-line-chart-C')
      .transition()
      .duration(800)
      .style('opacity',1);

    g.selectAll('.hpd-bar')
      .transition()
      .duration(0)
      .style('opacity',0);

  }


  function showHPDBar() {
    g.selectAll('.x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xHPDBarScale))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.selectAll('.class-line-chart-A')
      .transition()
      .duration(0)
      .style('opacity',0);

    g.selectAll('.class-line-chart-B')
      .transition()
      .duration(0)
      .style('opacity',0);

    g.selectAll('.class-line-chart-C')
      .transition()
      .duration(0)
      .style('opacity',0);

    g.selectAll('.hpd-bar')
      .transition()
      .duration(800)
      .style('opacity',1);

    g.selectAll('.x-axis-hpd')
      .transition()
      .duration(800)
      .style('opacity',1)

  }


  /**
   * showAxis - helper function to
   * display particular xAxis
   *
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar or xAxisLine)
   */
  function showxAxis(x_axis) {
    g.select('.x-axis')
      .call(x_axis)
      .transition().duration(500)
      .style('opacity', 1);
  }

  function showyAxis(y_axis) {
    g.select('.y-axis')
      .call(y_axis)
      .transition().duration(500)
      .style('opacity', 1);
  }

  /**
   * hideAxis - helper function
   * to hide the axis
   *
   */
  function hidexAxis() {
    g.selectAll('.x-axis')
      .transition().duration(500)
      .style('opacity', 0);
  }

  function hideyAxis() {
    g.selectAll('.y-axis')
      .transition().duration(500)
      .style('opacity', 0);
  }


  /**
   * DATA FUNCTIONS
   *
   * Used to coerce the data into the
   * formats we need to visualize
   *
   */

  /**
   * getWords - maps raw data to
   * array of data objects. There is
   * one data object for each word in the speach
   * data.
   *
   * This function converts some attributes into
   * numbers and adds attributes used in the visualization
   *
   * @param rawData - data read in from file
   */
  function getWords(rawData) {
    return rawData.map(function (d, i) {
      // is this word a filler word?
      d.filler = (d.filler === '1') ? true : false;
      // time in seconds word was spoken
      d.time = +d.time;
      // time in minutes word was spoken
      d.min = Math.floor(d.time / 60);

      // positioning for square visual
      // stored here to make it easier
      // to keep track of.
      d.col = i % numPerRow;
      d.x = d.col * (squareSize + squarePad);
      d.row = Math.floor(i / numPerRow);
      d.y = d.row * (squareSize + squarePad);
      return d;
    });
  }

  /**
   * getFillerWords - returns array of
   * only filler words
   *
   * @param data - word data from getWords
   */
  function getFillerWords(data) {
    return data.filter(function (d) {return d.filler; });
  }

  /**
   * groupByWord - group words together
   * using nest. Used to get counts for
   * barcharts.
   *
   * @param words
   */
  function groupByWord(words) {
    return d3.nest()
      .key(function (d) { return d.word; })
      .rollup(function (v) { return v.length; })
      .entries(words)
      .sort(function (a, b) {return b.value - a.value;});
  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  chart.setOtherData = function(other, other2, other3){
    otherData = other;
    otherData2 = other2;
    otherData3 = other3;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */

  // return chart function
  return chart;
};


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(error, portfolio, hpd_harlem, hpd_violations_date_class_resample, hpd_categorical) {
  // create a new plot and
  // display it
  console.log(portfolio);
  console.log(hpd_harlem);

  var plot = scrollVis();

  plot.setOtherData(hpd_harlem, hpd_violations_date_class_resample, hpd_categorical);

  d3.select('#vis')
    .datum(portfolio)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });
}

// load data and display
d3.queue()
  .defer(d3.csv, 'data/portfolio.csv')
  .defer(d3.csv, 'data/hpd_harlem.csv')
  .defer(d3.csv, 'data/hpd_violations_date_class_resample.csv')
  .defer(d3.csv, 'data/hpd_categorical.csv')
  .await(display)