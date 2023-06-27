const express = require("express");
const bodyparser = require("body-parser");
const requiest = require("request");
const https = require("https");
const { stringify } = require("querystring");
const { response } = require("express");
const api = require(__dirname+"/api.js");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));

// static file
app.use(express.static("public"));

app.get("/",(req,res)=>{
    // res.sendFile(__dirname+"/style.css");
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",(req,res)=>{
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME :firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    const jsondata = JSON.stringify(data);
    const url = `https:/us11.api.mailchimp.com/3.0/lists/${api.unique_id}`;
    const options = {
        method:"POST",
        auth:`aman1:${api.api}`
    }

    const request = https.request(url,options,(response)=>{

        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })

    })



    request.write(jsondata);

   request.end();   
})

app.post("/failure",(req,res)=>{
    res.redirect("/");
})

app.listen(3000,()=>{
    console.log("server is running");
});

