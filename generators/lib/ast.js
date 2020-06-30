const js = require('jscodeshift')
const fs = require('fs-extra')
const babylon = require('babylon');
const recast = require('recast');
const toPairs = require('lodash.topairs')

const tsParse = (entry, content) => {
  const parse = source => babylon.parse(source, {
    sourceType: 'module',
    plugins: entry.endsWith('.tsx') ? ['jsx', 'typescript', 'objectRestSpread', 'decorators'] : ['typescript', 'objectRestSpread', 'decorators'],
  });
  return js(recast.parse(content, { parser: { parse } }));
}

const trans = (path, processors) => {
  const origin = fs.readFileSync(path, 'utf8')
  return processors.reduce(
    (content, processor) => {
      const result = processor(content)
      return result
    },
    origin
  )
}

const rewrite = (path, processors) => {
  const result = trans(path, processors)
  fs.outputFileSync(path, result)
}

const hasAttr = (attr) => (nodePath) => {
  const { openingElement: { attributes = [] } } = nodePath.node
  if (!attributes.length) {
    return false
  }

  return attributes.reduce((result, attribute) => {
    const { name: key } = attribute.name
    const { value } = attribute.value
    const hasSpecAttribute = (key in attr) ? attr[key] === value : true
    return result && hasSpecAttribute
  }, true)
}

const createClosingElement = (identifier) => js.jsxClosingElement(
  js.jsxIdentifier(identifier)
)

const createClosingElementByOpeningElement = (openingElement) =>
  createClosingElement(openingElement.name.name)

const createJSXProps = (props) => toPairs(props).map(([key, value = {}]) => js.jsxAttribute(
  js.jsxIdentifier(key),
  typeof value === 'string' ?
    js.literal(value) :
    js.jsxExpressionContainer(
      js.jsxIdentifier(value.expression)
    )
))

const createJSXElement = (identifier, props, children) => {
  const hasChildren = !!(children && children.length)
  return js.jsxElement(
    js.jsxOpeningElement(
      js.jsxIdentifier(identifier),
      createJSXProps(props),
      !hasChildren
    ),
    ...(hasChildren ? [
      js.jsxClosingElement(
        js.jsxIdentifier(identifier)
      ),
      children,
    ] : [])
  )
}

const createFormattingElement = () => js.jsxText('\n')

js.registerMethods({
  findImport(module) {
    const imports = this.find(js.ImportDeclaration)

    return module ?
      imports
        .filter((path) => path.node.source.value === module)
        .at(0) :
      imports
  },

  addImport(module, name) {
    const importDeclaration = name ?
      `import ${name} from '${module}'` :
      `import '${module}'`

    return this
      .findImport()
      .at(-1)
      .insertAfter(importDeclaration)
  },

  getImportIdentifier(module) {
    return this
      .findImport(module)
      .find(js.ImportDefaultSpecifier)
      .at(0)
      .find(js.Identifier)
      .at(0)
      .get()
      .node
      .name
  },

  findVariableDeclarator(name){
    return this.find(js.VariableDeclarator,{
      name: {
        text: name
      }
    })
  },

  findVariableCall(callName) {
    return this
      .find(js.VariableDeclarator, {
        init: {
          callee: {
            type: 'Identifier',
            name: callName,
          },
        },
      })
      .at(0)
  },

  getCallVariable(callName) {
    return this
      .findVariableCall(callName)
      .get()
      .node
      .id
      .name
  },

  findMemberCall(objectName, propertyName) {
    return this
      .find(js.ExpressionStatement, {
        expression: {
          type: 'CallExpression',
          callee: {
            type: 'MemberExpression',
            object: {
              type: 'Identifier',
              name: objectName,
            },
            property: {
              type: 'Identifier',
              name: propertyName,
            },
          },
        },
      })
  },

  findChildJSXElements(identifier, attr) {
    const result = this
      .findJSXElements(identifier)
    return attr ? result.filter(hasAttr(attr)) : result
  },

  findRouter() {
    return this.findJSXElements('Router')
  },

  findRoute(paths) {
    return paths.reduce((collection, path) => collection.findChildJSXElements('Route', { path }), this)
  },

  appendJSXElements(...nodes) {
    if (!nodes || !nodes.length) {
      return this
    }

    return this.replaceWith((path) => {
      const { node } = path
      const { children, openingElement, closingElement } = node

      const nodeWithClosingElement = closingElement ? {} : {
        closingElement: createClosingElementByOpeningElement(openingElement),
      }

      const nodeWithOpeningElement = {
        openingElement: Object.assign(
          openingElement,
          { selfClosing: false }
        ),
      }

      const initedChildren = children.length ? children : [
        createFormattingElement(),
      ]
      const appendedChildren = nodes.concat(initedChildren);
      const redirect = [appendedChildren[2], appendedChildren[3]];
      const orderedAppendedChildren = redirect.concat(appendedChildren);
      delete orderedAppendedChildren[5];
      delete orderedAppendedChildren[6];

      const result = Object.assign(
        node,
        nodeWithOpeningElement,
        nodeWithClosingElement,
        { children: orderedAppendedChildren }
      )

      return result
    })
  },

  appendRoute(path, component) {
    return this.appendJSXElements(
      createFormattingElement(),
      createJSXElement('Route', {
        path,
        component: {
          expression: component,
        },
      })
    )
  },
})

const transInjuectMenuKey = (entry, options) => (content) => {
  const code = tsParse(entry, content);
  code.find(js.TSEnumDeclaration, {
    id: {
      type: "Identifier",
      name: "keyMap"
    }
  }).at(0).find(js.TSEnumMember).at(-1).insertAfter(`${options.key},`)
  return code.toSource()
}

const transInjuectMenuItem = (entry, options) => (content) => {
  const code = tsParse(entry, content);
  code.find(js.VariableDeclarator, {
    id: {
      type: "Identifier",
      name: "menu"
    }
  }).at(0).find(js.ObjectExpression).filter(path => {
    return path.get().parent.parent && path.get().parent.parent.value.id && path.get().parent.parent.value.id.name === 'menu';
  }).at(-1).insertAfter(`{
    title: '${options.title}',
    route: '${options.route}',
    icon: '${options.icon}'
  }`)
  return code.toSource()
}

const transInjectModel = (entry, options) => (content) => {
  const { modelName = 'model', modelPath = '', dvaModule = 'dva' } = options
  const code = tsParse(entry, content);

  code.addImport(modelPath, modelName)

  const dvaImportDeclaration = code.getImportIdentifier(dvaModule)
  const dvaCallDeclaration = code.getCallVariable(dvaImportDeclaration)

  const modelApplier = `${dvaCallDeclaration}.model(${modelName});`

  const existModelCall = code.findMemberCall(dvaCallDeclaration, 'model')
  if (existModelCall.size()) {
    existModelCall
      .at(-1)
      .insertAfter(modelApplier)

    return code.toSource()
  }

  const existUseCall = code.findMemberCall(dvaCallDeclaration, 'use')
  if (existUseCall.size()) {
    existUseCall
      .at(-1)
      .insertAfter(modelApplier)

    return code.toSource()
  }

  const existRouterCall = code.findMemberCall(dvaCallDeclaration, 'router')
  if (existRouterCall.size()) {
    existRouterCall
      .at(0)
      .insertBefore(modelApplier)

    return code.toSource()
  }

  const existDvaCall = code
    .findVariableCall(dvaImportDeclaration)
    .get()
    .parent

  if (existDvaCall.node.type === 'VariableDeclaration') {
    existDvaCall.insertAfter(modelApplier)
    return code.toSource()
  }

  return code.toSource()
}

const transInjectRoute = (entry, options) => (content) => {
  const { moduleName, modulePath, path, parentPath, component } = options
  const parentPaths = parentPath ? parentPath.split(',') : []
  const code = tsParse(entry, content);

  code.addImport(modulePath, moduleName)

  const routerElement = code.findJSXElements('Switch')
  const routeElement = routerElement.findRoute(parentPaths)
  const rootElement = routeElement.size() ? routeElement : routerElement.at(0)

  if (rootElement.size()) {
    rootElement.appendRoute(`/${path}`, component);
  }

  return code.toSource()
}

const injectModel = (entry, options) => rewrite(entry, [
  transInjectModel(entry, options),
])

const injectRoute = (entry, options) => rewrite(entry, [
  transInjectRoute(entry, options),
])

const pushKeyInMenu = (entry, options) => rewrite(entry, [
  transInjuectMenuKey(entry, options)
])

const pushMenuItemInRouter = (entry, options) => rewrite(entry, [
  transInjuectMenuItem(entry, options)
])

module.exports = {
  trans,
  rewrite,
  injectModel,
  injectRoute,
  pushKeyInMenu,
  pushMenuItemInRouter
}
