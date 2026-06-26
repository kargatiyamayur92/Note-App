import fs from 'fs'
import { UserModel } from '../model/user.model.js';


export const Updateprofilepic = async (req, res) => {
    let user = await UserModel.findOne({ _id: req.user.id });
    let oldimagepath = user.profilepic;
    if (fs.existsSync(`public/images/${oldimagepath}`)) {
        fs.unlink(`public/images/${oldimagepath}`, err => {
            if (err) {
                console.log("Delete err: ", err);
            }
            else {
                console.log("Deleted image path");
            }
        })
    }

    user.profilepic = req.file.filename;
    await user.save();

    res.json(
        {
            success: true,
            file: req.file,
            username: user.fullname
        }
    )
}


export const getpic = async (req, res) => {
    let user = await UserModel.findOne({ _id: req.user.id });
    let profilepic = user.profilepic;

    res.json(
        {
            success: true,
            profilepic: `public/images/${profilepic}`
        }
    )
}

export const usernameChange = async (req, res) => {
    try {
        let data = await req.body;
        if (!data.username) {
            return res.send(
                {
                    success: false,
                    message: 'first you enter your username !!!'
                }
            )
        }
        let user_cooki = await req.user;
        let user = await UserModel.findOne({ _id: user_cooki.id });

        user.fullname = data.username
        user.save()

        res.send(
            {
                success: true,
                message: 'Username or Fullname updated'
            }
        )
    } catch (error) {
        console.log("Error throw from username change : ", error)
    }
}