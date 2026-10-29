import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.get("/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        const [usuarios] = await pool.execute(
            "SELECT id, nombre, nivel, puntaje FROM usuarios WHERE firebase_uid = ?",
            [uid]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: "Usuario no encontrado"
            });
        }

        const usuario = usuarios[0];

        const [evaluaciones] = await pool.execute(
            `SELECT COUNT(*) AS total, MAX(fecha) AS ultima
             FROM evaluaciones
             WHERE usuario_id = ?`,
            [usuario.id]
        );

        const total = evaluaciones[0]?.total || 0;
        const ultima = evaluaciones[0]?.ultima || null;

        res.json({
            ok: true,
            nombre: usuario.nombre,
            nivel: usuario.nivel || "Sin evaluar",
            puntaje: usuario.puntaje || 0,
            evaluaciones: total,
            ultimaEvaluacion: ultima
        });

    } catch (error) {
        console.error("Error en Dashboard:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error al consultar la información del dashboard"
        });
    }
});

export default router;