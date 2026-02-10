import { z } from 'zod/v4'

export const createGroupSchema = z.object({
  name: z.string().min(2, 'Group name must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  schedule: z.string().min(3, 'Schedule is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.string().min(1, 'Group type is required'),
  joinMode: z.enum(['AUTO_ACCEPT', 'REQUEST_TO_JOIN']),
  status: z.enum(['PUBLIC', 'PRIVATE']),
  maxMembers: z.number().int().min(2).max(50),
})

export const updateGroupSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  schedule: z.string().min(3).optional(),
  location: z.string().min(2).optional(),
  type: z.string().min(1).optional(),
  joinMode: z.enum(['AUTO_ACCEPT', 'REQUEST_TO_JOIN']).optional(),
  status: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  maxMembers: z.number().int().min(2).max(50).optional(),
})

export const updateMemberRoleSchema = z.object({
  role: z.enum(['LEADER', 'APPRENTICE', 'MEMBER']),
})

export const handleJoinRequestSchema = z.object({
  action: z.enum(['APPROVED', 'REJECTED']),
})

export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
