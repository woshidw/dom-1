// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"fRxd":[function(require,module,exports) {
window.dom = {
  //增
  create: function create(string) {
    var container = document.createElement("template"); //template可以存放任意标签

    container.innerHTML = string.trim(); //trim去掉字符串两边空格

    return container.content.firstChild;
  },
  //用于创建节点；
  after: function after(node, node2) {
    node.parentNode.insertBefore(node2, node.nextSibling); //想把node2放到node前面，找到这个节点的爸爸，并调用爸爸节点的insertBefore方法，然后把node2插到node的下一个节点的前面
    //如果这个节点是最后一个节点，就没有下一个节点
  },
  //新增弟弟
  before: function before(node, node2) {
    node.parentNode.insertBefore(node2, node);
  },
  //新增哥哥
  append: function append(parent, node) {
    parent.appendChild(node);
  },
  //新增儿子
  wrap: function wrap(node, parent) {
    dom.before(node, parent); //先把新的节点放到node节点前面

    dom.append(parent, node); //然后把原来的放到新加的里面
  },
  //新增爸爸
  //删
  remove: function remove(node) {
    node.parentNode.removeChild(node);
    return node;
  },
  //删除节点，节点及后代元素都不存在
  empty: function empty(node) {
    var array = [];
    var x = node.firstChild;

    while (x) {
      array.push(dom.remove(node.firstChild));
      x = node.firstChild;
    }

    return array;
  },
  //清空该节点里的元素
  //改
  attr: function attr(node, name, value) {
    // 重载
    if (arguments.length === 3) {
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      return node.getAttribute(name);
    }
  },
  //用于读写属性
  text: function text(node, string) {
    // 适配
    if (arguments.length === 2) {
      if ("innerText" in node) {
        node.innerText = string;
      } else {
        node.textContent = string;
      }
    } else if (arguments.length === 1) {
      if ("innerText" in node) {
        return node.innerText;
      } else {
        return node.textContent;
      }
    }
  },
  //用于读写文本内容
  html: function html(node, string) {
    if (arguments.length === 2) {
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      return node.innerHTML;
    }
  },
  //用于读写HTML内容
  style: function style(node, name, value) {
    if (arguments.length === 3) {
      // dom.style(div, 'color', 'red')
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === 'string') {
        // dom.style(div, 'color')
        return node.style[name];
      } else if (name instanceof Object) {
        // dom.style(div, {color: 'red'})
        var object = name;

        for (var key in object) {
          //key可能为border、color  node.style.style.border/color
          //可能是对象或者字符串，是对象就设置它的值，是字符串就获取它的值
          node.style[key] = object[key];
        }
      }
    }
  },
  //用于修改style
  class: {
    add: function add(node, className) {
      node.classList.add(className);
    },
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    has: function has(node, className) {
      return node.classList.contains(className);
    }
  },
  //用于添加、删除,获取class
  on: function on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  off: function off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },
  //用于添加、删除事件监听
  //查
  find: function find(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  },
  //用于获取标签
  parent: function parent(node) {
    return node.parentNode;
  },
  //用于获取父元素
  children: function children(node) {
    return node.children;
  },
  //用于获取子元素
  siblings: function siblings(node) {
    return Array.from(node.parentNode.children).filter(function (n) {
      return n !== node;
    });
  },
  //用于获取兄弟姐妹元素
  next: function next(node) {
    var x = node.nextSibling;

    while (x && x.nodeType === 3) {
      x = x.nextSibling;
    }

    return x;
  },
  //用于获取‘弟弟’
  previous: function previous(node) {
    var x = node.previousSibling;

    while (x && x.nodeType === 3) {
      x = x.previousSibling;
    }

    return x;
  },
  //用于获取‘哥哥’
  each: function each(nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  //用于遍历所有节点
  index: function index(node) {
    var list = dom.children(node.parentNode);
    var i;

    for (i = 0; i < list.length; i++) {
      if (list[i] === node) {
        break;
      }
    }

    return i;
  } //用于获取排行老几

};
},{}]},{},["fRxd"], null)
//# sourceMappingURL=dom.8eeff33b.js.map