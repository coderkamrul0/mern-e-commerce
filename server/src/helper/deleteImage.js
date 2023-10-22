const fs = require("fs").promises;

const deleteImage = async (userImage) => {
  try {
    await fa.access(userImage);
    await fs.unlink(userImage);
    console.log("user image deleted.");
  } catch (error) {
    console.error("user image not exist.");
  }
};

module.exports = deleteImage;
