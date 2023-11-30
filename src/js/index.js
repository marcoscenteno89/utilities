import { Num, random } from './utilities.js';
import Form from './form.js';
import Limiter from './limiter.js';
import { canvasObserver, CanvasManager, Rect, Ellipse, Line, Triangle, Polygon, Orbit, gradient, setColor } from './canvas.js';
import '../css/form.css';
import '../css/canvas.css';
import '../css/global.css';
import p5 from 'p5';


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

const networkNode = document.getElementById('network');
const blobNode = document.getElementById('canvas');

let canvas;
// ADDING PHYSICS
// const sketch = new p5((p) => {
//   p.setup = () => {
//     canvas = new CanvasManager(p5, p, networkNode);
//     p.background(255);
//     for (let i = 0; i < 10; i++) {
//       let a = `rgb(${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))})`;
//       let color = p.color(a);
//       color.fill = [a];
//       let width = p.random(20, 60);
//       let mass = p.createVector(width, width);
//       let pos = p.createVector(random(mass.x, p.width - mass.x), random(mass.y, p.height - mass.y));
//       let vel = p.createVector(p.random(-3, 3), p.random(-3, 3));
//       let acc = p.createVector(0, 0);
//       // Set unique location
//       while (canvas.overlaps({mass: mass, pos: pos}) === true) {
//         pos = p.createVector(random(mass.x, p.width - mass.x), random(mass.y, p.height - mass.y));
//       }
//       canvas.objects.push(new Rect(canvas, pos, vel, acc, mass, color, [0, 1]));
//     }
//   };
//   p.draw = () => {
//     let force = p.createVector(0, -0.1);
//     p.background(255);
//     canvas.bounceOfObject();
//     canvas.bounceOfBorder();
//     for (let item of canvas.objects) {
//       item.applyForce(force);
//       item.rotate(); // rotate() method cointains draw() method.
//     }
//   };
// });


// SPEED OF LIGHT
// const sketch = new p5((p) => {
//   p.setup = () => {
//     canvas = new CanvasManager(p5, p, networkNode);
//     p.background(0);

//     let w = 5;
//     let width = canvas.canvas.width / 2;
//     let height = canvas.canvas.height / 2;
//     let r = parseInt(p.random(0, 255));
//     let g = parseInt(p.random(0, 255));
//     let b = parseInt(p.random(0, 255));
//     let color = setColor(p, [`rgba(${r}, ${g}, ${b}, 0.${random(1,9).toFixed(0)})`]);
//     for (let i = 0; i < 200; i++) {
//       let end = p.createVector(random(width - w, width + w), random(height - w, height + w));
//       let start = p.createVector(width, height);
//       let vel = random(6, 15);
//       canvas.objects.push(new Line(canvas, start, end, vel, color.fill[0], random(0.2, 3)));
//     }
//   };
//   p.draw = () => {
//     p.background(0);
//     for (let i of canvas.objects) {
//       let displacement = i.getDisplacement();
//       let lengthFromCenter = p.dist(i.originalStart.x, i.originalStart.y, i.end.x, i.end.y);
//       let length = p.dist(i.start.x, i.start.y, i.end.x, i.end.y);
//       if (length > canvas.canvas.width / 2) i.start.sub(displacement);
//       if (lengthFromCenter > canvas.canvas.width) {
//         i.start.set(i.originalStart.x, i.originalStart.y);
//         i.end.set(i.originalEnd.x, i.originalEnd.y);
//       }
//       i.end.sub(displacement);
//       i.draw();
//     }
//   };
// });


// ORBIT
// const sketch = new p5((p) => {
//   p.setup = () => {
//     canvas = new CanvasManager(p5, p, networkNode);
//     let pos = p.createVector(p.width / 2, p.height / 2);
//     for (let i = 0; i < 100; i++) {
//       let color = setColor(p, [`rgb(255, 255, 255)`]);
//       let width = p.random(50, p.width);
//       let mass = p.createVector(width, width);
//       let vel = p.createVector(random(1, 5), random(1,5));
//       let acc = p.createVector(0, 0);
//       let orbitCircle = new Ellipse(canvas, pos, vel, acc, mass, false, [0,1]);
//       let orbit = new Orbit(canvas, orbitCircle);
//       let objPos = p.createVector(p.random(mass.x, p.width - mass.x), p.random(mass.y, p.height - mass.y));
//       let objMass = p.createVector(1, 1);
//       for (let i = 0; i < 10; i++) {
//         let angle = [p.random(1, 360), p.random(0.2, 0.5)]
//         orbit.children.push(new Ellipse(canvas, objPos, vel, acc, objMass, color, angle, false));
//       }
//       canvas.objects.push(orbit);
//     }
//   };
//   p.draw = () => {
//     let vel = random(-0.4, 0.4);
//     p.background(0, 20);
//     for (let i of canvas.objects) {
//       i.rotate();
//       if (i.orbit.mass.x < 50 || i.orbit.mass.x > i.orbit.canvas.width) vel = -vel;
//       i.orbit.mass.x += vel;
//       i.orbit.mass.y += vel;
//     }
//   };
// });

// BLOB
// const sketch = new p5((p) => {
//   p.setup = () => {
//     canvas = new CanvasManager(p5, p, blobNode);
//     let bg = setColor(p, [
//       `rgb(${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))})`,
//       `rgb(${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))})`
//     ]);
//     canvas.background = gradient(canvas.ctx, p, p.createVector(p.width, p.height), canvas.center, bg.fill, true);
//     let color = setColor(p, [`rgb(255, ${parseInt(p.random(0, 200))}, 0)`]);
//     for (let i = 0; i < 10; i++) {
//       let width = p.random(p.width / 40, p.width / 6);
//       let mass = p.createVector(width, width);
//       let pos = p.createVector(p.random(width, p.width - width), p.random(width, p.height - width));
//       let vel = p.createVector(p.random(-1.5), p.random(1.5));
//       canvas.objects.push(new Ellipse(canvas, pos, vel, false, mass, color));
//     }
//   };
//   p.draw = () => {
//     p.clear();
//     canvas.applyGradient();
//     for (let [i, item] of canvas.objects.entries()) {
//       item.bounceOfBorder();
//       item.draw();
//     }
//   };
// });

// NETWORK
// const sketch = new p5((p) => {
//   p.setup = () => {
//     canvas = new CanvasManager(p5, p, networkNode);
//     let color = setColor(p, [
//       `rgb(${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))})`
//     ]);
//     for (let i = 0; i < 20; i++) {
//       let mass = p.createVector(1, 1);
//       let pos = p.createVector(p.random(10, p.width - 10), p.random(10, p.height - 10));
//       let vel = p.createVector(p.random(-1), p.random(1));
//       canvas.objects.push(new Ellipse(canvas, pos, vel, false, mass, color));
//     }
//   };
//   p.draw = () => {
//     let limit = p.width / 3;
//     p.background(0);
//     for (let outer of canvas.objects) {
//       outer.bounceOfBorder();
//       let linesConnected = 0;
//       for (let inner of canvas.objects) {
//         if (outer !== inner) {1
//           let dist = p5.Vector.dist(outer.pos, inner.pos);
//           if (dist < limit && dist > 1 ) {
//             linesConnected++;
//             let alpha = p.map(dist, limit, 0, 0, 1);
//             outer.color.fill[0].setAlpha(p.map(alpha, 0, 1, 0, 255))
//             new Line(canvas, outer.pos, inner.pos, false, outer.color.fill[0], alpha);
//           }
//         }
//         let newMass = p.map(linesConnected, 0, canvas.objects.length, 0, 7);
//         outer.mass.set(p.createVector(newMass, newMass));
//         outer.draw();
//       }
//     }
//   };
// });


// WAVES 
// const sketch = new p5((p) => {
//   networkNode.style.height = '400px';
//   p.setup = () => {
//     canvas = new CanvasManager(p5, p, networkNode);
//     let bg = setColor(p, [
//       `rgb(${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))})`,
//       `rgb(${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))}, ${parseInt(p.random(0, 255))})`
//     ]);
//     canvas.background = gradient(canvas.ctx, p, p.createVector(p.width, p.height), canvas.center, bg.fill, true);
//     let color = setColor(p, ['#ffffff']);
//     let colorb = setColor(p, ['rgba(255,255,255,0.5)']);
//     let circleSize = p.width * 2;
//     let mass = p.createVector(circleSize, circleSize);
//     let vel = p.createVector(0, 0);
//     let pos = p.createVector(p.width / 2, (p.height / 2) - (circleSize / 2));
//     canvas.objects.push(new Rect(canvas, pos, vel, false, mass, color, [0, 1], false, circleSize * 0.45))
//     canvas.objects.push(new Rect(canvas, pos, vel, false, mass, colorb, [0, 1], false, circleSize * 0.4))
//   };
//   p.draw = () => {
//     p.clear();
//     canvas.bg();
//     for (let i of canvas.objects) {
//       i.rotate();
//     }
//   };
// });


// // FLAMES
// const sketch = new p5((p) => {
//   p.setup = () => {
//     canvas = new CanvasManager(p5, p, networkNode);
//     canvas.force = p.createVector(0, -0.2);
//     canvas.ctx.globalCompositeOperation = "screen";
//     p.blendMode(p.ADD);

//     // Adding wind pressure
//     setInterval(function() {
//       canvas.force.set(p.random(-0.2, 0.2), p.random(-0.2, -0.25));
//     }, 4000);
//   };
//   p.draw = () => {
//     p.clear();
//     p.background(0);
//     let red = [`rgb(255, ${parseInt(p.random(1, 200))}, 0)`, 'rgba(200, 100, 100, 0)'];
//     let green = [
//       `rgb(${parseInt(p.random(0, 200))}, 255, ${parseInt(p.random(0, 200))})`, 
//       'rgba(0, 255, 0, 0)'
//     ];
//     let blue = [
//       `rgb(${parseInt(p.random(0, 50))}, ${parseInt(p.random(30, 255))}, 255)`, 
//       'rgba(0, 50, 255, 0)'
//     ];
//     let purple = [
//       `rgb(${parseInt(p.random(50, 200))}, ${parseInt(p.random(0, 25))}, ${parseInt(p.random(50, 255))})`, 
//       `rgba(${parseInt(p.random(50, 200))}, ${parseInt(p.random(0, 25))}, ${parseInt(p.random(50, 255))}, 0)`
//     ];
//     let color = setColor(p, red);
//     for (let i = 0; i < 1; i++) {
//       let width = p.random(1, 100);
//       let mass = p.createVector(width, width);
//       let pos = p.createVector(p.random(canvas.center.x - 80, canvas.center.x + 80), p.random(380, 420));
//       let vel = width < 50 ? p5.Vector.random2D() : p.createVector(0, -0.3);
//       let life = width < 50 ? p.random(100, 300) : p.random(200, 400);
//       let acc = p.createVector(0, 0);
//       canvas.objects.push(new Ellipse(canvas, pos, vel, acc, mass, color, [0], life));
//     }
    
//     for (let [i, item] of canvas.objects.entries()) {
//       item.draw();
//       item.applyForce(canvas.force);
//       item.updateLife(i);
//       item.sizeLife();
//     }
//   };
// });








canvasObserver(sketch, networkNode);

