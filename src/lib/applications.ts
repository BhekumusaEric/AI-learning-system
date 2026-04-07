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
}

export interface ApplicationGroup {
  id: string; // key: Program-Campus
  program: string;
  campus: string;
  cities: string[]; // Unique cities in this group
  students: RawApplication[];
  duplicates: RawApplication[];
}

export function groupApplications(apps: RawApplication[]): ApplicationGroup[] {
  const groups: Record<string, ApplicationGroup> = {};
  const emailMap: Record<string, number> = {};

  // First pass: Count email occurrences for duplicate detection
  apps.forEach(app => {
    const email = app.Email_Address.toLowerCase().trim();
    emailMap[email] = (emailMap[email] || 0) + 1;
  });

  // Second pass: Group students by Program + Campus
  apps.forEach(app => {
    const program = app.Program || 'Unknown';
    const campus = app.Campus || 'Unknown';
    const city = (app.City || 'Unknown').trim();
    const email = app.Email_Address.toLowerCase().trim();
    
    // CONSOLDATED KEY: Only Program and Campus
    const groupId = `${program}-${campus}`.replace(/\s+/g, '_');

    if (!groups[groupId]) {
      groups[groupId] = {
        id: groupId,
        program,
        campus,
        cities: [],
        students: [],
        duplicates: []
      };
    }

    // Track unique cities
    if (!groups[groupId].cities.includes(city)) {
      groups[groupId].cities.push(city);
    }

    if (emailMap[email] > 1) {
      groups[groupId].duplicates.push(app);
    } else {
      groups[groupId].students.push(app);
    }
  });

  return Object.values(groups);
}

export function getPlatformFromProgram(program: string): 'dip' | 'wrp' | 'saaio' {
  const p = program.toLowerCase();
  if (p.includes('digital inclusion') || p.includes('idc')) return 'dip';
  if (p.includes('work readiness') || p.includes('wrp')) return 'wrp';
  return 'saaio';
}
