// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// NEW: route for vehicle detail by inventory id
router.get("/detail/:invId", invController.buildByInvId)

// NEW: intentional error route (for Task 3)
router.get("/cause-error", invController.throwError)


module.exports = router;