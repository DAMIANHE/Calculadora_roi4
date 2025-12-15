import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    try {
        await client.connect();
        const db = client.db('roi-calculator');
        const demos = db.collection('demos');

        let demo = await demos.findOne({ id: 'demo_user' });
        if (!demo) {
            const startDate = new Date();
            await demos.insertOne({ id: 'demo_user', startDate });
            demo = { startDate };
        }

        const start = new Date(demo.startDate);
        const now = new Date();
        const daysPassed = Math.floor((now - start) / (1000 * 60 * 60 * 24));

        if (daysPassed > 10) {
            res.status(200).json({ status: 'expired', message: 'La demo ha expirado. Solicita la versión final.' });
        } else if (daysPassed >= 8) {
            res.status(200).json({
                status: 'warning',
                message: `Quedan ${10 - daysPassed} día(s) de demo.`,
                daysRemaining: 10 - daysPassed
            });
        } else {
            res.status(200).json({ status: 'active', message: '', daysRemaining: 10 - daysPassed });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error en el servidor.' });
    } finally {
        await client.close();
    }
}   
