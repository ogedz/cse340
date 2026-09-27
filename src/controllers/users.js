import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

const saltRounds = 10;

// ============================================
// USER REGISTRATION
// ============================================
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error);
        req.flash('error', 'Registration failed. Email may already be in use.');
        res.redirect('/register');
    }
};

// ============================================
// USER LOGIN
// ============================================
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        
        if (user) {
            req.session.user = user;
            req.flash('success', 'Login successful!');
            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'An error occurred during login.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

// ============================================
// PROTECTED ROUTES
// ============================================
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

// ============================================
// EXPORTS
// ============================================
export { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard
};