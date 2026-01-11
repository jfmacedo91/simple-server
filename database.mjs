import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./lms.sqlite");

db.exec(/*sql*/`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  PRAGMA cache_size = 2000;
  PRAGMA busy_timeout = 5000;
  PRAGMA temp_store = MEMORY;

  CREATE TABLE IF NOT EXISTS "courses" (
    "id" INTEGER PRIMARY KEY,
    "slug" TEXT NOT NULL COLLATE NOCASE UNIQUE,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
  ) STRICT;
  
  CREATE TABLE IF NOT EXISTS "lessons" (
    "id" INTEGER PRIMARY KEY,
    "course_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL COLLATE NOCASE,
    "name" TEXT NOT NULL,
    FOREIGN KEY ("course_id") REFERENCES "courses" ("id"),
    UNIQUE ("course_id", "slug")
  ) STRICT;
`);

export function createCourse({ slug, name, description }) {
  try {
    db.prepare(/*sql*/`
      INSERT OR IGNORE INTO "courses"
        ("slug", "name", "description")
      VALUES
        (?, ?, ?)
    `).run(slug, name, description);
  } catch(error) {
    console.log(error);
    return null;
  }
};

export function createLesson({ course_slug, slug, name }) {
  try {
    db.prepare(/*sql*/`
      INSERT OR IGNORE INTO "lessons"
        ("course_id", "slug", "name")
      VALUES
        ((SELECT "id" FROM "courses" WHERE "slug" = '${ course_slug }'), ?, ?)
    `).run(slug, name);
  } catch(error) {
    console.log(error);
    return null;
  }
};

export function getCourses() {
  try {
    const courses = db.prepare(/*sql*/`
      SELECT * FROM "courses";
    `).all();
    return courses;
  } catch(error) {
    console.log(error);
  }
};

export function getCourse(slug) {
  try {
    const course = db.prepare(/*sql*/`
      SELECT * FROM "courses" WHERE "slug" = '${ slug }';
    `).get();
    return course;
  } catch(error) {
    console.log(error);
  }
};

export function getLessons(course) {
  try {
    const lessons = db.prepare(/*sql*/`
      SELECT * FROM "lessons" WHERE "course_id" = (SELECT "id" FROM "courses" WHERE "slug" = '${ course }')
    `).all();
    return lessons;
  } catch(error) {
    console.log(error);
  }
};

export function getLesson(course_slug, lesson_slug) {
  try {
    const lesson = db.prepare(/*sql*/`
      SELECT * FROM "lessons" WHERE "course_id" = (SELECT "id" FROM "courses" WHERE "slug" = '${ course_slug }') AND "slug" = '${ lesson_slug }'
    `).get();
    return lesson;
  } catch(error) {
    console.log(error);
  }
};