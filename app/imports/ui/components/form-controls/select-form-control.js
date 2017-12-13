import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

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

Template.Select_Form_Control.events({
  'mouseenter .inquiry'(event, instance) {
    instance.messageVisible.set(true);
  },
  'mouseleave .inquiry'(event, instance) {
    instance.messageVisible.set(false);
  },
});
