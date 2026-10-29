import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const API_URL = "http://localhost:3000/api";

const badgeNivel = document.getElementById("badgeNivel");
const contenedorEjercicios = document.getElementById("contenedorEjercicios");
const mensajeEstado = document.getElementById("mensajeEstado");
const btnVolver = document.getElementById("btnVolver");

// Validar Sesión de Firebase
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    cargarRutina(user.uid);
});

async function cargarRutina(uid) {
    try {
        mensajeEstado.textContent = "Obteniendo rutina adaptada...";

        const respuesta = await fetch(`${API_URL}/rutinas/${uid}`);
        const datos = await respuesta.json();

        if (!respuesta.ok || !datos.ok) {
            mensajeEstado.textContent = datos.mensaje || "Error al cargar la rutina.";
            return;
        }

        mensajeEstado.textContent = "";
        badgeNivel.textContent = `🥋 Nivel: ${datos.nivel}`;

        contenedorEjercicios.innerHTML = "";

        if (datos.rutina.length === 0) {
            mensajeEstado.textContent = "No hay ejercicios asignados.";
            return;
        }

        // Renderizar ejercicios
        datos.rutina.forEach((item) => {
            const card = document.createElement("div");
            card.className = "card-ejercicio";

            card.innerHTML = `
                <h3>${item.ejercicio}</h3>
                <span class="badge-cantidad">${item.cantidad}</span>
                <p>${item.descripcion}</p>
            `;

            contenedorEjercicios.appendChild(card);
        });

    } catch (error) {
        console.error("Error al obtener la rutina:", error);
        mensajeEstado.textContent = "Error de conexión con el servidor.";
    }
}

// Navegación
if (btnVolver) {
    btnVolver.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
}