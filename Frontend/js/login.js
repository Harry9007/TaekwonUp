import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            correo,
            password
        );

        window.location.href = "../dashboard.html";

    } catch (error) {

        switch (error.code) {

            case "auth/invalid-credential":

                alert("Correo o contraseña incorrectos.");
                break;

            case "auth/user-not-found":

                alert("El usuario no existe.");
                break;

            case "auth/wrong-password":

                alert("Contraseña incorrecta.");
                break;

            default:

                alert(error.message);

        }

    }

});
