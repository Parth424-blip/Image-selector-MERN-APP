import React, { useEffect, useState } from "react";
import { fetchCurrentUser } from "./api";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";

function App() {
  const [user, setUser] = useState(undefined); // undefined while loading

  useEffect(() => {
    async function init() {
      try {
        const u = await fetchCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      }
    }
    init();
  }, []);

  if (user === undefined) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <SearchPage />;
}

export default App;
