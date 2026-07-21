import express from 'express';
import { getTopics, generateExam, submitAnswers } from '../services/examService.js';

const router = express.Router();

// GET /api/exam/topics?subject=SubjectName
router.get('/topics', async (req, res) => {
    const { subject } = req.query;
    if (!subject) return res.status(400).json({ error: 'Subject query param required' });
    try {
        const topics = await getTopics(subject);
        res.json({ topics });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
});

// POST /api/exam/generate  body: { subject, topic, count }
router.post('/generate', async (req, res) => {
    const { subject, topic, count } = req.body;
    if (!subject || !topic || !count) return res.status(400).json({ error: 'subject, topic, and count required' });
    try {
        const questions = await generateExam({ subject, topic, count });
        res.json({ questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate exam' });
    }
});

// POST /api/exam/submit  body: { answers: [{questionId, answer}] }
router.post('/submit', async (req, res) => {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) return res.status(400).json({ error: 'answers array required' });
    try {
        const result = await submitAnswers({ answers });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit answers' });
    }
});

export default router;
