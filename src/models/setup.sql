-- src/models/setup.sql
-- Complete database setup for CSE 340

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

-- Insert projects
INSERT INTO project (organization_id, title, description, location, date)
VALUES 
    (1, 'Community Garden Build', 'Build a community garden in downtown area', '123 Main St', '2026-07-15'),
    (1, 'School Playground Renovation', 'Renovate the local elementary school playground', '456 Oak Ave', '2026-08-20'),
    (1, 'Affordable Housing Project', 'Assist in constructing affordable housing units', '789 Pine Rd', '2026-09-10'),
    (1, 'Senior Center Repairs', 'Repair and paint the local senior community center', '321 Maple Dr', '2026-10-05'),
    (1, 'Park Cleanup Initiative', 'Cleanup and beautify the city park', '555 Park Blvd', '2026-11-01'),
    (2, 'Urban Farm Expansion', 'Expand the urban farm with new greenhouses', '789 Elm St', '2026-07-22'),
    (2, 'Community Cooking Classes', 'Teach healthy cooking and nutrition classes', '234 Oak St', '2026-08-15'),
    (2, 'Farmers Market Setup', 'Set up and run a weekly farmers market', '456 Market Ave', '2026-09-05'),
    (2, 'Seed Distribution Program', 'Distribute free seeds to local families', '567 Garden Rd', '2026-09-25'),
    (2, 'Composting Workshop', 'Teach community members how to start composting', '789 Green St', '2026-10-15'),
    (3, 'Food Bank Volunteer Day', 'Sort and pack food donations', '123 Charity Ln', '2026-07-10'),
    (3, 'Homeless Shelter Support', 'Prepare and serve meals at the homeless shelter', '456 Hope St', '2026-08-01'),
    (3, 'School Supply Drive', 'Collect and distribute school supplies', '789 Education Blvd', '2026-08-28'),
    (3, 'Blood Donation Campaign', 'Organize a community blood donation drive', '321 Health Dr', '2026-09-18'),
    (3, 'Winter Coat Collection', 'Collect and distribute winter coats', '555 Warm St', '2026-10-25');

-- Verify data
SELECT p.title, o.name as organization, p.date
FROM project p
JOIN organization o ON p.organization_id = o.organization_id
ORDER BY p.date;