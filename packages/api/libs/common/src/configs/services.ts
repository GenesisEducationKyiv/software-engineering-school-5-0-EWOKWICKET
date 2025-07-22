import { SubscriptionServiceClient, SubscriptionServiceService } from '@proto/subscription';
import { WeatherServiceClient, WeatherServiceService } from '@proto/weather';

function extractServiceMetadata<T extends Record<string, { path: string }>>(client: { serviceName: string }, service: T) {
  const endpoints = {} as { [K in keyof T]: K }; //for typization
  for (const key in service) {
    endpoints[key] = key;
  }

  return {
    name: client.serviceName.split('.').pop(),
    endpoints: Object.freeze(endpoints),
  };
}

export const GrpcServices = Object.freeze({
  WEATHER: extractServiceMetadata(WeatherServiceClient, WeatherServiceService),
  SUBSCRIPTION: extractServiceMetadata(SubscriptionServiceClient, SubscriptionServiceService),
});
