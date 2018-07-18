function addDataToChart(ctx) {
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      datasets: [{
        data: [15339, 21345, 18483, 24003, 23489, 24092, 12034],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false,
      }
    }
  });
  return myChart;
}

function createChart() {
  const chart = document.createElement("canvas");
  chart.classList.add("my-4");
  chart.classList.add("w-100");
  return chart;
}

function loadchart() {
  const content = document.querySelector('.chartDiv');
  const chart=createChart();
  content.appendChild(chart);
  addDataToChart(chart);

}