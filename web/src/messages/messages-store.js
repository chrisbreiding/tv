import { observable } from 'mobx';

class MessagesStore {
  @observable messages = [];

  add (message) {
    this.messages.push(message);
    return message;
  }

  remove (message) {
    this.messages.remove(message);
  }
}

export default new MessagesStore();
