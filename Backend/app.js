import express from 'express'
import dotenv from 'dotenv'
import ConnectDB from './db/index.js';
import cookieParser from 'cookie-parser';
import UserRouter from './routes/User.routes.js'
import NoteRouter from './routes/Notes.routes.js'
import path from 'path'
const app = express();
dotenv.config({
    path: './.env'
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/public', express.static('public'));

app.use('/api/user',UserRouter);
app.use('/api/notes',NoteRouter);



ConnectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at ${process.env.PORT}`);
        })
    })
    .catch((Error)=>{
        console.log("Data base connection Faild : ",Error);
    })


