const response = await fetch("http://localhost:3000/produtos", {
	method: "post",
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		nome: "Azul",
		slug: "azul",
		categoria: "jogos-tabuleiro",
		preco: 149.90
	})
});

const body = await response.text();

console.log(body);