const base = "http://localhost:3000";

await fetch(base + "/course", {
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		slug: "react",
		name: "React",
		description: "Courso de React"
	})
});

await fetch(base + "/lesson", {
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		courseSlug: "javascript",
		slug: "tipo-de-variaveis",
		name: "Tipos de variáveis"
	})
});

const courses = await fetch(base + "/courses").then(response => response.json());
console.log("Cursos:", courses);

const courseResponse = await fetch(base + "/course?slug=css");
const course = await courseResponse.json();
console.log("Curso:", course);

const lessonsResponse = await fetch(base + "/lessons?curso=javascript");
const lessons = await lessonsResponse.json();
console.log("Aulas:", lessons);

const lessonResponse = await fetch(base + "/lesson?slug_curso=javascript&slug_aula=variaveis");
const lesson = await lessonResponse.json();
console.log("Aula:", lesson);