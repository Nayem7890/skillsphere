import React from 'react';
import { Link } from 'react-router';

const CourseCard = ({ course }) => {
  if (!course) return null;

  const {
    _id,
    title,
    imageUrl,
    image,
    description,
    category,
    price,
    duration,
    rating,
    isFeatured,
  } = course;

  const imgSrc =
    imageUrl || image || "https://i.ibb.co/5GzXgmq/avatar.png";

  const ratingValue =
    (rating && (rating.average ?? rating.avg)) ?? null;

  return (
    <div className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow duration-200 h-full">
      <figure className="relative">
        {isFeatured && (
          <span className="badge badge-secondary absolute left-3 top-3 z-10">
            Featured
          </span>
        )}
        <img
          src={imgSrc}
          alt={title || "Course image"}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </figure>

      <div className="card-body">
        <h3 className="card-title text-lg">
          {title}
        </h3>

        <p className="text-sm opacity-70 line-clamp-2">
          {description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {category && <span className="badge badge-primary">{category}</span>}
          {typeof duration === "number" && (
            <span className="badge">{duration}h</span>
          )}
          {ratingValue != null && (
            <span className="badge badge-outline">
              ⭐ {Number(ratingValue).toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-primary font-bold">
            ${Number(price || 0).toFixed(2)}
          </span>

          <Link
            to={`/courses/${_id}`}
            className="btn btn-primary btn-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;