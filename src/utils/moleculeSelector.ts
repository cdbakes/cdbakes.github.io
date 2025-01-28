import { molecules, moleculeNames } from '@/constants/molecules';

// Get a random molecule name
export const getRandomMoleculeName = () => {
  const index = Math.floor(Math.random() * moleculeNames.length);
  return moleculeNames[index];
};

// Get molecule constants by name
export const getMoleculeConstants = (name: typeof moleculeNames[number]) => {
  return molecules[name];
};

// Get random molecule constants
export const getRandomMoleculeConstants = () => {
  const name = getRandomMoleculeName();
  return getMoleculeConstants(name);
};
