import { RowDataPacket } from 'mysql2';
import { conn } from './sqlwrapper';
import { Chat } from '../models/chat';

export async function returnChatId(userId, hostUserId) {
  const results = await conn.query<RowDataPacket[]>(
    'SELECT * FROM `chats` WHERE `isPrivate` = 1 AND `id` IN (SELECT `chatID` FROM `users_in_chats` WHERE `userID` = ?) AND `id` IN (SELECT `chatID` FROM `users_in_chats` WHERE `userID` = ?)',
    [userId, hostUserId],
  );
  return results[0];
}

export async function returnAllUserChats(userId): Promise<Chat[]> {
  const results = await conn.query<RowDataPacket[]>(
    'SELECT * FROM `chats`AS ch LEFT JOIN messages AS m ON m.chatID = ch.Id LEFT JOIN `users_in_chats` AS uc ON uc.chatID = ch.Id LEFT JOIN `users` AS u ON u.Id = uc.userID WHERE ch.Id IN (SELECT `chatID` FROM `users_in_chats` WHERE `userID` = ?) AND m.Id = ( SELECT MAX(Id) FROM `messages` WHERE chatID = ch.Id ) AND u.Id <> ?',
    [userId, userId],
  );
  return results[0].map((ch) => {
    const chat = new Chat();
    chat.userId = ch.id;
    chat.userEmail = ch.email;
    chat.chatId = ch.chatID;
    chat.name = ch.username;
    chat.avatar = ch.avatar;
    chat.last_message = ch.content;
    chat.time = ch.datetime;
    return chat;
  });
}
