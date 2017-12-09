import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Commuters } from '/imports/api/commuter/CommuterCollection';
import { Appointments } from '/imports/api/appointment/AppointmentCollection';

Template.Confirm_Riders_Directory.onCreated(function onCreated() {
  this.subscribe(Commuters.getPublicationName());
  this.subscribe(Appointments.getPublicationName());
});

Template.Confirm_Riders_Directory.helpers({
  findRider(name) {
    const riderDoc = Commuters.findDoc(name);
    return riderDoc;
  },
});
