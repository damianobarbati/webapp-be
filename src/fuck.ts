import { setTimeout } from 'timers/promises';

type ciccio_fn = (input: ciccio_input) => Promise<ciccio_output>;

type ciccio_input = {
  value: number;
};

type ciccio_output = number;

export const ciccio: ciccio_fn = async (input) => {
  const { value } = input;

  await setTimeout(1);
  return value + 1;
};
