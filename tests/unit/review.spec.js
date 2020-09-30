import { shallowMount } from '@vue/test-utils'
import Review from '@/components/Review.vue'

describe('Review.vue', () => {
  it('Should emit the handleSubmit event submitting the form', async () => {
    const spySave = jest.spyOn(Review.methods, 'handleSubmit')

    const wrapper = shallowMount(Review)

    await wrapper.find('form').trigger('submit.prevent')

    expect(spySave).toHaveBeenCalled()
  })

  it('Should emit the Close event pushing the Cancel button', async () => {
    const spyClose = jest.spyOn(Review.methods, 'close')

    const wrapper = shallowMount(Review)

    const buttonClose = wrapper.find('button')
    await buttonClose.trigger('click')

    expect(spyClose).toHaveBeenCalled()
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
