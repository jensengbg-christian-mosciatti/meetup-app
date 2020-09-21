export default {
  namespaced: true,

  getters: {},
  state: () => ({
    ip: null,
    city: null,
  }),
  mutation: {
    setLocation(state, resApi) {
      state.ip = resApi.ip
      state.city = resApi.city
    },
  },
  actions: {
    async getLocation({ commit }) {
      // const result = await fetch('http://localhost:8089/api/location', {
      // const result = await fetch('/api/location', {
      const ip = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then((data) => data.json())
        .then(({ ip }) => ip)

      const city = await fetch(`https://tools.keycdn.com/geo.json?host=${ip}`, {
        method: 'GET',
        // mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      })
        .then((data) => data.json())
        .then((res) => res.data.geo.city)

      if (ip != null && city != null)
        commit('setLocation', { ip: ip, city: city })

      // const result = fetch('https://tools.keycdn.com/geo.json?host=', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json;charset=utf-8',
      //   },
      // })
      //   .then(data => data.json())
      //   .then(res => JSON.parse(JSON.stringify(res)))
      // console.log('fetchresult', result)
      //commit('saveUser', result)
      // else console.log({status: result.status, message: result.message}) //throw {status: result.status, message: result.message}
    },
  },
}
