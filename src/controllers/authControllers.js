import db from '../db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import joi from 'joi';

export async function signUp(req, res) {
    const { name, email, password, confirmationPassword } = req.body;
    const emailVerification = await db.collection('users').findOne({ email });
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmationPassword: joi.string().required()
    });

    if (emailVerification) {
        return res.status(400).send("The email is already in use");
    }
    if (password !== confirmationPassword) {
        return res.status(400).send("The confirmation password must be the same as the password");
    }

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(422).send(error.details.map(d => d.message));
        return;
    }

    try {
        await db.collection('users').insertOne({ name, email, password: await bcrypt.hash(password, 10) });
        await db.createCollection(email);
        res.status(201).json({ message: 'User created successfully' });
    } catch {
        res.status(500).send('Error creating user');
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(422).send(error.details.map(d => d.message));
        return;
    }

    try {
        const user = await db.collection("users").findOne({ email });
        const isValid = await bcrypt.compare(password, user.password);
        if (user && isValid) {
            const token = uuid();
            await db.collection("sections").insertOne({ token, user: user.email });
            res.status(200).json({ token, user: user.name });
        }
        else {
            res.status(401).send('Invalid email or password');
        }
    } catch {
        res.status(500).send('Error finding user');
    }
}
