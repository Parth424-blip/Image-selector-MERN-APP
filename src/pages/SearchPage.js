import React, { useState, useEffect } from "react";
import {
  fetchTopSearches,
  postSearchTerm,
  fetchUserHistory,
  fetchCurrentUser,
} from "../api";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [searchMessage, setSearchMessage] = useState("");
  const [topSearches, setTopSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch logged-in user info on mount
  useEffect(() => {
    async function getUser() {
      try {
        const u = await fetchCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      }
    }
    getUser();
  }, []);

  // Fetch top searches and user history once user is loaded
  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      try {
        const topRes = await fetchTopSearches();
        setTopSearches(topRes.topSearches || []);

        const historyRes = await fetchUserHistory();
        setSearchHistory(historyRes.history || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const res = await postSearchTerm(searchTerm);
      const imagesData = res.images || [];
      setImages(imagesData);
      setSelectedImages(new Set());
      setSearchMessage(
        `You searched for "${searchTerm}" -- ${imagesData.length} results.`
      );

      const historyRes = await fetchUserHistory();
      setSearchHistory(historyRes.history || []);
    } catch (err) {
      console.error(err);
      setSearchMessage(
        "Error fetching search results or you may not be logged in."
      );
    }
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedImages(newSelected);
  };

  if (user === null) {
    return <p>Please log in to search images.</p>;
  }

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      <div style={{ flex: 3, marginRight: "20px" }}>
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Top Searches: {topSearches.join(", ")}
        </div>

        <form onSubmit={handleSearch} style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", width: "250px", marginRight: "10px" }}
          />
          <button type="submit">Search</button>
        </form>

        {searchMessage && <p>{searchMessage}</p>}

        {images.length > 0 && <p>Selected: {selectedImages.size} images</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          {images.map((img) => (
            <div key={img.id} style={{ position: "relative" }}>
              <img
                src={img.url}
                alt=""
                style={{ width: "100%", height: "auto" }}
              />
              <input
                type="checkbox"
                checked={selectedImages.has(img.id)}
                onChange={() => toggleSelect(img.id)}
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  transform: "scale(1.5)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #ccc",
          paddingLeft: "15px",
          maxHeight: "600px",
          overflowY: "auto",
        }}
      >
        <h3>Your Search History</h3>
        {searchHistory.length === 0 ? (
          <p>No searches yet.</p>
        ) : (
          <ul>
            {searchHistory.map((item, index) => (
              <li key={index}>
                <strong>{item.term}</strong> <br />
                <small>{new Date(item.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
