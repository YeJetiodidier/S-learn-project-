// Exam Service - provides topic list and random question generation
import { pool } from "../config/db.js";

/**
 * Get distinct topics for a given subject.
 * @param {string} subject
 * @returns {Promise<string[]>}
 */
export const getTopics = async (subject) => {
    const result = await pool.query(
        `SELECT DISTINCT topic FROM questions WHERE subject = $1 ORDER BY topic`,
        [subject]
    );
    return result.rows.map((r) => r.topic);
};

export const generateExam = async ({ subject, topic, count }) => {
    // 1. Fetch existing questions from DB
    const result = await pool.query(
        `SELECT id, question_text, options FROM questions WHERE LOWER(subject) = LOWER($1) AND LOWER(topic) = LOWER($2) ORDER BY RANDOM() LIMIT $3`,
        [subject, topic, count]
    );
    let questions = result.rows;

    // 2. If questions are fewer than count, generate AI fallback ones
    if (questions.length < count) {
        const needed = count - questions.length;
        for (let i = 1; i <= needed; i++) {
            const index = questions.length + i;
            const templates = [
                {
                    text: `Which of the following describes a key fundamental concept of ${topic} in ${subject}?`,
                    options: [
                        `A validated model defining ${topic} interactions.`,
                        `A secondary option unrelated to the study of ${subject}.`,
                        `An atmospheric reaction that does not involve ${topic}.`,
                        `A mechanical approximation.`
                    ]
                },
                {
                    text: `In practical experiments of ${subject}, how is the value of ${topic} typically analysed?`,
                    options: [
                        `By calculating numerical ratios specific to ${topic}.`,
                        `Using static estimates that do not depend on ${topic}.`,
                        `By ignoring the variable representing ${topic}.`,
                        `Through external observations model.`
                    ]
                },
                {
                    text: `What is the most common real-world application of ${topic}?`,
                    options: [
                        `Optimizing processes involving ${topic} properties.`,
                        `Replacing it with unrelated chemical elements.`,
                        `Simulating virtual structures without any parameters.`,
                        `None of the above.`
                    ]
                }
            ];

            const template = templates[index % templates.length];
            const qText = template.text;
            const options = template.options;
            const answer = options[0];

            try {
                const insertRes = await pool.query(
                    `INSERT INTO questions (subject, topic, question_text, options, answer) VALUES ($1, $2, $3, $4, $5) RETURNING id, question_text, options`,
                    [subject, topic, qText, JSON.stringify(options), answer]
                );
                if (insertRes.rows.length) {
                    questions.push(insertRes.rows[0]);
                }
            } catch (err) {
                console.error("Error inserting generated AI question:", err.message);
                // Fallback to in-memory question if DB insert fails
                questions.push({
                    id: -index,
                    question_text: qText,
                    options: options
                });
            }
        }
    }
    return questions;
};

/**
 * (Optional) Submit answers and calculate score.
 * @param {{answers: Array<{questionId:number, answer:string}>}} payload
 * @returns {Promise<{score:number, total:number}>}
 */
export const submitAnswers = async ({ answers }) => {
    const total = answers.length;
    let correct = 0;
    for (const { questionId, answer } of answers) {
        const res = await pool.query(`SELECT answer FROM questions WHERE id = $1`, [questionId]);
        if (res.rows.length && res.rows[0].answer === answer) correct++;
    }
    return { score: correct, total };
};
