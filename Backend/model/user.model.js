import mongoose, { mongo } from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobileno: {
            type: Number,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        notes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'notes',
            }
        ],
        profilepic: {
            type: String,
            default: ''
        },
        resetOTP:{
            type:String
        },
        otpExpiry: Date,
    },
    {
        timestamps: true
    }
)


UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);

})




export const UserModel = mongoose.model("User", UserSchema);