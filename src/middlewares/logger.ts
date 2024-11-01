const unwantedMessages = [
  'JsonRpcProvider failed to detect network and cannot start up; retry in 1s (perhaps the URL is wrong or the node is not started)',
];

export function applyLoggerHandler() {
  const originalConsoleLog = console.log;

  console.log = function (...args: any[]) {
    const shouldLog = args.every(
      (arg) =>
        !unwantedMessages.some((unwanted) => typeof arg === 'string' && arg.includes(unwanted)),
    );

    if (shouldLog) {
      originalConsoleLog.apply(console, args);
    }
  };
}
