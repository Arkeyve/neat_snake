
var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Max Score per Gen',
            backgroundColor: "#f00",
            borderColor: "#f00",
            data: [],
            fill: false,
        }, {
            label: 'Max Length per Gen',
            backgroundColor: "#0f0",
            borderColor: "#0f0",
            data: [],
            fill: false,
        }, {
            label: 'Mean Score of All Gen',
            backgroundColor: "#ff0",
            borderColor: "#ff0",
            data: [],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Generation'
                }
            },
            y: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Max Score'
                }
            }
        }
    }
};

window.loadLineCtx = function() {
    var lineCtx = document.getElementById('lineChart').getContext('2d');
    window.maxScoreChart = new Chart(lineCtx, config);
};

window.updateLineCtx = function(maxScore, maxScoreOfAllGen, meanScoreOfAllGen, gen) {
    if (config.data.datasets.length > 0) {
        config.data.datasets[0].data.push(maxScore);
        config.data.datasets[1].data.push(maxScoreOfAllGen);
        config.data.datasets[2].data.push(meanScoreOfAllGen);

        config.data.labels.push(gen);

        window.maxScoreChart.update();
    }
}
