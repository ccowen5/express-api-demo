import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { asyncHandler } from '../utils/asyncHandler';

export const usersRouter = Router();

usersRouter.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const result = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
  res.status(200).json(result.rows);
}));

usersRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  const result = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json(result.rows[0]);
}));

usersRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body ?? {};
  if (typeof name !== 'string' || typeof email !== 'string' || !name || !email) {
    res.status(400).json({ error: 'name and email are required' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    if (isUniqueViolation(err)) {
      res.status(409).json({ error: 'A user with that email already exists' });
      return;
    }
    throw err;
  }
}));

usersRouter.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  const { name, email } = req.body ?? {};
  if (typeof name !== 'string' || typeof email !== 'string' || !name || !email) {
    res.status(400).json({ error: 'name and email are required' });
    return;
  }

  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err: unknown) {
    if (isUniqueViolation(err)) {
      res.status(409).json({ error: 'A user with that email already exists' });
      return;
    }
    throw err;
  }
}));

usersRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);

  if (result.rowCount === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(204).send();
}));

function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505';
}
