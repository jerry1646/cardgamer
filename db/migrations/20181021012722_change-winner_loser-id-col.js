
exports.up = function(knex, Promise) {
  return knex.schema.table('games', table => {
    table.dropColumn('winner_id');
    table.dropColumn('loser_id');
    table.string('winner');
    table.string('loser');

  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('games', table => {
    table.dropColumn('winner');
    table.dropColumn('loser');
    table.integer('winner_id');
    table.integer('loser_id');
  })

};
