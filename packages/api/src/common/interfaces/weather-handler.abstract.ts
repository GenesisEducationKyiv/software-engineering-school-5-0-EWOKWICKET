export abstract class Chainable<Request, Response> {
  protected next?: Chainable<Request, Response>;

  abstract handle(data: Request): Promise<Response>;

  setNext(handler: Chainable<Request, Response>) {
    this.next = handler;
    return this;
  }
}
