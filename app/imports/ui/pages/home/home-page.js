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
  isDriver() {
    const currentUser = Commuters.findDoc(FlowRouter.getParam('username'));
    return currentUser.driver;
  },
  unconfirmedAppointments() {
    const allAppointments = Appointments.findAll();
    const currentUser = Commuters.findDoc(FlowRouter.getParam('username'));

    // Return all appointments where you are a pendingRider in
    const userUnconfirmed = _.filter(allAppointments, function (appointment) {
      return _.contains(appointment.pendingRiders, currentUser.username);
    });
    console.log(userUnconfirmed);
    return userUnconfirmed;
  },
  confirmedAppointments() {
    const allAppointments = Appointments.findAll();
    const currentUser = Commuters.findDoc(FlowRouter.getParam('username'));

    // If currentUser is a driver return all the appointments where he/she is the driver and has more than one rider
    if (currentUser.driver) {
      // Return appointments with at least one rider
      const confirmed = _.filter(allAppointments, function (appointment) {
        return appointment.riders.length > 0;
      });
      const userConfirmed = _.filter(confirmed, function (appointment) {
        return appointment.driver === currentUser.username;
      });
      return userConfirmed;
    }
    // If you're a rider then display the ones that you are a rider in
    const userConfirmed = _.filter(allAppointments, function (appointment) {
      return _.contains(appointment.riders, currentUser.username);
    });
    console.log(userConfirmed);
    return userConfirmed;
  },
  findDriver(appointment) {
    const id = appointment.driver;
    return Commuters.findDoc(id);
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
  currentUser() {
    return Commuters.findDoc(FlowRouter.getParam('username'));
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
  'click .confirm'(event, instance) {
    event.preventDefault();
    // Confirm Drivers
    const appointmentRef = event.target.parentElement.id;
    const appointmentDoc = Appointments.findDoc(appointmentRef);
    const pendingRiderRef = event.target.parentElement.children[0].id;  // id of the pendingRider
    const pendingRider = Commuters.findDoc(pendingRiderRef);
    // Remove the pendingRider from pendingDrivers
    let listPendingRiders = appointmentDoc.pendingRiders;
    const pendingRiders = _.filter(listPendingRiders, function (name) {
      return name !== pendingRider.username;
    });

    // Put pendingRider into riders
    const listRiders = appointmentDoc.riders;
    listRiders.push(pendingRider.username);
    const riders = listRiders;
    const newData = { riders, pendingRiders };

    // Set new data
    Appointments.update(appointmentRef, { $set: newData });
  },
});

