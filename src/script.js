// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Header scroll effect
  const header = document.querySelector(".header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // Active navigation link highlighting
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Contact form handling
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const service = formData.get("service");
    const message = formData.get("message");

    // Basic validation
    if (!name || !phone || !service) {
      showNotification("Будь ласка, заповніть всі обов'язкові поля", "error");
      return;
    }

    // Phone validation (Ukrainian format)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      showNotification(
        "Будь ласка, введіть корректний номер телефону",
        "error"
      );
      return;
    }

    // Email validation (if provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification("Будь ласка, введіть корректну email адресу", "error");
        return;
      }
    }

    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.textContent = "Відправляємо...";
    submitButton.disabled = true;
    contactForm.classList.add("loading");

    // Simulate API call
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      contactForm.classList.remove("loading");

      showNotification(
        "Дякуємо! Ваш запит надіслано. Ми зв'яжемося з вами найближчим часом.",
        "success"
      );
      contactForm.reset();
    }, 2000);
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(".service-card, .team-member, .stat")
    .forEach((el) => {
      el.style.animationPlayState = "paused";
      observer.observe(el);
    });

  // Counter animation for stats
  const statsSection = document.querySelector(".about-stats");
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          animateStats();
          statsAnimated = true;
        }
      });
    },
    { threshold: 0.5 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateStats() {
    const stats = [
      {
        element: document.querySelector(".stat:nth-child(1) .stat-number"),
        target: 15,
        suffix: "+",
      },
      {
        element: document.querySelector(".stat:nth-child(2) .stat-number"),
        target: 1000,
        suffix: "+",
      },
      {
        element: document.querySelector(".stat:nth-child(3) .stat-number"),
        target: 95,
        suffix: "%",
      },
      {
        element: document.querySelector(".stat:nth-child(4) .stat-number"),
        target: 24,
        suffix: "/7",
      },
    ];

    stats.forEach((stat) => {
      if (stat.element) {
        animateCounter(stat.element, stat.target, stat.suffix);
      }
    });
  }

  function animateCounter(element, target, suffix = "") {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, stepTime);
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    document.body.appendChild(notification);

    // Close notification on click
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        notification.remove();
      });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  // Add notification styles dynamically
  const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            z-index: 10000;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease;
        }
        
        .notification-success {
            background: #27ae60;
            color: white;
        }
        
        .notification-error {
            background: #e74c3c;
            color: white;
        }
        
        .notification-info {
            background: #3498db;
            color: white;
        }
        
        .notification-content {
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .notification-message {
            flex-grow: 1;
            margin-right: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

  // Add styles to document
  const styleSheet = document.createElement("style");
  styleSheet.textContent = notificationStyles;
  document.head.appendChild(styleSheet);

  // Phone number formatting
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      if (value.startsWith("380")) {
        value = "+" + value;
      } else if (value.startsWith("0")) {
        value = "+38" + value;
      } else if (value.length > 0 && !value.startsWith("+")) {
        value = "+38" + value;
      }

      // Format as +38 (0XX) XXX-XX-XX
      if (value.length >= 4) {
        value = value.replace(
          /(\+38)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/,
          function (match, p1, p2, p3, p4, p5) {
            let formatted = p1;
            if (p2) formatted += " (" + p2;
            if (p3) formatted += ") " + p3;
            if (p4) formatted += "-" + p4;
            if (p5) formatted += "-" + p5;
            return formatted;
          }
        );
      }

      e.target.value = value;
    });
  }

  // Back to top button
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = "↑";
  backToTopButton.className = "back-to-top";
  backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #3498db, #2c3e50);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    `;

  document.body.appendChild(backToTopButton);

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.style.opacity = "1";
      backToTopButton.style.visibility = "visible";
    } else {
      backToTopButton.style.opacity = "0";
      backToTopButton.style.visibility = "hidden";
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Hover effects for service cards
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Loading screen (optional)
  window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 300);
    }
  });

  // Service selection auto-scroll
  const serviceLinks = document.querySelectorAll('a[href="#services"]');
  serviceLinks.forEach((link) => {
    link.addEventListener("click", function () {
      setTimeout(() => {
        const firstServiceCard = document.querySelector(".service-card");
        if (firstServiceCard) {
          firstServiceCard.style.animation = "pulse 0.6s ease";
        }
      }, 800);
    });
  });

  // Add pulse animation
  const pulseStyles = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;

  const pulseStyleSheet = document.createElement("style");
  pulseStyleSheet.textContent = pulseStyles;
  document.head.appendChild(pulseStyleSheet);

  console.log(
    'Сайт адвокатського об\'єднання "Правовий захист" завантажено успішно!'
  );
});
