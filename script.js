let width = 910,
  height = 500,
  barWidth = width / 275;

//this is the little box than comes up when you put your mouse
let tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

//this is the white bar that covers the blue line your are on
let overlay = d3
  .select('.visHolder')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

//this is the main svg container
let svgContainer = d3
  .select('.visHolder')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);


d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',//https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json
  function (data) {


    svgContainer
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -120)
      .attr('y', 80)
      .text('Time in Minutes');


    svgContainer
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 60)
      .text('More Information: https://en.wikipedia.org/wiki/Doping_at_the_Tour_de_France')
      .attr('class', 'info');


    let years = data.map(function (item) {
      return item.Year;
    });

    let xMax = d3.max(years);

    let xScale = d3
      .scaleLinear()
      .domain([d3.min(years) - 1, xMax + 1])
      .range([0, width - 30]);


    let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));


    svgContainer
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60, 500)');

    let time = data.map(function (item) {
      return item.Time.replace(/:/g, '.');
    });

    //this is to scale the gdp on the yAxis
    let yAxisScale = d3.scaleLinear().domain([d3.max(time), d3.min(time)]).range([height - 10, 30]);
    // scaling the d3 yaxis to the scale we just made above
    let yAxis = d3.axisLeft().scale(yAxisScale);

    //appending the y axis to the svg (the translate 60 pushes it to the right)
    svgContainer
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 0)');

d3.select
    //this is to add all the bars(rect) to the svg
    //(d) is the data so the number and (i) is the index
    d3.select('svg')
      .selectAll('circle')
      .data(data)// GDP scaled to the height of 400
      .enter()
      .append('circle')
      .attr('data-year', function (d, i) {//sets the date as an attribute

        return data[i].Year;
      })
      .attr('data-time', function (d, i) {// sets the gdp amount as an attribute
        return data[i].Time;
      })
      .attr('class', 'circle')
      //pushes each rect a little bit more to the right with each change in year
      .attr('cx', function (d, i) {

        return xScale(d.Year);
      })
      .attr('cy', function (d) {
        return yAxisScale(d.Time.replace(/:/g, '.'))
      })
      .attr("r", 5)
      .style('fill', function(d,i){
        if (d.Doping!=''){
          return '#c0392b'
        }else return '#27ae60'
      })
      .attr('transform', 'translate(60, 0)')//pushes graph a little right
      .on('mouseover', function (d, i) {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
            data[i].Name +
            ' (' +
            data[i].Nationality + ')' +
            '<br />' +
            data[i].Year + '<br />' + 'time:' +
            data[i].Time +
            '<br />' + '<br />' +
            data[i].Doping


          
          )

        tooltip

          .style('left', xScale(d.Year) + 90 + 'px')
          .style('top', yAxisScale(d.Time.replace(/:/g, '.')) - 30 + 'px');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);



      });
      var legendContainer = svg.append('g').attr('id', 'legend');
      
      var legend = legendContainer
        .selectAll('#legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend-label')
        .attr('transform', function(d, i) {
          return 'translate(0,' + (height / 2 - i * 20) + ')';
        });
      
      legend
        .append('rect')
        .attr('x', width - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);
      
      legend
        .append('text')
        .attr('x', width - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(function(d) {
            if (d) {
              return 'Riders with doping allegations';
            } else {
              return 'No doping allegations';
            }})
      
  }
);