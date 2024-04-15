import express from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware para procesar el cuerpo de la solicitud como JSON
app.use(express.json());

// Middleware para procesar el cuerpo de la solicitud desde formularios
app.use(express.urlencoded({ extended: true }));

app.listen(3002, console.log("El servidor está inicializado en el puerto 3002"))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/agregar', async (req, res) => {
    const { nombre, precio } = req.body;

    let deportes = [];
    try {
        const fileContent = await fs.readFile('deportes.json', 'utf8');
        const parsedContent = JSON.parse(fileContent);
        deportes = parsedContent.deportes || [];
    } catch (error) {
        console.error('Error al leer el archivo:', error);
    }

    deportes.push({ nombre, precio });

    try {
        await fs.writeFile('deportes.json', JSON.stringify({deportes}, null, 2));
        res.json({ message: 'Deporte agregado correctamente' });  
    } catch (error) {
        console.error('Error al escribir en el archivo:', error);
        return res.status(500).json({ error: 'Error al escribir en el archivo' });
    }
});

// Para obtener Deportes, leera deportes.json 
app.get('/deportes', async (req, res) => {
    const parsedData = JSON.parse(await fs.readFile('deportes.json', 'utf8'));
    const deportes = parsedData.deportes || [];
    res.json({ deportes });
});

// ruta para modificar precio
app.get('/editar', async (req, res) => {
    const { nombre, precio } = req.query;
    try {
        const parsedData = JSON.parse(await fs.readFile('deportes.json', 'utf8'));
        let deporte = parsedData.deportes.find(d => d.nombre === nombre);

        deporte.precio = precio;

        await fs.writeFile('deportes.json', JSON.stringify(parsedData, null, 2));
        res.json({ message: 'Precio actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar el precio:', error);        
    }    
});


// ruta para eliminar precio
app.get('/eliminar', async (req, res) => {
    const { nombre } = req.query;
    try {
        let parsedData = JSON.parse(await fs.readFile('deportes.json', 'utf8'));
        
        // Se utiliza la función filter para excluir el deporte a eliminar 
        parsedData.deportes = parsedData.deportes.filter(d => d.nombre !== nombre);

        await fs.writeFile('deportes.json', JSON.stringify(parsedData, null, 2));
        res.json({ message: 'Deporte eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el deporte:', error);        
    }    
});