import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import { ReactiveVar } from 'meteor/reactive-var';

/* global cloudinary */

Template.Cloudinary_Upload_Widget.onCreated(function onCreated() {
  this.messageVisible = new ReactiveVar(false);
});

Template.Cloudinary_Upload_Widget.helpers({
  showMessage() {
    return Template.instance().messageVisible.get();
  },
});

Template.Cloudinary_Upload_Widget.events({
  'click #cloudinary-upload-widget': function click(event, instance) {
    instance.messageVisible.set(true);

    event.preventDefault();
    cloudinary.openUploadWidget(
      { /* cloud_name: Meteor.settings.public.cloudinary.cloud_name, */
        /* upload_preset: Meteor.settings.public.cloudinary.upload_preset, */
        cloud_name: 'shooots',
        upload_preset: 'rtzj9wgo',
        sources: ['local', 'url', 'camera'],
        cropping: 'server',
        cropping_aspect_ratio: 1,
        max_file_size: '500000',
        max_image_width: '300',
        max_image_height: '300',
        min_image_width: '300',
        min_image_height: '300',
      },
        (error, result) => {
          if (error) {
            console.log('Error during Cloudinary upload: ', error);
            return;
          }
          // Otherwise get the form elements
          // console.log('Cloudinary results: ', result);
          const fileName = result[0].original_filename;
          const url = result[0].url;
          $("input[name='cloudinaryFileName']").val(fileName);
          $("input[name='cloudinaryUrl']").val(url);
        });
  },
});
