import db from './db.js';

/**
 * Add a user as a volunteer for a project
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Remove a user as a volunteer from a project
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Check if a user is volunteering for a project
 */
const isVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * Get all projects a user has volunteered for
 */
const getVolunteerProjects = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               o.name AS organization_name, o.organization_id
        FROM volunteer v
        JOIN project p ON v.project_id = p.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.date;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};


const getAllVolunteers = async () => {
    const query = `
        SELECT 
            u.user_id,
            u.name AS user_name,
            u.email AS user_email,
            p.project_id,
            p.title AS project_title,
            p.date AS project_date,
            o.name AS organization_name
        FROM volunteer v
        JOIN users u ON v.user_id = u.user_id
        JOIN project p ON v.project_id = p.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY u.name, p.date;
    `;
    const result = await db.query(query);
    return result.rows;
};


export { 
    addVolunteer, 
    removeVolunteer, 
    isVolunteer, 
    getVolunteerProjects,
    getAllVolunteers
};