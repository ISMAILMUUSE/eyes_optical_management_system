// 100 Users for Eyes Optical Management System
import bcrypt from 'bcryptjs';

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Anna', 'Stephen', 'Brenda',
  'Larry', 'Pamela', 'Justin', 'Emma', 'Scott', 'Nicole', 'Brandon', 'Helen',
  'Benjamin', 'Samantha', 'Samuel', 'Olivia', 'Frank', 'Marie', 'Gregory', 'Janet',
  'Raymond', 'Catherine', 'Alexander', 'Frances', 'Patrick', 'Christine', 'Jack', 'Sara',
  'Dennis', 'Kim', 'Jerry', 'Debra', 'Tyler', 'Rachel', 'Aaron', 'Carolyn'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez',
  'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
  'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards',
  'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers',
  'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly',
  'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks',
  'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross',
  'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell'
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
  'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington',
  'Boston', 'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas',
  'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno',
  'Sacramento', 'Kansas City', 'Mesa', 'Atlanta', 'Omaha', 'Colorado Springs', 'Raleigh',
  'Virginia Beach', 'Miami', 'Oakland', 'Minneapolis', 'Tulsa', 'Cleveland', 'Wichita',
  'Arlington', 'Tampa', 'New Orleans'
];

const states = [
  'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH', 'NC', 'MI', 'GA', 'WA', 'CO', 'IN',
  'TN', 'MA', 'MO', 'MD', 'WI', 'MN', 'LA', 'AL', 'SC', 'KY', 'OR', 'OK', 'CT', 'IA',
  'UT', 'AR', 'NV', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI', 'NH', 'ME', 'RI', 'MT',
  'DE', 'SD', 'ND', 'AK', 'DC', 'VT', 'WY'
];

// Generate 100 users
export const generateUsers = async () => {
  const users = [];
  const usedEmails = new Set();
  
  // Admin user (1) - Only one main admin: eyesadmin
  const adminEmail = 'eyesadmin@hadadi.com';
  const adminName = 'eyesadmin';
  usedEmails.add(adminEmail);
  
  users.push({
    name: adminName,
    email: adminEmail,
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    address: {
      street: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Elm', 'Park', 'First', 'Second', 'Maple', 'Cedar'][Math.floor(Math.random() * 8)]} St`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: states[Math.floor(Math.random() * states.length)],
      zipCode: String(Math.floor(Math.random() * 90000 + 10000))
    },
    isActive: true
  });
  
  // Staff users (15) - First one is always staff@hadadi.com
  for (let i = 0; i < 15; i++) {
    let email, name;
    
    if (i === 0) {
      // First staff is always the known account
      email = 'staff@hadadi.com';
      name = 'Staff User';
    } else {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hadadi.com`;
      name = `${firstName} ${lastName}`;
      let counter = 1;
      while (usedEmails.has(email)) {
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@hadadi.com`;
        counter++;
      }
    }
    usedEmails.add(email);
    
    users.push({
      name,
      email,
      password: await bcrypt.hash('staff123', 10),
      role: 'staff',
      phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      address: {
        street: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Elm', 'Park', 'First', 'Second', 'Maple', 'Cedar'][Math.floor(Math.random() * 8)]} St`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        zipCode: String(Math.floor(Math.random() * 90000 + 10000))
      },
      isActive: true
    });
  }
  
  // Customer users (80)
  for (let i = 0; i < 80; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    let counter = 1;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@example.com`;
      counter++;
    }
    usedEmails.add(email);
    
    const birthYear = 1950 + Math.floor(Math.random() * 50);
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1;
    
    users.push({
      name: `${firstName} ${lastName}`,
      email,
      password: await bcrypt.hash('customer123', 10),
      role: 'customer',
      phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      address: {
        street: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Elm', 'Park', 'First', 'Second', 'Maple', 'Cedar', 'Pine', 'Washington', 'Lincoln', 'Jefferson'][Math.floor(Math.random() * 12)]} ${['St', 'Ave', 'Rd', 'Blvd', 'Dr', 'Ln'][Math.floor(Math.random() * 6)]}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        zipCode: String(Math.floor(Math.random() * 90000 + 10000))
      },
      dateOfBirth: new Date(birthYear, birthMonth, birthDay),
      isActive: Math.random() > 0.1 // 90% active
    });
  }
  
  return users;
};

