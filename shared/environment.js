require('dotenv').config()
console.log(process.env.MAIN_URL)
module.exports = {
  IP_STACK_KEY: process.env.IP_STACK_KEY,
  REDIS_URL: process.env.REDIS_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
}
