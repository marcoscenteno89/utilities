import { msgError, msgSuccess } from './utilities.js';
import '../css/form.css';
import { startCase } from 'lodash';

const formCallback = (form, val) => {
  // let limiter = new Limiter(form.next, form.status);
  // if (limiter.disabled) return false; // FORM HAS BEEN DISABLED
  return new Promise( async (resolve) => {
    console.log(status);
    let msgE = `4
      We could not find your address or you are located outside of our active service area.
    `;
    let stat = form.status;
    if (status.error) {
      stat.innerHTML = msgError(status.detail);
    } else {
      let res = status.result
      if (res.length > 0) {
        stat.innerHTML = msgSuccess(startCase(res[0].properties.Status));
      } else {
        stat.innerHTML = msgError(msgE);
      }
    }
    resolve('data from form');
  });
}
const checkAddressForm = document.querySelector('.check-address');
const checkAddress = new Form(checkAddressForm);
