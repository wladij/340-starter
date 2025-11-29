const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator");

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function (req, res, next) {
  try {
    const invId = parseInt(req.params.invId, 10)
    if (Number.isNaN(invId)) {
      const err = new Error("Invalid inventory ID")
      err.status = 400
      throw err
    }

    const vehicleData = await invModel.getVehicleById(invId)
    if (!vehicleData) {
      const err = new Error("Vehicle not found")
      err.status = 404
      throw err
    }

    // Build HTML using the utility function
    const detailHTML = await utilities.buildDetailView(vehicleData)

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav: await utilities.getNav(),
      detail: detailHTML
    })
  } catch (error) {
    next(error)
  }
}



invCont.throwError = function (req, res, next) {
  // create an error and pass to next() to trigger error middleware
  const err = new Error("Intentional 500 error for testing")
  err.status = 500
  next(err)
}

/* ****************************************
 * Deliver inventory management view
 * ****************************************/
invCont.buildManagement= async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  });
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
}

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const errors = validationResult(req);
  let nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
    });
  }

  try {
    await invModel.addClassification(classification_name);
    req.flash("notice", `Classification "${classification_name}" added.`);
    // regenerate nav and render management so new classification shows up
    nav = await utilities.getNav();
    return res.status(201).render("inventory/management", { title: "Inventory Management", nav });
  } catch (err) {
    next(err);
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null
  });
}

invCont.addInventory = async function (req, res, next) {
  const errors = validationResult(req);
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(req.body.classification_id);

  if (!errors.isEmpty()) {
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      // sticky values: pass back the fields so the form keeps them
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
        inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
    });
  }

  try {
    await invModel.addInventory(
      req.body.inv_make, req.body.inv_model, req.body.inv_year, req.body.inv_description,
      req.body.inv_image || '/images/no-image-available.png',
      req.body.inv_thumbnail || '/images/no-image-available-tn.png',
      req.body.inv_price, req.body.inv_miles, req.body.inv_color, req.body.classification_id
    );

    req.flash("notice", "Inventory item added.");
    nav = await utilities.getNav();
    res.render("inventory/management", { title: "Inventory Management", nav });
  } catch (err) {
    next(err);
  }
}

module.exports = invCont