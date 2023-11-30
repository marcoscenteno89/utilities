const msgError = (msg, width) => {
  return `<div class="msg warning" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
}

const msgSuccess = (msg, width) => {
  return `<div class="msg success" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
}

const msgGeneric = (msg, width) => {
  return `<div class="msg generic" style="${width ? `width:${width}%;` : ''}">${msg}</div>`;
}

const exists = [''.trim(), undefined, null, false, 'null'];

const ajax = (api, callback=false) => {
  if (!api.method) api.method = 'GET';
  if (!api.credentials) api.credentials = 'same-origin';
  if (!api.headers) api.headers = new Headers({ 
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8' 
  });
  let tmp;
  return fetch(api.url, api).then(res => {
    tmp = res.ok;
    return api.res ? res.text() : res.json();
  }).then(data => {
    if (!tmp) console.log(data, api);
    data.ok = tmp;
    return data;
  }).catch(err => {
    console.log(err, api);
  });
}
const random = (min=0, max=1, allowZero=true) => {
  let number = Math.random() * (max - min) + min;
  if (!allowZero) {
    while (number > -0.5 && number < 0.5) {
      number  = Math.random() * (max - min) + min;
    }
  }
  return number;
}

class Num extends Number {

  constructor(number) {
    super(number);
  }

  decimal(decimalPlaces) {
    return new Num(this.toFixed(decimalPlaces));
  }

  additiveInverse() {
    return new Num(Math.sign(this) === -1 ? Math.abs(this) : this * -1);
  }

  round() {
    return new Num(Math.round(this));
  }

  add(number) {
    return new Num(this + number);
  }

}

export { random, exists, ajax, msgError, msgSuccess, Num }