import "./exam.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTopics, getQuestions } from "../firebase/firestoreService";

// In-memory AI fallback when the question bank has fewer items than requested.
const generateFallback = (subject, topic, count) => {
  const templates = [
    {
      question_text: `Which of the following describes a key fundamental concept of ${topic} in ${subject}?`,
      options: [
        `A validated model defining ${topic} interactions.`,
        `A secondary option unrelated to the study of ${subject}.`,
        `An atmospheric reaction that does not involve ${topic}.`,
        `A mechanical approximation.`,
      ],
    },
    {
      question_text: `In practical experiments of ${subject}, how is the value of ${topic} typically analysed?`,
      options: [
        `By calculating numerical ratios specific to ${topic}.`,
        `Using static estimates that do not depend on ${topic}.`,
        `By ignoring the variable representing ${topic}.`,
        `Through external observations model.`,
      ],
    },
    {
      question_text: `What is the most common real-world application of ${topic}?`,
      options: [
        `Optimizing processes involving ${topic} properties.`,
        `Replacing it with unrelated chemical elements.`,
        `Simulating virtual structures without any parameters.`,
        `None of the above.`,
      ],
    },
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const t = templates[i % templates.length];
    out.push({ id: `ai-${i}`, question_text: t.question_text, options: t.options, answer: t.options[0] });
  }
  return out;
};

const ExamSetup = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [topics, setTopics] = useState([]);
    const [topic, setTopic] = useState("");
    const [count, setCount] = useState(10);
    const [loading, setLoading] = useState(false);

    // Load topics when a subject is entered
    useEffect(() => {
        if (!subject) {
            setTopics([]);
            setTopic("");
            return;
        }
        setLoading(true);
        getTopics(subject)
            .then((data) => {
                setTopics(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load topics", err);
                setLoading(false);
            });
    }, [subject]);

    const buildExam = async (subj, top, cnt) => {
        const fetched = await getQuestions(subj, top, Number(cnt));
        if (fetched.length >= Number(cnt)) return fetched;
        // Pad with AI-generated fallback questions (not persisted).
        return [...fetched, ...generateFallback(subj, top, Number(cnt) - fetched.length)];
    };

    const handleStart = async (e) => {
        e.preventDefault();
        if (!subject || !topic || !count) return;
        try {
            const questions = await buildExam(subject, topic, count);
            navigate("/exam/run", { state: { questions } });
        } catch (err) {
            console.error(err);
            alert("Error generating exam");
        }
    };

    // AI generation fallback when no topics are available
    const handleAIGenerate = async () => {
        if (!subject || !count) return;
        try {
            const questions = await buildExam(subject, "AI", count);
            navigate("/exam/run", { state: { questions } });
        } catch (err) {
            console.error(err);
            alert("Error with AI generation");
        }
    };

    return (
        <div className="exam-setup">
            <h2 className="exam-title">Start Exam</h2>
            <form onSubmit={handleStart} className="exam-form">
                <label className="exam-label">
                    Subject
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="exam-input"
                    />
                </label>
                <label className="exam-label">
                    Topic
                    <input
                        type="text"
                        list="topics-list"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        className="exam-input"
                        placeholder="Enter or select a topic"
                        disabled={loading}
                    />
                    <datalist id="topics-list">
                        {topics.map((t) => (
                            <option key={t} value={t} />
                        ))}
                    </datalist>
                </label>
                <label className="exam-label">
                    Number of Questions
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        required
                        className="exam-input"
                    />
                </label>
                <div className="exam-actions">
                    <button type="submit" className="primary-btn">
                        Start Exam
                    </button>
                    <button type="button" className="secondary-btn" onClick={handleAIGenerate}>
                        Generate AI Questions
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExamSetup;
