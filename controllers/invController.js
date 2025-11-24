const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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

module.exports = invCont