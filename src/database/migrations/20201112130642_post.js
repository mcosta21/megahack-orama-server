exports.up = function(knex) {
  return knex.schema.createTable('post', function(table) {
    table.increments('id').primary();
    table.date('datePost').notNullable();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.integer('investmentId').references('id').inTable('investment');
    table.integer('userId').references('id').inTable('user');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('post');
};
