import axios from 'axios';
import { paymentLinks } from 'src/enum/paymentLinks';

export async function createPeyment(
  file: any,
  nationalC: string,
  date: number,
  complaitId: string,
  cost: string
) {
  const tt: string | null = localStorage.getItem('authentication');
  if (tt === null) {
    return 401;
  }
  const token = JSON.parse(tt).accessToken;
  const data = {
    files: file,
    nationalCodeUser: nationalC,
    date: date,
    codeDescriptionComplaint: complaitId,
    price: cost,
  };
  const result = await axios
    .post(paymentLinks.createPayment, data, {
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
