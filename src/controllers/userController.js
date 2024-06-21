const bcrypt = require("bcrypt");
const prisma = require("../../database/prisma/client");
const { exclude } = require("../helpers/utils");
const { Prisma } = require("@prisma/client");

const userController = {
   getAll: async function (req, res, next) {
      try {
         const users = await prisma.user.findMany();

         const usersWithExcludeFields = users.map((user) => exclude(user, ["password"]));

         res.json(usersWithExcludeFields);
      } catch (e) {
         next(e);
      }
   },

   getById: async function (req, res, next) {
      const userId = req.params.id;

      try {
         const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: {
               role: {
                  select: {
                     name: true,
                  },
               },
            },
         });

         if (!user)
            return res.status(404).json({
               message: "User not found",
            });

         // if (!user)
         //    throw new Prisma.PrismaClientKnownRequestError("", {
         //       code: "P2001",
         //    });

         const userWithExcludeFields = exclude(user, ["password", "roleId"]);

         res.json(userWithExcludeFields);
      } catch (e) {
         next(e);
      }
   },

   update: async function (req, res, next) {
      const userId = req.params.id;
      const { password, roleId, ...restUserData } = req.body;

      try {
         const hashedPassword = password ? bcrypt.hashSync(password, 10) : undefined;

         await prisma.user.update({
            where: { id: Number(userId) },
            data: {
               password: hashedPassword,
               ...restUserData,
            },
         });

         res.json({ message: "User updated successfully" });
      } catch (e) {
         next(e);
      }
   },

   delete: async function (req, res, next) {
      const userId = req.params.id;

      try {
         await prisma.user.delete({
            where: {
               id: Number(userId),
            },
         });

         res.json({ message: "User deleted successfully" });
      } catch (e) {
         next(e);
      }
   },

   getLoansByUserId: async function (req, res, next) {
      try {
         const userId = req.params.id;

         const user = await prisma.user.findFirst({
            where: { id: Number(userId) },
            include: {
               loans: {
                  select: {
                     loanDate: true,
                     dueDate: true,
                     returnDate: true,
                     book: true,
                  },
               },
            },
         });

         if (!user) {
            return res.status(404).json({ message: "User not found" });
         }

         if (user.loans.length == 0) {
            return res.status(404).json({ message: "No loans found for user" });
         }

         res.json(user.loans);
      } catch (e) {
         next(e);
      }
   },

   getUserFavoriteBooks: async function (req, res, next) {
      try {
         const userId = req.tokenData.userId;

         const user = await prisma.user.findFirst({
            where: { id: Number(userId) },

            include: {
               favoriteBooks: {
                  select: {
                     book: true,
                  },
               },
            },
         });

         if (user.favoriteBooks.length == 0) {
            return res.status(404).json({ message: "No favorite books found for user" });
         }

         res.json(user.favoriteBooks);
      } catch (e) {
         next(e);
      }
   },

   addFavoriteBookToUser: async function (req, res, next) {
      const userId = req.tokenData.userId;
      const bookId = req.body.bookId;

      try {
         const existingFavorite = await prisma.favoriteBook.findUnique({
            where: {
               user_book_unique: { userId: Number(userId), bookId: Number(bookId) },
            },
         });

         if (existingFavorite) {
            return res.status(400).json({ message: "Book already in favorites list" });
         }

         const favoriteBook = await prisma.favoriteBook.create({
            data: {
               userId: Number(userId),
               bookId: Number(bookId),
            },
         });

         res.json({
            message: "Book added to favorites list",
            bookId: favoriteBook.bookId,
         });
      } catch (e) {
         next(e);
      }
   },

   removeFavoriteBookFromUser: async function (req, res, next) {
      const userId = req.tokenData.userId;
      const bookId = req.body.bookId;

      try {
         // With explicit many-to-many relation you can just delete from the table that represents the relation
         await prisma.favoriteBook.delete({
            where: {
               // unique key
               user_book_unique: {
                  userId: Number(userId),
                  bookId: Number(bookId),
               },
            },
         });

         res.json({ message: "Book removed from favorites list" });
      } catch (e) {
         next(e);
      }
   },

   getUserProfile: async function (req, res, next) {
      const userId = req.tokenData.userId;

      try {
         const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
         });

         const userWithExcludeFields = exclude(user, [
            "password",
            "createdAt",
            "updatedAt",
         ]);

         res.json(userWithExcludeFields);
      } catch (e) {
         next(e);
      }
   },

   updateUserProfile: async function (req, res, next) {
      const userId = req.tokenData.userId;
      const { password, roleId, ...restUserData } = req.body;

      try {
         const hashedPassword = password ? bcrypt.hashSync(password, 10) : undefined;

         await prisma.user.update({
            where: { id: Number(userId) },
            data: {
               password: hashedPassword,
               ...restUserData,
            },
         });

         res.json({ message: "User updated successfully" });
      } catch (e) {
         next(e);
      }
   },

   getUserLoans: async function (req, res) {
      try {
         const userId = req.tokenData.userId;

         const user = await prisma.user.findFirst({
            where: { id: Number(userId) },
            include: {
               loans: {
                  select: {
                     id: true,
                     loanDate: true,
                     dueDate: true,
                     returnDate: true,
                     book: true,
                  },
               },
            },
         });

         if (!user) {
            return res.status(404).json({ message: "User not found" });
         }

         if (user.loans.length == 0) {
            return res.status(404).json({ message: "No loans found for user" });
         }

         res.json(user.loans);
      } catch (e) {
         next(e);
      }
   },
};

module.exports = userController;
