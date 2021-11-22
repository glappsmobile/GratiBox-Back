import joi from 'joi';

const subscriptionSchema = joi.object({
  plan: joi.number().required(),
  deliveryDay: joi.number().required(),
  tea: joi.boolean().required(),
  incense: joi.boolean().required(),
  organic: joi.boolean().required(),
  name: joi.string().required(),
  address: joi.string().required(),
  city: joi.string().required(),
  cep: joi.string().required(),
  state: joi.number().required(),
});

export default subscriptionSchema;
