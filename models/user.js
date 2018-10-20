/* jshint esversion : 6 */

const {hash, verify} = require("../util/pw_encryption.js");

module.exports = (knex) => {
  const registerUser = (username, email, password) => {
   hash(password)
    .then(function(hashed_password) {
      // Store hash in your password DB.
      console.log("writing user info to db");
      console.log(username, hashed_password);
      knex("users")
      .insert({username, email, hashed_password})
      // .returning("*");

      return knex("users").select("*");
    });
  };

  const findByUsername = (username) => {
    knex("users")
      .where({ username })
      .select("*")
      .limit(1);
  };

  const loginUser = (username, password) => {
    new Promise((resolve, reject) => {
      let foundUser;

      findByUsername(username)
        .then(([user]) => {
          if (user) {
            foundUser = user;
            return verify(password, user.password_hashed);
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
    register: (username, email, password) => {
      new Promise((resolve, reject) => {
        registerUser(username, email, password)
          .then((result)=>console.log(result))
          // .then((user) => resolve(user))
          // .catch(e => reject(e));
      });
    },

    login: (username, password) => {
      new Promise((resolve, reject) => {
        loginUser(username, password)
          .then(([user]) => resolve(user))
          .catch((e) => reject(e));
      });
    },

    findByUsername
  };
};
