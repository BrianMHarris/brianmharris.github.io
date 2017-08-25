// Run this to test: python -m SimpleHTTPServer

document.addEventListener("DOMContentLoaded", main);

function main() {
  var visData = [];
  var width = 500;
  var height = 500;
  var xMin, xMax;
  var yMin, yMax;
  var xScale, yScale;

  var svg = d3.select('svg')
              .attr('width', width)
              .attr('height', height);

  d3.csv("data/population.csv", row, function(error, data) {
    if (error) throw error;
    visData = data;
    debugger;
  });

  svg.selectAll('circle')
        .data(visData)
        .enter()
        .append('circle')
        .attr('cx', (d) => d.year)
        .attr('cy', (d) => d.population)
        .attr('r', (d) => 10);

  // SET THE xmin/max and ymin/max

  xScale = d3.scaleLinear()
                  .domain([xMin, xMax])
                  .range([0, width]);

  yScale = d3.scaleLinear()
                  .domain([yMin, yMax])
                  .range([0, width]);

}

// row conversion function
function row(d) {
  return {
    year: d.year,
    population: d.population
  }
}

// Removing elements

 // var todos = [
 //    "Create 1000 data visualizations with d3",
 //    "Eat dinner",
 //    "Sleep",
 //    "Hang out with friends"
 //  ];

 //  d3.select("ul")
 //    .selectAll("li")
 //      .data(todos)
 //      .enter()
 //    .append("li")
 //      .text(function(d,i) {
 //        return "Todo #" + (i + 1) + ": " + d;
 //      });

 //  d3.selectAll('li').on('click', function(d) {
 //    // find the current todo's index in the array and remove it
 //    var idx = todos.indexOf(d);
 //    todos.splice(idx,1)

 //    // Update the DOM
 //    d3.selectAll('li')
 //      .data(todos)
 //        .text(function(d,i) {
 //          return "Todo #" + (i + 1) + ": " + d;
 //        })
 //      .exit()
 //      .remove();
 //  });


// BAR CHART

// var svgWidth = 500;
//   var svgHeight = 500;
//   var barWidth = 90;
//   var barGap = 10;

//   d3.select('body')
//     .append('svg')
//       .attr('width', svgWidth)
//       .attr('height', svgHeight)
//     .selectAll('rect')
//       .data([
//         svgHeight * Math.random(),
//         svgHeight * Math.random(),
//         svgHeight * Math.random(),
//         svgHeight * Math.random(),
//         svgHeight * Math.random()
//       ])
//       .enter()
//     .append('rect')
//       .attr('width', barWidth)
//       .attr('height', (d) => d)
//       .attr('y', (d) => svgHeight - d)
//       .attr('x', (d,i) => (barWidth + barGap) * i)
//       .attr('fill', 'blue');






// Adding LIs to a UL
// d3.select('ul')
//     .selectAll('li')
//       .data(todos)
//       .enter()
//     .append('li')
//       .text(function(d,i) {
//           return "Todo #" + (i + 1) + ": " + d;
//       });

 // blah = d3.selectAll('p')
 //      .data([4,8,12,16,20,24,28,32,36,40])
 //      .style('font-size', (d) => d + 'px');


// Some older ideas

// document.addEventListener("DOMContentLoaded", main);

// function main() {
//   var firstSelection = d3.select("#page-title")
//   var firstLi = d3.select("ol")
//                   .select("li");
//   var allLi = d3.select("ol")
//                   .selectAll("li");                

//   d3.select("#page-title")
//       .style("color", "blue")
//       .attr("class", "intro");

//   d3.selectAll("li")
//       .classed("items", true);

//   // d3.selectAll("p")
//   //     .classed("first-paragraph", false)
//   //     .text("YAY!");

//   d3.selectAll("li")
//       .text(function() {
//               return Math.random() + " is a random number!";
//       });

//   d3.selectAll("li")
//       .style("background-color", function(d, i) {
//               if (i % 2 === 1) return "#cccccc";
//       });

//   d3.selectAll("p")
//       .classed("first-paragraph", false)
//        .style("color", function() {
//         if (Math.random() < 0.5) {
//           return "red";
//         } else {
//           return "blue";
//         }
//       });

//   d3.select("p").remove();
//   d3.selectAll("li")
//       .append("hr");
//   d3.select("body")
//       .insert("hr", "h1");

//   d3.select("h1").on('mouseover', function() {
//         console.log(d3.event);
//   });

//   d3.selectAll("li").on('click', function() {
//         var randomRed = Math.floor(Math.random() * 256);
//         var randomBlue = Math.floor(Math.random() * 256);
//         var randomGreen = Math.floor(Math.random() * 256);
//         var randomColor = "rgb("+randomRed+","+randomBlue+","+randomGreen+")";
//         d3.select(this).style('color', randomColor);
//   });

//   d3.select('body')
//     .append("svg")
//       .attr("width", 500)
//       .attr("height", 500);

//   d3.select('svg')
//     .append('rect')
//       .attr('width', 100)
//       .attr('height', 200)
//       .attr('x', 50)
//       .attr('y', 150)
//       .attr('fill', 'red')
//       .attr('stroke-width', 5)
//       .attr('stroke', 'blue');

//   d3.select('svg')
//     .append('circle')
//       .attr('cx', 250)
//       .attr('cy', 200)
//       .attr('r', 100)
//       .attr('fill', 'purple');

//   // debugger;
// }







