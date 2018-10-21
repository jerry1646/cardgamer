
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('games').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('games').insert(

          [
            {created_at: '2018-10-17 22:02:00', gametype: 'war', draw: 'true', winner: 'GreedyNoodles', loser: 'DonaldTrumph'},
            {created_at: '2018-10-17 14:05:00', gametype: 'war', draw: 'true', winner: 'PartyParrot', loser: 'DonaldTrumph'},
            {created_at: '2018-10-17 20:42:00', gametype: 'war', draw: 'true', winner: 'GreedyNoodles', loser: 'JustinTrudeau'},
            {created_at: '2018-10-21 16:05:00', gametype: 'war', draw: 'true', winner: 'JustinBeaver', loser: 'WeedtheNORTH'},
            {created_at: '2018-10-21 20:21:00', gametype: 'war', draw: 'true', winner: '100SaltsofHash', loser: 'JustinTrudeau'},
            {created_at: '2018-10-21 16:21:00', gametype: 'war', draw: 'true', winner: 'WeedtheNORTH', loser: 'DonaldTrumph'},

            {created_at: '2018-10-12 09:21:00', gametype: 'war', draw: 'false', winner: 'WeedtheNORTH', loser: 'HarryPotter'},
            {created_at: '2018-10-12 02:05:00', gametype: 'war', draw: 'false', winner: 'PartyParrot', loser: 'HarryPotter'},
            {created_at: '2018-10-13 14:02:00', gametype: 'war', draw: 'false', winner: 'HarryPotter', loser: 'JustinTrudeau'},
            {created_at: '2018-10-14 09:59:00', gametype: 'war', draw: 'false', winner: 'GreedyNoodles', loser: 'DonaldTrumph'},
            {created_at: '2018-10-14 02:42:00', gametype: 'war', draw: 'false', winner: 'JustinBeaver', loser: '100SaltsofHash'},
            {created_at: '2018-10-14 14:05:00', gametype: 'war', draw: 'false', winner: 'MadPotato', loser: 'PartyParrot'},
            {created_at: '2018-10-15 19:41:00', gametype: 'war', draw: 'false', winner: '100SaltsofHash', loser: 'MadPotato'},
            {created_at: '2018-10-15 02:07:00', gametype: 'war', draw: 'false', winner: 'MadPotato', loser: 'PartyParrot'},
            {created_at: '2018-10-15 14:32:00', gametype: 'war', draw: 'false', winner: 'PartyParrot', loser: 'JustinBeaver'},
            {created_at: '2018-10-15 09:51:00', gametype: 'war', draw: 'false', winner: '100SaltsofHash', loser: 'WeedtheNORTH'},
            {created_at: '2018-10-17 12:21:00', gametype: 'war', draw: 'false', winner: 'WeedtheNORTH', loser: 'DonaldTrumph'},
            {created_at: '2018-10-17 09:21:00', gametype: 'war', draw: 'false', winner: 'WeedtheNORTH', loser: 'JustinBeaver'},
            {created_at: '2018-10-20 16:07:00', gametype: 'war', draw: 'false', winner: '100SaltsofHash', loser: 'WeedtheNORTH'},
            {created_at: '2018-10-20 20:32:00', gametype: 'war', draw: 'false', winner: 'MadPotato', loser: 'DonaldTrumph'},
            {created_at: '2018-10-20 19:02:00', gametype: 'war', draw: 'false', winner: 'GreedyNoodles', loser: 'HarryPotter'},
            {created_at: '2018-10-21 19:41:00', gametype: 'war', draw: 'false', winner: 'MadPotato', loser: 'GreedyNoodles'},
            {created_at: '2018-10-21 09:07:00', gametype: 'war', draw: 'false', winner: 'JustinBeaver', loser: 'JustinTrudeau'},
            {created_at: '2018-10-21 16:51:00', gametype: 'war', draw: 'false', winner: 'JustinTrudeau', loser: 'MadPotato'}
          ])
      ]);
    });
};
