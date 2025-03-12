// This file re-exports everything from the actions and reducer for backward compatibility
import * as authActions from '../actions/authActions';
import authReducer, { setCredentials, clearCredentials } from '../reducers/authReducer';

// Re-export all the actions
export const {
  register,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  sendVerifyOtp,
  verifyEmail,
  sendResetOtp,
  resetPassword
} = authActions;

// Re-export the reducer actions
export { setCredentials, clearCredentials };

// Export the reducer as default
export default authReducer;
