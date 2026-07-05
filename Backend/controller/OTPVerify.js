import express from "express";
import { UserModel } from '../model/user.model.js'
import bcrypt, { genSalt, hash } from 'bcrypt'
import nodemailer from 'nodemailer'

const generateotp = () => {
    return Math.floor(200000 + Math.random() * 800000).toString()
}

export const sendOTP = async (req, res) => {
    try {
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

        bcrypt.hash(otp, 10, async (err, encryptOTP) => {
            user.resetOTP = encryptOTP;
            user.otpExpiry = Date.now() + 30 * 1000;
            await user.save();
        })

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
    } catch (error) {
        console.log("Error throw from sendOTP api : ", error)
    }
}

export const verifyOTP = async (req, res) => {
    try {
        let { otpemail, otp } = req.body;
        let user = await UserModel.findOne({ email: otpemail });
        if (!user) {
            return res.json(
                {
                    success: false,
                    message: "User not exist!"
                }
            )
        }

        if (user.otpExpiry < Date.now()) {
            return res.json(
                {
                    success: false,
                    message: "OTP was expaired"
                }
            )
        }

        bcrypt.compare(otp, user.resetOTP,async (err, result) => {
            if (!result) {
                res.send(
                    {
                        success: false,
                        message: "OTP does not match !!"
                    }
                )
            }
            else {
                user.resetOTP = null
                user.otpExpiry = null
                await user.save()

                res.send(
                    {
                        success: true,
                        message: "you can change your password"
                    }
                )
            }
        })


    } catch (error) {
        console.log("Error throw from verify otp api : ", error)
    }
}

export const setPassword = async (req, res) => {
    try {
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
                success: true,
                message: "Password updated successfully"
            }
        )
    } catch (error) {
        console.log("Error throw from setpassword api : ", error)
    }
}