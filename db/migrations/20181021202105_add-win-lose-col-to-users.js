
exports.up = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.integer('win');
    table.integer('lose');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.dropColumn('win');
    table.dropColumn('lose');
  })
};
