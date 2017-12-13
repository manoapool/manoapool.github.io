import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/* eslint-disable object-shorthand */

export const ImageData = new Mongo.Collection('ImageData');

/**
 * Create the schema for ImageData
 */
export const ImageDataSchema = new SimpleSchema({
  username: {
    label: 'Username',
    type: String,
  },
  url: {
    label: 'URL',
    type: String,
    optional: true,
  },
}, { tracker: Tracker });

ImageData.attachSchema(ImageDataSchema);
