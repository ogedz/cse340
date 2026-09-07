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
 * Get projects for a specific organization
 * @param {number} organizationId - The organization ID
 * @returns {Promise<Array>} Array of projects for that organization
 */
const getProjectsByOrganization = async (organizationId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               o.name as organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.organization_id = $1
        ORDER BY p.date;
    `;
    
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

export { getAllProjects, getProjectsByOrganization };