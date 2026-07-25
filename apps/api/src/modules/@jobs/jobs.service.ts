import { Injectable, Logger } from '@nestjs/common';

// Generic queue service — feature modules inject their specific queues via @InjectQueue()
// Example usage in feature module:
//   @Module({ imports: [BullModule.registerQueue({ name: 'email' })] })
//   class EmailProcessor extends WorkerHost { async process(job: Job) { ... } }
@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor() {
    this.logger.log('JobsService initialized');
  }
}
