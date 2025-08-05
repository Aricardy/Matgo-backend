import React from 'react';

interface AccountSecurityProps {
  userId: string;
  token: string;
}

const AccountSecurity: React.FC<AccountSecurityProps> = ({ userId, token }) => (
  <div className="account-security">
    <h4>Change Password</h4>
    <form>
      <input type="password" placeholder="Current Password" />
      <input type="password" placeholder="New Password" />
      <input type="password" placeholder="Confirm New Password" />
      <button type="submit">Change Password</button>
    </form>
  </div>
);

export default AccountSecurity;
