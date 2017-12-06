import { Template } from 'meteor/templating';

Template.File_Form_Control.helpers({
  validFileList() {
    const fileList = document.getElementById("fileList");
    if (fileList.size() == 0) {
      fileList.innerHTML = "<p>No files selected!</p>";
      return false;
    } else if (fileList.size() == 1) {
      fileList.innerHTML = "";
      return true;
    }
  },
  createObjectURL() {
    const profileImage = document.createEelement("img");
    img.src = window.URL.createObjectURL(fileList[0]);
    img.height = 300;
    img.width = 300;
    img.onload = function () {
      window.URL.revokeObjectURL(this.src);
    }
  },
  defaultPic() {
    return "/images/default-profile-pic.jpg"
  }
});