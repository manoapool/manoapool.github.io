import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Commuters } from '/imports/api/commuter/CommuterCollection';
import { Appointments } from '/imports/api/appointment/AppointmentCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.subscribe(Commuters.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Profiles.getSchema().namedContext('Home_Page');
});

Template.Home_Page.helpers({
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
    return Profiles.findDoc(FlowRouter.getParam('username'));
  },
  interests() {
    const profile = Profiles.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
            function makeInterestObject(interest) {
              return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
            });
  },
  displayUser() {
    //return Profiles.findDoc(FlowRouter.getParam('username')).username;
    //const thename = Commuters.findDoc('henric').firstName;
    const thename = Commuters.findDoc(FlowRouter.getParam('username')).firstName;
    return thename;
  },
  findName(username) {
    const userDoc = Commuters.findDoc(username);
    return userDoc;
  },
  pendingRiders() {
    // Returns array of objects that hold all riders username, the appointmentDoc
    const allAppointments = Appointments.findAll();
    const currentUser = Commuters.findDoc(FlowRouter.getParam('username'));
    // Get all appointments with at least one pendingRider
    const pendingAppointments = _.filter(allAppointments, function (appointment) {
      return appointment.pendingRiders.length > 0;
    });
    // Only get appointments whose driver is the currentUser
    const userPendingAppointments = _.filter(pendingAppointments, function (appointment) {
      return appointment.driver === currentUser.username;
    });
    let appointments = [];
    // Create objects containing each pendingRider and the appointmentDoc
    _.each(userPendingAppointments, function (appointment) {
      const listPendingRiders = appointment.pendingRiders;
      _.each(listPendingRiders, function (rider) {
        let obj = {
          pendingRider: rider,
          appointmentDoc: appointment,
        };
        appointments.push(obj);
      });
    });
    console.log(appointments);
    return appointments;
  },
});


Template.Home_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
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

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Profiles.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Profiles.findDoc(FlowRouter.getParam('username'))._id;
      const id = Profiles.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

