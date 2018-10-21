
exports.up = function(knex, Promise) {
  return knex.schema.table('games', table => {
    table.string('draw');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('games', table => {
    table.dropColumn('draw');
  })
};
