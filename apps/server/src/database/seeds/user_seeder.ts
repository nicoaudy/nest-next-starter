import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  const hash = await bcrypt.hash('password', 10);
  await knex('users').insert({
    name: 'Foobar',
    email: 'foo@bar.com',
    password: hash,
  });

  for (let i = 0; i < 1000; i++) {
    await knex('users').insert({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: hash,
    });
  }
}
