const Contact = require('../models/Contact');
const { metrics } = require('../metrics/prometheus');

const contactController = {
  // Get contacts with pagination
  getContacts: async (req, res) => {
    const startTime = Date.now();
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Contact.countDocuments();

      metric("find contacts", startTime);

      res.json({
        contacts,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalContacts: total
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Search contacts
  searchContacts: async (req, res) => {
    const startTime = Date.now();
    try {
      const { query } = req.query;
      const contacts = await Contact.find({
        $or: [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { phoneNumber: { $regex: query, $options: 'i' } }
        ]
      }).limit(10);

      metric("search contact", startTime);

      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add contact
  addContact: async (req, res) => {
    const startTime = Date.now();
    try {
      const newContact = new Contact(req.body);
      const savedContact = await newContact.save();

      metric("add contacts", startTime);

      res.status(201).json(savedContact);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Edit contact
  editContact: async (req, res) => {
    const startTime = Date.now();
    try {
      const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedContact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      metric("edit contact", startTime);

      res.json(updatedContact);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete contact
  deleteContact: async (req, res) => {
    const startTime = Date.now();
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      metric("delete contact", startTime)
      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

const metric = (operation, startTime) => {
  metrics.databaseOperationDuration
    .labels(operation)
    .observe((Date.now() - startTime) / 1000);
}

module.exports = contactController;