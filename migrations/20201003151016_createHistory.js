exports.up = async (knex) => knex.schema.createTable('history', (table) => {
  table.increments();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.integer('id_repo').notNullable().unsigned();
  table.decimal('open_issues_count').notNullable();
  table.decimal('avg_issues_lifetime').notNullable();
  table.decimal('std_issues_lifetime').notNullable();
  table.foreign('id_repo').references('history_repos.id').onDelete('CASCADE');
});

exports.down = (knex) => {
  knex.schema.dropTable('history');
};
