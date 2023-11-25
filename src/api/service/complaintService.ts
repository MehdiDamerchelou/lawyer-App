import axios from 'axios';
import { complaintLinks } from 'src/enum/complaintLinks';

export async function createComplaint(
  nationalC: string,
  title: string,
  pDate: number,
  why: string
) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;
  const data = {
    titleDescriptionComplaint: title,
    nationalCodeUser: nationalC,
    datePresence: pDate,
    descriptionComplaint: why,
  };

  const result = await axios
    .post(complaintLinks.createComplaint, data, {
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
export async function getComplaint(id: string, skip: number, limit: number) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  const result = await axios
    .get(complaintLinks.getComplaint + `/${skip}/${limit}/${id}`, {
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
export async function getOneComplaint(id: string) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  const result = await axios
    .get(complaintLinks.getOneComplaint + `/${id}`, {
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
