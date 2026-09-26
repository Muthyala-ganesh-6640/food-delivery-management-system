const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getUsers,
  toggleBlockUser,
  approveRestaurant,
  suspendRestaurant,
  getAdminDeliveryPartners,
  approveDeliveryPartner,
  getAdminReports,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);

router.put('/restaurants/:id/approve', approveRestaurant);
router.put('/restaurants/:id/suspend', suspendRestaurant);

router.get('/delivery-partners', getAdminDeliveryPartners);
router.put('/delivery-partners/:id/approve', approveDeliveryPartner);

router.get('/reports', getAdminReports);

module.exports = router;
