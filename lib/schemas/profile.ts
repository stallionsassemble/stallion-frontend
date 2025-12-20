import { z } from 'zod'

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  location: z.string().min(1, 'Please select a location'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),

  // Socials
  twitter: z.string().min(1, 'Twitter username is required'),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  github: z.string().optional(),
  discord: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
})

export type ProfileValues = z.infer<typeof profileSchema>
