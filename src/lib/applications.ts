export interface RawApplication {
  ID: string;
  Full_Name: string;
  First_Name: string;
  Last_Name: string;
  Email_Address: string;
  Program: string;
  Campus: string;
  City: string;
  Province: string;
  Postal_Code: string;
  Country: string;
  Online_Session?: string;
  Venue_Address?: string;
  alreadyEnrolled?: boolean; // New flag for database cross-check
}

export interface ApplicationGroup {
  id: string; // key: Program-Campus
  program: string;
  campus: string;
  cities: string[]; // Unique cities in this group
  students: RawApplication[];
  duplicates: RawApplication[];
  enrolledCount: number; // Count of students already in our database
}

export function groupApplications(
  apps: RawApplication[], 
  existingEmailsMap: Record<string, Set<string>> = {} 
): ApplicationGroup[] {
  const groups: Record<string, ApplicationGroup> = {};
  const emailMap: Record<string, number> = {};

  // First pass: Count email occurrences for duplicate detection in this batch
  apps.forEach(app => {
    const email = (app.Email_Address || '').toLowerCase().trim();
    if (email) {
      emailMap[email] = (emailMap[email] || 0) + 1;
    }
  });

  // Second pass: Group students and check against existing database
  apps.forEach(app => {
    const program = app.Program || 'Unknown';
    const campus = app.Campus || 'Unknown';
    const city = (app.City || 'Unknown').trim();
    const email = (app.Email_Address || '').toLowerCase().trim();
    const platform = getPlatformFromProgram(program);
    
    // Cross-check against provided database emails for this platform
    const platformEmails = existingEmailsMap[platform];
    if (email && platformEmails && platformEmails.has(email)) {
      app.alreadyEnrolled = true;
    }

    const groupId = `${program}-${campus}`.replace(/\s+/g, '_');

    if (!groups[groupId]) {
      groups[groupId] = {
        id: groupId,
        program,
        campus,
        cities: [],
        students: [],
        duplicates: [],
        enrolledCount: 0
      };
    }

    if (!groups[groupId].cities.includes(city)) {
      groups[groupId].cities.push(city);
    }

    if (app.alreadyEnrolled) {
      groups[groupId].enrolledCount++;
    }

    if (email && emailMap[email] > 1) {
      groups[groupId].duplicates.push(app);
    } else {
      groups[groupId].students.push(app);
    }
  });

  return Object.values(groups);
}

export function getPlatformFromProgram(program: string): 'dip' | 'wrp' | 'saaio' {
  const p = (program || '').toLowerCase();
  if (p.includes('digital inclusion') || p.includes('idc')) return 'dip';
  if (p.includes('work readiness') || p.includes('wrp')) return 'wrp';
  return 'saaio';
}
