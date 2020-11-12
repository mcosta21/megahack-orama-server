
exports.up = function(knex) {
  return knex.schema.createTable('friend', function(table) {
    table.integer('friendOneId').primary().references('id').inTable('user');
    table.integer('friendTwoId').primary().references('id').inTable('user')
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('friend');
};
