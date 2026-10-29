import express from "express";
import pool from "../config/database.js";

const router = express.Router();

/*
=========================================
POST - Registrar usuario
=========================================
*/

router.post("/", async (req, res) => {

    try {

        const {
            firebase_uid,
            nombre,
            documento,
            edad,
            sexo,
            correo
        } = req.body;

        const sql = `
            INSERT INTO usuarios
            (
                firebase_uid,
                nombre,
                documento,
                edad,
                sexo,
                correo
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await pool.execute(sql, [
            firebase_uid,
            nombre,
            documento,
            edad,
            sexo,
            correo
        ]);

        res.status(201).json({
            ok: true,
            mensaje: "Usuario registrado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: error.message
        });

    }

});

/*
=========================================
GET - Consultar usuarios
=========================================
*/

router.get("/", async (req, res) => {

    try {

        const [usuarios] = await pool.query(
            "SELECT * FROM usuarios"
        );

        res.json(usuarios);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: error.message
        });

    }

});

/*
=========================================
GET - Buscar usuario por Firebase UID
=========================================
*/

router.get("/firebase/:uid", async (req, res) => {

    try {

        const { uid } = req.params;

        const [usuarios] = await pool.execute(

            "SELECT * FROM usuarios WHERE firebase_uid = ?",

            [uid]

        );

        if (usuarios.length === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: "Usuario no encontrado"
            });

        }

        res.json(usuarios[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: error.message
        });

    }

});

export default router;