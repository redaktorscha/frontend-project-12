const APIBASE = '/api/v1';

const appRoutes = {
  apiV1LoginPath: () => [APIBASE, 'login'].join('/'),
  apiV1SignupPath: () => [APIBASE, 'signup'].join('/'),
  apiV1DataPath: () => [APIBASE, 'data'].join('/'),
  loginPath: () => '/login',
  rootPath: () => '/',
};

export default appRoutes;
