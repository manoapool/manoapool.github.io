import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

Template.Text_Form_Control.onCreated(function onCreated() {
  this.messageVisible = new ReactiveVar(false);
});

Template.Text_Form_Control.helpers({
  showMessage() {
    return Template.instance().messageVisible.get();
  },
});

UI.registerHelper('message', function(context, options) {
  if(context == "First") {
    return "Your first name will be shown when you make a carpool appointment and for carpool filters.";
  } else if(context == "Last") {
    return "Your last name will be shown when you make a carpool appointment and for carpool filters.";
  } else if(context == "Picture") {
    return "Copy and paste the web url of a picture of you that has already been uploaded online.";
  } else if(context == "Address") {
    return "Your address will not be made public. Used only for scheduling purposes with your carpool mates.";
  } else if(context == "City") {
    return "Your city will be shown when you make a carpool appointment and for carpool filters.";
  } else if(context == "Zipcode") {
    return "Your zipcode will be shown when you make a carpool appointment and for carpool filters.";
  } else if(context == "Email") {
    return "Your UH email will not be made public. Used only for scheduling purposes with your carpool mates.";
  } else if(context == "Phone") {
    return "Your phone number will not be made public. Used only for scheduling purposes with your carpool mates.";
  }
});

Template.Text_Form_Control.events({
  'mouseenter .inquiry' (event, instance) {
    instance.messageVisible.set(true);
  },
  'mouseleave .inquiry' (event, instance) {
    instance.messageVisible.set(false);
  },
});