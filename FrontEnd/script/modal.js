import { allWorks, afficherGallerie } from "./afficherGalerie.js";
const boiteModale = document.getElementById('myModal');
const ouvrirModalBtn = document.getElementById('openModal');
const fermerModalBtn = document.getElementById('closeModal');
const contenaireImage = document.querySelector('.contenaireImage')
const mainContent = document.querySelector('main');


////////////////FUNCTION MODAL//////////////////////
function renderModalGalery() {
    contenaireImage.innerHTML = '';

    if (Array.isArray(allWorks)) {
        allWorks.forEach(item => {
            const elementImage = document.createElement('figure');
            elementImage.classList.add('element-image');
            elementImage.style.position = 'relative';
            elementImage.dataset.id = item.id;

            const image = document.createElement('img');
            image.src = item.imageUrl;
            image.alt = item.title;

            const iconOverlay = document.createElement('div');
            iconOverlay.classList.add('icon-delete');
            iconOverlay.style.position = 'absolute';
            
            // Événement de suppression
            iconOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                
                   window.Swal.fire({
                    title: "Êtes-vous sûr ?",
                    text: "Cette action est irréversible !",
                    icon: "warning",
                    target: document.getElementById('myModal'), 
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Oui, supprimer !",
                    cancelButtonText: "Annuler",
                    
                    returnFocus: false, 
                    didOpen: () => {
                        const modal = document.getElementById('myModal');
                        if (modal) modal.removeAttribute('aria-hidden');
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        supprimerProjet(item.id);
                        elementImage.remove(); 
                        
                        window.Toastify({ 
                            text: "Projet supprimé avec succès !", 
                            duration: 2000,
                            gravity: "top",
                            position: "center",
                            selector: document.getElementById('myModal'), 
                            style: { 
                                background: "#1D612D",
                                position: "absolute" // Indispensable pour qu'il se place bien dans la modale
                            } 
                        }).showToast();
                    }
                });
            });

            const icon = document.createElement('i');
            icon.classList.add('fa-solid', 'fa-trash-can');

            // Assemblage
            iconOverlay.appendChild(icon);
            elementImage.appendChild(image);
            elementImage.appendChild(iconOverlay);
            contenaireImage.appendChild(elementImage);
        });
    }
}



///////////////SUPRIMER PROJET////////////
async function supprimerProjet (id){
    const token = localStorage.getItem('token');
    try {
        
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method : 'DELETE',
        headers : {
            'Authorization': `Bearer ${token}`
        }
    }) 
    if ((response).ok) {
        const projetASupprimer = document.querySelector(`.element-image[data-id = "${id}"]`);
        if (projetASupprimer) {
            projetASupprimer.remove()
        }
        const projetAccueilASupprimer = document.querySelector(`.gallery figure[data-id = "${id}"]`);
        if (projetAccueilASupprimer) {
            projetAccueilASupprimer.remove();
        }

        // Find the position of the item in the array
        const index = allWorks.findIndex(work => work.id === id);

        // If found, remove it directly from the original array
        if (index !== -1) {
            allWorks.splice(index, 1);
        }

        console.log(`Projet ${id} supprimé avec succès`);
    }else {
        Toastify({
            text: "Erreur lors de la suppression",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #f10f0fff, #fb1515ff)",
            },
        onClick: function(){} // Callback after click
        }).showToast();
    }
    } catch (error) {
        console.error('erreur reseau :', error);
    }
}

if(ouvrirModalBtn){
  ouvrirModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderModalGalery();
    boiteModale.showModal();
  })
}

if (fermerModalBtn) {
    fermerModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        boiteModale.close();
    });
}

boiteModale.addEventListener('click', (e) => {
    if (e.target === boiteModale) boiteModale.close();
});

////////////////////////addProjet

const btnAdd = document.querySelector('.btn-ajouter');
const deleteWorkModal = document.querySelector('.modal-delete-projet');
const addWorkModal = document.querySelector('.modal-add-projet');
const btnReturn = document.getElementById('backModal');

btnAdd.addEventListener('click', () => {
    deleteWorkModal.style.display = 'none';
    addWorkModal.style.display = 'block';
    btnReturn.style.display = 'block';
    ////////////charger les options categories
    loadCategorySelect();
})
btnReturn.addEventListener('click', () =>{
    deleteWorkModal.style.display = 'block';
    addWorkModal.style.display = 'none'; 
    btnReturn.style.display = 'none'   
})


const form = document.getElementById('form-ajout-projet');
const inputFile = document.getElementById('file-upload');
const inputTitle = document.getElementById('title');
const inputCategory = document.getElementById('category');



////////////preview Imgage////////
const previewImage = document.getElementById('image-preview');
const uploadContent = document.querySelectorAll('.upload-container i, .upload-container label, .upload-container p');

if (inputFile){
    inputFile.addEventListener('change', () => {
        const file = inputFile.files[0];

        if (file){
            if (file.size > 4 * 1024 * 1024) {
                alert("L'image est trop lourde (4Mo max)");
                inputFile.value = ""; // On vide l'input
                return;
            }
            const reader = new FileReader();

            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                            
                uploadContent.forEach(el => el.style.display = 'none');
            };
            reader.readAsDataURL(file);
        }
    })
}

////////////////VERIFICATION DES DONNEES
function validateForm() {

    const isTitleValid = inputTitle.value.trim().length > 0;
    
    const isCategoryValid = inputCategory.value !== "";
    
    const file = inputFile.files[0];
    const isFileValid = file && file.size <= 4 * 1024 * 1024;

    
    if (isTitleValid && isCategoryValid && isFileValid) {
        btnSubmit.disabled = false;
        btnSubmit.style.backgroundColor = '#1D6154';
    } else {
        btnSubmit.disabled = true;
        btnSubmit.style.backgroundColor = '#A7A7A7';
    }
}
const btnSubmit = document.getElementById('btn-valider')

inputTitle.addEventListener('input', validateForm);
inputCategory.addEventListener('change', validateForm);
inputFile.addEventListener('change', validateForm);


async function envoyerProjet(formData) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body : formData
        })
        if (response.ok) {
            const result = await response.json();
            console.log("Succès :", result);
            
            Toastify({
                text: "projet ajouter avec succes !",
                duration: 4000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #13db56ff)",
                },
            onClick: function(){} // Callback after click
            }).showToast();
            
            ////////////Extraire le nom de categorie depuis le select des options categorie dans la form
            const select = document.getElementById('category');
            const categoryName = select.options[select.selectedIndex].text;

            result.category = {
                id: parseInt(select.value),
                name: categoryName
            };

            allWorks.push(result);
            renderModalGalery();
            afficherGallerie(allWorks);

            form.reset();
            previewImage.style.display = 'none';
            uploadContent.forEach(el => el.style.display = 'block');
            btnSubmit.disabled = true;
            btnSubmit.style.backgroundColor = '#A7A7A7';
            boiteModale.close();
            resetModalView();
        } else {
            const errorDisplay = document.getElementById('modal-error-msg');
            errorDisplay.style.visibility = "hidden";
            errorDisplay.textContent = "";

            
        }

    } catch (error) {
        console.error("Erreur réseau :", error);
}
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (btnSubmit.disabled) return;
    const formData = new FormData(form); 
    envoyerProjet(formData);
});

// Function to reset the modal view to the gallery
function resetModalView() {
    deleteWorkModal.style.display = 'block';
    addWorkModal.style.display = 'none';
    btnReturn.style.display = 'none'; 
}


////Charger les categories
const categorySelect = document.getElementById('category');
async function loadCategorySelect() {
    try{
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();

        categorySelect.innerHTML = '<option value=""></option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name

            categorySelect.appendChild(option);
        });
    }catch (error){
        console.error("Erreur lors du chargement des catégories :", error);
    }
}