function loadDashboardContent(content) {
    if (content === 'logout.html') window.location.href = content;
    const div = document.getElementById('content');
    fetch('dashboard-content/' + content)
        .then(response => response.text())
        .then(response => {
            const dom = new DOMParser().parseFromString(response, 'text/html');
            if (div.firstChild) div.removeChild(div.firstChild);
            div.appendChild(dom.body.firstChild);
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

function addTogglerListener() {
    const toggler = document.querySelector('.navbar-toggler');
    toggler.addEventListener('click', function (e) {
        const main = document.querySelector('main');
        //animationendlistner
      /*  if (main.classList.contains('ml-sm-auto')) {
            main.classList.remove('ml-sm-auto');
            main.classList.remove('col-lg-10');
            main.classList.add('col-lg-12');
        }else{
            main.classList.add('ml-sm-auto');
            main.classList.remove('col-lg-12');
            main.classList.add('col-lg-10');
        }*/
    })
}
document.addEventListener('DOMContentLoaded', function () {
    //loadDashboardContent('main.html');
    loadDashboardContent("sensors.html");
    addTogglerListener();
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