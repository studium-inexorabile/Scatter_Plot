let timeParse = d3.timeParse("%M:%S");
let timeFormat = d3.timeFormat("%M:%S");

let req = new XMLHttpRequest();
req.open("GET","https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",true);

req.send();
req.onload = () => {
    json = JSON.parse(req.responseText)
    const w = 1000
    const h = 750
    const padding = 55
    const dataSet = json

    const svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)

    svg.append("text")
      .attr("id", "title")
      .attr("class", "chart-title")
      .attr("x", w / 2 - 150)
      .attr("y", 50)
      .text("Cyclist Data")

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 + padding - 60)
      .attr("x", 0 - h / 2.5)
      .attr("dy", "1em")
      .text("Minutes")

    svg.append("text")
      .attr("transform","translate(" + w / 1.5 + " ," + (h - padding + 40) + ")")
      .text("Year")

    let timeArray = []
    dataSet.forEach((value) => {
      timeArray.push(timeParse(value.Time))
    })

    const minTime = d3.min(timeArray, (d) => {
      return d;
    })
    const maxTime = d3.max(timeArray, (d) => {
      return d;
    })

    const minYear = d3.min(dataSet, (d) => {
        return d.Year;
      }) - 1;
    const maxYear = d3.max(dataSet, (d) => {
        return d.Year;
      }) + 1

    const yScale = d3.scaleTime()
      .domain([minTime, maxTime])
      .range([padding, h - padding])

    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, w - padding])

    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))

    svg.append("g")
      .attr("transform", "translate(" + padding + "," + 0 + ")")
      .attr("id", "y-axis")
      .call(yAxis)

    svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis)

    let tooltip = d3.select("body")
      .append("div")
      .attr("class", "toolTip")
      .attr("id", "tooltip")

    svg.selectAll("circle")
      .data(dataSet)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.Year))
      .attr("cy", (d) => {
        return yScale(timeParse(d.Time))
      })
      .attr("r", d => 8)
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => {
        return timeParse(d.Time)
      })
      .style("fill", (d) => {
        return d.Doping == "" ? "green" : "orange"
      })
      .on("mouseover", (d, i) => {
        if (d.Doping == "") {
          tooltip.style("left", d3.event.pageX + 20 + "px")
            .style("top", d3.event.pageY + "px")
            .style("display", "inline-block")
            .style("opacity", 1)
            .attr("data-year", d.Year)
            .html(d.Name + "<br>" + d.Year)
        } else {
          tooltip.style("left", d3.event.pageX - 80 + "px")
            .style("top", d3.event.pageY + 20 + "px")
            .style("display", "inline-block")
            .attr("data-year", d.Year)
            .html(
              d.Name + "<br>" + d.Year + "<br>" + d.Doping
            )
            .style("opacity", 1)
        }
      })
      .on("mouseout", (d) => {
        tooltip.style("opacity", 0)
      })


    const colors = ["orange", "green"]
    svg.selectAll("rect")
      .data(colors)
      .enter()
      .append("rect")
      .attr("class", "legend")
      .attr("x", w - 100)
      .attr("y", (d, i) => {
        return i * 28 + padding * 2
      })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", d => d)
      .attr("id", "legend")

    svg.append("text")
      .attr(
        "transform",
        "translate(" + (w - 130) + " ," + (padding * 2 + 10) + ")"
      )
      .style("text-anchor", "end")
      .text("doped")

    svg.append("text")
      .attr(
        "transform",
        "translate(" + (w - 130) + " ," + (padding * 2 + 36) + ")"
      )
      .style("text-anchor", "end")
      .text("didn't dope")
}

