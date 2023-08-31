import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { parse } from 'rss-to-json';

import { MessageService } from './message.service';

@injectable({scope: BindingScope.APPLICATION})
export class RssService {
  private last: string | null;

  constructor(/* Add @inject to inject parameters */) {
      this.last = null;
  }

  async getRssFeed(feedUrl: string) {
    return await parse(feedUrl);
  }

  stripHtml(html: string) {
    return html.replace(/<[^>]*>?/gm, '');
  }

  stripLinks(posts: string[]) {
    return posts.map(post => {
        if (!post.match(/http.*/gm)) {
            return post;
        }
    });
  }

  async getRedditRss(feedUrl: string, limit = 25) {
    const sortByNew = `${feedUrl}?sort=new`;
    const afterUrl = this.last ? `${sortByNew}&after=${this.last}` : sortByNew;
    const url = limit ? `${afterUrl}&limit=${limit}` : afterUrl;
    try {
        const feed = await this.getRssFeed(url);
        if (feed.items[1].id === this.last) {
            throw new Error('No new posts');
        }
        this.last = feed.items[1].id ?? this.last;
        const items = feed.items.map(item => {
          return this.stripHtml(item.content);
        });
        items.shift();
        return MessageService.formatItems(this.stripLinks(items));
    } catch (e) {
        console.error(e);
        throw e;
    }
  }

  registerRssFeed(feedUrl: string) {
    // TODO
    // do we add the .rss here for reddit?
  }
}
