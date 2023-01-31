const APIBASE = '/api/v1';
const LOGIN_ENDPOINT = 'login';
const SIGNUP_ENDPOINT = 'signup';
const DATA_ENDPOINT = 'data';

const getRoute = (endpoint) => [APIBASE, endpoint].join('/');

const appRoutes = {
  [LOGIN_ENDPOINT]: () => getRoute(LOGIN_ENDPOINT),
  [SIGNUP_ENDPOINT]: () => getRoute(SIGNUP_ENDPOINT),
  [DATA_ENDPOINT]: () => getRoute(DATA_ENDPOINT),
};

export {
  appRoutes, LOGIN_ENDPOINT, SIGNUP_ENDPOINT, DATA_ENDPOINT,
};
