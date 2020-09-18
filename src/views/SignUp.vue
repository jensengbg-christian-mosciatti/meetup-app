<template>
  <section>
    <form>
      <label
        >Username
        <input
          type="text"
          name="username"
          id="username"
          v-model="userData.username"
        />
      </label>
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
      <button type="submit" @click="signUp">Sign Up</button>
    </form>
  </section>
</template>

<script>
export default {
  name: 'SignUp',
  data() {
    return {
      userData: {
        username: '',
        email: '',
        password: '',
      },
    }
  },
  methods: {
    // async signIn({ commit, state }) {
    async signUp(event) {
      event.preventDefault()
      if (
        !this.userData.username ||
        !this.userData.email ||
        !this.userData.password
      )
        return console.error({
          status: 400,
          message: 'user Name, Email and Password are mandatory',
        })

      const result = await fetch('http://localhost:8080/api/signup', {
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
  },
}
</script>

<style></style>
