import express, { Router } from 'express'
import { NoteModel } from "../model/note.model.js";
import jwt from 'jsonwebtoken'
import { UserModel } from '../model/user.model.js';


export const CreateNote = async (req, res) => {
    try {
        let { title, description, category, bgcolor } = req.body;
        let userdetail = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        let user = await UserModel.findOne({ _id: userdetail.id });

        if (!user) {
            return res.json(
                {
                    success: false,
                    message: "User not found"
                }
            )
        }

        let CreateNote = await NoteModel.create({
            title,
            description,
            category,
            userid: user._id,
            color: bgcolor,
        })
        user.notes.push(CreateNote._id);
        await user.save();

        res.json(
            {
                success: true,
                message: "notes add successfully"
            }
        )

    } catch (error) {
        res.json(error);
    }
}

export const shownotes = async (req, res) => {
    try {
        let userID = await req.user.id;

        let data = [];

        let user = await UserModel.findOne({ _id: userID }).populate('notes');
        user.notes.forEach(e => {
            data.push(
                {
                    title: e.title,
                    description: e.description,
                    isPin: e.isPin,
                    DateTime: e.updatedAt,
                    category: e.category,
                    isDeleted: e.isDeleted,
                    id: e._id,
                    color: e.color,
                }
            )
        })

        res.json(
            {
                success: true,
                note: data,
            }
        );
    } catch (error) {
        console.log("Show note api Failed : ", error);
    }
}

export const moveBin = async (req, res) => {
    try {

        let moveBin = await NoteModel.findOne({ _id: req.params.id });


        moveBin.isDeleted = true;
        await moveBin.save()

        res.json(
            {
                success: true,
                message: "Note move to bin 🗑️",
            }
        )
    } catch (error) {
        console.log("Error throw from delete notes : ", error);
    }

}

export const restore = async (req, res) => {
    try {
        let id = req.params.id;

        let user_cooki = await req.user;

        let user = await UserModel.findOne({ _id: user_cooki.id }).populate('notes')

        let deletenote = false

        user.notes.forEach(async (note) => {
            if (note.id === id) {
                note.isDeleted = false
                deletenote = true
                await note.save()
            }
        });

        if (deletenote) {
            res.send(
                {
                    success: true,
                    message: "Successfully note restored",
                }
            )
        }
        else {
            res.send(
                {
                    success: false,
                    message: "Couln not able to restore",
                }
            )
        }
    } catch (error) {
        console.log("Error throw from restore router :  ", error)
    }

}

export const permenentdelete = async (req, res) => {
    try {
        let user_cooki = req.user;
        let user = await UserModel.findOne({ _id: user_cooki.id });

        let deletenote = await NoteModel.findOneAndDelete({ _id: req.params.id });


        user.notes.splice(req.params.id, 1);
        await user.save();

        res.json(
            {
                success: true,
                message: "Note successfully deleted",
            }
        )
    } catch (error) {
        console.log("Error throw from delete notes : ", error);
    }

}
export const premenentdeleteAll = async (req, res) => {
    try {
        let user_cooki = req.user;
        let user = await UserModel.findOne({ _id: user_cooki.id }).populate('notes');

        let deletenotesArray = []

        user.notes.forEach((note) => {
            if (note.isDeleted) {
                deletenotesArray.push({ id: note._id })

            }
        });


        let deletenote = await NoteModel.deleteMany(
            {
                userid: user._id,
                isDeleted: true
            }
        )

        deletenotesArray.forEach(async (noteid) => {
            user.notes.splice(noteid.id, 1)

        })
        await user.save()
        res.json(
            {
                success: true,
                message: "Notes successfully deleted",
            }
        )
    } catch (error) {
        console.log("Error throw from permenant delete all : ")
    }
}

export const editeNote = async (req, res) => {
    try {
        let id = req.params.id;
        let { title, description, bgcolor } = req.body;

        let note = await NoteModel.findOneAndUpdate({ _id: id }, { title, description, color: bgcolor }, { new: true });

        res.json(
            {
                success: true,
                message: "Update successfully",
            }
        )
    } catch (error) {
        console.log("Error throw from edite router : ", error)
    }

}

export const pinnotes = async (req, res) => {
    try {
        let id = req.params.id;
        let user_cooki = await req.user;

        let user = await UserModel.findOne({ _id: user_cooki.id }).populate('notes');


        let isFind = false
        let pin = false

        user.notes.forEach(async (note) => {
            if (note._id == id) {
                isFind = true
                if (note.isPin) {
                    note.isPin = false
                    await note.save()
                }
                else {
                    note.isPin = true,
                        pin = true
                    await note.save()
                }
            }

        });


        if (isFind && pin) {
            res.send(
                {
                    success: true,
                    message: 'Pin Note'
                }
            )
        } else if (isFind && !pin) {
            res.send(
                {
                    success: true,
                    message: 'Unpin Note'
                }
            )
        } else {
            res.send(
                {
                    success: false,
                    message: 'note not found'
                }
            )
        }
    } catch (error) {
        console.log("Error throw from pinnot router : ", error)
    }

}