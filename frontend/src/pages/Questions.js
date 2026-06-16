import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getQuestions, createQuestion, deleteQuestion, getInterviews } from '../services/api';
import { T } from '../styles/theme';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [interviewId, setInterviewId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [topicTag, setTopicTag] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [wasStuck, setWasStuck] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getQuestions(), getInterviews()])
      .then(([qRes, iRes]) => { setQuestions(qRes.data); setInterviews(iRes.data); })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false));
  }, []);

  const allTopics = ['All', ...new Set(questions.map(q => q.topic_tag).filter(Boolean))];
  const filtered = filter === 'All' ? questions : questions.filter(q => q.topic_tag === filter);
  const topicOptions = ['DSA', 'System Design', 'OOP', 'DBMS', 'OS', 'Networking', 'HR', 'Behavioral', 'Frontend', 'Backend', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createQuestion({ interview_id: interviewId, question_text: questionText, topic_tag: topicTag || null, my_answer: myAnswer || null, was_stuck: wasStuck });
      setQuestions(prev => [{ id: res.data.question_id, interview_id: interviewId, question_text: questionText, topic_tag: topicTag || null, my_answer: myAnswer || null, was_stuck: wasStuck, created_at: new Date().toISOString() }, ...prev]);
      setQuestionText(''); setTopicTag(''); setMyAnswer(''); setWasStuck(false); setInterviewId(''); setShowForm(false);
    } catch { alert('Failed to add question.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    setDeletingId(id);
    try { await deleteQuestion(id); setQuestions(prev => prev.filter(q => q.id !== id)); }
    catch { alert('Failed to delete.'); }
    finally { setDeletingId(null); }
  };

  if (loading) return <div style={T.page}><Navbar /><div style={{ textAlign: 'center', padding: '100px', color: '#9b7e6e', fontStyle: 'italic' }}>Loading questions...</div></div>;

  return (
    <div style={T.page}>
      <Navbar />
      <div style={T.container}>
        <div style={T.pageHeader}>
          <div>
            <h1 style={T.pageTitle}>Question Bank</h1>
            <p style={{ color: '#9b7e6e', fontSize: '14px' }}>{questions.length} question{questions.length !== 1 ? 's' : ''} logged</p>
          </div>
          <button style={T.btnPrimary} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Question'}
          </button>
        </div>

        {error && <div style={{ ...T.error, marginBottom: '20px' }}>{error}</div>}

        {/* Add form */}
        {showForm && (
          <div style={{ ...T.card, marginBottom: '24px' }}>
            <h2 style={{ ...T.sectionTitle, marginBottom: '20px' }}>Add New Question</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={T.label}>Which Interview? *</label>
                <select value={interviewId} onChange={e => setInterviewId(e.target.value)} style={T.select} required>
                  <option value="">-- Select Interview --</option>
                  {interviews.map(i => <option key={i.id} value={i.id}>{i.company_name}{i.role ? ` — ${i.role}` : ''}</option>)}
                </select>
              </div>
              <div>
                <label style={T.label}>Question *</label>
                <textarea value={questionText} onChange={e => setQuestionText(e.target.value)} style={{ ...T.textarea, minHeight: '80px' }} placeholder="What was the question asked?" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={T.label}>Topic Tag</label>
                  <select value={topicTag} onChange={e => setTopicTag(e.target.value)} style={T.select}>
                    <option value="">-- Select Topic --</option>
                    {topicOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <div onClick={() => setWasStuck(!wasStuck)} style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${wasStuck ? '#8b2e2e' : '#ddd0bc'}`, backgroundColor: wasStuck ? '#8b2e2e' : '#f9f5ef', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      {wasStuck && <span style={{ color: 'white', fontSize: '11px' }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '13px', color: '#5c3d2e' }}>I was stuck on this</span>
                  </label>
                </div>
              </div>
              <div>
                <label style={T.label}>My Answer <span style={{ color: '#9b7e6e' }}>(optional)</span></label>
                <textarea value={myAnswer} onChange={e => setMyAnswer(e.target.value)} style={{ ...T.textarea, minHeight: '80px' }} placeholder="What did you answer? What should you have said?" />
              </div>
              <button type="submit" disabled={submitting} style={{ ...T.btnFull, opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'Saving...' : '💾 Save Question'}
              </button>
            </form>
          </div>
        )}

        {questions.length === 0 ? (
          <div style={{ ...T.card, textAlign: 'center', padding: '64px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#2c1a0e', marginBottom: '8px' }}>No questions logged yet</h2>
            <p style={{ color: '#9b7e6e', marginBottom: '24px', fontSize: '14px' }}>Add questions from your interviews to track what topics come up.</p>
            <button style={T.btnPrimary} onClick={() => setShowForm(true)}>Add Your First Question →</button>
          </div>
        ) : (
          <>
            {/* Topic filters */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {allTopics.map(topic => (
                <button key={topic} onClick={() => setFilter(topic)} style={{
                  padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: '1.5px solid',
                  backgroundColor: filter === topic ? '#2c1a0e' : '#ffffff',
                  color: filter === topic ? '#f5f0e8' : '#5c3d2e',
                  borderColor: filter === topic ? '#2c1a0e' : '#ddd0bc',
                }}>
                  {topic} <span style={{ opacity: 0.6 }}>{topic === 'All' ? questions.length : questions.filter(q => q.topic_tag === topic).length}</span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ ...T.card, textAlign: 'center', padding: '40px', color: '#9b7e6e', fontSize: '14px' }}>No questions tagged "{filter}" yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filtered.map(question => (
                  <div key={question.id} style={{ ...T.card, border: `1px solid ${question.was_stuck ? '#f0d0d0' : '#ddd0bc'}`, backgroundColor: question.was_stuck ? '#fdf9f9' : '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          {question.topic_tag && <span style={T.badge('brown')}>{question.topic_tag}</span>}
                          {question.was_stuck && <span style={T.badge('red')}>🔴 Was Stuck</span>}
                        </div>
                        <p style={{ color: '#2c1a0e', fontSize: '14px', fontWeight: '500', lineHeight: '1.6' }}>{question.question_text}</p>
                        {question.my_answer && (
                          <div style={{ marginTop: '12px', backgroundColor: '#f9f5ef', border: '1px solid #ede6d6', borderRadius: '8px', padding: '12px 16px' }}>
                            <div style={{ fontSize: '11px', color: '#9b7e6e', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Answer</div>
                            <p style={{ color: '#5c3d2e', fontSize: '13px', lineHeight: '1.6' }}>{question.my_answer}</p>
                          </div>
                        )}
                      </div>
                      <button onClick={() => handleDelete(question.id)} disabled={deletingId === question.id} style={{ ...T.btnDanger, flexShrink: 0, opacity: deletingId === question.id ? 0.5 : 1 }}>
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