const apiBase = '/api/v1';

export default (endpoint) => [apiBase, endpoint].join('/');
