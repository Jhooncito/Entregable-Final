 const floatingBtn = document.getElementById('floatingBtn');
    const iframeContainer = document.getElementById('iframeContainer');
    const closeBtn = document.getElementById('closeBtn');

    // Abrir iframe al hacer clic en el botón flotante
    floatingBtn.addEventListener('click', function() {
      iframeContainer.classList.add('show');
      floatingBtn.classList.add('active');
    });

    // Cerrar iframe al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', function() {
      iframeContainer.classList.remove('show');
      floatingBtn.classList.remove('active');
    });

    // Opcional: cerrar al hacer clic fuera del iframe
    document.addEventListener('click', function(event) {
      if (!iframeContainer.contains(event.target) && 
          !floatingBtn.contains(event.target) && 
          iframeContainer.classList.contains('show')) {
        iframeContainer.classList.remove('show');
        floatingBtn.classList.remove('active');
      }
    });