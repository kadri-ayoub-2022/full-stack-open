const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const Person = require('./models/Person');
const mongoose = require('mongoose');

app.use(cors());
const PORT = process.env.PORT || 3001

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json());

app.use(express.static('dist'))

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
  const data =  Person.find({}).then(result => {
    res.json(result);
  }
);});

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    const currentTime = new Date();
    res.send(`<p>Phonebook has info for ${count} people</p><p>${currentTime}</p>`);
  });
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = Person.findById(id).then(person => {
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = Person.findByIdAndDelete(id).then(person => {
    res.status(204).end();
  });
});

app.post('/api/persons', (req, res, next) => {
    const newPerson = req.body;
    const person = new Person({
      name: newPerson.name,
      number: newPerson.number,
    });
    person.save().then(savedPerson => {
      res.json(savedPerson);
    });
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const updatedPerson = req.body;
  Person.findByIdAndUpdate(
    id,
    { name: updatedPerson.name, number: updatedPerson.number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => {
      res.json(result);
    })
    .catch(error => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})