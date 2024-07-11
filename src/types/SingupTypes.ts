export type SignupFormValues = {
  username: string;
  email: string;
  password: string;
  is_active: boolean;
  role: string;
  image_url : string;
};

export interface SignupApiResponse {
  uuid: string;
  username: string;
  email: string;
  is_active: boolean;
  role: string;
  image_url: string;
}
