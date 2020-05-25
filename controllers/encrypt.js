const crypto = require('crypto-js');

function passwordCheck(pwd){
  let x = crypto.SHA256(pwd)
  return x.toString(crypto.enc.Base64);
}

module.exports = passwordCheck;