import fetch from 'isomorphic-fetch';

const API_ROOT = 'https://easy-mock.com/mock/5b04275f5fa2b20fbca4a45b';

const codeMessage = {
  100: 'continue',
  101: 'switching protocols',
  102: 'processing',
  200: 'ok',
  201: 'created',
  202: 'accepted',
  203: 'non-authoritative information',
  204: 'no content',
  205: 'reset content',
  206: 'partial content',
  207: 'multi-status',
  208: 'already reported',
  226: 'im used',
  300: 'multiple choices',
  301: 'moved permanently',
  302: 'found',
  303: 'see other',
  304: 'not modified',
  305: 'use proxy',
  307: 'temporary redirect',
  308: 'permanent redirect',
  400: 'bad request',
  401: 'unauthorized',
  402: 'payment required',
  403: 'forbidden',
  404: 'not found',
  405: 'method not allowed',
  406: 'not acceptable',
  407: 'proxy authentication required',
  408: 'request timeout',
  409: 'conflict',
  410: 'gone',
  411: 'length required',
  412: 'precondition failed',
  413: 'payload too large',
  414: 'uri too long',
  415: 'unsupported media type',
  416: 'range not satisfiable',
  417: 'expectation failed',
  418: "I'm a teapot",
  422: 'unprocessable entity',
  423: 'locked',
  424: 'failed dependency',
  426: 'upgrade required',
  428: 'precondition required',
  429: 'too many requests',
  431: 'request header fields too large',
  500: 'internal server error',
  501: 'not implemented',
  502: 'bad gateway',
  503: 'service unavailable',
  504: 'gateway timeout',
  505: 'http version not supported',
  506: 'variant also negotiates',
  507: 'insufficient storage',
  508: 'loop detected',
  510: 'not extended',
  511: 'network authentication required'
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  console.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

export function request(url, options) {
  const defaultOptions = {
    credentials: 'include'
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }
  url = process.env.TARGET === 'githubpages' ? `${API_ROOT}${url}` : url;
  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then((json = {}) => {
      const { version, now } = json;
      return json.data || {};
    })
    .catch((e) => {
      const status = e.name;
      if (status === 401) {
        // unauthorized
      } else if (status === 403) {
        // forbidden
      } else if (status <= 504 && status >= 500) {
        // 50x
      } else if (status >= 404 && status < 422) {
        // 40x
      }
      throw e;
    });
}
