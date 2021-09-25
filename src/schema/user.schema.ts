import { object, string, ref } from 'yup';

export const createUserSchema = object({
  body: object({
    name: string().required('Name is required'),
    password: string()
      .required('Password is required')
      .min(6, 'Password is too short - should be 6 character minimum')
      .matches(/^[a-zA-Z0-9_.-]*$/, 'Password can only contain latin letters'),
    passwordConfirmation: string().oneOf([ref('password'), null], 'password must match'),
    email: string().email('Must be a valid email address').required('Email is required'),
  }),
});
