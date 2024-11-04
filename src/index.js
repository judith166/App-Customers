// Carga de los módulos
const express = require('express');
const app = express();

//Obtener el modulo para las rutas
const path = require('node:path');

//Obtener el numero del port
process.loadEnvFile();
const PORT = process.env.PORT;
console.log(PORT);

//cargar los datos
const datos = require('../data/customers.json')
//Ordenar por apellido del clinete (descendente A-Z)
datos.sort((a,b) => a.surname.localeCompare(b.surname, "es-ES"));


//Indicar la ruta de los ficheros estaticos
app.use(express.static(path.join(__dirname, "../public")));


//Ruta HOME = Raíz
app.get("/", (req, res) => {
    // console.log("EStamos en /"); 
    res.sendFile(path.join(__dirname, "/index.html"));
})

//Ruta API Global
app.get("/api", (req, res) => {
    res.json(datos);
});

//Ruta para filtrar los clientes por el apellido
app.get("/api/apellido/:cliente_apellido", (req, res) => {
    const apellido = req.params.cliente_apellido.toLocaleLowerCase();
    const filtroClinetes = datos.filter(cliente => cliente.surname.toLocaleLowerCase() === apellido);
    console.log(filtroClinetes);
    if(filtroClinetes.length == 0) {
       return res.status(404).send({message: "Cliente no encontrado"});
    }
    res.json(filtroClinetes);
    
});

//Ruta para filtrar por nombre y apellido: api/nombre/apellido/Jhon/Bezzos

app.get("/api/nombre_apellido/:cliente_nombre/:cliente_apellido", (req, res) => {
    const nombre = req.params.cliente_nombre.toLocaleLowerCase();
    const apellido = req.params.cliente_apellido.toLocaleLowerCase();
    const filtroClinetes = datos.filter(cliente => cliente.surname.toLocaleLowerCase() === apellido && cliente.name.toLocaleLowerCase() === nombre);
    console.log(filtroClinetes);
    if(filtroClinetes.length == 0) {
       return res.status(404).send({message: "Cliente no encontrado"});
    }
    res.json(filtroClinetes);
    
});

//Ruta para filtrar por nombre y por las primeras letras del apellido
//api/nombre/Barbara?=Jo
app.get('/api/nombre/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLocaleLowerCase();
    const apellido = req.query.apellido;

    //Si no se incluye el apellido valdra underfined
    //mostraremos un filtro solo por el nombre
    if(apellido === undefined) {
        const filtroClientes = datos.filter(cliente => cliente.name.toLocaleLowerCase() === nombre)
        //Nnos aseguramos que el array con los clientes no este vacio
        if(filtroClientes.length == 0) {
            return res.status(404).send("Cliente no encontrado");
        }

        return res.json  (filtroClientes) 
    }
    // console.log(nombre, apellido);

    //para sber cuantas letras tiene el apellido esctiro por el usuarui
    const letras = apellido.length 

    const filtroClientes = datos.filter(cliente => cliente.surname.slice(0, letras).toLocaleLowerCase() == napellido && cliente.name.toLocaleLowerCase() == nombre)

    if(filtroClientes.length == 0) { 
        return res.status(404).send("Cliente no encontrado");
    
}
    //Devolver datos filrados
    res.json(filtroClientes)

});

//Filtrar por la marca: que productos se han comprado de una marca en concreto
//api/marca/:marca

app.get("/api/marca/:marca", (req, res) => {
    const marca = req.params.marca.toLocaleLowerCase();
    const filtroMarca = datos.flatMap(cliente => cliente.compras, filter(compra => compra.marca.toLocaleLowerCase() == marca));

    if(filtroMarca.length == 0) {
        return res.status(404).send(`No se ha realizado ninguna compra de ${marca}`);
    }
    res.json(filtroMarca);

});

//Cargar la pagina 404
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "../public/404.html")));


//Poner el puerto en escucha
app.listen (PORT, () => console.log(`Server running on http://localhost:${PORT}`))