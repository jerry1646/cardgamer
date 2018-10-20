/* jshint esversion : 6 */

const {hash, verify} = require("../util/pw_encryption.js");

module.exports = (knex) => {


  const registerUser = (username, email, password) => {
   return hash(password)
    .then(function(hashed_password) {
      // Store hash in your password DB.
      console.log("writing user info to db");
      console.log(username, hashed_password);
      knex("users")
      .insert({username, email, password:hashed_password})
      .returning('*')
      .then((result) => {console.log('insert completed');})
    });
  };

  const findByUsername = (username) => {
    return knex("users")
      .where({ username })
      .select("*")
      .limit(1);
  };

  const loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
      let foundUser;

      findByUsername(username)
        .then(([user]) => {
          if (user) {
            foundUser = user;
            return verify(password, user.password);
          } else {
            reject("user not found");
          }
        })
        .then((valid) => {
          if (valid) {
            resolve(foundUser);
          } else {
            reject("Invalid Password");
          }
        })
        .catch(e => {
          reject("user not found");
        });
    });
  };


  return {
    register: registerUser,

    login: loginUser,

    findByUsername
  };
};
