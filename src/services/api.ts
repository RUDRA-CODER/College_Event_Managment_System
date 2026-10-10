import { getAuthHeaders } from './auth';

let _API_BASE = 'http://localhost:5000/api';

if (typeof window !== 'undefined') {
    _API_BASE = 'http://localhost:5000/api';
} else {
    if (process.env.NEXT_PUBLIC_API_URL) {
        _API_BASE = process.env.NEXT_PUBLIC_API_URL;
    }
}

export const API_BASE = _API_BASE;

export class ApiError extends Error {
    public status: number;
    public data: any;
    
    constructor(message: string, status: number = 500, data: any = null) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}

const handleResponse = async (res: Response, defaultErrorMsg: string) => {
    let json;
    try {
        json = await res.json();
    } catch (e) {
        if (!res.ok) {
            throw new ApiError(defaultErrorMsg, res.status);
        }
        return null;
    }

    if (!res.ok) {
        let errorMsg = json?.message || defaultErrorMsg;
        
        // Sanitize raw technical errors
        if (errorMsg.includes('E11000') || errorMsg.includes('duplicate key')) {
            errorMsg = 'This record already exists.';
        } else if (res.status === 401) {
            errorMsg = 'You must be logged in to perform this action.';
        } else if (res.status === 403) {
            errorMsg = 'You do not have permission to perform this action.';
        } else if (res.status === 404) {
            errorMsg = 'The requested resource could not be found.';
        } else if (res.status === 429) {
            errorMsg = 'Too many requests. Please try again later.';
        } else if (res.status >= 500) {
            errorMsg = 'An unexpected server error occurred. Please try again later.';
        }

        throw new ApiError(errorMsg, res.status, json);
    }
    
    return json;
};

export const fetchEvents = async () => {
    const res = await fetch(`${API_BASE}/events`, { 
        cache: 'no-store',
        headers: {
            ...getAuthHeaders()
        }
    });
    const json = await handleResponse(res, 'Failed to fetch events');
    return json.data;
};

export const fetchEventById = async (id: string) => {
    const res = await fetch(`${API_BASE}/events/${id}`, { 
        cache: 'no-store',
        headers: {
            ...getAuthHeaders()
        }
    });
    const json = await handleResponse(res, 'Failed to fetch event');
    return json.data;
};

export const fetchMyRegistrations = async () => {
    const res = await fetch(`${API_BASE}/registrations/me`, { 
        cache: 'no-store',
        headers: {
            ...getAuthHeaders()
        }
    });
    const json = await handleResponse(res, 'Failed to fetch registrations');
    
    return json.data;
};

export const createRegistration = async (eventId: string, customData?: any) => {
    const payload = {
        eventId,
        customData
    };
    
    const res = await fetch(`${API_BASE}/registrations`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
    });
    const json = await handleResponse(res, 'Failed to create registration');
    return json.data;
};

export const registerStudent = async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/student/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const json = await handleResponse(res, 'Failed to register');
    return json;
};

export const verifyEmail = async (data: { email: string, otp: string }) => {
    const res = await fetch(`${API_BASE}/auth/student/verify-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const json = await handleResponse(res, 'Failed to verify email');
    return json;
};

export const loginStudent = async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/student/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const json = await handleResponse(res, 'Failed to login');
    return json;
};

export const fetchMyStudentProfile = async () => {
    const res = await fetch(`${API_BASE}/auth/student/profile`, {
        cache: 'no-store',
        headers: {
            ...getAuthHeaders()
        }
    });
    const json = await handleResponse(res, 'Failed to fetch student profile');
    return json.data;
};

export const updateStudentProfile = async (profileData: any) => {
    const res = await fetch(`${API_BASE}/auth/student/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(profileData)
    });
    const json = await handleResponse(res, 'Failed to update student profile');
    return json.data;
};

export const changeStudentPassword = async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/student/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });
    const json = await handleResponse(res, 'Failed to change password');
    return json;
};
