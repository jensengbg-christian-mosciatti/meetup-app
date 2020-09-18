const REDIS_URL = process.env.REDIS_URL

require('dotenv').config()
const redis = require('redis')
const client = redis.createClient(REDIS_URL)
exports.client = client

const express = require('express')
const cors = require('cors')

const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const serveStatic = require('serve-static')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', serveStatic(path.join(__dirname, '../dist')))
app.use(
  session({
    store: new RedisStore({ client: client }),
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 36000000, //10 hours, in milliseconds
      httpOnly: false, // enable this to secure the cookie
      secure: false, // this cookie is not secure
    },
    secret: process.env.SESSION_SECRET,
  })
)

console.log('this is dirname: ', __dirname)
console.log('this is node_env: ', process.env.NODE_ENV)

const apiroutes = require('./apiroutes')
const routes = require('./routes')
app.use('/api/', apiroutes)
app.use('/', routes)

// app.use(function (req, res, next) {
//   console.log(req.url)
//   next()
// })

//here we are configuring dist to serve app files
// app.use('/', serveStatic(path.join(__dirname, './dist')))

// this * route is to serve project on different page routes except root `/`
// app.get(/.*/, function (req, res) {
//   res.sendFile(path.join(__dirname, './dist/index.html'))
// })

const port = process.env.PORT || 8080
app.listen(port)
console.log(`app is listening on port: ${port}`)
