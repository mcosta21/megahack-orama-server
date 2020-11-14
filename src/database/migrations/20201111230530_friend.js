
exports.up = function(knex) {
  return knex.schema.createTable('friend', function(table) {
    table.integer('friendOneId').references('id').inTable('user');
    table.integer('friendTwoId').references('id').inTable('user');
    table.primary(['friendOneId', 'friendTwoId']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('friend');
};
