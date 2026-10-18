export interface TeamMember {
  id: string;
  name: string;
  color: string;
  photo?: string;
  grade?: 'Sophomore' | 'Junior' | 'Senior';
  year?: number;
  bio?: string;
  advisor?: boolean;
}

const photo = (filename: string) => `https://static.igem.wiki/teams/6185/wiki/team-photos/${filename}.avif`;

// Only supplied grades, years, and bios are included. Missing details stay optional.
export const members: TeamMember[] = [
  { id: 'advay', name: 'Advay', color: 'honey', photo: photo('advay') },
  {
    id: 'aiden', name: 'Aiden Lee', color: 'blue', photo: photo('aidenlee'), grade: 'Junior', year: 2,
    bio: 'iGEM has opened up so many opportunities for me, and I can’t wait to meet everyone at Jamboree! Outside the lab, you’ll find me listening to music or playing tennis with my brother.',
  },
  {
    id: 'aiyana', name: 'Aiyana Verma', color: 'lilac', photo: photo('aiyanaverma'), grade: 'Sophomore', year: 1,
    bio: 'When I’m not sending emails, I’m playing with my dog, trying my hand at photography, or shopping online. I love to travel and can’t wait to meet everyone in Paris!',
  },
  { id: 'arjun', name: 'Arjun Gulati', color: 'peach', photo: photo('arjungulati') },
  {
    id: 'brandon', name: 'Brandon Jimerson', color: 'peach', photo: photo('brandonjimerson'), year: 1,
    bio: '¡Hola a todos! I’m Brandon. In my free time, I’m listening to phonk and aura farming. Next stop: “Brandon’s in Paris.” My aura 📈.',
  },
  { id: 'catherine', name: 'Catherine', color: 'honey', photo: photo('catherine') },
  {
    id: 'diana', name: 'Diana Nijim', color: 'blue', photo: photo('diananijim'), grade: 'Junior', year: 1,
    bio: 'iGEM lets me explore my curiosities in the lab and look at problems from new perspectives. Outside the lab, I’m usually reading in a café or at the gym. I’m psyched for Jamboree!',
  },
  {
    id: 'harsha', name: 'Harsha Poonepalle', color: 'lilac', photo: photo('harshapoonepelle'), year: 3,
    bio: 'Bonjour! I’m Harsha, and this is my third year on the team.',
  },
  {
    id: 'jinto', name: 'Jinto Fong', color: 'lilac', photo: photo('jintofong'), grade: 'Junior', year: 1,
    bio: 'iGEM has been a stellar experience and a chance to learn about synthetic biology. Outside the lab, you’ll probably find me playing soccer or hunting for Pokémon cards. See you at Jamboree!',
  },
  {
    id: 'jiwoo', name: 'Jiwoo Han', color: 'peach', photo: photo('jiwoohan'), grade: 'Senior', year: 2,
    bio: 'Hey! You’ll usually find me listening to music while working in wetlab. I’m excited to explore Paris and meet new people at the Grand Jamboree!',
  },
  {
    id: 'keerthana', name: 'Keerthana Anumukonda', color: 'honey', photo: photo('keerthana'), grade: 'Senior', year: 2,
    bio: 'Being part of Lambert iGEM has been an amazing experience. When I’m not in the lab, I’m reading or café hopping with friends. I’m so excited to meet everyone in Paris!',
  },
  {
    id: 'naivedhya', name: 'Naivedhya Gehlot', color: 'blue', photo: photo('naivedhyagehlot'), grade: 'Sophomore', year: 1,
    bio: 'In iGEM, I’m designing hardware in CAD—usually on version 10+—while my 3D printer runs for hours. Outside the lab, I photograph galaxies and build rockets and drones. Please keep the crumbs away from me.',
  },
  {
    id: 'nathaniel', name: 'Nathaniel Nam', color: 'blue', photo: photo('nathanielnam'),
    bio: 'Yo, I’m Nathaniel, and I’m D1 in iGEM.',
  },
  {
    id: 'neev', name: 'Neev Vohra', color: 'lilac', photo: photo('neevvohra'), grade: 'Sophomore', year: 1,
    bio: 'iGEM has given me amazing opportunities and so many fun memories. I work on wetlab and hardware, usually with music playing. Outside the lab, I’m playing golf or soccer. See you at Jamboree!',
  },
  {
    id: 'ngoc', name: 'Ngoc Nguyen', color: 'peach', photo: photo('ngocnguyen'), grade: 'Junior', year: 1,
    bio: 'iGEM gives me a chance to gain experience and dilly-dally with my friends! Outside the lab, I’m gaming or birdwatching. #YOLO',
  },
  { id: 'rohan', name: 'Rohan Kaushik', color: 'honey' },
  { id: 'scarlett', name: 'Scarlett', color: 'honey', photo: photo('scarlett') },
  { id: 'shashwat', name: 'Shashwat Balamurali', color: 'blue', photo: photo('shashwatbalamurali') },
  {
    id: 'veda', name: 'Veda Vudithyala', color: 'lilac', photo: photo('veda'), grade: 'Senior', year: 2,
    bio: 'I couldn’t have asked for a better iGEM experience. Outside the lab, I’m listening to music, making something crafty, or catching up on sleep. Come say hi at the Grand Jamboree!',
  },
  { id: 'vedant', name: 'Vedant Kalipatnapu', color: 'peach', photo: photo('vedantkalipatnapu') },
];

export const advisors: TeamMember[] = [
  { id: 'mrs-sharer', name: 'Mrs. Sharer', color: 'honey', photo: photo('mrssharer'), advisor: true },
];

export const yearLabel = (year: number) => `${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} year`;
export const memberDetails = (member: TeamMember) => [member.grade, member.year && yearLabel(member.year)].filter(Boolean).join(' · ');
