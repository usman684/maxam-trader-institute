import { useEffect, useState } from "react";
import api from "./api";
import { courses as fallback } from "../data/courses";

const fallbackBySlug = Object.fromEntries(
  fallback.map((course) => [course.slug, course]),
);

export function useCourses() {
  const [list, setList] = useState(fallback);

  useEffect(() => {
    let active = true;

    api
      .get("/courses")
      .then((response) => {
        const data = response.data;

        if (!active || !Array.isArray(data) || data.length === 0) return;

        const updatedCourses = data.map((course) => {
          const localCourse = fallbackBySlug[course.slug] || {};

          return {
            ...localCourse,
            ...course,
            original:
              course.originalFee || course.original || localCourse.original,
            image: course.image || localCourse.image,
            imageAlt: course.imageAlt || localCourse.imageAlt,
            description: course.description || localCourse.description,
            outcomes:
              Array.isArray(course.outcomes) && course.outcomes.length
                ? course.outcomes
                : localCourse.outcomes,
            syllabus:
              Array.isArray(course.syllabus) && course.syllabus.length
                ? course.syllabus
                : localCourse.syllabus,
          };
        });

        setList(updatedCourses);
      })
      .catch((error) => {
        console.error("Courses API error:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return list;
}
