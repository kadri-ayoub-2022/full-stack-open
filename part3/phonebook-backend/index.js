const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
const PORT = process.env.PORT || 3001



app.use(express.json());

app.use(morgan('tiny'));

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}));

const data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];
app.get('/api/persons', (req, res) => {
  res.json(data);
});

app.get('/info', (req, res) => {
  const entryCount = data.length;
  const currentTime = new Date();
  res.send(`<p>Phonebook has info for ${entryCount} people</p><p>${currentTime}</p>`);
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = data.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const index = data.findIndex(person => person.id === id);
    if (index !== -1) {
        data.splice(index, 1);
        res.status(204).end();
    } else {
        res.status(404).end();
    }   
});

app.post('/api/persons', (req, res) => {
    const newPerson = req.body;
    if (!newPerson.name || !newPerson.number) {
        return res.status(400).json({ error: 'name or number is missing' });
    }
    if (data.find(person => person.name === newPerson.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }
    const generatedId = Math.floor(Math.random() * 10000).toString();
    newPerson.id = generatedId;
    data.push(newPerson);
    res.json(newPerson);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});