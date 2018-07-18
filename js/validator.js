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
function getDataToSend(inputEmail, inputPassword) {
    const dataToSend = {
        email: inputEmail.value,
        password: inputPassword.value
    };
    return dataToSend;
}