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
  const { courseSlug, slug, name } = req.body;
  const created = createLesson({ courseSlug, slug, name });
  if(created) {
    res.status(201).json("Aula criada!");
  } else {
    res.status(400).json("Erro ao criar a aula!");
  }
});

router.get("/courses", (req, res) => {
  const courses = getCourses();
  if(courses && courses.length) {
    res.status(200).json(courses);
  } else {
    res.status(404).json("Cursos não encontrados!")
  }
});

router.get("/course", (req, res) => {
  const slug = req.query.get("slug");
  const course = getCourse(slug);
  if(course) {
    res.status(200).json(course);
  } else {
    res.status(404).json("Courso não encontrado!")
  }
});

router.get("/lessons", (req, res) => {
  const course = req.query.get("curso");
  const lessons = getLessons(course);
  if(lessons && lessons.length) {
    res.status(200).json(lessons);
  } else {
    res.status(404).json("Aulas não encontradas!")
  }
});

router.get("/lesson", (req, res) => {
  const couseSlug = req.query.get("slug_curso");
  const lessonSlug = req.query.get("slug_aula");
  const lesson = getLesson(couseSlug, lessonSlug);
  if(lesson) {
    res.end(JSON.stringify(lesson));
  } else {
    res.status(404).json("Aula não encontrada!")
  }
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