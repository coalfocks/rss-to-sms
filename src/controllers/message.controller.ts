import {inject} from '@loopback/core';
import {get, param, post} from '@loopback/rest';
import {MessageService} from '../services/message.service';
import {RssService} from '../services/rss.service';


export class MessageController {
  constructor(
      @inject('services.MessageService')
      protected messageService: MessageService,
      @inject('services.RssService')
      protected rssService: RssService,
  ) {}

  @post('/message/send')
  async sendFeed(
    @param.query.string('url') url: string,
  ) {
      const items = await this.rssService.getRedditRss(url);
      return await this.messageService.mailToNumber(process.env.PHONE_NUMBER || '', process.env.CARRIER || '', process.env.FROM_ADDRESS || '', items);
  }
}

