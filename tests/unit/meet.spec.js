import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
// import VueRouter from 'vue-router'
import Meet from '@/views/Meet.vue'

const localVue = createLocalVue()

localVue.use(Vuex)

const meetup = {
  address: '',
  attendees: [{ id: 13, review: 'This is a review' }, { id: 18 }, { id: 21 }],
  category: 'City explore',
  city: 'Kungsbacka',
  cost: '',
  dateEnd: '',
  dateStart: '2020-10-03',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n',
  id: '32',
  image:
    'https://images.unsplash.com/photo-1515701016373-c22b4c46b6e1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=360&q=40',
  organizer: '9',
  participantsMax: '12',
  timeEnd: '',
  timeStart: '13:00',
  title: 'Explore Kungsbacka',
}

let userID = 18
let isAuthenticatd = true

describe('Meet.vue', () => {
  let state
  let actions
  let store

  beforeEach(() => {
    actions = {
      back: jest.fn(),
      toggleAttend: jest.fn(),
      attend: jest.fn(),
      unAttend: jest.fn(),
      saveReview: jest.fn(),
      closeReview: jest.fn(),
    }
    state = {
      meetups: [meetup],
      isAuthenticatd: isAuthenticatd,
      userID: userID,
    }
    store = new Vuex.Store({
      state,
      actions,
    })
  })

  it('should display meet title in h2 tag ', () => {
    const meetId = '32'
    const wrapper = shallowMount(Meet, {
      store,
      localVue,
      propsData: { id: meetId },
    })

    const title = wrapper.find('.meet-inner-cont > h2:first-of-type').text()

    expect(title).toBe(state.meetups[0].title)
  })

  it('The action button should display "Do not Attend" because state.userID is already attending the event and Meet date is not passed', () => {
    const meetId = '32'
    state.meetups[0].dateStart = '2030-10-03'
    const wrapper = shallowMount(Meet, {
      store,
      localVue,
      propsData: { id: meetId },
    })

    const btnText = wrapper.find('.action-btn').text()

    expect(btnText).toBe('Do not Attend')
  })

  it('The action button should display "Attend" because state.userID is not the organizer and Meet date is not passed', () => {
    const meetId = '32'
    state.userID = '12'
    state.meetups[0].dateStart = '2030-10-03'
    const wrapper = shallowMount(Meet, {
      store,
      localVue,
      propsData: { id: meetId },
    })

    const btnText = wrapper.find('.action-btn').text()

    expect(btnText).toBe('Attend')
  })

  it('The action button should be hidden, the Review button shuold be visible and not disabled because state.userID is attendng the event, is not the organizer, and Meet date is passed', () => {
    const meetId = '32'
    state.meetups[0].dateStart = '2019-10-03'
    const wrapper = shallowMount(Meet, {
      store,
      localVue,
      propsData: { id: meetId },
    })

    const btnText = wrapper.find('.action-btn').exists()
    expect(btnText).toBe(false)

    const reviewBtn = wrapper.find('.review-btn').element.disabled
    expect(reviewBtn).toBe(false)
  })

  it('The action button should be hidden, the Review button shuold be visible but disabled because state.userID is not attendng the event, is not the organizer, and Meet date is passed', () => {
    const meetId = '32'
    state.userID = '12'
    state.meetups[0].dateStart = '2019-10-03'
    const wrapper = shallowMount(Meet, {
      store,
      localVue,
      propsData: { id: meetId },
    })

    const btnText = wrapper.find('.action-btn').exists()
    expect(btnText).toBe(false)

    const reviewBtn = wrapper.find('.review-btn').element.disabled
    expect(reviewBtn).toBe(true)
  })
})
