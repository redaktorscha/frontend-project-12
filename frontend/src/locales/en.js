export default {
  translation: {
    errors: {
      login: {
        invalid: 'Wrong username or password',
      },
      signup: {
        required: 'Required field',
        oneOf: 'Passwords must match',
        size: 'From 3 to 20 symbols',
        min: 'No less than 6 symbols',
        notOneOf: 'User already exists',
      },
      addChannel: {
        notOneOf: 'Should be unique',
      },
    },
    ui: {
      btnLogout: 'Logout',
    },
    network: {
      fail: 'network error, try again later',
    },
  },
};
