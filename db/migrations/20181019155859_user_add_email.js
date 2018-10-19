
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('email').unique();
    table.renameColumn('name', 'username');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('email');
    table.renameColumn('username', 'name');
  });
};
