// ============================================
// ОСНОВНОЙ JS ФАЙЛ ДЛЯ АВТОСЕРВИСА
// Функции: гамбургер-меню, маска телефона, отправка форм
// ============================================
//Дата в российском формате
function formatRu(date) {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Маска для телефона: +7(999) 999-99-99
function setPhoneMask() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      let value = this.value.replace(/\D/g, "");

      // Убираем все кроме цифр
      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      let formattedValue = "";

      if (value.length === 0) {
        formattedValue = "";
      } else {
        // Форматируем как +7(999) 999-99-99
        if (value[0] === "7") {
          formattedValue = "+7";
        } else if (value[0] === "8") {
          formattedValue = "+7";
          value = "7" + value.slice(1);
        } else {
          formattedValue = "+7";
          value = "7" + value;
        }

        if (value.length > 1) {
          formattedValue += "(" + value.slice(1, 4);
        }
        if (value.length >= 4) {
          formattedValue += ") " + value.slice(4, 7);
        }
        if (value.length >= 7) {
          formattedValue += "-" + value.slice(7, 9);
        }
        if (value.length >= 9) {
          formattedValue += "-" + value.slice(9, 11);
        }
      }

      this.value = formattedValue;

      // Сохраняем чистый номер в data-атрибут для отправки
      if (value.length === 11) {
        this.setAttribute("data-clean", "+" + value);
      } else {
        this.setAttribute("data-clean", "");
      }
    });

    // Ставим курсор в конец при фокусе
    input.addEventListener("focus", function () {
      if (this.value === "") {
        this.value = "+7";
      }
      const len = this.value.length;
      this.setSelectionRange(len, len);
    });

    // Если поле пустое, при потере фокуса очищаем
    input.addEventListener("blur", function () {
      if (this.value === "+7") {
        this.value = "";
      }
    });
  });
}

// Гамбургер-меню
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
      });
    });
  }
}

// Анимация fade-in
function initFadeInAnimation() {
  const fadeElements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear");
        }
      });
    },
    { threshold: 0.1 },
  );

  fadeElements.forEach((el) => observer.observe(el));
}

// Показать уведомление
function showNotification(message, isError = false) {
  const notification = document.createElement("div");
  notification.className = "notification" + (isError ? " error" : "");
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// Валидация телефона
function validatePhone(phone) {
  const cleanPhone = phone.replace(/\D/g, "");
  return (
    cleanPhone.length === 11 && (cleanPhone[0] === "7" || cleanPhone[0] === "8")
  );
}

// Инициализация всех форм
function initForms() {
  // Форма записи на сервис (services.html)
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name")?.value.trim();
      const phone = document.getElementById("phone")?.value;
      const email = document.getElementById("email")?.value;
      const car = document.getElementById("car")?.value.trim();
      const service = document.getElementById("service")?.value;
      const date = document.getElementById("date")?.value;

      const time = document.getElementById("time")?.value;
      const comment = document.getElementById("comment")?.value || "";

      

      // Валидация
      if (!name || !phone || !car || !date) {
        showNotification("Пожалуйста, заполните все обязательные поля!", true);
        return;
      }

      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length !== 11) {
        showNotification(
          "Введите полный номер телефона в формате +7(XXX) XXX-XX-XX",
          true,
        );
        return;
      }

      // Формируем письмо
      const serviceName = service
        ? document.querySelector(`#service option[value="${service}"]`)
            ?.textContent || service
        : "не выбрана";
        
      const emailBody = `
Новая заявка на ремонт автомобиля!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ДАТА И ВРЕМЯ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Дата: ${date}
Время: ${time || "не указано"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ИНФОРМАЦИЯ О КЛИЕНТЕ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Имя: ${name}
Телефон: ${phone}
Email: ${email || "не указан"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ИНФОРМАЦИЯ ОБ АВТОМОБИЛЕ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Марка и модель: ${car}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
УСЛУГА:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${serviceName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
КОММЕНТАРИЙ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${comment || "без комментария"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Отправлено с сайта автосервиса
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `;

      const subject = encodeURIComponent(
        `Заявка на ремонт от ${name} (${date})`,
      );
      const body = encodeURIComponent(emailBody);
      window.location.href = `mailto:fackhiev88@mail.ru?subject=${subject}&body=${body}`;

      showNotification(
        "✅ Заявка отправлена! Если откроется почтовый клиент для подтверждения.",
      );

      // Опционально: очистить форму
      // bookingForm.reset();
    });
  }

  // Форма обратной связи (contacts.html)
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("fb_name")?.value.trim();
      const email = document.getElementById("fb_email")?.value.trim();
      const message = document.getElementById("fb_message")?.value.trim();

      if (!name || !email || !message) {
        showNotification("Пожалуйста, заполните все поля!", true);
        return;
      }

      const emailBody = `
Сообщение от ${name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email для ответа: ${email}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ТЕКСТ СООБЩЕНИЯ:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Отправлено с формы обратной связи автосервиса
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `;

      const subject = encodeURIComponent(`Сообщение от ${name}`);
      const body = encodeURIComponent(emailBody);
      window.location.href = `mailto:fackhiev88@mail.ru?subject=${subject}&body=${body}`;

      showNotification("✅ Сообщение отправлено! Если откроется почтовый клиент.");
    });
  }

  // Форма записи на главной
  const mainForm = document.getElementById("mainBookingForm");
  if (mainForm) {
    mainForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("main_name")?.value.trim();
      const phone = document.getElementById("main_phone")?.value;
      const date = document.getElementById("main_date")?.value;

      if (!name || !phone || !date) {
        showNotification("Пожалуйста, заполните все поля!", true);
        return;
      }

      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone.length !== 11) {
        showNotification(
          "Введите полный номер телефона в формате +7(XXX) XXX-XX-XX",
          true,
        );
        return;
      }

      const emailBody = `
Быстрая запись с главной страницы

Имя: ${name}
Телефон: ${phone}
Желаемая дата: ${date}

Отправлено с главной страницы автосервиса
            `;

      const subject = encodeURIComponent(`Быстрая запись от ${name}`);
      const body = encodeURIComponent(emailBody);
      window.location.href = `mailto:fackhiev88@mail.ru?subject=${subject}&body=${body}`;
      // Запись в буфер
      
      //navigator.clipboard.writeText('fackhiev88@mail.ru ' +emailBody)
        //.then(() => {
          //console.log('Текст успешно скопирован в буфер!');
        //})
        //.catch(err => {
          //console.error('Ошибка при копировании: ', err);
        //});
      showNotification("✅ Запись отправлена! Если откроется почтовый клиент.");
    });
  }
}

// Инициализация телефонных и email ссылок
function initContactLinks() {
  // Телефонные ссылки уже работают через href="tel:"
  // Добавляем статистику при необходимости
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach((link) => {
    link.addEventListener("click", function () {
      console.log("Набор номера:", this.getAttribute("href"));
    });
  });

  // Email ссылки
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach((link) => {
    link.addEventListener("click", function () {
      console.log("Открытие почты:", this.getAttribute("href"));
    });
  });
}


    
// Запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  setPhoneMask();
  initMobileMenu();
  initFadeInAnimation();
  initForms();
  initContactLinks();
});

//Открыть карту
document.getElementById('linkMap').onclick = function() {
        myMap.setCenter([59.93, 30.33], 12); // Санкт-Петербург
        myPlacemark.geometry.setCoordinates([59.93, 30.33]);
    };
