function getDataFilm(url, succes, error) {
	const ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function () {
		if (ajax.readyState === 4) {
			if (ajax.status === 200) succes(this.response);
			else if (ajax.status === 404) error();
		}
	};
	ajax.open("GET", url);
	ajax.send();
}

function searchFilm(input, getDataFilm) {
	if (input.length > 3) {
		// variabel url digunakan untuk menampung link yang sudah dibuat berdasarkan nama film.
		const url = urlFilm(input);
		getDataFilm(
			url,
			(response) => {
				const dataFilm = JSON.parse(response);
				if (dataFilm.Response === "True") {
					let kumpulanFilm = ``;
					dataFilm.Search.forEach(({Poster, Title, Year, imdbID}) => {
						kumpulanFilm += `<div class="col col-sm-6 col-md-4 col-lg-3">
																			<div class="card p-3" >
																					<img src="${Poster}" class="card-img-top" />
																					<div class="card-body">
																							<h5 class="card-title">${Title}</h5>
																							<p class="card-text">Tahun : ${Year}</p>
																							<a data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-primary btn-detail" data-id = "${imdbID}">Lihat Detail</a>
																					</div>
																			</div>
																	</div>`;
					});
					document.querySelector(".film-box").innerHTML = kumpulanFilm;
					
					// ketika tombol detail klik
	
					const btnDetail = document.querySelectorAll(".card .btn-detail");
					for (let i = 0; i < btnDetail.length; i++) {
						btnDetail[i].addEventListener("click", function () {
							document.querySelector(".detail-film").innerHTML = "";
							// mengambil data id setiap tombol yang diklik
							let imdbID = this.dataset.id;
							const url = `http://www.omdbapi.com/?apikey=65b5aaad&i=${imdbID}`;
							getDataFilm(url, (response) => {
								const detailFilm = JSON.parse(response);
								document.querySelector(".detail-film").innerHTML = `<div class="modal-header">
																					<h1 class="modal-title fs-5" id="exampleModalLabel">${detailFilm.Title}</h1>
																					</div>
																					<div class="modal-body">Sinopsis : ${detailFilm.Plot}</div>
																					<div class="modal-footer">
																							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
																					</div>`;
							});
						});
					}
					
				} else {
					getMessageError('film not found');
				}
			},
			() => console.log("pengambilan data film eror")
		);
	} else {
		getMessageError('invalid search');
	}
}

// variabel untuk menampung url sesuai nama yang diinputkan user
const userInput = document.querySelector(".input-film");

function urlFilm(nama) {
	return `http://www.omdbapi.com/?apikey=65b5aaad&s=${nama}`;
}

const formWrapper = document.querySelector(".form-wrapper");
function getMessageError(error) {
	switch (error) {
		case 'film not found':
			createBoxError('Film tidak ditemukan !');	
			break;
		case 'invalid search':
			createBoxError('Nama film yang anda masukkan kurang spesifik !!!');	
			break;
		default:
			break;
	}
}

function createBoxError(errorMessage) {
	const boxError = document.createElement("div");
			boxError.classList.add("alert", "alert-danger", "mx-5");
			boxError.innerText = errorMessage;
			formWrapper.appendChild(boxError);
		
			setTimeout(() => {
				boxError.classList.add("hide-alert");
				formWrapper.appendChild(boxError);
			}, 1000)
}
