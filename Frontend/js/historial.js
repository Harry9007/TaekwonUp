import { auth } from "./firebase.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Configuración de URL dinámica (Localhost vs Render)
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://taekwonup.onrender.com/api"; // 👈 Tu URL real de Render

const tbody = document.querySelector("#tablaHistorial tbody");
const mensaje = document.getElementById("mensajeHistorial");

// =========================================
// VERIFICAR USUARIO
// =========================================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    cargarHistorial(user.uid);
});

// =========================================
// CARGAR HISTORIAL
// =========================================
async function cargarHistorial(uid) {
    try {
        mensaje.textContent = "Cargando historial...";

        const respuesta = await fetch(
            `${API_URL}/historial/${uid}`
        );

        const datos = await respuesta.json();

        console.log("Respuesta historial:", datos);

        if (!respuesta.ok || !datos.ok) {
            mensaje.textContent =
                datos.mensaje || "No fue posible cargar el historial.";
            return;
        }

        tbody.innerHTML = "";

        if (datos.historial.length === 0) {
            mensaje.textContent =
                "Todavía no tienes evaluaciones registradas.";
            return;
        }

        mensaje.textContent = "";

        datos.historial.forEach((evaluacion) => {
            const fila = document.createElement("tr");

            const fecha = new Date(evaluacion.fecha);

            fila.innerHTML = `
                <td>
                    ${fecha.toLocaleDateString("es-CO")}
                </td>
                <td>
                    ${evaluacion.flexiones}
                </td>
                <td>
                    ${evaluacion.abdominales}
                </td>
                <td>
                    ${evaluacion.patadas}
                </td>
                <td>
                    ${evaluacion.puntaje}
                </td>
                <td>
                    🥋 ${evaluacion.nivel}
                </td>
            `;

            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error("ERROR COMPLETO:", error);
        mensaje.textContent =
            "Error: " + error.message;
    }
}

// =========================================
// VOLVER AL DASHBOARD
// =========================================
document.getElementById("volver")?.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});
