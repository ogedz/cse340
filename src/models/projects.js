import db from './db.js';

/**
 * Get all projects with their organization names
 * @returns {Promise<Array>} Array of project objects with organization_name
 */
const getAllProjects = async () => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               o.name as organization_name, o.organization_id
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.date;
    `;
    
    const result = await db.query(query);
    return result.rows;
};

/**
 * Get upcoming projects (date >= today)
 * @param {number} numberOfProjects - Number of projects to retrieve
 * @returns {Promise<Array>} Array of upcoming project objects
 */
const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               o.name as organization_name, o.organization_id
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;
    
    const result = await db.query(query, [numberOfProjects]);
    return result.rows;
};

/**
 * Get a single project by ID with organization name
 * @param {number} id - The project ID
 * @returns {Promise<Object|null>} Project object or null if not found
 */
const getProjectDetails = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               o.name as organization_name, o.organization_id
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Get all projects for a specific organization
 * @param {number} organizationId - The organization ID
 * @returns {Promise<Array>} Array of project objects
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, organization_id, title, description, location, date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;
    
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

// Export the model functions
export { getAllProjects, getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId };