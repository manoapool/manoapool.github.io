import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Commuters } from '/imports/api/commuter/CommuterCollection';
import { Appointments } from '/imports/api/appointment/AppointmentCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Schedule_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Commuters.getPublicationName());
  this.subscribe(Appointments.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  // this.context = Profiles.getSchema().namedContext('Profile_Page');
  this.context = Appointments.getSchema().namedContext('Schedule_Page');
});

Template.Schedule_Page.helpers({
  commuter() {
    return Commuters.findDoc(FlowRouter.getParam('username'));
  },
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  profile() {
    //return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
        });
  },
  times() {
    return [
      { label: 'Morning: 7:00am - 11:00am', value: 'morning', selected: true },
      { label: 'Noon: 11:30am - 3:00pm', value: 'noon' },
      { label: 'Evening: 3:30pm - 7:00pm', value: 'evening' },
    ];
  },
  ridetimes() {
    return [
      { label: '6:00am', value: '6:00am', selected: true },
      { label: '6:30am', value: '6:30am' },
      { label: '7:00am', value: '7:00am' },
      { label: '7:30am', value: '7:30am' },
      { label: '8:00am', value: '8:00am' },
      { label: '8:30am', value: '8:00am' },
      { label: '9:00am', value: '9:00am' },
      { label: '9:30am', value: '9:30am' },
      { label: '10:00am', value: '10:00am' },
      { label: '10:30am', value: '10:30am' },
      { label: '11:00am', value: '11:00am' },
      { label: '11:30am', value: '11:30am' },
      { label: '12:00pm', value: '12:00pm' },
      { label: '12:30pm', value: '12:30pm' },
      { label: '1:00pm', value: '1:00pm' },
      { label: '1:30pm', value: '1:30pm' },
      { label: '2:00pm', value: '2:00pm' },
      { label: '2:30pm', value: '2:30pm' },
      { label: '3:00pm', value: '3:00pm' },
      { label: '3:30pm', value: '3:30pm' },
      { label: '4:00pm', value: '4:00pm' },
      { label: '4:30pm', value: '4:30pm' },
      { label: '5:00pm', value: '5:00pm' },
      { label: '5:30pm', value: '5:30pm' },
      { label: '6:00pm', value: '6:00pm' },
      { label: '6:30pm', value: '6:30pm' },
      { label: '7:00pm', value: '7:00pm' },
      { label: '7:30pm', value: '7:30pm' },
    ];
  },
  availableseats() {
    return [
      { label: '1', value: 1, selected: true },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 },
      { label: '7', value: 7 },
      { label: '8', value: 8 },

    ];
  },
  months() {
    return [
      { label: 'January', value: 'January', selected: true },
      { label: 'February', value: 'February' },
      { label: 'March', value: 'March' },
      { label: 'April', value: 'April' },
      { label: 'May', value: 'May' },
      { label: 'June', value: 'June' },
      { label: 'July', value: 'July' },
      { label: 'August', value: 'August' },
      { label: 'September', value: 'September' },
      { label: 'October', value: 'October' },
      { label: 'November', value: 'November' },
      { label: 'December', value: 'December' },
    ];
  },
  days() {
    return [
      { label: '1', value: '1', selected: true },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: '10', value: '10' },
      { label: '11', value: '11' },
      { label: '12', value: '12' },
      { label: '13', value: '13' },
      { label: '14', value: '14' },
      { label: '15', value: '15' },
      { label: '16', value: '16' },
      { label: '17', value: '17' },
      { label: '18', value: '18' },
      { label: '19', value: '19' },
      { label: '20', value: '20' },
      { label: '21', value: '21' },
      { label: '22', value: '22' },
      { label: '23', value: '23' },
      { label: '24', value: '24' },
      { label: '25', value: '25' },
      { label: '26', value: '26' },
      { label: '27', value: '27' },
      { label: '28', value: '28' },
      { label: '29', value: '29' },
      { label: '30', value: '30' },
      { label: '31', value: '31' },
    ];
  },
  years() {
    return [
      { label: '2017', value: '2017', selected: true },
      { label: '2018', value: '2018' },
    ];
  },

});


Template.Schedule_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();

    //Don't allow riders to schedule a ride
    const driver = Commuters.findDoc(FlowRouter.getParam('username')).username;
    const riders = [];
    const pendingRiders = [];

    // Get the values of the form
    const timeOfDaySelector = _.filter(event.target.TimeSlot.selectedOptions, (option) => option.selected);
    const timeOfDay = timeOfDaySelector[0].value;

    const timeSlotSelector = _.filter(event.target.Time.selectedOptions, (option) => option.selected);
    const timeSlot = timeSlotSelector[0].value;

    const seatsSelector = _.filter(event.target.Seats.selectedOptions, (option) => option.selected);
    const seats = parseInt(seatsSelector[0].value, 0);
    console.log(seats);

    // Get date
    let month = _.filter(event.target.Month.selectedOptions, (option) => option.selected);
    let day = _.filter(event.target.Day.selectedOptions, (option) => option.selected);
    let year = _.filter(event.target.Year.selectedOptions, (option) => option.selected);
    const date = (month[0].value + ' ' + day[0].value + ', ' + year[0].value);

    const comments = event.target.Comments.value;

    const newAppointment = { driver, riders, pendingRiders, seats, timeOfDay, timeSlot, date, comments };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Appointments.getSchema().clean(newAppointment);

    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      // Insert newAppointment into collection
      Appointments.define(cleanData);
      console.log(Appointments.findAll());
      instance.messageFlags.set(displaySuccessMessage, true);
      instance.messageFlags.set(displayErrorMessages, false);
      // Redirect to home page but first wait 3 seconds
      Meteor.setTimeout(function() {
        const name = Commuters.findDoc(FlowRouter.getParam('username')).username;
        FlowRouter.go('Home_Page', { username: name });
      }, (3 * 1000));
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }

  },
});
