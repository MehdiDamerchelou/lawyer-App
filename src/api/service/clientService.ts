import axios from 'axios';
import { clientLinks } from 'src/enum/clientLinks';

export async function getClients(skip: number, limit: number) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(clientLinks.getClient + `/${skip}/${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response.status;
    });
  return result;
}
export async function getOneClient(id: string) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(clientLinks.getOneClient + `/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error.response.status;
    });
  return result;
}
export async function createClient(
  firstN: string,
  secondN: string,
  firstA: string,
  secondA: string,
  nCode: string,
  phoneNum: string,
  postCode: string
) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  const data = {
    firstName: firstN,
    familyName: secondN,
    addressOne: firstA,
    addressTwo: secondA,
    phoneNumber: phoneNum,
    codePost: postCode,
    nationalCode: nCode,
  };

  const result = await axios
    .post(clientLinks.createClient, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      return response.status;
    })
    .catch(function (error) {
      return error.response.status;
    });
  return result;
}
