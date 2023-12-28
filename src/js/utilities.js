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

const getRgb = (hex) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

const getHex = (r, g, b) => {
  const componentToHex = (current) => {
      const hex = current.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
  }
  return `#${componentToHex(r) + componentToHex(g) + componentToHex(b)}`;
}

export { random, exists, ajax, msgError, msgSuccess, getRgb, getHex }