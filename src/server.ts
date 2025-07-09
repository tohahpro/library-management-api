import {Server} from 'http';
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


let server : Server;

const PORT = process.env.PORT;

async function main() {
    try {

        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.nhyw7dy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`);  

        server = app.listen(PORT, ()=>{
            console.log(`Example app listening on port ${PORT}`);            
        })
    } catch (error) {
        console.log(error);
        
    }
}

main();