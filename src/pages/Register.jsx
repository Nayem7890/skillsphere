import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../Providers/AuthProvider';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    uppercase: false,
    lowercase: false,
    length: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register: registerUser, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // ✅ redirect to intended page

  useEffect(() => {
    document.title = "Register - SkillSphere";
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const validatePassword = (password) => {
    const errors = {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      length: password.length >= 6,
    };
    setPasswordErrors(errors);
    return errors.uppercase && errors.lowercase && errors.length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      toast.error("Please fix password validation errors");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      await registerUser(
        formData.email.trim(),
        formData.password,
        formData.name.trim(),
        formData.photoURL.trim() || null
      );
      navigate(from, { replace: true });
    } catch {
      // Error toast handled in AuthProvider
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await googleLogin();
      navigate(from, { replace: true });
    } catch {
      // Error toast handled in AuthProvider
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordValid =
    passwordErrors.uppercase &&
    passwordErrors.lowercase &&
    passwordErrors.length;

  const disabledSubmit =
    isSubmitting ||
    !formData.name.trim() ||
    !formData.email.trim() ||
    !isPasswordValid ||
    formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-violet-100">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-base-content">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-base-content/70">
            Join SkillSphere and start learning today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input input-bordered w-full"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                <span className="label-text">Email address</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input input-bordered w-full"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="photoURL" className="label">
                <span className="label-text">Photo URL (Optional)</span>
              </label>
              <input
                id="photoURL"
                name="photoURL"
                type="url"
                className="input input-bordered w-full"
                placeholder="https://example.com/photo.jpg"
                value={formData.photoURL}
                onChange={handleChange}
                autoComplete="photo"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input input-bordered w-full pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2 text-sm space-y-1">
                  <div className={passwordErrors.uppercase ? "text-success" : "text-error"}>
                    {passwordErrors.uppercase ? "✓" : "✗"} Must have an Uppercase letter
                  </div>
                  <div className={passwordErrors.lowercase ? "text-success" : "text-error"}>
                    {passwordErrors.lowercase ? "✓" : "✗"} Must have a Lowercase letter
                  </div>
                  <div className={passwordErrors.length ? "text-success" : "text-error"}>
                    {passwordErrors.length ? "✓" : "✗"} Length must be at least 6 characters
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input input-bordered w-full"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={disabledSubmit}
          >
            {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : "Register"}
          </button>

          <div className="divider">OR</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;