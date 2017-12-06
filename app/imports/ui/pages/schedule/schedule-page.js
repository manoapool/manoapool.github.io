/*
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Commuters } from '/imports/api/commuter/CommuterCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Schedule_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Commuters.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  // this.context = Profiles.getSchema().namedContext('Profile_Page');
  this.context = Commuters.getSchema().namedContext('Schedule_Page');

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
      { label: 'Morning: 7:00am - 11:00am', value: 'morning' },
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
      { label: '1', value: 1 },
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
      { label: 'January', selected: true },
      { label: 'February' },
      { label: 'March' },
      { label: 'April' },
      { label: 'May' },
      { label: 'June' },
      { label: 'July' },
      { label: 'August' },
      { label: 'September' },
      { label: 'October' },
      { label: 'November' },
      { label: 'December' },
    ];
  },
  days() {
    return [
      { label: '1', selected: true },
      { label: '2'},
      { label: '3'},
      { label: '4'},
      { label: '5'},
      { label: '6'},
      { label: '7'},
      { label: '8'},
      { label: '9'},
      { label: '10'},
      { label: '11'},
      { label: '12'},
      { label: '13'},
      { label: '14'},
      { label: '15'},
      { label: '16'},
      { label: '17'},
      { label: '18'},
      { label: '19'},
      { label: '20'},
      { label: '21'},
      { label: '22'},
      { label: '23'},
      { label: '24'},
      { label: '25'},
      { label: '26'},
      { label: '27'},
      { label: '28'},
      { label: '29'},
      { label: '30'},
      { label: '31'},
    ];
  },
  years() {
    return [
      { label: '2017', selected: true },
      { label: '2018' },
    ];
  },

});


Template.Schedule_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();

    /*
    const firstName = event.target.First.value;
    const lastName = event.target.Last.value;
    const title = event.target.Title.value;
    const location = event.target.Location.value;
    const username = FlowRouter.getParam('username'); // schema requires username.
    const picture = event.target.Picture.value;
    const github = event.target.Github.value;
    const facebook = event.target.Facebook.value;
    const instagram = event.target.Instagram.value;
    const bio = event.target.Bio.value;
    const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);

    const updatedProfileData = { firstName, lastName, title, picture, github, facebook, instagram, bio, interests,
      username, location };
    */

    // Get the values of the form
    const timeOfDaySelector = _.filter(event.target.TimeSlot.selectionOptions, (option) => option.selected);
    const timeOfDay = timeOfDaySelector[0].value;

    const timeSlotSelector = _.filter(event.target.Time.selectionOptions, (option) => option.selected);
    const timeSlot = timeSlotSelector[0].value;

    const seatsSelector = _.filter(event.target.Seats.selectionOptions, (option) => option.selected);
    const seats = seatsSelector[0].value;

    // Get date
    let month = _.filter(event.target.Month.selectionOptions, (option) => option.selected);
    let day = _.filter(event.target.Day.selectionOptions, (option) => option.selected);
    let year = _.filter(event.target.Year.selectionOptions, (option) => option.selected);
    const date = month[0].value + ' ' + day[0].value + ', ' + year[0].value;

    const comments = event.target.Comments.value;

    const updatedCommuterData = { timeOfDay, timeSlot, seats, date, comments };
    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    //const cleanData = Profiles.getSchema().clean(updatedProfileData);
    const cleanData = Commuters.getSchema().clean(updatedCommuterData);

    // Determine validity.
    instance.context.validate(cleanData);
    /*
    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
    */
    if (instance.context.isValid()) {
      const docID = Commuters.findDoc(FlowRouter.getParam('username'))._id;
      const id = Commuters.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
*/