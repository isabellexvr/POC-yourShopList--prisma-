import { UserLists } from './../protocols/listsProtocols';
import prisma from '../database/db';
import { ListEntity, ListsItemsEntity, ItemEntity } from '../protocols/listsProtocols';

function finglistByUserId(listName: string, userId: number): Promise<ListEntity | null> {
    //return connection.query(`SELECT * FROM lists WHERE "listName"=$1 AND "userId"=$2;`, [listName, userId])
    return prisma.lists.findFirst({ where: { userId, listName } });
}

function getListByListId(userId: number, listId: number): Promise<ListEntity | null> {
    // return connection.query(`SELECT * FROM lists WHERE "userId"=$1 AND id=$2;`, [userId, listId]);
    return prisma.lists.findFirst({ where: { userId, id: listId } });
}

function getAllListsByUserId(userId: number) {
    /*     return connection.query(`
            SELECT 
                l."listName",
                ARRAY_TO_JSON(
                    ARRAY_AGG(
                        JSONB_BUILD_OBJECT(
                            'item', i."itemName" 
                        ) 
                    ) 
                ) AS items
            FROM lists l 
            JOIN "listsItems" li 
                ON l.id =li."listId" 
            JOIN users u 
                ON l."userId"=u.id
            JOIN items i
                ON i.id = li."itemId" 
            WHERE u.id=$1
            GROUP BY u.id, l.id
    ;`, [userId]); */
    return prisma.users.findUnique({
        where: {
            id: userId
        },
        select: {
            name: true,
            lists: {
                select: {
                    listName: true,
                    listsItems: {
                        select: {
                            items: {
                                select: {
                                    itemName: true
                                }
                            }
                        }
                    }
                }
            },

        }
    })
}

function getList(listId: number, userId: number) {
    /*     return connection.query(`
        SELECT 
            u."name" as owner,
            l."listName",
            ARRAY_TO_JSON(
                ARRAY_AGG(
                    JSONB_BUILD_OBJECT(
                        'item', i."itemName" 
                    ) 
                ) 
            ) AS items
        FROM lists l 
        JOIN "listsItems" li 
            ON l.id =li."listId" 
        JOIN users u 
            ON l."userId"=u.id
        JOIN items i
            ON i.id = li."itemId" 
        WHERE l.id=$1 AND u.id=$2
        GROUP BY u.id, l.id
    ;
    `, [listId, userId]); */
    return prisma.lists.findFirst({
        where: {
            id: listId, userId: userId
        },
        select: {
            listName: true,
            listsItems: {
                select: {
                    items: {
                        select: {
                            itemName: true
                        }
                    }
                }
            }
        }
    })
}

function deleteList(listId: number, userId: number) {
    // return connection.query(`DELETE FROM lists WHERE "listId"=$1 AND "userId"=$2;`, [Number(listId), userId]);
    return prisma.lists.delete({ where: { id: listId } })

}

const listsRepository = {
    finglistByUserId,
    getListByListId,
    getAllListsByUserId,
    getList,
    deleteList
}

export default listsRepository