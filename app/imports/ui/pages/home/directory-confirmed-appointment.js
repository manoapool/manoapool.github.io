import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Commuters } from '/imports/api/commuter/CommuterCollection';
import { Appointments } from '/imports/api/appointment/AppointmentCollection';

Template.Directory_Confirmed_Appointment.onCreated(function onCreated() {
  this.subscribe(Commuters.getPublicationName());
  this.subscribe(Appointments.getPublicationName());
});

Template.Directory_Confirmed_Appointment.helpers({
  showRiders(appointment) {
    const listRiders = appointment.riders;
    let riderDocs = [];
    _.each(listRiders, function (rider) {
      const riderDoc = Commuters.findDoc(rider);
      riderDocs.push(riderDoc);
    });
    return riderDocs;
  },
});
