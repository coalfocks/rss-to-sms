// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {get, param} from '@loopback/rest';
import {RssService} from '../services/rss.service';


export class RssController {
  constructor(
      @inject('services.RssService')
      protected rssService: RssService,
  ) {}

  @get('/rss/reddit')
  async getRedditRssFeed(
      @param.query.string('url') url: string,
  ) {
      return this.rssService.getRedditRss(url);
  }
}
