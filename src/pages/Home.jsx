import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

const FALLBACK_IMAGE = 'https://i.ibb.co/5GzXgmq/avatar.png';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Home = () => {
  const [popularCourses, setPopularCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Home - SkillSphere';
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  const loadPopularCourses = useCallback(() => {
    const controller = new AbortController();

    const run = async () => {
      try {
        setError('');
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/popular-courses`, {
          signal: controller.signal
        });
        setPopularCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          console.error('Error fetching popular courses:', err);
          setError('Failed to load courses. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    run();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const cleanup = loadPopularCourses();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [loadPopularCourses]);

  const topInstructors = useMemo(() => {
    const seen = new Set();
    const result = [];

    for (const course of popularCourses) {
      const instructor = course?.instructor || {};
      const key = instructor.email || instructor.name || course?._id;
      if (!key || seen.has(key)) continue;

      seen.add(key);
      result.push({
        name: instructor.name || 'Unknown Instructor',
        expertise: course?.category || 'General',
        image: instructor.photoURL || FALLBACK_IMAGE,
        students: Number(course?.rating?.count || 0) * 3 + 50
      });

      if (result.length === 4) break;
    }

    return result;
  }, [popularCourses]);

  return (
    <div className="space-y-16">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hero min-h-[60vh] bg-gradient-to-r from-primary to-secondary text-primary-content"
      >
        <div className="hero-content text-center">
          <div className="max-w-2xl space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 100 }}
              className="text-5xl font-extrabold"
            >
              Welcome to SkillSphere
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-lg opacity-90"
            >
              Unlock your potential with expert-led courses. Learn from industry professionals and
              level-up your career.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link to="/courses" className="btn btn-accent btn-lg">
                Explore Courses
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="bg-base-100 py-16">
        <div className="container mx-auto px-4 space-y-10">
          <header className="text-center space-y-2" data-aos="fade-up">
            <h2 className="text-4xl font-bold">Popular Courses</h2>
            <p className="opacity-70">Discover our most loved courses taught by expert instructors</p>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="card bg-base-200 shadow-sm animate-pulse">
                  <div className="w-full h-40 bg-base-300" />
                  <div className="card-body space-y-2">
                    <div className="h-5 w-2/3 bg-base-300 rounded" />
                    <div className="h-4 w-full bg-base-300 rounded" />
                    <div className="h-4 w-4/5 bg-base-300 rounded" />
                    <div className="h-8 w-28 bg-base-300 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-error font-medium">{error}</p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  loadPopularCourses();
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCourses.length ? (
                popularCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="card bg-base-200 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <figure>
                      <img
                        src={course.imageUrl || course.image || FALLBACK_IMAGE}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    </figure>
                    <div className="card-body space-y-2">
                      <h3 className="card-title">{course.title}</h3>
                      <p className="text-sm opacity-70 line-clamp-2">{course.description}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="badge badge-primary">{course.category}</span>
                        <span className="font-semibold text-primary">${course.price}</span>
                      </div>
                      <div className="card-actions justify-end pt-2">
                        <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 opacity-70">
                  No popular courses available yet.
                </div>
              )}
            </div>
          )}

          <div className="text-center" data-aos="fade-up">
            <Link to="/courses" className="btn btn-outline btn-lg">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-base-200 py-16">
        <div className="container mx-auto px-4 space-y-10">
          <header className="text-center space-y-2" data-aos="fade-up">
            <h2 className="text-4xl font-bold">Why Choose Us</h2>
            <p className="opacity-70">Experience the best in online learning</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎓',
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of experience'
              },
              {
                icon: '📚',
                title: 'Comprehensive Courses',
                description: 'Explore a wide range of topics from beginner to advanced'
              },
              {
                icon: '⏱️',
                title: 'Flexible Learning',
                description: 'Study at your own pace, anytime and anywhere'
              },
              {
                icon: '💼',
                title: 'Career Growth',
                description: 'Build skills that employers truly value'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="card bg-base-100 shadow-sm p-6 text-center space-y-2 hover:shadow-lg transition-shadow"
              >
                <motion.div
                  className="text-5xl"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="opacity-70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-base-100 py-16">
        <div className="container mx-auto px-4 space-y-10">
          <header className="text-center space-y-2" data-aos="fade-up">
            <h2 className="text-4xl font-bold">Top Instructors</h2>
            <p className="opacity-70">Meet our world-class mentors</p>
          </header>

          {topInstructors.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topInstructors.map((instructor, idx) => (
                <motion.div
                  key={`${instructor.name}-${idx}`}
                  data-aos="flip-left"
                  data-aos-delay={idx * 100}
                  initial={{ opacity: 0, rotateY: -90 }}
                  whileInView={{ opacity: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="card bg-base-200 shadow-sm text-center hover:shadow-lg transition-shadow"
                >
                  <figure className="px-6 pt-6">
                    <motion.div
                      className="avatar"
                      whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                    >
                      <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={instructor.image || FALLBACK_IMAGE} alt={instructor.name} />
                      </div>
                    </motion.div>
                  </figure>
                  <div className="card-body items-center text-center space-y-2">
                    <h3 className="card-title">{instructor.name}</h3>
                    <p className="text-primary font-semibold">{instructor.expertise}</p>
                    <p className="text-sm opacity-70">
                      {Number(instructor.students || 0).toLocaleString()}+ Students
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center opacity-70">Instructors will appear once courses load.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
