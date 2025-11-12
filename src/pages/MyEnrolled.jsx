// src/pages/MyEnrolled.jsx
import { useEffect, useMemo } from "react";
import { Link } from "react-router"; 
import { useAuth } from "../Providers/AuthProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";

// Use environment variable for API, fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// A clean, neutral placeholder image
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop";

// Helper function to format price
const fmtPrice = (v) => `$${Number(v || 0).toFixed(2)}`;

export default function MyEnrolled() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "My Enrolled Courses - SkillSphere";
    // Initialize AOS for animations
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  const {
    data: enrollments = [], // Default to an empty array
    isLoading,
    isError,
    refetch,
  } = useQuery({
    // Query key is tied to the user's email
    queryKey: ["myEnrolled", user?.email],
    queryFn: async () => {
      // Only run the query if there is a user email
      if (!user?.email) {
        return []; // Return empty array if no user
      }
      const { data } = await axios.get(`${API_URL}/my-enrolled-course`, {
        params: { studentEmail: user.email },
      });
      // Ensure the response is always an array
      return Array.isArray(data) ? data : [];
    },
    // Only enable the query if the user's email exists
    enabled: !!user?.email,
    // These are good settings for data that doesn't change often
    refetchOnWindowFocus: false,
    staleTime: 60_000, // 1 minute
  });

  // Memoize the sorted list to prevent re-sorting on every render
  const sortedEnrollments = useMemo(() => {
    // Sort by enrollment date, newest first
    return [...enrollments].sort((a, b) => {
      const dateA = new Date(a?.enrolledAt || 0).getTime();
      const dateB = new Date(b?.enrolledAt || 0).getTime();
      return dateB - dateA;
    });
  }, [enrollments]);

  // 1. Auth Guard: User is not logged in
  if (!user) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-center">
        <div>
          <p className="text-lg opacity-80 mb-4">
            Please log in to view your enrolled courses.
          </p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // 2. Loading State: Fetching data
  if (isLoading) {
    return (
      <div className="py-8 container mx-auto px-4">
        {/* Skeleton Loader */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card bg-base-200 shadow-xl animate-pulse">
              <div className="w-full h-48 bg-base-300" />
              <div className="card-body">
                <div className="h-6 w-3/4 bg-base-300 rounded mb-2" />
                <div className="h-4 w-full bg-base-300 rounded mb-1" />
                <div className="h-4 w-5/6 bg-base-300 rounded mb-2" />
                <div className="h-8 w-24 bg-base-300 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Error State: Query failed
  if (isError) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="card bg-base-200 shadow p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">
            Failed to load your enrollments.
          </h2>
          <button className="btn btn-primary btn-sm" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  // 4. Empty State: User has no enrollments
  if (sortedEnrollments.length === 0) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-center" data-aos="fade-up">
          <p className="text-lg mb-4">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  // 5. Success State: Render enrollment list
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8" data-aos="fade-up">
          My Enrolled Courses
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEnrollments.map((enrollment, idx) => {
            // This logic supports two data shapes from the API:
            // 1. { ...enrollment, course: { ...courseDetails } } (Joined)
            // 2. { ...enrollment, ...courseDetails } (Denormalized/Flat)
            const courseData = enrollment.course || enrollment;

            // Extract course details with fallbacks
            const title = courseData.title || "Untitled Course";
            const description = courseData.description || "No description available.";
            const category = courseData.category || "General";
            const price = courseData.price; // Can be null/undefined

            // Get the correct image URL
            const img = (courseData.imageUrl || courseData.image || FALLBACK_IMG).trim();

            // ✨ FIX: Correctly get the course ID for the link
            // Priotize 'courseId' on the enrollment, fall back to the nested course's '_id'
            const courseId = enrollment.courseId || courseData._id;

            return (
              <div
                key={enrollment._id || `${courseId}-${idx}`} // Use enrollment ID as key
                data-aos="fade-up"
                data-aos-delay={idx * 80}
                className="card bg-base-200 shadow-xl"
              >
                <figure>
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{title}</h2>
                  <p className="text-sm opacity-70 line-clamp-2">
                    {description}
                  </p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="badge badge-primary">{category}</span>
                    {/* Only show price if it exists */}
                    {price != null && (
                      <span className="font-bold text-primary">
                        {fmtPrice(price)}
                      </span>
                    )}
                  </div>

                  <div className="card-actions justify-end mt-4">
                    {/* ✨ FIX: Link to the specific course details page */}
                    <Link
                      to={courseId ? `/courses/${courseId}` : '/courses'}
                      disabled={!courseId}
                      className="btn btn-primary btn-sm"
                    >
                      Continue Learning
                    </Link>
                  </div>

                  <div className="text-xs opacity-70 mt-2">
                    Enrolled on:{" "}
                    {enrollment.enrolledAt
                      ? new Date(enrollment.enrolledAt).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}