import db from '../db.js';

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) return res.status(401).send('Unauthorized');

    try {
        const section = await db.collection('sections').findOne({ token });
        if (!section) return res.status(401).send('Unauthorized');

        res.locals.user = section.user;

        next();
    } catch {
        return res.status(500).send('Error validating token');
    }
}