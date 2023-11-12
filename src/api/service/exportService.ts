import axios from 'axios';
import { exportLink } from 'src/enum/exportLink';

export async function nCodeExport(
  nCode: string,
  skip: number,
  limiting: number | string,
  radioVal: string
) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;

  let url = '';
  if (radioVal == 'payment') {
    url = exportLink.nCodePayment;
  } else if (radioVal == 'Complaint') {
    url = exportLink.nCodeComplaint;
  }

  const result = await axios
    .get(url + `/${skip}/${limiting}/${nCode}`, {
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

export async function dateExport(
  from: number,
  to: number,
  skip: number,
  limiting: string | number,
  radioVal: string
) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  let url = '';
  if (radioVal == 'payment') {
    url = exportLink.datePayment;
  } else if (radioVal == 'eventscase') {
    url = exportLink.dateEvent;
  } else if (radioVal == 'Complaint') {
    url = exportLink.dateComplaint;
  }
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(url + `/${skip}/${limiting}/${from}/${to}`, {
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

export async function complaintIdExport(
  complaintId: string,
  skip: number,
  limiting: string | number,
  radioVal: string
) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  let url = '';
  if (radioVal == 'payment') {
    url = exportLink.complaintIdPayment;
  } else if (radioVal == 'Complaint') {
    url = exportLink.complaintIdComplaint;
  }
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(url + `/${skip}/${limiting}/${complaintId}`, {
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
