"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navigationLinks = document.querySelectorAll(".nav-links a");
const currentYear = document.querySelector("#current-year");

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  menuToggle.classList.remove("active");
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const menuIsOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("active", menuIsOpen);
    document.body.classList.toggle("menu-open", menuIsOpen);
    menuToggle.setAttribute("aria-expanded", String(menuIsOpen));
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      closeMenu();
    }
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
const galleryFilterButtons = document.querySelectorAll(".gallery-filter");
const tattooGalleryCards = document.querySelectorAll(".tattoo-card");

if (galleryFilterButtons.length > 0 && tattooGalleryCards.length > 0) {
  galleryFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      galleryFilterButtons.forEach((filterButton) => {
        filterButton.classList.remove("active");
        filterButton.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      tattooGalleryCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        const shouldShow =
          selectedFilter === "all" || selectedFilter === cardCategory;

        card.hidden = !shouldShow;
      });
    });
  });
}
const bookingForm = document.querySelector("#booking-form");
const tattooDescription = document.querySelector("#tattoo-description");
const descriptionCount = document.querySelector("#description-count");
const formSuccess = document.querySelector("#form-success");

if (tattooDescription && descriptionCount) {
  tattooDescription.setAttribute("maxlength", "1000");

  tattooDescription.addEventListener("input", () => {
    descriptionCount.textContent =
      `${tattooDescription.value.length} / 1000`;
  });
}

function showFieldError(field, message) {
  field.classList.add("invalid");
  field.setAttribute("aria-invalid", "true");

  const formGroup = field.closest(".form-group");
  const errorElement = formGroup?.querySelector(".field-error");

  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearFieldError(field) {
  field.classList.remove("invalid");
  field.removeAttribute("aria-invalid");

  const formGroup = field.closest(".form-group");
  const errorElement = formGroup?.querySelector(".field-error");

  if (errorElement) {
    errorElement.textContent = "";
  }
}

function validateBookingField(field) {
  clearFieldError(field);

  if (field.type === "checkbox" && field.required && !field.checked) {
    showFieldError(field, "Please confirm this requirement.");
    return false;
  }

  if (field.required && !field.value.trim()) {
    showFieldError(field, "This field is required.");
    return false;
  }

  if (field.type === "email" && field.value.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(field.value.trim())) {
      showFieldError(field, "Enter a valid email address.");
      return false;
    }
  }

  if (field.id === "tattoo-description") {
    if (field.value.trim().length < 20) {
      showFieldError(
        field,
        "Please provide at least 20 characters about your tattoo idea."
      );

      return false;
    }
  }

  return true;
}

if (bookingForm) {
  const bookingFields = bookingForm.querySelectorAll(
    "input, select, textarea"
  );

  bookingFields.forEach((field) => {
    const eventType =
      field.tagName === "SELECT" || field.type === "checkbox"
        ? "change"
        : "input";

    field.addEventListener(eventType, () => {
      if (field.classList.contains("invalid")) {
        validateBookingField(field);
      }
    });
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let formIsValid = true;
    let firstInvalidField = null;

    bookingFields.forEach((field) => {
      if (!validateBookingField(field)) {
        formIsValid = false;

        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    if (!formIsValid) {
      firstInvalidField?.focus();
      formSuccess.hidden = true;
      return;
    }

    formSuccess.hidden = false;
    formSuccess.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    bookingForm.reset();

    if (descriptionCount) {
      descriptionCount.textContent = "0 / 1000";
    }
  });
}