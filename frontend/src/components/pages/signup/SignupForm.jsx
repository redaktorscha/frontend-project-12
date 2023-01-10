// ts-check
import React, { useRef } from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import UserForm from '../../UserForm';

const SignupForm = () => {
  const { t } = useTranslation();

  const signupSchema = yup
    .object()
    .shape({
      username: yup
        .string()
        .trim()
        .required(t('errors.signup.required'))
        .min(3, t('errors.signup.usernameSize'))
        .max(20, t('errors.signup.usernameSize')),
      password: yup
        .string()
        .trim()
        .required(t('errors.signup.required'))
        .min(6, t('errors.signup.passwordSize')),
      confirmPassword: yup
        .string()
        .trim()
        .required(t('errors.signup.required'))
        .oneOf([yup.ref('password'), null], t('errors.signup.oneOf')),
    });

  const inputs = [
    {
      type: 'text',
      inputName: 'username',
      ref: useRef(null),
      label: t('ui.signup.username'),
    },
    {
      type: 'password',
      inputName: 'password',
      ref: useRef(null),
      label: t('ui.signup.password'),
    },
    {
      type: 'password',
      inputName: 'confirmPassword',
      ref: useRef(null),
      label: t('ui.signup.confirmPassword'),
    },
  ];

  const buttonText = t('ui.signup.btnSignup');

  const renderData = {
    inputs, buttonText,
  };

  return (
    <UserForm
      eventType="signup"
      errorCode={409}
      renderData={renderData}
      validationSchema={signupSchema}
    />
  );
};

export default SignupForm;
