//jshint esversion : 8
const today = new Date();
class cal{

    constructor()
    {
     const options = { 
         weekday: 'short', 
         year: 'numeric',
         month: 'short', 
         day: 'numeric'
         };
    }
      getDay()
     {
        return today.toLocaleDateString("en-IN",this.options);
         
     }
        getYear()
        {
            return today.getFullYear();
         
        }
 
 }

 //Exporting a class as a module
 module.exports = {Cal : cal};









