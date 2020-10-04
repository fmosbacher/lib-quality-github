exports.up = async (knex) => knex.schema.createTable('history_repos', (table) => {
  table.increments();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.string('name').notNullable();
  table.string('owner').notNullable();
});

exports.down = (knex) => {
  knex.schema.dropTable('history_repos');
};
