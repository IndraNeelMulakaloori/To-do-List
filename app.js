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

//Defining a Schema
const itemSchema = new mongoose.Schema({
      name : String,
});

//Creating a model from Schema
const Item = new mongoose.model("item",itemSchema);

const firstItem = new Item({
      name : "Eat"
});

const secondItem = new Item({
         name : "Sleep"
});

const thirdItem = new Item({
   name : "Code",
});

const defaultItems = [firstItem , secondItem , thirdItem];

// Item.insertMany(defaultItems,function(err)
// {
//        if(err)
//        console.log(err);
//        else 
//        console.log("Inserted data Succesfully");
// });


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
       let i = [];
    Item.find({},function(err,items){
        if(err)
        console.log(err);
        else{
            myServerResponse.render('list', {
                kindOfDay : day, 
                newListItem : items,
                listType : "Personal List",
                thisYear : year ,
                });
        }
   
   });
         //render client-side html using ejs template engine
        

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