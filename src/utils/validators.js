const mongoose = require("mongoose");

const isValidName = function (value) {
  if (
    typeof value === "string" &&
    value.trim().length > 0 &&
    /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(value)
  )
    return true;
  return false;
};
const isValid = function (value) {
  if (typeof value === "string" && value.trim().length > 0) return true;
  return false;
};
const isValidPassword = function (value) {
  if (
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
      value
    )
  )
    return true;
  return false;
};
const isValidEmail = function (value) {
  if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value)) return true;
  return false;
};
const isValidDate = function (value) {
  if (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(value))
    return true;
  return false;
};

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].includes(title);
};

const isValidMobile = function (value) {
  if (typeof value === "string" && /^[0-9]\d{9}$/gi.test(value)) return true;
  return false;
};
const isValidISBN = function (value) {
  if (/^[\d]{3}-[\d]{10}$/gi.test(value)) return true;
  return false;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (objectId) {
  return mongoose.isValidObjectId(objectId);
};

module.exports = {
  isValid,
  isValidTitle,
  isValidRequestBody,
  isValidObjectId,
  isValidPassword,
  isValidEmail,
  isValidName,
  isValidMobile,
  isValidISBN,
  isValidDate,
};

// console.log(isValidDate("1555-12-32"));
