
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(
          [ {username: 'WeedtheNORTH', email: 'dankkush@420.ca', password: 'dankkush123', win: 3, lose: 2},
            {username: 'PartyParrot', email: 'parrotlove@animals.com', password: 'party4ever', win: 2, lose: 2},
            {username: 'HarryPotter', email: 'hp@hogwarts.edu', password: 'magicmagic', win: 1, lose: 3},
            {username: 'JustinTrudeau', email: 'tudou@canada.gov', password: 'isuck', win: 1, lose: 2},
            {username: 'DonaldTrumph', email: 'imajoke@usa.gov', password: 'makemyselfgreatagain', win: 0, lose: 3},
            {username: 'GreedyNoodles', email: 'spaghetti@noodles.com', password: 'iamgreedy', win: 2, lose: 1},
            {username: 'MadPotato', email: 'iammad@potato.com', password: 'tastypotatoes', win: 4, lose: 2},
            {username: 'JustinBeaver', email: 'idontsing@beavers.com', password: 'imnotbieber', win: 2, lose: 2},
            {username: '100SaltsofHash', email: 'breakyourcomputer@hash.com', password: 'bcrypt@2.0.0', win: 3, lose: 1}
          ]),
      ]);
    });
};
