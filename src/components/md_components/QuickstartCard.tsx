import React from "react";

type Props = {
  pkgName: string;     // e.g., "casper"
  importName?: string; // e.g., "casper"
  cliName?: string;    // e.g., "casper"
  repoUrl?: string;    // e.g., "https://github.com/your-org/casper"
  className?: string;
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="group relative w-full my-2">
    <summary className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-[#f8efe2] transition-colors flex items-center justify-between cursor-pointer list-none">
      <span className="block truncate text-black font-bold">{title}</span>
      <span className="w-5 h-5 transition-transform group-open:rotate-180 text-black">⌄</span>
    </summary>
    <div className="relative z-10 w-full mt-1 bg-[#f8efe2] border border-gray-300 rounded-lg shadow-lg text-black">
      <div className="py-3 px-4">{children}</div>
    </div>
  </details>
);

const Code: React.FC<React.PropsWithChildren<{ lang?: string }>> = ({ lang = "bash", children }) => (
  <pre className="relative overflow-x-auto rounded-lg border border-gray-300 bg-[#FFF8EE] p-3 text-sm text-black whitespace-pre-wrap break-all">
    <code className={`language-${lang}`}>{children}</code>
  </pre>
);

const QuickstartCard: React.FC<Props> = ({
  pkgName,
  importName,
  cliName,
  repoUrl,
  className = "",
}) => {
  const _import = importName ?? pkgName;
  const _cli = cliName ?? pkgName;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="rounded-xl border border-gray-300 bg-[#f8efe2] shadow-md">
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="text-lg font-extrabold text-black">Quickstart</h3>
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline text-gray-700 hover:text-black"
              >
                {repoUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
          <div className="text-xs text-gray-700">CLI: <strong>{_cli}</strong></div>
        </div>

        <div className="px-4 pb-4">
          <Section title="Installation">
            <div className="space-y-2">
              <Code>{`git clone https://gitlab.igem.org/2025/software-tools/lambert-ga.git
cd lambert-ga/CASPER/CASPER-Cli
pip install -e .`}</Code>
              <p className="text-sm text-gray-700 mt-2">Optional: Create conda environment</p>
              <Code>{`conda create --name casper-bio
conda activate casper-bio
pip install -r requirements.txt`}</Code>
            </div>
          </Section>

          <Section title="Quick Start">
            <div className="space-y-3">
              <p className="text-sm text-gray-700">Run the complete pipeline:</p>
              <Code>{`${_cli} --target-fasta target.fasta`}</Code>
              
              <p className="text-sm text-gray-700">Use existing primers:</p>
              <Code>{`${_cli} --target-fasta target.fasta --input-csv existing_primers.csv`}</Code>
              
              <p className="text-sm text-gray-700">Custom output directory:</p>
              <Code>{`${_cli} --target-fasta target.fasta`}</Code>
            </div>
          </Section>

          <Section title="Pipeline Commands">
            <div className="space-y-2">
              <p className="text-sm font-medium text-black">Generate primers:</p>
              <Code>{`${_cli}-generate --target-fasta target.fasta --output pairs.csv`}</Code>
              
              <p className="text-sm font-medium text-black">Filter by GC content:</p>
              <Code>{`${_cli}-filter --input pairs.csv --output filtered.csv --min-gc 30 --max-gc 70`}</Code>
              
              <p className="text-sm font-medium text-black">Calculate features & rank:</p>
              <Code>{`${_cli}-features --input filtered.csv --output features.csv
${_cli}-rank --input features.csv --output ranked.csv --num-sets 10`}</Code>
            </div>
          </Section>

          <Section title="Python API">
            <Code lang="python">{`from ${_import} import SequenceData, PairGenerator, PrimerFilter, FeatureCalculator, Ranker

# Load and generate primer pairs
sequence_data = SequenceData("target.fasta")
sequence_data.preprocess()

generator = PairGenerator(sequence_data)
generator.generate_primers_pairs(
    sequence_data.sequence,
    primer_len=[18, 25],
    amplicon_len=[70, 200],
    crrnalen=[17, 24]
)
generator.to_csv("pairs.csv")

# Filter, calculate features, and rank
filter_obj = PrimerFilter("pairs.csv")
filtered = filter_obj.run([30, 70])  # GC content range

features = FeatureCalculator("filtered.csv")
features.compute_all_features()

ranker = Ranker("features.csv")
ranker.rank()
ranker.to_csv("ranked.csv", num_sets=10)`}</Code>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default QuickstartCard;
