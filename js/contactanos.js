   // --- Configuración de Supabase ---
   const SUPABASE_URL = "https://banmupakbakpjzcawjrc.supabase.co";
   const SUPABASE_KEY =
     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbm11cGFrYmFrcGp6Y2F3anJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTQ3NzgsImV4cCI6MjA3NjM5MDc3OH0.66kLmy82jDq4RyQ1vckZEMpl2KZx1TUm6xNuHFm1Dy8";
   const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

   // --- CAPTCHA ---
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
     document.getElementById('captcha-answer').value = "";
   }

   window.onload = generarCaptcha;

   // --- Envío del formulario ---
   document.getElementById("contact-form").addEventListener("submit", async (e) => {
     e.preventDefault();

     const nombre = document.getElementById("name").value.trim();
     const email = document.getElementById("email").value.trim();
     const mensaje = document.getElementById("message").value.trim();
     const respuesta = parseInt(document.getElementById("captcha-answer").value.trim());
     const formMessage = document.getElementById("form-message");

     if (!nombre || !email || !mensaje) {
       formMessage.textContent = "⚠️ Por favor completa todos los campos.";
       formMessage.style.color = "orange";
       return;
     }

     if (isNaN(respuesta) || respuesta !== captchaCorrectAnswer) {
       formMessage.textContent = "⚠️ Respuesta de captcha incorrecta. Intenta de nuevo.";
       formMessage.style.color = "orange";
       generarCaptcha(); // regenerar operación
       return;
     }

     const { error } = await supabaseClient.from("contacto").insert([{ nombre, email, mensaje }]);

     if (error) {
       formMessage.textContent = "❌ Error al enviar el mensaje.";
       formMessage.style.color = "red";
     } else {
       formMessage.textContent = "✅ Mensaje enviado correctamente.";
       formMessage.style.color = "green";
       document.getElementById("contact-form").reset();
       generarCaptcha();
     }
   });