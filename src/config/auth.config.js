const authConfig = {
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-jwt-secret-in-production',
  SESSION_SECRET: process.env.SESSION_SECRET || 'change-this-session-secret-in-production',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000,
};

export const {
  JWT_SECRET,
  SESSION_SECRET,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_TIME,
} = authConfig;

export default authConfig;