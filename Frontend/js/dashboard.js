import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// URL dinámica para desarrollo y producción
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://taekwonup.onrender.com/api";

const nombre = document.getElementById("nombreUsuario");
const nivel = document.getElementById("nivel");
const puntaje = document.getElementById("puntaje");
const totalEvaluaciones = document.getElementById("totalEvaluaciones");
const ultimaEvaluacion = document.getElementById("ultimaEvaluacion");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/dashboard/${user.uid}`);
        const datos = await respuesta.json();

        if (!datos.ok) {
            alert(datos.mensaje);
            return;
        }

        nombre.textContent = datos.nombre;
        nivel.textContent = datos.nivel;
        puntaje.textContent = datos.puntaje;
        totalEvaluaciones.textContent = datos.evaluaciones;

        if (datos.ultimaEvaluacion) {
            const fecha = new Date(datos.ultimaEvaluacion);
            ultimaEvaluacion.textContent = fecha.toLocaleDateString("es-CO");
        } else {
            ultimaEvaluacion.textContent = "Sin registros";
        }
    } catch (error) {
        console.error(error);
        alert("No fue posible cargar la información del Dashboard.");
    }
});

// Eventos de navegación
document.getElementById("logout")?.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "../index.html";
});

document.getElementById("btnEvaluar")?.addEventListener("click", () => {
    window.location.href = "./evaluacion.html";
});

document.getElementById("btnHistorial")?.addEventListener("click", () => {
    window.location.href = "./historial.html";
});

document.getElementById("btnPerfil")?.addEventListener("click", () => {
    window.location.href = "./perfil.html";
});

document.getElementById("btnRutina")?.addEventListener("click", () => {
    window.location.href = "./rutinas.html";
});
