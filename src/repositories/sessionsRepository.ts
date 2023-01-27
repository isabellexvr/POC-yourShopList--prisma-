import prisma from "../database/db";
import { Session } from "../protocols/usersProtocols";

export async function findSession(token: string, userId: number): Promise<Session | null> {
    //  return connection.query(`SELECT * FROM sessions WHERE "userId"=$1 AND token=$2`,[userId, token])
    return prisma.sessions.findFirst({ where: { userId, token } })
}