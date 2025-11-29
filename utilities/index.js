const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
    let data = await invModel.getClassifications()
    //console.log(data.rows)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



Util.formatCurrencyUSD = function (value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

Util.formatNumberWithCommas = function (value) {
  return new Intl.NumberFormat('en-US').format(value)
}

/* **************************************
* Build vehicle detail view HTML (string)
* ************************************ */
Util.buildDetailView = async function(vehicle) {
  let detail = ""

  if (vehicle) {
    detail = '<section id="inv-detail">'

    // Vehicle Image
    detail += '<div class="inv-detail-image">'
    detail += '<img src="' + vehicle.inv_image + '" alt="Image of ' 
             + vehicle.inv_make + ' ' + vehicle.inv_model + ' full size" />'
    detail += '</div>'

    // Vehicle Info
    detail += '<div class="inv-detail-info">'
    detail += '<h2>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' 
            + vehicle.inv_model + '</h2>'

    detail += '<span class="price">$' 
            + new Intl.NumberFormat("en-US").format(vehicle.inv_price)
            + '</span>'

    detail += '<ul class="inv-detail-list">'
    detail += '<li><strong>Mileage:</strong> ' 
            + new Intl.NumberFormat("en-US").format(vehicle.inv_miles) 
            + ' miles</li>'
    detail += '<li><strong>Year:</strong> ' + vehicle.inv_year + '</li>'
    detail += '<li><strong>Make:</strong> ' + vehicle.inv_make + '</li>'
    detail += '<li><strong>Model:</strong> ' + vehicle.inv_model + '</li>'
    detail += '<li><strong>Color:</strong> ' + vehicle.inv_color + '</li>'
    detail += '<li><strong>Description:</strong> ' + vehicle.inv_description + '</li>'
    detail += '</ul>'

    detail += '</div>' // close info
    detail += '</section>' // close main section
  } 
  else {
    detail = '<p class="notice">Vehicle not found.</p>'
  }

  return detail
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

module.exports = Util