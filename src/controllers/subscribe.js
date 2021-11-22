import jwt from 'jsonwebtoken';
import connection from '../database.js';
import subscriptionSchema from '../../schemas/subscriptionSchema.js';

const signUp = async (req, res) => {
  const {
    plan, deliveryDay, tea, incense, organic, name, address, city, cep, state,
  } = req.body;

  const validation = subscriptionSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(400);
  }

  const { authorization } = req.headers;
  const token = authorization?.split('Bearer ')[1];

  const jwtSecret = process.env.JWT_SECRET;
  const user = jwt.verify(token, jwtSecret);

  try {
    await connection.query(
      `
    INSERT INTO subscriptions
      (user_id, plan_id, delivery_day, tea, incense, organic)
    VALUES ($1, $2, $3, $4, $5, $6);`,
      [user.id, plan, deliveryDay, tea, incense, organic],
    );

    await connection.query(
      `
    INSERT INTO addresses
      (user_id, cep, address, city, state_id, name)
    VALUES ($1, $2, $3, $4, $5, $6);`,
      [user.id, cep, address, city, state, name],
    );

    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default signUp;
