import express from "express";
import pool from "../config/database.js";

const router = express.Router();


// =========================================
// OBTENER PERFIL DEL PRACTICANTE
// GET /api/perfil/:uid
// =========================================

router.get("/:uid", async (req, res) => {

    try {

        const { uid } = req.params;


        // Buscar usuario por UID de Firebase

        const [usuarios] = await pool.execute(

            "SELECT * FROM usuarios WHERE firebase_uid = ?",

            [uid]

        );


        // Verificar si existe

        if (usuarios.length === 0) {

            return res.status(404).json({

                ok: false,

                mensaje: "Usuario no encontrado"

            });

        }


        const usuario = usuarios[0];


        // Enviar información

        res.json({

            ok: true,

            usuario: usuario

        });


    } catch (error) {

        console.error("Error obteniendo perfil:", error);


        res.status(500).json({

            ok: false,

            mensaje: "Error al consultar el perfil",

            error: error.message

        });

    }

});


export default router;