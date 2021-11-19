import bcrypt from 'bcrypt';
import connection from '../database.js';
import signUpSchema from '../../schemas/userSchema.js';

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  const validation = signUpSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(400);
  }

  try {
    const userQuery = await connection.query(
      'SELECT * FROM users WHERE email = $1;',
      [email],
    );

    const user = userQuery.rows[0];

    if (user) {
      return res.sendStatus(409);
    }

    const encryptedPassword = bcrypt.hashSync(password, 10);

    await connection.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3);',
      [name, email, encryptedPassword],
    );

    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export default signUp;
