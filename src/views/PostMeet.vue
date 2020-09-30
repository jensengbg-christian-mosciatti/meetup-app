<template>
  <div>
    <form class="vue-form" @submit.prevent="handleSubmit">
      <!-- <div class="error-message">
        <p v-show="!email.valid">Oh, please enter a valid email address.</p>
      </div> -->

      <fieldset>
        <legend>Post a new activity</legend>
        <div>
          <h4>Category</h4>
          <p class="select">
            <select class="budget" v-model="meetup.category" required>
              <option v-for="cat of categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </p>
        </div>

        <div>
          <label class="label" for="link">Image Link</label>
          <input type="text" name="link" id="link" v-model="meetup.image" />
        </div>

        <div>
          <label class="label" for="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            v-model="meetup.title"
            required
          />
        </div>

        <div>
          <label class="label" for="textarea">Description</label>
          <textarea
            class="message"
            name="textarea"
            id="textarea"
            required
            v-model="meetup.description"
          ></textarea>
        </div>
        <div class="container-div">
          <div>
            <label class="label" for="datestart">Start date</label>
            <input
              type="date"
              name="datestart"
              id="datestart"
              v-model="meetup.dateStart"
              required
              :class="{'datetime-plh': !meetup.dateStart}"
            />
          </div>

          <div>
            <label class="label" for="timestart">at</label>
            <input
              type="time"
              name="timestart"
              id="timestart"
              v-model="meetup.timeStart"
              required
              :class="{'datetime-plh': !meetup.timeStart}"
            />
          </div>
        </div>

        <div class="container-div">
          <div>
            <label class="label" for="dateend">End date</label>
            <input
              type="date"
              name="dateend"
              id="dateend"
              v-model="meetup.dateEnd"
              :class="{'datetime-plh': !meetup.dateEnd}"
            />
          </div>

          <div>
            <label class="label" for="timeend">at</label>
            <input
              type="time"
              name="timeend"
              id="timeend"
              v-model="meetup.timeEnd"
              :class="{'datetime-plh': !meetup.timeEnd}"
            />
          </div>
        </div>

        <div>
          <label class="label" for="participants">Max attendees</label>
          <input
            type="number"
            name="participants"
            id="participants"
            v-model="meetup.participantsMax"
          />
        </div>

        <div>
          <label class="label" for="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            v-model="meetup.address"
          />
        </div>

        <div>
          <label class="label" for="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            v-model="meetup.city"
            required
          />
        </div>

        <div>
          <label class="label" for="cost">Cost</label>
          <input type="number" name="cost" id="cost" v-model="meetup.cost" />
        </div>

        <div>
          <input type="submit" value="Submit" />
        </div>
      </fieldset>
    </form>
  </div>
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
      this.$store.commit('addMeetup', result.data.meetup)
      this.resetMeet()
    },
  },
  mounted() {
    this.getCategories()
  },
}
</script>

<style scoped>
@import '../assets/css/formstyle.css';

.datetime-plh {
  color: #94aab0 !important;
}
</style>
