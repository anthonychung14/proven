import config from "../config/currency-config";

export const createRequest = (options = {}) => {
  const method = options.method || "GET";
  let body = options.body ? options.body : false;

  const base = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  if (body) {
    body = typeof body === "string" ? body : JSON.stringify(body);
    base.body = body;
  }

  return base;
};

export const fetchJSON = (url, request = createRequest()) =>
  fetch(url, request)
    .then(checkStatus)
    .then(res => res.json());

export const getResource = (options: Object = {}) => {
  const { method = "GET", fiat, symbol } = options;

  const request = createRequest({
    method
  });

  return fetchJSON(
    `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${fiat}`,
    request
  );
};

export const checkStatus = response => {
  if (response && response.status >= 200 && response.status < 300) {
    return response;
  }
  return response
    .json()
    .then(res => res)
    .catch(err => {
      throw err;
    });
};
