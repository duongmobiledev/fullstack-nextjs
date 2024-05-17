import * as yup from 'yup';

export const RequestLoginBodySchema = yup.object().shape({
  email: yup.string().email().required(),
  ['g-recaptcha-response']: yup.string().required(),
});

export const LoginBodySchema = yup.object().shape({
  loginToken: yup.string().required(),
});
export const RefreshTokenBodySchema = yup.object().shape({
  refreshToken: yup.string().required(),
});

export const UpdateUserBodySchema = yup.object({
  displayName: yup.string(),
  gender: yup.number(),
  phoneNumber: yup.string(),
  country: yup.string(),
  address: yup.string(),
  city: yup.string(),
  state: yup.string(),
  zipCode: yup.string(),
});
