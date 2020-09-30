<template>
  <div class="card-container" @click="showMeet">
    <div class="img-container">
      <img
        :src="meet.image ? imgUrl : 'https://via.placeholder.com/238x160'"
        :alt="meet.title"
      />
    </div>
    <div class="text-container">
      <p class="category">{{ meet.category }}</p>
      <h3 class="title">{{ meet.title }}</h3>
      <div>
        <p class="city">{{ meet.city }}</p>
        <p class="date-start">
          {{ meet.dateStart }}
          <span v-if="meet.timeStart"> - {{ meet.timeStart }} </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    meet: Object,
  },
  methods: {
    showMeet() {
      this.$router.push({name: 'meet', params: {id: this.meet.id}})
    },
  },
  computed: {
    imgUrl() {
      const urlArray = this.meet.image.split('&')
      const idx = urlArray.findIndex(el => el.substring(0, 2) === 'w=')
      if (idx >= 0) {
        urlArray[idx] = 'w=360'
        urlArray[idx + 1] = 'q=40'
        return urlArray.join('&')
      }
      return this.meet.image
    },
  },
}
</script>

<style scoped>
.card-container {
  /* border: 1px solid #2c3e50; */
  border-radius: 0.5rem;
  display: inline-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 10rem 10rem;

  margin: 0 0.8rem 1.2rem 0.8rem;
  /* padding: 0.2rem; */
  cursor: pointer;
  width: 15rem;
  height: 20rem;
  background-color: rgba(255, 255, 255, 0.8);
  white-space: initial;
  box-shadow: 10px 10px 20px -3px rgba(0, 0, 0, 0.33);
}
.img-container {
  width: 100%;
  height: 10rem;
  /* object-fit: cover; */
}

img {
  border-radius: 0.5rem 0.5rem 0 0;
  width: 100%;
  /* max-width: 100%; */
  height: 100%;

  /* max-height: 100%; */
  object-fit: cover;
  /* object-position: center; */
}

.text-container {
  /* margin: 0 0.3rem 0.3rem 0.3rem; */
  padding: 0.3rem 0.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.city {
  margin-bottom: 0.3rem;
}
</style>
