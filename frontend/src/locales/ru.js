export default {
  translation: {
    errors: {
      required: 'Обязательное поле',
      login: {
        invalid: 'Неверные имя пользователя или пароль',
        required: 'Обязательное поле',
      },
      signup: {
        required: 'Обязательное поле',
        oneOf: 'Пароли должны совпадать',
        usernameSize: 'От 3 до 20 символов',
        passwordSize: 'Не менее 6 символов',
        exists: 'Такой пользователь уже существует',
      },
      modals: {
        required: 'Обязательное поле',
        channelNameSize: 'От 3 до 20 символов',
        notOneOf: 'Должно быть уникальным',
      },
    },
    toasts: {
      networkError: 'Ошибка соединения',
      channelCreated: 'Канал создан',
      channelDeleted: 'Канал удалён',
      channelRenamed: 'Канал переименован',
      unknownError: 'Что-то пошло не так...',
    },
    notification: {
      loading: 'Загрузка...',
    },
    ui: {
      header: {
        btnLogout: 'Выйти',
      },
      footer: {
        picturesCopyright: 'Онлайн-иллюстрации: Storyset',
      },
      notfound: {
        heading: 'Страница не найдена',
        text: 'Но вы можете перейти',
        link: 'на главную страницу',
      },
      login: {
        enter: 'Войти',
        username: 'Ваш ник',
        password: 'Пароль',
        btnLogin: 'Войти',
        spanNoAcc: 'Нет аккаунта?',
        linkRegister: 'Регистрация',
      },
      signup: {
        signup: 'Регистрация',
        username: 'Имя пользователя',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        btnSignup: 'Зарегистрироваться',
      },
      chat: {
        send: 'Отправить',
        channels: 'Каналы',
        channelControl: 'Управление каналом',
        enterMessage: 'Введите сообщение',
        ariaLabelMessage: 'Новое сообщение',
        delete: 'Удалить',
        rename: 'Переименовать',
        messagesCount: {
          key_one: '{{count}} сообщение',
          key_few: '{{count}} сообщения',
          key_many: '{{count}} сообщений',
        },
      },
      modals: {
        cancel: 'Отменить',
        send: 'Отправить',
        delete: 'Удалить',
        channelName: 'Имя канала',
        addChannelHeader: 'Добавить канал',
        deleteChannelHeader: 'Удалить канал',
        deleteChannelBody: 'Уверены?',
        renameChannelHeader: 'Переименовать канал',
      },

    },
    network: {
      fail: 'сетевая ошибка, повторите попытку позже',
    },
  },
};
