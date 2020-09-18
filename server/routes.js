const { Router } = require('express')
const path = require('path')

const router = new Router()

if (process.env.NODE_ENV !== 'development') {
  router.get(/.*/, function (req, res) {
    const newPath = path.join(__dirname, '../dist/index.html')
    console.log('standard, path: ' + newPath)

    res.sendFile(newPath)
  })
}

module.exports = router
