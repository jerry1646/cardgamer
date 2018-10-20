/* jshint esversion : 6 */


const bcrypt = require('bcrypt');

const hash = password => bcrypt.hash(password, 10);

const verify = (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  hash,
  verify
};
