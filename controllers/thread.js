const express = require("express");
const router = express.Router();
const connection = require("../models/db");
const pwdCheck = require('./encrypt.js');

let threadsPerPg = 10;

router.get("/", (req, res) => {
  req.query.p = req.query.p || 1;
  connection.query(
    "SELECT * FROM (SELECT * FROM ( SELECT * FROM THREAD ) AS ORIGINAL JOIN ( SELECT THREAD_NUM AS tk,COUNT(THREAD_NUM) AS COMMENTS_COUNT FROM COMMENT GROUP BY tk HAVING COUNT(tk) >= 1) AS COUNT ON ORIGINAL.THREAD_NUM = COUNT.tk UNION DISTINCT SELECT * FROM ( SELECT * FROM THREAD WHERE COMMENT_YN != 1) AS ORIGINAL2 JOIN ( SELECT 0 AS tk, 0 AS COMMENTS_COUNT ) AS COUNT2 ) AS RESULT WHERE RESULT.DEL_YN != 1 ORDER BY ADMIN_YN DESC, RESULT.THREAD_NUM DESC;",
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
          session: req.session,
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
        console.log("Error in retrieving thread list : " + err);
      }
    }
  );
});

router.get("/write", (req, res) => {
  res.render("layouts/write", {
    session: req.session,
    style: "/css/writeUpdate",
  });
});

router.post("/write", (req, res) => {
  let { writer, subject, content, password } = req.body;
  if(req.session.admin){
    connection.query(
      `INSERT INTO THREAD (THREAD_WRITER, THREAD_SUBJECT, THREAD_CONTENT, PWD_YN, ADMIN_YN) VALUES ('${writer}', '${subject}', '${content}', '1', '1')`,
      (err, result) => {
        if(!err){
          connection.query(
            `INSERT INTO PASSWORD (THREAD_NUM, PWD) VALUES ('${result.insertId}', '${password || "admin"}');`, 
            (err, result) => {
              if(!err){
                res.redirect("/");
              } else {
                console.log("Error in password insertion : " + err);
              }
            }
          )
        } else {
          console.log("Error in thread insertion : " + err);
        }
      }
    );
  }
  else if(password){
    connection.query(
      `INSERT INTO THREAD (THREAD_WRITER, THREAD_SUBJECT, THREAD_CONTENT, PWD_YN) VALUES ('${writer}', '${subject}', '${content}', '1')`,
      (err, result) => {
        if(!err){
          connection.query(
            `INSERT INTO PASSWORD (THREAD_NUM, PWD) VALUES ('${result.insertId}', '${password}');`, 
            (err, result) => {
              if(!err){
                res.redirect("/");
              } else {
                console.log("Error in password insertion : " + err);
              }
            }
          )
        } else {
          console.log("Error in thread insertion : " + err);
        }
      }
    );
  } else {
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
  }
});

router.get("/read/:id", (req, res) => {
  if(isNaN(Number(req.params.id))){
    res.redirect('/');
    return;
  }
  connection.query(
    `UPDATE THREAD SET THREAD_HITS = THREAD_HITS + 1 WHERE THREAD_NUM = ${req.params.id};`,
  )
  connection.query(
    `SELECT * FROM THREAD WHERE THREAD_NUM = ${req.params.id};`,
    (err, result) => {
      if (!err && result.length > 0) {
        const pwdExist = result[0].PWD_YN === 1  ? true : false;
        if(pwdExist && !req.session.admin){
          res.render("layouts/authentication", {
            session: req.session,
            id: req.params.id,
            style: "/css/authentication"
          })
        } else {
          if (Array.isArray(result) && result.length === 0) {
            res.redirect("/");
          } else {
            let [day, month, date, year] = result[0].INS_DATE.toString().split(
              " "
            );
            result[0].INS_DATE = year + "/" + monthToNum(month) + "/" + date;
            connection.query(
              `SELECT WRITER, COMMENT, COMMENT_INS_DATE FROM THREAD INNER JOIN COMMENT ON THREAD.THREAD_NUM = COMMENT.THREAD_NUM WHERE THREAD.THREAD_NUM = ${req.params.id} && COMMENT_DEL_YN = 0 ORDER BY COMMENT.COMMENT_INS_DATE DESC`,
              (err, comments) => {
                res.render("layouts/read", {
                  session: req.session,
                  thread: result[0],
                  comments,
                  style: "/css/read",
                });
              }
            )
          }
        }
      } else {
        console.log("Error in retreiving thread : " + err);
        res.redirect("/");
      }
    }
  );
});

router.post("/read", (req, res) => {
  connection.query(
    `UPDATE THREAD SET THREAD_HITS = THREAD_HITS + 1 WHERE THREAD_NUM = ${req.body.id};`
  )
  connection.query(
    `SELECT * FROM PASSWORD WHERE THREAD_NUM = ${req.body.id};`,
    (err, result) => {
      if(req.body.password === result[0].PWD){
        connection.query(
          `SELECT * FROM THREAD WHERE THREAD_NUM = ${req.body.id};`,
          (err, result) => {
            if (Array.isArray(result) && result.length === 0) {
              res.redirect("/");
            } else {
              let [day, month, date, year] = result[0].INS_DATE.toString().split(
                " "
              );
              result[0].INS_DATE = year + "/" + monthToNum(month) + "/" + date;
              connection.query(
                `SELECT WRITER, COMMENT, COMMENT_INS_DATE FROM THREAD INNER JOIN COMMENT ON THREAD.THREAD_NUM = COMMENT.THREAD_NUM WHERE THREAD.THREAD_NUM = ${req.params.id} && COMMENT_DEL_YN = 0 ORDER BY COMMENT.COMMENT_INS_DATE DESC`,
                (err, comments) => {
                  res.render("layouts/read", {
                    session: req.session,
                    thread: result[0],
                    comments,
                    style: "/css/read",
                  });
                }
              )
            }
          })
      } else {
        res.redirect(`/read/${req.body.id}`)
      }
    })
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
            session: req.session,
            thread: result[0],
            style: "/css/writeUpdate",
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
    `UPDATE THREAD SET DEL_YN = 1 WHERE THREAD_NUM = ${req.params.id};`,
    (err, result) => {
      if (!err) {
        res.redirect("/");
      } else {
        console.log("Error in thread deleting : " + err);
      }
    }
  );
});

router.get('/comment/like/:id', (req, res) => {
  connection.query(
    `UPDATE THREAD SET THREAD_LIKES = THREAD_LIKES + 1 WHERE THREAD_NUM = ${req.params.id};`,
    (err, result) => {
      if(!err){
        res.redirect(`/read/${req.params.id}`);
      } else {
        console.log("Error in comment like : " + err);
      }
    }
  )
})

router.post("/comment", (req, res) => {
  const {nickname, comment, number, commentYN} = req.body;
  if(commentYN === '0'){
    connection.query(
      `UPDATE THREAD SET COMMENT_YN = 1 WHERE THREAD_NUM = ${number}`
    )
  }
  connection.query(
    `INSERT INTO COMMENT (THREAD_NUM, WRITER, COMMENT) VALUES ('${number}', '${nickname}', '${comment}');`, 
    (err, result) => {
      if(!err){
        res.redirect(`/read/${number}`);  
      } else {
        console.log("Error in comment creating : " + err);
      }
      
    }
  )
})

router.get("/admin", (req, res) => {
  if(req.session.admin === true){
    req.session.destroy();
    res.redirect('/');
  } else {
    res.render("layouts/admin", {
      session: req.session,
    });
  }
})

router.post("/admin", (req, res) => {
  connection.query(`SELECT * FROM FORUM.ADMIN`, (err, result) => {
    if(!err){
      if(result[0].Password === pwdCheck(req.body.adminPWD)){
        req.session.admin = true;
        res.redirect('/');
      } else {
        res.redirect('/')
      }
    }
  })
})

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
