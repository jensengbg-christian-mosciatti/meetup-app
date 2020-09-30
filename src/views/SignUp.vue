<template>
  <section>
    <form class="vue-form" @submit.prevent="signUp">
      <fieldset>
        <div>
          <label class="label" for="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            v-model="userData.username"
          />
        </div>

        <div>
          <label class="label" for="email">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            v-model="userData.email"
          />
        </div>

        <div>
          <label class="label" for="pwd">Password</label>
          <input
            type="password"
            name="pwd"
            id="pwd"
            v-model="userData.password"
          />
        </div>

        <input type="submit" value="Sign Up" />
      </fieldset>
    </form>
  </section>
</template>

<script>
// const base_url =
//   process.env.NODE_ENV === 'development' ? 'http://localhost:8089' : ''
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
  computed: {
    currentView() {
      return this.$route.path
    },
  },
  methods: {
    async signUp(event) {
      event.preventDefault()
      try {
        await this.$store.dispatch('signUp', this.userData)
      } catch (err) {
        console.error(err)
        return alert('Error ' + err.message)
      }
      this.$router.push('/')
    },
  },
  watch: {
    currentView(newVal) {
      console.log('newval: ', newVal)
      if (this.$store.state.userID != null && newVal === '/signup')
        this.$router.push('/')
      // else if (this.$store.state.userID == null && newVal === '/profile') this.$router.push('/sign')
    },
  },
  mounted() {
    if (this.$store.state.isAuthenticated)
      if (this.$route.query.nextUrl != null) {
        this.$router.push(this.$route.query.nextUrl)
      } else this.$router.push('/')
  },
}
</script>

<style></style>
