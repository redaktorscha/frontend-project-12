export default {
  translation: {
    errors: {
      unknown: 'Unknown error',
      login: {
        invalid: 'Wrong username or password',
        required: 'Required field',
      },
      signup: {
        required: 'Required field',
        oneOf: 'Passwords must match',
        size: 'From 3 to 20 symbols',
        min: 'No less than 6 symbols',
        exists: 'User already exists',
      },
      addChannel: {
        notOneOf: 'Should be unique',
      },
    },
    ui: {
      header: {
        btnLogout: 'Logout',
      },
      footer: {
        picturesCopyright: 'Online illustrations by Storyset',
      },
      notfound: {
        heading: 'Page not found',
        text: 'Would you like to return',
        link: 'to the main page?',
      },
      login: {
        enter: 'Login',
        username: 'Your nickname',
        password: 'Your password',
        btnLogin: 'Login',
        spanNoAcc: 'No account yet?',
        linkRegister: 'Sign up',
      },
      signup: {
        signup: 'Sign up',
        username: 'Username',
        password: 'Password',
        confirmPassword: 'Confirm password',
        btnSignup: 'Sign up',
      },
      chat: {
        send: 'Send',
        channels: 'Channels',
        enterMessage: 'Enter your message',
        delete: 'Delete',
        rename: 'Rename',
        messagesCount: 'messages',
      },
      modals: {
        cancel: 'Cancel',
        send: 'Send',
        delete: 'Delete',
        addChannelHeader: 'Add channel',
        deleteChannelHeader: 'Remove channel',
        deleteChannelBody: 'Are you sure?',
        renameChannelHeader: 'Rename channel',
      },
    },
    network: {
      fail: 'network error, try again later',
    },
  },
};
