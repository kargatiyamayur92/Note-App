import express from "express";
import { UserModel } from "../model/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";
import nodemailer from 'nodemailer';

export const registerUser = async (req, res) => {
    try {
        console.log("register api working")
        const transpoter = nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMIAL_PASSWORD,
                }
            }
        )


        let { fullname, email, mobileno, password, confirmpassword } = req.body;

        if (password !== confirmpassword) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Pasword is invalid"
                }
            )
        }

        let user = await UserModel.findOne({ email });

        if (user) {
            return res.json(
                {
                    success: false,
                    message: 'User aleready exist'
                }

            );
        }

        let newUser = await UserModel.create({
            fullname,
            email,
            mobileno,
            password,
        })

        res.json(
            {
                success: true,
                message: "User account created successfully"
            }
        )
        const mailOption = {
            from: process.env.EMAIL,
            to: email,
            subject: `Welcome to ${fullname}! Your account is ready`,
            html: ` 
                <h2>Hi,</h2>
                <h2>Dear ${fullname},</h2>
                <p style="text-wrap : wrap; font-size:1rem;">Thank you for registering! Your account successfully created. </p>
                <p style="text-wrap : wrap; font-size:1rem; ">You can now log in your account and access your profile, explore our features, and manage your setting. </p>
                <p style="text-wrap : wrap; font-size:1rem; ">Here, your account deatails for refreance : </p>
                <h3> Website : Note app</h3>
                <h3> Full name : ${fullname} </h3>
                <h3> Email : ${email} </h3>
                
            `
        };


        transpoter.sendMail(mailOption)
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                res.json(
                    {
                        success: false,
                        message: `Email not send for creating user`
                    }
                )
            })
    }
    catch (err) {
        res.status(500).json(
            {
                success: false,
                message: err.message
            }
        )
    }
}

export const loginUser = async (req, res) => {
    try {
        let { emailOrUsername, password } = req.body;

        let user = await UserModel.findOne({ email: emailOrUsername });

        if (!user) {
            return res.json(
                {
                    success: false,
                    message: "User not exist",
                }
            )
        }

        let isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json(
                {
                    success: false,
                    message: "Invalid Password",
                }
            )
        }

        let token = await jwt.sign(
            {
                id: user._id,
                username: user.fullname,
                email: user.email,
                profilepic: user.profilepic,
            },
            process.env.JWT_SECRET
        )
        if (token) {
            res.cookie('token', token);
        }
        res.status(201).json(
            {
                success: true,
                message: "You can login"
            }
        )
    } catch (error) {
        res.json(error)
    }

}

export const logout = async (req, res) => {
    try {
        let token = await req.cookies.token;
        res.cookie('token', '');
        res.json(
            {
                success: true,
                message: "Successfully logout",
            }
        )
    } catch (error) {
        console.log("Error from logout : ", error);
    }

}

export const passwordupdate = async (req, res) => {
    try {
        let { oldpassword, newpassword } = req.body;
        let user_cooki = await req.user;
        let user = await UserModel.findOne({ _id: user_cooki.id });

        let cheackpassword = await bcrypt.compare(oldpassword, user.password)
        if (!cheackpassword) {
            return res.json(
                {
                    success: false,
                    message: 'Password inccorect'
                }
            )

        }

        user.password = newpassword
        user.save()
        res.json(
            {
                success: true,
                message: 'Password successfully changed'
            }
        )

    } catch (error) {
        console.log("Error throw from password update: ", error)
    }
}