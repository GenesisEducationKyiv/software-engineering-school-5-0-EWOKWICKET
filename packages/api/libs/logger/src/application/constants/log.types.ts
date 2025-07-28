export type Data = Record<string, unknown>;
export type Labels = Record<string, string>;
export type Metadata = {
  data?: Data;
  labels?: Labels;
};
