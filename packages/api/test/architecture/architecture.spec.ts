import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('arch rules', () => {
  it("presentation shouldn't depend on infrastructure layer", () => {
    const rule = filesOfProject().inFolder('src/presentation').shouldNot().dependOnFiles().inFolder('src/infrastructure');

    expect(rule).toPassAsync();
  });

  it("application should't depend on presentation layer", () => {
    const rule = filesOfProject().inFolder('src/application').shouldNot().dependOnFiles().inFolder('src/presentation');
    expect(rule).toPassAsync();
  });

  it("domain should't depend on any other layer", () => {
    const rule = filesOfProject().inFolder('src/domain').shouldNot().dependOnFiles().matchingPattern('**/{presentation,application,infrastructure}/**');
    expect(rule).toPassAsync();
  });
});
