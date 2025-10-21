 const chatMessages = document.getElementById('chatMessages');
    
    const menus = {
      main: {
        message: '¿En qué podemos ayudarte hoy?',
        options: [
          { id: 1, text: 'Servicios de Networking', next: 'servicios' },
          { id: 2, text: 'Sedes y Ubicaciones', next: 'sedes' },
          { id: 3, text: 'Tecnologías que usamos', next: 'tecnologias' },
          { id: 4, text: 'Contacto y Soporte', next: 'contacto' }
        ]
      },
      servicios: {
        message: 'Nuestros servicios de Networking incluyen:',
        options: [
          { id: 1, text: 'Instalación de Redes', info: 'Diseñamos e instalamos redes empresariales de alto rendimiento con la última tecnología.' },
          { id: 2, text: 'Mantenimiento y Soporte', info: 'Soporte técnico 24/7 y mantenimiento preventivo para tu infraestructura de red.' },
          { id: 3, text: 'Seguridad de Red', info: 'Implementamos soluciones avanzadas de seguridad: firewalls, VPN, y protección contra amenazas.' },
          { id: 4, text: 'Consultoría IT', info: 'Asesoramiento experto para optimizar tu infraestructura tecnológica.' }
        ]
      },
      sedes: {
        message: 'Contamos con presencia en las principales ciudades:',
        options: [
          { id: 1, text: 'Lima - Sede Principal', info: 'Av. Principal 123, San Isidro, Lima\nTel: (01) 555-1234' },
          { id: 2, text: 'Arequipa', info: 'Calle Comercio 456, Cercado, Arequipa\nTel: (054) 555-5678' },
          { id: 3, text: 'Trujillo', info: 'Av. España 789, Trujillo\nTel: (044) 555-9012' },
          { id: 4, text: 'Cusco', info: 'Av. El Sol 321, Cusco\nTel: (084) 555-3456' }
        ]
      },
      tecnologias: {
        message: 'Trabajamos con las mejores tecnologías:',
        options: [
          { id: 1, text: 'Cisco Systems', info: 'Soluciones empresariales de networking, switches y routers de última generación.' },
          { id: 2, text: 'Fortinet', info: 'Seguridad de red avanzada con firewalls y protección contra amenazas.' },
          { id: 3, text: 'Ubiquiti', info: 'Equipos wireless de alto rendimiento para redes corporativas y residenciales.' },
          { id: 4, text: 'MikroTik', info: 'Soluciones versátiles de routing y networking para todo tipo de proyectos.' }
        ]
      },
      contacto: {
        message: 'Canales de contacto disponibles:',
        options: [
          { id: 1, text: 'Correo Electrónico', info: '📧 Email: contacto@telecomperu.com\nTiempo de respuesta: 24 horas' },
          { id: 2, text: 'WhatsApp Business', info: '📱 WhatsApp: +51 999 888 777\nAtención inmediata' },
          { id: 3, text: 'Teléfono', info: '📞 Central: (01) 555-1234\nLunes a Viernes: 8am - 6pm' },
          { id: 4, text: 'Visítanos', info: '🏢 Av. Principal 123, San Isidro, Lima\nLunes a Viernes: 9am - 5pm' }
        ]
      }
    };

    let currentMenu = 'main';
    let menuHistory = [];

    function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addMessage(text, isBot = true) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isBot ? 'bot' : 'user'}`;
      
      if (isBot) {
        messageDiv.innerHTML = `
          <div class="bot-avatar">💬</div>
          <div class="message-content">${text}</div>
        `;
      } else {
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
      }
      
      chatMessages.appendChild(messageDiv);
      scrollToBottom();
    }

    function showTyping() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message bot';
      typingDiv.id = 'typing';
      typingDiv.innerHTML = `
        <div class="bot-avatar">💬</div>
        <div class="message-content">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      `;
      chatMessages.appendChild(typingDiv);
      scrollToBottom();
    }

    function removeTyping() {
      const typing = document.getElementById('typing');
      if (typing) typing.remove();
    }

    function showOptions(menuKey) {
      const menu = menus[menuKey];
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options-container';
      
      menu.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.innerHTML = `
          <span class="option-number">${option.id}</span>
          <span>${option.text}</span>
        `;
        btn.onclick = () => handleOptionClick(option, menuKey);
        optionsDiv.appendChild(btn);
      });

      if (menuHistory.length > 0) {
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.textContent = '← Volver al menú anterior';
        backBtn.onclick = goBack;
        optionsDiv.appendChild(backBtn);
      }

      const lastBotMessage = chatMessages.querySelector('.message.bot:last-child');
      if (lastBotMessage) {
        lastBotMessage.appendChild(optionsDiv);
      }
      
      scrollToBottom();
    }

    function handleOptionClick(option, fromMenu) {
      // Remover opciones anteriores
      const allOptions = chatMessages.querySelectorAll('.options-container');
      allOptions.forEach(opt => opt.remove());

      // Agregar mensaje del usuario
      addMessage(`${option.id}. ${option.text}`, false);

      showTyping();

      setTimeout(() => {
        removeTyping();

        if (option.info) {
          // Es una opción final con información
          addMessage(option.info);
          
          setTimeout(() => {
            addMessage('¿Necesitas algo más? 😊');
            showOptions(currentMenu);
          }, 1000);
        } else if (option.next) {
          // Es una opción que lleva a otro menú
          menuHistory.push(currentMenu);
          currentMenu = option.next;
          addMessage(menus[currentMenu].message);
          showOptions(currentMenu);
        }
      }, 1000);
    }

    function goBack() {
      if (menuHistory.length > 0) {
        // Remover opciones actuales
        const allOptions = chatMessages.querySelectorAll('.options-container');
        allOptions.forEach(opt => opt.remove());

        currentMenu = menuHistory.pop();
        
        showTyping();
        setTimeout(() => {
          removeTyping();
          addMessage('Volviendo al menú anterior...');
          setTimeout(() => {
            addMessage(menus[currentMenu].message);
            showOptions(currentMenu);
          }, 500);
        }, 800);
      }
    }

    // Inicializar chat
    setTimeout(() => {
      showTyping();
      setTimeout(() => {
        removeTyping();
        addMessage(menus.main.message);
        showOptions('main');
      }, 1500);
    }, 500);