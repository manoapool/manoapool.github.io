import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

/**
 * fieldError is used by both Create_Student_Data_Page and Edit_Student_Data_Page, so we register it globally.
 */
Template.registerHelper('fieldError', (fieldName) => {
  const invalidKeys = Template.instance().context.validationErrors();
  const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
  return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
});

UI.registerHelper('message', function(context, options) {
  switch (context) {
    case "First":
      return "Your first name will be shown when you make a carpool appointment and for carpool filters.";
      break;
    case "Last":
      return "Your last name will be shown when you make a carpool appointment and for carpool filters.";
      break;
    case "Picture":
      return "Copy and paste the web url of a picture of you that has already been uploaded online.";
      break;
    case "Address":
      return "Your address will not be made public. Used only for scheduling purposes with your carpool mates.";
      break;
    case "City":
      return "Your city will be shown when you make a carpool appointment and for carpool filters.";
      break;
    case "Zipcode":
      return "Your zipcode will be shown when you make a carpool appointment and for carpool filters.";
      break;
    case "Email":
      return "Your UH email will not be made public. Used only for scheduling purposes with your carpool mates.";
      break;
    case "Phone":
      return "Your phone number will not be made public. Used only for scheduling purposes with your carpool mates.";
      break;
    case "Status":
      return "Indicate whether you are a driver or a rider. You can only identify as one of them at a single time.";
      break;
    case "Time":
      return "Filter through carpools that are taking place in the morning, noon, or evening.";
      break;
    case "Seats":
      return "Specify number of seats available.";
      break;
    case "Month":
      return "Month of carpool.";
      break;
    case "Day":
      return "Day of carpool.";
      break;
    case "Year":
      return "Year of carpool.";
      break;
    default:
      return "";
  }
});
