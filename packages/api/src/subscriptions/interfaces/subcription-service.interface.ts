import { CreateSubscriptionDto } from '../dtos/create-subscription.dto';

export interface ControllerSubscriptionService {
  subscribe(subscribeDto: CreateSubscriptionDto): Promise<void>;
  confirm(token: string): Promise<void>;
  unsubscribe(token: string): Promise<void>;
}

export const ControllerSubscriptionServiceToken = 'ControllerSubscriptionService';
