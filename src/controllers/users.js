import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';
import { 
    addVolunteer, 
    removeVolunteer, 
    getVolunteerProjects,
    getAllVolunteers
} from '../models/volunteers.js';

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
// MIDDLEWARE
// ============================================
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/');
        }
        next();
    };
};

// ============================================
// DASHBOARD
// ============================================
const showDashboard = async (req, res) => {
    const user = req.session.user;
    const volunteerProjects = await getVolunteerProjects(user.user_id);
    
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        volunteerProjects
    });
};

// ============================================
// USERS PAGE (admin-only)
// ============================================
const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { 
        title: 'Registered Users',
        users 
    });
};

// ============================================
// VOLUNTEER CONTROLLERS
// ============================================
const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await addVolunteer(userId, projectId);

    req.flash('success', 'You have signed up to volunteer for this project!');
    res.redirect(`/project/${projectId}`);
};

const removeVolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await removeVolunteer(userId, projectId);

    req.flash('success', 'You have removed yourself from this project.');
    res.redirect(`/project/${projectId}`);
};

// ============================================
const showAllVolunteersPage = async (req, res) => {
    const volunteers = await getAllVolunteers();
    res.render('volunteers', {
        title: 'All Volunteer Signups',
        volunteers
    });
};

const adminRemoveVolunteer = async (req, res) => {
    const { userId, projectId } = req.params;

    await removeVolunteer(userId, projectId);

    req.flash('success', 'Volunteer removed from project.');
    res.redirect('/volunteers');
};

export { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage,
    volunteerForProject,
    removeVolunteerFromProject,
    showAllVolunteersPage,
    adminRemoveVolunteer 
};