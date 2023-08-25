const express = require("express");
const axios = require("axios");
const { query } = require("express");
const { print } = require("graphql");
const gql = require("graphql-tag");

const app = express();






const url = "http://localhost:8000/graphql"; 


app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
     axios("http://localhost:8000/graphql",{
        method: 'post',
        data: {
             query: `
             {
                mascotas{
                    _id
                    nombre
                    edad
                    propietario
                }
            } 
            `
        }
    }).then((result) => {
        let datos = result;
        //console.log(datos.data.data);
        //console.log("pasando");
        res.render("index", { data: datos.data.data });
    });
    
    
});

app.post('/agregar-mascota',(req,res)=>{
    const body = req.body;
    let {nombre,edad,propietario} = body;
    let name = nombre;
    let age = edad;
    let owner = propietario;
    axios("http://localhost:8000/graphql", {
        method: 'post',
        query:
            `
                mutation($nombre: String!, $edad: Int, $propietario: String)
                {
                    createMascota(input:{ nombre: $nombre, edad: $edad, propietario: $propietario })
                    {
                        _id
		                nombre
		                edad
		                propietario
                    }
                }

            `,
        variables: 
        {
            nombre:name,
            edad:age,
            propietario:owner
        }          
        
    }).catch(err => console.log(err));
    res.redirect("/");
});


app.listen(9000, () => {
    console.log("server on port 9000");
});