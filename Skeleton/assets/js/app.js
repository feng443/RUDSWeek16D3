// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.
const FACTS = {
    poverty: 'In Poverty (%)',
    age: 'Age (Median)',
    income: 'Household Income (Median)',
}

const RISKS = {
    healthcare: 'Lack of Healthcare (%)',
    smoke: 'Smokes (%)',
    obese: 'Obesse (%)',
}

var DATA // Buffer the data for redraw

// Global variable to save current FACT and RISK
var FACT = Object.keys(FACTS)[0]
var RISK = Object.keys(RISKS)[0]

d3.select(window).on('resize', makeResponsive)

// Use this techinique to avoid reloading of data
d3.csv('assets/csv/state_poverty_vs_healthcare_2014.csv', function(err, data) {
    if (err) throw err
    // Convert to numeric
    data.forEach( d => {
        d[FACT] = +d[FACT]
        d[RISK] = +d[RISK]
    })
    DATA = data
    makeResponsive()
})

function makeResponsive() {
    var svgArea = d3.select('body').select('svg')

    if (!svgArea.empty()) svgArea.remove()

    var svgWidth = window.innerWidth - 10
    var svgHeight = window.innerHeight - 25

    margin = {
        top: 50,
        bottom: 100,
        right: 30,
        left: 100
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

    // Add Risk/Fact Lable to make it easier to follow the chart
    svg.append('text')
        .attr('transform', `translate(20, ${margin.top + 20})`)
        .attr('font-size', '20px')
        .text('Risk')

    svg.append('text')
        .attr('transform', `translate(${width}, ${svgHeight - margin.bottom/2 + 10})`)
        .attr('text-anchor', 'right')
        .attr('font-size', '20px')
        .text('Fact')

    redraw()

    function addTitle() {
        svg.selectAll('.title').remove()
            svg.append('text')
                .classed('title', true)
                .attr('transform', `translate(${width/2 + margin.left}, 20)`)
                .attr('text-anchor', 'middle')
                .attr('font-size', '20px')
                .text(`Correlation between ${RISK} vs. ${FACT} by US States`)
    }

    function addXLabel() {
        svg.selectAll('.xlabel').remove()
        var h = 20;
        for ( const [fact, label] of Object.entries(FACTS)) {
          chartGroup.append('text')
            .classed('xlabel', true)
            .attr('transform', `translate(${width/2}, ${height + margin.top/2 + h})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('fill', function() {
                if (FACT == fact) return 'black'
                else return 'gray'
             })
            .text(label)
            .on('click', function() {
                FACT = fact
                redraw()
            })
         h += 22
        }
    }

    function addYLabel() {
        svg.selectAll('.ylabel').remove()
        var w = 20;
        for ( const [risk, label] of Object.entries(RISKS)) {
          svg.append('text')
            .classed('ylabel', true)
            .attr('transform', `translate(${margin.left / 2 + w}, ${height/2 + 20}) rotate(-90)`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('fill', function() {
                if (RISK == risk) return 'black'
                else return 'gray'
             })
            .text(label)
            .on('click', function() {
                RISK = risk
                redraw()
            })
            w -= 22
        }
    }

    function ucFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function drawDataPoints(xScale, yScale) {
        svg.selectAll('circle').remove() // TODO: Change to animation instead
            var circleGroup = chartGroup.selectAll()
                .data(DATA)
                .enter()
                .append('g')
                .attr('transform', d => `translate(${xScale(d[FACT]) }, ${yScale(d[RISK]) })`)

            circleGroup.append('circle')
                .attr('r', '10')
                .attr('fill', 'steelblue')

            circleGroup.append('text')
                .text(d => d.abbr)
                .classed('state-abbr', true)
                .attr('x', -7)
                .attr('y', 3)

            var tip = d3.tip()
                .attr('class', 'tooltip')
                .style('opacity', 0.5)
                .html( d => {
                    let fact_val = d[FACT]
                    let risk_val = d[RISK]
                    return `${d.state}<br>${ucFirst(FACT)}: ${fact_val}%<br>${ucFirst(RISK)}: ${risk_val}%`
                 } ).hide()

            circleGroup.call(tip)

            circleGroup
                .on('mouseover', d => tip.show(d))
                .on('mouseout', d => tip.hide())
    }

    function addToolTips(xScale, yScale) {
        console.log('add tool tips')
    }

    function redraw() {
            addTitle()
            addXLabel()
            addYLabel()

            // X Axis
            svg.selectAll('.xaxis').remove()
            xScale = d3.scaleLinear()
                    .domain(d3.extent(DATA, d => d[FACT]))
                    .range([0, width])

            chartGroup.append('g')
                .classed('xaxis', true)
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(xScale))

            // Y Axis
            svg.selectAll('.yaxis').remove()
            yScale = d3.scaleLinear()
                .domain(d3.extent(DATA, d => d[RISK]))
                .range([height, 0])
            chartGroup.append('g')
                .classed('yaxis', true)
                .call(d3.axisLeft(yScale))

            drawDataPoints(xScale, yScale)
            addToolTips(xScale, yScale)
    }
} // END
