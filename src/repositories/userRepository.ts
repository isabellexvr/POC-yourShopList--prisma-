import { UserEntity, Session } from './../protocols/usersProtocols';
import prisma from '../database/db';

function getUserByEmail(email: string): Promise<UserEntity | null> {
    //upsert
    return prisma.users.findFirst({
        where: { email: email }
    })
}

function createSession(userId: number, token: string): Promise<Session> {

    // return connection.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2)`, [userId, token])
    return prisma.sessions.create({
        data: {
            userId: userId,
            token: token
        }
    })
}

function findSession(userId: number): Promise<Session | null> {

    return prisma.sessions.findFirst({
        where: {
            userId: userId
        }
    })
}

function createUser(name: string, email: string, password: string): Promise<UserEntity> {
    return prisma.users.create({
        data: {
            name: name,
            email: email,
            password: password
        }
    })
    //  return connection.query("INSERT INTO users (name, email, password) VALUES ($1,$2,$3);", [name, email, password]);
}

function deleteSession(userId: number): Promise<Session | null> {
    return prisma.sessions.delete({ where: { userId: userId } });
    //return connection.query(`DELETE FROM sessions WHERE "userId"=$1`, [userId])
}

const userRepository = {
    getUserByEmail,
    createSession,
    findSession,
    createUser,
    deleteSession
}

export default userRepository