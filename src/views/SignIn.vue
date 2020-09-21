<template>
  <section>
    <form>
      <label
        >Email address
        <input type="email" name="email" id="email" v-model="userData.email" />
      </label>
      <label
        >Password
        <input
          type="password"
          name="pwd"
          id="pwd"
          v-model="userData.password"
        />
      </label>
      <button type="submit" @click="signIn">Sign In</button>
    </form>
    <button @click="getLocation">get location</button>
    <div>{{ pippo }} {{ upperCaseEmail }}</div>
  </section>
</template>

<script>
import {mapState} from 'vuex'
// const main_url = 'https://chrimox-meetup-app.herokuapp.com/'
export default {
  name: 'SignIn',
  data() {
    return {
      userData: {
        email: '',
        password: '',
      },
    }
  },
  computed: {
    ...mapState(['pippo']),
    upperCaseEmail() {
      return 'A'
    },
  },

  methods: {
    // async signIn({ commit, state }) {
    async signIn(event) {
      event.preventDefault()
      if (!this.userData.email || !this.userData.password)
        return console.error({
          status: 400,
          message: 'user Email and Password are mandatory',
        })

      const result = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(this.userData),
      })
        .then(data => data.json())
        .then(res => JSON.parse(JSON.stringify(res)))
      // console.log('fetchresult', result)
      if (result.status === 200) console.log('we are happy')
      //commit('saveUser', result)
      else console.log({status: result.status, message: result.message}) //throw {status: result.status, message: result.message}
    },
    async getLocation() {
      // const result = await fetch('http://localhost:8089/api/location', {
      // const result = await fetch('/api/location', {
      const ip = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then(data => data.json())
        .then(({ip}) => ip)

      const city = await fetch(`https://tools.keycdn.com/geo.json?host=${ip}`, {
        method: 'GET',
        // mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then(data => data.json())
        .then(res => res.data.geo.city)
      console.log('this is city: ', city)
      console.log('this is ip address ' + ip)

      // const result = fetch('https://tools.keycdn.com/geo.json?host=', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json;charset=utf-8',
      //   },
      // })
      //   .then(data => data.json())
      //   .then(res => JSON.parse(JSON.stringify(res)))
      // console.log('fetchresult', result)
      // if (result.status === 200) console.log('we are happy')
      //commit('saveUser', result)
      // else console.log({status: result.status, message: result.message}) //throw {status: result.status, message: result.message}
    },
  },
}
</script>

<style></style>
