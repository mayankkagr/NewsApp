import bcrypt from "bcryptjs";
import authRepository from "../repositories/auth.repository.js";
import { generateToken } from "../utils/jwt.js";

class AuthService {

  async login(username, password) {

    if (!username || !password) {
      const error = new Error("Username and password are required");
      error.statusCode = 400;
      throw error;
    }

    const authUser = await authRepository.findByUsername(username);

    if (!authUser) {
      const error = new Error( "Invalid username or password" );
      error.statusCode = 401;
      throw error;
    }
    const passwordValid = await bcrypt.compare(password, authUser.passwordHash );
    console.log(passwordValid);
    if (!passwordValid) {
      const error = new Error( "Invalid password" );
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      userId: authUser.userId,
      username: authUser.username
    });

    return {
      token,
      expiresIn:
        process.env.JWT_EXPIRES_IN || "1h",

      user: {
        id: authUser.userId,
        username: authUser.username
      }
    };
  }


  async createCredentials( userId, username, password) {

    if (!userId || !username || !password) {
      const error = new Error("userId, username and password are required");
      error.statusCode = 400;
      throw error;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const existing = await authRepository.findByUserId(userId);
    if (existing) {
      return authRepository.updateByUserId(
        userId,
        {
          username,
          passwordHash
        }
      );
    }

    return authRepository.create({
      userId,
      username,
      passwordHash
    });
  }
}

export default new AuthService();