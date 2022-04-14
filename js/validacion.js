const formulario = document.querySelector('#formulario-contacto');

const botonEnviar = document.querySelector('.btn-enviar');

const contactName = document.getElementsByName("name_contact")[0];
const email = document.getElementsByName("email_contact")[0];
const phone = document.getElementsByName("phone_contact")[0];
const topic = document.getElementById("topic_contact");
const commit = document.getElementsByName("commit_contact")[0];

const errorsList = document.getElementById('errors');

function showError(element, message) {
    element.classList.toggle('error');
    errorsList.innerHTML += `<li>${message}</li>`;
}

function cleanErrors() {
    errorsList.innerHTML = "";
}
/*
// Desafío opcional: qué elemento y evento podríamos usar para detectar si el usuario apreta Enter en vez de hacer click?
botonEnviar.addEventListener('keyup', () => {
    if(e.keyCode === 13) {
        // TODO EL CODIGO NUEVAMENTE, NO?
    }
});
*/
async function sendMail(name, email, phone, select, comment) {
    const rawResponse = await fetch('https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, email, phone, select, comment})
    });
    const content = await rawResponse.json();

    if(Object.keys(content.errors).length > 0) {
        alert('ERROR AL ENVIAR');
    } else {
        alert('FORMULARIO VALIDADO');
    }
    
}

botonEnviar.addEventListener('click', (event) => {
    event.preventDefault();
    cleanErrors();
    let hasErrors = false;

    const sanitizedName = contactName.value.trim();
    if(sanitizedName.length == 0 || sanitizedName.indexOf(' ') < 0) {
        showError(contactName, 'Verifica el nombre nuevamente, no contiene al menos un espacio')
        hasErrors = true;
    }
    
    const mailRe = /^\w+@\w+\.\w{2,7}$/;
    if(!mailRe.exec(email.value)) {
        showError(email, 'Verifica tu correo nuevamente, correo no valido')
        hasErrors = true;
    }

    const phoneRe = /^\+?\d{7,15}$/;
    const sanitizedPhone = phone.value.replace(" ","");
    if(!phoneRe.exec(sanitizedPhone)) {
        showError(phone, 'Verifica el numero nuevamente, numero ingresado no valido')
        hasErrors = true;
    }

    const sanitizedCommit = commit.value.trim();
    if(sanitizedCommit.length < 20) {
        showError(commit, 'Mensaje invalido, verifica nuevamente')
        hasErrors = true;
    }
    
    if(!hasErrors) {
        sendMail(sanitizedName, email.value, sanitizedPhone, topic.value, sanitizedCommit);
    }
    
})


