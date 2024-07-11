export type LoginFormValues = {
  email: string;
  password: string;
};

export interface LoginApiResponse {
  access_token: string;
  token_type: string;
}
