// src/pages/AllCourses.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import CourseCard from "./CourseCard";

const normalize = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
};

const sortOptions = [
  { value: "price:asc", label: "Price: Low → High" },
  { value: "price:desc", label: "Price: High → Low" },
  { value: "duration:asc", label: "Duration: Short → Long" },
  { value: "duration:desc", label: "Duration: Long → Short" },
  { value: "rating:desc", label: "Rating: High → Low" },
  { value: "rating:asc", label: "Rating: Low → High" },
  
];

const AllCourses = () => {
  const raw = useLoaderData();
  const items = normalize(raw);

  const [searchParams, setSearchParams] = useSearchParams();

  // UI state (mirrors URL but lets us debounce nicely)
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [sortValue, setSortValue] = useState(
    searchParams.get("sort") && searchParams.get("order")
      ? `${searchParams.get("sort")}:${searchParams.get("order")}`
      : "createdAt:desc"
  );
  const [isSearching, setIsSearching] = useState(false);

  // Keep input & sort in sync if URL changes externally
  useEffect(() => {
    setSearchInput(searchParams.get("search") || "");
    const s = searchParams.get("sort");
    const o = searchParams.get("order");
    if (s && o) setSortValue(`${s}:${o}`);
  }, [searchParams]);

  // Debounced search: update URL after 400ms of inactivity
  useEffect(() => {
    setIsSearching(true);
    const t = setTimeout(() => {
      const sp = new URLSearchParams(searchParams);
      const q = searchInput.trim();
      if (q) sp.set("search", q);
      else sp.delete("search");
      sp.set("page", "1");
      setSearchParams(sp);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Case-insensitive filter
  const filtered = useMemo(() => {
    const q = (searchParams.get("search") || "").trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => {
      const hay = [c.title, c.description, c.category, c.instructor?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, searchParams]);

  // Sort
  const sorted = useMemo(() => {
    const [field, dir] = (sortValue || "createdAt:desc").split(":");
    const m = dir === "asc" ? 1 : -1;

    const getVal = (obj) => {
      if (field === "rating") return obj?.rating?.avg ?? 0;
      if (field === "createdAt") return obj?.createdAt ? new Date(obj.createdAt).getTime() : 0;
      return obj?.[field];
    };

    return [...filtered].sort((a, b) => {
      let va = getVal(a);
      let vb = getVal(b);
      if (typeof va === "string" && !Number.isNaN(Number(va))) va = Number(va);
      if (typeof vb === "string" && !Number.isNaN(Number(vb))) vb = Number(vb);
      if (va < vb) return -1 * m;
      if (va > vb) return 1 * m;
      return 0;
    });
  }, [filtered, sortValue]);

  const handleSortChange = (val) => {
    setSortValue(val);
    const [s, o] = val.split(":");
    const sp = new URLSearchParams(searchParams);
    sp.set("sort", s);
    sp.set("order", o);
    sp.set("page", "1");
    setSearchParams(sp);
  };

  const clearSearch = () => {
    setSearchInput("");
    const sp = new URLSearchParams(searchParams);
    sp.delete("search");
    sp.set("page", "1");
    setSearchParams(sp);
  };

  return (
    <div className="bg-violet-50">
      {/* header */}
      <section className="rounded-2xl mx-3 md:mx-6 hero-soft">
        <div className="py-8 md:py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            All <span className="text-primary">Courses</span>
          </h1>
          <p className="mt-2 opacity-80">
            {sorted.length
              ? `${sorted.length} course${sorted.length > 1 ? "s" : ""} found`
              : "Browse our catalog of expert-led content"}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 pb-10 pt-6">
        {/* minimal toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* search input + buttons */}
          <div className="join w-full md:w-auto">
            <input
              type="text"
              className="input input-bordered join-item w-full md:w-96"
              placeholder="Search courses…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn btn-primary join-item" disabled>
              {isSearching ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Search"
              )}
            </button>
            <button
              className="btn btn-ghost join-item"
              onClick={clearSearch}
              disabled={!searchParams.get("search") && !searchInput}
              title="Clear search"
            >
              ✕
            </button>
          </div>

          {/* sort */}
          <select
            className="select select-bordered w-full md:w-56"
            value={sortValue}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* grid */}
        {isSearching ? (
          // simple skeletons while debouncing/“searching”
          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card bg-base-200 shadow-md animate-pulse">
                <div className="h-48 bg-base-300" />
                <div className="card-body">
                  <div className="h-4 bg-base-300 rounded w-3/4" />
                  <div className="h-3 bg-base-300 rounded w-full mt-3" />
                  <div className="h-3 bg-base-300 rounded w-5/6 mt-2" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-6 w-16 bg-base-300 rounded" />
                    <div className="h-6 w-12 bg-base-300 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length ? (
          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((course) => (
              <div
                key={course._id}
                className="transition-transform duration-200 hover:-translate-y-2"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <div className="text-2xl font-semibold">No courses found</div>
            <p className="opacity-70 mt-2">Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourses;
