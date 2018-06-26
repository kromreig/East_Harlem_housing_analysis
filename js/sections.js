var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.

  var width = 600;
  var height = 520;
  var margin = { top: 0,
    left: 100,
    bottom: 40,
    right: 10 };

  var lastIndex = -1;
  var activeIndex = 0;

  // Sizing for the grid visualization
  var squareSize = 8;
  var squarePad = 2;
  var numPerRow = width / squareSize + squarePad;

  var svg = null;
  var g = null;

  var xBarScale = d3.scaleLinear()
    .range([0, width]);

  var barColors = { 0: '#008080', 1: '#399785', 2: '#5AAF8C' };

  //Scales for DOB Line Chart

  xDOBLineScale = d3.scaleTime().range([0, width]);
  yDOBLineScale = d3.scaleLinear().rangeRound([height, 0]);
  yDOBAvgLineScale = d3.scaleLinear().rangeRound([height, 0]);
  

  //SCALES FOR FIRST HPD LINE CHART

  var xLineScale = d3.scaleTime().rangeRound([0, width]);
  var yLineScale = d3.scaleLinear().rangeRound([height, 0]);

  //SCALES FOR HPD LITIGATION LINE CHART

  var xLitigLineScale = d3.scaleTime().rangeRound([0, width]);
  var yLitigLineScale = d3.scaleLinear().rangeRound([height, 0]);

  //SCALES FOR HPD BAR CHART

  var xHPDBarScale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.05)
    .align(0.1);

  var yHPDBarScale = d3.scaleLinear()
    .rangeRound([height, 0]);

  var activateFunctions = [];

  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  var chart = function (selection) {
    selection.each(function (rawData) {
      parseTime = d3.timeParse("%Y-%m-%d");
      //Some small processing with the other datasets

      otherData.forEach(function (d) {
        d.receiveddate = parseTime(d.receiveddate);
        return d;
      });

      otherData2.forEach(function (d) {
        d.date = parseTime(d.date);
        d.A = +d.A;
        d.B = +d.B;
        d.C = +d.C;
        d.total = +(d.A+d.B+d.C);
        return d;
      });

      otherData3.forEach(function (d) {
        d.date = parseTime(d.date);
        d.Lead = +d.Lead;
        d.Mold = +d.Mold;
        d.Gas = +d.Gas;
        d.Heat = +d.Heat;
        d.Pests = +d.Pests;
        return d;
      });

      otherData4.forEach(function (d) {
        d.date = parseTime(d.inspectiondate);
        d.emerald_equity_total = +d.summed;
        d.harlem_total = +d.summed_harlem;
        return d;
      });

      otherData5.forEach(function (d) {
        d.caseopendate = parseTime(d.caseopendate);
        d.count_harlem = +d.count;
        d.count_emerald = +d.count_ee;
        return d;
      });



      //Here's the various data.
      hpdData = otherData;
      hpdClass = otherData2;
      hpdCategorical = otherData3;
      combinedDob = otherData4;
      hpdLit = otherData5;

      // HPD Line Chart

      xLineScale.domain(d3.extent(hpdData, function(d){ return d.receiveddate; }));
      yLineScale.domain([0, d3.max(hpdData, function(d){ return +(d.East_Harlem_Count);})])

      //HPD BAR CHART
      formatDate = d3.timeFormat("%Y-%m-%d")

      xHPDBarScale.domain(hpdCategorical.map(function(d){ return d.date; }));
      yHPDBarScale.domain([0, d3.max(hpdCategorical, function(d){ return (d.Lead + d.Mold + d.Gas + d.Heat + d.Pests)})]).nice();


      xHPDAxis = d3.axisBottom(xHPDBarScale)
      .tickFormat(d3.timeFormat("%Y-%m"))
      .tickValues(xHPDBarScale.domain().filter(function(d,i){ return !(i%5)}));

      //HPD Litig Line

      xLitigLineScale.domain(d3.extent(hpdLit, function(d){ return d.caseopendate;}));
      yLitigLineScale.domain([0, d3.max(hpdLit, function(d){ return +(d.count_harlem);})]);

      //DOB Line Chart

      xDOBLineScale.domain(d3.extent(combinedDob, function(d){ return d.date; }));
      yDOBLineScale.domain([0, d3.max(combinedDob, function(d){ return +d.harlem_total })]);
      yDOBAvgLineScale.domain([0, d3.max(combinedDob, function(d){ return +d.emerald_equity_total/1449 * 1000 })]);

      // create svg and give it a width and height
      svg = d3.select(this).selectAll('svg').data([squareData]);
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

  innerSVG.append('text')
      .attr('y', height)
      .attr('x', width/2+40)
      .transition()
      .delay(1000)
      .duration(1200)
      .attr('class', 'title openvis-title highlight')
      .attr('x', width/2+40)
      .attr('y', height/2 )
      .text('Life')
      .attr('opacity', .75);

    innerSVG.append('text')
      .attr('y', height)
      .attr('x', width/2+40)
      .transition()
      .delay(1000)
      .duration(2200)
      .attr('class', 'title openvis-title highlight')
      .attr('x', width/1.7+40)
      .attr('y', height/1.5)
      .text('Under')
      .attr('opacity', .75);

   innerSVG.append('text')
      .attr('y', height)
      .attr('x', width/2+40)
      .transition()
      .delay(1000)
      .duration(4000)
      .attr('class', 'title openvis-title highlight')
      .attr('x', width/1.4+40)
      .attr('y', height/1.2)
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
        innerSVG.selectAll('.complaint-circle,.complaint-rect,.complaint-date')
                .transition()
                .delay(2000)
                .attr('opacity',0);
        
            descr=descr_data[this.id]['complaint']
            words=descr.split(",");
            x=this.getBBox().x;
            y=this.getBBox().y;
            if (descr){r=Math.log(descr.length)*Math.log(descr.length)*1.75}
            else {r = 15};

            var getRandomWord = function () {
              index = Math.floor(Math.random() * words.length)
              return words[index];
            };

            d3.select(this)
              .style('fill', 'white');

            innerSVG.append("rect")
              .classed('complaint-rect',true)
              .attr("x", x)
              .attr("y", y)
              .attr("height", 0)
              .attr("width", 240)
              .attr('color','#2b2d42')
              .attr('z-index', 1001)
              .attr('opacity',0)
              .transition()
              .duration(2000)
              .attr('opacity',.75)
              .attr("x", function() {if (x < 100) { return x+100;} else { return x-60;}})
              .attr("y",  function() {if (y<height/2) {return y+y/2-30;} else { return y-y/2-30;}})
              .attr("height", 90);
      
            innerSVG.append('text')
              .classed('complaint-date', true)
              .attr('y', y)
              .attr('x', x)
              .attr('font-size', 20)
              .style("color","red")
              .attr('text-anchor', 'left')
              .attr('opacity', 0)
              .transition()
              .duration(2000)
              .attr('opacity', .75)
              .attr('y', function() {if (y<height/2) {return y+y/2;} else { return y-y/2;}})
              .attr('x', function() {if (x < 100) { return x+120;} else { return x-40;}})
              .text(descr_data[this.id]['date'])

            innerSVG.append('text')
              .classed('complaint-text', true)
              .attr('y', y)
              .attr('x', x)
              .attr('font-size', 20)
              .attr('color', 'red')
              .attr('text-anchor', 'left')
              .attr('opacity', 0)
              .transition()
              .duration(2000)
              .attr('opacity',.75)
              .attr('transform', 'translate(50%,-50%)')
              .attr('y', function() {if (y<height/2) {return y+y/2+20;} else { return y-y/2+20;}})
              .attr('x', function() {if (x < 100) { return x+120;} else { return x-40;}})
              .text("311 Complaint:")

            
            innerSVG.append('text')
              .classed('complaint-text', true)
              .attr('y', y)
              .attr('x', x)
              .attr('font-size', 20)
              .attr('color', 'red')
              .attr('text-anchor', 'left')
              .attr('opacity', 0)
              .transition()
              .duration(2000)
              .attr('opacity',.75)
              .attr('transform', 'translate(50%,-50%)')
              .attr('y', function() {if (y<height/2) {return y+y/2+40;} else { return y-y/2+40;}})
              .attr('x', function() {if (x < 100) { return x+120;} else { return x-40;}})
              .text('"'+getRandomWord()+'"')

                      }, {once: true})
            .on("mousemove", function() {
              d3.select(this).transition().style('fill', "#ef233c");
            });
            });


      });

      // this group element will be used to contain all
      // other elements.
      g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // perform some preprocessing on raw data
      var squareData = getWords(rawData);

      // filter to just include filler words
      var fillerWords = getFillerWords(squareData);

      // get the counts of filler words for the
      // bar chart display
      var fillerCounts = groupByWord(fillerWords);
      // set the bar scale's domain


      setupVis(squareData, fillerCounts, hpdData, hpdClass, hpdCategorical, combinedDob, hpdLit);

      setupSections();
    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param squareData - data object for each word.
   * @param hpdData - data object for hpd_harlem
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  var setupVis = function (squareData, fillerCounts, hpdData, hpdClass, hpdCategorical, combinedDob, hpdLit) {

  //axes
  //********************************************************************************

//titles
//********************************************************************************


    g.selectAll('.openvis-title')
      .attr('opacity', 0);

          // 49 Buildings in East Harlem Title
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
                    .data(squareData, function (d) { return d.word; });
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
    x = d3.scaleTime().rangeRound([0, width]);
    y = d3.scaleLinear().rangeRound([height, 0]);

    var maxY = d3.max(hpdData, function(d) { return +(d.East_Harlem_Count);} );
    x.domain(d3.extent(hpdData, function(d) { return d.receiveddate; }));
    y.domain([0, maxY]);

    lineEE = d3.line()
            .x(function (d){ return x(d.receiveddate);})
            .y(function (d) { return y(+d.Emerald_Equity_Count);});

    lineHarlem = d3.line()
              .x(function (d) { return x(d.receiveddate);})
              .y(function (d) { return y(+d.East_Harlem_Count);});


//the HPD per-unit lines
//********************************************************************************
    xPU = d3.scaleTime().rangeRound([0, width]);
    yPU = d3.scaleLinear().rangeRound([height, 0]);

    xPU.domain(d3.extent(hpdData, function(d) { return d.receiveddate; }));
    yPU.domain([0, d3.max(hpdData, function(d) { return +(d.Emerald_Equity_Count/1449 * 1000)})]);

    line1 = d3.line()
            .x(function (d){ return xPU(d.receiveddate);})
            .y(function (d) { return yPU(d.Emerald_Equity_Count/1449 * 1000);});

    line2 = d3.line()
              .x(function (d) { return xPU(d.receiveddate);})
              .y(function (d) { return yPU(d.East_Harlem_Count/51170 * 1000);});

//the hpd categorial line chart
//********************************************************************************
    hpdX = d3.scaleTime().rangeRound([0, width]);
    hpdY = d3.scaleLinear().rangeRound([height, 3]);

    hpdYmax= d3.max(hpdClass, function(d) { return (d.B);});
    hpdX.domain(d3.extent(hpdClass, function(d) { return d.date; }));
    hpdY.domain([0, hpdYmax]);

    lineHPDA = d3.line()
      .x(function (d){return hpdX(d.date); })
      .y(function (d){return hpdY(d.A); });

    lineHPDB = d3.line()
      .x(function (d){return hpdX(d.date); })
      .y(function (d){return hpdY(d.B); });

    lineHPDC = d3.line()
      .x(function (d){return hpdX(d.date); })
      .y(function (d){return hpdY(d.C); });
//HPD Lit line chart
//********************************************************************************
    hpdLitX = d3.scaleTime().rangeRound([0, width]);
    hpdLitY = d3.scaleLinear().rangeRound([height, 0]);


    var maxLitY = d3.max(hpdLit, function(d) { return +(d.count_harlem);} );
    hpdLitY.domain([0, maxLitY]);
    hpdLitX.domain(d3.extent(hpdLit, function(d) {return d.caseopendate}));

    lineLitEE = d3.line()
            .x(function (d){ return hpdLitX(d.caseopendate);})
            .y(function (d){ return hpdLitY(+d.count_emerald);});

    lineLitHarlem = d3.line()
              .x(function (d) { return hpdLitX(d.caseopendate);})
              .y(function (d) { return hpdLitY(+d.count_harlem);});

//HPD Lit line PU
//********************************************************************************

    xLitPU = d3.scaleTime().rangeRound([0, width]);
    yLitPU = d3.scaleLinear().rangeRound([height, 0]);

    xLitPU.domain(d3.extent(hpdLit, function(d) { return d.caseopendate; }));
    yLitPU.domain([0, d3.max(hpdLit, function(d) { return d.count_emerald/1449 * 1000})]);


//These numbers are from nyc-db: unitsres in all BBLs
    lineLitEE1 = d3.line()
            .x(function (d){ return xLitPU(d.caseopendate);})
            .y(function (d) { return yLitPU(d.count_emerald/1449 * 1000);});

    lineLitHarlem2 = d3.line()
              .x(function (d) { return xLitPU(d.caseopendate);})
              .y(function (d) { return yLitPU(d.count_harlem/51170 * 1000);});



//the DOB line chart
//********************************************************************************

    lineDOBEE = d3.line()
            .x(function (d){ return xDOBLineScale(d.date);})
            .y(function (d) { return yDOBLineScale(+d.emerald_equity_total);});

    lineDOBHarlem = d3.line()
              .x(function (d) { return xDOBLineScale(d.date);})
              .y(function (d) { return yDOBLineScale(+d.harlem_total);});


//the Per unit DOB lines
//********************************************************************************
    lineDOBEEAVG = d3.line()
            .x(function (d){ return xDOBLineScale(d.date);})
            .y(function (d) { return yDOBAvgLineScale(+d.emerald_equity_total/1449 * 1000);});

    lineDOBHarlemAVG = d3.line()
              .x(function (d) { return xDOBLineScale(d.date);})
              .y(function (d) { return yDOBAvgLineScale(+d.harlem_total/51170 * 1000);});
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
      .attr("stroke", "DarkGrey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", .75)
      .attr('d', lineHPDA)
      .attr('opacity', 0);

  g.append("path")
      .classed('class-line-chart-B', true)
      .datum(hpdClass)
      .attr("fill", "none")
      .attr("stroke", "Grey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", .5)
      .attr('d', lineHPDB)
      .attr('opacity', 0);

  g.append("path")
      .classed('class-line-chart-C', true)
      .datum(hpdClass)
      .attr("fill", "none")
      .attr("stroke", "LightGrey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", .75)
      .attr('d', lineHPDC)
      .attr('opacity', 0);

//HPD LIT LINES
//*****************************************************************************

  g.append('path')
      .classed('line-lit-1', true)
      .datum(hpdLit)
      .attr("fill", "none")
      .attr('stroke', 'red')
      .attr('stroke-linejoin', "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr('d', lineLitEE)
      .attr('opacity', 0);

    g.append("path")
      .classed('line-lit-2', true)
      .datum(hpdLit)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr('d', lineLitHarlem)
      .attr('opacity', 0);

//DOB LINEs
//*****************************************************************************
 g.append("path")
      .classed('dob-line-1', true)
      .datum(combinedDob)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-with", 1.5)
      .attr("d", lineDOBEE)
      .attr('opacity', 0);

 g.append("path")
      .classed('dob-line-2', true)
      .datum(combinedDob)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-with", 1.5)
      .attr("d", lineDOBHarlem)
      .attr('opacity', 0);

//HPD categorical bar chart
//*********************************************************************************************
  g.selectAll(".hpd-bar-lead")
    .data(hpdCategorical)
  .enter().append("rect")
    .classed("hpd-bar-gas hpd-bar", true)
    .attr("fill", "white")
    .attr("width", xHPDBarScale.bandwidth())
    .attr("x", function(d) {return xHPDBarScale(d.date);})
    .attr("y", function(d) {return yHPDBarScale(d.Pests) - 300})
    .attr("height", function(d) {return +(height- yHPDBarScale(d.Pests));})
    .attr('opacity', 0);

g.selectAll(".hpd-bar-mold")
    .data(hpdCategorical)
  .enter().append("rect")
    .classed("hpd-bar-mold hpd-bar", true)
    .attr("fill", "grey")
    .attr("width", xHPDBarScale.bandwidth())
    .attr("x", function(d) {return xHPDBarScale(d.date);})
    .attr("y", function(d) {return yHPDBarScale(d.Mold) - 150;})
    .attr("height", function(d) {return +(height - yHPDBarScale(d.Mold));})
    .attr('opacity', 0);

g.selectAll(".hpd-bar-gas hpd-bar")
    .data(hpdCategorical)
  .enter().append("rect")
    .classed("hpd-bar-lead hpd-bar", true)
    .attr("fill", "red")
    .attr("width", xHPDBarScale.bandwidth())
    .attr("x", function(d) {return xHPDBarScale(d.date);})
    .attr("y", function(d) {return yHPDBarScale(d.Lead);})
    .attr("height", function(d) {return +(height - yHPDBarScale(d.Lead));})
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
    activateFunctions[8] = showHPDLit;
    activateFunctions[9] = showHPDLitAvg;
    activateFunctions[10] = showDOBTotal;
    activateFunctions[11] = showDOBAverage;
    activateFunctions[12] = showHPDBar;

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
    g.selectAll('.openvis-title,.annotation,.y-axis,.square,.fill-square,.legend-rect,.legend-text')
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
    g.selectAll('.count-title,.line-chart')
      .transition()
      .duration(0)
      .style('opacity',0);


    g.selectAll('.square')
      .transition()
      .duration(600)
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

    g.selectAll('.fill-square')
      .on('mouseenter', function(d){
        d3.select(this)
              .attr('fill', 'white')
        g.append('rect')
        .classed('legend-rect', true)
        .attr('x', width/2-100)
        .attr('y', height-height/5)
        .attr('width', 200)
        .attr('height', 40)
        .attr('fill', 'white')
        .attr('opacity', .25);

        g.append('text')
          .classed('legend-text', true)
          .attr('x', width/2-80)
          .attr('y', height-height/5+25)
          .attr('text-anchor', 'center')
          .attr('z-index', 1000)
          .attr('fill', 'red')
          .text(d.word)
          .attr('opacity', 1);

      }, {once: true})
      .on('mouseout', function(d){
        d3.select(this)
              .attr('fill', function (d) { return d.filler ? '#ef233c' : '#edf2f4'; });
        g.selectAll('.legend-rect,.legend-text')
          .transition()
          .duration(2000)
          .attr('opacity', 0);
      });

     g.selectAll('.line-chart1,.line-chart2,.y-axis')
      .transition()
      .duration(0)
      .style('opacity', 0);

  }


function showTotalLine() {

  hidexAxis();
  hideyAxis();

  g.selectAll(".annotation,.y-axis,.square,.fill-square,.legend-rect,.legend-text")
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.append('g')
      .attr('class', 'y-axis')
      .transition()
      .duration(800)
      .call(d3.axisLeft(y))
    g.select('.y-axis')
      .style('fill', 'white')
      .style('opacity', 1);

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
      .style('opacity',1);

  }


function showPerUnitLine() {
  hidexAxis();

    g.append("text")
      .attr("opacity", 0)
      .classed("annotation", true)
      .attr("text-anchor", "middle")
      .attr("x", width/2 + 70)
      .attr("y", height/4-40)
      .attr("font-size", 20)
      .attr("fill", "white")
      .text("Emerald Equity Purchases 49 Buildings")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    g.append("line")
      .classed("annotation", true)
      .attr("opacity", 0)
      .attr("x1", width/2 + 80)
      .attr("y1", height-50)
      .attr("x2", width/2 + 80)
      .attr("y2", height/5)
      .attr("stroke-width", .25)
      .attr("stroke", "white")
      .transition()
      .delay(500)
      .duration(1000)
      .attr("opacity", 1);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.selectAll('.y-axis')
      .transition()
      .duration(1200)
      .call(d3.axisLeft(yPU));

    g.selectAll('.line-chart1')
      .datum(hpdData)
      .transition()
      .attr("d", line1)
      .delay(600)
      .duration(1000)
      .style('opacity',1);

    g.selectAll('.line-chart2')
      .datum(hpdData)
      .transition()
      .attr("d", line2)
      .delay(600)
      .duration(1000)
      .style('opacity',1);

    g.selectAll('.class-line-chart-A,.class-line-chart-B,.class-line-chart-C')
      .transition()
      .duration(0)
      .style('opacity',0)
  }

  function showHPDClassA() {
    hidexAxis();

    g.selectAll(".annotation,.y-axis")
      .transition()
      .duration(0)
      .style('opacity', 0);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(hpdX))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(hpdY))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

     g.selectAll('.line-chart1,.line-chart2')
      .transition()
      .duration(0)
      .style('opacity',0);

    g.selectAll('.class-line-chart-A')
      .transition()
      .duration(800)
      .attr('opacity', 1)
      .attr('stroke-width', 1)
      .attr('stroke', 'white');

    g.selectAll('.class-line-chart-B,.class-line-chart-C')
      .transition()
      .duration(0)
      .attr('opacity', 0);

  }

function showHPDClassB() {

    g.selectAll('.class-line-chart-B')
      .transition()
      .duration(800)
      .attr('stroke-width', 1)
      .attr('stroke', 'white')
      .attr('opacity',1);

    g.selectAll('.class-line-chart-C,.class-line-chart-A')
      .transition()
      .duration(0)
      .attr('stroke', 'DarkGrey')
      .attr('stroke-width', .5)
      .attr('opacity', .5);

  }

function showHPDClassC() {
    hidexAxis();
    g.selectAll(".annotation")
    .transition()
    .duration(0)
    .attr("opacity", 0);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(hpdX))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.selectAll('.class-line-chart-B,.class-line-chart-A')
      .transition()
      .duration(0)
      .attr('stroke', 'DarkGrey')
      .attr('stroke-width', .5)
      .attr('opacity', .5);

    g.selectAll('.class-line-chart-C')
      .transition()
      .duration(800)
      .attr('stroke-width', 1)
      .attr('stroke', 'white')
      .attr('opacity',1);

    g.selectAll('.line-lit-1,.line-lit-2')
      .transition()
      .style('opacity', 0);
  }

function showHPDLit() {
  //HIDE HPD CLASS(ES) CHART

  g.selectAll('.class-line-chart-A,.class-line-chart-B,.class-line-chart-C,.annotation')
      .transition()
      .duration(0)
      .attr('opacity',0);
  
  hidexAxis();
  hideyAxis();

  g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(hpdLitX))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.append('g')
      .attr('class', 'y-axis')
      .transition()
      .duration(800)
      .call(d3.axisLeft(hpdLitY))
    g.select('.y-axis')
      .style('fill', 'white')
      .style('opacity', 1);

  g.selectAll('.line-lit-1')
      .datum(hpdLit)
      .transition()
      .duration(1000)
      .attr("d", lineLitEE)
      .style('opacity',1);

    g.selectAll('.line-lit-2')
      .datum(hpdLit)
      .transition()
      .duration(1000)
      .attr("d", lineLitHarlem)
      .style('opacity',1);

  //HIDE DOB LINE CHART
}

function showHPDLitAvg(){

  hidexAxis();

   g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(hpdLitX))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.selectAll('.y-axis')
      .transition()
      .duration(1200)
      .call(d3.axisLeft(yLitPU));

    g.selectAll('.line-lit-1')
      .datum(hpdLit)
      .transition()
      .attr("d", lineLitEE1)
      .delay(600)
      .duration(1000)
      .style('opacity',1);

    g.selectAll('.line-lit-2')
      .datum(hpdLit)
      .transition()
      .attr("d", lineLitHarlem2)
      .delay(600)
      .duration(1000)
      .style('opacity',1);


  g.selectAll('.dob-line-1,.dob-line-2,.annotation')
      .transition()
      .duration(0)
      .style('opacity',0);


}
function showDOBTotal() {
    hidexAxis();
    hideyAxis();

    g.selectAll('.line-lit-1,.line-lit-2')
      .transition()
      .duration(0)
      .style('opacity',0);

    g.append("text")
      .attr("opacity", 0)
      .classed("annotation", true)
      .attr("text-anchor", "middle")
      .attr("x", width/2 + 140)
      .attr("y", height/4-40)
      .attr("font-size", 20)
      .attr("fill", "white")
      .text("Emerald Equity Purchases 49 Buildings")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    g.append("line")
      .classed("annotation", true)
      .attr("opacity", 0)
      .attr("x1", width/2 + 140)
      .attr("y1", height-50)
      .attr("x2", width/2 + 140)
      .attr("y2", height/5)
      .attr("stroke-width", .25)
      .attr("stroke", "white")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xDOBLineScale))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.append('g')
      .attr('class', 'y-axis')
      .transition()
      .duration(800)
      .call(d3.axisLeft(yDOBLineScale))
    g.select('.y-axis')
      .style('fill', 'white')
      .style('opacity', 1);


    g.selectAll('.dob-line-1')
    .datum(combinedDob)
      .transition()
      .duration(800)
      .attr("d", lineDOBEE)
      .style('opacity', 1);

    g.selectAll('.dob-line-2')
    .datum(combinedDob)
      .transition()
      .duration(800)
      .attr("d", lineDOBHarlem)
      .style('opacity', 1);
  }


function showDOBAverage() {

  hideyAxis();
  hidexAxis();

  g.selectAll(".annotation")
    .transition()
    .duration(500)
    .attr("opacity", 0);

  g.append('g')
      .attr('class', 'y-axis')
      .transition()
      .duration(800)
      .call(d3.axisLeft(yDOBAvgLineScale))
    g.select('.y-axis')
      .style('fill', 'white')
      .style('opacity', 1);

  g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xDOBLineScale))
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);


    g.selectAll('.dob-line-1')
      .transition()
      .duration(800)
      .attr('d', lineDOBEEAVG)
      .style('opacity', 1);

    g.selectAll('.dob-line-2')
      .transition()
      .duration(800)
      .attr('d', lineDOBHarlemAVG)
      .style('opacity', 1);

    g.selectAll('.hpd-bar')
      .transition()
      .duration(0)
      .style('opacity',0);

  }


  function showHPDBar() {
    hidexAxis();
    hideyAxis();

    g.selectAll(".annotation")
    .transition()
    .duration(500)
    .attr("opacity", 0);

     g.append("text")
      .attr("opacity", 0)
      .classed("annotation", true)
      .attr("x", width/2 + 125)
      .attr("text-anchor", "middle")
      .attr("x", width/2 + 125)
      .attr("y", height/5-60)
      .attr("font-size", 20)
      .attr("fill", "white")
      .text("Emerald Equity Purchases 49 Buildings")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    g.append("text")
      .attr("opacity", 0)
      .classed("annotation", true)
      .attr("x", width-15)
      .attr("y", height-40)
      .attr("fill", "white")
      .text("Lead")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    g.append("text")
      .attr("opacity", 0)
      .classed("annotation", true)
      .attr("x", width-15)
      .attr("y", height-170)
      .attr("fill", "white")
      .text("Mold")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    g.append("text")
      .attr("opacity", 0)
      .classed("annotation", true)
      .attr("x", width-8)
      .attr("y", height-320)
      .attr("fill", "white")
      .text("Gas")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    g.append("line")
      .classed("annotation", true)
      .attr("opacity", 0)
      .attr("x1", width/2 + 135)
      .attr("y1", height-50)
      .attr("x2", width/2 + 135)
      .attr("y2", height/5-45)
      .attr("stroke-width", .25)
      .attr("stroke", "white")
      .transition()
      .duration(1000)
      .attr("opacity", 1);

     g.selectAll('.dob-line-1,.dob-line-2')
      .transition()
      .duration(800)
      .style('opacity',0);

    g.append('g')
      .classed('x-axis', true)
      .attr('transform', 'translate(0,' + height + ')')
      .call(xHPDAxis)
    g.select('.x-axis')
      .style('fill', 'white')
      .style('opacity', 1);

    g.selectAll('.hpd-bar')
      .transition()
      .duration(800)
      .style('opacity',1);

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
      .transition().duration(0)
      .style('opacity', 0);
  }

  function hideyAxis() {
    g.selectAll('.y-axis')
      .transition().duration(0)
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
      // is this square an Emerald Equity building?
      d.filler = (d.filler === '1') ? true : false;
      // time in seconds word was spoken

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

  chart.setOtherData = function(other, other2, other3, other4, other5){
    otherData = other;
    otherData2 = other2;
    otherData3 = other3;
    otherData4 = other4;
    otherData5 = other5;
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
function display(error, portfolio, hpd_harlem, hpd_violations_date_class_resample, hpd_categorical, combined_dob, harlem_ee_lit) {
  // create a new plot and
  // display it
  var plot = scrollVis();

  plot.setOtherData(hpd_harlem, hpd_violations_date_class_resample, hpd_categorical, combined_dob, harlem_ee_lit);

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
  .defer(d3.csv, 'data/combined_dob.csv')
  .defer(d3.csv, 'data/harlem_ee_lit.csv')
  .await(display)