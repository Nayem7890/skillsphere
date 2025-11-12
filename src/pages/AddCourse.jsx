// src/pages/AddCourse.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../Providers/AuthProvider";

const CATEGORIES = [
  "Web Development",
  "Backend",
  "Programming Languages",
  "Design",
  "Data Science",
  "DevOps",
  "Mobile",
  "UI/UX Design",
  "Digital Marketing",
  "Graphic Design",
];

const AddCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    price: "",
    duration: "",
    category: "",
    description: "",
    isFeatured: false,
  });

  useEffect(() => {
    document.title = "Add Course - SkillSphere";
    AOS.init({ duration: 800, once: true });
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- client-side validation ---
    const priceNum = Number(formData.price);
    const durationNum = Number(formData.duration);

    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.imageUrl.trim()) return toast.error("Please add an image URL");
    if (!formData.category) return toast.error("Select a category");
    if (!formData.description.trim()) return toast.error("Description is required");
    if (Number.isNaN(priceNum) || priceNum < 0) return toast.error("Invalid price");
    if (Number.isNaN(durationNum) || durationNum <= 0) return toast.error("Invalid duration (hours)");

    // --- payload matching your MongoDB schema ---
    const now = new Date().toISOString();
    const payload = {
      title: formData.title.trim(),
      imageUrl: formData.imageUrl.trim(),
      price: priceNum,           // number
      duration: durationNum,     // number (hours)
      category: formData.category,
      description: formData.description.trim(),
      isFeatured: !!formData.isFeatured,

      instructor: {
        uid: user?.uid || "",
        name: user?.displayName || "Unknown",
        email: user?.email || "",
        photoURL: user?.photoURL || "",
      },

      rating: { avg: 0, count: 0 },
      createdAt: now,
      updatedAt: now,
    };

    try {
      setLoading(true);
      const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await axios.post(`${base}/courses`, payload);
      toast.success("Course added successfully!");
      navigate("/dashboard/my-courses");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add course";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-violet-100">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center" data-aos="fade-up">
            Add New Course
          </h1>

          <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl p-6" data-aos="fade-up">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="label">
                  <span className="label-text">Course Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={onChange}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="label">
                  <span className="label-text">Image URL *</span>
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  required
                  className="input input-bordered w-full"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={onChange}
                />
                {formData.imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-24 h-24 bg-base-300 rounded overflow-hidden">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={removeImage}>
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Price ($) *</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Duration (hours) *</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    required
                    min="1"
                    step="1"
                    className="input input-bordered w-full"
                    placeholder="e.g., 10"
                    value={formData.duration}
                    onChange={onChange}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="label">
                  <span className="label-text">Category *</span>
                </label>
                <select
                  name="category"
                  required
                  className="select select-bordered w-full"
                  value={formData.category}
                  onChange={onChange}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="label">
                  <span className="label-text">Description *</span>
                </label>
                <textarea
                  name="description"
                  required
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Enter course description"
                  value={formData.description}
                  onChange={onChange}
                />
              </div>

              {/* Featured */}
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Featured Course</span>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    className="toggle toggle-primary"
                    checked={formData.isFeatured}
                    onChange={onChange}
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="card-actions justify-end mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/my-courses")}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Adding...
                    </>
                  ) : (
                    "Add Course"
                  )}
                </button>
              </div>

              {/* Instructor autofill note */}
              <div className="mt-2 text-xs opacity-60">
                Instructor info will be auto-filled from your profile:{" "}
                <strong>{user?.displayName || "Unknown"}</strong> ({user?.email || "no email"})
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
