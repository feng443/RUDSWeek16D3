// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
d3.select(window).on('resize', makeResponsive)

makeResponsive()

function makeResponsive() {
    var svgArea = d3.select('body').select('svg')

    if (!svgArea.empty()) svgArea.remove()

    var svgWidth = window.innerWidth
    var svgHeight = window.innerHeight

    margin = {
        top: 50,
        bottom: 80,
        right: 50,
        left: 80
    }

    var height = svgHeight - margin.top - margin.bottom
    var width = svgWidth - margin.left - margin.right

    var svg = d3
        .select('.chart')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth)

    var chartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

   d3.csv('assets/csv/state_poverty_vs_healthcare_2014.csv', function(err, data) {
        if (err) throw err

        // Convert to numeric
        data.forEach( d => {
            d.poverty = +d.poverty
            d.healthcare = +d.healthcare
        })

        // X Axis and Label
        chartGroup.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(
                d3.scaleLinear()
                    .domain(d3.extent(data, d => d.poverty))
                    .range([0, width])
            ))
         chartGroup.append('text')
            .attr('transform', `translate(${width/2}, ${height + margin.top/2 + 20})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .text('In Poverty (%)')

        // Y Axis and Label
        chartGroup.append('g')
            .call(d3.axisLeft(
                d3.scaleLinear()
                    .domain(d3.extent(data, d => d.healthcare))
                    .range([height, 0])
            ))
         svg.append('text')
            .attr('transform', `translate(${margin.left / 2}, ${height/2 + margin.top + 20}) rotate(-90)`)
            .attr('text-anchor', 'start')
            .attr('font-size', '16px')
            .text('Lacks Healthcare (%)')


         // Draw individual data point


         // Add tool tip
   })

}
