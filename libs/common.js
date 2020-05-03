
function _isAlphabet(str) {
  return /^[a-zA-Z()]+$/.test(str);
}

let _nextChar = function(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

export {
  _isAlphabet as isAlphabet,
  _nextChar as nextChar
}