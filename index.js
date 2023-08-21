const express = require("express");
const axios = require("axios");

const app = express();


app.get("/", async (req, res) => {
    const result = await api.get("/people/1")
    res.send("<html><body><h1> Star Wars Api</h1></body></html>");
});

app.listen(3000, () => {
    console.log("Servidor Iniciado")
});

const api = axios.create({
    baseUrl: "https://swapi.dev/api"
})

