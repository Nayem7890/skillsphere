import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
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
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myCourses", user?.email],
    queryFn: async () => {
      const { data } = await api.get(
        `/courses?instructorEmail=${encodeURIComponent(user?.email || "")}`
      );
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
      qc.setQueryData(
        ["myCourses", user?.email],
        (old = []) => old.filter((c) => c._id !== id)
      );
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

  // client-side search + sort
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

    const [field, dir] = sort.split(":");
    const m = dir === "asc" ? 1 : -1;

    return [...list].sort((a, b) => {
      const get = (o) => {
        if (field === "rating")
          return o?.rating?.avg ?? o?.rating?.average ?? 0;
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] grid place-items-center"
      >
        <div className="text-center">
          <p className="opacity-70 mb-3">Please log in to view your courses.</p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-8 container mx-auto px-4"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="skeleton h-10 w-48" />
          <div className="skeleton h-10 w-36" />
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card bg-base-200 shadow"
            >
              <div className="skeleton w-full h-48" />
              <div className="card-body">
                <div className="skeleton h-6 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-2/3" />
                <div className="mt-4 flex gap-2 flex-wrap">
                  <div className="skeleton h-9 w-20" />
                  <div className="skeleton h-9 w-20" />
                  <div className="skeleton h-9 w-20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] grid place-items-center"
      >
        <div className="card bg-base-200 shadow p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">
            Failed to load your courses.
          </h2>
          <button className="btn btn-primary btn-sm" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          data-aos="fade-up"
          className="flex flex-col gap-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">My Courses</h1>
            <Link
              to="/dashboard/add-course"
              className="btn btn-primary w-full sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Course
            </Link>
          </div>

          {/* Search and Sort Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="join flex-1">
              <input
                type="text"
                className="input input-bordered join-item flex-1"
                placeholder="Search my courses…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-ghost join-item"
                onClick={() => setSearch("")}
                disabled={!search}
                title="Clear"
              >
                ✕
              </motion.button>
            </div>

            <select
              className="select select-bordered w-full sm:w-48"
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
          </div>
        </motion.div>

        {/* Results Count */}
        {filteredSorted.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm opacity-70 mb-4"
            data-aos="fade-up"
          >
            Showing {filteredSorted.length} course
            {filteredSorted.length !== 1 ? "s" : ""}
          </motion.p>
        )}

        {/* Grid */}
        {filteredSorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <motion.div
                  key={_id}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <figure className="relative">
                    {isFeatured && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="badge badge-secondary absolute top-3 left-3 z-10"
                      >
                        Featured
                      </motion.span>
                    )}
                    <img
                      src={src}
                      alt={title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title line-clamp-1">{title}</h2>
                    <p className="text-sm opacity-70 line-clamp-2">
                      {description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {category && (
                          <span className="badge badge-primary">{category}</span>
                        )}
                        {duration != null && (
                          <span className="badge">{fmtDur(duration)}</span>
                        )}
                      </div>
                      <span className="font-bold text-primary">
                        {fmtPrice(price)}
                      </span>
                    </div>

                    <div className="card-actions justify-end gap-2 mt-4 flex-wrap">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to={`/courses/${_id}`}
                          className="btn btn-sm btn-outline"
                        >
                          View
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <button
                          onClick={() => navigate(`/dashboard/update-course/${_id}`)}
                          className="btn btn-sm btn-primary"
                        >
                          Edit
                        </button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
            data-aos="fade-up"
          >
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg mb-2 font-semibold">
                {search
                  ? "No courses found matching your search."
                  : "You haven't added any courses yet."}
              </p>
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="btn btn-outline btn-sm mt-4"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/dashboard/add-course"
                  className="btn btn-primary mt-4"
                >
                  Add Your First Course
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
