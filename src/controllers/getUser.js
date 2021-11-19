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

    res.send(userData);
  } catch (err) {
    res.sendStatus(500);
  }
};

export default getUser;
