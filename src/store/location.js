import axios from 'axios'
const base_url =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8089' : ''
export default {
  namespaced: true,

  getters: {},
  state: () => ({
    ip: null,
    city: null,
  }),
  mutations: {
    setLocation(state, resApi) {
      state.ip = resApi.ip
      state.city = resApi.city
    },
  },
  actions: {
    async getLocation({ commit }) {
      //   const city = await fetch(`https://tools.keycdn.com/geo.json?host=${ip}`, {

      const location = await (async () => {
        try {
          return await axios.get(`${base_url}/api/location`)
        } catch (error) {
          console.error(error)
        }
      })()
      if (location.status === 200)
        commit('setLocation', {
          ip: location.data.message.ip,
          city: location.data.message.city,
        })
    },
  },
}
