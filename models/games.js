
module.exports = (knex) => {
  const recordGameToDB =
  (winner, loser, gametype, created_at, draw) => {
    return knex("games")
      .insert({winner, loser, gametype, created_at, draw})
      .returning('*')
      .then(() => console.log('====> GAMEDB: Game saved to db'));
  };


  return {
    saveGame: recordGameToDB
  };
};
