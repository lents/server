import { addPost, saveMessage } from '../services/user-service';

import Multer from 'multer';

export const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 32 * 1024 * 1024, // no larger than 32mb
  },
});

class MessageController {
  async addPost(request, response, next) {
    const DATA = {
      wallId: request.body.wallId,
      authorId: request.body.authorId,
      text: request.body.postText ? request.body.postText : '',
      photos: request.file ? request.file.buffer : '',
    };
    const res = await addPost(DATA);
    if (res) {
      response.json(res);
    }
  }

  async saveMessage(request, response, next) {
    const DATA = {
      chatId: request.body.message.chatId,
      content: request.body.message.content,
      datetime: request.body.message.datetime,
      sendBy: request.body.message.sendBy,
    };
    const res = await saveMessage(DATA);
    if (res) {
      response.json(res);
    }
  }
}

export const messageController = new MessageController();
