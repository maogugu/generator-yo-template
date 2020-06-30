const copyProps = (target, source) => {
  const notCopyKeys = ['name', 'constructor', 'prototype']
  Reflect.ownKeys(source).forEach((key) => {
    if (!notCopyKeys.indexOf(key)) {
      Object.defineProperty(
        target,
        key,
        Object.getOwnPropertyDescriptor(source, key)
      )
    }
  })
}

const mix = (...mixins) => (MixedClass) => {
  mixins.forEach((mixin) => {
    copyProps(MixedClass, mixin)
    copyProps(MixedClass.prototype, mixin.prototype)
  })

  return MixedClass
}

module.exports = mix
