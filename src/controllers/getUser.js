import jwt from 'jsonwebtoken';
import connection from '../database.js';

const getUser = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.split('Bearer ')[1];

  const jwtSecret = process.env.JWT_SECRET;
  const user = jwt.verify(token, jwtSecret);

  try {
    const userQuery = await connection.query('SELECT name FROM users WHERE id = $1', [user.id]);
    const userData = userQuery.rows[0];

    const addressQuery = await connection.query(
      `SELECT 
        addresses.name AS "deliveryName", addresses.cep, addresses.address, addresses.city,
        states.name AS state
      FROM addresses
        JOIN states
          ON states.id = addresses.state_id
      WHERE user_id = $1`,
      [user.id],
    );

    const defaultAddress = {
      cep: '',
      address: '',
      city: '',
      state: '',
      deliveryName: '',
    };

    const address = addressQuery.rows[0] || defaultAddress;

    const subscriptionQuery = await connection.query(
      `SELECT 
        plan_id AS "planType", delivery_day AS "deliveryDay", tea, incense, organic
      FROM subscriptions
      WHERE user_id = $1`,
      [user.id],
    );

    const defaultSubscription = {
      planType: '',
      deliveryDay: '',
      tea: '',
      incense: '',
      organic: '',
    };

    const subscription = subscriptionQuery.rows[0] || defaultSubscription;

    res.send({ ...userData, ...address, ...subscription });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

export default getUser;
