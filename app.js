//jshint esversion : 8
const express = require('express');
const bodyParser = require('body-parser');
const calendars = require(__dirname + "/calendar.js");
const mongoose = require('mongoose');


// importing a class from module and using methods
const calendar = calendars.Cal;
const cal = new calendar();
const day = cal.getDay();
const year = cal.getYear();


const app = express();

const port = 3000;

const days = ["Sun","Mon","Tues","Wednes","Thurs","Fri","Satur"];

//Storing the to-do list tasks in an array

// const items = [];

// const workItems = [];

//Creating and Connecting to MongoDB

const mongoDBName = "todolistDB";
mongoose.connect("mongodb://localhost:27017/" + mongoDBName);

const itemSchema = mongoose.Schema({
      name : String,
});

//for static content
app.use(express.static(__dirname + "/public"));

//set express to use ejs view engine
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended : true}));

app.listen(port , function(request,response)
{
       console.log("server started at " + port);
});

//Date notification



app.get("/",function(request,myServerResponse)
{    
       
         
         //render client-side html using ejs template engine
        myServerResponse.render('list', {
                    kindOfDay : day, 
                    newListItem : items,
                    listType : "Personal List",
                    thisYear : year ,
                    });

});

//This Post request receives data  from both the routes 
// and redirects to their respective routes
// according to the list Type
app.post("/",function(request,myServerResponse)
{

  

    const item = request.body.newItem;
    
     if(request.body.list === 'Work')
     {
         workItems.push(item);
         myServerResponse.redirect("/work");
     }
     
     else{
        items.push(item);
        myServerResponse.redirect("/");
        }
    

    // newListitem isn't defined as we aren't passing this in get method
    //We can't even pass it  in get method as item isn't initalised/posted
    //This is a problem of scope

//     myServerResponse.render('list' , {
//            newListItem : item,
//     }); 


     
});

app.get("/work",function(request,myServerResponse)
{
    myServerResponse.render('list', {
        kindOfDay : day, 
        newListItem : workItems,
        listType : 'Work List',
        thisYear : year,
        });

});

// app.post("/work",function(request,myServerResponse)
// {
//               const item = request.body.newItem;

//             workItems.push(item);
//             myServerResponse.redirect("/work");
// });