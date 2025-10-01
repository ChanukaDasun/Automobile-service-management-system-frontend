
export var Roles = 'admin' | 'user' | 'employee'

declare global {
  interface CustomUserMetadata {
    role?: Roles
  }
}