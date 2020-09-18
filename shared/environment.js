require('dotenv').config()
console.log(process.env.MAIN_URL)
module.exports = {
  MAIN_URL: process.env.MAIN_URL,
  IP_STACK_KEY: process.env.IP_STACK_KEY,
  REDIS_URL: process.env.REDIS_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
}
