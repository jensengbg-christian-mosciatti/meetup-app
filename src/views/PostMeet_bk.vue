<template>
  <section>
    <h1>New Meet</h1>
    <form @submit.prevent="handleSubmit">
      <label
        >Category<select v-model="meetup.category" required>
          <option v-for="cat of categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </label>
      <!-- <label>Category<input type="text" v-model="category" required/></label> -->
      <label>Picture Link<input type="text" v-model="meetup.image"/></label>
      <div v-show="meetup.image">
        <img :src="meetup.image" :alt="meetup.image" />
      </div>
      <label>Title<input type="text" v-model="meetup.title" required/></label>
      <label
        >Description<textarea type="text" v-model="meetup.description" required
      /></label>
      <div>
        <label
          >Start date<input type="date" v-model="meetup.dateStart" required
        /></label>
        <label
          >at<input type="time" v-model="meetup.timeStart" required
        /></label>
      </div>
      <div>
        <label>End date<input type="date" v-model="meetup.dateEnd"/></label>
        <label>at<input type="time" v-model="meetup.timeEnd"/></label>
      </div>

      <label
        >Max participants<input type="number" v-model="meetup.participantsMax"
      /></label>
      <label>Address<input type="text" v-model="meetup.address"/></label>
      <label>City<input type="text" v-model="meetup.city" required/></label>
      <label>Cost<input type="number" v-model="meetup.cost"/></label>
      <button type="submit">Add</button>
    </form>
  </section>
</template>

<script>
const base_url =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8089' : ''
export default {
  data() {
    return {
      categories: [],
      meetup: {
        category: '',
        image: null,
        title: null,
        description: null,
        dateStart: null,
        timeStart: null,
        dateEnd: null,
        timeEnd: null,
        participantsMax: null,
        address: null,
        city: null,
        organizer: null,
        cost: null,
      },
    }
  },
  methods: {
    async getCategories() {
      let result = null
      try {
        result = await this.$http.get(`${base_url}/api/categories`)
      } catch (err) {
        alert(`Couldn't get the category list`)
      }
      if (result != null) {
        console.log(result.data)
        this.categories = [...result.data.message]
      }
    },
    resetMeet() {
      this.meetup.category = ''
      this.meetup.image = null
      this.meetup.title = null
      this.meetup.description = null
      this.meetup.dateStart = null
      this.meetup.timeStart = null
      this.meetup.dateEnd = null
      this.meetup.timeEnd = null
      this.meetup.participantsMax = null
      this.meetup.address = null
      this.meetup.city = null
      this.meetup.organizer = null
      this.meetup.cost = null
    },
    async handleSubmit() {
      //   event.preventDefault()

      let result
      try {
        result = await this.$http_sec.post(
          `${base_url}/api/newmeet`,
          this.meetup,
        )

        // if (result != null && result.data.status === 200) {
        // }
      } catch (err) {
        alert(`Error 
${err.response.data}`)
        if (err.response.status === 401) {
          this.$store.commit('authenticateUser', false)
          this.$router.push('/login')
        }
        return
      }
      console.log('wow', result.data)
      //   this.$store.commit('addOneMeetup', result.data.meetup)
      this.resetMeet()
    },
  },
  created() {
    this.getCategories()
  },
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* width: 30rem; */
}
form > label {
  display: flex;
  width: 30rem;

  /* width: inherit; */
}
form > label > input {
  width: 90%;
}
img {
  width: 80%;
  height: 100%;
}
</style>
