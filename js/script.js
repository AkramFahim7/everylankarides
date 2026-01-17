/**
 * Every Lanka Rides - Complete Website Logic
 * Functionality: AOS, Smooth Scroll, Counter, EmailJS + Detailed WhatsApp Redirect
 */

// ==========================================
// 1. AOS Animation Initialization
// ==========================================
AOS.init({
    duration: 1000,
    once: true,
    easing: 'ease-in-out'
});

// ==========================================
// 2. Initialize EmailJS
// ==========================================
(function () {
    // Verified Public Key
    emailjs.init("oaHq_Y0TATIwXteRb");
})();

// ==========================================
// 3. Global Smooth Scroll & Form Focus
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            if (targetId === '#contact' || targetId === '#booking') {
                setTimeout(() => {
                    const firstInput = document.querySelector('#contactBookingForm input[type="text"]');
                    if (firstInput) firstInput.focus();
                }, 800);
            }
        }
    });
});

// ==========================================
// 4. About Section Counter Animation (FIXED)
// ==========================================

// Select ONLY counters that should animate
const statsElements = document.querySelectorAll(
  '.stat-item h3:not(.no-counter)'
);

const animationSpeed = 200;

const startCounter = () => {
  statsElements.forEach(counter => {

    // Read target safely
    const targetAttr = counter.getAttribute('data-target');
    const target = targetAttr ? parseInt(targetAttr, 10) : null;

    // If no valid target, skip (extra safety)
    if (!target || isNaN(target)) return;

    let current = 0;

    const updateCount = () => {
      const increment = Math.ceil(target / animationSpeed);

      if (current < target) {
        current += increment;
        if (current > target) current = target;

        counter.innerText = current + '+';
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target + '+';
      }
    };

    updateCount();
  });
};

// Observe About section
const aboutObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      startCounter();
      aboutObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);

// Attach observer
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
  aboutObserver.observe(statsSection);
}


// ==========================================
// 5. Integrated Booking Form Submission (Email + WhatsApp)
// ==========================================
const mainBookingForm = document.getElementById("contactBookingForm");

if (mainBookingForm) {
    mainBookingForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Loading state to prevent multiple clicks
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // 1. Extract data from form fields
        const formData = {
            full_name: this.querySelector('input[placeholder="Your full name"]').value,
            phone: this.querySelector('input[placeholder="+94 XX XXX XXXX"]').value,
            email: this.querySelector('input[placeholder="your@email.com"]').value,
            service: this.querySelectorAll('select')[0].value,
            date: this.querySelector('input[type="date"]').value,
            passengers: this.querySelectorAll('select')[1].value,
            requirements: this.querySelector('textarea').value
        };

        // 2. Send via EmailJS first
        emailjs.send("service_bwe745l", "template_w978wap", formData)
            .then(() => {
                console.log("Email sent successfully!");

                // 3. Prepare WhatsApp Message
                const whatsappNumber = "94714880484"; 
                
                // Construct the text message with line breaks (%0A) and Bold (*text*)
                const message = `*NEW BOOKING REQUEST - ELR*%0A` +
                    `--------------------------%0A` +
                    `*Name:* ${formData.full_name}%0A` +
                    `*Phone:* ${formData.phone}%0A` +
                    `*Service:* ${formData.service}%0A` +
                    `*Date:* ${formData.date}%0A` +
                    `*Passengers:* ${formData.passengers}%0A` +
                    `*Requirements:* ${formData.requirements || 'None'}`;

                // Create the final WhatsApp URL
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

                // 4. Feedback & WhatsApp Redirect
                alert("Booking details captured! Opening WhatsApp to finalize your request.");

                // Opens WhatsApp in a new tab/app with the message pre-filled
                window.open(whatsappURL, '_blank');

                // Reset form
                mainBookingForm.reset();
            })
            .catch((error) => {
                console.error("Email failed:", error);
                alert("Email failed, but we can still send your details via WhatsApp.");
                
                // Fallback: Open WhatsApp even if the email fails
                const whatsappURL = `https://wa.me/94714880484?text=Hi, I tried booking on your site but the email failed. My name is ${formData.full_name}.`;
                window.open(whatsappURL, '_blank');
            })
            .finally(() => {
                // Return button to normal state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

// ==========================================
// 6. Scroll Effects
// ==========================================
window.addEventListener('scroll', () => {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        if (window.scrollY > 500) {
            whatsappBtn.style.opacity = "1";
            whatsappBtn.style.visibility = "visible";
        } else {
            whatsappBtn.style.opacity = "0";
            whatsappBtn.style.visibility = "hidden";
        }
    }
});

// ===== Mobile Navigation Toggle =====
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Close menu when a link is clicked (mobile UX)
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
});

// ===== AOS Safe Init =====
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out"
    });
  }
});

// ===== Touch Support =====
document.querySelectorAll("button, a").forEach(el => {
  el.addEventListener("touchstart", () => {}, { passive: true });
});

// ===== Prevent Unwanted Reload =====
const form = document.getElementById("contactBookingForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // handle form submit here
  });
}
