import { object, string } from 'yup';

export const createUserSessionSchema = object({
  body: object({
    password: string()
      .required('password is required')
      .min(6, 'Password is too short - should be 6 characters minimum')
      .matches(/^[a-zA-Z0-9_.-]*$/, 'Password can only contain latin letters'),

    email: string().email('Must be a valid email').required('Email is required'),
  }),
});
