//Loads an array that contains the id charts to load
function loadChartArrayFromLocalStorage() {
  const array = JSON.parse(localStorage.getItem('ChartArray'));
  if (array === null) return new Array();
  return array;
}

//Save an array that contains the id charts to load
function saveChartArrayToLocalStorage(array) {
  localStorage.setItem('ChartArray', JSON.stringify(array));
}

//Creates chart on ctx and adds weather data to it
function addDataToChart(ctx, sensorData) {
  const measurements = sensorData.measurements;
  let dataToShowOnChart = [];
  moment().local(window.navigator.languages[0]);
  measurements.forEach(measurement => {
    dataToShowOnChart.push({
      y: measurement.value,
      x: measurement.date
    });
  })
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        data: dataToShowOnChart,
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
            return parseFloat(tooltipItem.yLabel.toString()).toFixed(2) + ' ' + sensorData.unit.symbol;
          },
          title: function (tooltipItem) {
            return new Date(tooltipItem[0].xLabel.toString()).toLocaleString();
          }
        }
      }
    }
  });
  return myChart;
}
//Creates div with information about minimum, maximum and current value
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


//Creates button for deleting a chart from dashboard
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
    clearSearchResultList();
  })
  divRow.appendChild(button);
  div.appendChild(divRow);
  return div;
}
//Load chart with a specyfic id
function loadchart(id) {
  const sensorDiv = document.createElement('div');
  const chartsDiv = document.querySelector('#charts');
  const content = document.createElement("div");
  const chartDiv = document.createElement('div');
  const chart = document.createElement("canvas")

  let sensorData;
  sensorsData.forEach(sensor => {
    if (sensor.id == id) {
      sensorData = sensor;
    }
  });

  sensorDiv.classList.add('col-md-6');
  content.classList.add("border");
  content.classList.add('rounded')
  sensorDiv.classList.add("p-0");
  content.classList.add('m-3');
  content.classList.add('p-3');
  chartDiv.classList.add("col-12");
  chartDiv.classList.add("chart-container");
  content.classList.add('row')

  chartDiv.appendChild(chart);
  content.appendChild(createDeleteButton(id));
  content.appendChild(chartDiv);
  content.appendChild(createInfoDiv(sensorData));

  sensorDiv.appendChild(content);
  chartsDiv.appendChild(sensorDiv);
  if (typeof sensorData !== "undefined") addDataToChart(chart, sensorData);
}


function checkIfContains(array, item) {
  var contain = false;
  array.forEach(element => {

    if (element == item) contain = true;
  });
  return contain;
}

//Creates an alert informing about errors during the search
function createErrorElement(message) {
  const li = document.createElement("li");
  const div = document.createElement("div");
  const button = document.createElement("button");

  li.classList.add('list-group-item');
  li.classList.add('border-0');

  div.classList.add("alert");
  div.classList.add("alert-danger");
  div.classList.add("alert-dismissible");
  div.classList.add("fade");
  div.classList.add("show");
  div.setAttribute("role", "alert");
  div.innerHTML = `<strong>Error: </strong>${message}`;

  button.classList.add("close");
  button.setAttribute("type", "button");
  button.setAttribute("data-dismiss", "alert");
  button.setAttribute("aria-label", "Close");
  button.innerHTML = `<span aria-hidden="true">&times;</span>`;
  button.addEventListener('click', function () {
    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
  })
  div.appendChild(button);
  li.appendChild(div);

  return li;
}

//Creates list element which contains a single search result
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
    loadCharts();
  })
  return li;
}

function clearSearchResultList() {
  const ul = document.querySelector('.list-group-flush');
  while (ul.firstChild != null) ul.removeChild(ul.firstChild);

}

function clearChartsDiv() {
  const chartsDiv = document.querySelector('#charts');
  while (chartsDiv.firstChild != null) chartsDiv.removeChild(chartsDiv.firstChild);
}

//Adds validation to search form, and action listener to submit button
function addSearchValidationAndListener() {
  const button = document.querySelector("#searchButton");
  const searchInput = document.querySelector("#searchInput");
  const radiusInput = document.querySelector("#radiusInput")
  const ul = document.querySelector('.list-group-flush');
  addValidation(searchInput);
  addValidation(radiusInput);
  button.addEventListener("click", function (e) {
    e.preventDefault();
    if (validate(searchInput, "Can not be empty") && validate(radiusInput, "Must be positive integer")) {
      this.innerText = "Loading...";
      this.disabled = true;
      fetch(restURL + '/measurementSource?address=' + encodeURI(searchInput.value), {
          mode: "cors",
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('Token')
          },
        })
        .then(res => {
          if (res.ok) {
            clearSearchResultList();
            res.json()
              .then(data => {
                data.forEach(source => {
                  source.sensors.forEach(sensor => {
                    ul.appendChild(createListElement(sensor, source.name, parseFloat(source.location.distance).toFixed(2) + 'km'));
                    this.innerText = "Find";
                    this.disabled = false;
                  })
                });
              })
          } else {
            throw Error(res.status)
          };
        }).catch(function (error) {
          button.innerText = "Find";
          button.disabled = false;
          switch (error.message) {
            case "404":
              ul.appendChild(createErrorElement("Can not find address"));
              break;
            case "400":
              ul.appendChild(createErrorElement("Inaccurate address. Please enter more detailed data"));
              break;
            case "500":
              ul.appendChild(createErrorElement("Internal server error.Please try again later"));
            case "403":
              window.location.href = "logout.html";
              break;
            default:
              ul.appendChild(createErrorElement("Unknown error"));
              break;
          }

        })
    }
  });
}
function calculateStartDate()
{
  switch(window.localStorage.getItem("dropdownMenuItemId")){
    case "dItem-0":
    return moment().subtract(1,"day"); 
    case "dItem-1":
    return moment().subtract(2,"day");
    case "dItem-2":
    return moment().subtract(7,"day");
    case "dItem-3":
    return moment().subtract(1,"month");
    case "dItem-4":
    return moment().subtract(1,"year");
    case "dItem-5":
    return null;
  }
}

//Gets data from remote server, about sensors saved in LocalStorage and shows this data on charts 
function loadCharts() {
  const chartIds = loadChartArrayFromLocalStorage();
  const startDate=calculateStartDate().format("YYYY-MM-DDTHH:mm:ssZ");
  const endDate=moment().format("YYYY-MM-DDTHH:mm:ssZ");
  console.log(startDate);
  console.log(endDate);
  let url;
  if(startDate===null)url=restURL + '/sensor?id=' + encodeURI(JSON.stringify(chartIds));
  else url=restURL + '/sensor?id=' + encodeURIComponent(JSON.stringify(chartIds))+"&startDate="+encodeURIComponent(startDate)+"&endDate="+encodeURIComponent(endDate)

  clearChartsDiv();
  fetch(url, {
      mode: 'cors',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.localStorage.getItem('Token')
      },
    })
    .then(res => {
      if (res.ok) {
        res.json().then(data => {
          sensorsData = data
          chartIds.forEach(chartId => {
            loadchart(chartId);
          });
        })
      } else throw Error(res.status);
    }).catch(error => {
      switch (error.message) {
        case "403":
          window.location.href = "logout.html";
          break;
        default:
          //TODO
          console.log("Error while reciving sensor data" + error.message);
          break;
      }
    });
}

function switchMenuItems(menuButton,menuItems,clickedItem){
  menuItems.forEach(item=>{
    if(item.classList.contains('d-none'))item.classList.remove('d-none');
  })
  clickedItem.classList.add('d-none');
  menuButton.innerText=clickedItem.innerText;
  window.localStorage.setItem('dropdownMenuItemId',clickedItem.id);
}
function addDropDownListener(dropdownMenubutton,dropdownMenuItems){
  
  dropdownMenuItems.forEach(item=>item.addEventListener("click",function(){
      switchMenuItems(dropdownMenubutton,dropdownMenuItems,this);
      loadCharts();
  }))
}

function initializeDropdownMenu(){
  let activeMenuItemId=window.localStorage.getItem('dropdownMenuItemId');
  if(typeof activeMenuItemId==='undefined')activeMenuItem="dItem-0";
  const dropdownMenubutton=document.querySelector("#dropdownMenuButton");
  const dropdownMenuItems=document.querySelectorAll(".dropdown-item");
  const activeMenuItem=document.querySelector("#"+activeMenuItemId);
  console.log(activeMenuItem);
  addDropDownListener(dropdownMenubutton,dropdownMenuItems);
  switchMenuItems(dropdownMenubutton,dropdownMenuItems,activeMenuItem);
}