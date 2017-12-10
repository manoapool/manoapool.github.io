import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ImageData, ImageDataSchema } from '/imports/api/imagedata/imagedata.js';

/* eslint-disable no-param-reassign */

const displayErrorMessages = 'displayErrorMessages';

Template.Upload_Picture.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.context = ImageDataSchema.namedContext('Upload_Picture');
  this.subscribe('ImageData');
});

Template.Upload_Picture.helpers({
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  images() {
    return ImageData.find();
  },
  getRecentImage() {
    const myImages = ImageData.find().fetch();
    console.log("Getting the recent image");
    return myImages[ImageData.find().count() - 1];
  }
});

Template.Upload_Picture.events({
  'submit .image-data-form'(event, instance) {
    event.preventDefault();
    // Get field values.
    const name = event.target.name.value;
    const url = event.target.cloudinaryUrl.value;
    const thumbnail = event.target.cloudinaryThumbnail.value;
    const newImageData = { name, url, thumbnail };
    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that newStudentData reflects what will be inserted.
    const cleanData = ImageDataSchema.clean(newImageData);
    // Determine validity.
    instance.context.validate(cleanData);
    if (instance.context.isValid()) {
      ImageData.insert(cleanData);
      instance.messageFlags.set(displayErrorMessages, false);
      instance.find('form').reset();
    } else {
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});