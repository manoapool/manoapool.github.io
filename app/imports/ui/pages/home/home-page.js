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
  this.subscribe(Appointments.getPublicationName());
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
    const currentUser = FlowRouter.getParam('username');
    console.log(allAppointments);
    // Return all appointments where you are a pendingRider in
    const userUnconfirmed = _.filter(allAppointments, function (appointment) {
      return _.contains(appointment.pendingRiders, currentUser);
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
  'click .confirm'(event) {
    event.preventDefault();
    // Confirm Drivers
    const appointmentRef = event.target.parentElement.id;
    const appointmentDoc = Appointments.findDoc(appointmentRef);
    const pendingRiderRef = event.target.parentElement.children[1].id;  // id of the pendingRider
    const pendingRider = Commuters.findDoc(pendingRiderRef);
    // Remove the pendingRider from pendingDrivers
    const listPendingRiders = appointmentDoc.pendingRiders;
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
  'click .completed'(event) {
    event.preventDefault();
    const appointmentRef = event.target.parentElement.parentElement.parentElement.parentElement.id;
    console.log(appointmentRef);
    Appointments.removeIt(appointmentRef);
  },
  'click .cancel'(event) {
    event.preventDefault();
    const appointmentRef = event.target.parentElement.parentElement.id;
    const riderName = FlowRouter.getParam('username');
    const appointmentDoc = Appointments.findDoc(appointmentRef);
    // Remove rider from appointment's pendingRiders
    const listPending = appointmentDoc.pendingRiders;
    const pendingRiders = _.filter(listPending, function (name) {
      return name !== riderName;
    });
    const newData = { pendingRiders };
    Appointments.update(appointmentRef, { $inc: { seats: 1 } });
    Appointments.update(appointmentRef, { $set: newData });
  },
});

