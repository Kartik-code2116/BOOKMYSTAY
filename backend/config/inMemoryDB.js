// In-memory fallback for when MongoDB is not available
// This allows the app to work for development/testing without MongoDB

class InMemoryDB {
  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.nextId = 1;
  }

  generateId() {
    return String(this.nextId++);
  }

  // User operations
  async createUser(userData) {
    const id = this.generateId();
    const user = {
      id,
      _id: id,
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id) {
    return this.users.get(String(id)) || null;
  }

  async updateUser(id, updates) {
    const user = this.users.get(String(id));
    if (!user) return null;
    Object.assign(user, updates, { updated_at: new Date() });
    return user;
  }

  // Property operations
  async createProperty(propertyData) {
    const id = this.generateId();
    const property = {
      id,
      _id: id,
      ...propertyData,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.properties.set(id, property);
    return property;
  }

  async findPropertyById(id) {
    return this.properties.get(String(id)) || null;
  }

  async findAllProperties() {
    return Array.from(this.properties.values());
  }

  async findPropertiesByHost(hostId) {
    return Array.from(this.properties.values()).filter(p => p.host_id === hostId);
  }

  async updateProperty(id, updates) {
    const property = this.properties.get(String(id));
    if (!property) return null;
    Object.assign(property, updates, { updated_at: new Date() });
    return property;
  }

  async deleteProperty(id) {
    return this.properties.delete(String(id));
  }

  // Booking operations
  async createBooking(bookingData) {
    const id = this.generateId();
    const booking = {
      id,
      _id: id,
      ...bookingData,
      status: bookingData.status || 'pending',
      created_at: new Date(),
      updated_at: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async findBookingById(id) {
    return this.bookings.get(String(id)) || null;
  }

  async findBookingsByGuest(guestId) {
    return Array.from(this.bookings.values()).filter(b => b.guest_id === guestId);
  }

  async findBookingsByHost(hostId) {
    return Array.from(this.bookings.values()).filter(b => b.host_id === hostId);
  }

  async updateBooking(id, updates) {
    const booking = this.bookings.get(String(id));
    if (!booking) return null;
    Object.assign(booking, updates, { updated_at: new Date() });
    return booking;
  }

  // Review operations
  async createReview(reviewData) {
    const id = this.generateId();
    const review = {
      id,
      _id: id,
      ...reviewData,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async findReviewsByProperty(propertyId) {
    return Array.from(this.reviews.values()).filter(r => r.property_id === propertyId);
  }

  getStats() {
    return {
      users: this.users.size,
      properties: this.properties.size,
      bookings: this.bookings.size,
      reviews: this.reviews.size
    };
  }
}

export const inMemoryDB = new InMemoryDB();
export default inMemoryDB;
