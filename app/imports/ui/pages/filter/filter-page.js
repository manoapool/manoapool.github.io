import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Commuters } from '/imports/api/commuter/CommuterCollection';
import { Appointments } from '/imports/api/appointment/AppointmentCollection';

const selectedInterestsKey = 'selectedInterests';
const selectedTimeKey = 'selectedTime';

Template.Filter_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Commuters.getPublicationName());
  this.subscribe(Appointments.getPublicationName());

  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, undefined);

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
    if(!selectedTime) {
      return allDrivers;
    }

    // For now it will show different things because the timeDay variable hasn't been defined yet in Commuter
    if(selectedTime === 'morning') {
      return morningDrivers;
    } else if (selectedTime === 'noon') {
      //return Commuters.find({}, { sort: { lastName: 1 } });
      return afternoonDrivers;
    } else {
      return eveningDrivers;
    }
  },
  findDriver(appointment) {
    const id = appointment.driver;
    return Commuters.findDoc(id);
  },
  displayField(field) {

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
    const morningAppointments = _.filter(allAppointments, function (appointment) { return appointment.timeOfDay === 'morning'});
    // Filter by afternoon appointments
    const afternoonAppointments = _.filter(allAppointments, function (appointment) { return appointment.timeOfDay === 'noon'});    // Filter by evening appointments
    const eveningAppointments = _.filter(allAppointments, function (appointment) { return appointment.timeOfDay === 'evening'});
    const selectedTime = Template.instance().timeDay.get(selectedTimeKey);

    // Shows all drivers if the user hasn't selected anyone
    if (!selectedTime) {
      return allAppointments;
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
});
