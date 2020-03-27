
var config = {
    type: 'line',
    data: {
        labels: [0],
        datasets: [{
            label: 'Max Score per Gen',
            backgroundColor: "#f00",
            borderColor: "#f00",
            data: [0],
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

window.updateLineCtx = function(maxScore, gen) {
    if (config.data.datasets.length > 0) {
        config.data.datasets.forEach(function(dataset) {
            dataset.data.push(maxScore);
        });
        config.data.labels.push(gen);

        window.maxScoreChart.update();
    }
}
