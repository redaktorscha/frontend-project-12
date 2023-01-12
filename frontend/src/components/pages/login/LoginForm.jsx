// ts-check
import React, { useRef } from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import UserForm from '../../UserForm';

const LoginForm = () => {
  const { t } = useTranslation();

  const loginSchema = yup
    .object()
    .shape({
      username: yup
        .string()
        .trim()
        .required(t('errors.login.required')),
      password: yup
        .string()
        .trim()
        .required(t('errors.login.required')),
    });

  const inputs = [
    {
      type: 'text',
      inputName: 'username',
      ref: useRef(null),
      label: t('ui.login.username'),
    },
    {
      type: 'password',
      inputName: 'password',
      ref: useRef(null),
      label: t('ui.login.password'),
    },
  ];

  const buttonText = t('ui.login.btnLogin');

  const renderData = {
    inputs, buttonText,
  };

  return (
    <UserForm
      eventType="login"
      errorCode={401}
      renderData={renderData}
      validationSchema={loginSchema}
    />
  );
};

export default LoginForm;
