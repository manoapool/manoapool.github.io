import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Commuters } from '/imports/api/commuter/CommuterCollection';
import { Appointments } from '/imports/api/appointment/AppointmentCollection';

Interests.publish();
Profiles.publish();
Commuters.publish();
Appointments.publish();
