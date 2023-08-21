const express = require("express");
const axios = require("axios");

const app = express();

const api = axios.create({
    baseURL: "https://swapi.dev/api"
})


app.get("/:category/:id", async (req, res) => {
    const { category, id } = req.params;

    try {
        let { data } = await api.get(`/${category}/${id}`);
        //console.log(data);

        await Promise.all(
            Object.entries(data).map(async (p) => {
                if(p[0] == "homeworld") {
                    const homeworld = await api.get(
                        `/planets/${p[1].split(`planets/`)[1]}`
                    );
                    data[p[0]] = homeworld.data.name;
                } else if (Array.isArray(p[1])) {
                    let name, id;
                    for (const [i, v] of p[1].entries()) {
                        name = p[0] == "people" ||
                            p[0] == "characteres" ||
                            p[0] == "pilots" ||
                            p[0] == "residents" 
                            ? "people"
                            : p[0];
                        id = v.split(`${name}/`)[1];
                        const resultAPI = await api.get(`/${name}/${id}`);
                        const nombre = resultAPI.data.name ? resultAPI.data.name : resultAPI.data.title
                        p[1][i] = nombre;
                    } 
                }
            })
        );

       let result;

        if (category == "people") {
            result = `
            <html>
                <body>
                    <h1> Name of character: ${data.name} </h1>
                    <p> Height: ${data.height} </p>
                    <p> Mass: ${data.mass} </p>
                    <p> Homeworld: ${data.homeworld} </p>
                    <p> Films: ${data.films} </p>
                    <p> Species: ${data.species} </p>
                    </> Vehicles: ${data.vehicles} </p>
                    </> Starships: ${data.starships} </p>
                </body>
            </html>
            `;
        } else if (category == "films") {
            result = `
            <html>
                <body>
                    <h1> Name: ${data.title} </h1>
                    <p> Episode: ${data.episode_id} </p>
                    <p> Opening_crawl: ${data.opening_crawl} </p>
                    <p> Characters: ${data.characters} </p>
                    <p> Planets: ${data.planets} </p>
                    </> Starships: ${data.starships} </p>
                    <p> Species: ${data.species} </p>p>
                </body>
            </html>
            `;
        } else if (category == "planets") {
            result = `
            <html>
                <body>
                    <h1> Name: ${data.name} </h1>
                    <p> Residents: ${data.residents} </p>
                    <p> Films: ${data.films} </p>
                </body>
            </html>
            `;
        } else if (category == "starships") {
            result = `
            <html>
                <body>
                    <h1> Name: ${data.name} </h1>
                    <p> Pilots: ${data.pilots} </p>
                    <p> Films: ${data.films} </p>
                </body>
            </html>
            `;
        } else if (category == "vehicles") {
            result = `
            <html>
                <body>
                    <h1> Name: ${data.name} </h1>
                    <p> Pilots: ${data.pilots} </p>
                    <p> Films: ${data.films} </p>
                </body>
            </html>
            `;
        }
    res.send(result);
    } catch(error) {
        res.send("<html><body><h1>Error</h1></body></html>")
    }

});

app.listen(3000, () => {
    console.log("Server started")
});
