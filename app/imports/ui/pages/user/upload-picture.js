import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Commuters } from '/imports/api/commuter/CommuterCollection';
import { ImageData, ImageDataSchema } from '/imports/api/imagedata/imagedata.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

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
    const username = Commuters.findDoc(FlowRouter.getParam('username')).username;
    const allImages = ImageData.find().fetch();
    const myImages = _.filter(allImages, function (image) {
      return image.username === username;
    });
    console.log('Getting the recent image');
    const myCurrentImage = _.last(myImages);
    return myCurrentImage;
  },
  isEmpty() {
    const username = Commuters.findDoc(FlowRouter.getParam('username')).username;
    const allImages = ImageData.find().fetch();
    const myImages = _.filter(allImages, function (image) {
      return image.username === username;
    });
    const size = _.size(myImages);
    console.log(size);
    // return myImages.count() === 0;
    return size === 0;
  },
});

Template.Upload_Picture.events({
  'submit .image-data-form'(event, instance) {
    event.preventDefault();
    // Get field values.
    const username = Commuters.findDoc(FlowRouter.getParam('username')).username;
    const allImages = ImageData.find().fetch();
    const myImages = _.filter(allImages, function (image) {
      return image.username === username;
    });
    console.log(myImages);
    console.log('Getting the recent image2');
    const size = _.size(myImages);
    const myCurrentImage = _.last(myImages);
    const currentUrl = function () {
      if (size === 0) {
        console.log(size);
        return '/images/default-profile-pic.jpg';
      }
      console.log(myCurrentImage.url);
      return myCurrentImage.url;
      // console.log("URL: " + myImages[ImageData.find().count() - 1].url);
      // return myImages[ImageData.find().count() - 1].url;
    };

    if (event.target.cloudinaryUrl.value === '') {
      /* const url = myImages[ImageData.find().count() - 1].url; */
      const url = currentUrl();

      const newImageData = { username, url };
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
    } else {
      const url = event.target.cloudinaryUrl.value;
      const newImageData = { username, url };
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
    }
  },
});
