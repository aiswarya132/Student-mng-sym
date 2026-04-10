const express=require("express");
const router=express.Router();
const studentController=require("../controllers/studentsController");

//View All Record //list
router.get("/",studentController.view);

//Add New Records // add page
router.get("/adduser",studentController.adduser)
// save
router.post("/adduser",studentController.save)
// router.get('/', (req,res) =>{
//      res.render("home")
//      });

// Update Records   //edit pg
router.get("/edituser/:id",studentController.edituser);
//update
router.post("/edituser/:id",studentController.edit);

//Delete Records
router.get("/deleteuser/:id",studentController.delete);

 
module.exports=router;     


