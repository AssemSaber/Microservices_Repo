import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000 
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('profile');
        window.location.href = '/login?session_expired=true';
      }
      if (error.response.status === 403) {
        window.location.href = '/?error=forbidden';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Authentication ====================
export const signIn = (formData) => API.post('/auth/login', formData);
export const signUp = (formData) => API.post('https://localhost:44357/api/Auth/register', formData);
export const verifyToken = () => API.get('/auth/verify');
export const verifyLandlord = () => API.get('/landlord/verify');
export const verifyAdmin = () => API.get('/admin/verify');
export const verifyTenant = () => API.get('/tenant/verify');
export const logout = () => API.post('/auth/logout');
export const requestPasswordReset = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => API.post('/auth/reset-password', { token, newPassword });

// ==================== Properties ====================
export const fetchProperties = (searchParams = {}) => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  return API.get(`https://localhost:44357/api/Tenant/all-posts`, { params });
};

export const fetchProperty = (id) => API.get(`https://localhost:44357/api/Landlord/get-post/${id}`);
export const createProperty = (propertyData) => {
  const formData = new FormData();
  Object.entries(propertyData).forEach(([key, value]) => {
    if (key === 'images') {
      value.forEach(img => formData.append('images', img));
    } else {
      formData.append(key, value);
    }
  });
  return API.post(`https://localhost:44357/api/Landlord/create-post/${landlordId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateProperty = (id, propertyData) => {
  const formData = new FormData();
  Object.entries(propertyData).forEach(([key, value]) => {
    if (key === 'images') {
      value.forEach(img => formData.append('images', img));
    } else if (key === 'existingImages') {
      value.forEach(img => formData.append('existingImages', img));
    } else {
      formData.append(key, value);
    }
  });
  return API.patch(`/properties/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteProperty = (id) => API.delete(`https://localhost:44357/api/Landlord/delete-post/${postId}`);
export const incrementPropertyViews = (id) => API.put(`/properties/${id}/views`);


// ==================== Property Status Management ====================
export const updatePropertyStatus = (id, status, transactionData = {}) => {
  return API.patch(`/properties/${id}/status`, { status, ...transactionData });
};

export const markAsSold = (id, buyerId, salePrice) => {
  return updatePropertyStatus(id, 'sold', { buyerId, salePrice });
};

export const markAsRented = (id, tenantId, rentPrice) => {
  return updatePropertyStatus(id, 'rented', { tenantId, rentPrice });
};

export const reopenProperty = (id) => {
  return updatePropertyStatus(id, 'available');
};

export const getPropertyStatusHistory = (id) => {
  return API.get(`/properties/${id}/status-history`);
};


// // ==================== Advanced Property Search ====================
// export const searchProperties = ({
//   minPrice,
//   maxPrice,
//   location,
//   propertyType,
//   bedrooms,
//   bathrooms,
//   amenities,
//   sortBy = 'createdAt',
//   sortOrder = 'desc',
//   page = 1,
//   limit = 10,
//   status = 'available'
// }) => {
//   const params = new URLSearchParams();
  
//   if (minPrice) params.append('minPrice', minPrice);
//   if (maxPrice) params.append('maxPrice', maxPrice);
//   if (location) params.append('location', location);
//   if (propertyType) params.append('propertyType', propertyType);
//   if (bedrooms) params.append('bedrooms', bedrooms);
//   if (bathrooms) params.append('bathrooms', bathrooms);
//   if (amenities) params.append('amenities', amenities.join(','));
//   if (sortBy) params.append('sortBy', sortBy);
//   if (sortOrder) params.append('sortOrder', sortOrder);
//   if (page) params.append('page', page);
//   if (limit) params.append('limit', limit);
//   if (status) params.append('status', status);

//   return API.get('/properties/search', { params });
// };

// export const searchPropertiesByPriceRange = (minPrice, maxPrice) => {
//   return API.get('/properties/search', {
//     params: {
//       minPrice,
//       maxPrice,
//       sortBy: 'price',
//       sortOrder: 'asc'
//     }
//   });
// };

// export const searchPropertiesByLocation = (location) => {
//   return API.get('/properties/search', {
//     params: { location }
//   });
// };

// export const getPropertyFilters = () => {
//   return API.get('/properties/filters');
// };

// export const getPopularSearches = () => {
//   return API.get('/properties/popular-searches');
// };

// export const getRecentSearches = () => {
//   return API.get('/users/me/recent-searches');
// };

// export const saveSearch = (searchParams) => {
//   return API.post('/users/me/saved-searches', searchParams);
// };

// export const getSavedSearches = () => {
//   return API.get('/users/me/saved-searches');
// };

// ==================== Saved Properties ====================
export const saveProperty = (id) => API.post(`/properties/${id}/save`);
export const unsaveProperty = (id) => API.delete(`/properties/${id}/save`);
export const fetchSavedProperties = () => API.get('/properties/saved');
export const checkSavedStatus = (id) => API.get(`/properties/${id}/saved-status`);

// ==================== Proposals & Applications ====================
export const submitProposal = (id, proposalData) => {
  const requestData = {
    name: proposalData.name,
    email: proposalData.email,
    phone: proposalData.phone,
    message: proposalData.message,
    passportPhoto: proposalData.passportPhoto || null,
    documents: proposalData.documents || []
  };

  return API.post(`/properties/${id}/proposals`, requestData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const fetchProposals = (id) => API.get(`/properties/${id}/proposals`);

export const fetchMyProposals = () => API.get('/proposals/me');

export const fetchLandlordProposals = () => API.get('/landlord/proposals');

export const respondToProposal = (id, action) => 
  API.patch(`/proposals/${id}`, { action });

export const cancelProposal = (id) => API.delete(`/proposals/${id}`);

export const acceptProposalAndUpdateProperty = (proposalId) => 
  API.patch(`/proposals/${proposalId}/accept-and-update`);

// ==================== Comments ====================
export const fetchPropertyComments = (id) => API.get(`/properties/${id}/comments`);
export const addPropertyComment = (id, comment) => API.post(`/properties/${id}/comments`, { text: comment });
export const deleteComment = (id) => API.delete(`/comments/${id}`);

// ==================== Messages ====================

export const fetchConversations = () => API.get('/api/messages/conversations');
export const fetchMessages = (conversationId) => API.get(`/api/messages/${conversationId}`);
export const sendMessage = (messageData) => API.post('/api/messages/send', messageData);

export const startNewConversation = (recipientId, message) =>
  API.post('/api/messages/new', { recipientId, text: message });
export const markAsRead = (conversationId) =>
  API.patch(`/api/messages/${conversationId}/read`);

export const getUnreadCount = () => API.get('/api/messages/unread-count');


// ==================== User Management ====================
export const fetchUserProfile = () => API.get('/users/me');
export const updateProfile = (profileData) => {
  const formData = new FormData();
  Object.entries(profileData).forEach(([key, value]) => {
    if (key === 'avatar' && value) {
      formData.append('avatar', value);
    } else {
      formData.append(key, value);
    }
  });
  return API.patch('/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadDocuments = (documents) => {
  const formData = new FormData();
  documents.forEach(doc => formData.append('documents', doc));
  return API.post('/users/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


// ==================== Transactions ====================
export const createTransaction = (transactionData) => API.post('/transactions', transactionData);
export const getPropertyTransactions = (propertyId) => API.get(`/properties/${propertyId}/transactions`);
export const getUserTransactions = () => API.get('/users/transactions');


// ==================== Admin ====================
export const fetchPendingLandlords = () => API.get('/admin/pending-landlords');
export const fetchPendingProperties = () => API.get(`https://localhost:44357/api/admin/waitinPosts`);
export const fetchLandlordApplication = (id) => API.get(`/admin/landlord-applications/${id}`);
export const approveLandlord = (id) => API.put(`https://localhost:44357/api/admin/accept-waiting-landlord/${id}`);
export const rejectLandlord = (id) => API.put(`https://localhost:44357/api/admin/reject-waiting-landlord/${id}`);
export const approveProperty = (id) => API.put(`https://localhost:44357/api/admin/accept-waiting-post/${id}`);
export const rejectProperty = (id) => API.put(`https://localhost:44357/api/admin/reject-waiting-post/${id}`);
export const fetchAllUsers = () => API.get('/admin/users');
export const updateUserStatus = (id, status) => API.patch(`/admin/users/${id}`, { status });
export const fetchDashboardStats = () => API.get('/admin/dashboard/stats');
export const fetchRecentActivity = () => API.get('/admin/dashboard/activity');

// ==================== Tenant ====================
export const fetchTenantDashboard = () => API.get('/tenant/dashboard');
export const fetchTenantApplications = (status) => API.get(`/tenant/applications?status=${status}`);
export const fetchRecentApplications = () => API.get('/tenant/applications/recent');
export const fetchSavedPropertiesPreview = () => API.get('/tenant/saved-properties/preview');

// ==================== Landlord ====================
export const fetchLandlordDashboard = () => API.get('/landlord/dashboard');
export const fetchLandlordProperties = (status) => API.get(`/landlord/properties?status=${status}`);
export const fetchLandlordStats = () => API.get('/landlord/dashboard/stats');
export const fetchLandlordActivity = () => API.get('/landlord/dashboard/activity');

export default API;