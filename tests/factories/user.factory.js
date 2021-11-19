import faker from 'faker';
import bcrypt from 'bcrypt';
import connection from '../../src/database.js';

const validUserFactory = () => {
  const fakeName = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;
  const fakeEmail = faker.internet.email();
  const fakePassword = faker.internet.password();

  return {
    name: fakeName,
    email: fakeEmail,
    password: fakePassword,
  };
};

const invalidUserFactory = () => ({
  name: [],
  email: 1234,
  password: '12',
});

const existingUserFactory = async () => {
  const user = validUserFactory();
  const encryptedPassword = bcrypt.hashSync(user.password, 10);

  await connection.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3);',
    [user.name, user.email, encryptedPassword],
  );

  return user;
};

export {
  validUserFactory,
  invalidUserFactory,
  existingUserFactory,
};
