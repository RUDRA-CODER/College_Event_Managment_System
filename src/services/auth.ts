export const AUTH_TOKEN_KEY = 'auth_token';

export const setToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
};

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }
};

export const getAuthHeaders = (): Record<string, string> => {
    const token = getToken();
    if (token) {
        return {
            'Authorization': `Bearer ${token}`
        };
    }
    return {};
};

export const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const getCurrentUser = () => {
    const token = getToken();
    if (token) {
        const decoded = parseJwt(token);
        if (decoded) {
            const id = decoded.userId || decoded.id;
            return {
                ...decoded,
                id,
                userId: id
            };
        }
    }
    return null;
};
