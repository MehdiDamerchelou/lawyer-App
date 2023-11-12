import axios from 'axios';
import { CaseController } from 'src/enum/Caselink';

export async function createFile(
  nationalCode: string,
  Complaintcode: string,
  Archivenumber: number,
  FileNumber: number,
  indictmentnumber: number,
  Dateset: number,
  accused: string[]
) {
  const data = {
    userNationalCode: nationalCode,
    codeDescriptionComplaint: Complaintcode,
    petitionNumber: Archivenumber,
    dateSet: Dateset,
    caseNumber: FileNumber,
    branchArchiveNumber: indictmentnumber,
    accuseds: accused,
  };
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  const res = await axios
    .post(CaseController.createCaseLink, data, {
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
  return res;
}

export async function getFile(cCode: string, skip: number, limit: number) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  const res = await axios
    .get(CaseController.getCaseLink + `/${skip}/${limit}/${cCode}`, {
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
  return res;
}

export async function getOneFile(cCode: string) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  const res = await axios
    .get(CaseController.getOneCaseLink + `/${cCode}`, {
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
  return res;
}
