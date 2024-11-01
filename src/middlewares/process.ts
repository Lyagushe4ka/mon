import { AbstractDatabase } from '../data';

export function applyProcessHandlers(database: AbstractDatabase<any>) {
  function handleProcessEvent(eventType: string, message: string) {
    process.on(eventType, (arg1?: any) => {
      console.log(message, arg1);
      database.save();
      process.exit(0);
    });
  }

  // catching ctrl+c event
  handleProcessEvent('SIGINT', 'Caught interrupt signal');

  // catching termination signal
  handleProcessEvent('SIGTERM', 'Caught termination signal');

  // catching unhandled promise rejection
  handleProcessEvent('unhandledRejection', 'Unhandled Rejection at:');

  // catching uncaught exception
  handleProcessEvent('uncaughtException', 'Caught exception:');

  // catching uncaught exception monitor
  handleProcessEvent('uncaughtExceptionMonitor', 'Caught exception:');
}
