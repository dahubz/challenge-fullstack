import Ember from 'ember';
import CreateBookingMutation from '../gql/mutations/createBooking.graphql';

const DEFAULT_DATE = '2021-12-30';
const EMPTY_TIME_TO_EVENTS = {
  '12 AM': [],
  '1 AM': [],
  '2 AM': [],
  '3 AM': [],
  '4 AM': [],
  '5 AM': [],
  '6 AM': [],
  '7 AM': [],
  '8 AM': [],
  '9 AM': [],
  '10 AM': [],
  '11 AM': [],
  '12 PM': [],
  '1 PM': [],
  '2 PM': [],
  '3 PM': [],
  '4 PM': [],
  '5 PM': [],
  '6 PM': [],
  '7 PM': [],
  '8 PM': [],
  '9 PM': [],
  '10 PM': [],
  '11 PM': [],
};

export default Ember.Component.extend({
  showModal: false,
  eventId: null,
  firstName: null,
  lastName: null,
  selectedDate: null,
  timeToEventMap: null,
  apollo: Ember.inject.service(),

  init() {
    this._super(...arguments);
    this.set('selectedDate', DEFAULT_DATE);
    const dateToSet = new Date(DEFAULT_DATE).setHours(0, 0, 0, 0);
    this.filterEventsForSelectedDate(dateToSet);
  },

  filterEventsForSelectedDate(date) {
    this.set(
      'timeToEventMap',
      JSON.parse(JSON.stringify(EMPTY_TIME_TO_EVENTS))
    );
    const filteredEvents = this.model
      .filter((event) => {
        return new Date(event.start).setHours(0, 0, 0, 0) === date;
      })
      .forEach((event) => {
        const eventHour = new Date(event.start).toLocaleString('en-US', {
          hour: 'numeric',
          hour12: true,
        });
        this.timeToEventMap[eventHour].push(event);
      });
  },

  updateDate(e) {
    this.set('selectedDate', e.target.valueAsDate);
  },

  closeModalAndReset() {
    this.set('showModal', false);
    this.set('lastName', null);
    this.set('firstName', null);
  },

  actions: {
    closeModal() {
      this.closeModalAndReset();
    },
    filterForSelectedDate() {
      this.filterEventsForSelectedDate(
        new Date(this.selectedDate).setHours(0, 0, 0, 0)
      );
    },
    submit() {
      const variables = {
        firstName: this.firstName,
        lastName: this.lastName,
        eventId: this.eventId,
      };
      this.get('apollo').mutate(
        { mutation: CreateBookingMutation, variables },
        'createBooking'
      );
      this.closeModalAndReset();
    },
    clicked(event) {
      this.set('eventId', event.id);
      this.set('showModal', true);
    },
  },
});
