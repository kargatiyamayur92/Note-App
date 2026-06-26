import express, { Router } from 'express'
const router = express.Router();
import { UserModel } from '../model/user.model.js';
import { loginUser, logout, passwordupdate, registerUser } from '../controller/Authentication.controller.js';
import { isLoggedin } from '../middleware/isLoggedin.middleware.js';
import multer from 'multer';

import upload from '../config/multer.config.js';
import { getpic, Updateprofilepic, usernameChange } from '../controller/profileimage.controller.js';
import bcrypt from 'bcrypt'




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

export default router