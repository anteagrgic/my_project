import * as cluster from 'cluster';
import * as os from 'os';

import * as dotenv from 'dotenv';

dotenv.config();

export const NUM_CPUS =
  process.env.APP_CLUSTERING == 'true' ? os.cpus().length : 1;

export const MAIN_PROCESS_ID = 1;

/**
 * - If clustering is disabled, enable the scheduler
 * - If it's a worker process, disable the scheduler
 * - If it's a main process, enable the scheduler
 */

const cluster_ = cluster as unknown as cluster.Cluster;
export const IS_SCHEDULER_ENABLED =
  process.env.APP_CLUSTERING === 'false' ||
  (process.env.APP_CLUSTERING === 'true' &&
    cluster_.worker?.id === MAIN_PROCESS_ID);
