const User = require("../models/user");

const updateProfile = async (_id, data) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, data, {
      returnDocument: "after",
    });
    return updatedUser;
  } catch (err) {
    throw new Error("Something went wrong! " + err.message);
  }
};

module.exports = { updateProfile };
