const User = require("../models/User");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");

exports.updateProfile = wrapAsync(
   async (req, res, next) => {
      let { name, email } = req.body;
      const userToBeUpdated = await User.findByIdAndUpdate(req.user.id, {
         name: name,
         email: email,
         profileImage: {
            url: req.file.path,
            filename: req.file.filename
         }
      }, { new: true });

      if(!userToBeUpdated) throw new ExpressError(404, "User Not Found")

      res.status(200).json({
         message: "Profile updated (dummy response)", user: {
            ...userToBeUpdated
         }
      });
   }
)