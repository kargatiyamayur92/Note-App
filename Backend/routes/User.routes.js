import express, { Router } from 'express'
const router = express.Router();
import { UserModel } from '../model/user.model.js';
import { loginUser, logout, passwordupdate, registerUser } from '../controller/Authentication.controller.js';
import { isLoggedin } from '../middleware/isLoggedin.middleware.js';
import multer from 'multer';

import upload from '../config/multer.config.js';
import { getpic, Updateprofilepic, usernameChange } from '../controller/profileimage.controller.js';
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', isLoggedin, logout);

router.get('/check-auth', isLoggedin, async (req, res) => {
    let user = await req.user

    res.json(
        {
            success: true,
            userdata: user,

        }
    )
})


router.post('/profilepicture', isLoggedin, upload.single("profilePic"), Updateprofilepic);

//get profilepicture
router.get('/getpic', isLoggedin, getpic)

//update username
router.put('/chaneusername', isLoggedin, usernameChange)

//update password
router.put('/passwordupdate', isLoggedin, passwordupdate)

const generateotp = () => {
    return Math.floor(200000 + Math.random() * 800000).toString();
}

router.post('/sendOTP', async (req, res) => {

    const transpoter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMIAL_PASSWORD,
            }
        }
    )



    let email = req.body;
    console.log(email.otpemail)
    let user = await UserModel.findOne({ email: email.otpemail });
    if (!user) {
        return res.json(
            {
                success: false,
                message: "User not exist!"
            }
        )
    }
    let otp = generateotp();
    console.log(otp)
    user.resetOTP = otp
    user.otpExpiry = Date.now() +  30 * 1000;
    await user.save();

    const mailOption = {
        from: process.env.EMAIL,
        to: email.otpemail,
        subject: "Reset password for Note app",
        text: `Don't share otp anyware your otp is : ${otp} `
    }


    transpoter.sendMail(mailOption)
        .then((response) => {
            res.json(
                {
                    success: true,
                    message: "OTP email send successfully"
                }
            )
        })
        .catch((err) => {
            res.json(
                {
                    success: false,
                    message: `OTP email sending error`
                }
            )
        })


})

router.post('/verifyOTP', async (req, res) => {
    let { otpemail, otp } = req.body;
    console.log(otpemail, otp);
    let user = await UserModel.findOne({ email: otpemail });
    if (!user) {
        return res.json(
            {
                success: false,
                message: "User not exist!"
            }
        )
    }

    if(user.otpExpiry < Date.now()){
        return res.json(
            {
                success:false,
                message:"OTP was expaired"
            }
        )
    }

    if (otp == user.resetOTP) {
        res.send(
            {
                success: true,
                message: "you can change your password"
            }
        )
    }
    else {
        res.send(
            {
                success: false,
                message: "OTP does not match !!"
            }
        )
    }
})

router.post('/setnewpassword', async (req, res) => {
    let { otpemail, newpassword, confirmpassword } = req.body;
    let user = await UserModel.findOne({ email: otpemail });
    if (!user) {
        return res.json(
            {
                success: false,
                message: "User not exist!"
            }
        )
    }

    if (newpassword !== confirmpassword) {
        return res.json(
            {
                success: false,
                message: "New password and confirm password is not match"
            }
        )
    }

    user.password = newpassword
    await user.save();

    res.json(
        {
            success:true,
            message: "Password updated successfully"
        }
    )

})

export default router