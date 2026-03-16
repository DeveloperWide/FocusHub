let mongoose = require("mongoose");
const { Schema, model } = mongoose;

const goalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

	// Add Completed, Giveup  & days field
	tag: {
		type: String,
		required: true,
		trim: true,
	},

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id; // convert _id -> id
        delete ret._id; // remove _id
        delete ret.__v; // remove version key
        return ret;
      },
    },
  },
);

goalSchema.index({ user: 1, tag: 1 }, { unique: true });

const Goal = model("Goal", goalSchema);
module.exports = Goal;
