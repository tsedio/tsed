"use strict";

const TYPES = {
  "@": {value: "decorator", label: "Decorator"},
  "T": {value: "type", label: "Type alias"},
  "C": {value: "class", label: "Class"},
  "S": {value: "service", label: "Service"},
  "I": {value: "interface", label: "Interface"},
  "K": {value: "const", label: "Constant"},
  "E": {value: "enum", label: "Enum"},
  "F": {value: "function", label: "Function"}
};

Object.keys(TYPES).forEach((key) => {
  TYPES[key].code = key;
  TYPES[TYPES[key].value] = TYPES[key];
});

module.exports = TYPES;