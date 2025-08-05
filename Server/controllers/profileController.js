const User = require("../models/User");

exports.updateProfile = async (req, res) => {
   let {name , email} = req.body;
   const userToBeUpdated = await User.findByIdAndUpdate(req.user.id, {
      name: name,
      email: email,
      profileImage:{
         url : req.file.path,
         filename: req.file.filename
      }
   }, {new: true});

   console.log(userToBeUpdated)

   res.status(200).json({ message: "Profile updated (dummy response)", user: {
      ...userToBeUpdated
   }});
}