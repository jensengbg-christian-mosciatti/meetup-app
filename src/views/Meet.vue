<template>
  <section>
    <Review
      v-show="showReview"
      @save="saveReview($event.review)"
      @close="closeReview"
    />

    <div class="fail-container" v-if="meet == null || !meet.id">
      Woops!! The activity failed to load. Please try to go back and try again.
    </div>
    <div v-else class="meet-container">
      <!-- :style="{backgroundImage: `url(${meet.image})`}" -->
      <div class="image-container">
        <img :src="meet.image" :alt="meet.title" />
      </div>

      <div class="meet-inner-cont">
        <h2>
          {{ meet.title }}
        </h2>
        <!-- <div>
          <span>category: </span>
          <h4>{{ meet.category }}</h4>
        </div> -->
        <div>
          <h4>Description</h4>
          <p>{{ meet.description }}</p>
        </div>
        <div>
          <div>
            <h4>Starts</h4>
            <p>
              {{ meet.dateStart }}
              <span v-if="meet.timeStart"> at {{ meet.timeStart }}</span>
            </p>
          </div>
          <div v-if="meet.dateEnd">
            <h4>Ends</h4>
            <p>
              {{ meet.dateEnd }}
              <span v-if="meet.timeEnd"> at {{ meet.timeEnd }}</span>
            </p>
          </div>
        </div>
        <div v-if="meet.cost">
          <h4>Cost</h4>
          <p>{{ meet.cost }} Kr</p>
        </div>
        <div class="attendees-cont">
          <div>
            <div v-if="meet.participantsMax">
              <h4>Max attendees</h4>
              <p>{{ meet.participantsMax }}</p>
            </div>
            <div>
              <h4>Attendees</h4>
              <p>
                {{ attendees }}
                <span v-if="meet.participantsMax">
                  of {{ meet.participantsMax }}</span
                >
              </p>
            </div>
          </div>
          <div>
            <button
              class="action-btn"
              v-if="!isPassedMeet"
              @click="toggleAttend"
              :disabled="attendBtnStatus[0] === 1"
            >
              {{ attendBtnStatus[1] }}
            </button>
            <button
              class="review-btn"
              v-if="isPassedMeet"
              @click="showReview = true"
              :disabled="attendBtnStatus[0] !== 2"
            >
              Write a review
            </button>

            <!-- {{ meet.attendees }} {{ $store.state.userID }} {{ check }} -->
          </div>
        </div>
        <div>
          <button class="back-btn" @click="back">Back</button>
        </div>
        <div v-if="reviews && reviews.length" class="review-container">
          <h4>Reviews</h4>
          <div v-for="review of reviews" :key="review.id">
            <!-- {{ reviews }} -->
            <h5>{{ review.user }}</h5>
            <p>{{ review.review }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const base_url =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8089' : ''
import Review from '../components/Review'
export default {
  components: {
    Review,
  },
  data() {
    return {
      showReview: false,
    }
  },
  props: {
    id: String,
  },
  asyncComputed: {
    // meet() {
    //   return new Promise(res =>
    //     res(this.$store.state.meetups.find(meet => meet.id == this.id)),
    //   )
    // },
    async reviews() {
      let reviews = []

      for (let review of this.reviewList) {
        let userName = {}
        try {
          userName = await this.$http_sec.post(`${base_url}/api/getusername`, {
            reqUserId: review.id,
          })
        } catch (err) {
          console.error(err)
          userName.data = 'No Name'
        }
        reviews.push({...review, user: userName.data})
      }
      return reviews
    },
  },
  computed: {
    meet() {
      // return new Promise(res =>
      return this.$store.state.meetups.find(meet => meet.id == this.id)
      // )
    },
    isPassedMeet() {
      return (
        new Date(`${this.meet.dateStart} ${this.meet.timeStart}`) -
          Date.now() <=
        0
      )
    },
    attendBtnStatus() {
      if (
        this.meet &&
        this.meet.organizer &&
        this.meet.organizer == this.$store.state.userID
      )
        return [1, `Attend (Disabled)`]
      if (
        this.meet &&
        this.meet.attendees &&
        this.meet.attendees.findIndex(
          attendee => attendee.id == this.$store.state.userID,
        ) >= 0
      )
        return [2, `Do not Attend`]
      return [0, 'Attend']
    },
    attendees() {
      if (this.meet && this.meet.attendees) return this.meet.attendees.length
      return 0
    },
    reviewList() {
      if (this.meet && this.meet.attendees)
        return this.meet.attendees.filter(attendee => {
          if (
            Object.prototype.hasOwnProperty.call(attendee, 'review') &&
            attendee.review
          )
            return attendee
        })
      return []
    },
  },
  methods: {
    back() {
      window.history.back()
    },
    toggleAttend() {
      if (
        this.meet &&
        this.meet.attendees &&
        this.meet.attendees.findIndex(
          attendee => attendee.id == this.$store.state.userID,
        ) >= 0
      )
        this.unAttend()
      else this.attend()
    },
    async attend() {
      if (!this.$store.state.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      try {
        const result = await this.$store.dispatch('attendMeet', {
          meetId: this.id,
        })

        this.meet.attendees = [...result]
      } catch (err) {
        alert(err.message)
      }
    },
    async unAttend() {
      if (!this.$store.state.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      try {
        const result = await this.$store.dispatch('unAttendMeet', {
          meetId: this.id,
        })
        this.meet.attendees = [...result]
      } catch (err) {
        alert(err.message)
      }
    },
    async saveReview(review) {
      if (!this.$store.state.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      try {
        const result = await this.$store.dispatch('updReview', {
          meetId: this.id,
          review: review,
        })
        this.meet.attendees = [...result]
      } catch (err) {
        alert(err.message)
      }
      this.showReview = false
    },
    closeReview() {
      this.showReview = false
    },
  },
}
</script>

<style scoped>
section {
  height: 89%;
}
.meet-container {
  height: 100%;
  text-align: initial;
}
.meet-inner-cont {
  max-width: 40rem;
  margin: auto;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.image-container {
  height: 40%;
  width: 100vw;
  overflow-y: auto;
}
.image-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.473);
  background-color: #f5f5f54b;
}

.image-container::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f52a;
}

.image-container::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #cacaca93;
}
img {
  width: 100%;
  object-fit: cover;
}
.attendees-cont {
  display: flex;
  justify-content: space-between;
}
.back-btn {
  float: left;
}

h4,
button {
  margin-block-start: 1.3rem;
}

.review-container > div {
  border-top: 1px solid #2c3e50;
  padding: 1rem;
}
</style>
