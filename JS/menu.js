// API Configuration
const API_BASE_URL = 'http://localhost:8080/api/menu';
const AUTH_USERNAME = 'methni';
const AUTH_PASSWORD = '1234';

// Global Variables
let authToken = null;
let allMenuItems = [];

// DOM Elements
const loginSection = document.getElementById('loginSection');
const mainContent = document.getElementById('mainContent');
const menuGrid = document.getElementById('menuGrid');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
        authToken = token;
        showMainContent();
        loadMenuItems();
    } else {
        showLoginForm();
    }
    
    // Setup event listeners
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Category filter
    categoryFilter.addEventListener('change', handleCategoryFilter);
    
    // Add item form
    document.getElementById('addItemForm').addEventListener('submit', handleAddItem);
    
    // Edit item form
    document.getElementById('editItemForm').addEventListener('submit', handleEditItem);
    
    // Image URL preview
    document.getElementById('addImageUrl').addEventListener('input', updateImagePreview);
    document.getElementById('editImageUrl').addEventListener('input', updateEditImagePreview);
}

// Show login form
function showLoginForm() {
    loginSection.classList.remove('d-none');
    mainContent.classList.add('d-none');
}

// Show main content
function showMainContent() {
    loginSection.classList.add('d-none');
    mainContent.classList.remove('d-none');
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Basic client-side validation
    if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
        alert('Invalid username or password');
        return;
    }
    
    // In a real app, you would make an API call to authenticate
    // For this demo, we'll just store a token locally
    authToken = 'demo-token-' + Math.random().toString(36).substring(2);
    localStorage.setItem('authToken', authToken);
    
    showMainContent();
    await loadMenuItems();
}

// Handle logout
function handleLogout() {
    authToken = null;
    localStorage.removeItem('authToken');
    showLoginForm();
}

// Load menu items from API
async function loadMenuItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/getAll`, {
            headers: {
                'Authorization': `Basic ${btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`)}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch menu items');
        }
        
        allMenuItems = await response.json();
        renderMenuItems(allMenuItems);
    } catch (error) {
        console.error('Error loading menu items:', error);
        alert('Failed to load menu items. Please try again.');
    }
}

// Render menu items in the grid
function renderMenuItems(items) {
    menuGrid.innerHTML = '';
    
    if (!items || items.length === 0) {
        menuGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>No menu items found</h4>
                <p class="text-muted">Try adding some items or check your filters</p>
            </div>
        `;
        return;
    }
    
    items.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="card menu-card h-100">
                <img src="${item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                     class="card-img-top menu-img" 
                     alt="${item.name}"
                     onerror="this.src='https://via.placeholder.com/300x200?text=Image+Error'">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text text