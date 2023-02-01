import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  starWars,
} from "unique-names-generator";

const customConfig: Config = {
  dictionaries: [adjectives, colors, starWars],
  separator: "-",
  length: 3,
};

export const generateName = (): string => uniqueNamesGenerator(customConfig); // big-donkey
