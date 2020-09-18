const { Router } = require('express')
const bcrypt = require('bcrypt')

// const redis = require('redis')
// const client = redis.createClient(process.env.REDIS_URL)
const { client } = require('./server')
// console.log('client', client)
// const Redis = require('ioredis')
// const client = new Redis(process.env.REDIS_URL)

const router = new Router()

router.post('/signup', (req, res) => {
  const { email, username, password } = req.body
  // console.log('post', req.body)
  // console.log('post', req.body)

  if (
    username == null ||
    !username ||
    email == null ||
    !email ||
    password == null ||
    !password
  ) {
    res.send({
      status: 400,
      message: 'Please email, username and password are required',
    })
    return
  }

  // console.log(req.body, username, password)

  client.hget('users', email, (err, userid) => {
    if (!userid) {
      //user does not exist, signup procedure
      client.incr('userid', async (err, userid) => {
        client.hset('users', email, userid)
        const saltRounds = 10
        const hash = await bcrypt.hash(password, saltRounds)
        client.hset(
          `user:${userid}`,
          'hash',
          hash,
          'email',
          email,
          'username',
          username
        )
        res.send({ status: 200 })
      })
    } else {
      //user exists, login procedure
      // console.log('User existing')
      res.send({ status: 401, message: 'User email address already existing' })
    }
  })
})

router.post('/signin', (req, res) => {
  const { email, password } = req.body
  // console.log('post', email, password)
  // console.log('post', req.body)

  if (email == null || !email || password == null || !password) {
    res.send({
      status: 400,
      message: 'Email and password are required to login',
    })
    return
  }

  // console.log(req.body, username, password)

  client.hget('users', email, (err, userid) => {
    if (userid) {
      client.hget(`user:${userid}`, 'hash', async (err, hash) => {
        const result = await bcrypt.compare(password, hash)
        if (result) {
          //password ok
          res.send({ status: 200 })
        } else {
          //wrong password
          res.send({ status: 401, message: 'Wrong password' })
        }
      })
    } else {
      //user exists, login procedure
      res.send({ status: 401, message: 'User does not exist' })
    }
  })
})

router.get('/location', (req, res) => {
  console.log(req.connection)
  res.send({ status: 200 })
})

module.exports = router
