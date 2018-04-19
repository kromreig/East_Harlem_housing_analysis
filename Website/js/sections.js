
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

  // The histogram display shows the
  // first 30 minutes of data
  // so the range goes from 0 to 30
  // @v4 using new scale name
  var xHistScale = d3.scaleLinear()
    .domain([0, 30])
    .range([0, width - 20]);

  // @v4 using new scale name
  var yHistScale = d3.scaleLinear()
    .range([height, 0]);

  // The color translation uses this
  // scale to convert the progress
  // through the section into a
  // color value.
  // @v4 using new scale name
  var coughColorScale = d3.scaleLinear()
    .domain([0, 1.0])
    .range(['#008080', 'red']);

  // You could probably get fancy and
  // use just one axis, modifying the
  // scale, but I will use two separate
  // ones to keep things easy.
  // @v4 using new axis name
  var xAxisBar = d3.axisBottom()
    .scale(xBarScale);

  // @v4 using new axis name
  var xAxisHist = d3.axisBottom()
    .scale(xHistScale)
    .tickFormat(function (d) { return d + ' min'; });

  //Axes for my HPD classes Line chart

  var xHPDLineScale = d3.scaleTime()
    .rangeRound([0, width]);

  var yHPDLineScale = d3.scaleLinear().rangeRound([height, 0]);

  var xAxisHPDLine = d3.axisBottom().scale(xHPDLineScale);

  var yAxisLine = d3.axisLeft().scale(yHPDLineScale);

  //Axes for my HPD Line chart

  var xLineScale = d3.scaleTime()
    .rangeRound([0, width]);

    // the y axis is a linear scale
  var yLineScale = d3.scaleLinear().rangeRound([height, 0]);

  var xAxisLine = d3.axisBottom().scale(xLineScale)

  var yAxisLine = d3.axisLeft().scale(yLineScale)
  // When scrolling to a new section
  // the activation function for that
  // section is called.
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
        return d;

      });

      otherData3.forEach(function (d){

        var parseTime = d3.timeParse("%Y-%m-%d");
        d.date = parseTime(d.date);
        return d;
      });

      //Here's the data. use these to set the domains
      hpdData = otherData;
      hpdClass = otherData2;
      hpdCategorical = otherData3;

      xLineScale.domain(d3.extent(hpdData, function(d) { return d.receiveddate; }));
      xHPDLineScale.domain(d3.extent(hpdClass, function(d) {return d.date; }));


      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([wordData]);
      var svgE = svg.enter().append('svg');
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);

      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', height + margin.top + margin.bottom);

      svg.append('g');


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

      // get aggregated histogram data

      var histData = getHistogram(fillerWords);
      // set histogram's domain
      var histMax = d3.max(histData, function (d) { return d.length; });
      yHistScale.domain([0, histMax]);

      setupVis(wordData, fillerCounts, histData, hpdData, hpdClass, hpdCategorical);

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
  var setupVis = function (wordData, fillerCounts, histData, hpdData, hpdClass) {

    // axis
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxisBar)
    g.select('.x.axis').style('opacity', 0);


     g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxisLine)
    g.select('.x.axis').style('opacity', 0);

    // count openvis title
    g.append('text')
      .attr('class', 'title openvis-title highlight')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5) )
      .text('Rent');

    g.append('text')
      .attr('class', 'title openvis-title highlight')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (2 * height / 5))
      .text('Stabilization');

    g.selectAll('.openvis-title')
      .attr('opacity', 0);

    // count filler word count title
    g.append('text')
      .attr('class', 'title count-title highlight')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('49 Buildings');

    g.append('text')
      .attr('class', 'sub-title count-title')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5))
      .text('in East Harlem');

    g.selectAll('.count-title')
      .attr('opacity', 0);

    // square grid
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
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

    // in my line chart, the x axis is time
    var x = d3.scaleTime().rangeRound([0, width]);

    // the y axis is a linear scale
    var y = d3.scaleLinear().rangeRound([height, 0]);


    // PUT THINGS FOR LINES HERE
    x.domain(d3.extent(hpdData, function(d) { return d.receiveddate; }));
    y.domain([0,5]);

    line1 = d3.line()
            .x(function (d){ return x(d.receiveddate);})
            .y(function (d) { return y(d.Emerald_Equity_Count);});

    line2 = d3.line()
              .x(function (d) { return x(d.receiveddate);})
              .y(function (d) { return y(d.East_Harlem_Count);});

    var hpdX = d3.scaleTime().rangeRound([0, width]);
    var hpdY = d3.scaleLinear().rangeRound([height, 0]);

    hpdX.domain(d3.extent(hpdClass, function(d) { return d.date; }));
    hpdY.domain([0, 15]);

    lineHPDA = d3.line()
      .x(function (d){return hpdX(d.date); })
      .y(function (d){return hpdY(d.A); })


//********************************************************************************

    g.append('path')
      .classed('line-chart', true)
      .datum(hpdData)
      .attr("fill", "none")
      .attr('stroke', 'red')
      .attr('stroke-linejoin', "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line1)
      .attr('opacity', 0);

    g.append("path")
      .classed('line-chart', true)
      .datum(hpdData)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr('d', line2)
      .attr('opacity', 0);

  //********************************************************************************

  var bars = g.selectAll('.bar').data(hpdClass);
     var barsE = bars.enter()
      .append('rect')
      .attr('class', 'bar');
    bars = bars.merge(barsE)
      .attr('x', 0)
      .attr('y', function (d) { return d.A; })
      .attr('fill', 'red')
      .attr('width', 0)
      .attr('height', yBarScale.bandwidth());
};
  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showFillerTitle;
    activateFunctions[2] = showGrid;
    activateFunctions[3] = highlightGrid;
    activateFunctions[4] = showHPDLine;
    activateFunctions[5] = showDOBLine;
    activateFunctions[6] = showEELine;
    activateFunctions[7] = showLead;
    activateFunctions[8] = showMold;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 9; i++) {
      updateFunctions[i] = function () {};
    }
    updateFunctions[7] = updateCough;
  };

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  /**
   * showTitle - initial title
   *
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   *
   */
  function showTitle() {
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.openvis-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  }

  /**
   * showFillerTitle - filler counts
   *
   * hides: intro title
   * hides: square grid
   * shows: filler count title
   *
   */
  function showFillerTitle() {
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
  function showGrid() {
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
  }

  /**
   * highlightGrid - show fillers in grid
   *
   * hides: barchart, text and axis
   * shows: square grid and highlighted
   *  filler words. also ensures squares
   *  are moved back to their place in the grid
   */
  function highlightGrid() {
    hidexAxis();
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
  }

  /**
   * showBar - barchart
   *
   * hides: square grid
   * hides: histogram
   * shows: barchart
   *
   */
  function showHPDLine() {
    showxAxis(xAxisLine);
    // ensure bar axis is set

    g.selectAll('.square')
      .transition()
      .duration(800)
      .attr('opacity', 0);

    g.selectAll('.fill-square')
      .transition()
      .duration(800)
      .attr('x', 0)
      .attr('y', function (d, i) {
        return yBarScale(i % 3) + yBarScale.bandwidth() / 2;
      })
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.line-chart')
      .transition()
      .delay(800)
      .duration(800)
      .style('opacity',1);
  }

 
  function showDOBLine() {
    hidexAxis();

    g.selectAll('.line-chart')
      .transition()
      .duration(0)
      .style('opacity',0);

    g.selectAll('.hpd-line-chart')
      .transition()
      .duration(0)
      .style('opacity',1)

  }

  function showEELine() {

    g.selectAll('.line-chart')
      .transition()
      .duration(0)
      .style('opacity',0);

  }

  function showLead() {

    g.selectAll('.line-chart')
      .transition()
      .duration(0)
      .style('opacity',0);

  }

  function showMold() {

    g.selectAll('.line-chart')
      .transition()
      .duration(0)
      .style('opacity',0);

  }


  /**
   * showAxis - helper function to
   * display particular xAxis
   *
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar or xAxisLine)
   */
  function showxAxis(x_axis) {
    g.select('.x.axis')
      .call(x_axis)
      .transition().duration(500)
      .style('opacity', 1);
  }

  function showyAxis(y_axis) {
    g.select('.y.axis')
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
    g.select('.x.axis')
      .transition().duration(500)
      .style('opacity', 0);
  }
  
  function hideyAxis() {
    g.select('.y.axis')
      .transition().duration(500)
      .style('opacity', 0);
  }

  /**
   * UPDATE FUNCTIONS
   *
   * These will be called within a section
   * as the user scrolls through it.
   *
   * We use an immediate transition to
   * update visual elements based on
   * how far the user has scrolled
   *
   */

  /**
   * updateCough - increase/decrease
   * cough text and color
   *
   * @param progress - 0.0 - 1.0 -
   *  how far user has scrolled in section
   */
  function updateCough(progress) {
    g.selectAll('.cough')
      .transition()
      .duration(0)
      .attr('opacity', progress);

    g.selectAll('.hist')
      .transition('cough')
      .duration(0)
      .style('fill', function (d) {
        return (d.x0 >= 14) ? coughColorScale(progress) : '#008080';
      });
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
   * getHistogram - use d3's histogram layout
   * to generate histogram bins for our word data
   *
   * @param data - word data. we use filler words
   *  from getFillerWords
   */
  function getHistogram(data) {
    // only get words from the first 30 minutes
    var thirtyMins = data.filter(function (d) { return d.min < 30; });
    // bin data into 2 minutes chuncks
    // from 0 - 31 minutes
    // @v4 The d3.histogram() produces a significantly different
    // data structure then the old d3.layout.histogram().
    // Take a look at this block:
    // https://bl.ocks.org/mbostock/3048450
    // to inform how you use it. Its different!
    return d3.histogram()
      .thresholds(xHistScale.ticks(10))
      .value(function (d) { return d.min; })(thirtyMins);
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
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

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
function display(error, portfolio, hpd_harlem, hpd_violations_date_class, hpd_categorical) {
  // create a new plot and
  // display it
  console.log(portfolio);
  console.log(hpd_harlem);

  var plot = scrollVis();

  plot.setOtherData(hpd_harlem, hpd_violations_date_class, hpd_categorical);

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

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}

// load data and display
d3.queue()
  .defer(d3.csv, 'data/portfolio.csv')
  .defer(d3.csv, 'data/hpd_harlem.csv')
  .defer(d3.csv, 'data/hpd_violations_date_class.csv')
  .defer(d3.csv, 'data/hpd_categorical.csv')
  .await(display)