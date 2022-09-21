const userModel = require("../models/userModels");
const validator = require("../utils/validators");
const jwt = require("jsonwebtoken");

const createUser = async function (req, res) {
  try {
    const data = req.body;
    const { title, name, phone, email, password, address } = data;

    if (!validator.isValidRequestBody(data))
      return res
        .status(404)
        .send({ status: false, msg: "provide user details is required" });

    if (!title)
      return res.status(400).send({ status: false, msg: "title is requried" });
    if (!validator.isValidTitle(title))
      return res.status(400).send({
        status: false,
        msg: "Title must be string and among these Mr, Mrs and Miss",
      });
    data.title = title.trim();

    if (!validator.isValidName(name))
      return res.status(400).send({
        status: false,
        msg: "name is requried and please provide a valid name",
      });
    data.name = name.trim();

    if (!validator.isValidMobile(phone))
      return res.status(400).send({
        status: false,
        message: "phone is requried,Please provide valid number",
      });
    data.phone = phone.trim();

    const validPhone = await userModel.findOne({ phone: data.phone });
    if (validPhone) {
      res
        .status(400)
        .send({ status: false, message: "Phone is already in registered.." });
    }

    if (!validator.isValidEmail(email))
      return res.status(400).send({
        status: false,
        message: "email is requried,Please provide valid number",
      });
    data.email = email.toString().trim();
    const validemail = await userModel.findOne({ email: data.email });
    if (validemail) {
      return res
        .status(400)
        .send({ status: false, message: "email is already in registered.." });
    }

    if (!validator.isValidPassword(password))
      return res.status(400).send({
        status: false,
        msg: "Password is required, Please enter At least one upper case,  one lower case English letter, one digit,  one special character and minimum eight in length",
      });
    data.password = password.trim();

    const { street, city, pincode } = data.address;
    if (address) {
      if (!validator.isValid(street)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid street" });
      }
      if (!validator.isValid(city)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid city" });
      }
      if (!validator.isValid(pincode) || pincode.length !== 6) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid street" });
      }
    }

    // if (Object.keys(data).some(a => a == "address")) {
    //     const { street, city, pincode }
    //     // if(!typeValid(address)) return res.status(400).send({ status: false, msg: "Incorrect type of address" });

    //     if (Object.keys(address).some(a => a == "street")) {

    //         if (!isString(street)) return res.status(400).send({ status: false, msg: "please provide a valid street" })

    //     }

    //     if (Object.keys(address).some(a => a == "city")) {

    //         if (!isValidName(city)) return res.status(400).send({ status: false, msg: "please provide a valid city" })

    //     }

    //     if (Object.keys(address).some(a => a == "pincode")) {

    //         if (!(!(/^[ 0-9 ]{6,6}$/).test(pincode))) return res.status(400).send({ status: false, msg: "please provide a valid pincode" })

    //     }
    // }
    data.address.street = address["street"].trim();
    data.address.city = address["city"].trim();
    data.address.pincode = address["pincode"].toString().trim();

    const userCreated = await userModel.create(data);
    return res.status(201).send({ status: true, data: userCreated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, Error: error.message });
  }
};

const userLogin = async function (req, res) {
  try {
    const requestBody = req.body;
    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide login details",
      });
    }
    //Extract from params
    let { email, password } = requestBody;
    if (!validator.isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        message: `Email is mandatory and provide valid email address`,
      });
      return;
    }
    if (!validator.isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message: `Password is required, Please enter At least one upper case,  one lower case English letter, one digit,  one special character and minimum eight in length`,
      });
    }
    let validuserId = await userModel.findOne(requestBody).select({ _id: 1 });
    if (!validuserId) {
      return res.status(404).send({ msg: "invalid email or password" });
    }
    //creating Jwt
    let token = jwt.sign(
      {
        userId: validuserId._id,
        iat: Math.floor(Date.now() / 1000) - 30,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      "secretkey"
    );
    return res.status(200).send({
      status: true,
      message: "User login successfully",
      data: { token: token },
    });
  } catch (error) {
    return res.status(500).send({ status: false, Error: error.message });
  }
};

module.exports = {
  userLogin,
  createUser,
};
