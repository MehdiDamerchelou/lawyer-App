import axios from 'axios';
import { caseEventLinks } from 'src/enum/caseEventLinks';
export async function createCaseEvent(
  file: any,
  caseId: string,
  dateSet: number,
  dateDone: number,
  description: string,
  radioVal: string
) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  const data = {
    files: file,
    codeCase: caseId,
    dateRecord: dateSet,
    dateDo: dateDone,
    descriptionEvent: description,
    status: radioVal,
  };
  const result = await axios
    .post(caseEventLinks.createCaseEvent, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
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
export async function getEvent(id: string, skip: number, limit: number) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  const result = await axios
    .get(caseEventLinks.getCaseEvent + `/${skip}/${limit}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
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
export async function getOneEvent(id: string) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  const result = await axios
    .get(caseEventLinks.getOneCaseEvent + `/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
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
