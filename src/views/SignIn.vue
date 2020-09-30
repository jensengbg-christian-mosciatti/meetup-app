<template>
  <div>
    <form class="vue-form" @submit.prevent="signIn">
      <fieldset>
        <legend>Login</legend>
        <div>
          <label class="label" for="email">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            v-model="userData.email"
            required
          />
        </div>

        <div>
          <label class="label" for="pwd">Password</label>
          <input
            type="password"
            name="pwd"
            id="pwd"
            v-model="userData.password"
            required
          />
        </div>

        <input type="submit" value="Login" />
      </fieldset>
    </form>
    <!-- <button @click="getLocation">get location</button> -->
    <div>{{ pippo }} {{ upperCaseEmail }}</div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
// const main_url = 'https://chrimox-meetup-app.herokuapp.com/'
// const base_url =
//   process.env.NODE_ENV === 'development' ? 'http://localhost:8089' : ''
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

      // const result = await fetch(`${base_url}/api/signin`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json;charset=utf-8',
      //   },
      //   body: JSON.stringify(this.userData),
      // })
      //   .then(data => data.json())
      //   .then(res => JSON.parse(JSON.stringify(res)))
      // console.log('fetchresult', result)
      // const result = await this.$http.post(
      //   `${base_url}/api/signin`,
      //   this.userData,
      // )
      try {
        await this.$store.dispatch('signIn', this.userData)
        console.log('logginin: ', this.$route, this.$route.query.nextUrl)
        if (this.$route.query.nextUrl != null) {
          this.$router.push(this.$route.query.nextUrl)
        } else this.$router.push('/')
      } catch (error) {
        alert(`Error:
        ${error.message}`)
      }
      // if (result.status === 200) {
      //   console.log('we are happy')
      //   this.$store.commit('saveUser', result.data.message.userid)
      //   this.$router.push('/')
      // } else console.log({status: result.status, message: result.message}) //throw {status: result.status, message: result.message}
    },
    // async getLocation() {
    //   const location = await (async () => {
    //     try {
    //       return await this.$http.get(`${base_url}/api/location`)
    //     } catch (error) {
    //       console.error(error)
    //     }
    //   })()
    //   console.log('this is ip address ', location.data)
    // },
  },
  mounted() {
    if (this.$store.state.isAuthenticated)
      if (this.$route.query.nextUrl != null) {
        this.$router.push(this.$route.query.nextUrl)
      } else this.$router.push('/')
  },
}
</script>

<style scoped>
@import '../assets/css/formstyle.css';
</style>
