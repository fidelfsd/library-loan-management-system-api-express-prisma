module.exports = (...allowedRoles) => {
   return (req, res, next) => {
      const userRoleName = req.tokenData.userRoleName;

      // Roles that always have access
      const adminGroupRoles = ["admin"];

      // Check if the user's role grants access
      const isAdmin = adminGroupRoles.includes(userRoleName);
      const isAllowedRole = allowedRoles.includes(userRoleName);

      // Determine if the user has access
      const hasAccess = isAdmin || isAllowedRole;

      // If the user has access, proceed to the next middleware
      if (hasAccess) {
         return next();
      }

      // If the user does not have access, reject the request
      res.status(403).json({
         message: "Unauthorized access",
      });
   };
};
