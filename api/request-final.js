import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { name, email, company } = req.body;

    try {
        await client.connect();
        const db = client.db('roi-calculator');
        await db.collection('requests').insertOne({ name, email, company, date: new Date() });
        res.status(200).json({ message: 'Solicitud enviada. Te contactaremos pronto.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    } finally {
        await client.close();
    }
}
