import * as z from 'zod'
export const ThreadValidation = z.object({
    thread: z.string().nonempty(),
    accountId: z.string(),
})

export const CommentValidation = z.object({
    thread: z.string().nonempty(),
    name: z.string().min(3, { message: "minimum 3 characters" }).max(200),
    accountId: z.string(),
    
})
