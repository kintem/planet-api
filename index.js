const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const planets = require('./planet-data');

const app = express();

app.use(bodyParser.json());
app.use(cors({allow: true}));

const port = process.env.PORT || 3000;

//:name is a path parameter
//other type is a query parameter
app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  res.status(200).send({'message': `Hello ${name}!!!!!!`});
});

// app.get('/goodbye', (req, res) => {
//   res.status(200).send({'message': 'Goodbye WORLD'});
// });

//GET request = gets data from API
//POST request = sends data to API
//PUT request = updates data in API
//DELETE request = deletes data from API

app.get('/planets', (req, res) => {
  res.status(200).send(planets);
});

app.get('/planets/:id', (req, res) => {
  const id = req.params.id;
  const planet = planets.filter(planet => planet.id == id);

  if (planet.length > 0) {
    res.status(200).send(planet[0]);
  } else {
    res.status(404).send({error: 'Not found', message: 'it dont exist, try a different solar system'});
  }
})

// app.post('/planets', (req, res) => {
//   const currentHighestId = planets.sort((a, b)=> b.id - a.id)[0].id;
//   const newId = currentHighestId + 1;

//   const planetToAdd = {id: newId, ...req.body};
//   planets.push(planetToAdd);

//   res.status(201).send({message: 'planet has been added', planet: planetToAdd});
// })

//CHALLENGE
app.post('/planets', (req, res) => {
  const currentHighestId = planets.sort((a, b)=> b.id - a.id)[0].id;
  const newId = currentHighestId + 1;
  const planetToAdd = {};

  //could use object.hasOwnProperty('hasKnownLife')
  if (req.body.name && typeof req.body.hasKnownLife === 'boolean' && req.body.type && req.body.noOfMoons) {
    planetToAdd.id = newId;
    planetToAdd.name = req.body.name;
    planetToAdd.hasKnownLife = req.body.hasKnownLife;
    planetToAdd.type = req.body.type;
    planetToAdd.noOfMoons = req.body.noOfMoons;

    planets.push(planetToAdd);
    res.status(201).send({message: 'planet has been added', planet: planetToAdd});
  } else {
    res.status(406).send({message: 'insufficient or incorrect type of data', planet: req.body});
  }
})

app.delete('/planets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indexToRemove = planets.findIndex((planet) => planet.id === id);

  if (indexToRemove > 0) {
    planets.splice(planets.findIndex((planet) => planet.id === id), 1);
    res.status(200).send({message: `successfully deleted planet with id: ${id}`});
  } else {
    res.status(404).send({message: `planet with id: ${id} not found`});
  }
})

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});