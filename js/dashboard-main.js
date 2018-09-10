var sensorsData;
var chartArray;

function loadChartArrayFromLocalStorage() {
  const array = JSON.parse(localStorage.getItem('ChartArray'));
  if (array === null) return new Array();
  return array;
}

function saveChartArrayToLocalStorage(array) {
  localStorage.setItem('ChartArray', JSON.stringify(array));
}

function parseDate(date, format) {
  return moment(new Date(date)).format(format);
}

function addDataToChart(ctx, sensorData) {
  const measurements = (typeof sensorData !== 'undefined') ? sensorData.measurements : [];
  const format = "DD-MM-YYYY HH:mm:ss";
  let data = [];
  moment().local(window.navigator.languages[0]);
  console.log(window.navigator.languages[0]);
  measurements.forEach(measurement => {
    data.push({
      y: measurement.value,
      x: measurement.date
    });
  })
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      //labels: labels,
      datasets: [{
        data: data,
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 1,
        pointBackgroundColor: '#007bff',
        pointRadius: 1,
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }],
        xAxes: [{
          type: 'time',
          //distribution: 'series',
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
            source: 'data'
          },
        }]
      },
      title: {
        display: true,
        text: sensorData.source.name + ': ' + sensorData.unit.description,
        fontSize: 20,
      },
      legend: {
        display: false,
      },
      tooltips: {
        displayColors: false,
        callbacks: {
          label: function (tooltipItem) {
            return parseFloat(tooltipItem.yLabel.toString()).toFixed(2) + ' ' + unit.symbol;
          },
          title: function (tooltipItem) {
            //console.log(tooltipItem[0].xLabel.toString());
            return new Date(tooltipItem[0].xLabel.toString()).toLocaleString();
          }
        }
      }
    }
  });
  return myChart;
}

function createChart() {
  const chart = document.createElement("canvas");
  return chart;
}

function createInfoDiv(sensorData) {
  const informationsDiv = document.createElement('div');
  let min, max, current, unit;
  unit = {
    symbol: '-'
  };
  min = max = current = "-";
  if (typeof sensorData !== 'undefined') {
    if (sensorData.measurements.length > 0) {
      min = max = sensorData.measurements[0].value;
      sensorData.measurements.forEach(measurement => {
        if (measurement.value > max) max = measurement.value;
        if (measurement.value < min) min = measurement.value;
      });
      current = sensorData.measurements[sensorData.measurements.length - 1].value;
    }
    unit = sensorData.unit;
  }

  informationsDiv.classList.add("col-md-12");
  informationsDiv.innerHTML = `
  <div class="row justify-content-md-center">
    <div class="alert alert-success p-2 m-1 col-md-3">
      <h5>Now:</h5>
        <small>${current} ${unit.symbol}</small>
    </div>
    <div class="alert alert-danger p-2 m-1 col-md-3">
      <h5>Highest:</h5>
        <small>${max} ${unit.symbol}</small>
    </div>
    <div class="alert alert-info p-2 m-1 col-md-3">
      <h5>Lowest:</h5>
        <small>${min} ${unit.symbol}</small>
    </div>
  </div>`;
  return informationsDiv;

}

function loadCharts() {

  chartArray = loadChartArrayFromLocalStorage();
  getSensorData();

}

function createDeleteButton(id) {
  const div = document.createElement('div');
  const divRow = document.createElement('div');
  const button = document.createElement('button');

  div.classList.add('col-md-12');

  divRow.classList.add('row');
  divRow.classList.add('justify-content-md-end');
  divRow.classList.add('mr-2');

  button.classList.add('close');
  button.setAttribute('id', id);
  button.innerHTML = ` <span aria-hidden="true">&times;</span>`;
  button.addEventListener('click', function () {
    const div = this.parentNode.parentNode.parentNode.parentNode;
    const id = this.getAttribute('id');
    let array = loadChartArrayFromLocalStorage();
    div.parentNode.removeChild(div);
    for (let i = 0; i < array.length; i++) {

      if (array[i] == id) {
        array = array.slice(0, i).concat(array.slice(i + 1));
      }
    }
    saveChartArrayToLocalStorage(array);
    clearList();
  })
  divRow.appendChild(button);
  div.appendChild(divRow);


  return div;
}

function loadchart(id) {
  const sensorDiv = document.createElement('div');
  const chartsDiv = document.querySelector('#charts');
  const content = document.createElement("div");
  const chartDiv = document.createElement('div');
  const chart = createChart()

  let sensorData;
  sensorsData.forEach(sensor => {
    if (sensor.id == id) {
      sensorData = sensor;
    }
  });

  sensorDiv.classList.add('col-md-6');
  sensorDiv.classList.add("border");
  sensorDiv.classList.add("p-3");
  chartDiv.classList.add("col-md-12");
  chartDiv.classList.add("chart-container");
  content.classList.add('row')

  chartDiv.appendChild(chart);
  content.appendChild(createDeleteButton(id));
  content.appendChild(chartDiv);
  content.appendChild(createInfoDiv(sensorData));

  sensorDiv.appendChild(content);
  chartsDiv.appendChild(sensorDiv);
  addDataToChart(chart, sensorData);

}

function checkIfContains(array, item) {
  var contain = false;
  array.forEach(element => {

    if (element == item) contain = true;
  });
  return contain;
}

function createListElement(sensor, name, distance) {
  const li = document.createElement('li');
  let buttonHTML;
  const chartArray = loadChartArrayFromLocalStorage();
  if (!checkIfContains(chartArray, sensor.id)) {
    buttonHTML = ' <button class="btn btn-primary mb-3 m-3 col-md-2 btn-sm">Add</button>';
  } else {
    buttonHTML = ' <button class="btn btn-primary mb-3 m-3 col-md-2 btn-sm" disabled>Add</button>'
  }
  li.classList.add('list-group-item');
  li.innerHTML = `
  <div class="row text-left wrap" id=${sensor.id}>
          <span class="col-md-3">
            <h6>Name:</h6>
            <small>${name}</small>
          </span>
          <span class="col-md-3">
            <h6>Distance</h6>
            <small>${distance}</small>
          </span>
          <span class="col-md-3">
            <h6>Description</h6>
            <small>${sensor.unit.description} [${sensor.unit.symbol}]</small>
          </span>
         ${buttonHTML}
        </div>
  `;
  const button = li.querySelector('.btn');
  button.addEventListener('click', function () {
    const chartArray = loadChartArrayFromLocalStorage();
    chartArray.push(this.parentNode.id);
    saveChartArrayToLocalStorage(chartArray);
    const li = this.closest('.list-group-item');
    li.parentNode.removeChild(li);
    getSensorData();
  })
  console.log(li.innerHTML);
  return li;
}

function clearList() {
  const ul = document.querySelector('.list-group-flush');
  while (ul.firstChild != null) ul.removeChild(ul.firstChild);

}

function addSearchValidationAndListener() {
  const button = document.querySelector("#searchButton");
  const input = document.querySelector("#searchInput");
  const ul = document.querySelector('.list-group-flush');
  addValidation(input);
  button.addEventListener("click", function (e) {
    e.preventDefault();
    if (validate(input, "Can not be empty")) {
      this.innerText = "Loading...";
      this.disabled = true;
      fetch(restURL+'/measurementSource?address=' + encodeURI(input.value), {
          mode: "cors",
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('Token')
          },
        })
        .then(res => {
          const response = res;
          if (response.ok) {
            clearList();
            response.json()
              .then(data => {
                data.forEach(source => {
                  source.sensors.forEach(sensor => {
                    console.log('add');
                    ul.appendChild(createListElement(sensor, source.name, parseFloat(source.location.distance).toFixed(2) + 'km'));
                    this.innerText = "Find";
                    this.disabled = false;
                  })
                });
              })
          } // TODO ERROR CATCH
        })
    }
  });
}

function getSensorData() {
  const chartIds = loadChartArrayFromLocalStorage();
  console.log('sensor data');
  fetch(restURL+'/sensor?id=' + encodeURI(JSON.stringify(chartIds)), {
      mode: 'cors',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.localStorage.getItem('Token')
      },
    })
    .then(res => res.json().then(data => {
      sensorsData = data
      chartArray.forEach(chartId => {
        loadchart(chartId);
      });
    }));
}