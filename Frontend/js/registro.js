import { auth, db } from "./Frontend/firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const formulario = document.getElementById("registroForm");

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const documento = document.getElementById("documento").value.trim();
    const edad = parseInt(document.getElementById("edad").value);
    const sexo = document.getElementById("sexo").value;
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;

    if (password !== confirmar) {

        alert("Las contraseñas no coinciden.");
        return;

    }

    try {

        // Crear usuario en Firebase
        const credencial = await createUserWithEmailAndPassword(
            auth,
            correo,
            password
        );

        const usuario = credencial.user;

        // Guardar temporalmente en Firestore
        await setDoc(doc(db, "usuarios", usuario.uid), {

            nombre,
            documento,
            edad,
            sexo,
            correo,
            nivel: "Sin evaluar",
            fechaRegistro: new Date()

        });

        // Guardar en MySQL mediante la API en Render
        const respuesta = await fetch("https://taekwonup.onrender.com/api/usuarios", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                firebase_uid: usuario.uid,
                nombre,
                documento,
                edad,
                sexo,
                correo

            })

        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(resultado.mensaje || "Error al registrar el usuario.");

        }

        alert("Usuario registrado correctamente.");

        window.location.href = "./index.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});
