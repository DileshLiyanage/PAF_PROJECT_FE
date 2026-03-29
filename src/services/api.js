import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to attach our Mock Auth headers
api.interceptors.request.use(config => {
    const stored = localStorage.getItem('mockUser');
    if (stored) {
        const user = JSON.parse(stored);
        if (user) {
            config.headers['x-user-id'] = user.id;
            config.headers['x-user-email'] = user.email;
            config.headers['x-user-name'] = user.name;
            config.headers['x-user-role'] = user.role;
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const bookingService = {
    createBooking: (data) => api.post('/bookings', data),
    getMyBookings: () => api.get('/bookings/my'),
    getAllBookings: (filters) => api.get('/bookings', { params: filters }),
    getBookingById: (id) => api.get(`/bookings/${id}`),
    updateStatus: (id, status, rejectionReason) => api.put(`/bookings/${id}/status`, { status, rejectionReason }),
    cancelBooking: (id) => api.delete(`/bookings/${id}`),
    checkIn: (token) => api.post('/bookings/checkin', { token }),
    getAnalytics: () => api.get('/bookings/analytics'),
    checkAvailability: (resourceId, date, startTime, endTime) => 
        api.get('/bookings/check-availability', { params: { resourceId, date, startTime, endTime } })
};

export const resourceService = {
    getResources: () => api.get('/resources')
};

export default api;
