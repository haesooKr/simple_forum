const express = require('express');
const router = express.Router();
const connection = require('../models/db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM THREAD;', (err, result) => {
    for(let i=0; i<result.length; i++){
      let [day, month, date, year] = result[i].INS_DATE.toString().split(' ');
      result[i].INS_DATE = year + '/' + monthToNum(month) + '/' + date
    }

    res.render('layouts/forum', {
      thread: result,
      style: "/css/thread"
    })
  })
});

function monthToNum(month){
  switch(month){
    case 'Jan':
      return '1';
    case 'Feb':
      return '2';
    case 'Mar':
      return '3';
    case 'Apr':
      return '4';
    case 'May':
      return '5';
    case 'Jun':
      return '6';
    case 'Jul':
      return '7';
    case 'Aug':
      return '8';
    case 'Sep':
      return '9';
    case 'Oct':
      return '10';
    case 'Nov':
      return '11';
    case 'Dec':
      return '12';
    default :
      return new Error('Wrong Format of Month Input.')
  }
}


module.exports = router;