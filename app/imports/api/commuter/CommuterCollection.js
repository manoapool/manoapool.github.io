import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Commuter */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class CommuterCollection extends BaseCollection {

  /**
   * Creates the Commuter collection.
   */
  constructor() {
    super('Commuter', new SimpleSchema({
      username: { type: String },
      driver: { type: Boolean },
      city: { type: String },
      zipcode: { type: String },
      email: { type: String },
      phone: { type: String },
      // Remainder are optional
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      address: { type: String, optional: true },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Commuter.
   * @example
   * Profiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   driver: false
   *                   email: 'johnson@hawaii.edu'
   *                   phone: '808-123-4567'
   *                   city: 'Honolulu"
   *                   zipcode: '96826'
   *                   address: '918 12th Ave.'
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined.
   * @returns The newly created docID.
   */
  define({ firstName = '', lastName = '', username, driver, city = '', zipcode = '', address = '', email = '', phone = '', picture = '' }) {
    // make sure required fields are OK.
    const checkPattern = { firstName: String, lastName: String, username: String, driver: Boolean, city: String, zipcode: String, address: String, email: String, phone: String, picture: String };
    check({ firstName, lastName, username, driver, city, zipcode, address, email, phone, picture}, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    }

    return this._collection.insert({ firstName, lastName, username, driver, city, zipcode, address, email, phone, picture });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const username = doc.username;
    const driver = doc.driver;
    const city = doc.city;
    const zipcode = doc.zipcode;
    const address = doc.address;
    const email = doc.email;
    const phone = doc.phone;
    const picture = doc.picture;
    return { firstName, lastName, username, driver, city, zipcode, address, email, phone, picture };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Commuters = new CommuterCollection();
