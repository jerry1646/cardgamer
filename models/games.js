
/* jshint esversion : 6 */
module.exports = (knex) => {
  const recordGameToDB =
  (winner, loser, gametype, created_at, draw) => {
    return knex("games")
      .insert({winner, loser, gametype, created_at, draw})
      .returning('*')
      .then(() => console.log('====> GAMEDB: Game saved to db'));
  };

  const findGameRecord = (username) => {
    return knex('games')
      .select('*')
      .where('winner', username)
      .orWhere('loser', username)
  };


  return {
    saveGame: recordGameToDB,
    findGames: findGameRecord
  };
};
