export abstract class CityHandler {
  protected next: CityHandler;

  abstract handle(city: string): Promise<void>;

  setNext(next: CityHandler) {
    this.next = next;
  }
}
