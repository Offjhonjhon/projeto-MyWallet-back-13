import db from '../db.js';
import joi from 'joi';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';

const day = dayjs();

export async function getResgisters(req, res) {
    const { user } = res.locals;
    try {
        const registers = await db.collection(user).find().toArray();
        res.status(200).json(registers);
    } catch {
        res.status(500).send('Error finding user');
    }
}

export async function createRegister(req, res) {
    const operation = req.body;
    const date = day.format("DD/MM");
    const operationId = uuid();
    const { user } = res.locals;

    const schema = joi.object({
        value: joi.number().required(),
        description: joi.string().required(),
        type: joi.string().required().valid('deposit', 'withdraw')
    });

    const { error } = schema.validate(operation, { abortEarly: false });
    if (error) {
        return res.status(422).send(error.details.map(d => d.message));
    }

    try {
        await db.collection(user).insertOne({ ...operation, date, operationId });
        res.status(201).json({ message: 'Register created successfully' });
    } catch {
        res.status(500).send('Error creating register');
    }

}

export async function updateRegister(req, res) {
    const { id, value, description } = req.body;
    const { user } = res.locals;

    const schema = joi.object({
        value: joi.number().required(),
        description: joi.string().required(),
        id: joi.string().required()
    })

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(422).send(error.details.map(d => d.message));
    }

    try {
        await db.collection(user).updateOne({ operationId: id }, { $set: { value, description } });
        res.status(200).json({ message: 'Register updated successfully' });
    }
    catch {
        res.status(500).send('Error updating register');
    }
}

export async function deleteRegister(req, res) {
    const { id } = req.body;
    const { user } = res.locals;

    const schema = joi.object({
        id: joi.string().required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(422).send(error.details.map(d => d.message));
    }

    try {
        await db.collection(user).deleteOne({ operationId: id });
        res.status(200).json({ message: 'Register deleted successfully' });
    } catch {
        res.status(500).send('Error deleting register');
    }
}