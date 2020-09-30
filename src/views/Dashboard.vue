<template>
  <main>
    <section id="all-container">
      <div class="head-container">
        <h2>All activities</h2>
        <input
          type="text"
          name="filter"
          id="filter"
          v-model="filterText"
          placeholder="Filter activity"
        />
      </div>
      <div>
        <div v-show="!categories.length">
          <h4>
            There are no meetups yet! Add one yourself if you'd like!
          </h4>
        </div>
        <div v-show="meetups.length">
          <div class="activity-title-cont">
            <h3 class="activity-title">Activities in {{ city }}</h3>
          </div>
          <div>
            <div v-show="!meetupsInCity.length">
              <h4>
                There are no activities in {{ city }} yet! Add one yourself if
                you'd like!
              </h4>
            </div>
            <div v-show="meetupsInCity.length">
              <HorizontalScroll>
                <Card
                  v-for="meet of meetupsInCity"
                  :key="meet.id"
                  :meet="meet"
                />
              </HorizontalScroll>
            </div>
          </div>
          <div v-for="category of categories" :key="category">
            <div class="activity-title-cont">
              <h3 class="activity-title">{{ category }}</h3>
            </div>

            <HorizontalScroll>
              <Card
                v-for="meet of meetupsByCat[category]"
                :key="meet.id"
                :meet="meet"
              />
            </HorizontalScroll>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import {mapState} from 'vuex'
import Card from '@/components/Card.vue'
import HorizontalScroll from 'vue-horizontal-scroll'
import 'vue-horizontal-scroll/dist/vue-horizontal-scroll.css'

export default {
  components: {
    Card,
    HorizontalScroll,
  },
  computed: {
    ...mapState({
      city: state => state.location.city,
      meetups: state => state.meetups,
    }),
    filteredList() {
      if (!this.filterText) return this.meetups
      return this.meetups.filter(
        meet =>
          meet.category.toLowerCase().includes(this.filterText.toLowerCase()) ||
          meet.title.toLowerCase().includes(this.filterText.toLowerCase()),
      )
    },
    meetupsByCat() {
      return this.groupByCategory(this.filteredList, 'category')
    },
    categories() {
      return Object.keys(this.meetupsByCat)
    },
    meetupsInCity() {
      return this.filteredList.filter(el => el.city === this.city)
    },
  },
  data() {
    return {
      filterText: '',
    }
  },
  methods: {
    groupByCategory(array, key) {
      // function groupByKey(array, key) {
      return array.reduce((hash, obj) => {
        if (obj[key] === undefined) return hash
        return Object.assign(hash, {
          [obj[key]]: (hash[obj[key]] || []).concat(obj),
        })
      }, {})
    },
  },
}
</script>

<style scoped>
main {
  max-width: 60rem;
  margin: auto;
}

.activity-title-cont {
  /* background-color: rgba(234, 250, 255, 0.637); */
  background: linear-gradient(
    90deg,
    rgba(234, 250, 255, 0),
    rgba(234, 250, 255, 0.637) 1%,
    rgba(234, 250, 255, 0.637) 40%,
    rgba(234, 250, 255, 0)
  );
  width: 100%;
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 0.2rem;
  padding: 0.2rem;
}
.activity-title {
  margin-left: 1rem;
}

input[type='text'] {
  padding: 12px;
  box-sizing: border-box;
  border-bottom: 2px solid #5b7288;
  background-color: transparent;
  border-radius: 0;
  /* box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08); */
  font: inherit;
  box-shadow: none;
  border-style: solid;
  border-top: none;
  border-left: none;
  border-right: none;
  border-image: none;
}
input[type='text']::placeholder {
  color: #5b7288;
}
input[type='text']:focus {
  outline: none;
  border-color: #2c3e50;
}

.head-container {
  padding: 0 0.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

._horizontal-scroll[data-v-5ce095ec] {
  /* Force mudule's css */
  overflow-x: auto !important;
}

._horizontal-scroll[data-v-5ce095ec]::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.473);
  background-color: #f5f5f54b;
}

._horizontal-scroll[data-v-5ce095ec]::-webkit-scrollbar {
  /* width: 3px; */
  height: 8px;
  /* background-color: #f5f5f5; */
  background-color: #f5f5f52a;
}

._horizontal-scroll[data-v-5ce095ec]::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #cacaca93;
}
</style>
