import { useApp } from "../../../context/AppContext";
import { useEffect, useState, useRef } from "react";
import { shiftColor } from "../../../utils/analyticsUtils";
import { RAINBOW }  from '../../../utils/constants';
import { getTotals, getAnalytics } from '../../../utils/api';
import Chart from 'chart.js/auto';

const Analytics = () => {
    const { sightings, filters } = useApp();
    const barRef = useRef(null);
    const lineRef = useRef(null);
    const timeRef = useRef(null);
    const chartsRef = useRef({});

    const [totals, setTotals] = useState(null);

    let gradient = { width: null, height: null, gradient: null }

    const getGradient = (ctx, chartArea) => {
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;

        if(!gradient.gradient || gradient.width !== chartWidth || gradient.height !== chartHeight) {
            gradient.width = chartWidth;
            gradient.height = chartHeight;
            const g = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            g.addColorStop(0, RAINBOW.red);
            g.addColorStop(0.33, RAINBOW.yellow);
            g.addColorStop(0.67, RAINBOW.green);
            g.addColorStop(1, RAINBOW.blue);
            

            gradient.gradient = g;
        }
        return gradient.gradient;
    };

    const removeAllData = (chart) => {
        chart.data.labels.length = 0;
        chart.data.datasets.forEach((dataset) => (dataset.data.length = 0));
        chart.update();
    };

    const initCharts = (sightings) => {
        if(barRef.current) {
            if (chartsRef.current.bar) {
                chartsRef.current.bar.destroy();
            }
            chartsRef.current.bar = new Chart(barRef.current, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [],
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    scales: {
                        x: { stacked: true },
                        y: { stacked: true },
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Species Distribution by Taxon', 
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: { top: 10, bottom: 20 }
                        }
                    }
                },
            });
        }

        if(lineRef.current) {
            if (chartsRef.current.line) {
                chartsRef.current.line.destroy();
            }
            chartsRef.current.line = new Chart(lineRef.current, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Observations by Year',
                            data: [],
                            borderWidth: 2,
                            borderColor: function (context) {
                                const chart = context.chart;
                                const { ctx, chartArea } = chart;
                                if (!chartArea) return;
                                return getGradient(ctx, chartArea);
                            },
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Number of Sightings by Year', 
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: { top: 10, bottom: 20 }
                        }
                    }
                },
            });
        }

        if(timeRef.current) {
            if(chartsRef.current.time) {
                chartsRef.current.time.destroy()
            }
            chartsRef.current.time = new Chart(timeRef.current, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Observations by Time',
                            data: [],
                            borderWidth: 2,
                            borderColor: function (context) {
                                const chart = context.chart;
                                const { ctx, chartArea } = chart;
                                if (!chartArea) return;
                                return getGradient(ctx, chartArea);
                            },
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Number of Sightings by Time',
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: { top: 10, bottom: 20 }
                        }
                    }
                }
            })
        }
    };

    const refreshCharts = (data) => {
    if (chartsRef.current.bar) {
        const species = data.species;

        removeAllData(chartsRef.current.bar);

        chartsRef.current.bar.data.labels = [
            'Mammal',
            'Bird',
            'Reptile'
        ];

        chartsRef.current.bar.data.datasets =
            Object.keys(species).map(name => {
                const colors = [
                    shiftColor(RAINBOW.blue, name),
                    shiftColor(RAINBOW.green, name),
                    shiftColor(RAINBOW.yellow, name)
                ];

                return {
                    label: name,
                    data: [
                        species[name].mammal,
                        species[name].bird,
                        species[name].reptile
                    ],
                    backgroundColor: colors,
                    borderColor: [
                        'rgba(255, 255, 255, 0.5)',
                        'rgba(255, 255, 255, 0.5)',
                        'rgba(255, 255, 255, 0.5)'
                    ],
                    borderWidth: 1.5,
                    borderSkipped: false
                };
            });

        chartsRef.current.bar.update();
    }

    if (chartsRef.current.line) {
        const years = data.years;
        const labels = Object.keys(years).sort();

        removeAllData(chartsRef.current.line);

        chartsRef.current.line.data.labels = labels;
        chartsRef.current.line.data.datasets[0].data =
            labels.map(year => years[year]);

        chartsRef.current.line.update();
    }

    if (chartsRef.current.time) {
        const times = data.times;
        const labels = Object.keys(times).sort((a, b) => a - b);

        removeAllData(chartsRef.current.time);

        chartsRef.current.time.data.labels =
            labels.map(hour => `${hour}:00`);

        chartsRef.current.time.data.datasets[0].data =
            labels.map(hour => times[hour]);

        chartsRef.current.time.update();
    }
};



    useEffect(() => {
        async function fetchTotals() {
            const data = await getTotals();
            setTotals(data);
        }

        fetchTotals();

        Object.values(chartsRef.current).forEach((chart) => {
            if (chart) {
                chart.destroy();
            }
        });

        chartsRef.current = {};
        
        initCharts(sightings);

        
    }, []);

    useEffect(() => {
        const container = document.getElementById("analysis-content");

        if (!container) return;

        const observer = new ResizeObserver(() => {
            Object.values(chartsRef.current).forEach((chart) => {
                if (chart) {
                    chart.resize();
                }
            });
        });

        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchAnalytics = async () => {
            const data = await getAnalytics(filters);
            refreshCharts(data);
        };

        fetchAnalytics();   
    }, [
        filters.species,
        filters.state,
        filters.condition,
        filters.position,
        filters.dayRange,
        filters.dateRange,
        filters.road,
        filters.invert
    ]);

    return (
        <div id="analysis-content">
            <div className="total-container">
                <h3 className="total-note">
                    Total Sightings
                    <span>
                        {totals ? totals.total_observations.toLocaleString() : "Loading..."}
                    </span>
                </h3>

                <h3 className="total-note">
                    Total Species
                    <span>
                        {totals ? totals.total_species.toLocaleString() : "Loading..."}
                    </span>
                </h3>
            </div>
            
            <div className="chart-wrapper" id='species-chart'>
                <canvas ref={barRef} className="chart" />
            </div>

            <div className="chart-wrapper" id='year-chart'>
                <canvas ref={lineRef} className="chart" />
            </div>

            <div className='chart-wrapper' id='time-chart'>
                <canvas ref={timeRef} className='chart' />
            </div>
        </div>
    );

}

export default Analytics;