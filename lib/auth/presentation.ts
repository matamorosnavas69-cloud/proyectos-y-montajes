/**
 * Temporary, explicitly enabled presentation access.
 *
 * It never bypasses sign-in. When enabled, every authenticated user receives
 * the administrative role so a live product walkthrough is not interrupted by
 * Clerk metadata provisioning. Remove the environment flag to restore RBAC.
 */
export const isPresentationMode =
  process.env.NEXT_PUBLIC_PRESENTATION_MODE === 'true';
