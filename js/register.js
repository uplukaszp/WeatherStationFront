

function validationProcess(email, password, confPass) {
    let isEmailValid = validate(email, "Please provide an email.")
    let isPasswordValid = validate(password, "Password must be at least 6 characters.");
    let arePasswordTheSame = arePasswordsEquals(password, confPass);
    return isEmailValid && isPasswordValid && arePasswordTheSame;
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

            fetch('http://localhost:8080/user', {
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