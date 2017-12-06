import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Appointment */

/**
 * Represents a specific appointment, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class AppointmentCollection extends BaseCollection {

  /**
   * Creates the Appointment collection.
   */
  constructor() {
    super('Appointment', new SimpleSchema({
      username: { type: String },
      // Remainder are optional
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      email: { type: String, optional: true },
      phone: { type: String, optional: true },
      seats: { type: Number, optional: true },
      timeOfDay: { type: String, optional: true },
      timeSlot: { type: String, optional: true },
      date: { type: String, optional: true },
      comments: { type: String, optional: true },
      accept: { type: Boolean, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Appointment.
   * @example
   * Appointments.define({  username: 'johnson',
                            firstName: 'Phillip',
                            lastName: 'Johnson',
                            picture: 'http://philipmjohnson.org/headshot.jpg',
                            email: 'johnson@hawaii.edu',
   *                        phone: '808-123-4567',
                            seats: 3,
                            timeOfDay: 'noon',
   *                        timeSlot: '7:30am',
   *                        date: 'November 9, 2017',
   *                        comments: 'Meet at Starbucks',
                            accept: true,
                             });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the appointment definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ firstName = '', lastName = '', username, email = '', phone = '', picture = '', seats = 0, timeOfDay = '', timeSlot = '', date = '', comments = '', accept = false }) {

    /*check(name, String);
    check(description, String);*/

    // make sure required fields are OK.
    const checkPattern = { firstName: String, lastName: String, username: String, email: String, phone: String, picture: String, seats: Number, timeOfDay: String, timeSlot: String, date: String, comments: String, accept: Boolean };
    check({ firstName, lastName, username, email, phone, picture, seats, timeOfDay, timeSlot, date, comments, accept}, checkPattern);

    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Appointment`);
    }
    return this._collection.insert({ firstName, lastName, username, email, phone, picture, seats, timeOfDay, timeSlot, date, comments, accept });
  }

  /**
   * Returns the Appointment name corresponding to the passed appointment docID.
   * @param appointmentID An appointment docID.
   * @returns { String } An appointment name.
   * @throws { Meteor.Error} If the appointment docID cannot be found.
   */
  findName(appointmentID) {
    this.assertDefined(appointmentID);
    return this.findDoc(appointmentID).name;
  }

  /**
   * Returns a list of Interest names corresponding to the passed list of Interest docIDs.
   * @param appointmentIDs A list of Interest docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(appointmentIDs) {
    return appointmentIDs.map(appointmentID => this.findName(appointmentID));
  }

  /**
   * Throws an error if the passed name is not a defined Appointment name.
   * @param name The name of an appointment.
   */
  assertName(name) {
    this.findDoc(name);
  }

  /**
   * Throws an error if the passed list of names are not all Appointment names.
   * @param names An array of (hopefully) Appointment names.
   */
  assertNames(names) {
    _.each(names, name => this.assertName(name));
  }

  /**
   * Returns the docID associated with the passed Appointment name, or throws an error if it cannot be found.
   * @param { String } name An Appointment name.
   * @returns { String } The docID associated with the name.
   * @throws { Meteor.Error } If name is not associated with an Appointment.
   */
  findID(name) {
    return (this.findDoc(name)._id);
  }

  /**
   * Returns the docIDs associated with the array of Appointment names, or throws an error if any name cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } names An array of Appointment names.
   * @returns { String[] } The docIDs associated with the names.
   * @throws { Meteor.Error } If any instance is not an Appointment name.
   */
  findIDs(names) {
    return (names) ? names.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Appointment docID in a format acceptable to define().
   * @param docID The docID of an Appointment.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const username = doc.username;
    const email = doc.email;
    const phone = doc.phone;
    const picture = doc.picture;
    const seats = doc.seats;
    const timeOfDay = doc.timeOfDay;
    const timeSlot = doc.timeSlot;
    const date = doc.date;
    const comments = doc.comments;
    const accept = doc.accept;
    return { firstName, lastName, username, email, phone, picture, seats, timeOfDay, timeSlot, date, comments, accept };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Appointments = new AppointmentCollection();
