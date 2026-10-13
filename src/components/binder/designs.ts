export interface BinderDesign {
  id: string;
  label: string;
  file: string;
  source: string;
  binderLength: number;
  targetChain: string;
  binderChain: string;
}

/** These are predicted poses. No experimental binding result is implied. */
export const designs: BinderDesign[] = [
  { id: 'design-01', label: 'Design 01', file: 'design-01.json', source: 'l69_s30715_mpnn1', binderLength: 69, targetChain: 'B', binderChain: 'A' },
  { id: 'design-02', label: 'Design 02', file: 'design-02.json', source: 'l79_s469532_mpnn9', binderLength: 79, targetChain: 'B', binderChain: 'A' },
  { id: 'design-03', label: 'Design 03', file: 'design-03.json', source: 'l79_s469532_mpnn8', binderLength: 79, targetChain: 'B', binderChain: 'A' },
  { id: 'design-04', label: 'Design 04', file: 'design-04.json', source: 'l120_s36250_mpnn8', binderLength: 120, targetChain: 'B', binderChain: 'A' },
  { id: 'design-05', label: 'Design 05', file: 'design-05.json', source: 'l120_s36250_mpnn3', binderLength: 120, targetChain: 'B', binderChain: 'A' },
  { id: 'design-06', label: 'Design 06', file: 'design-06.json', source: 'l125_s22078_mpnn3', binderLength: 125, targetChain: 'B', binderChain: 'A' },
  { id: 'design-07', label: 'Design 07', file: 'design-07.json', source: 'l102_s42414_mpnn16', binderLength: 102, targetChain: 'B', binderChain: 'A' },
  { id: 'design-08', label: 'Design 08', file: 'design-08.json', source: 'l91_s110759_mpnn8', binderLength: 91, targetChain: 'B', binderChain: 'A' },
];

export function modelUrl(file: string): string {
  return '/lambert-ga/binder-models/' + encodeURIComponent(file);
}
