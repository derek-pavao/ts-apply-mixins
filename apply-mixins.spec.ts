import 'reflect-metadata';
import { applyMixins } from './apply-mixins';

@Reflect.metadata('parentClassKey', 'parentClassValue')
class ParentClass {
  public foo: string;
  @Reflect.metadata('parentPropertyKey', 'parentPropertyValue')
  public bar(): string {
    return 'baz';
  }
}

@Reflect.metadata('childClassKey', 'childClassValue')
class ChildClass extends ParentClass {
  @Reflect.metadata('childPropertyKey', 'childPropertyValue')
  public beep(): string {
    return 'boop';
  }
}

@Reflect.metadata('siblingClassKey', 'siblingClassValue')
class SiblingClass {
  public static bob(): string {
    return 'bits';
  }
  @Reflect.metadata('siblingPropertyKey', 'siblingPropertyValue')
  public bleep(): string {
    return 'blurp';
  }
}
interface ChildClass extends SiblingClass, ParentClass  {}
applyMixins(ChildClass, [SiblingClass]);

describe('applyMixins', () => {
  let child: ChildClass;
  beforeEach(() => {
    child = new ChildClass();
  });

  it('should have all the method from all classes', () => {

    expect(child.beep).toBeDefined();
    expect(child.bar).toBeDefined();
    expect(child.bleep).toBeDefined();
    expect(ChildClass['bob']).toBeDefined();

    // this line is a compiler error
    expect(ChildClass.bob).toBeDefined();
  });

  it('should retain all metadata', () => {
    expect(Reflect.getMetadata('parentClassKey', ChildClass)).toBe('parentClassValue');
    expect(Reflect.getMetadata('childClassKey', ChildClass)).toBe('childClassValue');
    expect(Reflect.getMetadata('siblingClassKey', ChildClass)).toBe('siblingClassValue');
    expect(Reflect.getMetadata('parentPropertyKey', ChildClass.prototype, 'bar')).toBe(
      'parentPropertyValue'
    );
    expect(Reflect.getMetadata('childPropertyKey', ChildClass.prototype, 'beep')).toBe(
      'childPropertyValue'
    );

    expect(Reflect.getMetadata('siblingPropertyKey', ChildClass.prototype, 'bleep')).toBe(
      'siblingPropertyValue'
    );

  });
});
