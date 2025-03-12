
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import * as authActions from '../actions/authActions';

const token = localStorage.getItem('token');

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!token, // This ensures the state reflects the token presence
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(authActions.register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authActions.register.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      state.token = action.payload.token;
      state.isAuthenticated = true;
      toast.success('Registration successful! Please verify your email.');
    });
    builder.addCase(authActions.register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Registration failed');
    });

    // Login
    builder.addCase(authActions.login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authActions.login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      toast.success('Login successful!');
    });
    builder.addCase(authActions.login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Login failed');
    });

    // Logout
    builder.addCase(authActions.logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authActions.logout.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      toast.success('Logged out successfully');
    });
    builder.addCase(authActions.logout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Logout failed');
    });

    // Get User Profile
    builder.addCase(authActions.getUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authActions.getUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(authActions.getUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    });

    // Update User Profile
    builder.addCase(authActions.updateUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(authActions.updateUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      toast.success('Profile updated successfully');
    });
    builder.addCase(authActions.updateUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Failed to update profile');
    });

    // Verify Email
    builder.addCase(authActions.verifyEmail.fulfilled, (state) => {
      if (state.user) {
        state.user.isAccountVerified = true;
      }
      toast.success('Email verified successfully');
    });
    builder.addCase(authActions.verifyEmail.rejected, (state, action) => {
      console.error("Verification Error:", action.payload);
      toast.error(action.payload || 'Email verification failed');
    });

    // Send Verify OTP
    builder.addCase(authActions.sendVerifyOtp.fulfilled, () => {
      toast.success('Verification OTP sent to your email');
    });
    builder.addCase(authActions.sendVerifyOtp.rejected, (state, action) => {
      toast.error(action.payload || 'Failed to send verification OTP');
    });

    // Send Reset OTP
    builder.addCase(authActions.sendResetOtp.fulfilled, () => {
      toast.success('Password reset OTP sent to your email');
    });
    builder.addCase(authActions.sendResetOtp.rejected, (state, action) => {
      toast.error(action.payload || 'Failed to send reset OTP');
    });

    // Reset Password
    builder.addCase(authActions.resetPassword.fulfilled, () => {
      toast.success('Password reset successful');
    });
    builder.addCase(authActions.resetPassword.rejected, (state, action) => {
      toast.error(action.payload || 'Password reset failed');
    });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
