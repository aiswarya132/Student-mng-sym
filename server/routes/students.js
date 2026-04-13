const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentsController");

router.get("/", studentController.apiList);
router.get("/:id", studentController.apiGetById);
router.post("/", studentController.apiCreate);
router.put("/:id", studentController.apiUpdate);
router.delete("/:id", studentController.apiDelete);

module.exports = router;
