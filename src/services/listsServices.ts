import { listNameConflictError, listNotFoundError } from '../errors/listsErrors';
import { List, ItemEntity, ListEntity } from '../protocols/listsProtocols';
import { QueryResult } from 'pg';
import listsRepository from '../repositories/listsRepository';
import itemsRepository from '../repositories/itemsRepository';


async function checkListExistence(listName: string, userId: number): Promise<List | null> {

    const checkListName: List | null = await listsRepository.finglistByUserId(listName, userId);

    if (checkListName) throw listNameConflictError();

    return checkListName;
}

async function checkItemExistence(itemName: string): Promise<number> {

    const checkItemName: ItemEntity | null = await itemsRepository.findItemByName(itemName)

    if (checkItemName) return checkItemName.id;

    const newItem: ItemEntity = await itemsRepository.insertNewItem(itemName)

    return newItem.id;

}

async function checkIfListBelongsToUser(userId: number, listId: number): Promise<number> {

    const list: ListEntity | null = await listsRepository.getListByListId(userId, listId);

    if (!list) throw listNotFoundError();

    return list.id;

};

const listsServices = {
    checkListExistence,
    checkItemExistence,
    checkIfListBelongsToUser
};

export default listsServices;