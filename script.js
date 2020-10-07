let width = 910,
  height = 500,
  barWidth = width / 275;


//this is the little box than comes up when you put your mouse
let tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
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

    let yAxisScale = d3.scaleLinear().domain([d3.max(time), d3.min(time)]).range([height - 10, 30]);
  
    let yAxis = d3.axisLeft().scale(yAxisScale);

    
    svgContainer
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 0)');


  
    d3.select('svg')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('data-year', function (d, i) {

        return data[i].Year;
      })
      .attr('data-time', function (d, i) {
        return data[i].Time;
      })
      .attr('class', 'circle')
     
      .attr('cx', function (d, i) {

        return xScale(d.Year);
      })
      .attr('cy', function (d) {
        return yAxisScale(d.Time.replace(/:/g, '.'))
      })
      .attr("r", 6)
      .style('fill', function(d,i){
        if (d.Doping!=''){
          return '#c0392b'
        }else return '#27ae60'
      })
      .style('fill-opacity','90%')
      .style('stroke','black')
      .attr('transform', 'translate(60, 0)')
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
     svgContainer.append("circle").attr("cx",950).attr("cy",129).attr("r", 6).style("fill", "#27ae60")
     svgContainer.append("circle").attr("cx",950).attr("cy",159).attr("r", 6).style("fill", "#c0392b")
     svgContainer.append("text").attr("x", 794).attr("y", 130).text("No doping allegations").style("font-size", "15px").attr("alignment-baseline","middle")
     svgContainer.append("text").attr("x", 740).attr("y", 160).text("Riders with doping allegations").style("font-size", "15px").attr("alignment-baseline","middle")
  
      
  }
);