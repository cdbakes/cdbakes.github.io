import * as fs from 'fs';
import * as path from 'path';
import { parseSDF, generateMoleculeConstants } from '../src/utils/sdfParser';

const SDF_DIR = path.join(process.cwd(), 'public', 'sdf');
const CONSTANTS_DIR = path.join(process.cwd(), 'src', 'constants', 'molecules');

// Ensure the constants directory exists
if (!fs.existsSync(CONSTANTS_DIR)) {
  fs.mkdirSync(CONSTANTS_DIR, { recursive: true });
}

// Create an index file that exports all molecules
const createIndexFile = (moleculeNames: string[]) => {
  const indexContent = `// This file is auto-generated
${moleculeNames.map(name => `import * as ${name} from './${name}';`).join('\n')}

export const molecules = {
${moleculeNames.map(name => `  ${name},`).join('\n')}
};

export const moleculeNames = [${moleculeNames.map(name => `'${name}'`).join(', ')}] as const;
`;

  fs.writeFileSync(path.join(CONSTANTS_DIR, 'index.ts'), indexContent);
};

// Process all SDF files
const sdfFiles = fs.readdirSync(SDF_DIR).filter(file => file.endsWith('.sdf'));
const moleculeNames: string[] = [];

for (const sdfFile of sdfFiles) {
  const baseName = path.basename(sdfFile, '.sdf');
  moleculeNames.push(baseName);
  
  const sdfContent = fs.readFileSync(path.join(SDF_DIR, sdfFile), 'utf-8');
  const moleculeData = parseSDF(sdfContent);
  const constants = generateMoleculeConstants(moleculeData);
  
  fs.writeFileSync(
    path.join(CONSTANTS_DIR, `${baseName}.ts`),
    constants
  );
  
  console.log(`Generated constants for ${sdfFile}`);
}

createIndexFile(moleculeNames);
console.log('Successfully updated all molecule constants');
