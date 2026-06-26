import mongoose from 'mongoose'

const ConnectDB = (async ()=>{
    await mongoose.connect(`${process.env.URI}/${process.env.DBNAME}`)
    .then(()=>{
        console.log(`Database run at ${process.env.URI}`)
    })
    .catch((Error)=>{
        console.log("ERROR : ",Error)
    })
})

export default ConnectDB