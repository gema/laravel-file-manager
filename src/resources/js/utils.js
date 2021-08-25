/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const request = (
  endpoint,
  callback,
  method = 'GET',
  data = false,
  headers = false,
  err = false
) => {
  const head = new Headers();
  if (headers) {
    Object.entries(headers).forEach(([key, val]) => head.append(key, val));
  } else {
    head.append('Accept', 'application/json');
  }

  let formData = null;

  if (data) {
    formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key && value) {
        if (typeof value === 'object') {
          // Array
          if (Array.isArray(value)) {
            for (const [, subValue] of Object.entries(value)) {
              formData.append(`${key}[]`, subValue);
            }
          } else if (value instanceof File) {
            // Object
            formData.append(key, value);
          } else {
            formData.append(key, JSON.stringify(value));
          }
        } else {
          // Default
          formData.append(key, value);
        }
      }
    }
  }

  if (method.toLowerCase() === 'post') {
    let csrfToken = false;
    const csrfTokenElement = document.querySelector('meta[name=csrf-token]');
    
    if (csrfTokenElement !== undefined) {
      csrfToken = csrfTokenElement.content
    }

    if (csrfToken) {
      if (formData === null) formData = new FormData();
      formData.append('_token', csrfToken);
    }
  }

  fetch(document.location.origin + endpoint, {
    method,
    headers: head,
    body: formData,
  })
    .then(response => response.json())
    .then(result => callback(result))
    .catch(e => (err ? err(e) : console.error(e)));
};

const truncate = (str, length, ending = '...') => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  }
  return str;
};

module.exports = {
  request,
  truncate,
};
