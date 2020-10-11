// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
  top: 10,
  right: 10,
  bottom: 50,
  left: 100
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// read in data from csv file and create chart
d3.csv("./assets/data/data.csv").then(function(data) {
    // print data for reference 
    // console.log(data);

    // cast poverty and healthcare as integers 
    data.forEach(function(data) {
        data.healthcare = +data.healthcare;   
        data.poverty = +data.poverty;
    });

    // x and y linear scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.poverty) -0.5, d3.max(data, d => d.poverty) +1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.healthcare) -1, d3.max(data, d => d.healthcare) +1])
      .range([height, 0]);

    // Create two new functions passing our scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append two SVG group elements to the chartGroup
    // and create the x and y axis
    chartGroup.append("g")
        .call(leftAxis);
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    // create circlegroup element and add one svg circle for each data point
    var circlesGroup = chartGroup.selectAll("g circlesgroup")
        .data(data)
        .enter();
    circlesGroup
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "17")
        .attr("class", "stateCircle")
        .attr("opacity", "0.7");
        
    // add state abbreviation inside each corresponding circle 
    circlesGroup
        .append("text")
        .text(function(d) {
        return d.abbr;
      })
        .attr("dx", d => xLinearScale(d.poverty))
        .attr("dy", d => yLinearScale(d.healthcare) + 4)
        .attr("class","stateText")

    // Create bottom axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 50 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("class", "aText")
        .text("Without Healthcare (%)");
    
    // create left axis label
    chartGroup.append("text")
        .attr("x", width/2)
        .attr("y", height + margin.top + 25)
        .attr("class", "aText")
        .text("Living in Poverty (%)");

// catch errors and print to console
}).catch(function(error) {
    console.log(error)})