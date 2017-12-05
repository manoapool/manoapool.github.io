import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Commuters } from '/imports/api/commuter/CommuterCollection';

/* eslint-disable no-console */

/* Create a profile document for this user if none exists already. */
Accounts.validateNewUser(function validate(user) {
  if (user) {
    const username = user.services.cas.id;
    if (!Commuters.isDefined(username)) {
      Commuters.define({ username });
    }
  }
  // All UH users are valid for BowFolios.
  return true;
});
