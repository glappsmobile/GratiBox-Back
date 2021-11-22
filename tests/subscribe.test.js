import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import {
    validSubscriptionFactory,
    invalidSubscriptionFactory
} from './factories/subscription.factory.js';
import {
    validSessionFactory,
    invalidSessionFactory
} from './factories/session.factory.js';

const createdSessions = [];

afterAll(async () => {
    await connection.query(`DELETE FROM sessions;`);
    await connection.query(`DELETE FROM addresses;`);
    await connection.query(`DELETE FROM subscriptions;`);
    await connection.query(`DELETE FROM users;`);
    connection.end();
});

describe('POST /subscribe', () => {
    test('returns 200 with valid user and data', async () => {
        const validSession = await validSessionFactory();
        const validSubscription = validSubscriptionFactory();
        createdSessions.push(validSession);

        const result = await supertest(app)
            .post('/subscribe')
            .send(validSubscription)
            .set('Authorization', `Bearer ${validSession.token}`);

        expect(result.status).toEqual(200);
    });

    test('returns 401 with invalid', async () => {
        const invalidSession = invalidSessionFactory();
        const validSubscription = validSubscriptionFactory();

        const result = await supertest(app)
            .post('/subscribe')
            .send(validSubscription)
            .set('Authorization', `Bearer ${invalidSession.token}`);

        expect(result.status).toEqual(401);
    });

    test('returns 401 with invalid session and valid subscription', async () => {
        const invalidSession = invalidSessionFactory();
        const validSubscription = validSubscriptionFactory();

        const result = await supertest(app)
            .post('/subscribe')
            .send(validSubscription)
            .set('Authorization', `Bearer ${invalidSession.token}`);

        expect(result.status).toEqual(401);
    });

    test('returns 400 with invalid subscription and valid session', async () => {
        const validSession = createdSessions[0];
        const invalidSubscription = invalidSubscriptionFactory();

        const result = await supertest(app)
            .post('/subscribe')
            .send(invalidSubscription)
            .set('Authorization', `Bearer ${validSession.token}`);

        expect(result.status).toEqual(400);
    });

});
