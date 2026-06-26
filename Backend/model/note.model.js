import mongoose, { mongo } from "mongoose";

const noteSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        },
        isPin: {
            type: Boolean,
        },
        category: {
            type: String,
            default: "Personal"
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        color:{
            type: String,
            default: '#1e293b'
        }
    },
    {
        timestamps: true
    }
)

export const NoteModel = mongoose.model("notes", noteSchema);