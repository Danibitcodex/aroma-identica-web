// Small UI interactions: nav toggle and simple contact form handling
document.addEventListener('DOMContentLoaded',function(){
  var toggle=document.getElementById('nav-toggle');
  var nav=document.getElementById('main-nav');
  if(toggle && nav){
    toggle.addEventListener('click',function(){
      var open = nav.classList.toggle('open');
      var expanded = open ? 'true' : 'false';
      toggle.setAttribute('aria-expanded', expanded);
    });
  }

  var form=document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var name=document.getElementById('name').value.trim();
      var email=document.getElementById('email').value.trim();
      var message=document.getElementById('message').value.trim();
      if(!name || !email || !message){
        alert('Por favor completa todos los campos antes de enviar.');
        return;
      }
      // For a static site we can't send email from JS; provide a mailto fallback
      var mailto = 'mailto:info@aroma-medida.example'
        + '?subject=' + encodeURIComponent('Contacto desde web: ' + name)
        + '&body=' + encodeURIComponent(message + '\n\nCorreo: ' + email);
      window.location.href = mailto;
    });
  }
});
