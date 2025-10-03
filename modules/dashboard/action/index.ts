"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/action";


export const getAllPlaygroundForUser = async () => {
    const user = await currentUser();

    try {
        const playground = await db.playground.findMany({
            where: {
                userid:user?.id
            },
            include: {
                user: true
            }
        });

        return playground
    } catch (error) {
        console.log(error);
        
    }
}