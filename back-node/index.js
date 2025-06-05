import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"; // permitir coneiones desde el domini del front
import cookieParser from 'cookie-parser';


import conectarDB from "./config/db.js";
import usuarioRouter from './routes/usuarioRoutes.js';
import eventtsRouter from './routes/eventtRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import areaInteresRoutes from "./routes/areaInteresRoutes.js";



// Esto va a buscar por un archivo .env
dotenv.config();

const app = express();

// Crear la appconst app = express();
const port = process.env.B_PORT || 3050;

app.use(express.json()); // para que procese informacion json correctamente

// Habilitar cookie parser
app.use(cookieParser()); //da acceso en el request para usar las cookies

app.use('/public/uploads', express.static('public/uploads')); // 'uploads' es la carpeta donde guardas las imágenes


// conectar a la base de datos
conectarDB();


// Configurar CORS
// Dominios Permitidos
const whiteList = [
    process.env.FRONTEND_URLC
];
const corsOptions = {
    origin:function(origin,callback){
        // Comprobar en la lista blanca
        if(!origin || whiteList.includes(origin)){
            // Puede consultar la API
            callback(null,true);
        }else{
            // No esta permitido
            callback(new Error("Error de CORS"));
        };
    },
    credentials:true
};

//Aplicando CORS
app.use(cors(corsOptions));


app.use('/users',usuarioRouter);
app.use('/events',eventtsRouter);
app.use("/cities", cityRoutes);
app.use("/areas", areaInteresRoutes);

app.listen(port, () => {
    // http://localhost:3050/
    console.log(`Server is running on http://localhost:${port}`);
});