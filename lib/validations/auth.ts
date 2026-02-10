import { z } from 'zod/v4'

export const signinSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    gender: z.enum(['MALE', 'FEMALE'], { message: 'Please select a gender' }),
    lifeStage: z.enum(['SINGLE', 'SINGLE_PROFESSIONAL', 'MARRIED', 'PARENT'], {
      message: 'Please select a life stage',
    }),
    church: z.string().min(1, 'Church is required'),
    satellite: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.church === 'CCF') {
        return !!data.satellite && data.satellite.length > 0
      }
      return true
    },
    {
      message: 'Please select a CCF satellite',
      path: ['satellite'],
    }
  )

export type SigninInput = z.infer<typeof signinSchema>
export type SignupInput = z.infer<typeof signupSchema>
