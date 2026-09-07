import Auth from "../models/auth.model.js";

class AuthRepository {

  async findByUsername(username) {
    return Auth.findOne({ username });
  }

  async findByUserId(userId) {
    return Auth.findOne({ userId });
  }

  async create(credentials) {
    return Auth.create(credentials);
  }

  async updateByUserId(userId, data) {
    return Auth.findOneAndUpdate(
      { userId },
      { $set: data },
      {
        new: true,
        upsert: true
      }
    );
  }

  async existsByUsername(username) {
    const user = await Auth.exists({ username });
    return !!user;
  }
}

export default new AuthRepository();