//List of Measurement Sources recieved from server
var measurementSources = [];
//List of units recieved form server
var units = [];

//Checks if all fields from Measurement Source creation form are valid
//return true if they are
function measurementSourceCreationValidationProcess(name, latitude, longitude) {
    let isNameValid = validate(name, "Name cannot be empty");
    let isLatitudeValid = validate(latitude, "Please provide correct latitude");
    let isLongitudeValid = validate(longitude, "Please provide correct longitude");
    return isNameValid && isLatitudeValid && isLongitudeValid;
}

//Adds validation and action listener for submit button from Measurement Source creation form
function createValidationForMeasurementSourceCreation() {
    const btn = document.getElementById("btn")
    const form = document.getElementById('createSourceForm');
    const name = document.getElementById("measurementSourceName");
    const latitude = document.getElementById("latitude");
    const longitude = document.getElementById("longitude");
    const publiclyCheck = document.getElementById("publiclyCheck");

    addValidation(name);
    addValidation(latitude);
    addValidation(longitude);

    btn.addEventListener('click', e => {
        e.preventDefault();
        if (measurementSourceCreationValidationProcess(name, latitude, longitude)) {
            const dataToSend = {
                name: name.value,
                latitude: latitude.value,
                longitude: longitude.value,
                publicly: publiclyCheck.checked,
            }
            fetch(restURL + '/measurementSource', {
                    mode: "cors",
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': window.localStorage.getItem('Token')
                    },
                    body: JSON.stringify(dataToSend)
                }).then(res => {
                    if (res.ok) {
                        form.reset();
                        loadMeasurementSources();
                    } else if (res.status == "403") {
                        throw Error(res.status);
                    } else return res.json().then(Promise.reject.bind(Promise));
                })
                .catch(function (res) {
                    const response = res;
                    if (res.message === "403") {
                        window.location.href = "logout.html";
                    }
                    if (response.hasOwnProperty('name')) {
                        name.classList.add('is-invalid')
                        setValidationMessage(name, response.name);
                    }
                    if (response.hasOwnProperty('latitude')) {
                        latitude.classList.add('is-invalid')
                        setValidationMessage(latitude, response.latitude);
                    }
                    if (response.hasOwnProperty('longitude')) {
                        longitude.classList.add('is-invalid')
                        setValidationMessage(longitude, response.longitude);
                    }
                })
        }
    })
}
//Returns difference in minutes between given date and the present
function getTimeInMinuteFromDate(date) {
    const now = new Date();
    const last = new Date(date);
    return Math.floor(((now - last) / 1000) / 60);

}

//Creates list with sensors created by user
function fillSensorsList(index) {
    const sensorList = document.querySelectorAll('.list-group')[1];
    while (sensorList.firstChild) {
        sensorList.removeChild(sensorList.firstChild);
    }
    const sensors = measurementSources[index].sensors;
    for (let sensor of sensors) {
        const li = document.createElement('li');

        const last = sensor.measurements;
        const lastTime = (last === null || last.date === null) ? '-' : getTimeInMinuteFromDate(last.date);
        const lastValue = (last === null || last.value === null) ? '-' : last.value;
        li.classList.add('list-group-item');
        li.innerHTML = `
        <div class="row text-left wrap">
            <span class="col-md-4">
                <h6>Value:</h6>
                <small>${lastValue} ${sensor.unit.symbol}</small>
             </span>
            <span class="col-md-4">
                <h6>Time</h6>
                <small>${lastTime} min. ago</small>
            </span>
            <span class="col-md-4">
                <h6>Id</h6>
                <small>${sensor.id}</small>
            </span>
        </div>`;
        sensorList.appendChild(li);
    }
}
//Creates list with Measurement Sources created by user
function fillMeasurementSourcesList() {
    const list = document.querySelector('.list-group');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    for (let source of measurementSources) {
        const button = document.createElement('button');
        button.classList.add('list-group-item');
        button.classList.add('list-group-item-action');
        button.innerHTML = ` 
        <div class="row text-left wrap">
            <span class="col-md-3">
                <h6>Name:</h6>
                <small>${source.name}</small>
             </span>
            <span class="col-md-3">
                <h6>Publicly</h6>
                <small>${source.publicly}</small>
            </span>
            <span class="col-md-3">
                <h6>Longitude</h6>
                <small>${source.location.longitude}</small>
            </span>
            <span class="col-md-3">
                <h6>Latitude</h6>
                <small>${source.location.latitude}</small>
            </span>
        </div>`;
        list.appendChild(button);
    }
    if (list.children.length > 0) {
        list.children[0].classList.add('active');
        fillSensorsList(0);
    }
}

//Adds event listener to measurement sources list, which switch list of sensors, based on the selected source 
function addMeasurementSourcesListEventListener() {
    const buttons = document.querySelector('.list-group').children;
    for (let button of buttons) {
        button.addEventListener("click", function () {
            for (let button of buttons) {
                button.classList.remove('active');
            }
            this.classList.add('active');
            const index = Array.prototype.indexOf.call(buttons, this);
            fillSensorsList(index);
        })
    }
}
// Fills  source selector used to create sensors
function fillMeasurementSourceSelector() {
    const selector = document.getElementById('sourceSelector');
    for (let i = selector.options.length - 1; i >= 0; i--) {
        selector.remove(i);
    }
    for (let source of measurementSources) {
        const option = document.createElement("option");
        option.innerText = source.name;
        selector.add(option);
    }
}
// Loads Measurement sources data from server
function loadMeasurementSources() {
    fetch(restURL + '/measurementSource', {
            mode: "cors",
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then(res => {
            if (res.ok) {
                res.json().then(res => {
                    measurementSources = res;
                    fillMeasurementSourcesList();
                    addMeasurementSourcesListEventListener();
                    fillMeasurementSourceSelector();
                })
            } else throw Error(res.status);
        })
        .catch(error => {
            switch (error.message) {
                case "403":
                    window.location.href = "logout.html";
                    break;
                default:
                    //TODO
                    console.log("Error while reciving sensor data" + error.message);
                    break;
            }
        })
}

// Fills  unit  selector used to create sensors
function fillUnitSelector() {
    const selector = document.getElementById('unitSelector');
    for (let unit of units) {
        const option = document.createElement("option");
        option.innerText = unit.symbol;
        selector.add(option);
    }
}

//Loads units  list from server
function loadUnits() {
    fetch(restURL + '/unit', {
            mode: "cors",
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then(res => res.json())
        .then(res => {
            units = res;
            fillUnitSelector();
        })
}

//Adds submit listener to the form which create a new sensor
function createSensorFormListener() {
    const button = document.getElementById('btn2');
    const form = document.getElementById('addSensorForm');
    const unitSelector = document.getElementById('unitSelector');
    const sourceSelector = document.getElementById('sourceSelector');
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const dataToSend = {
            source: measurementSources.find(function (element) {
                return element.name === sourceSelector.value;
            }).id,
            unit: units.find(function (element) {
                return element.symbol === unitSelector.value;
            }).id
        }
        fetch(restURL + '/sensor', {
            mode: "cors",
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.localStorage.getItem('Token')
            },
            body: JSON.stringify(dataToSend)
        }).then(res => {
            if (res.ok) {
                form.reset();
                loadMeasurementSources();
            }
        })
    })
}

//Loads user API key from server
function loadApiKey() {
    const apiInput = document.getElementById('key');
    fetch(restURL + '/key', {
            mode: "cors",
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': window.localStorage.getItem('Token')
            }
        }).then(res => res.json())
        .then(res => {
            const response = res;
            apiInput.value = response.accessKey;
        })

}