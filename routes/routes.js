const db = require('../db/dbConfig');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const server = express();

server.use(express.json());
server.use(cors());

// exports
module.exports = server => {
  server.get('/event/:id', viewEvent);
  server.post('/userEvent', userEvents);
  server.post('/addEvent', addEvent);
  server.get('/events', getEvents);
  server.put('/updateEvent/:id', updateEvent);
  server.delete('/deleteEvent/:id', deleteEvent);
  server.get('/', viewServer);
  server.post('/api/login', login);
  server.post('/api/register', register);
  server.post('/makePurchase', makePurchase);
  server.post('/viewPurchase', viewPurchases);
  server.get('/getUserData', getUserData);
};

function viewServer(req, res) {
  res.status(200).json({ api: 'running' });
}

function addEvent(req, res) {
  const {
    users_id,
    event_name,
    img_url,
    text,
    start_date,
    end_date,
    start_time,
    end_time,
    event_location,
    organizer_name,
    price
  } = req.body;
  if (
    !event_name ||
    !img_url ||
    !text ||
    !start_date ||
    !end_date ||
    !start_time ||
    !end_time ||
    !event_location ||
    !organizer_name ||
    !price
  ) {
    return res.status(422).json({ error: 'Missing parameters.' });
  } else {
    const event = {
      users_id,
      event_name,
      img_url,
      text,
      start_date,
      end_date,
      start_time,
      end_time,
      event_location,
      organizer_name,
      price
    };
    db('event')
      .insert(event)
      .then(ids => res.status(200).json(ids[0]))
      .catch(err =>
        res.status(500).json({ error: 'Could not add event properly' })
      );
  }
}

function getEvents(req, res) {
  db('event')
    .then(events => res.status(200).json({ events }))
    .catch(error => res.status(500).json(error));
}

function viewEvent(req, res) {
  const { id } = req.params;
  db('event')
    .where({ event_id: id })
    .then(event => res.status(200).json({ event }))
    .catch(err => res.status(500).json(err));
}
function deleteEvent(req, res) {
  const { id } = req.params;
  db('event')
    .where({ id })
    .del()
    .then(count => {
      if (!count || count < 1) {
        res.status(404).json({ message: 'No note found to delete' });
      } else {
        res.status(200).json(count);
      }
    })
    .catch(err => res.status(500).json(err));
}

function userEvents(req, res) {
  const { id } = req.body;
  db('event')
    .where('event.users_id', id)
    .then(event => res.status(200).json({ event }))
    .catch(err => res.status(500).json(err));
}

function makePurchase(req, res) {
  const { users_id, event_id, price, tickets } = req.body;
  const purchase = { users_id, event_id, price, tickets };
  db('purchases')
    .insert(purchase)
    .then(ids => res.status(200).json(ids[0]))
    .catch(err =>
      res.status(500).json({ error: 'Could not make purchase properly' })
    );
}

function viewPurchases(req, res) {
  const { userId } = req.body;
  db('purchases')
    .where('purchases.users_id', userId)
    .join('event', 'purchases.event_id', 'event.event_id')
    .then(purchase => res.status(200).json({ purchase }))
    .catch(err =>
      res.status(500).json({ err: 'Could not make view properly' })
    );
}

function updateEvent(req, res) {
  const { id } = req.params;
  const changes = req.body;
  db('notes')
    .where({ id })
    .update(changes)
    .then(count => {
      if (!count || count < 1) {
        res.status(404).json({ message: 'No note found to update' });
      } else {
        res.status(200).json(count);
      }
    })
    .catch(err => res.status(500).json(err));
}

function deleteEvent(req, res) {
  const { id } = req.params;
  db('notes')
    .where({ id })
    .del()
    .then(count => {
      if (!count || count < 1) {
        res.status(404).json({ message: 'No note found to delete' });
      } else {
        res.status(200).json(count);
      }
    })
    .catch(err => res.status(500).json(err));
}

// implemented this

function register(req, res) {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 10);
  credentials.password = hash;
  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

const jwtSecret = 'nobody tosses a dwarf!';

function generateToken(user) {
  const jwtPayload = {
    ...user
  };
  const jwtOptions = {
    expiresIn: '1h'
  };
  return jwt.sign(jwtPayload, jwtSecret, jwtOptions);
}

function login(req, res) {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user); // new line
        res.status(200).json({ welcome: user.username, token });
      } else {
        res.status(401).json({ message: 'you shall not pass!' });
      }
    })
    .catch(err => {
      res.status(500).json({ err });
    });
}
function getUserData(req, res) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        // token verification failed
        res.status(401).json({ message: 'invalid token' });
      } else {
        // token is valid
        req.decodedToken = decodedToken; // any sub-sequent middleware of route handler have access to this
        console.log('\n** decoded token information **\n', req.decodedToken);
      }
    });
  } else {
    res.status(401).json({ message: 'no token provided' });
  }
  db('users')
    .where('users.users_id', req.decodedToken.users_id)
    .then(users => {
      res.json({ users });
    })
    .catch(err => res.send(err));
}
