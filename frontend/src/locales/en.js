export default {
  translation: {
    errors: {
      login: {
        invalid: 'Wrong username or password',
        required: 'Required field',
      },
      signup: {
        required: 'Required field',
        oneOf: 'Passwords must match',
        usernameSize: 'From 3 to 20 symbols',
        passwordSize: 'No less than 6 symbols',
        exists: 'User already exists',
      },
      modals: {
        required: 'Required field',
        channelNameSize: 'From 3 to 20 symbols',
        notOneOf: 'Should be unique',
      },
    },
    toasts: {
      networkError: 'Network error',
      channelCreated: 'Channel created',
      channelDeleted: 'Channel removed',
      channelRenamed: 'Channel renamed',
      unknownError: 'Something went wrong...',
    },
    notification: {
      loading: 'Loading...',
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
        channelControl: 'Channel control',
        enterMessage: 'Enter your message',
        ariaLabelMessage: 'New message',
        delete: 'Delete',
        rename: 'Rename',
        messagesCount: {
          key_one: '{{count}} message',
          key_other: '{{count}} messages',
        },
      },
      modals: {
        cancel: 'Cancel',
        send: 'Send',
        delete: 'Delete',
        channelName: 'Channel name',
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
