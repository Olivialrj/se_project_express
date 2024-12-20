const { JWT_SECRET = "super-strong-secret" } = process.env;
module.exports = { JWT_SECRET };

const crypto = require("crypto"); // importing the crypto module

const randomString = crypto
  .randomBytes(16) // generating a random sequence of 16 bytes (128 bits)
  .toString("hex"); // converting it into a string

console.log(randomString); // 5cdd183194489560b0e6bfaf8a81541e
//d741ec8430e608a9613b5fa9ca3775dabe29adc508119f4719de0d57665c264e
