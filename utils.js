const form = document.getElementById('meuFormulario');

form.addEventListener('submit', event => handleSubmit(event));

function handleSubmit(event) {
	event.preventDefault();

	const formData = new FormData(form);

	// Converter FormData para um objeto simples
	const dados = Object.fromEntries(formData);
	console.log(dados);
	console.log(typeof dados);

	if (validateFileds(dados)) {
		submitData(dados);
		form.reset();
		alert('Dados enviados !');
	}
}

async function submitData(dados) {
	const url = 'http://localhost:3000/api/doacao';
	const postData = dados;

	await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8', // Inform the server about the data type
		},
		body: JSON.stringify(postData),
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			console.log('Success:', data);
		})
		.catch(error => {
			console.error('Error:', error);
		});
}

function validateFileds(dados) {
	for (let [key, value] of Object.entries(dados)) {
		if (value === '') {
			const field = document.getElementById(key);
			field.focus();
			alert(`Campo ${key} não foi preenchido`);
			return false;
		}
	}

	return true;
}
