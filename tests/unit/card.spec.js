import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import router from '@/router/index.js'
import Card from '@/components/Card.vue'

function setVueUseValues(localVue) {
  // localVue.use(Vuex)
  localVue.use(VueRouter)
  // other things here like custom directives, etc
}

beforeEach(() => {
  // reset your localVue reference before each test if you need something reset like a custom directive, etc
  localVue = createLocalVue()
  setVueUseValues(localVue)
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

describe('Card.vue', () => {
  it('renders Category, imageUrl, City and Starting Date as expected', () => {
    const wrapper = shallowMount(Card, {
      propsData: { meet: meetup },
    })

    const category = wrapper.find('.category').text()
    const imageUrl = wrapper.find('img').attributes().src
    const city = wrapper.find('.city').text()
    const dateStart = wrapper.find('.date-start').text()

    expect(category).toMatch(meetup.category)
    expect(imageUrl).toMatch(meetup.image)
    expect(city).toMatch(meetup.city)
    expect(dateStart).toMatch(meetup.dateStart)
  })

  it('expect to route to another page when clicking the card', async () => {
    const options = {
      localVue,
      router: router,
      propsData: { meet: meetup },
    }

    const wrapper = shallowMount(Card, options)

    const routerPushSpy = jest.spyOn(options.router, 'push')
    const button = wrapper.find('.card-container')
    await button.trigger('click')
    expect(routerPushSpy).toHaveBeenCalledTimes(1)
  })
})
