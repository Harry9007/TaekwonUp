import express from "express";
import pool from "../config/database.js";

const router = express.Router();


// =========================================
// OBTENER RUTINA DEL PRACTICANTE
// GET /api/rutinas/:uid
// =========================================

router.get("/:uid", async (req, res) => {

    try {

        const { uid } = req.params;


        // =====================================
        // BUSCAR NIVEL DEL USUARIO
        // =====================================

        const [usuarios] = await pool.execute(

            "SELECT nivel FROM usuarios WHERE firebase_uid = ?",

            [uid]

        );


        // =====================================
        // VERIFICAR USUARIO
        // =====================================

        if (usuarios.length === 0) {

            return res.status(404).json({

                ok: false,

                mensaje: "Usuario no encontrado"

            });

        }


        const nivel = usuarios[0].nivel;


        // =====================================
        // GENERAR RUTINA
        // =====================================

        let rutina = [];


        if (!nivel || nivel === "Sin evaluar") {

            rutina = [

                {
                    ejercicio: "Evaluación física",
                    cantidad: "Realizar evaluación",
                    descripcion: "Completa la evaluación para obtener una rutina personalizada."
                }

            ];

        }


        else if (nivel.toLowerCase().includes("principiante")) {

            rutina = [

                {
                    ejercicio: "Flexiones",
                    cantidad: "10 repeticiones",
                    descripcion: "Mantén una postura controlada durante el ejercicio."
                },

                {
                    ejercicio: "Abdominales",
                    cantidad: "15 repeticiones",
                    descripcion: "Realiza el movimiento de forma controlada."
                },

                {
                    ejercicio: "Patadas básicas",
                    cantidad: "20 repeticiones",
                    descripcion: "Practica la técnica y mantén el equilibrio."
                },

                {
                    ejercicio: "Estiramiento",
                    cantidad: "5 minutos",
                    descripcion: "Realiza estiramientos generales al finalizar."
                }

            ];

        }


        else if (nivel.toLowerCase().includes("intermedio")) {

            rutina = [

                {
                    ejercicio: "Flexiones",
                    cantidad: "20 repeticiones",
                    descripcion: "Mantén un ritmo constante."
                },

                {
                    ejercicio: "Abdominales",
                    cantidad: "30 repeticiones",
                    descripcion: "Controla la respiración durante el ejercicio."
                },

                {
                    ejercicio: "Patadas medias",
                    cantidad: "40 repeticiones",
                    descripcion: "Enfócate en la técnica y precisión."
                },

                {
                    ejercicio: "Sombra",
                    cantidad: "10 minutos",
                    descripcion: "Practica desplazamientos y técnicas básicas."
                }

            ];

        }


        else {

            rutina = [

                {
                    ejercicio: "Flexiones",
                    cantidad: "40 repeticiones",
                    descripcion: "Realiza las repeticiones manteniendo una técnica adecuada."
                },

                {
                    ejercicio: "Abdominales",
                    cantidad: "50 repeticiones",
                    descripcion: "Mantén un ritmo constante y controlado."
                },

                {
                    ejercicio: "Patadas explosivas",
                    cantidad: "80 repeticiones",
                    descripcion: "Prioriza la técnica, velocidad y control."
                },

                {
                    ejercicio: "Entrenamiento técnico",
                    cantidad: "15 minutos",
                    descripcion: "Practica combinaciones y desplazamientos."
                }

            ];

        }


        // =====================================
        // RESPUESTA
        // =====================================

        res.json({

            ok: true,

            nivel: nivel,

            rutina: rutina

        });


    } catch (error) {

        console.error(
            "Error obteniendo rutina:",
            error
        );


        res.status(500).json({

            ok: false,

            mensaje: "Error al generar la rutina",

            error: error.message

        });

    }

});


export default router;