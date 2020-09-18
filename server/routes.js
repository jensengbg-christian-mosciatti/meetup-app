// const config = require('../shared/environment.js')
require('dotenv').config()
const config = {
  MAIN_URL: process.env.MAIN_URL,
  IP_STACK_KEY: process.env.IP_STACK_KEY,
  REDIS_URL: process.env.REDIS_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
}

const { Router } = require('express')
const path = require('path')

const router = new Router()

if (config.NODE_ENV !== 'development') {
  router.get(/.*/, function (req, res) {
    const newPath = path.join(__dirname, '../dist/index.html')
    console.log('standard, path: ' + newPath)

    res.sendFile(newPath)
  })
}

module.exports = router
