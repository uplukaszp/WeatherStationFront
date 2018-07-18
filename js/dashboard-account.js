function validationProcess(password, confPass) {
    let isPasswordValid = validate(password, "Password must be at least 6 characters.");
    let arePasswordTheSame = arePasswordsEquals(password, confPass);
    return isPasswordValid && arePasswordTheSame;
}


function createValidation() {
    const btn = document.getElementById("btn")
    const form = document.querySelector('.needs-validation');
    const password = document.getElementById("newPassword");
    const confPass = document.getElementById("confirmNewPassword");
    addValidation(password);
    addValidation(confPass);
    btn.addEventListener('click', e => {
        e.preventDefault();
        // e.stopPropagation();
        if (validationProcess(password, confPass)) {
            const dataToSend = {
                password: password.value
            };

            fetch('http://localhost:8080/user', {
                    mode: "cors",
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': window.localStorage.getItem('Token')
                    },
                    body: JSON.stringify(dataToSend)
                })
                .then(res => {
                    if (res.ok) {
                        password.value = "";
                        confPass.value = "";
                        const alert = document.createElement('div');
                        alert.innerHTML = `  <div class="alert alert-success alert-dismissible">
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>Success!</strong> Your password has been changed successfully!
                      </div>`;
                        const div = password.parentNode.parentNode.parentNode;
                        div.insertBefore(alert, div.firstChild);
                        form.reset();
                    } else return res.json().then(Promise.reject.bind(Promise));
                })
                .catch(function (res) {
                    const response = res;
                    if (response.hasOwnProperty('password')) {
                        password.classList.add('is-invalid')
                        setValidationMessage(password, response.password);
                        console.log("pw");
                    }
                })
        }
    });
}

function addRemoveButtonListener() {
    const button = document.getElementById('btn2');
    button.addEventListener('click', function () {
            const modalDiv = document.querySelector('.modal');
            const yesBtn = modalDiv.querySelector('.btn-danger');
            console.log(yesBtn);
            yesBtn.addEventListener('click', function () {
                    console.log("event");
                    fetch('http://localhost:8080/user', {
                        mode: "cors",
                        method: 'delete',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': window.localStorage.getItem('Token')
                        },
                    }).then(res => {
                            if (res.ok) {
                                window.location.href = 'logout.html';
                            } else return res.json().then(Promise.reject.bind(Promise));
                        
                    }).catch(res =>{
                        //TODO Error message
                    })
            })
    })
}