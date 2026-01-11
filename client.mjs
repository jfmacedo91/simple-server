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
		course_slug: "javascript",
		slug: "tipo-de-variaveis",
		name: "Tipos de variáveis"
	})
});

const courses = await fetch(base + "/courses", {
	method: "GET"
});

console.log(courses.body);

const course = await fetch(base + "/course?slug=css", {
	method: "GET"
});

console.log(course.body);

const lesson = await fetch(base + "/course?slug_curso=javascript&slug_aula=variaveis", {
	method: "GET"
});

console.log(lesson.body);