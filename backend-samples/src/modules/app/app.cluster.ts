/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChildProcess } from 'child_process';
import * as cluster from 'cluster';

import { Injectable, Logger } from '@nestjs/common';

import { NUM_CPUS } from 'src/common/constants/clustering';

type ProcessWithEnv = ChildProcess & { env: { id: number } };

const cluster_ = cluster as unknown as cluster.Cluster;

@Injectable()
export class AppClusterService {
  private static logger = new Logger(AppClusterService.name);
  static clusterize(callback: any): boolean {
    // Do not use cluster if there is only one CPU (Due to simplicity)
    if (NUM_CPUS === 1) {
      return false;
    }

    // If the process is primary, spawn other workers
    if (cluster_.isPrimary) {
      // Spawn workers, each for one CPU core
      for (let id = 1; id <= NUM_CPUS; id++) {
        const env = { id };
        const worker = cluster_.fork(env);
        (worker.process as ProcessWithEnv).env = env;
      }

      // When the worker dies, create new one
      cluster_.on('exit', (worker, code) => {
        this.logger.error(
          `Worker ${worker.process.pid} died with code ${code}, starting new...`,
        );
        cluster_.fork((worker.process as ProcessWithEnv).env);
      });

      // When the main process is terminated, kill all workers
      process.on('SIGINT', () => {
        this.logger.log(`Exiting...`);
        for (const id in cluster_.workers) {
          cluster_.workers[id].kill();
        }

        process.exit(0);
      });
    }

    //
    else {
      callback();
    }

    return true;
  }
}
