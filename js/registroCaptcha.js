    // ✅ Conexión a Supabase
    const SUPABASE_URL = "https://banmupakbakpjzcawjrc.supabase.co";
    const SUPABASE_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbm11cGFrYmFrcGp6Y2F3anJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTQ3NzgsImV4cCI6MjA3NjM5MDc3OH0.66kLmy82jDq4RyQ1vckZEMpl2KZx1TUm6xNuHFm1Dy8";
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Variables para el captcha
    let captchaCorrectAnswer = null;

    function generarCaptcha() {
      const num1 = Math.floor(Math.random() * 20) + 1;
      const num2 = Math.floor(Math.random() * 20) + 1;
      const operaciones = ["+", "-"];
      const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];

      let pregunta = "";
      if (operacion === "+") {
        captchaCorrectAnswer = num1 + num2;
        pregunta = `¿Cuánto es ${num1} + ${num2}?`;
      } else {
        // Para evitar respuestas negativas, restar menor de mayor
        const mayor = Math.max(num1, num2);
        const menor = Math.min(num1, num2);
        captchaCorrectAnswer = mayor - menor;
        pregunta = `¿Cuánto es ${mayor} - ${menor}?`;
      }
      document.getElementById("captcha-question").textContent = pregunta;
    }

    generarCaptcha();

    document.getElementById("registro-form").addEventListener("submit", async (e) => {
      e.preventDefault();

      const usuario = document.getElementById("usuario").value.trim();
      const nombres = document.getElementById("nombres").value.trim();
      const apellidos = document.getElementById("apellidos").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmar = document.getElementById("confirmar").value.trim();
      const pais = document.getElementById("pais").value.trim();
      const fecha = document.getElementById("fecha").value;
      const mensaje = document.getElementById("mensaje");
      const captchaAnswer = document.getElementById("captcha-answer").value.trim();
      const captchaError = document.getElementById("captcha-error");

      // Ocultar error de captcha por defecto
      captchaError.style.display = "none";
      mensaje.textContent = "";

      // Validar CAPTCHA
      if (parseInt(captchaAnswer, 10) !== captchaCorrectAnswer) {
        captchaError.style.display = "block";
        // Regenerar captcha para nueva oportunidad
        generarCaptcha();
        document.getElementById("captcha-answer").value = "";
        document.getElementById("captcha-answer").focus();
        return;
      }

      // Validar contraseñas
      if (password !== confirmar) {
        mensaje.textContent = "⚠️ Las contraseñas no coinciden.";
        mensaje.style.color = "orange";
        return;
      }

      // Insertar en Supabase
      const { error } = await supabaseClient
        .from("registro") // nombre exacto de tu tabla
        .insert([{ usuario, nombres, apellidos, email, password, pais, fecha }]); // coincide con tus columnas

      if (error) {
        console.error("Error al registrar:", error);
        mensaje.textContent = "❌ Error al registrar: " + error.message;
        mensaje.style.color = "red";
      } else {
        mensaje.textContent = "✅ Registro exitoso. Redirigiendo...";
        mensaje.style.color = "green";
        e.target.reset();
        generarCaptcha(); // refrescar captcha tras envío

        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      }
    });