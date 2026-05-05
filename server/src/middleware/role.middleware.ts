import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'You do not have permission to access this resource' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        error: 'Internal Server Error', 
        message: 'Role verification failed' 
      });
    }
  };
};
