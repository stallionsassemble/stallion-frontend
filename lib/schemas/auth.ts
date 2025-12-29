import { z } from 'zod'

// --- Authentication Schemas ---

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

export const registerSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
})

// --- Onboarding Schemas ---

export const talentOnboardingSchema = z.object({
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
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),

  // Socials (optional but validated if present)
  twitter: z.string().optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  github: z.string().optional(),
  discord: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),

  emailNotifications: z.boolean(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

export const ownerOnboardingSchema = z.object({
  // About You
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
  profilePicture: z.string().optional(),

  // About Company
  companyName: z.string().min(2, 'Company name is required'),
  entityName: z.string().min(2, 'Entity name is required'),
  phoneNumber: z.string().min(5, 'Please enter a valid phone number'), // Basic length check
  industry: z.string().min(1, 'Please select an industry'),
  companyLogo: z.string().optional(),
  companyBio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),

  // Socials
  twitter: z.string().optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),

  emailNotifications: z.boolean(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type TalentOnboardingValues = z.infer<typeof talentOnboardingSchema>
export type OwnerOnboardingValues = z.infer<typeof ownerOnboardingSchema>
