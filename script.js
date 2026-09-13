// script.js

// DOM Elements
const navbar = document.getElementById('navbar');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const wishlistToggle = document.getElementById('wishlist-toggle');
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const closeWishlist = document.getElementById('close-wishlist');
const wishlistItems = document.getElementById('wishlist-items');
const themeToggle = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const navLinks = document.querySelectorAll('.nav-links a');
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const viewProfileButtons = document.querySelectorAll('.view-profile-btn');
const productForm = document.getElementById('product-form');
const farmerProductsGrid = document.getElementById('farmer-products');
const contactForm = document.getElementById('contact-form');
const imageInput = document.getElementById('product-image');
const imagePreview = document.getElementById('image-preview');
const productModal = document.getElementById('product-modal');
const farmerModal = document.getElementById('farmer-modal');
const closeModals = document.querySelectorAll('.close-modal');

// Data
let cart = JSON.parse(localStorage.getItem('farmFreshCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('farmFreshWishlist')) || [];
let currentTheme = localStorage.getItem('farmFreshTheme') || 'light';

// Farmer data
const farmers = {
    'rajesh-sharma': {
        name: 'Rajesh Sharma',
        location: 'Himalayan Green Farm, Himachal Pradesh',
        bio: 'Passionate about organic farming for over 20 years. Specializes in seasonal vegetables and natural cultivation methods.',
        rating: 4.8,
        reviews: 120,
        products: 15,
        image: 'images/farmer 1.jpg',
        story: 'Rajesh started farming in the beautiful Himalayan foothills, learning traditional organic methods from his ancestors. Today, he manages extensive vegetable farms, growing seasonal produce that captures the essence of Himalayan freshness. His commitment to natural cultivation has made him a pioneer in sustainable farming practices in Himachal Pradesh.',
        products: ['Organic Tomatoes', 'Fresh Spinach', 'Seasonal Vegetables', 'Herbs and Spices']
    },
    'amit-verma': {
        name: 'Amit Verma',
        location: 'Shivam Agro Farm, Uttar Pradesh',
        bio: 'Experienced farmer with 15+ years in agriculture. Focuses on wheat, pulses, and sustainable irrigation practices.',
        rating: 4.9,
        reviews: 95,
        products: 12,
        image: 'images/farmer 2.jpg',
        story: 'Amit has dedicated his life to modernizing traditional farming in Uttar Pradesh. With 15 years of experience, he has implemented innovative irrigation techniques that maximize water efficiency while maintaining soil health. His farm produces high-quality wheat and pulses that are staples in Indian households.',
        products: ['Premium Wheat', 'Organic Pulses', 'Rice Varieties', 'Oil Seeds']
    },
    'suresh-patel': {
        name: 'Suresh Patel',
        location: 'Krishna Valley Farm, Gujarat',
        bio: 'Dedicated to farming for over 18 years. Specializes in fruit cultivation like mangoes and bananas using modern techniques.',
        rating: 4.7,
        reviews: 85,
        products: 10,
        image: 'images/farmer3.jpg',
        story: 'Suresh represents the new generation of Gujarati farmers who blend traditional wisdom with modern technology. His Krishna Valley Farm is renowned for producing some of the sweetest mangoes and bananas in Gujarat. He has pioneered modern cultivation techniques that ensure consistent quality and higher yields.',
        products: ['Alphonso Mangoes', 'Fresh Bananas', 'Sweet Oranges', 'Seasonal Fruits']
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    updateWishlistDisplay();
    setupSmoothScrolling();
    setupStickyNavbar();
    setupTheme();
    setupSearch();
    setupNavActiveLink();
    setupProductDetails();
    setupFarmerProfiles();
});

// Theme Toggle
function setupTheme() {
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('farmFreshTheme', currentTheme);
    });
}

// Sticky Navbar
function setupStickyNavbar() {
    window.addEventListener('scroll', function() {
        const navBg = currentTheme === 'dark' ? '#2d4a3e' : '#4a7c59';
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = currentTheme === 'dark' ? 'rgba(45, 74, 62, 0.95)' : 'rgba(74, 124, 89, 0.95)';
        } else {
            navbar.style.backgroundColor = navBg;
        }
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Search Functionality
function setupSearch() {
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Active navigation highlight
function setupNavActiveLink() {
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Product Details Modal
function setupProductDetails() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('product-card') || e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            if (card && !e.target.classList.contains('add-to-cart-btn')) {
                showProductModal(card);
            }
        }
    });
}

function showProductModal(card) {
    const img = card.querySelector('img').src;
    const name = card.querySelector('h3').textContent;
    const price = card.querySelector('.price').textContent;
    const category = card.getAttribute('data-category');

    const modalContent = `
        <div class="product-detail">
            <img src="${img}" alt="${name}" style="width: 100%; max-width: 300px; border-radius: 10px; margin-bottom: 1rem;">
            <h2>${name}</h2>
            <p class="price" style="font-size: 1.5rem; color: #8b5a3c; margin: 1rem 0;">${price}</p>
            <p><strong>Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1)}</p>
            <p>This premium ${category} product is sourced directly from local farmers, ensuring maximum freshness and quality. Perfect for your healthy lifestyle!</p>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button class="btn primary" onclick="addToCart('${name}', ${parseFloat(price.replace('$', '').split('/')[0])})">Add to Cart</button>
                <button class="btn secondary" onclick="addToWishlist('${name}', '${img}', '${price}')">Add to Wishlist</button>
            </div>
        </div>
    `;

    document.getElementById('product-details').innerHTML = modalContent;
    productModal.style.display = 'block';
}

// Farmer Profiles
function setupFarmerProfiles() {
    viewProfileButtons.forEach(button => {
        button.addEventListener('click', function() {
            const farmerId = this.getAttribute('data-farmer');
            showFarmerProfile(farmerId);
        });
    });
}

function showFarmerProfile(farmerId) {
    const farmer = farmers[farmerId];
    if (!farmer) return;

    const modalContent = `
        <div class="farmer-profile">
            <img src="${farmer.image}" alt="${farmer.name}" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">
            <h2>${farmer.name}</h2>
            <p class="location" style="color: #8b5a3c; font-weight: bold; margin-bottom: 1rem;">${farmer.location}</p>
            <div class="farmer-stats" style="display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin-bottom: 1rem;">
                <span>⭐ ${farmer.rating} (${farmer.reviews} reviews)</span>
                <span>📦 ${farmer.products} products</span>
            </div>
            <p style="margin-bottom: 1rem;"><strong>About:</strong> ${farmer.bio}</p>
            <p style="margin-bottom: 1rem;"><strong>Story:</strong> ${farmer.story}</p>
            <h3>Products:</h3>
            <ul style="list-style: none; padding: 0;">
                ${farmer.products.map(product => `<li style="margin-bottom: 0.5rem;">• ${product}</li>`).join('')}
            </ul>
        </div>
    `;

    document.getElementById('farmer-profile').innerHTML = modalContent;
    farmerModal.style.display = 'block';
}

// Close Modals
closeModals.forEach(close => {
    close.addEventListener('click', function() {
        productModal.style.display = 'none';
        farmerModal.style.display = 'none';
    });
});

window.addEventListener('click', function(e) {
    if (e.target === productModal || e.target === farmerModal) {
        productModal.style.display = 'none';
        farmerModal.style.display = 'none';
    }
});

// Cart Toggle
cartToggle.addEventListener('click', function() {
    cartSidebar.classList.toggle('open');
    wishlistSidebar.classList.remove('open');
});

closeCart.addEventListener('click', function() {
    cartSidebar.classList.remove('open');
});

// Wishlist Toggle
wishlistToggle.addEventListener('click', function() {
    wishlistSidebar.classList.toggle('open');
    cartSidebar.classList.remove('open');
});

closeWishlist.addEventListener('click', function() {
    wishlistSidebar.classList.remove('open');
});

// Product Filtering
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter products
        productCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Add to Cart
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const button = e.target;
        const product = button.getAttribute('data-product');
        const price = parseFloat(button.getAttribute('data-price'));

        addToCart(product, price);
        showNotification('Added to cart!', 'success');
    }
});

function addToCart(product, price) {
    const existingItem = cart.find(item => item.product === product);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product, price, quantity: 1 });
    }

    updateCartDisplay();
    saveCart();
}

// Add to Wishlist
function addToWishlist(product, image, price) {
    const existingItem = wishlist.find(item => item.product === product);

    if (!existingItem) {
        wishlist.push({ product, image, price });
        updateWishlistDisplay();
        saveWishlist();
        showNotification('Added to wishlist!', 'success');
    } else {
        showNotification('Already in wishlist!', 'info');
    }
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.product}</h4>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
    cartToggle.textContent = `Cart (${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
}

function updateWishlistDisplay() {
    wishlistItems.innerHTML = '';

    wishlist.forEach((item, index) => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <div class="wishlist-item-info">
                <img src="${item.image}" alt="${item.product}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 1rem;">
                <div>
                    <h4>${item.product}</h4>
                    <p>${item.price}</p>
                </div>
            </div>
            <div>
                <button class="btn primary" onclick="moveToCart(${index})">Add to Cart</button>
                <button onclick="removeFromWishlist(${index})" style="margin-left: 0.5rem;">❌</button>
            </div>
        `;
        wishlistItems.appendChild(wishlistItem);
    });

    wishlistToggle.textContent = `Wishlist (${wishlist.length})`;
}

function changeQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCartDisplay();
    saveCart();
}

function moveToCart(index) {
    const item = wishlist[index];
    addToCart(item.product, parseFloat(item.price.replace('$', '').split('/')[0]));
    removeFromWishlist(index);
}

function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    updateWishlistDisplay();
    saveWishlist();
}

function saveCart() {
    localStorage.setItem('farmFreshCart', JSON.stringify(cart));
}

function saveWishlist() {
    localStorage.setItem('farmFreshWishlist', JSON.stringify(wishlist));
}

// Farmer Product Upload
productForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const imageFile = imageInput.files[0];

    // Create product card
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', category);

    let imageSrc = 'https://via.placeholder.com/300x200?text=No+Image';
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageSrc = e.target.result;
            productCard.innerHTML = `
                <img src="${imageSrc}" alt="${name}">
                <h3>${name}</h3>
                <p class="price">$${price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-product="${name}" data-price="${price}">Add to Cart</button>
            `;
        };
        reader.readAsDataURL(imageFile);
    } else {
        productCard.innerHTML = `
            <img src="${imageSrc}" alt="${name}">
            <h3>${name}</h3>
            <p class="price">$${price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-product="${name}" data-price="${price}">Add to Cart</button>
        `;
    }

    farmerProductsGrid.appendChild(productCard);

    // Reset form
    productForm.reset();
    imagePreview.style.display = 'none';
    imagePreview.src = '';
    showNotification('Product added successfully!', 'success');
});

// Image Preview
imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        imagePreview.src = '';
    }
});

// Contact Form Validation
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    let isValid = true;
    let errors = [];

    if (!name) {
        isValid = false;
        errors.push('Name is required');
    }

    if (!email) {
        isValid = false;
        errors.push('Email is required');
    } else if (!isValidEmail(email)) {
        isValid = false;
        errors.push('Please enter a valid email address');
    }

    if (!message) {
        isValid = false;
        errors.push('Message is required');
    }

    if (isValid) {
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        contactForm.reset();
    } else {
        showNotification('Please correct the following errors:\n' + errors.join('\n'), 'error');
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4a7c59' : type === 'error' ? '#dc3545' : '#8b5a3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close sidebars when clicking outside
document.addEventListener('click', function(e) {
    if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
        cartSidebar.classList.remove('open');
    }
    if (!wishlistSidebar.contains(e.target) && !wishlistToggle.contains(e.target)) {
        wishlistSidebar.classList.remove('open');
    }
});