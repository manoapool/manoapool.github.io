import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

Template.Select_Form_Control.onRendered(function onRendered() {
  this.$('select.dropdown').dropdown();
});

Template.Select_Form_Control.onCreated(function onCreated() {
  this.messageVisible = new ReactiveVar(false);
});

Template.Select_Form_Control.helpers({
  showMessage() {
    return Template.instance().messageVisible.get();
  },
});

UI.registerHelper('message', function(context, options) {
  if(context == "Time") {
    return "Choose the time interval for your carpool.";
  } else if(context == "Seats Available") {
    return "Indicate the number of seats available for carpooling in your car.";
  } else if(context == "Month") {
    return "Month of carpool.";
  } else if(context == "Day") {
    return "Day of carpool.";
  } else if(context == "Year") {
    return "Year of carpool.";
  }
});

Template.Select_Form_Control.events({
  'mouseenter .inquiry' (event, instance) {
    instance.messageVisible.set(true);
  },
  'mouseleave .inquiry' (event, instance) {
    instance.messageVisible.set(false);
  },
});