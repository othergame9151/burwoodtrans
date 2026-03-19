const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("open");
    });
  });
}

const form = document.querySelector("#enquiry-form");

if (form) {
  const fields = [
    {
      id: "name",
      validate: (value) => value.trim().length >= 2,
      message: "Please enter your name."
    },
    {
      id: "phone",
      validate: (value) => /^[0-9+()\s-]{8,}$/.test(value.trim()),
      message: "Please enter a valid phone number."
    },
    {
      id: "email",
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Please enter a valid email address."
    },
    {
      id: "message",
      validate: (value) => value.trim().length >= 10,
      message: "Please enter a message with a few details."
    }
  ];

  const setFieldState = (field, valid) => {
    const input = document.getElementById(field.id);
    const error = document.getElementById(`${field.id}-error`);
    if (!input || !error) return;

    input.setAttribute("aria-invalid", String(!valid));
    error.textContent = valid ? "" : field.message;
  };

  fields.forEach((field) => {
    const input = document.getElementById(field.id);
    if (!input) return;

    input.addEventListener("blur", () => {
      setFieldState(field, field.validate(input.value));
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;

    fields.forEach((field) => {
      const input = document.getElementById(field.id);
      if (!input) return;

      const valid = field.validate(input.value);
      setFieldState(field, valid);

      if (!valid && !firstInvalid) {
        firstInvalid = input;
      }
    });

    const status = document.getElementById("form-status");

    if (firstInvalid) {
      if (status) {
        status.textContent = "Please review the highlighted fields and try again.";
      }
      firstInvalid.focus();
      return;
    }

    form.reset();
    fields.forEach((field) => setFieldState(field, true));

    if (status) {
      status.textContent = "Thanks for your enquiry. We will be in touch shortly.";
    }
  });
}

const revealItems = document.querySelectorAll(
  ".service-card, .vehicle-card, .testimonial-card, .feature-list article, .media-frame"
);

if ("IntersectionObserver" in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
}
