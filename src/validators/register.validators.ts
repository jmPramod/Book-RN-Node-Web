
import Joi from "joi";

export const registerSchema = Joi.object({
  userFirstName: Joi.string().min(2).max(50).required(),
  userLastName: Joi.string().min(1).max(50).required(),
  countryCode: Joi.string().default("+91"),
  phone: Joi.number().required(),
  address: Joi.string().allow(""),
  pinCode: Joi.string().length(6),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  gender: Joi.string().valid("Male", "Female", "Others").required(),
  profileImage: Joi.object({
    imageUrl: Joi.string().uri(),
    imgPublicId: Joi.string().allow(null),
  }).optional(),
});

