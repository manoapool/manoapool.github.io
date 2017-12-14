import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Commuters } from '/imports/api/commuter/CommuterCollection';
import { Appointments } from '/imports/api/appointment/AppointmentCollection';

const selectedTimeKey = 'selectedTime';
const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Filter_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Commuters.getPublicationName());
  this.subscribe(Appointments.getPublicationName());

  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.timeDay = new ReactiveDict();
  this.timeDay.set(selectedTimeKey, undefined);
});

Template.Filter_Page.helpers({
  commuters() {
    /**
    if(!Template.instance().timeDay.get(selectedTimeKey)) {
      return Commuters.find({}, { sort: { lastName: 1 } });
    }
    // Filter by time of day
    const allCommuters = Commuters.findAll();
    const selectedTime = Template.instance().timeDay.get(selectedTimeKey);
    return _.filter(allCommuters, function (commuter) { return commuter.timeOfDay === selectedTime; });
     */
    const allCommuters = Commuters.findAll();
    const allDrivers = _.filter(allCommuters, function (commuter) { return commuter.driver === true; });
    const allRiders = _.filter(allCommuters, function (commuter) { return commuter.driver === false; });

    // Filter by morning drivers
    const morningDrivers = _.filter(allDrivers, function (commuter) { return commuter.timeOfDay === 'morning'});
    // Filter by afternoon drivers
    const afternoonDrivers = _.filter(allDrivers, function (commuter) { return commuter.timeOfDay === 'noon'});
    // Filter by evening drivers
    const eveningDrivers = _.filter(allDrivers, function (commuter) { return commuter.timeOfDay === 'evening'});

    const selectedTime = Template.instance().timeDay.get(selectedTimeKey);

    // Shows all drivers if the user hasn't selected anyone
    if (!selectedTime) {
      return allDrivers;
    }

    // For now it will show different things because the timeDay variable hasn't been defined yet in Commuter
    if (selectedTime === 'morning') {
      return morningDrivers;
    } else if (selectedTime === 'noon') {
      // return Commuters.find({}, { sort: { lastName: 1 } });
      return afternoonDrivers;
    } else {
      return eveningDrivers;
    }
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  findDriver(appointment) {
    const id = appointment.driver;
    return Commuters.findDoc(id);
  },
  displayDriverName(appointment) {
    const driverRef = appointment.driver;
    const driver = Commuters.findDoc(driverRef);
    const first = driver.firstName;
    const last = driver.lastName;
    return (first + ' ' + last);
  },
  appointments() {
    /**
     if(!Template.instance().timeDay.get(selectedTimeKey)) {
      return Commuters.find({}, { sort: { lastName: 1 } });
    }
     // Filter by time of day
     const allCommuters = Commuters.findAll();
     const selectedTime = Template.instance().timeDay.get(selectedTimeKey);
     return _.filter(allCommuters, function (commuter) { return commuter.timeOfDay === selectedTime; });
     */
    const allAppointments = Appointments.findAll();
    // Filter by morning appointments
    const validAppointments = _.filter(allAppointments, function (appointment) {
      return appointment.seats > 0;
    });
    const morningAppointments = _.filter(validAppointments, function (appointment) { return appointment.timeOfDay === 'morning'; });
    // Filter by afternoon appointments
    const afternoonAppointments = _.filter(allAppointments, function (appointment) { return appointment.timeOfDay === 'noon'; });    // Filter by evening appointments
    const eveningAppointments = _.filter(allAppointments, function (appointment) { return appointment.timeOfDay === 'evening'; });
    const selectedTime = Template.instance().timeDay.get(selectedTimeKey);

    // Shows all drivers if the user hasn't selected anyone
    if (!selectedTime) {
      return validAppointments;
    }
    // For now it will show different things because the timeDay variable hasn't been defined yet in Commuter
    if (selectedTime === 'morning') {
      return morningAppointments;
    } else if (selectedTime === 'noon') {
      return afternoonAppointments;
    } else {
      return eveningAppointments;
    }
  },
  profiles() {
    // Initialize selectedInterests to all of them if messageFlags is undefined.

    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    return _.filter(allProfiles, profile => _.intersection(profile.interests, selectedInterests).length > 0);
  },

  interests() {
    return _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return {
            label: interest.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },
  cities() {
    return [
      { label: 'Honolulu' },
      { label: 'Kailua' },
      { label: 'Kaneohe' },
      { label: 'Kapolei' },
      { label: 'Waipahu' },
      { label: 'Mililani' },
      { label: 'Pearl City' },
      { label: 'Aiea' },
      { label: 'Ewa Beach' },
    ];
  },
  ridetimes() {
    return [
      { label: 'Morning: 7:00am - 11:00am', value: 'morning' },
      { label: 'Noon: 11:30am - 3:00pm', value: 'noon' },
      { label: 'Evening: 3:30pm - 7:00pm', value: 'evening' },
    ];
  },
});

Template.Filter_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    /**
    const selectedOptions = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedInterestsKey, _.map(selectedOptions, (option) => option.value));
     */

    // Very convoluted way of getting the time of day from the form
    const selectedTime = _.filter(event.target.Time.selectedOptions, (option) => option.selected);
    instance.timeDay.set(selectedTimeKey, selectedTime[0].value);

  },
  'click .schedule'(event, instance) {
    event.preventDefault();
    console.log(event);

    console.log(event.target.parentElement.parentElement);

    const appointmentRef = event.target.parentElement.parentElement; // This gets the id of the selected appointment
    const selectedAppointment = Appointments.findDoc(appointmentRef.id); // This gets the doc from the collection
    const currentUser = Commuters.findDoc(FlowRouter.getParam('username')); // Current user's doc from Commuters
    const pendingRiders = selectedAppointment.pendingRiders;  // current appointment's pendingRiders (String array)
    const riderName = currentUser.username; // Current user's username
    const duplicate = _.contains(pendingRiders, riderName); // True if user is already in pendingRiders

    // Not allowed to find a ride if you are a driver or if you are already in the appointment
    if (currentUser.driver || duplicate) {
      if( currentUser.driver) {
        console.log('you are a driver');
        alert('You are currently a driver. Unable to book appointment.');
      }
      if( duplicate ) {
        console.log('You have already booked this appointment!');
        alert('You have already booked this appointment!');
      }
    } else {
      // Add the current rider to the pendingDrivers field
      Appointments.update(appointmentRef.id, { $push: { pendingRiders: riderName } });
      console.log(selectedAppointment.pendingRiders);
      // Decrement the amount of seats
      console.log("Seats before " + selectedAppointment.seats);
      Appointments.update(appointmentRef.id, { $inc: { seats: -1 } });
      console.log("Seats after " + selectedAppointment.seats);
      instance.messageFlags.set(displaySuccessMessage, true);
      Meteor.setTimeout(function () {
        const name = Commuters.findDoc(FlowRouter.getParam('username')).username;
        FlowRouter.go('Home_Page', { username: name });
      }, (3 * 1000));
    }
  },
});
