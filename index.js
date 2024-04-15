import express from "express";
import { promises as fs } from "fs";

const app = express();

app.listen(3000, console.log("El servidor está inicializado en el puerto 3000"))

