
exports.up = function(knex, Promise) {
  knex.schema.table('games', table => {
    table.dropColumn('gametype_id');
    table.string('gametype');
  });
};

exports.down = function(knex, Promise) {
  knex.schema.table('games', table => {
    table.integer('gametype_id').references('id').inTable('gametypes');
    table.dropColumn('gametype');
  });
};
