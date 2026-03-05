const userService = require("../services/userService");

const getProfile = async (req, res) => {
  try {
    const data = req.user;
    res.status(200).json({ status: 200, message: { data } });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Something went wrong! " + err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const updatedOptions = [
      "fullName",
      "password",
      "dob",
      "birthTime",
      "birthPlace",
    ];

    const isUpdatedDataValid = Object.keys(req.body).every((key) =>
      updatedOptions.includes(key),
    );

    if (!isUpdatedDataValid) {
      throw new Error("Invalid Credentials!");
    }

    const data = await userService.updateProfile(_id, req.body);
    res
      .status(200)
      .json({
        status: 200,
        message: "User Details Updated Successfully!",
        data,
      });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, message: "Something went wrong! " + err.message });
  }
};

module.exports = { getProfile, updateProfile };
