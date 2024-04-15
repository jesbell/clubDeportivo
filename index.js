import express from "express"; // módulo Express para crear el servidor web
import { promises as fs } from "fs"; // operaciones de sistema de archivos de forma asincrónica
import { fileURLToPath } from 'url'; // función para convertir URL de archivo a ruta de sistema de archivos
import { dirname } from 'path';  // manejo de rutas

const PORT = 3002;

// convertir a una ruta de sistema de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Instancia de la aplicación Express
const app = express();

// Middleware: procesa el cuerpo de la solicitud como JSON
app.use(express.json());

// Middleware: procesa el cuerpo de la solicitud desde formularios
app.use(express.urlencoded({ extended: true }));

// Creando servidor con express
app.listen(PORT, () => {
    console.log(`El servidor está inicializado en el puerto ${PORT}`);
});

// Definir ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// ruta para agregar datos al archivo json
app.post('/agregar', async (req, res) => {
    const { nombre, precio } = req.body;

    let deportes = [];
    try {
        // Lee el archivo deportes.json, parsea su contenido
        const parsedContent = JSON.parse(await fs.readFile('deportes.json', 'utf8'));
        // Verifica si existe o no, y lo asigna
        deportes = parsedContent.deportes || [];
    } catch (error) {
        console.error('Error al leer el archivo:', error);
    }

    // agregar datos al arreglo
    deportes.push({ nombre, precio });

    try {
        // Escribe en el archivo deportes.json lo que esta en deportes, y le da un formato.
        await fs.writeFile('deportes.json', JSON.stringify({deportes}, null, 2));
        // Envía una respuesta JSON al cliente
        res.json({ message: 'Deporte agregado correctamente' }); 
    } catch (error) {
        console.error('Error al escribir en el archivo:', error);
    }
});

// Para obtener Deportes, leera deportes.json 
app.get('/deportes', async (req, res) => {
    try {
        // Lee el archivo deportes.json, parsea su contenido
        const parsedData = JSON.parse(await fs.readFile('deportes.json', 'utf8'));
        const deportes = parsedData.deportes || [];
        res.json({ deportes });
        
    } catch (error) {
        console.error('Error al leer el archivo:', error);
    }

    
});

// ruta para modificar precio
app.get('/editar', async (req, res) => {
    const { nombre, precio } = req.query;
    try {
        // Lee el archivo deportes.json, parsea su contenido
        const parsedData = JSON.parse(await fs.readFile('deportes.json', 'utf8'));
        //Busca nombre que coincida con el proporcionado
        let deporte = parsedData.deportes.find(d => d.nombre === nombre);

        // Actualiza precio
        deporte.precio = precio;
        // Escribe en el archivo deportes.json lo que esta en parsedData, y le da un formato.
        await fs.writeFile('deportes.json', JSON.stringify(parsedData, null, 2));
        // Envía una respuesta JSON al cliente
        res.json({ message: 'Precio actualizado correctamente' });
    } catch (error) {
        console.error('Error al editar el precio:', error);        
    }    
});


// ruta para eliminar precio
app.get('/eliminar', async (req, res) => {
    const { nombre } = req.query;
    try {
        // Lee el archivo deportes.json, parsea su contenido
        let parsedData = JSON.parse(await fs.readFile('deportes.json', 'utf8'));
        
        // Se utiliza la función filter para excluir el deporte a eliminar 
        parsedData.deportes = parsedData.deportes.filter(d => d.nombre !== nombre);

        await fs.writeFile('deportes.json', JSON.stringify(parsedData, null, 2));

        // Envía una respuesta JSON al cliente
        res.json({ message: 'Deporte eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el deporte:', error);        
    }    
});
