import {inject} from '@loopback/core';
import {get, param, post} from '@loopback/rest';
import {Application, CoreBindings, createBindingFromClass} from '@loopback/core';

import { RedditFeedJobProvider } from '../jobs/reddit-feed-job-provider';
import { CronJobConfig, CronJob } from '@loopback/cron';

export class JobController {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {
    this.app = app;
  }

  @get('/rss/subscribe')
  async subscribeToFeed(
      @param.query.string('url') url: string,
  ) {
      const jobBinding = createBindingFromClass(RedditFeedJobProvider);
      this.app.add(jobBinding);
      const jobConfig: CronJobConfig = {
        start: false,
        context: {
            url,
        },
      };
      this.app.configure(jobBinding.key).to(jobConfig);

      const cronJob = await this.app.get<CronJob>(jobBinding.key);
      cronJob.start();

  }
}
