
const usersUrl = ('http://localhost:5678/api/users/login');

function login (){

const loginForm = document.querySelector('form');
if (!loginForm) return;

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = document.getElementById('btnLogin');
    submitButton.disabled = true;
    submitButton.textContent = "Connexion...";

    const emailValue = document.getElementById('email').value.trim();
    const passwordValue = document.getElementById('password').value;

    if (emailValue===''||passwordValue==''){
        alert('Tous les champs doivent etre remplies.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        errorMsg = document.getElementById('error-message');
        errorMsg.textContent = 'Veuillez entrer un email valide!';
        return;
    }

    const chargeUtile = {
        email: emailValue,
        password: passwordValue
    }

    try {
        const response = await fetch(usersUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(chargeUtile),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('connexion réussie', data);

            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        }else{
            errorMsg = document.getElementById('error-message');
            errorMsg.textContent = 'Identifiants incorects!';
        }
    } catch (error) {
        console.error("Erreur de connexion au serveur", error);
        Toastify({
            text: "Le serveur ne repond pas",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #f87d2aff, #ff630eff)",
            },
        onClick: function(){} // Callback after click
        }).showToast();
    }finally{
        submitButton.disabled = false;
        submitButton.textContent = "Se connecter";
    }
})
}login();





