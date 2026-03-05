import z from 'zod';

const createSpecialtySchema = z.object({
  title: z.string('Title is required'),
  description: z.string('description is required').optional(),
});

export const SpecialtyValidation = {
  createSpecialtySchema,
};
