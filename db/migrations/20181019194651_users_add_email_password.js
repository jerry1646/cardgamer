
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('email').unique();
    table.string('password').unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('email');
    table.dropColumn('password');
  });
};
