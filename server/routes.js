const { Router } = require('express')
const path = require('path')

const router = new Router()

if (process.env.NODE_ENV !== 'development') {
  router.get(/.*/, function (req, res) {
    console.log('standard')
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

module.exports = router
