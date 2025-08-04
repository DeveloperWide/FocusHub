const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {Schema , model} = mongoose;

const userSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    profileImage: {
        url: {
            type: String,
            default: "https://i.pinimg.com/1200x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
        },
        filename: {
            type: String,
            default: "image"
        }
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = model('User', userSchema);
module.exports =  User;
