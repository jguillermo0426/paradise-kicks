import Cookies from 'js-cookie';

export const setCookie = (key: string, value: string, options = {}) => {
  Cookies.set(key, value, { expires: 7, ...options });
};

export const getCookie = (key: string) => {
  const value = Cookies.get(key);
  return value ? JSON.parse(value) : null;
};

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};
