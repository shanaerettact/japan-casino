import { z } from 'zod'

export const loginFormSchema = z.object({
  account: z
    .string()
    .trim()
    .min(1, 'アカウントを入力してください')
    .max(64, 'アカウントは64文字以内で入力してください'),

  password: z
    .string()
    .min(1, 'パスワードを入力してください')
    .max(256, 'パスワードが長すぎます'),

  fingerprint: z
    .string()
    .trim()
    .min(1, 'フィンガープリントが必要です'),

  captcha: z
    .string()
    .trim()
    .min(1, '認証コードを入力してください')
    .max(64, '認証コードが長すぎます'),

  language: z.preprocess(
    (v) => {
      if (v === undefined || v === null) return undefined
      if (typeof v === 'string' && v.trim() === '') return undefined
      return v
    },
    z
      .string()
      .trim()
      .min(2, '語系は2文字以上で指定してください')
      .max(10, '語系の指定が長すぎます')
      .optional(),
  ),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
