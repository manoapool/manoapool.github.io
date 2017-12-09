import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Commuters } from '/imports/api/commuter/CommuterCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Profile_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Commuters.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Commuters.getSchema().namedContext('Profile_Page');
});

Template.Profile_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  profile() {
    return Commuters.findDoc(FlowRouter.getParam('username'));
  },
  /*interests() {
    const profile = Commuters.findDoc(FlowRouter.getParam('username'));
    const selectedInterests = profile.interests;
    return profile && _.map(Interests.findAll(),
            function makeInterestObject(interest) {
              return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
            });
  },*/
  status() {
    const isChecked = Commuters.findDoc(FlowRouter.getParam('username')).driver;
    if (isChecked === false) {
      return [
        {label: "Driver", name: "Driver", checked: false},
        {label: "Rider", name: "Rider", checked: true}];
    } else if (isChecked === true) {
      return [
        { label: "Driver", name: "Driver", checked: true },
        { label: "Rider", name: "Rider", checked: false }];
    } else {
      return [
        {label: "Driver", name: "Driver", checked: false},
        {label: "Rider", name: "Rider", checked: false}];
    }
  },
});


Template.Profile_Page.events({
  'submit .profile-data-form'(event, instance) {
    event.preventDefault();
    const firstName = event.target.First.value;
    const lastName = event.target.Last.value;
    const status = function () {
      if (event.target.Status.value == "Driver") {
        return true;
      } else {
        return false;
      }
    };
    const driver = status();
    /*const picture = event.target.Picture.value;*/
    const isDefaultPic = function () {
      if (event.target.Picture.value == "") {
        console.log(event.target.Picture.value);
        return "/images/default-profile-pic.jpg";
      } else {
        return event.target.Picture.value;
      }
    };
    const picture = isDefaultPic();
    const address = event.target.Address.value;
    const city = event.target.City.value;
    const zipcode = event.target.Zipcode.value;
    const email = event.target.Email.value;
    const phone = event.target.Phone.value;
    /*const title = event.target.Title.value;
    const location = event.target.Location.value;*/
    const username = FlowRouter.getParam('username'); // schema requires username.
    /*const github = event.target.Github.value;
    const facebook = event.target.Facebook.value;
    const instagram = event.target.Instagram.value;
    const bio = event.target.Bio.value;*/
    /*const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const interests = _.map(selectedInterests, (option) => option.value);*/

    /*const updatedProfileData = { firstName, lastName, title, picture, github, facebook, instagram, bio, interests,
      username, location };*/
    const updatedProfileData = { firstName, lastName, driver, city, zipcode, email, phone,address, picture,
      username};

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Commuters.getSchema().clean(updatedProfileData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Commuters.findDoc(FlowRouter.getParam('username'))._id;
      const id = Commuters.update(docID, { $set: cleanData });
      const name = Commuters.findDoc(FlowRouter.getParam('username')).username;
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
      FlowRouter.go('Home_Page', { username: name });
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});

