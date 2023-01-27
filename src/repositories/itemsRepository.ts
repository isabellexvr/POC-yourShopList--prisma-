import prisma from "../database/db";
import { itemNotFoundError } from "../errors/listsErrors";
import { ListEntity, ListsItemsEntity, ItemEntity } from "../protocols/listsProtocols";

async function insertList(listName: string, userId: number): Promise<number> {
    //return connection.query(`INSERT INTO lists ("listName", "userId") VALUES ($1,$2) RETURNING id;`, [listName, userId])
    const insertedList = await prisma.lists.create({
        data: { listName: listName, userId: userId },
    });
    return insertedList.id;
}

function insertIntoList(listId: number, itemId: number): Promise<ListsItemsEntity> {

    //return connection.query(`INSERT INTO "listsItems" ("listId", "itemId") VALUES ($1,$2)`, [listId, itemId])
    return prisma.listsItems.create({
        data: {
            listId,
            itemId
        }
    })
}

function findItemByName(itemName: string): Promise<ItemEntity | null> {
    //return connection.query(`SELECT * FROM items WHERE "itemName"=$1;`, [itemName]);
    return prisma.items.findFirst({ where: { itemName } });
};

function insertNewItem(itemName: string): Promise<ItemEntity> {
    // return connection.query(`INSERT INTO items ("itemName") VALUES ($1) RETURNING id;`, [itemName]);
    return prisma.items.create({
        data: { itemName }
    })
}

async function deleteItem(listId: number, itemId: number): Promise<ListsItemsEntity | null> {
    //return connection.query(`DELETE FROM "listsItems" WHERE "listId"=$1 AND "itemId"=$2`, [Number(listId), Number(itemId)]);
     const entity: ListsItemsEntity | null = await prisma.listsItems.findFirst({ where: { listId, itemId } });
    if (entity) {
        return prisma.listsItems.delete({
            where: { id: entity.id }
        })
    }
    throw itemNotFoundError(); 
}

function deleteAllItemsFromList(listId: number) {
    // return connection.query(`DELETE FROM "listsItems" WHERE "listId"=$1`, [listId]);
    return prisma.listsItems.deleteMany({
        where: {
            listId: listId
        }
    })
}

const itemsRepository = {
    insertList,
    insertIntoList,
    findItemByName,
    insertNewItem,
    deleteItem,
    deleteAllItemsFromList
}

export default itemsRepository