import authService from "../services/auth.service.js";

class AuthController {

  async login(req, res, next) {

    try {

      const {username,password} = req.body;

      const result = await authService.login( username, password);
      return res.status(200).json({success: true,data: result});

    } catch (error) {
      next(error);
    }
  }


  async health(req, res) {

    return res.status(200).json({
      success: true,
      service: "auth-service",
      status: "UP"
    });
  }
}

export default new AuthController();