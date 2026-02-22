import { createContext, useContext, useState, useCallback } from 'react';
import {
  mockUsers,
  mockListings as initialListings,
  mockApplications as initialApplications,
  mockFavorites as initialFavorites,
  mockMessages as initialMessages,
  mockReviews as initialReviews,
  mockReports as initialReports,
  getUserById,
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Auth state - default logged in as Maria (student) for demo
  const [currentUser, setCurrentUser] = useState(mockUsers[2]); // Maria Santos
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Data state
  const [listings, setListings] = useState(initialListings);
  const [applications, setApplications] = useState(initialApplications);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [messages, setMessages] = useState(initialMessages);
  const [reviews, setReviews] = useState(initialReviews);
  const [reports, setReports] = useState(initialReports);

  // Auth actions
  const login = useCallback((userId) => {
    const user = getUserById(userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  // Listing actions
  const addListing = useCallback((listing) => {
    const newListing = {
      ...listing,
      id: listings.length + 1,
      ownerId: currentUser.id,
      status: 'available',
      verified: false,
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
    };
    setListings(prev => [...prev, newListing]);
    return newListing;
  }, [listings.length, currentUser]);

  const updateListing = useCallback((id, updates) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);

  // Application actions
  const submitApplication = useCallback((application) => {
    const newApp = {
      ...application,
      id: applications.length + 1,
      applicantId: currentUser.id,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setApplications(prev => [...prev, newApp]);
    return newApp;
  }, [applications.length, currentUser]);

  const updateApplicationStatus = useCallback((id, status) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  // Favorite actions
  const toggleFavorite = useCallback((listingId) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.userId === currentUser.id && f.listingId === listingId);
      if (exists) {
        return prev.filter(f => !(f.userId === currentUser.id && f.listingId === listingId));
      }
      return [...prev, { userId: currentUser.id, listingId }];
    });
  }, [currentUser]);

  const isFavorite = useCallback((listingId) => {
    return favorites.some(f => f.userId === currentUser?.id && f.listingId === listingId);
  }, [favorites, currentUser]);

  // Message actions
  const sendMessage = useCallback((receiverId, listingId, content) => {
    const newMsg = {
      id: messages.length + 1,
      senderId: currentUser.id,
      receiverId,
      listingId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, [messages.length, currentUser]);

  // Review actions
  const addReview = useCallback((review) => {
    const newReview = {
      ...review,
      id: reviews.length + 1,
      reviewerId: currentUser.id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [...prev, newReview]);
    return newReview;
  }, [reviews.length, currentUser]);

  // Derived data
  const myListings = listings.filter(l => l.ownerId === currentUser?.id);
  const myApplications = applications.filter(a => a.applicantId === currentUser?.id);
  const receivedApplications = applications.filter(a => {
    const listing = listings.find(l => l.id === a.listingId);
    return listing && listing.ownerId === currentUser?.id;
  });
  const myFavoriteListings = listings.filter(l =>
    favorites.some(f => f.userId === currentUser?.id && f.listingId === l.id)
  );

  const getConversationsForUser = useCallback((userId) => {
    const userMessages = messages.filter(m => m.senderId === userId || m.receiverId === userId);
    const otherUserIds = [...new Set(userMessages.map(m => m.senderId === userId ? m.receiverId : m.senderId))];
    return otherUserIds.map(otherId => {
      const msgs = messages.filter(
        m => (m.senderId === userId && m.receiverId === otherId) ||
             (m.senderId === otherId && m.receiverId === userId)
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const lastMsg = msgs[msgs.length - 1];
      const unread = msgs.filter(m => m.receiverId === userId && !m.read).length;
      return {
        otherUserId: otherId,
        otherUser: getUserById(otherId),
        lastMessage: lastMsg,
        unreadCount: unread,
        messages: msgs,
      };
    }).sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));
  }, [messages]);

  const unreadMessageCount = messages.filter(m => m.receiverId === currentUser?.id && !m.read).length;

  const value = {
    // Auth
    currentUser,
    isAuthenticated,
    login,
    logout,
    allUsers: mockUsers,
    // Listings
    listings,
    myListings,
    addListing,
    updateListing,
    // Applications
    applications,
    myApplications,
    receivedApplications,
    submitApplication,
    updateApplicationStatus,
    // Favorites
    favorites,
    myFavoriteListings,
    toggleFavorite,
    isFavorite,
    // Messages
    messages,
    sendMessage,
    getConversationsForUser,
    unreadMessageCount,
    // Reviews
    reviews,
    addReview,
    // Reports
    reports,
    // Helpers
    getUserById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
