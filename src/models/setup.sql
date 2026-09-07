-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

-- Create organization table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert organizations
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES 
    ('BrightFuture Builders', 
     'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 
     'info@brightfuturebuilders.org', 
     'brightfuture-logo.png'),
    ('GreenHarvest Growers', 
     'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
     'contact@greenharvest.org', 
     'greenharvest-logo.png'),
    ('UnityServe Volunteers', 
     'A volunteer coordination group supporting local charities and service initiatives.', 
     'hello@unityserve.org', 
     'unityserve-logo.png');

-- Create project table
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

-- Insert projects (using subqueries to get organization_id safely)
INSERT INTO project (organization_id, title, description, location, date)
SELECT organization_id, 'Community Garden Build', 
       'Build a community garden in downtown area', '123 Main St', '2026-07-15'
FROM organization WHERE name = 'BrightFuture Builders'
UNION ALL
SELECT organization_id, 'School Playground Renovation', 
       'Renovate the local elementary school playground', '456 Oak Ave', '2026-08-20'
FROM organization WHERE name = 'BrightFuture Builders'
-- ... add all 15 projects similarly

-- Verify data
SELECT p.title, o.name as organization, p.date
FROM project p
JOIN organization o ON p.organization_id = o.organization_id
ORDER BY p.date;