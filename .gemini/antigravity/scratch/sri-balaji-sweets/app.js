// app.js - Sri Balaji Ghee Sweets Interactive Logic

// 0. Loading Screen & Section Transitions
(function initLoadingScreen() {
  const loader = document.getElementById("loading-screen");
  const loaderBar = document.getElementById("loader-bar");
  if (!loader || !loaderBar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) progress = 100;
    loaderBar.style.width = progress + "%";
    if (progress >= 100) clearInterval(interval);
  }, 120);

  window.addEventListener("load", () => {
    setTimeout(() => {
      loaderBar.style.width = "100%";
      setTimeout(() => {
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.style.display = "none";
          initSectionTransitions();
        }, 600);
      }, 300);
    }, 500);
  });
})();

function initSectionTransitions() {
  const sections = document.querySelectorAll(".page-section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  sections.forEach(section => observer.observe(section));
}

// 1. Sweets Database
const sweetsDatabase = [
  {
    id: "kaju-katli",
    name: "Royal Kaju Katli",
    price: 950,
    unit: "1 Kg",
    image: "assets/kaju_katli.png",
    description: "Classic diamond-shaped cashew fudge made with premium grade cashews and decorated with edible silver leaf.",
    category: "dryfruit",
    rating: "4.8 (195+ reviews)",
    tag: "Traditional"
  },
  {
    id: "dry-fruit-laddu",
    name: "Premium Dry Fruit Laddu",
    price: 1100,
    unit: "1 Kg",
    image: "assets/dry_fruit_laddu.png",
    description: "Wholesome, nutrient-rich laddu packed with premium dates, almonds, cashews, pistachios, and raisins. No added sugar.",
    category: "dryfruit",
    rating: "4.9 (125+ reviews)",
    tag: "Healthy Pick"
  },
  {
    id: "mysore-pak",
    name: "Royal Ghee Mysore Pak",
    price: 720,
    unit: "1 Kg",
    image: "assets/mysore_pak.png",
    description: "Traditional melt-in-mouth soft Mysore Pak crafted with pure Desi Ghee, roasted gram flour, and premium sugar.",
    category: "ghee",
    rating: "4.9 (180+ reviews)",
    tag: "Chef Special"
  },
  {
    id: "ghee-laddu",
    name: "Shahi Ghee Besan Laddu",
    price: 600,
    unit: "1 Kg",
    image: "assets/ghee_laddu.png",
    description: "Aromatic chickpea flour roasted slowly in rich ghee, shaped into delicious spheres and garnished with pistachios.",
    category: "ghee",
    rating: "4.9 (150+ reviews)",
    tag: "Best Seller"
  },
  {
    id: "badam-halwa",
    name: "Kashmiri Badam Halwa",
    price: 850,
    unit: "1 Kg",
    image: "assets/badam_halwa.png",
    description: "Rich, glistening pudding made of almond paste, pure ghee, and infused with saffron threads and green cardamom.",
    category: "ghee",
    rating: "4.9 (95+ reviews)",
    tag: "Luxury Treat"
  },
  {
    id: "gift-delight",
    name: "Royal Mithai Collection",
    price: 1450,
    unit: "Royal Box",
    image: "assets/gift_box.png",
    description: "A hand-curated assortment of our finest ghee sweets, dry fruit bites, and silver-decorated delights.",
    category: "gifts",
    rating: "5.0 (210+ reviews)",
    tag: "Festive Pick"
  }
];

// 2. State Management
let cart = JSON.parse(localStorage.getItem("sri_balaji_cart")) || [];
let activeCategory = "all";

// WhatsApp Contact Configuration
const WHATSAPP_PHONE = "916300924408"; // Shop's WhatsApp number (country code + number)

// 3. DOM References
const sweetsGrid = document.getElementById("sweets-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartCountBadge = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartTotalQty = document.getElementById("cart-total-qty");
const cartGrandTotal = document.getElementById("cart-grand-total");
const cartDrawer = document.getElementById("cart-drawer");
const cartDrawerOverlay = document.getElementById("cart-drawer-overlay");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const whatsappOrderBtn = document.getElementById("whatsapp-order-btn");
const toast = document.getElementById("toast");
const themeToggleBtn = document.getElementById("theme-toggle");
const sunIcon = document.querySelector(".sun-icon");
const moonIcon = document.querySelector(".moon-icon");
const navbar = document.getElementById("navbar");
const menuToggleBtn = document.getElementById("menu-toggle-btn");
const mobileDrawer = document.getElementById("mobile-drawer");
const closeDrawerBtn = document.getElementById("close-drawer-btn");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-item");

// 4. Initialize Website
document.addEventListener("DOMContentLoaded", () => {
  renderSweets();
  updateCartUI();
  initTheme();
  initHeroSpotlight();
  initCateringCarousel();
  
  // Setup Intersection Observers for fade-in reveals
  setupScrollReveals();
});

// 5. Render Sweets Grid
function renderSweets() {
  sweetsGrid.innerHTML = "";
  
  const filteredSweets = activeCategory === "all" 
    ? sweetsDatabase 
    : sweetsDatabase.filter(sweet => sweet.category === activeCategory);
    
  filteredSweets.forEach(sweet => {
    const cardWrapper = document.createElement("article");
    cardWrapper.className = "card-wrapper";
    
    cardWrapper.innerHTML = `
      <div class="sweet-card">
        <div class="card-image-box">
          <img src="${sweet.image}" alt="${sweet.name}" class="card-image" loading="lazy" width="400" height="300">
          ${sweet.tag ? `<span class="card-tag">${sweet.tag}</span>` : ""}
        </div>
        <div class="card-content">
          <div class="card-meta">
            <span class="card-category">${sweet.category} sweets</span>
            <span class="card-rating">★ ${sweet.rating.split(" ")[0]}</span>
          </div>
          <h3 class="card-title">${sweet.name}</h3>
          <p class="card-desc">${sweet.description}</p>
          <div class="card-footer">
            <div class="card-price">
              <span class="amount">₹${sweet.price}</span>
              <span class="unit">per ${sweet.unit}</span>
            </div>
            <button class="add-to-cart-btn" data-id="${sweet.id}" aria-label="Add ${sweet.name} to Cart">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    
    sweetsGrid.appendChild(cardWrapper);
  });

  // Attach event listeners to newly created add buttons
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const sweetId = btn.getAttribute("data-id");
      addToCart(sweetId);
    });
  });
}

// 6. Category Filtering
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach(b => b.classList.remove("active"));
    // Add active class to clicked button
    btn.classList.add("active");
    
    activeCategory = btn.getAttribute("data-filter");
    
    // Add fade-out/in class for transition aesthetics
    sweetsGrid.style.opacity = 0;
    setTimeout(() => {
      renderSweets();
      sweetsGrid.style.opacity = 1;
    }, 200);
  });
});

// 7. Cart Core Logic
function addToCart(sweetId) {
  const existingItemIndex = cart.findIndex(item => item.id === sweetId);
  const sweetDetail = sweetsDatabase.find(sweet => sweet.id === sweetId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      id: sweetId,
      name: sweetDetail.name,
      price: sweetDetail.price,
      unit: sweetDetail.unit,
      image: sweetDetail.image,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`Added ${sweetDetail.name} to your package!`);
}

function changeQty(sweetId, delta) {
  const itemIndex = cart.findIndex(item => item.id === sweetId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(sweetId) {
  cart = cart.filter(item => item.id !== sweetId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("sri_balaji_cart", JSON.stringify(cart));
}

// 8. Update Cart Drawer UI
function updateCartUI() {
  // Update badge count
  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountBadge.textContent = totalItemsCount;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-msg">
        <span class="empty-icon">🛒</span>
        <p>Your cart is empty.</p>
        <a href="#menu" class="btn btn-outline close-cart-link">Explore Menu</a>
      </div>
    `;
    cartTotalQty.textContent = "0 items";
    cartGrandTotal.textContent = "₹0";
    whatsappOrderBtn.disabled = true;
    
    // Attach close link listner
    const closeLink = document.querySelector(".close-cart-link");
    if (closeLink) {
      closeLink.addEventListener("click", closeCart);
    }
    return;
  }

  whatsappOrderBtn.disabled = false;
  cartItemsContainer.innerHTML = "";
  let totalCost = 0;

  cart.forEach(item => {
    const itemCost = item.price * item.quantity;
    totalCost += itemCost;

    const cartItemRow = document.createElement("div");
    cartItemRow.className = "cart-item";
    cartItemRow.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <span class="price">₹${itemCost}</span>
        <span style="font-size: 0.75rem; color: var(--text-secondary);">(${item.quantity} x ₹${item.price}/${item.unit})</span>
      </div>
      <div class="cart-item-actions">
        <span class="qty-btn" onclick="changeQty('${item.id}', -1)">−</span>
        <span class="item-qty">${item.quantity}</span>
        <span class="qty-btn" onclick="changeQty('${item.id}', 1)">+</span>
      </div>
      <span class="remove-item-btn" onclick="removeFromCart('${item.id}')">&times;</span>
    `;
    cartItemsContainer.appendChild(cartItemRow);
  });

  cartTotalQty.textContent = `${totalItemsCount} item${totalItemsCount > 1 ? "s" : ""}`;
  cartGrandTotal.textContent = `₹${totalCost}`;
}

// Inject helper functions globally so HTML inline events can run them
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;

// 9. Toast Notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// 10. Drawer Control Animations
function openCart() {
  cartDrawer.classList.add("active");
  cartDrawerOverlay.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Lock scroll
  
  // Set focus on close button inside drawer for a11y
  closeCartBtn.focus();
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartDrawerOverlay.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; // Unlock scroll
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartDrawerOverlay.addEventListener("click", closeCart);

// 11. WhatsApp Checkout API Compiler
whatsappOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  let message = `*✨ NEW ORDER INQUIRY - SRI BALAJI GHEE SWEETS ✨*\n`;
  message += `-------------------------------------------------\n`;
  
  cart.forEach((item, index) => {
    const itemCost = item.price * item.quantity;
    message += `${index + 1}. *${item.name}*\n`;
    message += `   Qty: ${item.quantity} box(es) (${item.unit})\n`;
    message += `   Price: ₹${itemCost} (at ₹${item.price}/${item.unit})\n\n`;
  });
  
  const grandTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  message += `-------------------------------------------------\n`;
  message += `*Estimated Grand Total: ₹${grandTotal}*\n\n`;
  message += `Please confirm availability, delivery timeline, and payment options.\n`;
  message += `Thank you!`;

  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
  
  window.open(whatsappUrl, "_blank");
});

// 12. Catering Testimonials Carousel Logic
let cateringSlideIndex = 0;
let cateringCarouselTimer = null;

function initCateringCarousel() {
  const slides = document.querySelectorAll("#catering-carousel-slides .carousel-slide");
  const dots = document.querySelectorAll("#catering-carousel-dots .dot");
  
  if (!slides.length || !dots.length) return;

  function showSlide(index) {
    if (index >= slides.length) {
      cateringSlideIndex = 0;
    } else if (index < 0) {
      cateringSlideIndex = slides.length - 1;
    } else {
      cateringSlideIndex = index;
    }

    slides.forEach((slide, i) => {
      if (i === cateringSlideIndex) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });

    dots.forEach((dot, i) => {
      if (i === cateringSlideIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function startAutoplay() {
    stopAutoplay();
    cateringCarouselTimer = setInterval(() => {
      showSlide(cateringSlideIndex + 1);
    }, 5000);
  }

  function stopAutoplay() {
    if (cateringCarouselTimer) {
      clearInterval(cateringCarouselTimer);
      cateringCarouselTimer = null;
    }
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const targetIndex = parseInt(dot.getAttribute("data-slide"), 10);
      showSlide(targetIndex);
      startAutoplay();
    });
  });

  startAutoplay();
}

// 13. Mobile Drawer Menu Navigation
menuToggleBtn.addEventListener("click", () => {
  mobileDrawer.classList.add("active");
  mobileDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
});

function closeMobileDrawer() {
  mobileDrawer.classList.remove("active");
  mobileDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

closeDrawerBtn.addEventListener("click", closeMobileDrawer);

mobileNavLinks.forEach(link => {
  link.addEventListener("click", closeMobileDrawer);
});

// Close Mobile Drawer if clicked outside
document.addEventListener("click", (e) => {
  if (mobileDrawer.classList.contains("active") && 
      !mobileDrawer.contains(e.target) && 
      e.target !== menuToggleBtn && 
      !menuToggleBtn.contains(e.target)) {
    closeMobileDrawer();
  }
});

// 14. Sticky & Active Navbar on Scroll
window.addEventListener("scroll", () => {
  // Sticky header class injection
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Active Nav link highlight tracking
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-item");
  
  let currentSection = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120; // accounting for sticky navbar
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navItems.forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("href").slice(1) === currentSection) {
      item.classList.add("active");
    }
  });
});

// 15. Theme Toggle Logic (Light / Dark)
function initTheme() {
  const savedTheme = localStorage.getItem("sri_balaji_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  }
}

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("sri_balaji_theme", "light");
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
    showToast("Swapped to Light Theme");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("sri_balaji_theme", "dark");
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
    showToast("Swapped to Royal Dark Theme");
  }
});

// 16. Scroll Reveal Animations (Aesthetic polish)
function setupScrollReveals() {
  const revealElements = document.querySelectorAll(".story-image-wrapper, .story-content, .feature-item, .review-card, .contact-details, .map-placeholder, .catering-intro, .service-card, .gallery-item, .why-card");
  
  // Apply initial hidden styles via JS to avoid flashing if JS is disabled
  revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// 17. Interactive Hero Spotlight Follower
function initHeroSpotlight() {
  const heroSection = document.querySelector(".hero-section");
  const spotlight = document.getElementById("hero-spotlight");
  
  if (heroSection && spotlight) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroSection.style.setProperty("--mouse-x", `${x}px`);
      heroSection.style.setProperty("--mouse-y", `${y}px`);
    });
  }
}
