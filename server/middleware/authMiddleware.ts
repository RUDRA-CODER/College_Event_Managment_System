import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/EventService';
import { verifyToken } from '../utils/auth';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ success: false, message: `Forbidden: ${role} access required` });
    }
    return next();
  };
};

export const requireAdminAccess = (req: Request, res: Response, next: NextFunction): any => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
  return next();
};

export const requireCoordinatorEventAccess = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Admin access
  if (req.user.role === 'admin') {
    return next();
  }

  // Coordinator access
  if (req.user.role === 'coordinator') {
    let eventId = req.params.id || req.body?.eventId || req.query.eventId;
    
    // Specifically handle the /events/:eventId/registrations case where parameter name might be eventId
    if (!eventId && req.params.eventId) {
      eventId = req.params.eventId;
    }
    
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID required for authorization' });
    }

    const eventService = new EventService();
    const event = await eventService.getEventById(eventId as string);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.coordinatorIds && event.coordinatorIds.includes(req.user.id)) {
      return next();
    } else {
      return res.status(403).json({ success: false, message: 'Forbidden: You are not assigned to this event' });
    }
  }

  return res.status(403).json({ success: false, message: 'Forbidden' });
};
