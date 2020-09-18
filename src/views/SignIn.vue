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
  </section>
</template>

<script>
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
      // const result = await fetch('http://localhost/api/location', {
      const result = await fetch('/api/location', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then(data => data.json())
        .then(res => JSON.parse(JSON.stringify(res)))
      // console.log('fetchresult', result)
      if (result.status === 200) console.log('we are happy')
      //commit('saveUser', result)
      else console.log({status: result.status, message: result.message}) //throw {status: result.status, message: result.message}
    },
  },
}
</script>

<style></style>
