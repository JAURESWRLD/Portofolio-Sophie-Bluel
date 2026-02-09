function admnistrator(){
  const token = localStorage.getItem('token');
  const btnModifier = document.querySelector('.icon-modifier');
  const loginLink = document.querySelector('nav ul li a[href= "login.html"]');
  const editionBar = document.querySelector('.edit-bar');
  const filtersContainer = document.querySelector('.filters');

  if (token){
    if (btnModifier) btnModifier.style.display = token ? 'flex' : 'none';
    if (editionBar) editionBar.style.display = token ? 'block' : 'none';
    if (filtersContainer) filtersContainer.style.display = token ? 'none' : 'flex';
    if (!btnModifier) return; 
    
    if (loginLink) {
      loginLink.textContent = 'logout';
      loginLink.href = '#';
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');

        window.location.href ='index.html';
      })
    }
  }
}





admnistrator();