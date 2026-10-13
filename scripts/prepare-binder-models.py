#!/usr/bin/env python3
"""Prepare browser-readable structure wrappers, without publishing any files.

Usage: python3 scripts/prepare-binder-models.py SOURCE_FOLDER OUTPUT_FOLDER
SOURCE_FOLDER contains manifest.csv and complex/<name>.pdb.
The output belongs outside the website repository until publication is approved.
"""

import argparse
import csv
import hashlib
import json
import math
from pathlib import Path

AMINO_ACIDS = {
    'ALA': 'A', 'ARG': 'R', 'ASN': 'N', 'ASP': 'D', 'CYS': 'C',
    'GLN': 'Q', 'GLU': 'E', 'GLY': 'G', 'HIS': 'H', 'ILE': 'I',
    'LEU': 'L', 'LYS': 'K', 'MET': 'M', 'PHE': 'F', 'PRO': 'P',
    'SER': 'S', 'THR': 'T', 'TRP': 'W', 'TYR': 'Y', 'VAL': 'V',
}
RETAINED_RECORDS = {'ATOM', 'TER', 'END', 'HELIX', 'SHEET', 'TURN'}
CDN_BASE = 'https://static.igem.wiki/teams/6185/wiki/minibinder-viewer/'


def structural_lines(path):
    lines = path.read_text(encoding='utf-8').splitlines()
    kept = [line for line in lines if line[:6].strip() in RETAINED_RECORDS]
    atoms = [line for line in lines if line[:6].strip() == 'ATOM']
    if not atoms:
        raise ValueError(f'{path.name}: no ATOM records')
    if atoms != [line for line in kept if line[:6].strip() == 'ATOM']:
        raise ValueError(f'{path.name}: structural records changed')
    for line in atoms:
        xyz = [float(line[start:start + 8]) for start in (30, 38, 46)]
        if not all(math.isfinite(value) for value in xyz):
            raise ValueError(f'{path.name}: invalid atomic coordinates')
    if not any(line[:6].strip() == 'END' for line in kept):
        kept.append('END')
    return kept, atoms


def sequences(atoms):
    chains = {}
    ca_keys = set()
    for line in atoms:
        if line[12:16].strip() != 'CA':
            continue
        chain, residue = line[21], line[22:27]
        key = (chain, residue)
        if key in ca_keys:
            raise ValueError(f'Duplicate alpha carbon: chain {chain}, residue {residue}')
        ca_keys.add(key)
        chains.setdefault(chain, []).append(AMINO_ACIDS[line[17:20]])
    return {chain: ''.join(residues) for chain, residues in chains.items()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    source, output = args.source.resolve(), args.output.resolve()
    with (source / 'manifest.csv').open(newline='', encoding='utf-8-sig') as handle:
        rows = list(csv.DictReader(handle))
    if len(rows) != 8:
        raise ValueError(f'Expected 8 designs; found {len(rows)}')

    # Validate the entire pack before writing any output.
    pack = []
    reference_target = None
    for index, row in enumerate(rows, start=1):
        name = row['name']
        if Path(name).name != name:
            raise ValueError('Manifest names must be plain file stems')
        path = source / 'complex' / f'{name}.pdb'
        kept, atoms = structural_lines(path)
        chain_sequences = sequences(atoms)
        if set(chain_sequences) != {'A', 'B'}:
            raise ValueError(f'{name}: expected exactly chains A and B')
        binder_length = int(row['length'])
        if chain_sequences['A'] != row['sequence'] or len(chain_sequences['A']) != binder_length:
            raise ValueError(f'{name}: binder sequence or length differs from manifest')
        if len(chain_sequences['B']) != 157:
            raise ValueError(f'{name}: expected 157 target residues')
        if reference_target is None:
            reference_target = chain_sequences['B']
        if chain_sequences['B'] != reference_target:
            raise ValueError(f'{name}: target sequence differs between complexes')

        design_id = f'design-{index:02d}'
        payload = {'format': 'pdb', 'data': '\n'.join(kept) + '\n', 'name': name,
                   'targetChain': 'B', 'binderChain': 'A'}
        serialized = json.dumps(payload, ensure_ascii=True, separators=(',', ':')) + '\n'
        recovered_atoms = [line for line in json.loads(serialized)['data'].splitlines()
                           if line[:6].strip() == 'ATOM']
        if recovered_atoms != atoms:
            raise ValueError(f'{name}: coordinates changed during JSON serialization')
        metadata = {
            'id': design_id, 'label': f'Design {index:02d}',
            'file': f'{design_id}.json', 'source': name,
            'binderLength': binder_length, 'targetLength': 157,
            'targetChain': 'B', 'binderChain': 'A',
            'atomCount': len(atoms), 'binderSequence': chain_sequences['A'],
            'coordinateRecordsUnchanged': True, 'sequenceMatchesManifest': True,
            'sha256': hashlib.sha256(serialized.encode('utf-8')).hexdigest(),
        }
        pack.append((serialized, metadata))

    output.mkdir(parents=True, exist_ok=True)
    for serialized, metadata in pack:
        (output / metadata['file']).write_text(serialized, encoding='utf-8')
    metadata = {
        'status': 'Prepared locally; not published',
        'description': 'Predicted structures; no measured binding result is implied.',
        'targetSequence': reference_target,
        'targetSequenceIdenticalAcrossDesigns': True,
        'models': [item for _, item in pack],
    }
    (output / 'metadata.json').write_text(json.dumps(metadata, indent=2) + '\n', encoding='utf-8')
    with (output / 'upload-list.csv').open('w', newline='', encoding='utf-8') as handle:
        writer = csv.writer(handle)
        writer.writerow(['file', 'destination_url', 'sha256'])
        for _, item in pack:
            writer.writerow([item['file'], CDN_BASE + item['file'], item['sha256']])
    table = '\n'.join(f"| {item['label']} | `{item['file']}` | `{item['source']}.pdb` | {item['binderLength']} |"
                      for _, item in pack)
    readme = f'''# Minibinder viewer model pack

Prepared locally. These files have not been published.

The eight structures are predicted complexes. They do not establish measured binding.
No model scores or experimental results are included.

| Design | JSON wrapper | Source structure | Binder residues |
| --- | --- | --- | --- |
{table}

## Chains and validation

- Chain A is the minibinder; its sequence and length exactly match the source manifest.
- Chain B is the target fragment, 157 residues, with an identical sequence in all eight structures.
- Structure residue numbering is preserved. Chain B is numbered 1–157 in these files.
- Every original ATOM record is preserved verbatim, including atomic coordinates.
- Only ATOM, TER, END, HELIX, SHEET, and TURN records are retained. No internal metadata is copied.
- JSON serialization was checked by recovering and comparing every ATOM record.
- `metadata.json` records validation results and SHA-256 hashes; it contains no scores.

## Upload, when approved

Upload only `design-01.json` through `design-08.json` to the iGEM static file host.
The expected destination folder is `teams/6185/wiki/minibinder-viewer/`.
`upload-list.csv` lists the exact destination URLs and checksums.
Keep this README, metadata, and upload list as local preparation records.
The viewer fetches JSON wrappers and reads the PDB string in each wrapper's `data` field.

## Rebuild

Run from the website repository:

```sh
python3 scripts/prepare-binder-models.py /path/to/source-export /path/to/output-folder
```

The source folder must contain `manifest.csv` and `complex/<name>.pdb`.
Keep the output folder outside the website repository until publication is approved.
'''
    (output / 'README.md').write_text(readme, encoding='utf-8')
    print(f'Validated and prepared {len(pack)} structures in {output}')
    print('Binder sequences, lengths, target consistency, and all coordinate records verified.')


if __name__ == '__main__':
    main()
