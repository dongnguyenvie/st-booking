/** Site-wide settings the admin panel edits. Local until saved. */
export interface AdminSettingsState {
  siteName: string;
  supportEmail: string;
  emailNotifications: boolean;
  maintenanceMode: boolean;
  twoFactorRequired: boolean;
}
