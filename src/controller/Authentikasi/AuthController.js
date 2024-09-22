import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleError } from "../../utils/errorHandler.js";
import prisma from "../../config/prisma.js";


const JWT_SECRET = process.env.JWT_SECRET;

export const handleLogin = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          id: true,
          username: true,
          password: true,
          token: true,
          role: true,
          status: true,
        },
      });
  
      if (!findUser) {
        return res.status(400).json({ message: "Username atau password salah" });
      }
  
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Username atau password salah" });
      }
  
      if (findUser.token === null) {
        const token = jwt.sign(
          { id: findUser.id, username: findUser.username },
          JWT_SECRET,
          { expiresIn: "3d" }
        );
  
        await prisma.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            token: token,
            status: true,
          },
        });
      }
      await prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: {
          status: true,
        },
      });
  
      const userUpdate = await prisma.user.findUnique({
        where: {
          id: findUser.id,
        },
        select: {
          id: true,
          username: true,
  
          token: true,
          role: true,
          status: true,
        },
      });
  
      return res.status(200).json({
        message: "Login successful",
        data: {
          user: userUpdate,
        },
      });
    } catch (error) {
      handleError(res, error);
    }
  };


  
export const handleRegister = async (req, res) => {
    const { username, password, role = "admin" } = req.body;

  
    if (!username || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const findUser = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (findUser) {
        return res.status(400).json({ message: "Username sudah digunakan" });
      }
  
      const createUser = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          role: role,
        },
      });
  
      return res
        .status(200)
        .json({ message: "User created successfully", data: createUser });
    } catch (error) {
      handleError(res, error);
    }
  };
  
  export const checkLogin = async (req, res) => {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Silahkan Login" });
    }
    try {
      const findUser = await prisma.user.findFirst({
        where: {
          token: token,
        },
        select: {
          id: true,
          email: true,
          username: true,
          token: true,
          status: true,
          avatar: true,
          role: true,
        },
      });
  
      if (!findUser) {
        return res.status(401).json({ message: "Silahkan Login" });
      }
  
      return res.status(200).json({ data: findUser });
    } catch (error) {
      handleError(res, error);
    }
  };
  

  
export const handleLogout = async (req, res) => {
    const { token } = req.body;
    console.log(token);
    if (!token) {
      return res.status(400).json({ message: "not login" });
    }
    try {
      const findUser = await prisma.user.findFirst({
        where: {
          token: token,
        },
      });
      if (!findUser) {
        return res.status(401).json({ message: "not tidak ditemukan" });
      }
  
      await prisma.user.update({
        where: {
          id: findUser.id,
        },
        data: {
          token: null,
          status: false,
        },
      });
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      handleError(res, error);
    }
  };


  