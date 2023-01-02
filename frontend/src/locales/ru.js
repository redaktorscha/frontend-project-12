export default {
  translation: {
    errors: {
      login: {
        invalid: 'Неверные имя пользователя или пароль',
      },
      signup: {
        required: 'Обязательное поле',
        oneOf: 'Пароли должны совпадать',
        minmax: 'От 3 до 20 символов',
        min: 'Не менее 6 символов',
        notOneOf: 'Такой пользователь уже существует',
      },
      addChannel: {
        notOneOf: 'Должно быть уникальным',
      },
    },
    ui: {
      btnLogout: 'Выйти',
    },
    network: {
      fail: 'сетевая ошибка, повторите попытку позже',
    },
  },
};
