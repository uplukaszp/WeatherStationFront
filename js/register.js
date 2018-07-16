function validate(input, message = "") {
    if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        setValidationMessage(input, "");
        return true;
    } else {
        input.classList.add('is-invalid');
        setValidationMessage(input, message);
        return false;
    }
}

function addValidation(input) {
    input.addEventListener('input', function () {
        validate(this);
    })
}

function setValidationMessage(input, message) {
    if (message.length > 0) {
        const messagediv = document.createElement('div');
        messagediv.classList.add("invalid-tooltip");
        messagediv.innerText = message;
        console.log(messagediv)
        input.parentNode.appendChild(messagediv);
    }else{
        if(input.parentNode.querySelector(".invalid-tooltip")!=null)
        input.parentNode.querySelector(".invalid-tooltip").remove();
    }
}


function arePasswordsEquals(password, confPass) {

    if (password.value === confPass.value) {
        confPass.classList.remove('is-invalid');
        setValidationMessage(confPass, "");
        return true;
    } else {
        confPass.classList.add('is-invalid');
        setValidationMessage(confPass, "Passwords must be the same.");
        return false;
    }
}

function validationProcess(email, password, confPass) {
    let isEmailValid = validate(email, "Please provide an email.")
    let isPasswordValid = validate(password, "Password must be at least 6 characters.");
    let arePasswordTheSame = arePasswordsEquals(password, confPass);
    return isEmailValid && isPasswordValid && arePasswordTheSame;
}


function getDataToSend(inputEmail, inputPassword) {
    const dataToSend = {
        email: inputEmail.value,
        password: inputPassword.value
    };
    return dataToSend;
}


document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById("btn")
    const email = document.getElementById("inputEmail");
    const password = document.getElementById("inputPassword");
    const confPass = document.getElementById("inputConfirmPassword");
    //  form.setAttribute('novalidate', true);

    addValidation(email);
    addValidation(password);
    addValidation(confPass);

    btn.addEventListener('click', e => {
        e.preventDefault();

        if (validationProcess(email, password, confPass)) {
            const dataToSend = getDataToSend(email, password);

            fetch('http://localhost:8080/sign-up', {
                mode:"cors",
                   // credentials:"include",
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                })
                .then(res => {
                    if (res.ok) {
                        window.location.href = 'login.html'
                    } else return res.json().then(Promise.reject.bind(Promise));
                })
                .then(function(res){
                    const response=res;
                    if (response.hasOwnProperty('email')) {
                        email.classList.add('is-invalid')
                        setValidationMessage(email,response.email);
                        console.log("email");
                    }
                    if (response.hasOwnProperty('password')) {
                        password.classList.add('is-invalid')
                        setValidationMessage(password,response.password);
                        console.log("pw");
                    }
                    console.log(response);
                })
        }
    });
})