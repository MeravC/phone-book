const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContact } = require('../middleware/validate');

router.get('/', contactController.getContacts);
router.get('/search', contactController.searchContacts);
router.post('/', validateContact, contactController.addContact);
router.put('/:id', validateContact, contactController.editContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;