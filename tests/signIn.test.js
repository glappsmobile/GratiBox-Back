import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import {
    validUserFactory,
    existingUserFactory,
    invalidUserFactory
} from './factories/user.factory.js';
const createdUsers = [];

afterAll(async () => {
    await connection.query(`DELETE FROM sessions;`);
    await connection.query(`DELETE FROM users;`);
    connection.end();
});

describe('POST /sign-in', () => {
    test('returns 200 with valid user and password', async () => {
        const existingUser = await existingUserFactory();
        createdUsers.push(existingUser);
        const result = await supertest(app)
            .post('/sign-in')
            .send({
                email: existingUser.email,
                password: existingUser.password
            });
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('token');
        expect(result.body).toHaveProperty('name');
    });

    test('returns 200 with valid user and password that is already logged in', async () => {
        const loggedInUser = createdUsers[0];
        const result = await supertest(app)
            .post('/sign-in')
            .send({
                email: loggedInUser.email,
                password: loggedInUser.password
            });
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('token');
        expect(result.body).toHaveProperty('name');
    });

    test('returns 404 with not registered user', async () => {
        const nonExistentUser = validUserFactory();
        const result = await supertest(app)
            .post('/sign-in')
            .send({
                email: nonExistentUser.email,
                password: nonExistentUser.password
            });
        expect(result.status).toEqual(404);
      });

      test('returns 401 with existent user, but wrong password', async () => {
        const wrongPasswordUser = createdUsers[0];
        const result = await supertest(app)
            .post('/sign-in')
            .send({
                email: wrongPasswordUser.email,
                password: 'wrongpasswordz'
            });
        expect(result.status).toEqual(401);
      });

      test('returns 400 with invalid user', async () => {
        const invalidUser = invalidUserFactory();
        const result = await supertest(app)
            .post('/sign-in')
            .send({
                email: invalidUser.email,
                password: invalidUser.password
            });        
        expect(result.status).toEqual(400);
      });
});
