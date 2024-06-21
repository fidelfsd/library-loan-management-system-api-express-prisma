const prisma = require("../../database/prisma/client");

const loanController = {
   create: async function (req, res, next) {
      const { userId, bookId, loanDate, dueDate } = req.body;

      try {
         if (!userId || !bookId || !loanDate || !dueDate) {
            return res.status(400).json({
               message: "Invalid fields",
            });
         }

         await prisma.loan.create({
            data: {
               userId: Number(userId),
               bookId: Number(bookId),
               loanDate: new Date(loanDate),
               dueDate: new Date(dueDate),
            },
         });

         res.json({
            message: "Loan created successfully",
         });
      } catch (e) {
         next(e);
      }
   },

   getAll: async function (req, res, next) {
      try {
         const loans = await prisma.loan.findMany({
            include: {
               user: {
                  select: {
                     name: true,
                     email: true,
                  },
               },
               book: {
                  select: {
                     title: true,
                  },
               },
            },
         });

         res.status(200).json(loans);
      } catch (e) {
         next(e);
      }
   },

   getById: async function (req, res, next) {
      const loanId = req.params.id;

      try {
         const loan = await prisma.loan.findUnique({
            where: { id: Number(loanId) },
            include: {
               user: {
                  select: {
                     name: true,
                     email: true,
                  },
               },
               book: {
                  select: {
                     title: true,
                  },
               },
            },
         });

         if (!loan) {
            return res.status(404).json({
               message: "Loan not found",
            });
         }

         res.json(loan);
      } catch (e) {
         next(e);
      }
   },

   update: async function (req, res, next) {
      const loanId = req.params.id;
      const { returnDate, ...loanData } = req.body;

      try {
         await prisma.loan.update({
            where: { id: Number(loanId) },
            data: {
               ...loanData,
               returnDate: returnDate ? new Date(returnDate) : undefined,
            },
         });

         res.json({
            message: "Loan updated successfully",
         });
      } catch (e) {
         next(e);
      }
   },

   delete: async function (req, res, next) {
      const loanId = req.params.id;

      try {
         await prisma.loan.delete({
            where: { id: Number(loanId) },
         });

         res.json({
            message: "Loan deleted successfully",
         });
      } catch (e) {
         next(e);
      }
   },
};

module.exports = loanController;
