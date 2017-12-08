import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Commuters } from '/imports/api/commuter/CommuterCollection';
import { Appointments } from '/imports/api/appointment/AppointmentCollection';

Template.Filter_Page_Directory.onCreated(function onCreated() {
  this.subscribe(Commuters.getPublicationName());
  this.subscribe(Appointments.getPublicationName());
});

Template.Filter_Page_Directory.helpers({
  findDriver(appointment) {
    const id = appointment.driver;
    return Commuters.findDoc(id);
  },
});
