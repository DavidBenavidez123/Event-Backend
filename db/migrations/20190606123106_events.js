exports.up = function(knex, Promise) {
  return knex.schema.createTable('event', table => {
    table.increments('event_id'); //primary key
    table
      .integer('users_id')
      .references('users_id')
      .inTable('users');
    table
      .string('event_name', 48) // event title
      .notNullable();
    table.string('img_url'); // primary image url
    table.string('text', 1024); // primary text field
    table.string('start_date', 1024); // primary date field
    table.string('end_date', 1024); // primary date field
    table.string('start_time', 1024); // primary date field
    table.string('end_time', 1024); // primary date field
    table.string('event_location', 1024); // primary date field
	table.string('organizer_name', 1024); // primary date field
	table.integer('price', 1024); // primary date field
    table
      .timestamp('last_updated') // time last updated
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('event');
};
