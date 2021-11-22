import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import connection from '../database.js';

const getUser = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.split('Bearer ')[1];

  const jwtSecret = process.env.JWT_SECRET;
  const user = jwt.verify(token, jwtSecret);

  try {
    const userQuery = await connection.query('SELECT name FROM users WHERE id = $1', [user.id]);
    const userData = userQuery.rows[0];

    const subscriptionQuery = await connection.query(
      `SELECT 
        subscriptions.created_at AS "subscriptionDate", subscriptions.tea, subscriptions.incense, subscriptions.organic, subscriptions.delivery_day AS "deliveryDay", subscriptions.plan_id AS "planType",
        plans.name AS plan
      FROM subscriptions
          JOIN plans
            ON plans.id = subscriptions.plan_id
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
    let { subscriptionDate } = subscription;
    const { deliveryDay, planType } = subscription;
    const nextDeliveries = [];

    if (planType === 1) {
      const days = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };
      const weekday = dayjs(subscriptionDate).format('dddd').toLocaleLowerCase();
      let daysToFirstDelivery = days[deliveryDay] - days[weekday];
      if (daysToFirstDelivery === 0) {
        daysToFirstDelivery = 7;
      }
      let nextDate = dayjs(subscriptionDate).add(daysToFirstDelivery, 'day');
      nextDeliveries.push(nextDate.format('DD/MM/YYYY'));
      for (let i = 0; i < 2; i += 1) {
        nextDate = dayjs(nextDate).add(7, 'day');
        nextDeliveries.push(nextDate.format('DD/MM/YYYY'));
      }
    } else if (planType === 2) {
      const skipWeekend = (date) => {
        const dateWeekday = dayjs(date).format('dddd').toLocaleLowerCase();
        let finalDate = date;
        if (dateWeekday === 'saturday') {
          finalDate = dayjs(finalDate).add(2, 'day');
        } else if (dateWeekday === 'sunday') {
          finalDate = dayjs(finalDate).add(1, 'day');
        }
        return finalDate;
      };
      let nextDate = dayjs(subscriptionDate).date(Number(deliveryDay));
      const isAfter = dayjs(nextDate).isAfter(dayjs(subscriptionDate));
      if (!isAfter) {
        nextDate = dayjs(nextDate).add(1, 'month');
      }
      nextDate = skipWeekend(nextDate);
      nextDeliveries.push(nextDate.format('DD/MM/YYYY'));
      for (let i = 0; i < 2; i += 1) {
        nextDate = dayjs(nextDate).date(Number(deliveryDay));
        nextDate = dayjs(nextDate).add(1, 'month');
        nextDate = skipWeekend(nextDate);
        nextDeliveries.push(nextDate.format('DD/MM/YYYY'));
      }
    }

    subscriptionDate = dayjs(subscriptionDate).format('DD/MM/YY');

    res.send({
      ...userData,
      subscription: {
        ...subscription,
        subscriptionDate,
        nextDeliveries,
      },
    });
  } catch (err) {
    res.sendStatus(500);
  }
};

export default getUser;
