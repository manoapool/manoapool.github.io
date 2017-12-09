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

Template.Text_Form_Control.events({
  'mouseenter .inquiry' (event, instance) {
    instance.messageVisible.set(true);
  },
  'mouseleave .inquiry' (event, instance) {
    instance.messageVisible.set(false);
  },
});