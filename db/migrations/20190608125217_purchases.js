exports.up = function(knex) {
  return knex.schema.createTable('purchases', table => {
    table.increments();
    table
      .integer('users_id')
      .references('users_id')
      .inTable('users');
    table
      .integer('event_id')
      .references('event_id')
      .inTable('event');

    table
      .string('price', 48) // event title
      .notNullable();
    table
      .integer('tickets') // event title
      .notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('purchases');
};
