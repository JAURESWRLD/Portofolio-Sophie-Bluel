import { allWorks, afficherGallerie } from './afficherGalerie.js';

async function getCategories() {
  const CategoriesUrl = 'http://localhost:5678/api/categories';
  try {
    const response = await fetch (CategoriesUrl);
    if (!response.ok){
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    if (Array.isArray(result)){
    const categories = result.map(cat => cat.name);
    const allCategories = ['tous', ...new Set(categories)];

    const container = document.querySelector('.filters');
    allCategories.forEach(category => {
      const boutton = document.createElement('button');
      boutton.textContent = category;
      boutton.classList.add('btn-filter');
      boutton.addEventListener('click', ()=> {

      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      boutton.classList.add('active');
      
      const filteredCategory = (category === 'tous')
      ? allWorks
      : allWorks.filter(work => work.category.name === category)

      afficherGallerie(filteredCategory)
      })
    container.appendChild(boutton);
    })
    }
  } catch (error) {
    console.error(error.message)
  }
}
getCategories();


