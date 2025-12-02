"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-h2 text-text-primary flex items-center gap-2">
            <Globe className="w-5 h-5 text-text-secondary" />
            Countries
          </h2>
        </div>
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-border border-t-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-h2 text-text-primary flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent" />
          Countries
        </h2>
        {countries.length > 0 && (
          <span className="text-tiny text-text-tertiary">{countries.length} regions</span>
        )}
      </div>

      <div className="p-5">
        {/* Add Country Form */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Add new country..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 h-10 px-4 bg-background-tertiary/50 border border-border rounded-md text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-150"
          />
          <Button
            onClick={handleAdd}
            disabled={adding || !newName}
            size="md"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Countries List */}
        <div className="space-y-1">
          {countries.map((country) => (
            <Link
              key={country.id}
              href={`/countries/${country.id}`}
              className="flex justify-between items-center px-4 py-3 rounded-lg hover:bg-background-tertiary/50 transition-all duration-150 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center">
                  <Globe className="w-4 h-4 text-accent" />
                </div>
                <span className="text-body text-text-primary font-medium">{country.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDelete(country.id, e)}
                  className="p-2 text-text-tertiary hover:text-danger hover:bg-danger-muted rounded-md transition-all duration-150 opacity-0 group-hover:opacity-100"
                  title="Delete country"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-150" />
              </div>
            </Link>
          ))}
          {countries.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-xl bg-background-tertiary flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-text-tertiary" />
              </div>
              <p className="text-body text-text-primary mb-2">No countries added</p>
              <p className="text-small text-text-secondary">
                Add countries to organize screenings by region
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
