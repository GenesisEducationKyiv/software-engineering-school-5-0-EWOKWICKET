import { filesOfProject } from 'tsarch';
import 'tsarch/dist/jest';

describe('arch rules', () => {
  const project = filesOfProject().inFolder('src');

  it("presentation shouldn't depend on infrastructure layer", async () => {
    const rule = project.inFolder('presentation').shouldNot().dependOnFiles().inFolder('infrastructure');
    await expect(rule).toPassAsync();
  });

  it("application should't depend on presentation layer", async () => {
    const rule = project.inFolder('application').shouldNot().dependOnFiles().inFolder('(presentation|infrastructure)/**');
    await expect(rule).toPassAsync();
  });

  it("domain should't depend on any other layer", async () => {
    const rule = project.inFolder('domain').shouldNot().dependOnFiles().matchingPattern('(presentation|application|infrastructure)/**');
    await expect(rule).toPassAsync();
  });
});
