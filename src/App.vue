<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" class="logo">OutdoorExplorers</router-link>
      <div class="right-nav">
        <router-link to="/about">About</router-link>
        <router-link
          class="newmeet"
          v-show="$store.state.isAuthenticated"
          to="/newmeet"
          >New activity</router-link
        >
        <router-link
          class="signup"
          v-show="!$store.state.isAuthenticated"
          to="/signup"
          >Sign Up</router-link
        >
        <router-link
          class="login"
          v-show="!$store.state.isAuthenticated"
          to="/login"
          >Login</router-link
        >
        <a
          class="logout"
          v-show="$store.state.isAuthenticated"
          href=""
          @click="logOut"
        >
          Log Out
        </a>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('location/getLocation')
    this.$store.dispatch('loadMeetups')
    this.$store.dispatch('checkAuthentication')
  },
  methods: {
    logOut() {
      this.$store.dispatch('signOut')
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}
body {
  background: linear-gradient(
      rgba(238, 235, 255, 0.5),
      rgba(238, 235, 255, 0.5)
    ),
    url('https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80');
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
}

.logo {
  font-family: 'Rock Salt', cursive;
  font-size: 1rem;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

#nav {
  max-width: 60rem;
  padding-top: 30px;
  padding-bottom: 30px;
  display: flex;
  justify-content: space-between;
  margin: auto;

  .right-nav {
    display: flex;
    align-items: center;
  }

  a {
    padding-left: 0.5rem;
    padding-right: 0.5rem;

    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #db1c3c;
    }
  }
}
button:disabled,
button[disabled],
input[type='submit']:disabled,
button:disabled:hover,
button[disabled]:hover,
input[type='submit']:disabled:hover {
  // border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
  cursor: initial;
}
button,
input[type='submit'] {
  border: none;
  background: #2c3e50;
  border-radius: 0.25em;
  padding: 12px 20px;
  color: #ffffff;
  font-weight: bold;
  float: right;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  appearance: none;
}
button:hover,
input[type='submit']:hover {
  background: #42a2e1;
}
button:focus,
input[type='submit']:focus {
  outline: none;
  background: #2b3e51;
}
button:active,
input[type='submit']:active {
  transform: scale(0.9);
}
</style>
