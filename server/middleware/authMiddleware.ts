import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/EventService';

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

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const id = token.replace('mock-jwt-token-', '');
    
    // For mock auth, we determine role by checking ID prefix
    const role = id.startsWith('admin') ? 'admin' : 'coordinator';
    
    req.user = { id, role };
  }
  
  next();
};

export const requireAdminAccess = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
  return next();
};

export const requireCoordinatorEventAccess = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Admin access (placeholder for future admin role)
  if (req.user.role === 'admin') {
    return next();
  }

  // Coordinator access
  if (req.user.role === 'coordinator') {
    let eventId = req.params.id || req.body.eventId || req.query.eventId;
    
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
