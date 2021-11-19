import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import {
    validUserFactory,
    invalidUserFactory
} from './factories/signUp.factory.js';

const createdUsers = [];

afterAll(async () => {
    await connection.query('DELETE FROM sessions');
    await connection.query('DELETE FROM users');
    connection.end();
});

describe('POST /sign-up', () => {
    test('returns 201 with valid new user data', async () => {
        const validNewUser = validUserFactory();
        createdUsers.push(validNewUser);
        const result = await supertest(app).post('/sign-up').send(validNewUser);
        expect(result.status).toEqual(201);
    });

    test('returns 400 with invalid new user data', async () => {
        const invalidNewUser = invalidUserFactory();
        const result = await supertest(app).post('/sign-up').send(invalidNewUser);
        expect(result.status).toEqual(400);
    });

    test('returns 409 when the user already exists', async () => {
        const existingUser = createdUsers[0];
        const result = await supertest(app).post('/sign-up').send(existingUser);
        expect(result.status).toEqual(409);
    });
});