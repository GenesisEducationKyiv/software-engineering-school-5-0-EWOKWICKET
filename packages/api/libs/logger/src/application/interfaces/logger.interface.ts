export abstract class ProviderLogger {
  abstract logProvider(message: string, executor: string, data: unknown);
}
