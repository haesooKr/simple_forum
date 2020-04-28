const express = require('express');
const router = express.Router();
const connection = require('../models/db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM THREAD;', (err, result) => {
    console.log(JSON.stringify(result))

    res.render('layouts/forum', {
      thread: result,
      style: "/css/main"
    })
  })
});

module.exports = router;