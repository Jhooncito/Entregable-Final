const SUPABASE_URL = "https://banmupakbakpjzcawjrc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbm11cGFrYmFrcGp6Y2F3anJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTQ3NzgsImV4cCI6MjA3NjM5MDc3OH0.66kLmy82jDq4RyQ1vckZEMpl2KZx1TUm6xNuHFm1Dy8";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let captchaCorrectAnswer;

function generarCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operaciones = ['+', '-'];
  const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];

  let pregunta = "";
  if (operacion === '+') {
    captchaCorrectAnswer = num1 + num2;
    pregunta = `¿Cuánto es ${num1} + ${num2}?`;
  } else {
    const mayor = Math.max(num1, num2);
    const menor = Math.min(num1, num2);
    captchaCorrectAnswer = mayor - menor;
    pregunta = `¿Cuánto es ${mayor} - ${menor}?`;
  }

  document.getElementById('captcha-question').textContent = pregunta;
}

window.onload = () => {
  generarCaptcha();
};

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();
  const captchaRespuesta = document.getElementById("captcha-answer").value.trim();
  const mensaje = document.getElementById("mensaje");

  if (parseInt(captchaRespuesta) !== captchaCorrectAnswer) {
    mensaje.textContent = "⚠️ Respuesta de captcha incorrecta. Intenta de nuevo.";
    mensaje.style.color = "orange";
    generarCaptcha(); // regenerar captcha al fallar
    document.getElementById("captcha-answer").value = "";
    return;
  }

  // Buscar usuario insensible a mayúsculas
  const { data, error } = await supabaseClient
    .from("registro")
    .select("*")
    .ilike("usuario", usuario)
    .maybeSingle();

  if (error) {
    mensaje.textContent = "❌ Error al buscar usuario: " + error.message;
    mensaje.style.color = "red";
    return;
  }

  if (!data) {
    mensaje.textContent = "⚠️ Usuario no encontrado.";
    mensaje.style.color = "orange";
    return;
  }

  if (data.password !== password) {
    mensaje.textContent = "⚠️ Contraseña incorrecta.";
    mensaje.style.color = "orange";
    return;
  }

  localStorage.setItem("usuarioActual", JSON.stringify(data));

  mensaje.textContent = "✅ Inicio de sesión correcto. Redirigiendo...";
  mensaje.style.color = "green";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
});