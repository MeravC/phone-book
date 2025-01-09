const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Contact = require('../src/models/contact');

let mongoServer;
let app;

beforeAll(async () => {
  // Create an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Set test environment variables
  process.env.PORT = 3000;
  process.env.MONGODB_URI = mongoUri;
  
  // Import app after setting environment variables
  app = require('../src/server');
});

beforeEach(async () => {
  // Clear the database before each test
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Contact API', () => {
  describe('GET /api/contacts - Pagination Tests', () => {
    it('should return first page with default limit of 10 contacts', async () => {
      // Create 15 test contacts
      const contacts = Array.from({ length: 15 }, (_, i) => ({
        firstName: `User${i}`,
        lastName: `Test${i}`,
        phoneNumber: `123456789${i}`,
        address: `Address ${i}`
      }));
      
      await Contact.create(contacts);

      const res = await request(app)
        .get('/api/contacts')
        .expect(200);

      expect(res.body.contacts).toHaveLength(10);
      expect(res.body.totalPages).toBe(2);
      expect(res.body.currentPage).toBe(1);
      expect(res.body.totalContacts).toBe(15);
    });

    it('should return second page with remaining contacts', async () => {
      // Create 15 test contacts
      const contacts = Array.from({ length: 15 }, (_, i) => ({
        firstName: `User${i}`,
        lastName: `Test${i}`,
        phoneNumber: `123456789${i}`,
        address: `Address ${i}`
      }));
      
      await Contact.create(contacts);

      const res = await request(app)
        .get('/api/contacts?page=2')
        .expect(200);

      expect(res.body.contacts).toHaveLength(5);
      expect(res.body.currentPage).toBe(2);
    });

    it('should return empty array for page beyond available contacts', async () => {
      const res = await request(app)
        .get('/api/contacts?page=5')
        .expect(200);

      expect(res.body.contacts).toHaveLength(0);
      expect(res.body.totalContacts).toBe(0);
    });
  });

  describe('GET /api/contacts/search', () => {
    beforeEach(async () => {
      await Contact.create([
        {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          address: '123 Main St'
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          phoneNumber: '0987654321',
          address: '456 Oak Ave'
        },
        {
          firstName: 'Bob',
          lastName: 'Smith',
          phoneNumber: '5555555555',
          address: '789 Pine Rd'
        }
      ]);
    });

    it('should find contacts by first name', async () => {
      const res = await request(app)
        .get('/api/contacts/search?query=John')
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].firstName).toBe('John');
    });

    it('should find contacts by last name', async () => {
      const res = await request(app)
        .get('/api/contacts/search?query=Doe')
        .expect(200);

      expect(res.body).toHaveLength(2);
    });

    it('should find contacts by phone number', async () => {
      const res = await request(app)
        .get('/api/contacts/search?query=555')
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].phoneNumber).toBe('5555555555');
    });

    it('should return empty array when no matches found', async () => {
      const res = await request(app)
        .get('/api/contacts/search?query=NonExistent')
        .expect(200);

      expect(res.body).toHaveLength(0);
    });
  });

  describe('POST /api/contacts', () => {
    it('should create a new contact with valid data', async () => {
      const newContact = {
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        address: '123 Test St'
      };

      const res = await request(app)
        .post('/api/contacts')
        .send(newContact)
        .expect(201);

      expect(res.body.firstName).toBe(newContact.firstName);
      expect(res.body.lastName).toBe(newContact.lastName);
    });

    it('should reject contact with missing required fields', async () => {
      const invalidContact = {
        firstName: 'Test',
        // missing lastName
        phoneNumber: '1234567890',
        address: '123 Test St'
      };

      const res = await request(app)
        .post('/api/contacts')
        .send(invalidContact)
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });

    it('should reject contact with invalid phone number format', async () => {
      const invalidContact = {
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: 'invalid-phone',
        address: '123 Test St'
      };

      const res = await request(app)
        .post('/api/contacts')
        .send(invalidContact)
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/contacts/:id', () => {
    let contactId;

    beforeEach(async () => {
      const contact = await Contact.create({
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        address: '123 Test St'
      });
      contactId = contact._id;
    });

    it('should update an existing contact', async () => {
      const updatedData = {
        firstName: 'Updated',
        lastName: 'Name',
        phoneNumber: '0987654321',
        address: '456 New St'
      };

      const res = await request(app)
        .put(`/api/contacts/${contactId}`)
        .send(updatedData)
        .expect(200);

      expect(res.body.firstName).toBe(updatedData.firstName);
      expect(res.body.lastName).toBe(updatedData.lastName);
    });

    it('should return 404 for non-existent contact', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .put(`/api/contacts/${fakeId}`)
        .send({
          firstName: 'Updated',
          lastName: 'Name',
          phoneNumber: '0987654321',
          address: '456 New St'
        })
        .expect(404);
    });
  });

  describe('DELETE /api/contacts/:id', () => {
    let contactId;

    beforeEach(async () => {
      const contact = await Contact.create({
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        address: '123 Test St'
      });
      contactId = contact._id;
    });

    it('should delete an existing contact', async () => {
      await request(app)
        .delete(`/api/contacts/${contactId}`)
        .expect(200);

      // Verify contact is deleted
      const contact = await Contact.findById(contactId);
      expect(contact).toBeNull();
    });

    it('should return 404 for non-existent contact', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/api/contacts/${fakeId}`)
        .expect(404);
    });
  });
});