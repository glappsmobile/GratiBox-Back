import faker from 'faker';

const validSubscriptionFactory = () => {
  const name = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;
  const address = faker.address.country('Brazil');
  const city = faker.address.country('Brazil');
  const deliveryDay = faker.datatype.number(2) + 1;
  const incense = faker.datatype.boolean();
  const organic = faker.datatype.boolean();
  const tea = faker.datatype.boolean();
  const cep = `${faker.datatype.number(89999) + 10000}-${faker.datatype.number(899) + 100}`;
  const state = faker.datatype.number(26) + 1;
  const plan = faker.datatype.number(1) + 1;

  return {
    name, address, city, deliveryDay, incense, organic, tea, cep, state, plan,
  };
};

const invalidSubscriptionFactory = () => ({
  ...validSubscriptionFactory, name: false,
});

export {
  validSubscriptionFactory,
  invalidSubscriptionFactory,
};
