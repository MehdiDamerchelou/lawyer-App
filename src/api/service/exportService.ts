import axios from 'axios';
import { exportLink } from 'src/enum/exportLink';

export async function nCodeExport(nCode: string, radioVal: string) {
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
  nCode = nCode.trim();
  const result = await axios
    .get(url + `/${nCode}`, {
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

export async function dateExport(from: number, to: number, radioVal: string) {
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
    .get(url + `/${from}/${to}`, {
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

export async function complaintIdExport(complaintId: string, radioVal: string) {
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
  complaintId = complaintId.trim();
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(url + `/${complaintId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      if (response.status == 204) return undefined;
      return response.data;
    })
    .catch(function (error) {
      return error.response.status;
    });

  return result;
}
export async function exportName(
  name: string,
  family: string,
  radioVal: string
) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  let url = '';
  if (radioVal == 'payment') {
    url = exportLink.namePayment;
  } else if (radioVal == 'Complaint') {
    url = exportLink.nameComplaint;
  }
  name = name.trim();
  family = family.trim();
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(url + `/${name}/${family}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
      if (response.status == 204) return undefined;
      return response.data;
    })
    .catch(function (error) {
      return error.response.status;
    });
  return result;
}
export async function exportText(text: string) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  text = text.trim();
  const token = JSON.parse(tt).accessToken;
  const result = await axios
    .get(exportLink.text + `/${text}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    .then(function (response) {
      if (response.status == 204) return undefined;
      return response.data;
    })
    .catch(function (error) {
      return error.response.status;
    });
  return result;
}
