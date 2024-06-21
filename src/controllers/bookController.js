const { Prisma } = require("@prisma/client");
const prisma = require("../../database/prisma/client");

const bookController = {
   create: async function (req, res, next) {
      const { title, gender, authorId } = req.body;

      try {
         if (!title || !gender || !authorId) {
            return res.status(400).json({
               message: "Invalid fields",
            });
         }

         await prisma.book.create({
            data: {
               title,
               gender,
               authorId: Number(authorId),
            },
         });

         res.json({
            message: "Book created successfully",
         });
      } catch (e) {
         next(e);
      }
   },

   getAll: async function (req, res, next) {
      try {
         const books = await prisma.book.findMany();

         res.status(200).json(books);
      } catch (e) {
         next(e);
      }
   },

   getById: async function (req, res, next) {
      const bookId = req.params.id;

      try {
         const book = await prisma.book.findUnique({
            where: { id: Number(bookId) },
            include: {
               author: {
                  select: {
                     name: true,
                     nationality: true,
                  },
               },
            },
         });

         if (!book) {
            return res.status(404).json({
               message: "Book not found",
            });
         }

         res.json(book);
      } catch (e) {
         next(e);
      }
   },

   update: async function (req, res, next) {
      const bookId = req.params.id;
      const bookData = req.body;

      try {
         await prisma.book.update({
            where: { id: Number(bookId) },
            data: bookData,
         });

         res.json({
            message: "Book updated successfully",
         });
      } catch (e) {
         next(e);
      }
   },

   delete: async function (req, res, next) {
      const bookId = req.params.id;

      try {
         await prisma.book.delete({
            where: { id: Number(bookId) },
         });

         res.json({
            message: "Book deleted successfully",
         });
      } catch (e) {
         next(e);
      }
   },
};

module.exports = bookController;
