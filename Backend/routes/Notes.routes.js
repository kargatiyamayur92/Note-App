import express, { Router } from 'express'
const router = express.Router();
import { isLoggedin } from '../middleware/isLoggedin.middleware.js';
import { CreateNote, editeNote, moveBin, permenentdelete, pinnotes, premenentdeleteAll, restore, shownotes } from '../controller/Notes.controller.js';
import { UserModel } from '../model/user.model.js';
import { NoteModel } from '../model/note.model.js';
import { loginUser } from '../controller/Authentication.controller.js';


router.post('/createNote', isLoggedin, CreateNote);

//send notes data
router.get('/showdata', isLoggedin, shownotes)

//delete notes and remove refrence from user.notes array
router.post('/deletenote/:id', isLoggedin, moveBin);

//edite perticuler note
router.put('/editeNote/:id', isLoggedin, editeNote)

//pin note
router.put('/pin/:id', isLoggedin, pinnotes)

//restore note from bin
router.put('/restore/:id', isLoggedin, restore)

//permenent delete only one
router.delete('/premenentdelete/:id', isLoggedin, permenentdelete)

//permenent delete every note
router.delete('/premenentdeleteAll', isLoggedin, premenentdeleteAll)

export default router



