





function validationProcess(email, password) {
    let isEmailValid = validate(email, "Please provide your email.");
    let isPasswordValid = validate(password, "Please provide your password.");
    return isEmailValid && isPasswordValid;
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
                        //token=token.replace("Bearer ","");
                        localStorage.setItem("Token",token);
                        window.location.href='dashboard.html'
                    } else {
                        console.log('else');
                        return res.json().then(Promise.reject.bind(Promise));
                    }

                }).catch(function(res){
                        email.classList.add('is-invalid')
                        password.classList.add('is-invalid')
                        setValidationMessage(email, 'Login failed: Invalid email or password');
                        password.classList.add('is-invalid')
                })
        }
    })

})