import { auth } from "./firebase.js";

const boton = document.getElementById("btnCalcular");

// Botón de retorno al Dashboard
document.getElementById("btnVolver")?.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// Event Listener para realizar el cálculo de evaluación
boton?.addEventListener("click", async () => {
    const flexiones = parseInt(document.getElementById("flexiones").value);
    const abdominales = parseInt(document.getElementById("abdominales").value);
    const patadas = parseInt(document.getElementById("patadas").value);

    if (isNaN(flexiones) || isNaN(abdominales) || isNaN(patadas)) {
        alert("Complete todos los campos.");
        return;
    }

    try {
        const usuarioFirebase = auth.currentUser;

        if (!usuarioFirebase) {
            alert("Debe iniciar sesión.");
            return;
        }

        // Buscar usuario en MySQL
        const respuestaUsuario = await fetch(
            `http://localhost:3000/api/usuarios/firebase/${usuarioFirebase.uid}`
        );

        const usuario = await respuestaUsuario.json();

        console.log("Usuario MySQL:", usuario);

        // Enviar evaluación a la API
        const respuesta = await fetch("http://localhost:3000/api/evaluaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario_id: usuario.id,
                flexiones,
                abdominales,
                patadas
            })
        });

        const resultado = await respuesta.json();

        console.log("Resultado Evaluación:", resultado);

        // Actualizar la interfaz
        document.getElementById("resultado").innerHTML =
            "🥋 Nivel: " + resultado.nivel;

        document.getElementById("mensaje").innerHTML =
            "Puntaje obtenido: " + resultado.puntaje;

    } catch (error) {
        console.error(error);
        alert("Error al registrar la evaluación.");
    }
});