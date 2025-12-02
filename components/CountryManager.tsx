"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Plus, Trash2, ArrowRight } from "lucide-react";

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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this country?")) return;
    try {
      await fetch(`/api/countries?id=${id}`, { method: "DELETE" });
      fetchCountries();
    } catch (error) {
      console.error("Failed to delete country", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <Globe className="w-6 h-6 text-wonderful-purple-600" />
          <span>Countries</span>
        </h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wonderful-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-light dark:bg-card-dark backdrop-blur-sm p-6 rounded-wonderful-xl shadow-wonderful-lg border border-white/20 dark:border-gray-800/50">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
        <Globe className="w-6 h-6 text-wonderful-purple-600" />
        <span>Countries</span>
      </h2>

      {/* Add Country Form */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Add new country..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-wonderful-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-wonderful-purple-500 transition-all duration-200 placeholder-gray-400"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newName}
          className="bg-btn-primary hover:bg-btn-primary-hover text-white px-5 py-2.5 rounded-wonderful-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{adding ? "Adding..." : "Add"}</span>
        </button>
      </div>

      {/* Countries List */}
      <div className="space-y-2">
        {countries.map((country) => (
          <Link
            key={country.id}
            href={`/countries/${country.id}`}
            className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-wonderful-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:shadow-wonderful-sm transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-wonderful-purple-100 dark:bg-wonderful-purple-900/30 rounded-wonderful-md flex items-center justify-center">
                <Globe className="w-4 h-4 text-wonderful-purple-600 dark:text-wonderful-purple-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{country.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleDelete(country.id, e)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-wonderful-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                title="Delete country"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-wonderful-purple-600 dark:group-hover:text-wonderful-purple-400 transition-colors" />
            </div>
          </Link>
        ))}
        {countries.length === 0 && (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No countries added yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add a country to start organizing your screenings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
