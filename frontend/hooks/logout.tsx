"use server"
import { cookies } from 'next/headers';

export async function deleteCookies(name:string){
    (await cookies()).delete(name)
  }
