const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

let phonenumbers = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: "4",
  },
];

app.get("/api/info", (request, response) => {
  response.send(`<div><h2> Phonebook has info for ${
    phonenumbers.length
  } people </h2>
    <p> ${new Date(Date.now())} </p>
  </div>`);
});

app.get("/api/persons", (request, response) => {
  response.json(phonenumbers);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const note = phonenumbers.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  phonenumbers = phonenumbers.filter((note) => note.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  const name = phonenumbers.find((person) => person.name === body.name);

  if (name) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: String(Math.floor(Math.random() * 1000000)),
  };

  phonenumbers = phonenumbers.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});