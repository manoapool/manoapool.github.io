import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

Template.Radio_Form_Control.onCreated(function onCreated() {
  this.messageVisible = new ReactiveVar(false);
});

Template.Radio_Form_Control.helpers({
  showMessage() {
    return Template.instance().messageVisible.get();
  },
});

UI.registerHelper('message', function(context, options) {
  console.log("Hi");
  if(context == "Status") {
    return "Indicate whether you are a driver or a rider. You can only identify as one of them at a single time.";
  }
});

Template.Radio_Form_Control.events({
  'mouseenter .inquiries' (event, instance) {
    instance.messageVisible.set(true);
  },
  'mouseleave .inquiries' (event, instance) {
    instance.messageVisible.set(false);
  },
});