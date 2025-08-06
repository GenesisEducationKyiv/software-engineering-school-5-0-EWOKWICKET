import { GrpcErrorDetails } from '@common/constants/grpc-error.type';

export class GrpcError extends Error implements GrpcErrorDetails {
  code: number;
  details: string;
}
