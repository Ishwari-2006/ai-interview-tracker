// import { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import { getProfile, updateProfile, getDashboardStats } from '../services/api';

// export default function Profile() {
//   // Profile data from backend
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Edit form fields
//   const [name, setName] = useState('');
//   const [targetRole, setTargetRole] = useState('');
//   const [targetCompanies, setTargetCompanies] = useState('');

//   // Edit mode toggle
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   // Fetch profile + stats together when page loads
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [pRes, sRes] = await Promise.all([
//           getProfile(),
//           getDashboardStats(),
//         ]);
//         setProfile(pRes.data);
//         setStats(sRes.data);
//         // Pre-fill edit form with current values
//         setName(pRes.data.name);
//         setTargetRole(pRes.data.target_role || '');
//         setTargetCompanies(pRes.data.target_companies || '');
//       } catch (err) {
//         setError('Failed to load profile.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setSaveSuccess(false);
//     try {
//       await updateProfile({
//         name,
//         target_role: targetRole || null,
//         target_companies: targetCompanies || null,
//       });
//       // Update local profile state so page reflects new name immediately
//       setProfile(prev => ({ ...prev, name, target_role: targetRole, target_companies: targetCompanies }));
//       setEditing(false);
//       setSaveSuccess(true);
//       // Hide success message after 3 seconds
//       setTimeout(() => setSaveSuccess(false), 3000);
//     } catch (err) {
//       alert('Failed to save. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputClass = "w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm";
//   const labelClass = "block text-sm font-medium text-gray-300 mb-1";

//   // Get initials from name for the avatar circle
//   // e.g. "Ishwari Sharma" → "IS"
//   const getInitials = (name) => {
//     if (!name) return '?';
//     return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
//   };

//   // Format the joined date nicely
//   const formatDate = (dateStr) => {
//     if (!dateStr) return '—';
//     return new Date(dateStr).toLocaleDateString('en-IN', {
//       day: 'numeric', month: 'long', year: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
//         <Navbar />
//         <div className="flex items-center justify-center h-96">
//           <div className="text-gray-400 animate-pulse">Loading profile...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
//         <Navbar />
//         <div className="flex items-center justify-center h-96">
//           <div className="text-red-400">{error}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
//       <Navbar />

//       <div className="max-w-3xl mx-auto px-6 py-10">

//         {/* Page header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-white">Profile</h1>
//           <p className="text-gray-400 mt-1">Manage your account details</p>
//         </div>

//         {/* Success message */}
//         {saveSuccess && (
//           <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg mb-6 text-sm">
//             ✅ Profile updated successfully!
//           </div>
//         )}

//         {/* Avatar + name card */}
//         <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 flex items-center gap-5">
//           {/* Avatar circle with initials */}
//           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0">
//             {getInitials(profile.name)}
//           </div>
//           <div>
//             <div className="text-xl font-bold text-white">{profile.name}</div>
//             <div className="text-gray-400 text-sm">{profile.email}</div>
//             <div className="text-gray-600 text-xs mt-1">
//               Member since {formatDate(profile.created_at)}
//             </div>
//           </div>
//         </div>

//         {/* Stats row */}
//         {stats && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             {[
//               { label: 'Interviews', value: stats.total_interviews },
//               { label: 'Pass Rate', value: `${stats.pass_rate}%` },
//               { label: 'Questions', value: stats.total_questions },
//               { label: 'Stuck', value: stats.stuck_questions },
//             ].map(s => (
//               <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
//                 <div className="text-2xl font-bold text-white">{s.value}</div>
//                 <div className="text-gray-500 text-xs mt-1">{s.label}</div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Profile details card */}
//         <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-white">Account Details</h2>
//             {!editing && (
//               <button
//                 onClick={() => setEditing(true)}
//                 className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-sm transition"
//               >
//                 ✏️ Edit
//               </button>
//             )}
//           </div>

//           {editing ? (
//             /* Edit form */
//             <form onSubmit={handleSave} className="space-y-4">
//               <div>
//                 <label className={labelClass}>Full Name *</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className={inputClass}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Email</label>
//                 <input
//                   type="text"
//                   value={profile.email}
//                   className={inputClass + ' opacity-50 cursor-not-allowed'}
//                   disabled
//                 />
//                 <p className="text-gray-600 text-xs mt-1">Email cannot be changed</p>
//               </div>
//               <div>
//                 <label className={labelClass}>Target Role</label>
//                 <input
//                   type="text"
//                   value={targetRole}
//                   onChange={(e) => setTargetRole(e.target.value)}
//                   className={inputClass}
//                   placeholder="e.g. Software Engineer Intern, Data Analyst"
//                 />
//               </div>
//               <div>
//                 <label className={labelClass}>Target Companies</label>
//                 <input
//                   type="text"
//                   value={targetCompanies}
//                   onChange={(e) => setTargetCompanies(e.target.value)}
//                   className={inputClass}
//                   placeholder="e.g. Google, Microsoft, Infosys"
//                 />
//               </div>
//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 text-sm"
//                 >
//                   {saving ? 'Saving...' : '💾 Save Changes'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setEditing(false);
//                     // Reset fields back to original values if cancelled
//                     setName(profile.name);
//                     setTargetRole(profile.target_role || '');
//                     setTargetCompanies(profile.target_companies || '');
//                   }}
//                   className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           ) : (
//             /* View mode */
//             <div className="space-y-4">
//               {[
//                 { label: 'Full Name', value: profile.name },
//                 { label: 'Email', value: profile.email },
//                 { label: 'Target Role', value: profile.target_role || 'Not set' },
//                 { label: 'Target Companies', value: profile.target_companies || 'Not set' },
//               ].map(field => (
//                 <div key={field.label} className="flex flex-col gap-1 py-3 border-b border-white/5 last:border-0">
//                   <span className="text-xs text-gray-500 uppercase tracking-wider">{field.label}</span>
//                   <span className={`text-sm ${field.value === 'Not set' ? 'text-gray-600 italic' : 'text-white'}`}>
//                     {field.value}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getProfile, updateProfile, getDashboardStats } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompanies, setTargetCompanies] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, sRes] = await Promise.all([getProfile(), getDashboardStats()]);
        setProfile(pRes.data);
        setStats(sRes.data);
        setName(pRes.data.name);
        setTargetRole(pRes.data.target_role || '');
        setTargetCompanies(pRes.data.target_companies || '');
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, target_role: targetRole || null, target_companies: targetCompanies || null });
      setProfile(prev => ({ ...prev, name, target_role: targetRole, target_companies: targetCompanies }));
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-400 mb-1";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400 animate-pulse">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

        {saveSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg mb-6 text-sm">
            ✅ Profile updated successfully!
          </div>
        )}

        {/* TOP BANNER — like Amazon/app style profile header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-slate-800/40 border border-white/10 rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-32 translate-x-32" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
            {/* Big avatar */}
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shrink-0 shadow-lg shadow-blue-500/20">
              {getInitials(profile.name)}
            </div>

            {/* Name + details */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{profile.name}</h1>
              <p className="text-gray-400 mt-1">{profile.email}</p>

              {/* Target role badge */}
              {profile.target_role && (
                <div className="inline-block mt-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-full">
                  🎯 {profile.target_role}
                </div>
              )}

              {/* Target companies */}
              {profile.target_companies && (
                <div className="inline-block mt-2 ml-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs rounded-full">
                  🏢 {profile.target_companies}
                </div>
              )}

              <p className="text-gray-600 text-xs mt-3">
                🗓️ Member since {formatDate(profile.created_at)}
              </p>
            </div>

            {/* Edit button */}
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="shrink-0 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-sm transition"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* STATS ROW — like app dashboards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Interviews', value: stats.total_interviews, icon: '🏢', color: 'text-blue-400' },
              { label: 'Pass Rate', value: `${stats.pass_rate}%`, icon: '✅', color: 'text-green-400' },
              { label: 'Questions', value: stats.total_questions, icon: '❓', color: 'text-yellow-400' },
              { label: 'Stuck On', value: stats.stuck_questions, icon: '🔴', color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/8 transition">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Account Info card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              👤 Account Info
            </h2>
            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="text" value={profile.email} className={inputClass + ' opacity-40 cursor-not-allowed'} disabled />
                  <p className="text-gray-600 text-xs mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className={labelClass}>Target Role</label>
                  <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)} className={inputClass} placeholder="e.g. Software Engineer Intern" />
                </div>
                <div>
                  <label className={labelClass}>Target Companies</label>
                  <input type="text" value={targetCompanies} onChange={e => setTargetCompanies(e.target.value)} className={inputClass} placeholder="e.g. Google, Microsoft" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50">
                    {saving ? 'Saving...' : '💾 Save'}
                  </button>
                  <button type="button" onClick={() => { setEditing(false); setName(profile.name); setTargetRole(profile.target_role || ''); setTargetCompanies(profile.target_companies || ''); }}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-sm transition">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: profile.name, icon: '👤' },
                  { label: 'Email', value: profile.email, icon: '📧' },
                  { label: 'Target Role', value: profile.target_role || 'Not set', icon: '🎯' },
                  { label: 'Target Companies', value: profile.target_companies || 'Not set', icon: '🏢' },
                ].map(field => (
                  <div key={field.label} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <span className="text-base mt-0.5">{field.icon}</span>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">{field.label}</div>
                      <div className={`text-sm ${field.value === 'Not set' ? 'text-gray-600 italic' : 'text-white'}`}>
                        {field.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Summary card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              📊 Activity Summary
            </h2>
            <div className="space-y-4">

              {/* Pass rate progress bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Pass Rate</span>
                  <span className="text-green-400 font-medium">{stats?.pass_rate || 0}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${stats?.pass_rate || 0}%` }} />
                </div>
              </div>

              {/* Stuck rate progress bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Questions Stuck On</span>
                  <span className="text-red-400 font-medium">
                    {stats?.total_questions > 0
                      ? Math.round(stats.stuck_questions / stats.total_questions * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats?.total_questions > 0 ? Math.round(stats.stuck_questions / stats.total_questions * 100) : 0}%` }} />
                </div>
              </div>

              {/* Weak topics list */}
              {stats?.stuck_by_topic?.filter(t => t.topic).length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Top Weak Areas</div>
                  <div className="space-y-1.5">
                    {stats.stuck_by_topic
                      .filter(t => t.topic)
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 3)
                      .map(t => (
                        <div key={t.topic} className="flex justify-between items-center bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                          <span className="text-gray-300 text-xs">{t.topic}</span>
                          <span className="text-red-400 text-xs font-medium">{t.count} stuck</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="pt-2 border-t border-white/5">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '+ Log Interview', to: '/log' },
                    { label: '📊 Dashboard', to: '/dashboard' },
                    { label: '❓ Questions', to: '/questions' },
                    { label: '🤖 AI Insights', to: '/insights' },
                  ].map(link => (
                    <a key={link.label} href={link.to}
                      className="text-center text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-2 transition">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}