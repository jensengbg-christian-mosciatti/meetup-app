require('dotenv').config()

module.exports = {
  IP_STACK_KEY: process.env.IP_STACK_KEY,
  REDIS_URL: process.env.REDIS_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  IPTOEARTH_API_KEY: process.env.IPTOEARTH_API_KEY,
}
