/**
 * Team members. Source: company profile, "HR Profile".
 *
 * Photos (POPIA): only set `photo` once the person has given written consent
 * for their image to be published. Until then an initials tile is shown.
 * Put photos in public/images/team/ as square WebP, at least 480×480.
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  group: 'leadership' | 'team';
  /** e.g. "/images/team/s-pietersen.webp" — requires consent. */
  photo?: string;
}

export const team: TeamMember[] = [
  { id: 's-pietersen', name: 'S. Pietersen', role: 'Managing Director', group: 'leadership' },
  { id: 'r-verburgt', name: 'R. Verburgt', role: 'Mechanical Engineer', group: 'team' },
  // TODO: confirm surname for "Eugene".
  { id: 'eugene', name: 'Eugene', role: 'HVAC', group: 'team' },
  { id: 'n-matyolo', name: 'N. Matyolo', role: 'Project Administrator', group: 'team' },
  { id: 'a-fortune', name: 'A. Fortune', role: 'Project Administrator', group: 'team' },
  { id: 'mbulelo-mbali', name: 'Mbulelo Mbali', role: 'Project Manager & Resident Engineer', group: 'team' },
  { id: 'panacea-teverah', name: 'Panacea Teverah', role: 'Mechanical & Civil Technician', group: 'team' },
  { id: 'malcolm-abrahams', name: 'Malcolm Abrahams', role: 'Project Manager', group: 'team' },
  { id: 'amien-patel', name: 'Amien Patel', role: 'HVAC Engineer', group: 'team' },
  { id: 'thahir-peer', name: 'Thahir Peer', role: 'HVAC Engineer', group: 'team' },
  { id: 'luvandro-kamweny', name: 'Luvandro Kamweny', role: 'CAD Technician', group: 'team' },
];

export const leadership = team.filter((m) => m.group === 'leadership');
export const staff = team.filter((m) => m.group === 'team');

/** "S. Pietersen" → "SP", "Eugene" → "E". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-z]/g, '').charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
