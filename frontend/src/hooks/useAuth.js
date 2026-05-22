import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser(token);
  }, []);

  // Called after Google redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, '', '/');
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUser(data);
  };

  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const saveDeal = async (offerId) => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    const isAlreadySaved = user.savedDeals?.some(d => (d._id || d) === offerId);
    const method = isAlreadySaved ? 'DELETE' : 'POST';

    // Optimistic update
    const updatedSavedDeals = isAlreadySaved
      ? user.savedDeals.filter(d => (d._id || d) !== offerId)
      : [...(user.savedDeals || []), { _id: offerId }];

    setUser(prev => prev ? { ...prev, savedDeals: updatedSavedDeals } : null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/save-deal/${offerId}`, {
        method: method,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUser(token);
      } else {
        fetchUser(token);
      }
    } catch (err) {
      console.error("Error saving deal:", err);
      fetchUser(token);
    }
  };

  return { user, login, logout, saveDeal };
};