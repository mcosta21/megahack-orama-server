
exports.up = function(knex) {
  return knex.schema.createTable('serie', function(table) {
      table.increments('id').primary();
      table.decimal('cost').notNullable();
      table.decimal('yield').notNullable();
      table.integer('duration').notNullable();
      table.string('title').notNullable();
      table.string('description').notNullable();
      table.integer('categoryId').notNullable().references('id').inTable('category');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('serie');
};
