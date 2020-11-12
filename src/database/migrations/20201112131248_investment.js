exports.up = function(knex) {
  return knex.schema.createTable('investment', function(table) {
    table.increments('id').primary();
    table.date('startDate').notNullable();
    table.date('expirationDate').notNullable();
    table.boolean('private').notNullable();
    table.integer('userId').notNullable().references('id').inTable('user');
    table.integer('serieId').notNullable().references('id').inTable('serie');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('investment');
};
