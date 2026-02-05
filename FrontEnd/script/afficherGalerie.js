export let allWorks =[];
const WorksUrl = 'http://localhost:5678/api/works';



/////////////////////fonction afficherGallerie///////
export function afficherGallerie (data){
    const galerie = document.querySelector('.gallery');
    galerie.innerHTML = '';
    if (Array.isArray(data)) {
        data.forEach(item => {
            const figure = document.createElement('figure'); 
            figure.dataset.id = item.id; 
            const img = document.createElement('img');
            img.src = item.imageUrl;
            img.alt = item.title;
            const caption = document.createElement('figcaption');
            caption.textContent = item.title;
            figure.appendChild(img);
            figure.appendChild(caption);
            galerie.appendChild(figure);
        });
    }else {
        console.error("L'API n'a pas renvoyé un tableau de données valide.");
        galerie.innerHTML = "<p>Erreur de format de données API.</p>";
    }
}


fetch(WorksUrl)
  .then(response => {
	if (!response.ok) {
			  throw new Error('Network response was not ok ' + response.statusText);
	}
	return response.json();
  })
  .then(data => {
    allWorks = data;
    afficherGallerie(allWorks);
}
)
  .catch(error => {console.error('Error fetching data:', error);
    const galerie = document.querySelector('.gallery');
    galerie.innerHTML = "<p>Erreur lors du chargement des données.</p>";
  }
);




