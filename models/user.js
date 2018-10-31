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
      .insert({username, email, password:hashed_password, win: 0, lose: 0})
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

  const updateUserScore = (username, position) => {
    if ( position == 'winner' ){
      knex("users")
        .select("win")
        .where({username})
        .then((rows) => {
          let oldWin = rows[0].win;
          let newWin = oldWin + 1;
          console.log('newWin', newWin);
          knex("users")
            .where({username})
            .update({win: newWin})
            .then(()=> {
              console.log('updated win count');
            })
        });
    } else {
      knex("users")
        .select("lose")
        .where({username})
        .then((rows) => {
          let oldLose = rows[0].lose;
          let newLose = oldLose + 1;
          console.log('newLose', newLose);
          knex("users")
            .where({username})
            .update({lose: newLose})
            .then(()=> {
              console.log('updated lose count');
            })
        });
    }
  };

  const findAllUser = () => {
    return new Promise((resolve, reject) => {
      resolve (knex.raw('select username, win, lose, (10*win-5*lose) as diff from users order by diff DESC;'))
  })}


  return {
    register: registerUser, //returns promise

    login: loginUser, //returns promise

    findByUsername, //returns promise

    updateUserScore,

    findAllUser   //returns promise
  };
};
