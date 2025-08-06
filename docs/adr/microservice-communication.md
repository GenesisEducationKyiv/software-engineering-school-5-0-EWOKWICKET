# **ADR-003: Choice of Communication Type Between Microservices**

**Status**: Accepted\
**Date**: 2025-08-08\
**Author**: Hushchin Ivan

## Context

Need to choose effective and scalable way of communication between each microservice.

## Considered options

1. **HTTP(REST)**

   - ➕ Simple and familiar
   - ➕ Easy debugging
   - ➖ Uses more CPU resources and time on frequent requests
   - ➖ Synchronous client-server requests only

2. **Message Brokers**

   - ➕ Asynchronous communication
   - ➕ Good for load balancing
   - ➕ Better delivery control
   - ➖ Harder to scale
   - ➖ Requires major architectural changes

3. **gRPC**
   - ➕ High-perfomance
   - ➕ Supports streaming
   - ➕ Strict contracts
   - ➖ Harder to learn
   - ➖ Harder to debug
   - ➖ Requires some setup and maintaining
   - ➖ Overhead for small projects(no significant perfomance improvements)

## Decision

**RabbitMQ** for communication with NotificationService for control and efficiency\
**gRPC** in other cases

## Consequences

### Positive

- Fast and efficient communication between internal microservices
- Streaming support for asynchronous communication
- Easily implemented without changing business logic, especially in NestJS
- Strict communication contracts

### Negative

- Unnecessary complexity for current project

## Diagram

![Service-Communication](../img/Application-Architecture.png)

