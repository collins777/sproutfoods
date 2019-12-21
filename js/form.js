//////////////////////////////////////////////////////////////////////
////////// Form validation

const errorMessage = document.getElementById("error-message");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const phoneNumber = document.getElementById("phoneNumber");
const confirmPhoneNumber = document.getElementById("confirmPhoneNumber");
const password = document.getElementById("password");
const email = document.getElementById("email");
const form = document.getElementById("form");

////////////////// Confirmation Code

// function validateForm() {
//   form.addEventListener("submit", e => {
//     let messages = [];

//     // Name Validation
//     if (firstName.value === "" || firstName.value == null) {
//       messages.push("First name is required");
//     } else if (lastName.value === "" || lastName.value == null) {
//       messages.push("Last name is required");
//     }

//     // Password Validation
//     if (password.value === "password") {
//       messages.push("Password cannot be password");
//     }

//     // Phone Validation
//     if (phoneNumber.value != confirmPhoneNumber.value) {
//       messages.push("Phone numbers do not match");
//     }

//     // Error Messages
//     if (messages.length > 0) {
//       e.preventDefault();
//       errorMessage.innerText = messages.join(",");
//     }
//   });
// }

////////////

form.addEventListener("submit", e => {
  try {
    if (firstName.value === "" || firstName.value == null) {
      // First name validation
      throw "First name is required.";
    }

    if (lastName.value === "" || lastName.value == null) {
      // Last name validation
      throw "Last name is required.";
    }

    if (phoneNumber.value != confirmPhoneNumber.value) {
      // Phone Validation
      throw "Phone numbers do not match.";
    }

    if (password.value === "password") {
      // Password Validation
      throw "Password cannot by password";
    }
  } catch (error) {
    e.preventDefault();
    window.alert(error);
  }
});
