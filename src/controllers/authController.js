const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../database/prisma/client");

const authController = {
   register: async (req, res, next) => {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({ message: "Invalid registration fields" });
      }

      try {
         const hashedPassword = bcrypt.hashSync(password, 10);

         const user = await prisma.user.create({
            data: {
               name,
               email,
               password: hashedPassword,
               roleId: 3,
            },
         });

         res.json({ message: `User registered successfully`, id: user.id });
      } catch (e) {
         if (e.code === "P2002") {
            return res.status(400).json({ message: "Email already registered" });
         }
         next(e);
      }
   },

   login: async (req, res, next) => {
      try {
         const { email, password } = req.body;

         if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
         }

         const user = await prisma.user.findFirst({
            include: { role: true },
            where: { email },
         });

         if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: "Invalid email or password" });
         }

         const tokenPayload = {
            userId: user.id,
            userRoleName: user.role.name,
         };

         const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
            expiresIn: "3h",
         });

         res.json({ token });
      } catch (e) {
         next(e);
      }
   },
};

module.exports = authController;
