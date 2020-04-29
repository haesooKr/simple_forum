const express = require('express');
const router = express.Router();
const connection = require('../models/db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM THREAD;', (err, result) => {
    if(!err){
      for(let i=0; i<result.length; i++){
        let [day, month, date, year] = result[i].INS_DATE.toString().split(' ');
        result[i].INS_DATE = year + '/' + monthToNum(month) + '/' + date
      }
  
      res.render('layouts/forum', {
        thread: result,
        style: "/css/thread"
      })
    } else {
      console.log("Error in retrieving employee list : " + err);
    }
  })
});

router.get('/write', (req, res) => {
  res.render('layouts/write', {
    style: "/css/thread"
  })
})

router.post('/write', (req, res) => {
  let { writer, subject, content } = req.body;
  connection.query(`INSERT INTO THREAD (THREAD_WRITER, THREAD_SUBJECT, THREAD_CONTENT) VALUES ('${writer}', '${subject}', '${content}')`, (err, result) => {
    if(!err){
      res.redirect('/');
    } else {
      console.log("Error in thread insertion : " + err);
    }
  })
})

router.get('/read/:id', (req, res) => {
  connection.query(`SELECT * FROM THREAD WHERE THREAD_NUM = ${req.params.id};`, (err, result) => {
    if(!err){
      let [day, month, date, year] = result[0].INS_DATE.toString().split(' ');
      result[0].INS_DATE = year + '/' + monthToNum(month) + '/' + date
      res.render('layouts/read', {
        thread: result[0],
        style: "/css/thread"
      })
    } else {
      console.log('Error in retreiving thread : ' + err);
    }
  })
})

router.get('/update/:id', (req, res) => {
  connection.query(`SELECT * FROM THREAD WHERE THREAD_NUM = ${req.params.id};`, (err, result) => {
    if(!err){
      res.render('layouts/update', {
        thread: result[0],
        style: "/css/update"
      })
    } else {
      console.log('Error in retreiving thread : ' + err);
    }
  })
})

router.post('/update/:id', (req, res) => {
  
  connection.query(`UPDATE THREAD SET THREAD_WRITER = '${req.body.writer}', THREAD_SUBJECT = '${req.body.subject}', THREAD_CONTENT = '${req.body.content}', UPD_DATE = '${getESTDate()}' WHERE THREAD_NUM = ${req.params.id}`, (err, result) => {
    if(!err){
      res.redirect('/');
    } else {
      console.log('Error in thread deleting : ' + err);
    }
  })
})

router.get('/delete/:id', (req, res) => {
  connection.query(`DELETE FROM THREAD WHERE THREAD_NUM = ${req.params.id};`, (err, result) => {
    if(!err){
      res.redirect('/');
    } else {
      console.log('Error in thread deleting : ' + err);
    }
  })
})

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


function getESTDate(){
  offset = -5.0
  clientDate = new Date();
  utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
  serverDate = new Date(utc + (3600000*offset));
  return serverDate.toISOString().slice(0, 19).replace('T', ' ');
}


module.exports = router;