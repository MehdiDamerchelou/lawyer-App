import axios from 'axios';
import { authLinks } from 'src/enum/authLinks';

export async function login(uName: string, pwd: string) {
  const data = {
    userName: uName,
    password: pwd,
  };

  const result = await axios
    .post(authLinks.login, data)
    .then((respone) => {
      return respone.data;
    })
    .catch((error) => {
      if (error.code == 'ERR_NETWORK') {
        return undefined;
      }
      return error.response.status;
    });
  if (result == undefined) {
    return undefined;
  }
  if (result.accessToken) {
    const st = JSON.stringify(result);
    localStorage.setItem('authentication', st);
  }

  return result;
}
export async function refreshToken() {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }

  const lastToken = JSON.parse(tt).refreshToken;
  const userId = JSON.parse(tt).userId;

  const data = {
    userId: userId,
    refreshToken: lastToken,
  };

  const result = await axios
    .post(authLinks.refreshToken, data)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      if (error.code == 'ERR_NETWORK') {
        return 401;
      }
      return error.response.status;
    });

  if (result === null) {
    return 401;
  }
  if (result.accessToken) {
    const sst = JSON.stringify(result);
    localStorage.setItem('authentication', sst);
  }
  return result;
}
