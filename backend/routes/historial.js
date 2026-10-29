import express from "express";
import pool from "../config/database.js";

const router = express.Router();

/*
=========================================
Historial de evaluaciones
GET /api/historial/:uid
=========================================
*/

router.get("/:uid", async (req, res) => {

    try {

        const { uid } = req.params;

        // Buscar el usuario por su UID de Firebase
        const [usuarios] = await pool.execute(

            "SELECT id FROM usuarios WHERE firebase_uid = ?",

            [uid]

        );

        if (usuarios.length === 0) {

            return res.status(404).json({

                ok: false,
                mensaje: "Usuario no encontrado"

            });

        }

        const usuario = usuarios[0];

        // Consultar historial
        const [historial] = await pool.execute(

            `SELECT
                fecha,
                flexiones,
                abdominales,
                patadas,
                puntaje,
                nivel
             FROM evaluaciones
             WHERE usuario_id = ?
             ORDER BY fecha DESC`,

            [usuario.id]

        );

        res.json({

            ok: true,

            historial

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            ok: false,

            mensaje: error.message

        });

    }

});

export default router;