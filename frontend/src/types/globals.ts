export const Roles = {
  Admin: "admin",
  User: "user",
  Employee: "employee"
} as const;

export type Roles = typeof Roles[keyof typeof Roles];

declare global {
  interface CustomUserMetadata {
    role?: Roles
  }
}