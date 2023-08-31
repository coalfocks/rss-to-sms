import {CronJob, cronJob, CronJobConfig} from '@loopback/cron';
import {config, Provider} from '@loopback/core';
import { RssService } from '../services/rss.service';
import { MessageService } from '../services/message.service';
import {inject} from '@loopback/core';

@cronJob()
export class RedditFeedJobProvider implements Provider<CronJob> {
  constructor(
      @config() private jobConfig: CronJobConfig = {},
      @inject('services.RssService') protected rssService: RssService,
      @inject('services.MessageService') protected messageService: MessageService
  ) {}
  value() {
    const frequency = process.env.FREQUENCY || 5;
    const job = new CronJob({
      name: 'reddit-feed-job',
      start: true,
      cronTime: `*/${frequency} * * * *`,
      onTick: async () => {
        try {
            const items = await this.rssService.getRedditRss(this.jobConfig.context.url, parseInt(process.env.ITEMS_QUANTITY || '30'));
            await this.messageService.mailToNumber(process.env.PHONE_NUMBER || '', process.env.CARRIER || '', process.env.FROM_ADDRESS || '', items);
        } catch (error) {
            console.error(error);
        }
      },
      ...this.jobConfig,
    });
    return job;
  }
}

