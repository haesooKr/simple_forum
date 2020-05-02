const express = require("express");
const router = express.Router();
const connection = require("../models/db");

let threadsPerPg = 10;

router.get("/", (req, res) => {
  req.query.p = req.query.p || 1;
  connection.query(
    "SELECT * FROM (SELECT * FROM ( SELECT * FROM THREAD ) AS ORIGINAL JOIN ( SELECT THREAD_NUM AS tk,COUNT(THREAD_NUM) AS COMMENTS_COUNT FROM COMMENT GROUP BY tk HAVING COUNT(tk) > 1) AS COUNT ON ORIGINAL.THREAD_NUM = COUNT.tk UNION DISTINCT SELECT * FROM ( SELECT * FROM THREAD WHERE COMMENT_YN != 1) AS ORIGINAL2 JOIN ( SELECT 0 AS tk, 0 AS COMMENTS_COUNT ) AS COUNT2 ) AS RESULT WHERE RESULT.DEL_YN != 1 ORDER BY RESULT.THREAD_NUM DESC;",
    (err, result) => {
      if (!err) {
        for (let i = 0; i < result.length; i++) {
          let [day, month, date, year] = result[i].INS_DATE.toString().split(
            " "
          );
          result[i].INS_DATE = year + "/" + monthToNum(month) + "/" + date;
        }

        let currentPage = req.query.p ? Number(req.query.p) : 0;
        let pageCount = Math.ceil(result.length / threadsPerPg);
        if (req.query.p > pageCount || req.query.p <= 0) {
          currentPage = 0;
        }
        let start = currentPage ? (currentPage - 1) * 10 : 0;
        let end = start + threadsPerPg;

        res.render("layouts/forum", {
          thread: result,
          style: "/css/thread",
          pagination: {
            page: currentPage,
            pageCount, //total page
          },
          custom: {
            arr: result,
            start,
            end,
          },
        });
      } else {
        console.log("Error in retrieving employee list : " + err);
      }
    }
  );
});

router.get("/write", (req, res) => {
  res.render("layouts/write", {
    style: "/css/thread",
  });
});

router.post("/write", (req, res) => {
  let { writer, subject, content } = req.body;
  connection.query(
    `INSERT INTO THREAD (THREAD_WRITER, THREAD_SUBJECT, THREAD_CONTENT) VALUES ('${writer}', '${subject}', '${content}')`,
    (err, result) => {
      if (!err) {
        res.redirect("/");
      } else {
        console.log("Error in thread insertion : " + err);
      }
    }
  );
});

router.get("/read/:id", (req, res) => {
  connection.query(
    `UPDATE THREAD SET THREAD_HITS = THREAD_HITS + 1 WHERE THREAD_NUM = ${req.params.id};`
  )
  connection.query(
    `SELECT * FROM THREAD WHERE THREAD_NUM = ${req.params.id};`,
    (err, result) => {
      if (!err) {
        if (Array.isArray(result) && result.length === 0) {
          res.redirect("/");
        } else {
          let [day, month, date, year] = result[0].INS_DATE.toString().split(
            " "
          );
          result[0].INS_DATE = year + "/" + monthToNum(month) + "/" + date;
          res.render("layouts/read", {
            thread: result[0],
            style: "/css/thread",
          });
        }
      } else {
        console.log("Error in retreiving thread : " + err);
        res.redirect("/");
      }
    }
  );
});

router.get("/update/:id", (req, res) => {
  connection.query(
    `SELECT * FROM THREAD WHERE THREAD_NUM = ${req.params.id};`,
    (err, result) => {
      if (!err) {
        if (Array.isArray(result) && result.length === 0) {
          res.redirect("/");
        } else {
          res.render("layouts/update", {
            thread: result[0],
            style: "/css/thread",
          });
        }
      } else {
        console.log("Error in retreiving thread : " + err);
      }
    }
  );
});

router.post("/update/:id", (req, res) => {
  connection.query(
    `UPDATE THREAD SET THREAD_WRITER = '${
      req.body.writer
    }', THREAD_SUBJECT = '${req.body.subject}', THREAD_CONTENT = '${
      req.body.content
    }', UPD_DATE = '${getESTDate()}' WHERE THREAD_NUM = ${req.params.id}`,
    (err, result) => {
      if (!err) {
        res.redirect("/");
      } else {
        console.log("Error in thread updating : " + err);
      }
    }
  );
});

router.get("/delete/:id", (req, res) => {
  connection.query(
    `DELETE FROM THREAD WHERE THREAD_NUM = ${req.params.id};`,
    (err, result) => {
      if (!err) {
        res.redirect("/");
      } else {
        console.log("Error in thread deleting : " + err);
      }
    }
  );
});

function monthToNum(month) {
  switch (month) {
    case "Jan":
      return "1";
    case "Feb":
      return "2";
    case "Mar":
      return "3";
    case "Apr":
      return "4";
    case "May":
      return "5";
    case "Jun":
      return "6";
    case "Jul":
      return "7";
    case "Aug":
      return "8";
    case "Sep":
      return "9";
    case "Oct":
      return "10";
    case "Nov":
      return "11";
    case "Dec":
      return "12";
    default:
      return new Error("Wrong Format of Month Input.");
  }
}

function getESTDate() {
  offset = -5.0;
  clientDate = new Date();
  utc = clientDate.getTime() + clientDate.getTimezoneOffset() * 60000;
  serverDate = new Date(utc + 3600000 * offset);
  return serverDate.toISOString().slice(0, 19).replace("T", " ");
}

module.exports = router;
