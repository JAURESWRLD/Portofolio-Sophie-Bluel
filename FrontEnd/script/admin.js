function admnistrator(){
  const token = localStorage.getItem('token');
  const btnModifier = document.querySelector('.icon-modifier');
  const loginLink = document.querySelector('nav ul li a[href= "login.html"]');

  if (token){
    if (btnModifier) btnModifier.style.display = 'flex';
    if (!btnModifier) return; 
    
    if (loginLink) {
      loginLink.textContent = 'logout';
      loginLink.href = '#';
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');

        window.location.href ='index.html';
      })
    }else {
      if (btnModifier) btnModifier.style.display = 'none';
    }
  }
}





admnistrator();