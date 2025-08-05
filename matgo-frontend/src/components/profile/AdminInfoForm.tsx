import React from 'react';

interface AdminInfoFormProps {
  profile: any;
  editable: boolean;
  onSave: (data: any) => void;
}

const AdminInfoForm: React.FC<AdminInfoFormProps> = ({ profile, editable, onSave }) => {
  const [form, setForm] = React.useState(profile);

  React.useEffect(() => {
    setForm(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="admin-info-form" onSubmit={handleSubmit}>
      <input name="fullName" value={form.fullName || ''} onChange={handleChange} disabled={!editable} placeholder="Full Name" />
      <input name="email" value={form.email || ''} onChange={handleChange} disabled={!editable} placeholder="Email" />
      {editable && <button type="submit">Save</button>}
    </form>
  );
};

export default AdminInfoForm;
