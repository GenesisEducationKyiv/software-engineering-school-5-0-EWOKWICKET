export type Data = Record<string, unknown>;
export type Labels = Record<string, string>;

export type InfoMetadata = {
  data: Data;
  labels?: Labels;
};

export type ErrorMetadata = {
  labels?: Labels;
  error: {
    name?: string;
    message?: string;
  };
};
