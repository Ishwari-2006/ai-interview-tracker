import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getQuestions, createQuestion, deleteQuestion, getInterviews } from '../services/api';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [interviews, setInterviews] = useState([]); // needed for the "which interview" dropdown
  const [filter, setFilter] = useState('All');       // active topic filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);   // toggle add question form

  // Form fields
  const [interviewId, setInterviewId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [topicTag, setTopicTag] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [wasStuck, setWasStuck] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch both questions and interviews when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, iRes] = await Promise.all([
          getQuestions(),    // GET /questions/
          getInterviews(),   // GET /interviews/ — for the dropdown
        ]);
        setQuestions(qRes.data);
        setInterviews(iRes.data);
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique topic tags from all questions — for filter buttons
  // new Set() removes duplicates, filter(Boolean) removes null/empty values
  const allTopics = ['All', ...new Set(questions.map(q => q.topic_tag).filter(Boolean))];

  // Filter questions by selected topic
  const filtered = filter === 'All'
    ? questions
    : questions.filter(q => q.topic_tag === filter);

  // Handle adding a new question
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = {
        interview_id: interviewId,
        question_text: questionText,
        topic_tag: topicTag || null,
        my_answer: myAnswer || null,
        was_stuck: wasStuck,
      };
      const res = await createQuestion(data);
      
      // Add new question to local state immediately (no re-fetch needed)
      const newQuestion = {
        id: res.data.question_id,
        interview_id: interviewId,
        question_text: questionText,
        topic_tag: topicTag || null,
        my_answer: myAnswer || null,
        was_stuck: wasStuck,
        created_at: new Date().toISOString(),
      };
      setQuestions(prev => [newQuestion, ...prev]);

      // Reset form fields
      setQuestionText('');
      setTopicTag('');
      setMyAnswer('');
      setWasStuck(false);
      setInterviewId('');
      setShowForm(false); // hide form after submit

    } catch (err) {
      alert('Failed to add question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this question?');
    if (!confirmed) return;
    setDeletingId(id);
    try {
      await deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  const selectClass = "w-full bg-slate-800 border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  // Predefined topic tags to choose from
  const topicOptions = ['DSA', 'System Design', 'OOP', 'DBMS', 'OS', 'Networking', 'HR', 'Behavioral', 'Frontend', 'Backend', 'Other'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400 animate-pulse">Loading questions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Question Bank</h1>
            <p className="text-gray-400 mt-1">
              {questions.length} question{questions.length !== 1 ? 's' : ''} logged
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition"
          >
            {showForm ? '✕ Cancel' : '+ Add Question'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Add Question Form — slides in when showForm is true */}
        {showForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-5">Add New Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Interview selector */}
              <div>
                <label className={labelClass}>Which Interview? *</label>
                <select
                  value={interviewId}
                  onChange={(e) => setInterviewId(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">-- Select Interview --</option>
                  {interviews.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.company_name} {i.role ? `— ${i.role}` : ''} {i.interview_date ? `(${i.interview_date})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question text */}
              <div>
                <label className={labelClass}>Question *</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className={inputClass}
                  rows={3}
                  placeholder="What was the question asked?"
                  required
                />
              </div>

              {/* Topic tag + Was stuck — side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Topic Tag</label>
                  <select
                    value={topicTag}
                    onChange={(e) => setTopicTag(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">-- Select Topic --</option>
                    {topicOptions.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-1">
                  {/* Checkbox for was_stuck */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setWasStuck(!wasStuck)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition cursor-pointer ${
                        wasStuck
                          ? 'bg-red-500 border-red-500'
                          : 'border-white/20 bg-white/5 group-hover:border-white/40'
                      }`}
                    >
                      {wasStuck && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm text-gray-300">I was stuck on this</span>
                  </label>
                </div>
              </div>

              {/* My answer */}
              <div>
                <label className={labelClass}>My Answer <span className="text-gray-500">(optional)</span></label>
                <textarea
                  value={myAnswer}
                  onChange={(e) => setMyAnswer(e.target.value)}
                  className={inputClass}
                  rows={3}
                  placeholder="What did you answer? What should you have said?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 text-sm"
              >
                {submitting ? 'Saving...' : '💾 Save Question'}
              </button>
            </form>
          </div>
        )}

        {/* Empty state */}
        {questions.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">❓</div>
            <h2 className="text-xl font-semibold text-white mb-2">No questions logged yet</h2>
            <p className="text-gray-400 mb-6">Add questions from your interviews to track what topics come up.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
            >
              Add Your First Question →
            </button>
          </div>
        ) : (
          <>
            {/* Topic filter pills */}
            <div className="flex gap-2 flex-wrap mb-6">
              {allTopics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setFilter(topic)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                    filter === topic
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {topic}
                  <span className="ml-1.5 opacity-60">
                    {topic === 'All'
                      ? questions.length
                      : questions.filter(q => q.topic_tag === topic).length}
                  </span>
                </button>
              ))}
            </div>

            {/* No results for this filter */}
            {filtered.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-gray-500">
                No questions tagged "{filter}" yet.
              </div>
            ) : (
              /* Questions list */
              <div className="space-y-3">
                {filtered.map(question => (
                  <div
                    key={question.id}
                    className={`bg-white/5 border rounded-xl p-5 transition hover:bg-white/8 ${
                      question.was_stuck
                        ? 'border-red-500/20'   // red border if stuck
                        : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">

                        {/* Top row: topic tag + stuck badge */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {question.topic_tag && (
                            <span className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                              {question.topic_tag}
                            </span>
                          )}
                          {question.was_stuck && (
                            <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-full font-medium">
                              🔴 Was Stuck
                            </span>
                          )}
                        </div>

                        {/* Question text */}
                        <p className="text-white text-sm font-medium leading-relaxed">
                          {question.question_text}
                        </p>

                        {/* My answer — only shown if exists */}
                        {question.my_answer && (
                          <div className="mt-3 bg-white/5 rounded-lg px-4 py-3">
                            <div className="text-xs text-gray-500 mb-1 font-medium">MY ANSWER</div>
                            <p className="text-gray-300 text-sm leading-relaxed">{question.my_answer}</p>
                          </div>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(question.id)}
                        disabled={deletingId === question.id}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-xs transition disabled:opacity-50 shrink-0"
                      >
                        {deletingId === question.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}