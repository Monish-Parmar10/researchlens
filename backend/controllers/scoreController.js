const axios = require('axios');
const Score = require('../models/Score');
const Paper = require('../models/Paper');

// ── POST /api/score ────────────────────────────────────────────────────
// Step 1: fetch paper text from MongoDB
// Step 2: call Radhika's Python /score endpoint
// Step 3: save scores to MongoDB
// Step 4: return scores
exports.saveScore = async (req, res) => {
    try {
        const { paperId } = req.body;

        if (!paperId) {
            return res.status(400).json({ error: 'paperId is required' });
        }

        // Step 1 — Get paper text from MongoDB
        const paper = await Paper.findById(paperId);
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        let scores = null;
        let isMock = false;

        // Step 2 — Call Radhika's Python /score endpoint
        try {
            console.log('🐍 Calling Python /score service...');
            const response = await axios.post(
                `${process.env.AI_SERVICE_URL}/score`,
                { text: paper.extractedText },
                { timeout: 60000 }
            );
            scores = response.data.scores;
            console.log('✅ Got real scores from Python service');

        } catch (pyError) {
            // Mock fallback until Radhika's service is ready
            console.warn('⚠️ Python /score service not ready — using mock scores');
            isMock = true;
            scores = {
                methodology: { score: 7, reason: 'Mock: Solid methodology used' },
                novelty: { score: 8, reason: 'Mock: Good novel contribution' },
                clarity: { score: 6, reason: 'Mock: Mostly clear writing' },
                references: { score: 7, reason: 'Mock: Well referenced' },
                reproducibility: { score: 5, reason: 'Mock: Partial reproducibility' },
                contribution: { score: 8, reason: 'Mock: Strong contribution' },
                overall: { score: 7, reason: 'Mock: Good overall paper' }
            };
        }

        // Step 3 — Save to MongoDB (update if exists)
        let scoreDoc = await Score.findOne({ paperId });
        if (scoreDoc) {
            scoreDoc.scores = scores;
            await scoreDoc.save();
        } else {
            scoreDoc = new Score({ paperId, scores });
            await scoreDoc.save();
        }

        console.log(`💾 Scores saved for paperId: ${paperId}`);

        // Step 4 — Return scores
        return res.status(201).json({
            score_id: scoreDoc._id,
            paperId: scoreDoc.paperId,
            scores: scoreDoc.scores,
            createdAt: scoreDoc.createdAt,
            ...(isMock && { _mock: true })
        });

    } catch (err) {
        console.error('❌ Score save failed:', err.message);
        return res.status(500).json({
            error: 'Failed to save scores',
            details: err.message
        });
    }
};

// ── GET /api/score/:paperId ────────────────────────────────────────────
// Returns saved scores for a paper
exports.getScore = async (req, res) => {
    try {
        const score = await Score.findOne({ paperId: req.params.paperId });

        if (!score) {
            return res.status(404).json({
                error: 'Scores not found for this paper. Call POST /api/score first.'
            });
        }

        return res.status(200).json(score);

    } catch (err) {
        console.error('❌ Score fetch failed:', err.message);
        return res.status(500).json({
            error: 'Failed to fetch scores',
            details: err.message
        });
    }
};