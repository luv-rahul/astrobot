const isFullNameValid = (fullName) => {
  if (!fullName || typeof fullName !== "string") {
    throw new Error("Full Name is not valid!");
  }

  fullName = fullName.trim();

  if (fullName.length < 4 || fullName.length > 20) {
    throw new Error("Full Name must be 4-20 characters long");
  }

  return true;
};

const isEmailValid = (emailId) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(emailId)) {
    throw new Error("Invalid Email Id");
  }

  return true;
};

const isPasswordValid = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;

  if (!regex.test(password)) {
    throw new Error(
      "Password must contain 8 characters, uppercase, lowercase, special character and number",
    );
  }

  return true;
};

const isDobValid = (dob) => {
  const regex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;

  if (!regex.test(dob)) {
    throw new Error("Invalid Date of Birth");
  }

  return true;
};

const isBirthTimeValid = (time) => {
  const regex = /^(1[0-2]|[1-9]):[0-5][0-9]\s?(am|pm)$/i;

  if (!regex.test(time)) {
    throw new Error("Invalid Time");
  }

  return true;
};

const isBirthPlaceValid = (place) => {
  if (!place || typeof place !== "string") {
    throw new Error("Invalid Birth Place");
  }

  return true;
};

const isDataValid = (fullName, emailId, password, dob, time, place) => {
  try {
    isFullNameValid(fullName);
    isEmailValid(emailId);
    isPasswordValid(password);
    isDobValid(dob);
    isBirthTimeValid(time);
    isBirthPlaceValid(place);

    return true;
  } catch (err) {
    throw err;
  }
};

module.exports = { isDataValid, isEmailValid, isPasswordValid };
