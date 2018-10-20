
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games', function (table) {
    table.increments();
    table.integer('winner_id').references('id').inTable('users');
    table.integer('loser_id').references('id').inTable('users');
    table.integer('gametype_id').references('id').inTable('gametypes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games');
};
