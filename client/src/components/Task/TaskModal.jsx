import { useState, useEffect } from 'react';
import { IoSparkles } from 'react-icons/io5';
import Modal from '../UI/Modal';
import { suggestEstimate } from '../../api/ai';
import styles from './TaskModal.module.css';

export default function TaskModal({ isOpen, onClose, onSubmit, onDelete, task, mode = 'create' }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedEffort, setEstimatedEffort] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (task && mode === 'edit') {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setEstimatedEffort(task.estimatedEffort || '');
    } else {
      setTitle(''); setDescription(''); setStatus('todo');
      setPriority('medium'); setDueDate(''); setEstimatedEffort('');
    }
    setAiSuggestion(null);
  }, [task, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status, priority,
        dueDate: dueDate || null,
        estimatedEffort
      });
      onClose();
    } catch {
      // error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  const handleAISuggest = async () => {
    if (!title.trim()) return;
    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const res = await suggestEstimate({ title, description });
      setAiSuggestion(res.data.data);
    } catch {
      setAiSuggestion({ error: true });
    } finally {
      setAiLoading(false);
    }
  };

  const acceptSuggestion = () => {
    if (!aiSuggestion || aiSuggestion.error) return;
    if (aiSuggestion.suggestedDueDate) setDueDate(aiSuggestion.suggestedDueDate);
    const effortText = `${aiSuggestion.effort} (~${aiSuggestion.estimatedHours}h)`;
    setEstimatedEffort(effortText);
    setAiSuggestion(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Edit Task' : 'Create Task'}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Title *</label>
          <input className={styles.input} type="text" value={title}
            onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" required id="task-title" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} value={description}
            onChange={(e) => setDescription(e.target.value)} placeholder="Add details..." rows={3} id="task-description" />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)} id="task-status">
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Priority</label>
            <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)} id="task-priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Due Date</label>
            <input className={styles.input} type="date" value={dueDate}
              onChange={(e) => setDueDate(e.target.value)} id="task-due-date" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Effort Estimate</label>
            <input className={styles.input} type="text" value={estimatedEffort}
              onChange={(e) => setEstimatedEffort(e.target.value)} placeholder="e.g., S (~2h)" id="task-effort" />
          </div>
        </div>

        {/* AI Suggestion */}
        <div className={styles.aiSection}>
          <div className={styles.aiHeader}>
            <span className={styles.aiTitle}><IoSparkles /> AI Estimate</span>
            <button type="button" className={styles.aiBtn} onClick={handleAISuggest}
              disabled={aiLoading || !title.trim()} id="ai-suggest-btn">
              <IoSparkles />
              {aiLoading ? 'Thinking...' : 'Suggest'}
            </button>
          </div>

          {aiLoading && (
            <div className={styles.aiLoading}>
              <div className={styles.spinner} />
              <span>Consulting the AI oracle...</span>
            </div>
          )}

          {aiSuggestion && !aiSuggestion.error && (
            <div className={styles.aiResult}>
              <div className={styles.aiResultGrid}>
                <div className={styles.aiResultItem}>
                  <div className={styles.aiResultLabel}>Effort</div>
                  <div className={styles.aiResultValue}>{aiSuggestion.effort}</div>
                </div>
                <div className={styles.aiResultItem}>
                  <div className={styles.aiResultLabel}>Hours</div>
                  <div className={styles.aiResultValue}>{aiSuggestion.estimatedHours}h</div>
                </div>
                <div className={styles.aiResultItem}>
                  <div className={styles.aiResultLabel}>Due Date</div>
                  <div className={styles.aiResultValue}>{aiSuggestion.suggestedDueDate}</div>
                </div>
              </div>
              {aiSuggestion.reasoning && (
                <p className={styles.aiReasoning}>{aiSuggestion.reasoning}</p>
              )}
              {aiSuggestion.isMock && (
                <p className={styles.aiMock}>⚠ AI unavailable — showing mock estimate</p>
              )}
              <button type="button" className={styles.aiAcceptBtn} onClick={acceptSuggestion}>
                Accept Suggestion
              </button>
            </div>
          )}

          {aiSuggestion?.error && (
            <p style={{ color: 'var(--danger)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-3)' }}>
              Failed to get AI suggestion. Please try again.
            </p>
          )}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={submitting || !title.trim()} id="task-submit">
          {submitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : '🌸 Create Task'}
        </button>

        {mode === 'edit' && onDelete && (
          <button type="button" className={styles.deleteBtn}
            onClick={() => { onDelete(task._id); onClose(); }} id="task-delete">
            Delete Task
          </button>
        )}
      </form>
    </Modal>
  );
}
