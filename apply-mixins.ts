import 'reflect-metadata';

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  const staticPropsToIgnore = new Set(['length', 'prototype', 'name']);

  baseCtors.forEach((baseCtor) => {
    // Copy class level metadata
    Reflect.getMetadataKeys(baseCtor).forEach((metadataKey) => {
      Reflect.defineMetadata(metadataKey, Reflect.getMetadata(metadataKey, baseCtor), derivedCtor);
    });
    // copy prototype level metadata
    Reflect.getMetadataKeys(baseCtor.prototype).forEach((metadataKey) => {
      Reflect.defineMetadata(metadataKey, Reflect.getMetadata(metadataKey, baseCtor.prototype), derivedCtor.prototype);
    });

    // Loop over static properties
    Object.getOwnPropertyNames(baseCtor).forEach((staticProp) => {
      if (!staticPropsToIgnore.has(staticProp)) {
        console.log('staticProp', staticProp);
        derivedCtor[staticProp] = baseCtor[staticProp];
      }
    });

    // Loop over prototype properties
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((propName) => {
      // copy prototype property level metadata

      Reflect.getMetadataKeys(baseCtor.prototype, propName).forEach((metadataKey) => {
        Reflect.defineMetadata(metadataKey, Reflect.getMetadata(metadataKey, baseCtor.prototype, metadataKey), derivedCtor.prototype, propName);
      });

      Reflect.getMetadataKeys(baseCtor.prototype, propName).forEach((metadataKey) => {
        Reflect.defineMetadata(metadataKey, Reflect.getMetadata(metadataKey, baseCtor.prototype, propName), derivedCtor.prototype, propName);
      });

      if (propName !== 'constructor') {
        Object.defineProperty(derivedCtor.prototype, propName, Object.getOwnPropertyDescriptor(baseCtor.prototype, propName));
      }
    });
  });
}
