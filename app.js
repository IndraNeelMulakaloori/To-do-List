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

const days = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"];

//Storing the to-do list tasks in an array

// const items = [];

// const workItems = [];

//Creating and Connecting to MongoDB

const mongoDBName = "todolistDB";
mongoose.connect("mongodb://localhost:27017/" + mongoDBName);

//Defining a Schema
const itemSchema = new mongoose.Schema({
    name: String,
});

//CustomList Schema
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema],
});

//Creating a model from Schema
const Item = new mongoose.model("item", itemSchema);

const List = new mongoose.model("list", listSchema);

// const firstItem = new Item({
//     name: "Eat"
// });

// const secondItem = new Item({
//     name: "Sleep"
// });

// const thirdItem = new Item({
//     name: "Code",
// });

const defaultItems = [{
        name: "Eat"
    },
    {
        name: "Sleep"
    },
    {
        name: "Code"
    },
    {
        name: "Repeat"
    }
];


//for static content
app.use(express.static(__dirname + "/public"));

//set express to use ejs view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(port, function (request, response) {
    console.log("server started at " + port);
});

//Date notification



app.get("/", function (request, myServerResponse) {
    //Using Mongoose to read and represent data
    Item.find({}, function (err, items) {
        if (err)
            console.log(err);
        else {
            //This code checks if the returned data is empty([]),
            //Then Insert the data into the DB.
            //This is due to avoid insertion of duplicate data while restarting the server constantly.
            if (items.length === 0) {
                Item.insertMany(defaultItems, function (err) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Inserted data Succesfully");
                    myServerResponse.redirect("/");
                });
            } else {
                //Else this Data will render the data to The list.ejs file
                myServerResponse.render('list', {
                    kindOfDay: day,
                    newListItem: items,
                    listType: "Personal List",
                    thisYear: year,
                });
            }
        }

    });
    //render client-side html using ejs template engine


});


app.get("/:listType", function (request, myServerResponse) {

    const listTypeName = request.params.listType;
    List.findOne({
        name: listTypeName
    }, function (err, result) {
        if (err)
            console.log(err);
        else {
            if (result != null) {
                myServerResponse.render('list', {
                    kindOfDay: day,
                    newListItem: result.items,
                    listType: listTypeName + " List",
                    thisYear: year,
                });
            } else {
                const listName = new List({
                    name: listTypeName,
                    items: defaultItems,
                });
                listName.save();
                console.log("New List " + listTypeName + " Created succesfully");
                myServerResponse.redirect("/" + listTypeName);
            }

        }
    });


});

//This Post request receives data  from both the routes 
// and redirects to their respective routes
// according to the list Type
app.post("/", function (request, myServerResponse) {

    //Post-Data from FORM and Inserting into dataBase i.e todolistDB 
    const itemName = request.body.newItem;
    const itemDoc = new Item({
        name: itemName,
    });
    itemDoc.save();

    myServerResponse.redirect("/");

    // if (request.body.list === 'Work') {
    //     workItems.push(item);
    //     myServerResponse.redirect("/work");
    // } else {
    //     items.push(item);
    //     myServerResponse.redirect("/");
    // }


    // newListitem isn't defined as we aren't passing this in get method
    //We can't even pass it  in get method as item isn't initalised/posted
    //This is a problem of scope

    //     myServerResponse.render('list' , {
    //            newListItem : item,
    //     }); 



});


app.post("/delete", function (request, myServerResponse) {
    //Post-ItemId from the Form to /Delete route
    const deleteID = request.body.deleteItem;

    //Find the itemID and delete it from Db
    Item.findByIdAndRemove(deleteID, function (err) {
        if (err)
            console.log(err);
        else
            console.log("The item " + deleteID + " was removed succesfully");
    });
    myServerResponse.redirect("/");
});



// app.post("/work",function(request,myServerResponse)
// {
//               const item = request.body.newItem;

//             workItems.push(item);
//             myServerResponse.redirect("/work");
// });