// src/pages/CourseDetails.jsx
import { useEffect, useMemo } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router";
import { useAuth } from "../Providers/AuthProvider";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const FALLBACK_IMG = "https://i.ibb.co/5GzXgmq/avatar.png";

const fmtPrice = (v) => `$${Number(v || 0).toFixed(2)}`;
const fmtDur = (v) =>
  Number.isFinite(Number(v)) ? `${Number(v)}h` : v ?? "—";
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ----- Hydrate from route loader -----
  const loaderData = useLoaderData();
  const initialCourse = useMemo(() => {
    if (!loaderData) return undefined;
    // loader might return {result: {...}} or a plain object or [object]
    const c = Array.isArray(loaderData)
      ? loaderData[0]
      : loaderData.result ?? loaderData;
    return c && c._id ? c : undefined;
  }, [loaderData]);

  // ----- Fetch course (with hydration) -----
  const {
    data: fetchedData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const resp = await axios.get(`${API}/courses/${id}`);
      return resp.data;
    },
    initialData: initialCourse,
    enabled: !!id,
  });

  const course = useMemo(() => {
    if (!fetchedData) return null;
    return Array.isArray(fetchedData) ? fetchedData[0] : fetchedData;
  }, [fetchedData]);

  useEffect(() => {
    if (course?.title) {
      document.title = `${course.title} - SkillSphere`;
    }
  }, [course]);

  // ----- Enroll mutation -----
  const {
    mutate: enrollMutate,
    isPending: isEnrolling,
  } = useMutation({
    mutationFn: (body) =>
      axios.post(`${API}/my-enrolled-course`, body),
    onSuccess: () => {
      toast.success("Successfully enrolled in the course!");
      // update MyEnrolled cache
      if (user?.email) {
        queryClient.invalidateQueries({
          queryKey: ["myEnrolled", user.email],
        });
      }
    },
    onError: (error) => {
      if (error?.response?.status === 409) {
        toast.error("You are already enrolled in this course");
      } else {
        toast.error("Failed to enroll. Please try again.");
      }
    },
  });

  const handleEnroll = () => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login", {
        replace: true,
        state: { from: `/courses/${id}` },
      });
      return;
    }

    if (!course?._id) {
      toast.error("Course details not loaded yet");
      return;
    }

    // send a snapshot of the course info so MyEnrolled can show it
    enrollMutate({
      courseId: course._id,
      title: course.title,
      imageUrl: course.imageUrl,
      price: course.price,
      category: course.category,
      description: course.description,
      duration: course.duration,
      studentEmail: user.email,
      studentName: user.displayName,
      studentPhoto: user.photoURL,
      enrolledAt: new Date().toISOString(),
    });
  };

  // ----- Loading / error states -----
  if (isLoading && !initialCourse) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="card bg-base-200 shadow p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">
            Course not found or failed to load.
          </h2>
          <div className="card-actions justify-center gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => refetch()}
            >
              Try again
            </button>
            <Link to="/courses" className="btn btn-ghost btn-sm">
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----- Destructure course -----
  const {
    title,
    imageUrl,
    image,
    description,
    category,
    price,
    duration,
    rating,
    isFeatured,
    instructor,
    createdAt,
    updatedAt,
  } = course;

  const imgSrc =
    [imageUrl, image].find(
      (v) => typeof v === "string" && v.trim()
    ) ?? FALLBACK_IMG;

  const ratingValue =
    (rating && (rating.avg ?? rating.average)) ?? null;
  const ratingCount = rating?.count ?? null;

  const instructorName = instructor?.name || "N/A";
  const instructorPhoto = instructor?.photoURL || FALLBACK_IMG;
  const instructorEmail = instructor?.email || "";

  // ----- UI -----
  return (
    <div className="py-8 bg-base-100">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="text-sm breadcrumbs mb-4 opacity-80">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li className="truncate max-w-[40ch]">
              {title || "Course Details"}
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card bg-base-200 shadow-xl overflow-hidden">
              <figure>
                <img
                  src={imgSrc}
                  alt={title || "Course image"}
                  className="w-full h-[420px] object-cover"
                  loading="eager"
                />
              </figure>
              <div className="card-body">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {title}
                  </h1>
                  {isFeatured && (
                    <span className="badge badge-secondary">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm opacity-80 mt-1">
                  {category && (
                    <span className="badge badge-primary">
                      {category}
                    </span>
                  )}
                  {Number.isFinite(Number(duration)) && (
                    <span className="badge">
                      {fmtDur(duration)}
                    </span>
                  )}
                  {ratingValue != null && (
                    <span className="badge badge-outline">
                      ⭐ {Number(ratingValue).toFixed(1)}
                      {typeof ratingCount === "number"
                        ? ` (${ratingCount})`
                        : ""}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-base-content/80 leading-relaxed">
                  {description}
                </p>

                {/* Instructor card */}
                <div className="mt-6 p-4 rounded-lg bg-base-300/50 flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={instructorPhoto} alt={instructorName} />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {instructorName}
                    </div>
                    {instructorEmail && (
                      <div className="text-xs opacity-70">
                        {instructorEmail}
                      </div>
                    )}
                  </div>
                </div>

                <div className="divider" />

                {/* Meta info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="opacity-70">Duration</p>
                    <p className="font-semibold">
                      {fmtDur(duration)}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-70">Category</p>
                    <p className="font-semibold">
                      {category || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-70">Created</p>
                    <p className="font-semibold">
                      {fmtDate(createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-70">Last Updated</p>
                    <p className="font-semibold">
                      {fmtDate(updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card bg-base-200 shadow-xl sticky top-4">
              <div className="card-body">
                <h2 className="card-title">Course Information</h2>

                <div className="mt-2">
                  <div className="text-3xl font-extrabold text-primary">
                    {fmtPrice(price)}
                  </div>
                  <div className="text-sm opacity-70">
                    One-time payment
                  </div>
                </div>

                <div className="divider" />

                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="opacity-70">Category:</span>
                    <span className="font-semibold">
                      {category || "—"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="opacity-70">Duration:</span>
                    <span className="font-semibold">
                      {fmtDur(duration)}
                    </span>
                  </li>
                  {ratingValue != null && (
                    <li className="flex justify-between">
                      <span className="opacity-70">Rating:</span>
                      <span className="font-semibold">
                        {Number(ratingValue).toFixed(1)}
                        {typeof ratingCount === "number"
                          ? ` / 5 • ${ratingCount} reviews`
                          : " / 5"}
                      </span>
                    </li>
                  )}
                </ul>

                <div className="card-actions mt-6">
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="btn btn-primary w-full"
                  >
                    {isEnrolling ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Enrolling…
                      </>
                    ) : (
                      "Enroll Now"
                    )}
                  </button>
                  <Link to="/courses" className="btn btn-ghost w-full">
                    Continue browsing
                  </Link>
                </div>

                <div className="mt-3 text-xs opacity-70 text-center">
                  Instant access • Secure checkout • Lifetime updates
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
