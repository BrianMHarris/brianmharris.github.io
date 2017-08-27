// Run this to test: python -m SimpleHTTPServer
document.addEventListener("DOMContentLoaded", main);

function main() {
  var allStatesObj = {};
  // async calls to all csv files for reading
  var promises = readIncidents(yearsDict);
  Promise.all(promises).then(function(dataArray) {
    // for each state, condense all incidents into year and total
    for (data of dataArray) {
      if (parseInt(data[1]) >= 1999)
        allStatesObj[data[1]] = condenseIncidents(data[0]);
    }

    // set up the slider that controls which year we are viewing
    var slider = document.getElementById("year_slider");
    slider.setAttribute("min", 0);
    slider.setAttribute("max", dataArray.length-1);
    slider.setAttribute("value", dataArray.length-1);
    slider.setAttribute("steps", 1);
    updateSlider(dataArray.length-1);

    // the initial chart should be set to 2017
    initializeChart("2017");

  }); // end promise.all
}

// this function condenses the state incidents and return
//  a dictionary of states, each with dictionary containing years
//  and the total incidents figures
function readIncidents(state_data) {
  var promises = [];
  for (state in state_data) {
    promises = promises.concat(new Promise(function(resolve, reject) {
      // Grab the name of the current state with closure!
      var innerState = state;
      d3.csv("/data/" + state + ".csv", function(error, data) {
        if (error){
          console.log(state);
          reject(error);
        }
        resolve([data, innerState])
      });
    }));
  } 
  return promises;
}

// the total incidents for every year are stored
function condenseIncidents(dataArray) {
  var total = 0;
  
  // loop through each incident and condense the information
  for (var i = 0; i < dataArray.length; i++) {
    // collect the total number of incidents for the state
    total += parseInt(dataArray[i].total);    
  }
  return total;
}

// every time the chart is initialized, we rebuild the whole svg
// OPTIMIZE: It would be nice to make it only rebuild the bars. Time permitting...
function initializeChart(year) {
  // clear out the old svg so we don't draw over it
  d3.select("svg").select("g").remove();
  
  // select the current svg and create the position variables
  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  // x and y scale functions to help with the bar scaling both horiz and vert
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  // the container object for the entire graphic we're creating
  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var counter = 0; // creates ids for the states for later use
  var yearTotal = 0;
  
  d3.csv(`data/${year}.csv`, function(d) {
    d.id = counter++;
    d.abbr = states[d.state];
    d.total = +d.total;
    yearTotal += d.total;
    return d;
  }, function(error, data) {
    var minTotal = d3.min(data, function(d) { return d.total; });
    var maxTotal = d3.max(data, function(d) { return d.total; });
    x.domain(data.map(function(d) { return d.abbr; }));
    y.domain([0, maxTotal]);

    var keyRange = d3.range(0, maxTotal, maxTotal/10)

    var color = d3.scaleSequential(d3.interpolateReds)
        .domain([-maxTotal * 0.25, maxTotal]);

    // set up the color key rectangle
    g.selectAll(".keys")
        .data(keyRange)
        .enter()
        .append("rect")
        .attr("x", (d,i)=>(width*.75)+(i*10))
        .attr("y", 0)
        .attr("height", 10)
        .attr("width", 10)
        .attr("fill", (d)=>color(d))
        .attr("stroke", "gray");

    // create the text label for the color key
    g.append("text")
        .attr("class", "caption")
        .attr("x", width*.75)
        .attr("y", -8)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .text("Range: " + minTotal + " - " + maxTotal);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
    g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(20))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Reports")

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
        .attr("fill", function(d) { return color(d.total); })
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.abbr); })
        .attr("y", height)
        .attr("width", 12)
        .attr("height", 0)
        .on("mousemove", showToolTip)
        .on("mouseout", hideToolTip)
        .transition()
        .duration(500)
        .attr("y", function(d) { return y(d.total); })
        .attr("height", function(d) { return height - y(d.total); })

        document.getElementById("date").innerText = year;
        document.getElementById("total").innerText = yearTotal;
  });
}

// the year selection slider re-initializes the whole SVG 
function updateSlider(value) {
  initializeChart(yearsArr[value]);
}

// FIX: show the tooltip near the mouse when a bar is moused through
function showToolTip(d) {
  d3.select(".tooltip")
      .style("opacity", 1)
      .style("top", d3.event.y + "px")
      .style("left", d3.event.x + "px")
      .html(`${d.state}: ${d.total}`);
}

// hide the tooltip when a bar is moused off
function hideToolTip(d) {
  d3.select(".tooltip")
      .style("opacity", 0);
}