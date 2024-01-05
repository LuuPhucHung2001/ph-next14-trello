// 'use server';
// import { z } from 'zod';
// import { db } from '@/lib/db';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';

// export type State = {
//   errors?: {
//     title?: string[] | any;
//   };
//   message?: string | null;
// };
// const CreateBoard = z.object({
//   title: z.string().min(3, {
//     message: 'Minimum length of 3 letters is required',
//   }),
// });

// export async function create(prevState: State, formData: FormData) {
//   const validateFields = CreateBoard.safeParse({
//     title: formData.get('title'),
//   });
//   if (!validateFields.success) {
//     return {
//       errors: validateFields.error.flatten().fieldErrors,
//       message: 'Missing fields.',
//     };
//   }
//   const { title } = validateFields.data;

//   try {
//     await db.board.create({
//       data: {
//         title,
//       },
//     });
//   } catch (error) {
//     return {
//       message: 'Database Error',
//     };
//   }
//   revalidatePath('/organization/org_2ZQWkZfcHZ7THHb2VomDhmbN9u7');
//   redirect('/organization/org_2ZQWkZfcHZ7THHb2VomDhmbN9u7');
// }
