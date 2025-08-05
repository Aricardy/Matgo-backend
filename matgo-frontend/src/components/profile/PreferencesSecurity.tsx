import React from 'react';

interface PreferencesSecurityProps {
  profile: any;
  onLogout: () => void;
}

const PreferencesSecurity: React.FC<PreferencesSecurityProps> = ({ profile, onLogout }) => (
  <div className="preferences-security">
    <div className="toggles">
      <label>
        Theme
        <input type="checkbox" />
      </label>
      <label>
        Language
        <select>
          <option>English</option>
          <option>Kiswahili</option>
        </select>
      </label>
      <label>
        Notifications
        <input type="checkbox" />
      </label>
    </div>
    <form className="password-change">
      <h4>Change Password</h4>
      <input type="password" placeholder="Current Password" />
      <input type="password" placeholder="New Password" />
      <input type="password" placeholder="Confirm New Password" />
      <button type="submit">Change Password</button>
    </form>
    <button className="logout-btn" onClick={onLogout}>Logout</button>
  </div>
);

export default PreferencesSecurity;
