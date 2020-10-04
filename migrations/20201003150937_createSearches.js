exports.up = async (knex) => knex.schema.createTable('searches', (table) => {
  table.increments();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.integer('id_user').notNullable().unsigned();
  table.integer('id_repo').notNullable().unsigned();
  table.foreign('id_user').references('users.id').onDelete('CASCADE');
  table.foreign('id_repo').references('repos.id').onDelete('CASCADE');
});

exports.down = (knex) => {
  knex.schema.dropTable('searches');
};
