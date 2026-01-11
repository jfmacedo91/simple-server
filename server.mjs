import { createServer } from "node:http";
import { Router } from "./router.mjs";
import { customRequest } from "./custom-request.mjs";
import { customResponse } from "./custom-response.mjs";
import { createCourse, createLesson, getCourse, getCourses, getLesson, getLessons } from "./database.mjs";

const router = new Router();

router.post("/course", (req, res) => {
  const { slug, name, description } = req.body;
  const created = createCourse({ slug, name, description });
  if(created) {
    res.status(201).json("Curso criado!");
  } else {
    res.status(400).json("Erro ao criar o curso!");
  }
});

router.post("/lesson", (req, res) => {
  const { course_slug, slug, name } = req.body;
  const created = createLesson({ course_slug, slug, name });
  if(created) {
    res.status(201).json("Aula criado!");
  } else {
    res.status(400).json("Erro ao criar a aula!");
  }
});

router.get("/courses", (req, res) => {
  const courses = getCourses();
  res.end(JSON.stringify(courses));
});

router.get("/course", (req, res) => {
  const slug = req.query.get("slug");
  const course = getCourse(slug);
  res.end(JSON.stringify(course));
});

router.get("/lessons", (req, res) => {
  const course = req.query.get("curso");
  const lessons = getLessons(course);
  res.end(JSON.stringify(lessons));
});

router.get("/lesson", (req, res) => {
  const couseSlug = req.query.get("slug_curso");
  const lessonSlug = req.query.get("slug_aula");
  const lesson = getLesson(couseSlug, lessonSlug);
  res.end(JSON.stringify(lesson));
});

const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = await customResponse(response);

  const handler = router.find(req.method, req.pathname);
  if(handler) {
    handler(req, res);
  } else {
    res.statusCode = 404;
    res.end("Página não encontrada!")
  }
});

server.listen("3000", () => {
  console.log("Server running: http://localhost:3000")
});