export interface ISecureUser {
  username: string;
  email: string;
  grade?: string;
  profileImage: String | null;
  activeLoans?: String[] | null;
}