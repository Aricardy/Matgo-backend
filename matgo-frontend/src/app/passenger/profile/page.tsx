"use client";
// Passenger Profile Page
import React, { useState, useEffect } from 'react';
import { useSession } from '../../../contexts/SessionContext';
import { fetchPassengerProfile, updatePassengerProfile, submitTripFeedback } from '../../../lib/api/passenger';
import { Avatar, TabLayout, PreferencesSecurity } from '@/components/profile/index';
import { useRouter } from 'next/navigation';
import type { PassengerProfile } from '@/types/profile';

const PassengerProfilePage = () => {
  const { user, role, token } = useSession();
  const [profile, setProfile] = useState<PassengerProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tab, setTab] = useState('personal');
  const router = useRouter();

  useEffect(() => {
    if (role !== 'passenger') {
      router.replace(`/${role}/dashboard`);
      return;
    }
    if (user && token) {
      fetchPassengerProfile(user.id, token).then(setProfile);
    }
  }, [user, role, token, router]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <header className="profile-header">
        <Avatar src={profile.avatarUrl} editable={editMode} onUpload={(file: File) => {/* handle upload */}} />
        <div>
          <h2>{profile.fullName}</h2>
          <p>{profile.email}</p>
        </div>
        <button onClick={() => setEditMode(e => !e)}>{editMode ? 'Save' : 'Edit'}</button>
      </header>
      <TabLayout activeTab={tab} onTabChange={setTab} tabs={['personal', 'trips', 'favorites', 'preferences']}>
        {tab === 'personal' && (
          <section>
            {/* Personal Info Form */}
          </section>
        )}
        {tab === 'trips' && (
          <section>
            {/* Trip History Cards */}
          </section>
        )}
        {tab === 'favorites' && (
          <section>
            {/* Favorites List */}
          </section>
        )}
        {tab === 'preferences' && (
          <PreferencesSecurity profile={profile} onLogout={() => {/* logout */}} />
        )}
      </TabLayout>
    </div>
  );
};

export default PassengerProfilePage;
