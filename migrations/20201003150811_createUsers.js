exports.up = async (knex) => knex.schema.createTable('users', (table) => {
  table.increments();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.string('name').notNullable();
});

exports.down = (knex) => {
  knex.schema.dropTable('users');
};
