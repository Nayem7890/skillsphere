// src/pages/MyCourses.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../Providers/AuthProvider";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

const FALLBACK_IMG = "https://i.ibb.co/5GzXgmq/avatar.png";
const fmtPrice = (v) => `$${Number(v || 0).toFixed(2)}`;
const fmtDur = (v) => (Number.isFinite(Number(v)) ? `${Number(v)}h` : v || "—");

export default function MyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt:desc");

  useEffect(() => {
    document.title = "My Courses - SkillSphere";
    AOS.init({ duration: 700, once: true });
  }, []);

  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myCourses", user?.email],
    queryFn: async () => {
      // backend filter by instructorEmail (adjust if your API expects another key)
      const { data } = await api.get(`/courses?instructorEmail=${encodeURIComponent(user?.email || "")}`);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user?.email,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  // optimistic delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/courses/${id}`);
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["myCourses", user?.email] });
      const prev = qc.getQueryData(["myCourses", user?.email]);
      qc.setQueryData(["myCourses", user?.email], (old = []) => old.filter((c) => c._id !== id));
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["myCourses", user?.email], ctx.prev);
      toast.error("Failed to delete course");
    },
    onSuccess: () => {
      toast.success("Course deleted successfully");
    },
  });

  const handleDelete = (id) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(id);
    }
  };

  // client-side search + sort for your list
  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = courses;

    if (q) {
      list = courses.filter((c) => {
        const hay = [
          c.title,
          c.description,
          c.category,
          c?.instructor?.name,
          c?.instructor?.email,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });
    }

    const [field, dir] = sort.split(":"); // e.g. price:asc
    const m = dir === "asc" ? 1 : -1;

    return [...list].sort((a, b) => {
      const get = (o) => {
        if (field === "rating") return o?.rating?.avg ?? o?.rating?.average ?? 0;
        if (field === "createdAt" || field === "updatedAt") {
          const t = new Date(o?.[field] || 0).getTime();
          return Number.isFinite(t) ? t : 0;
        }
        return o?.[field];
      };
      const va = get(a);
      const vb = get(b);
      if (va < vb) return -1 * m;
      if (va > vb) return 1 * m;
      return 0;
    });
  }, [courses, search, sort]);

  if (!user?.email) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <p className="opacity-70 mb-3">Please log in to view your courses.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-8 container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="skeleton h-10 w-48" />
          <div className="skeleton h-10 w-36" />
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card bg-base-200 shadow">
              <div className="skeleton w-full h-48" />
              <div className="card-body">
                <div className="skeleton h-6 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-2/3" />
                <div className="mt-4 flex gap-2">
                  <div className="skeleton h-9 w-20" />
                  <div className="skeleton h-9 w-20" />
                  <div className="skeleton h-9 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="card bg-base-200 shadow p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Failed to load your courses.</h2>
          <button className="btn btn-primary btn-sm" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6" data-aos="fade-up">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <div className="flex gap-2">
            <div className="join">
              <input
                type="text"
                className="input input-bordered join-item w-64"
                placeholder="Search my courses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-ghost join-item"
                onClick={() => setSearch("")}
                disabled={!search}
                title="Clear"
              >
                ✕
              </button>
            </div>

            <select
              className="select select-bordered w-44"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              title="Sort"
            >
              <option value="createdAt:desc">Newest</option>
              <option value="createdAt:asc">Oldest</option>
              <option value="price:asc">Price: Low → High</option>
              <option value="price:desc">Price: High → Low</option>
              <option value="duration:asc">Duration: Short → Long</option>
              <option value="duration:desc">Duration: Long → Short</option>
              <option value="rating:desc">Rating: High → Low</option>
              <option value="rating:asc">Rating: Low → High</option>
            </select>

            <Link to="/dashboard/add-course" className="btn btn-primary">
              Add New Course
            </Link>
          </div>
        </div>

        {/* Grid */}
        {filteredSorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSorted.map((course, i) => {
              const {
                _id,
                title,
                imageUrl,
                image,
                description,
                category,
                price,
                duration,
                isFeatured,
              } = course;

              const src = imageUrl || image || FALLBACK_IMG;

              return (
                <div
                  key={_id}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <figure className="relative">
                    {isFeatured && (
                      <span className="badge badge-secondary absolute top-3 left-3">Featured</span>
                    )}
                    <img src={src} alt={title} className="w-full h-48 object-cover" loading="lazy" />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{title}</h2>
                    <p className="text-sm opacity-70 line-clamp-2">{description}</p>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        {category && <span className="badge badge-primary">{category}</span>}
                        {duration != null && <span className="badge">{fmtDur(duration)}</span>}
                      </div>
                      <span className="font-bold text-primary">{fmtPrice(price)}</span>
                    </div>

                    <div className="card-actions justify-end gap-2 mt-4">
                      <Link to={`/courses/${_id}`} className="btn btn-sm btn-outline">View</Link>
                      <button
                        onClick={() => navigate(`/dashboard/update-course/${_id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(_id)}
                        className="btn btn-sm btn-error"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16" data-aos="fade-up">
            <p className="text-lg mb-4">You haven’t added any courses yet.</p>
            <Link to="/dashboard/add-course" className="btn btn-primary">
              Add Your First Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
