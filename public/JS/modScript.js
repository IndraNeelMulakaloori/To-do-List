/*Function : submitBtn
  Args : btnid
  Changes the visibility of submit btn.
*/
function submitBtn(btnid) {
    var chngDisp = document.getElementById(btnid);
  
    if (chngDisp.style.display === "none") {
      chngDisp.style.display = "block";
    } 
    
    else {
      chngDisp.style.display = "none";
    }
  }
/*Function : modItem
  Args : valueid ,btnid
  TOggles the input field when a edit btn is triggered
*/
function modItem(valueId,btnid){
    var toggleMod =  document.getElementById(valueId);

    if(toggleMod.hasAttribute('disabled')){
    toggleMod.toggleAttribute('disabled',false);
    submitBtn(btnid);
    }

    else {
     submitBtn(btnid);
    toggleMod.toggleAttribute('disabled',true);
    }
 }
/*Function : modItem
  Args : textid ,btnid
  Changes the modifyvalue field and posts the value to app.js
*/
 function submitValue(textId, btnid){
  
    var changeVal = document.getElementById(textId);
    var submitVal = document.getElementsByName("modifyvalue");
    submitVal[btnid].value = changeVal.value;

    var form = document.getElementsByName("modForm");
    form[btnid].submit();
}