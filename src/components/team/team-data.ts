export interface TeamMember {
  id: string; name: string; role: string; color: string;
  photo?: string; bio?: string; outside?: string; flower?: string; advisor?: boolean;
}
// Update this list as the 2026 member photos and bios arrive.
const colors = ['honey', 'peach', 'blue', 'lilac'];
export const members: TeamMember[] = [
  { id: 'member-1', name: 'Team member 01', role: 'Team member', color: 'honey' },
  { id: 'member-2', name: 'Team member 02', role: 'Team member', color: 'blue' },
  ...Array.from({ length: 18 }, (_, i) => ({ id: `member-${i + 3}`, name: `Team member ${String(i + 3).padStart(2, '0')}`, role: 'Team member', color: colors[(i + 2) % colors.length] })),
];
export const advisors: TeamMember[] = ['peach', 'lilac', 'blue'].map((color, i) => ({
  id: `advisor-${i + 1}`, name: `Advisor ${String(i + 1).padStart(2, '0')}`, role: 'Advisor', color, advisor: true,
}));
