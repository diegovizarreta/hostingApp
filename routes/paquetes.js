////////////////////////////////////////////////////////////
////°°-------- P A Q U E T E S   R O U T E S ---------°°////
///////////////////////////////////////////////////////////



const express = require('express');
const router = express.Router();
const passport = require("../helpers/passport")
const User = require("../models/User")
const Partner = require("../models/Partner")
const Paquete = require("../models/Paquete")
const uploadCloud = require('../config/cloudinary.js');


////////////////////////////////////////////
////°°-------- C R E A R   U N --------°°////
////°°-------- P A Q U E T E ----------°°////
////////////////////////////////////////////

router.get("/nuevo-paquete", (req,res,next)=> {
  res.render("paquetes/creaPaquete")
})

router.post("/nuevo-paquete", uploadCloud.single('photo'), (req,res,next) => {
  const {name, price, entrada, platoFuerte, postre, bebida, numPersonas} = req.body
  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  const newPaquete = new Paquete({name, price, entrada, platoFuerte, postre, bebida, numPersonas, imgPath, imgName})
  
  newPaquete.save()
  .then(paquete => {
    res.redirect("/paquetes/lista")
  }).catch(e =>                                                                                                                                                             
    res.send(e))
})


////////////////////////////////////////////
////°°-------- M O S T R A R ---------°°////
////°°-------- P A Q U E T E S--------°°////
////////////////////////////////////////////

router.get("/lista", (req, res,next) => {
  Paquete.find()
  .then(paquetes => {
    const esPartner = req.user.role === "Partner"
    console.log(esPartner)
    res.render("paquetes/lista", {paquetes, esPartner})
  }).catch( e => {
    console.log(e)
    res.send(e)
  })
})


////////////////////////////////////////////
////°°-------- D E T A L L E S -------°°////
////°°-------- P A Q U E T E ---------°°////
////////////////////////////////////////////

router.get("/detallePaquete/:id", (req, res,next) => {
  const {id} = req.params
  Paquete.findById(id)
  .then(paquete => {
    console.log(req.user)
    const esPartner = req.user.role === "Partner"
    res.render("paquetes/detallePaquete", {paquete, esPartner})
  }).catch( e => {
    console.log(e)
    res.send(e)
  })
})


////////////////////////////////////////////
////°°---------- E D I T A R ---------°°////
////°°-------- P A Q U E T E S--------°°////
////////////////////////////////////////////

router.get("/editar/:id", (req, res,next) => {
  
  const {id} = req.params
  Paquete.findById(id)
  .then(paquete => {
    res.render("paquetes/editar", paquete)
  }).catch( e => {
    console.log(e)
    res.send(e)
  })
})

router.post("/editar/:id", (req,res,next) => {
  const {id} = req.params
  console.log(id)
  const {name,price,entrada,platoFuerte,postre,bebida,numPersonas} = req.body

  Paquete.findByIdAndUpdate(id, {$set : {name,price,entrada,platoFuerte,postre,bebida,numPersonas}})
  .then(paquete => {
    res.redirect("/paquetes/lista")
  }).catch( e => {
    console.log(e)
    res.send(e)
  })
})



////////////////////////////////////////////
////°°-------- E L I M I N A R -------°°////
////°°-------- P A Q U E T E S--------°°////
////////////////////////////////////////////

router.get("/eliminar/:id", (req,res,next)=>{
  const {id} = req.params
  Paquete.findByIdAndDelete(id)
  .then(paquete => {
    res.send(`${paquete.name} ha sido eliminado`)
  }).catch(e => {
    console.log(e)
    res.send(e)
  })
})

module.exports = router;
