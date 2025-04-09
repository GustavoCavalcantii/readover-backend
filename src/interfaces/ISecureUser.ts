export interface ISecureUser {
  id: string;
  username: string;
  email: string;
  grade?: string;
  profileImage: String | null;
  activeLoans?: String[] | null;
}