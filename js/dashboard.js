function loadDashboardContent(content) {
    if (content === 'logout.html') window.location.href = content;
    const div = document.getElementById('content');
    //const hrefs=document.querySelectorAll('.');
    fetch('dashboard-content/' + content)
        .then(response => response.text())
        .then(response => {
            const dom = new DOMParser().parseFromString(response, 'text/html');
            if (div.firstChild) div.removeChild(div.firstChild);
            div.appendChild(dom.body);
            if (content === 'main.html') loadchart();
            if (content === 'account.html') {
                createValidation();
                addRemoveButtonListener();
            }
        })
}

document.addEventListener('DOMContentLoaded', function () {
    loadDashboardContent('account.html');
    const hrefs = document.querySelector('ul').querySelectorAll('a');
    hrefs.forEach(href => {
        href.addEventListener('click', function (e) {
            e.preventDefault();
            let link = href.href;
            const position = link.lastIndexOf('#');
            link = link.substring(position + 1);
            console.log(link);
            loadDashboardContent(link + '.html');

            hrefs.forEach(element => {
                element.classList.remove('active');
            });
            href.classList.add('active');
        })
    });

})