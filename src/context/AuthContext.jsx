import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth Context with a default value.
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  token: null,
  isAuthReady: false, // NEW: Indicates if the initial auth check is complete
  login: () => {},
  logout: () => {},
  updateUser: () => {}
});

// Create a custom hook to use the Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth Provider component to wrap your application
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // NEW STATE

  // On initial load, try to restore auth state from session storage
  useEffect(() => {
    const storedToken = sessionStorage.getItem('jwtToken');
    const storedUser = sessionStorage.getItem('user'); // This should store the JSON string of the user object

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // CRITICAL: Parse the stored user string back into an object
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log("AuthContext: Restored session. User object:", parsedUser);
      } catch (e) {
        console.error("AuthContext: Failed to parse stored user data from session storage:", e);
        // Clear corrupted data if parsing fails
        sessionStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
    }
    setIsAuthReady(true); // Mark auth check as complete
    console.log("AuthContext: Initial auth check complete.");
  }, []); // Empty dependency array means this runs only once on mount

  const login = (jwtToken, userToStore) => {
    setToken(jwtToken);
    setUser(userToStore); // userToStore is already an object from backend response
    setIsAuthenticated(true);
    sessionStorage.setItem('jwtToken', jwtToken);
    sessionStorage.setItem('user', JSON.stringify(userToStore)); // CRITICAL: Stringify the user object before storing
    console.log("AuthContext: User logged in. Stored user object:", userToStore);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.clear(); // Clear all auth related session storage
    console.log("AuthContext: User logged out.");
  };

  const updateUser = (newUserData) => {
    setUser(prevUser => {
      // Merge new data with existing user data
      const updatedUser = { ...prevUser, ...newUserData };
      // Ensure essential fields like token and userId are not lost if newUserData is partial
      // These are already part of the `user` object in AuthContext.
      // The `token` itself is separate in `token` state, not directly in `user` object usually.
      // If `userToStore` from login includes `token` or `userId` and `updateUser` is called with partial,
      // it should ideally preserve `prevUser.token` and `prevUser.userId` if not explicitly updated.
      if (!updatedUser.userId && prevUser.userId) updatedUser.userId = prevUser.userId;


      sessionStorage.setItem('user', JSON.stringify(updatedUser)); // Update stored user data
      console.log("AuthContext: User data updated.", updatedUser.email || updatedUser.id || updatedUser.userId);
      return updatedUser;
    });
  };

  const authContextValue = {
    isAuthenticated,
    user,
    token,
    isAuthReady, // Expose the new state
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
