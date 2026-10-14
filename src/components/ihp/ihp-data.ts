export interface Conversation {
  id: string;
  title: string;
  person: string;
  date: string;
  question: string;
  takeaway: string;
  change: string;
  followup: string;
  photo?: string;
}

// Layout placeholders only. Replace these with documented conversations before publishing.
function conversation(title: string): Conversation {
  return {
    id: title.toLowerCase().replaceAll(' ', '-'), title,
    person: 'Lorem ipsum · Dolor sit amet',
    date: 'Lorem ipsum dolor sit amet',
    question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae sapien vel nisi tincidunt interdum.',
    takeaway: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae ligula quis augue volutpat finibus. Curabitur sollicitudin, neque vitae faucibus facilisis, urna justo tincidunt erat, at consequat ipsum arcu vel purus. Praesent euismod orci sit amet lectus facilisis, in tincidunt justo interdum. Donec quis ante vitae augue fermentum suscipit.',
    change: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris at nibh sed lorem porttitor tincidunt. Nunc in justo sit amet felis tincidunt consequat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
    followup: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vivamus at justo eget mauris feugiat consequat.',
  };
}

// Fictional names for the layout preview, not records of real interviews.
export const phases = [
  {
    id: 'phase-1', number: '01', name: 'Understanding the problem',
    note: 'Lorem ipsum dolor sit amet.',
    caption: 'Consectetur adipiscing elit. Donec vitae justo et nibh malesuada interdum.',
    entries: ['Alex Morgan', 'Jamie Lee', 'Jordan Taylor', 'Casey Bennett', 'Avery Brooks', 'Riley Parker', 'Morgan Ellis', 'Sam Rivera', 'Cameron Hayes', 'Taylor Reed'].map(conversation),
  },
  {
    id: 'phase-2', number: '02', name: 'Shaping our approach',
    note: 'Lorem ipsum dolor sit amet.',
    caption: 'Consectetur adipiscing elit. Donec vitae justo et nibh malesuada interdum.',
    entries: ['Quinn Walker', 'Charlie Davis', 'Drew Wilson', 'Emerson Clark', 'Harper Lane', 'Reese Adams', 'Rowan Scott', 'Blair Collins', 'Finley Shaw', 'Peyton James'].map(conversation),
  },
  {
    id: 'phase-3', number: '03', name: 'Returning for feedback',
    note: 'Lorem ipsum dolor sit amet.',
    caption: 'Consectetur adipiscing elit. Donec vitae justo et nibh malesuada interdum.',
    entries: ['Skyler Moore', 'Dakota Bell', 'Robin Blake', 'Jules Foster', 'Elliot Woods', 'Sage Miller', 'Frankie Ross', 'Remy Carter', 'River Quinn', 'Bailey Dean'].map(conversation),
  },
];
