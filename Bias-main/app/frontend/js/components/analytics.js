/**

Pie/stacked horizontal bar chart?
:
- Get frequency of all animals
- Frequency of broad taxon? (Mammals, birds, etc)
- Determine "other"

Line Chart:
- Get total number of observations by year

Histogram:
- Get total number of observations by time of day

 */
import { state } from '../app/state.js'
import { processSpeciesData, processYearData } from './analyticsData.js'

let chartCtxs = {}
let charts = {}

export const initCharts = (sightings) => {
    chartCtxs = {
        bar: document.querySelector('#pie-graph'),
        line: document.querySelector('#line-graph')
    }

    charts.bar = new Chart(chartCtxs.bar, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            },
            // plugins: {
            //     tooltip: {
            //         callbacks: {
            //             label: function(context) {
            //                 const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
            //                 const percent = ((context.raw / total) * 100).toFixed(1); 
            //                 return `${context.label}: ${context.raw} (${percent}%)`;
            //             }
            //         }
            //     }
            // },
        },
    });
    
    charts.line = new Chart(chartCtxs.line, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1,
                borderColor: function(context) {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;

                    if (!chartArea) {
                        return;
                    }

                    return getGradient(ctx, chartArea);
                }
            }],
            
        },
        
    })

    refreshCharts(state.sightings)
}

export const refreshCharts = (sightings) => {
    if(charts.bar) {
        console.log(sightings)
        const data = processSpeciesData(sightings)
        console.log('DATA', data)

        removeAllData(charts.bar)

        charts.bar.data.labels = data.labels;
        charts.bar.data.datasets = data.datasets;

        charts.bar.update();
    }
    
}

let width, height, gradient;
const getGradient = (ctx, chartArea) => {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;

    if(!gradient || width !== chartWidth || height !== chartHeight) {
        width = chartWidth;
        height = chartHeight;
        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(0.5, 'blue');
        gradient.addColorStop(1, 'green');
    }
    return gradient;
}


function addData(chart, label, newData) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData);
    });
    chart.update();
}

function removeAllData(chart) {
    chart.data.labels.length = 0;
    chart.data.datasets.forEach((dataset) => {
        dataset.data.length = 0;
    });
    chart.update();
}