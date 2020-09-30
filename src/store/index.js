import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const instance = axios.create({
  withCredentials: true,
})

import location from './location'

Vue.use(Vuex)
const base_url =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8089' : ''

export default new Vuex.Store({
  modules: {
    location,
  },
  state: {
    userID: JSON.parse(window.localStorage.getItem('user'))
      ? JSON.parse(window.localStorage.getItem('user'))
      : null,
    isAuthenticated: JSON.parse(window.localStorage.getItem('isAuthenticated'))
      ? JSON.parse(window.localStorage.getItem('isAuthenticated'))
      : false,
    meetups: [],
  },
  mutations: {
    saveUser(state, userID) {
      // console.log(userID)
      window.localStorage.setItem('user', JSON.stringify(userID.userid))

      state.userID = userID.userid
    },
    authenticateUser(state, status = false) {
      window.localStorage.setItem('isAuthenticated', JSON.stringify(status))
      state.isAuthenticated = status
    },
    setMeetups(state, list) {
      list.forEach((el) => {
        if (el.attendees) return (el.attendees = JSON.parse(el.attendees))
      })
      state.meetups = [...list]
    },
    updAttendees(state, data) {
      const idx = state.meetups.findIndex((el) => data.meetId == el.id)
      state.meetups[idx].attendees = [...data.attendees]
    },
    addMeetup(state, meetup) {
      state.meetups = [...state.meetups, meetup]
    },
  },
  actions: {
    async loadMeetups({ commit }) {
      let result
      try {
        // result = await axios.get(`${base_url}/api/getmeetups`)
        result = await instance.get(`${base_url}/api/getmeetups`)
      } catch (err) {
        alert(`Error fetching meetup list
${err}`)
        return
      }

      commit('setMeetups', result.data)
    },

    async signIn({ commit }, userData) {
      try {
        const result = await instance.post(`${base_url}/api/signin`, userData)
        commit('saveUser', result.data)
        commit('authenticateUser', true)
      } catch (err) {
        throw {
          message: `${err.response.statusText}
${err.response.data}`,
        }
      }
    },
    async signUp({ commit }, userData) {
      if (!userData.username || !userData.email || !userData.password)
        return console.error({
          status: 400,
          message: 'user Name, Email and Password are mandatory',
        })

      try {
        const result = await instance.post(`${base_url}/api/signup`, userData)
        commit('saveUser', result.data)
        commit('authenticateUser', true)
      } catch (err) {
        throw {
          message: `${err.response.statusText}
  ${err.response.data}`,
        }
      }
    },
    async signOut({ commit }) {
      try {
        await instance.post(`${base_url}/api/signout`)
        commit('saveUser', { userid: null })
        commit('authenticateUser', false)
      } catch (err) {
        throw {
          message: `${err.response.statusText}
${err.response.data}`,
        }
      }
    },

    async checkAuthentication({ commit }) {
      const result = await instance.get(`${base_url}/api/amilogged`)
      commit('authenticateUser', result.data.logged)
      commit('saveUser', result.data)
    },

    async attendMeet({ commit }, meetId) {
      let result
      try {
        result = await instance.post(`${base_url}/api/attendmeet`, meetId)
      } catch (err) {
        throw {
          message: `${err.response.statusText}
${err.response.data}`,
        }
      }

      commit('updAttendees', { meetId: meetId.meetId, attendees: result.data })
      return result.data
    },

    async unAttendMeet({ commit }, meetId) {
      let result
      try {
        result = await instance.post(`${base_url}/api/unattendmeet`, meetId)
      } catch (err) {
        throw {
          message: `${err.response.statusText}
${err.response.data}`,
        }
      }

      commit('updAttendees', { meetId: meetId.meetId, attendees: result.data })
      return result.data
    },

    async updReview({ commit }, data) {
      let result
      try {
        result = await instance.post(`${base_url}/api/updreview`, data)
      } catch (err) {
        throw {
          message: `${err.response.statusText}
${err.response.data}`,
        }
      }

      commit('updAttendees', { meetId: data.meetId, attendees: result.data })
      return result.data
    },
  },
})
