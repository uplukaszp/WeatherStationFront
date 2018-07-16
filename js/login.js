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
        input.parentNode.appendChild(messagediv);
    } else {
        if (input.parentNode.querySelector(".invalid-tooltip") != null)
            input.parentNode.querySelector(".invalid-tooltip").remove();
    }
}




function validationProcess(email, password) {
    let isEmailValid = validate(email, "Please provide your email.");
    let isPasswordValid = validate(password, "Please provide your password.");
    return isEmailValid && isPasswordValid;
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

    addValidation(email);
    addValidation(password);

    btn.addEventListener('click', e => {
        e.preventDefault();

        if (validationProcess(email, password)) {
            const dataToSend = getDataToSend(email, password);

            fetch('http://localhost:8080/login', {
                    mode: "cors",

                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify(dataToSend)
                })
                .then(res => {
                    if (res.ok) {
                        let token=res.headers.get("Authorization");
                        token=token.replace("Bearer ","");
                        localStorage.setItem("Token",token);
                        window.location.href='dashboard.html'
                    } else {
                        console.log('else');
                        return res.json().then(Promise.reject.bind(Promise));
                    }

                }).catch(function(res){
                    if (res.hasOwnProperty('message')) {
                        email.classList.add('is-invalid')
                        password.classList.add('is-invalid')
                        setValidationMessage(email, res.message);
                        password.classList.add('is-invalid')
                    }
                })
        }
    })

})