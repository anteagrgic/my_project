export abstract class AbstractStub<T extends object> {
  abstract generate(): T;

  generateStubAndOverWrite(data: Partial<T> = {}): T {
    const stub = this.generate();
    return Object.assign(stub, data);
  }

  generateStubs(length: number, data: Partial<T>[] = []): T[] {
    const stubs: T[] = [];
    for (let i = 0; i < length; i++) {
      stubs.push(this.generateStubAndOverWrite(data[i]));
    }

    return stubs;
  }
}
