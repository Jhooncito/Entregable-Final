// ✅ Verificar sesión al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  const authButtons = document.getElementById("auth-buttons");
  const userInfo = document.getElementById("user-info");
  const nombreUsuario = document.getElementById("nombre-usuario");
  const logoutBtn = document.getElementById("logout");

  // Verificar si los elementos existen antes de manipularlos
  if (!authButtons || !userInfo || !nombreUsuario) {
    console.error("No se encontraron los elementos necesarios en el DOM");
    return;
  }

  // Si hay usuario logueado
  if (usuario) {
    // Mostrar nombre del usuario (probar ambas propiedades)
    nombreUsuario.textContent = usuario.nombres || usuario.usuario || "Usuario";
    
    // Ocultar botones de login/registro
    authButtons.style.display = "none";
    
    // Mostrar información del usuario
    userInfo.style.display = "flex";
  } else {
    // Si NO hay sesión activa
    authButtons.style.display = "block";
    userInfo.style.display = "none";
  }

  // Configurar botón de cerrar sesión
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Confirmar antes de cerrar sesión
      if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
        localStorage.removeItem("usuarioActual");
        alert("Sesión cerrada exitosamente.");
        window.location.reload();
      }
    });
  }
});

    

// Revisar si hay sesión activa al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

  if (usuarioActual) {
    authButtons.style.display = "none";      // Ocultar login/registro
    userInfo.style.display = "block";        // Mostrar info del usuario
    nombreUsuario.textContent = usuarioActual.usuario;
  } else {
    authButtons.style.display = "block";
    userInfo.style.display = "none";
  }
});

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("usuarioActual");
  authButtons.style.display = "block";
  userInfo.style.display = "none";
  alert("Sesión cerrada exitosamente.");
  location.reload();
});
