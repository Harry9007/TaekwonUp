import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/database.js";

import usuariosRoutes from "./routes/usuarios.js";
import rutinasRoutes from "./routes/rutinas.js";
import evaluacionesRoutes from "./routes/evaluaciones.js";
import dashboardRoutes from "./routes/dashboard.js";
import historialRoutes from "./routes/historial.js";
import perfilRoutes from "./routes/perfil.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/rutinas", rutinasRoutes);
app.use("/api/evaluaciones", evaluacionesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/historial", historialRoutes);
app.use("/api/perfil", perfilRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        aplicacion: "Taek WonUp API",
        version: "1.0.0",
        estado: "Servidor funcionando correctamente"
    });
});

// Puerto
const PORT = process.env.PORT || 3000;

try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión exitosa a MySQL");
    connection.release();
} catch (error) {
    console.error("❌ Error al conectar con MySQL");
    console.error(error);
}



// Iniciar servidor
app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log("🥋 Taek WonUp API");
    console.log("Servidor iniciado");
    console.log("Puerto:", PORT);
    console.log("--------------------------------");
});