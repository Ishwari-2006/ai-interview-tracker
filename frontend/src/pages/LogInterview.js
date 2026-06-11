import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createInterview } from '../services/api';

export default function LogInterview() {
  // Each piece of state holds one form field's value
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [roundType, setRoundType] = useState('');
  const [outcome, setOutcome] = useState('Pending');
  const [difficulty, setDifficulty] = useState('');
  const [notes, setNotes] = useState('');

  // These two track loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Build the data object to send to the backend
      const data = {
        company_name: companyName,
        role: role || null,
        interview_date: interviewDate || null,
        round_type: roundType || null,
        outcome: outcome,
        difficulty: difficulty || null,
        notes: notes || null,
      };

      await createInterview(data); // calls POST /interviews/
      setSuccess(true);

      // Wait 1.5 seconds then redirect to history page
      setTimeout(() => {
        navigate('/history');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reusable style strings — so we don't repeat the same classes everywhere
  const inputClass = "w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  const selectClass = "w-full bg-slate-800 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Log New Interview</h1>
          <p className="text-gray-400 mt-2">Fill in the details of your interview below.</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg mb-6 text-sm">
            ✅ Interview logged successfully! Redirecting to history...
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm">
            ❌ {error}
          </div>
        )}

        {/* The form card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Row 1: Company + Role side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Google, TCS, Infosys"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. SWE Intern, Data Analyst"
                />
              </div>
            </div>

            {/* Row 2: Date + Round Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Interview Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Round Type</label>
                <select
                  value={roundType}
                  onChange={(e) => setRoundType(e.target.value)}
                  className={selectClass}
                >
                  <option value="">-- Select Round --</option>
                  <option value="HR">HR</option>
                  <option value="Technical">Technical</option>
                  <option value="DSA">DSA</option>
                  <option value="System Design">System Design</option>
                  <option value="Managerial">Managerial</option>
                </select>
              </div>
            </div>

            {/* Row 3: Outcome + Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Outcome</label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className={selectClass}
                >
                  <option value="Pending">Pending</option>
                  <option value="Pass">Pass ✅</option>
                  <option value="Fail">Fail ❌</option>
                  <option value="No Response">No Response</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={selectClass}
                >
                  <option value="">-- Select Difficulty --</option>
                  <option value="Easy">Easy 🟢</option>
                  <option value="Medium">Medium 🟡</option>
                  <option value="Hard">Hard 🔴</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={inputClass}
                rows={4}
                placeholder="What happened? What topics came up? How did you feel?"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : '📋 Log Interview'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/history')}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}