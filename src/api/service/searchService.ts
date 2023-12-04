import axios from 'axios';
import { searchLinks } from 'src/enum/searchLinks';
export async function searchNationalCode(nCode: string) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(searchLinks.nationalCode + `/${nCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.status;
    });
  return result;
}
export async function searchCaseCode(caseCode: string) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(searchLinks.caseCode + `/${caseCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.status;
    });
  return result;
}
export async function searchComplaintCode(complaintCode: string) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(searchLinks.complaintCode + `/${complaintCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.status;
    });
  return result;
}
export async function searchName(firstName: string, familyName: string) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;
  familyName = 'undefined';
  const result = await axios
    .get(searchLinks.name + `/${firstName}/${familyName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.response.status;
    });
  return result;
}
