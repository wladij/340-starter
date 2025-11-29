// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const { body } = require('express-validator');
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// NEW: route for vehicle detail by inventory id
router.get("/detail/:invId", invController.buildByInvId)

// NEW: intentional error route (for Task 3)
router.get("/cause-error", invController.throwError)

// route for management view 
router.get(
    "/",
    utilities.handleErrors(invController.buildManagement)
);

// GET form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// POST with server validation
router.post(
  "/add-classification",
  [
    body("classification_name")
      .trim()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification must be letters and numbers only, no spaces or special characters.")
      .isLength({ min: 1 }).withMessage("Classification name is required.")
  ],
  utilities.handleErrors(invController.addClassification)
);

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.post('/add-inventory',
  [
    body('classification_id').notEmpty().withMessage('Select a classification'),
    body('inv_make').trim().isLength({ min: 1 }).withMessage('Make is required'),
    body('inv_model').trim().isLength({ min: 1 }).withMessage('Model is required'),
    body('inv_year').isInt({ min: 1900, max: 2100 }).withMessage('Enter a valid year'),
    body('inv_price').isFloat({ min: 0 }).withMessage('Enter a valid price'),
    body('inv_miles').isInt({ min: 0 }).withMessage('Enter valid mileage'),
    body('inv_color').trim().isLength({ min: 1 }).withMessage('Color is required'),
  ],
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;