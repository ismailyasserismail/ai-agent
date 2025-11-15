export class Logger {
  constructor(private context: string) {}

  info(message: string, meta?: unknown) {
    console.log(`[INFO] [${this.context}] ${message}`, meta ?? '');
  }

  warn(message: string, meta?: unknown) {
    console.warn(`[WARN] [${this.context}] ${message}`, meta ?? '');
  }

  error(message: string, meta?: unknown) {
    console.error(`[ERROR] [${this.context}] ${message}`, meta ?? '');
  }
}

export const createLogger = (context: string) => new Logger(context);
