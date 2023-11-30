// Canvas utility classes and functions to interact with canvas

const canvasObserver = (obj, node) => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        obj.loop();
      } else {
        obj.noLoop();
      }
    });
  });
  observer.observe(node);
}

const setColor = (p, colorList, stroke=false, weight=1) => {
  const rgbToHex = (r, g, b) => {
    const componentToHex = (c) => {
        const hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return `#${componentToHex(r) + componentToHex(g) + componentToHex(b)}`;
  }
  const obj = {}
  obj.fill = []
  for (let color of colorList) {
    let colorObj = p.color(color);
    colorObj.hex = rgbToHex(colorObj.levels[0], colorObj.levels[1], colorObj.levels[2])
    obj.fill.push(colorObj);
  }
  obj.stroke = stroke ? p.color(stroke) : false;
  obj.weight = weight;
  return obj;
}

const gradient = (ctx, p, mass, pos, colorList, linear=false) => {
  try {
    let gradient;
    if (linear) {
      // gradient = ctx.createLinearGradient(0, mass.y, 0, 0);
      gradient = ctx.createLinearGradient(mass.x * 0.1, 0, mass.x + (mass.x * 0.15), 0);
    } else  {
      let radius = mass.x / 2;
      gradient = ctx.createRadialGradient(pos.x, pos.y, radius / 2, pos.x, pos.y, radius);
    }
    
    for (let [i, item] of colorList.entries()) {
      let mappedVal = parseFloat((i / colorList.length).toFixed(1));
      let rgba = `rgba(${item.levels[0]}, ${item.levels[1]}, ${item.levels[2]}, ${item.levels[3]})`;
      gradient.addColorStop(mappedVal, rgba);
    }
    return gradient;
  } catch (error) {
    console.log(colorList, 'pos', pos, 'mass', mass);
    console.log(error);
  }
}

// TO-DO Separate madecontact method into made contact y and made contact x 
class CanvasManager {
  constructor(p5, p, elem) {
    this.canvas = p.createCanvas(elem.offsetWidth, elem.offsetHeight, elem);
    this.p5 = p5;
    this.p = p;
    this.center = p.createVector(p.width / 2, p.height / 2);
    this.ctx = this.canvas.drawingContext;
    this.background;
    this.force;
    this.objects = [];
  }
  
  bg() {
    this.ctx.fillStyle = this.background;
    this.p.rect(this.center.x, this.center.y, this.p.width, this.p.height);
  }

  applyGradient() {
    this.ctx.fillStyle = this.background;
  }

  bounceOfBorder() {
    for (let i of this.objects) {
      i.bounceOfBorder();
    }
  }

  overlaps(obj) {
    for (let i of this.objects) {
      if (i.madeContact(obj)) {
        return true;
      }
    }
    return false;
  }

  bounceOfObject() {
    for (let i = 0; i < this.objects.length; i++) {
      const main = this.objects[i];
      main.bounced = false;
      if (main.bounced) continue;
      for (let e = i + 1; e < this.objects.length; e++) {
        let objCollide = false;
        const other = this.objects[e];
        if (other.bounced) continue;
        main.collide(other);
      }
    }
    for (let i of this.objects) i.bounced = false;
  }
}

class Shape {
  constructor(canvas, pos, vel, acc=false, mass, color=false, angle=[0], life=false) {
    this.p5 = canvas.p5;
    this.canvas = canvas.canvas;
    this.p = canvas.p;
    this.objects = canvas.objects;
    this.ctx = canvas.ctx;
    this.id = this.objects.length + 1;
    this.pos = pos;
    this.vel = vel;
    this.acc = acc ? acc : this.p.createVector(0, 0);
    this.mass = mass;
    this.color = color;
    this.original = {
      pos: Object.assign({}, pos),
      mass: Object.assign({}, mass),
      vel: Object.assign({}, vel),
      acc: Object.assign({}, acc),
      color: Object.assign({}, this.color)
    }

    this.p.angleMode(this.p.DEGREES);
    this.init(angle, life);
    this.setColor(this.color)
  }

  init(angle, life) {
    
    // SET ANGLE
    this.angle = {}
    this.angle.angle = angle[0];
    this.angle.vel = angle.length > 1 ? angle[1] : 0;
    this.original.angle = Object.assign({}, this.angle)

    // SET LIFE POINTS
    if (life) {
      this.life = {};
      let newMass = this.p.map(life - 1, 0, life, 0, this.mass.x);
      this.life.time = life;
      this.life.unit = this.mass.x - newMass;
      this.life.vector = this.p.createVector(this.life.unit, this.life.unit);
      this.original.life = Object.assign({}, this.life)
    }
    
  }

  sizeLife() {
    if (this.life.time > 0) {
      this.mass.sub(this.life.vector);
    }
  }

  colorLife() {
    if (this.life.time > 0) {
      let alpha = this.p.map(this.life.time, 0, this.original.life.time / 2, 0, 255);
      this.color.setAlpha(parseInt(alpha));
    }
  }

  updateLife(index) {
    if (this.life.time > 0) {
      this.life.time--;
    } else {
      this.objects.splice(index, 1);
    }
  }

  applyForce(force) {
    let generatedForce = this.p5.Vector.div(force, this.mass.x);
    this.acc.add(generatedForce);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  attract(mover) {
    let force = this.p5.Vector.sub(this.pos, mover.pos);
    let distanceSq = this.p.constrain(force.magSq(), 100, 1000);
    let G = 1;
    let strength = (G * (this.mass.x * mover.mass.x)) / distanceSq;
    force.setMag(strength);
    mover.applyForce(force);
  }

  bounceOfBorder() {
    const halfX = this.mass.x / 2;
    const halfY = this.mass.y / 2;
    const x = this.pos.x + this.vel.x;
    const y = this.pos.y + this.vel.y;

    if (y < halfY)                       this.vel.y = -this.vel.y;   // Top
    if (x > this.canvas.width - halfX)   this.vel.x = -this.vel.x;   // Right
    if (y > this.canvas.height - halfY)  this.vel.y = -this.vel.y;   // Bottom
    if (x < halfX)                       this.vel.x = -this.vel.x;   // Left

    this.pos.add(this.vel);
  }

  collide(other) {
    let relative = this.p5.Vector.sub(other.pos, this.pos);
    let dist = relative.mag() - ((this.mass.x / 2) + (other.mass.x / 2));
    if (dist < 0) {
      let movement = relative.copy().setMag(this.p.abs(dist/2));
      this.pos.sub(movement);
      other.pos.add(movement);
      let thisToOtherNormal = relative.copy().normalize();
      let approachSpeed = this.vel.dot(thisToOtherNormal) + -other.vel.dot(thisToOtherNormal);
      let approachVector = thisToOtherNormal.copy().setMag(approachSpeed);
      this.vel.sub(approachVector);
      other.vel.add(approachVector);
    }
  }

  madeContactX(obj) {
    const distance = this.p5.Vector.dist(this.pos, obj.pos);
    return distance <= (this.mass.x / 2) + (obj.mass.y / 2) ;
  }

  madeContactY(obj) {
    const distance = this.p5.Vector.dist(this.pos, obj.pos);
    return distance <= (this.mass.y / 2) + (obj.mass.y / 2);
  }

  madeContact(obj) {
    // let relative = this.p5.Vector.sub(other.pos, main.pos);
    // let dist = relative.mag() - (main.mass.x + other.mass.x);
    const distance = this.p5.Vector.dist(this.pos, obj.pos);
    const x = (this.mass.x / 2) + (obj.mass.x / 2);
    const y = (this.mass.y / 2) + (obj.mass.y / 2);
    return distance <= x || distance <= y;
  }

  setColor(color) {
    if (!color) return false;
    if (color.stroke) {
      this.p.strokeWeight(color.weight);
      this.p.stroke(color.stroke);
    } else {
      this.p.noStroke();
    }

    if (color.fill.length > 0) {
      if (color.fill.length > 1) {
        this.ctx.fillStyle = gradient(this.ctx, this.p, this.mass, this.pos, color.fill);
        this.ctx.fill();
      } else {
        this.p.fill(color.fill[0]);
      }
    } else {
      this.p.noFill();
    }

  }

  rotate(angle=false) {
    let vel = angle ? angle : this.angle.vel;
    this.angle.angle = this.angle.angle + vel
    this.p.push();
    this.p.translate(this.pos.x, this.pos.y);
    this.p.rotate(this.angle.angle);
    let pos = this.p.createVector(0,0);
    this.draw(pos);
    this.p.pop();
  }

}

class Ellipse extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life) {
    super(canvas, pos, vel, acc, mass, color, angle, life);
    this.p.ellipseMode(this.p.CENTER);
  }

  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    this.p.ellipse(custPos.x, custPos.y, this.mass.x, this.mass.y);
  }

}

class Rect extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life, radius=0) {
    super(canvas, pos, vel, acc, mass, color, angle, life);
    this.radius = radius;
    this.p.rectMode(this.p.CENTER);
  }

  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    this.p.rect(custPos.x, custPos.y, this.mass.x, this.mass.y, this.radius);
  }

}

class Triangle extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life) {
    super(canvas, pos, vel, acc, mass, color, angle, life);
    // this.p.triangleMode(this.p.CENTER);
  }

  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    // this.p.triangle(-this.pos.x, -this.mass.y / 2, -this.mass.x, this.mass.y / 2, this.mass.x, 0);
    // this.p.triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0)
  }

}

class Polygon extends Shape {
  constructor(canvas, pos, vel, acc, mass, color, angle, life, sides) {
    super(canvas, pos, vel, acc, mass, color, angle, life, sides);
    this.sides = sides;
  }
  
  draw(pos=false) {
    super.setColor(this.color);
    const custPos = pos ? pos : this.pos;
    const radius = this.mass.x / 2;
    const angle = 360 / this.sides;
    this.p.beginShape();
    for (let i = 0; i < this.sides; i++) {
      const x = custPos.x + radius * this.p.cos(angle * i);
      const y = custPos.y + radius * this.p.sin(angle * i);
      this.p.vertex(x, y);
    }
    this.p.endShape(this.p.CLOSE);
  }

}

class Line {
  constructor(canvas, start, end, vel, color='#fff', stroke=1) {
    this.p5 = canvas.p5;
    this.canvas = canvas.canvas;
    this.p = canvas.p;
    this.objects = canvas.objects;
    this.id = this.objects.length + 1;
    this.originalStart = Object.assign({}, start);
    this.originalEnd = Object.assign({}, end);
    this.start = start;
    this.end = end;
    this.vel = vel ? vel : this.p.createVector(0, 0);
    this.color = color;
    this.stroke = stroke;
    // console.log(this.color, this.stroke)
    this.draw();
  }

  getDisplacement() {
    let direction = this.p5.Vector.sub(this.start, this.end);
    direction.normalize();
    return direction.mult(this.vel);
  }

  updateStroke(color=false, stroke=1) {
    if (color) {
      this.p.strokeWeight(stroke);
      this.p.stroke(color);
    } else {
      this.p.noStroke();
    }
  }

  draw() {
    // console.log(this)
    // this.p.strokeWeight(1);
    // this.p.stroke('#fff');
    // this.p.line(0, 0, 300, 300);
    this.updateStroke(this.color, this.stroke);
    this.p.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

class Orbit {
  constructor(canvas, orbit) {
    this.p5 = canvas.p5;
    this.canvas = canvas.canvas;
    this.p = canvas.p;
    this.orbit = orbit;
    this.objects = canvas.objects;
    this.id = this.objects.length + 1;
    this.children = [];
  }

  rotate() {
    this.p.push(); 
    this.p.translate(this.orbit.pos.x, this.orbit.pos.y);
    for (let i of this.children) {
      i.pos.x = (this.orbit.mass.x / 2) * this.p.cos(i.angle.angle);
      i.pos.y = (this.orbit.mass.x / 2) * this.p.sin(i.angle.angle);
      i.draw();
      i.angle.angle += i.angle.vel;
    }
    this.p.pop();
  }
}

class Flame {
  constructor(canvas) {
    this.p5 = canvas.p5;
    this.canvas = canvas.canvas;
    this.p = canvas.p;
  }

  burn() {

  }
}

export { Ellipse, Rect, Line, canvasObserver, CanvasManager, Triangle, Polygon, Orbit, gradient, setColor }