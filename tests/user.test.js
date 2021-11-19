import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import {
    validSessionFactory,
    invalidSessionFactory
} from './factories/session.factory.js';

afterAll(async () => {
    await connection.query('DELETE FROM sessions');
    await connection.query('DELETE FROM users');
    connection.end();
});


describe('GET /user', () => {
    test('returns 200 with valid user token', async () => {
        const validSession = await validSessionFactory();
        const result = await supertest(app)
            .get('/user')
            .set('Authorization', `Bearer ${validSession.token}`);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('name');
    });

    test('returns 401 with invalid user token', async () => {
        const invalidSession = invalidSessionFactory();
        const result = await supertest(app)
            .get('/user')
            .set('Authorization', `Bearer ${invalidSession.token}`);
        expect(result.status).toEqual(401);
    });
});