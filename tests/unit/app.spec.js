import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from '@/router/index.js'
import App from '@/App.vue'

function setVueUseValues(localVue) {
  // localVue.use(Vuex)
  localVue.use(VueRouter)
  // other things here like custom directives, etc
}

let actions
let state
let store

beforeEach(() => {
  // reset your localVue reference before each test if you need something reset like a custom directive, etc
  localVue = createLocalVue()
  setVueUseValues(localVue)

  actions = {
    getLocation: jest.fn(),
  }
  state = {
    val: 1,
  }

  store = new Vuex.Store({
    state: { isAuthenticated: true },
    actions: {
      loadMeetups: jest.fn(),
      checkAuthentication: jest.fn(),
    },
    modules: {
      location: {
        state,
        actions,
        getters: location.getters,
        namespaced: true,
      },
    },
  })
})

let localVue = createLocalVue()
setVueUseValues(localVue)

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

describe('App.vue', () => {
  it('should show/hide buttons and router links when logged in', () => {
    const wrapper = shallowMount(App, { store, localVue })

    const logOutBtn = wrapper.find('.logout').element.style.display !== 'none'
    const logIn = wrapper.find('.login').element.style.display !== 'none'
    const signUp = wrapper.find('.signup').element.style.display !== 'none'
    const newMeet = wrapper.find('.newmeet').element.style.display !== 'none'

    expect(logOutBtn).toBe(true)
    expect(logIn).toBe(false)
    expect(signUp).toBe(false)
    expect(newMeet).toBe(true)
  })

  it('should show/hide buttons and router links when logged out', () => {
    store.state.isAuthenticated = false
    const wrapper = shallowMount(App, { store, localVue })

    const logOutBtn = wrapper.find('.logout').element.style.display !== 'none'
    const logIn = wrapper.find('.login').element.style.display !== 'none'
    const signUp = wrapper.find('.signup').element.style.display !== 'none'
    const newMeet = wrapper.find('.newmeet').element.style.display !== 'none'

    expect(logOutBtn).toBe(false)
    expect(logIn).toBe(true)
    expect(signUp).toBe(true)
    expect(newMeet).toBe(false)
  })
  //   it('expect to route to another page when clicking the card', async () => {
  //     const options = {
  //       localVue,
  //       router: router,
  //       propsData: { meet: meetup },
  //     }

  //     const wrapper = shallowMount(Card, options)

  //     const routerPushSpy = jest.spyOn(options.router, 'push')
  //     const button = wrapper.find('.card-container')
  //     await button.trigger('click')
  //     expect(routerPushSpy).toHaveBeenCalledTimes(1)
  //   })
})
