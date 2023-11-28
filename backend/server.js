const { connect } = require("mongoose");
const app = require ("./app");
const connectDatabase = require("./db/database");
//Handling unaught Exception 
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`shutting down the server for handling uncaught exception`);
});
//config
if(process.env.NODE_ENV!== "PRODUCTION"){
    require("dotenv").config({
    path:"backend/config/.env"
    });
}
//connect db
connectDatabase()

console.log("PORT from env:", process.env.PORT);
// const PORTNUMBER = process.env.PORT
//create server
const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT} `);
});
//unhandled promise rejection 
process.on("unhandledRejection",(err)=>{
    console.log(`shutting down the server for ${err.message}`);
    console.log("shutting down the server for unhandle promise rejection")
    server.close(()=>{
        process.exit(1);
    });
});


