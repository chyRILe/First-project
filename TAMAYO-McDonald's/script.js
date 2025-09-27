const page = window.location.pathname;
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

if ((page.includes('Log-in.html') || page.includes('sign-up.html')) && isLoggedIn) {
    alert('You are already logged in!');
    window.location.href = 'Menu.html';
}

// CREATE ACCOUNT (Sign-up)
    function createAccount(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (password !== confirm) {
        alert('Passwords do not match.');
        return;
    }
    const user = { name, email, password, confirm };
    localStorage.setItem('email', email);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', name);

    alert('Account created successfully! Please log in.');
    window.location.href = 'Log-in.html';
}

// LOGIN
    function login(event) {
    event.preventDefault();

    const email = document.getElementById('log-inemail').value.trim();
    const password = document.getElementById('log-inpassword').value;
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('No account found. Please sign up first.');
        window.location.href = 'sign-up.html';
    }
    // Validate email and password
    if (user.email === email && user.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user.name);

        alert(`Welcome back, ${user.name}!`);
        window.location.href = 'Menu.html'; 
    } else {
       alert('Invalid email or password. Redirecting to sign-up.');
       location.href = 'sign-up.html';
    }
}
    document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutContainer = document.getElementById('logoutContainer');
    // Show logout 
    if (logoutContainer && isLoggedIn) {
        logoutContainer.style.display = 'inline';
    }
   // Logout 
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('cart');
            alert('You have been logged out.');
            location.href = 'Log-in.html';
        });
    }
    // ORDER BUTTONS
    const orderButtons = document.querySelectorAll('.order-button');
    orderButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!isLoggedIn) {
            alert('Please log in to place an order.');
            window.location.href = 'Log-in.html';
                return;
            }
            const itemName = button.previousElementSibling.previousElementSibling.textContent;
            addToCart(itemName);
            alert(`${itemName} has been added to your cart!`);
        });
    });

    // If on cart.html, display cart
    if (page.includes('cart.html')) {
        displayCart();
    }
});

// Add item to cart
    function addToCart(itemName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(itemName);
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }}

    function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        container.innerHTML = '<ul>' + cart.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }
}
    function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    const pricePerItem = 10; 
    const totalPrice = cart.length * pricePerItem;
    [
        'cart-container',
        'total-price'
    ].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
    const confirmation = confirm(`You have ${cart.length} item(s) in your cart.\nTotal: $${totalPrice.toFixed(0)}\n\nDo you want to proceed with checkout?`);
    if (confirmation) {
        alert('Thank you for your purchase! Your order has been placed.');
        localStorage.removeItem('cart');
        displayCart();
        updateCartCount(); 
        const totalPriceElement = document.getElementById('total-price');
        if (totalPriceElement) totalPriceElement.textContent = 'Total Price: 0.00';
    }
}
