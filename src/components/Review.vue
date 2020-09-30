<template>
  <div>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <form class="vue-form" @submit.prevent="handleSubmit">
          <fieldset>
            <legend>Write review</legend>

            <div>
              <label class="label" for="textarea">Review</label>
              <textarea
                class="message"
                name="textarea"
                id="textarea"
                v-model="form.review"
              ></textarea>
            </div>

            <input type="submit" value="Submit" />
            <button @click="close">Cancel</button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {review: ''},
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('save', this.form)
    },
    close(event) {
      event.preventDefault()
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
@import '../assets/css/formstyle.css';

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

textarea {
  min-height: 30vh;
  max-height: 50vh;
}

button {
  margin-right: 1rem;
  background-color: rgb(175, 0, 0);
}
button:hover {
  background-color: rgb(255, 29, 29);
}
</style>
