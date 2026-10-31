import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Configuración de URL dinámica (Localhost vs Render)
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://taekwonup.onrender.com/api"; // 👈 Tu URL real de Render

const boton = document.getElementById("btnCalcular");

// Botón de retorno al Dashboard
document.getElementById("btnVolver")?.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// Proteger la vista: Redirigir si no hay sesión activa
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    }
});

// Event Listener para realizar el cálculo de evaluación
boton?.addEventListener("click", async () => {
    const flexionesInput = document.getElementById("flexiones")?.value;
    const abdominalesInput = document.getElementById("abdominales")?.value;
    const patadasInput = document.getElementById("patadas")?.value;

    const flexiones = parseInt(flexionesInput);
    const abdominales = parseInt(abdominalesInput);
    const patadas = parseInt(patadasInput);

    if (isNaN(flexiones) || isNaN(abdominales) || isNaN(patadas)) {
        alert("Complete todos los campos con números válidos.");
        return;
    }

    try {
        const usuarioFirebase = auth.currentUser;

        if (!usuarioFirebase) {
            alert("Debe iniciar sesión para realizar la evaluación.");
            window.location.href = "index.html";
            return;
        }

        // 1. Buscar usuario en MySQL a través de la API
        const respuestaUsuario = await fetch(`${API_URL}/usuarios/firebase/${usuarioFirebase.uid}`);
        
        if (!respuestaUsuario.ok) {
            throw new Error("No se pudo obtener el usuario de la base de datos.");
        }

        const usuarioDatos = await respuestaUsuario.json();
        
        // Soporta respuesta directa o dentro de usuarioDatos.usuario / usuarioDatos.id
        const usuarioId = usuarioDatos.id || usuarioDatos.usuario?.id;

        if (!usuarioId) {
            alert("No se encontró el ID de usuario en el servidor.");
            return;
        }

        console.log("Usuario MySQL ID:", usuarioId);

        // 2. Enviar evaluación a la API
        const respuesta = await fetch(`${API_URL}/evaluaciones`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario_id: usuarioId,
                flexiones,
                abdominales,
                patadas
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || (resultado.ok !== undefined && !resultado.ok)) {
            alert(resultado.mensaje || "Error al procesar la evaluación.");
            return;
        }

        console.log("Resultado Evaluación:", resultado);

        // 3. Actualizar la interfaz
        const elemResultado = document.getElementById("resultado");
        const elemMensaje = document.getElementById("mensaje");

        if (elemResultado) elemResultado.innerHTML = `🥋 Nivel: ${resultado.nivel}`;
        if (elemMensaje) elemMensaje.innerHTML = `Puntaje obtenido: ${resultado.puntaje}`;

    } catch (error) {
        console.error("Error en la evaluación:", error);
        alert("Error al registrar la evaluación. Intente nuevamente.");
    }
});
