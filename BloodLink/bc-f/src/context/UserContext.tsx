// UserContext.jsx (or UserContext.tsx)

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Create a context for the user
export const UserContext = createContext(null);
// Create a custom hook to use the context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("bloodlink_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const signOut = () => {
    setUser(null); // Clear the user state
  };

  useEffect(() => {
    // Update localStorage whenever user changes
    if (user) {
      localStorage.setItem("bloodlink_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("bloodlink_user");
    }
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
