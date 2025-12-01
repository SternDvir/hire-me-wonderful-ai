"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

interface Country {
  id: string;
  name: string;
}

export function CountryManager() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/countries");
      if (res.ok) {
        const data = await res.json();
        setCountries(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch countries", error);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName) return;
    setAdding(true);
    try {
      const res = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        setNewName("");
        fetchCountries();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add country");
      }
    } catch (error) {
      console.error("Failed to add country", error);
      alert("Failed to add country. Check console for details.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/countries?id=${id}`, { method: "DELETE" });
      fetchCountries();
    } catch (error) {
      console.error("Failed to delete country", error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Manage Countries</h2>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Country Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newName}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>

      <div className="space-y-2">
        {countries.map((country) => (
          <div key={country.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">{country.name}</span>
            </div>
            <button
              onClick={() => handleDelete(country.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
        {countries.length === 0 && (
          <p className="text-gray-500 text-center py-4">No countries added yet.</p>
        )}
      </div>
    </div>
  );
}
