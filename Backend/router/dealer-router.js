const express = require('express');
const router = express.Router();
const Dealer = require('../model/Dealer');
const { registerDealer,loginDealer, getMechanics,getNotifications, markAsRead, fetchdealerbyId, changepassword } = require('../Controllers/dealercontroller');
const {getServicesByDealer} = require('../Controllers/servicecontroller')




// Route to handle direct creation of Dealer instance



// router.post('/', async (req, res) => {
//     try {
//         const dealer = new Dealer(req.body);
//         await dealer.save();
//         res.status(201).send(dealer);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });






// Route to use the registerDealer controller function
router.post('/register', registerDealer);
router.post('/login', loginDealer);
router.get('/:dealerId/mechanics',getMechanics);
router.get('/:dealerId/notifications',getNotifications);
router.get('/:dealerId/services', getServicesByDealer);
router.patch('/notifications/:notificationId',markAsRead);
router.get('/findbyId/:dealerId', fetchdealerbyId);
router.post('/changepassword', changepassword);
module.exports = router;
