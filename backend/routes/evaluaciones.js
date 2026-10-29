import express from "express";
import pool from "../config/database.js";

const router = express.Router();

router.post("/", async (req, res) => {
    let connection;
    try {
        const { usuario_id, flexiones, abdominales, patadas } = req.body;

        const f = Number(flexiones) || 0;
        const a = Number(abdominales) || 0;
        const p = Number(patadas) || 0;

        let nivel = "Principiante";
        const puntaje = f + a + p;

        if (f >= 30 && a >= 40 && p >= 50) {
            nivel = "Avanzado";
        } else if (f >= 15 && a >= 25 && p >= 30) {
            nivel = "Intermedio";
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        await connection.execute(
            `INSERT INTO evaluaciones (usuario_id, flexiones, abdominales, patadas, puntaje, nivel)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [usuario_id, f, a, p, puntaje, nivel]
        );

        await connection.execute(
            `UPDATE usuarios SET nivel = ?, puntaje = ? WHERE id = ?`,
            [nivel, puntaje, usuario_id]
        );

        await connection.commit();

        res.json({
            ok: true,
            nivel,
            puntaje
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al registrar evaluación:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error interno al guardar la evaluación"
        });
    } finally {
        if (connection) connection.release();
    }
});

export default router;