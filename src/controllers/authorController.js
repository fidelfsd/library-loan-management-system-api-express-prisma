const { Prisma } = require("@prisma/client");
const prisma = require("../../database/prisma/client");

const authorController = {
   create: async function (req, res, next) {
      const { name, nationality } = req.body;

      try {
         if (!name || !nationality) {
            return res.status(400).json({
               message: "Invalid fields",
            });
         }

         await prisma.author.create({
            data: {
               name,
               nationality,
            },
         });

         res.json({
            message: "Author created successfully",
         });
      } catch (e) {
         next(e);
      }
   },

   getAll: async function (req, res, next) {
      try {
         const authors = await prisma.author.findMany();

         res.status(200).json(authors);
      } catch (e) {
         next(e);
      }
   },

   getById: async function (req, res, next) {
      const authorId = req.params.id;

      try {
         const author = await prisma.author.findUnique({
            where: { id: Number(authorId) },
            include: {
               books: {
                  select: {
                     title: true,
                  },
               },
            },
         });

         if (!author) {
            return res.status(404).json({
               message: "Author not found",
            });
         }

         res.json(author);
      } catch (e) {
         next(e);
      }
   },

   update: async function (req, res, next) {
      try {
         const authorId = req.params.id;
         const authorData = req.body;

         await prisma.author.update({
            where: { id: Number(authorId) },
            data: authorData,
         });

         res.json({
            message: "Author updated successfully",
         });
      } catch (e) {
         next(e);
      }
   },

   delete: async function (req, res, next) {
      const authorId = req.params.id;

      try {
         await prisma.author.delete({
            where: { id: Number(authorId) },
         });

         res.json({
            message: "Author deleted successfully",
         });
      } catch (e) {
         next(e);
      }
   },
};

module.exports = authorController;
