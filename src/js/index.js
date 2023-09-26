import { msgError, msgSuccess } from './utilities.js';
import Form from './form.js';
import Limiter from './limiter.js';
import { Canvas, RoundRec } from './canvas.js';
import '../css/form.css';
import '../css/canvas.css';
import '../css/global.css';

const limiterCallback = (form, val) => {
  // Limiter requires 2 parameters
  // 1. Element to disable
  // 2. Element to display current status
  let limiter = new Limiter(form.next, form.status);
  // Form submit button has been disabled
  if (limiter.disabled) return false; 
  return new Promise( async (resolve) => {
    limiter.add();
    console.log(val);
    resolve(true);
  });
}
const limiterForm = document.querySelector('#limiter');
const limiter = new Form(limiterForm, limiterCallback, false);



// Callback function will run when last step is submitted
const contactInfoFormCallback = (form, val) => {
  return new Promise( async (resolve) => {
    console.log(val);
    resolve(true);
  });
}

// Callback will run whenver a tab changes, (does not run when going back)
const contactInfoChangeTabCallback = (form, val) => {
  return new Promise( async (resolve) => {
    console.log(val);
    resolve(true);
  });
}

const contactInfoForm = document.querySelector('#contact-info');
const contactInfo = new Form(contactInfoForm, contactInfoFormCallback, contactInfoChangeTabCallback);


// let canvasNode = document.querySelector('#mountains');
// const canvas = new Canvas(canvasNode);
// await canvas.init();

// const callback = () => {
//   var incAmount = 0.01;
//   for (var t = 0; t < incAmount * canvas.node.width; t += incAmount) {
//       var n = noise(t);
//       var y = map(n, 0, 1, 0, canvas.node.height / 2);
//       rect(t * 100, height - y, 1, y);
//   }  
//   canvas.animationId = requestAnimationFrame(callback);
// }
// canvas.registerCallback(callback);


