var restURL="https://javameteo.herokuapp.com";
//"http://localhost:8080";

function loadDashboardContent(content) {
    if (content === 'logout.html') window.location.href = content;
    const div = document.getElementById('content');
    fetch('dashboard-content/' + content)
        .then(response => response.text())
        .then(response => {
            const dom = new DOMParser().parseFromString(response, 'text/html');
            if (div.firstChild) div.removeChild(div.firstChild);
            div.appendChild(dom.body);
            if (content === 'main.html') {
                addSearchValidationAndListener();
                loadCharts();
            }
            if (content === 'account.html') {
                createValidationForPasswordChange();
                addRemoveButtonListener();
            }
            if (content === 'sensors.html') {
                createValidationForMeasurementSourceCreation();
                createSensorFormListener();
                loadMeasurementSources();
                loadUnits();
                loadApiKey();
            }
            feather.replace()
        })
}

document.addEventListener('DOMContentLoaded', function () {
    loadDashboardContent('main.html');
    const hrefs = document.querySelector('ul').querySelectorAll('a');
    hrefs.forEach(href => {
        href.addEventListener('click', function (e) {
            e.preventDefault();
            let link = href.href;
            const position = link.lastIndexOf('#');
            link = link.substring(position + 1);
            loadDashboardContent(link + '.html');

            hrefs.forEach(element => {
                element.classList.remove('active');
            });
            href.classList.add('active');
        })
    });

})