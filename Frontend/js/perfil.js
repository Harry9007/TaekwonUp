import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// URL dinámica para desarrollo y producción
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://taekwonup.onrender.com/api";

const nombre = document.getElementById("nombre");
const documento = document.getElementById("documento");
const edad = document.getElementById("edad");
const sexo = document.getElementById("sexo");
const correo = document.getElementById("correo");
const nivel = document.getElementById("nivel");
const puntaje = document.getElementById("puntaje");
const fechaRegistro = document.getElementById("fechaRegistro");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "./index.html";
        return;
    }

    cargarPerfil(user.uid);
});

async function cargarPerfil(uid) {
    try {
        const respuesta = await fetch(`${API_URL}/perfil/${uid}`);
        const datos = await respuesta.json();

        if (!respuesta.ok || !datos.ok) {
            alert(datos.mensaje || "No fue posible cargar el perfil.");
            return;
        }

        const usuario = datos.usuario;

        nombre.textContent = usuario.nombre || "No registrado";
        documento.textContent = usuario.documento || "No registrado";
        edad.textContent = usuario.edad || "No registrada";
        sexo.textContent = usuario.sexo || "No registrado";
        correo.textContent = usuario.correo || "No registrado";
        nivel.textContent = usuario.nivel || "Sin evaluar";
        puntaje.textContent = usuario.puntaje ?? "0";

        if (usuario.fecha_registro) {
            const fecha = new Date(usuario.fecha_registro);
            fechaRegistro.textContent = fecha.toLocaleDateString("es-CO");
        } else {
            fechaRegistro.textContent = "No registrada";
        }
    } catch (error) {
        console.error("Error cargando perfil:", error);
        alert("No fue posible conectar con el servidor.");
    }
}

// Control seguro de botones de retorno
const btnVolver = document.getElementById("volver") || document.getElementById("btnVolver");
if (btnVolver) {
    btnVolver.addEventListener("click", () => {
        window.location.href = "./dashboard.html";
    });
}
