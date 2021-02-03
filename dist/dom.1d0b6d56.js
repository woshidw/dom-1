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
})({"dom.js":[function(require,module,exports) {
window.dom = {
  //增
  create: function create(string) {
    var container = document.createElement("template"); //template是专门用来容纳所有元素的，不会显示到页面

    container.innerHTML = string.trim(); //trim()去掉空格。把字符串变成容器里的内容

    return container.content.firstChild; //用template元素不能通过children拿到
    //把一段html写到标签里，这段html自动变成了html元素
  },
  //新增弟弟
  //在node节点后新加node2。
  //没有insertAfter,只有insertBefore
  //找到node节点的爸爸，然后调用爸爸的insertBefore方法，把node2插到node下一个节点的前面。下一节点为空，依然可以插入进来。
  after: function after(node, node2) {
    console.log(node.nextSibling); //可以看下一节点是什么

    node.parentNode.insertBefore(node2, node.nextSibling);
  },
  //新增哥哥
  before: function before(node, node2) {
    node.parentNode.insertBefore(node2, node); //node支持的一个接口
  },
  //新增儿子
  append: function append(parent, node) {
    parent.appendChild(node); //直接用appendChild
  },
  //新增爸爸
  //在一个节点外面，加一个爸爸。
  wrap: function wrap(node, parent) {
    dom.before(node, parent);
    dom.append(parent, node);
  },
  //删
  remove: function remove(node) {
    //用跟古老的接口
    //用这个节点的爸爸从树中删除这个节点儿子。
    node.parentNode.removeChild(node);
    return node; //返回移除的对象。如let div =dom.remove(div)能拿到被移除的节点。还能保留节点的引用
  },
  //删除所有后代
  empty: function empty(node) {
    //干掉这个节点的所有儿子，不能出现在树里面。可以调用儿子一个个删
    //node.innerHTML = ''//可以删，但获取不到节点的引用
    var childNodes = node.childNodes; //const childNodes = code.childNodes。从node获取到它的childNodes

    var array = [];
    var x = node.firstChild;

    while (x) {
      //当x存在就把它移除并放到数组里
      array.push(dom.remove(node.firstChild)); //dom.remove移除会返回node节点，这直接push掉

      x = node.firstChild; //然后把x指向firstChild,上面已经移除了第一个节点，这里firstChild相当于第二个节点
    }

    return array;
  },
  //改
  // dom.attr(node, 'title',?)用于读写属性。
  //重载
  attr: function attr(node, name, value) {
    //根据参数个数写不同的代码
    if (arguments.length === 3) {
      //如果参数长度为3，就设置它的属性名和值。写操作
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      //如果参数长度为2，就相当于读，就返回。读操作
      return node.getAttribute(name);
    }
  },
  //dom.text(node,?)用于读写文本内容
  //适配
  text: function text(node, string) {
    //给节点，告诉新传的文本是什么
    if (arguments.length === 2) {
      if ("innerText" in node) {
        node.innerText = string; //IE
      } else {
        node.textContent = string; //Chrome，Firefox等等。
        //但两种方式浏览器都支持,如果想所以浏览器都支持可以用innerText
      }
    } else if (arguments.length === 1) {
      if ("innerText" in node) {
        return node.innerText;
      } else {
        return node.textContent;
      }
    }
  },
  //dom.html(node,?)用于读写HTML内容
  html: function html(node, string) {
    if (arguments.length === 2) {
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      return node.innerHTML;
    }
  },
  style: function style(node, name, value) {
    if (arguments.length === 3) {
      //如dom.style(div, 'color' , 'red')
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === "string") {
        //如dom.style(div, 'color')
        return node.style[name];
      } else if (name instanceof Object) {
        //dom.style(div,{color: 'red'})
        var object = name;

        for (var key in object) {
          //key: border /color 这个key是个变量，比如可能是border或者color
          //正常代码
          //node.style.border = ...
          //node.style.color = ...
          node.style[key] = object[key]; //不能用.key（这会变成一个字符串）。变量做key的话要用[]
        }
      }
    }
  },
  //dom.class.add(node, 'blue')用于添加class
  class: {
    //add接受一个节点，类名
    add: function add(node, className) {
      node.classList.add(className);
    },
    // dom.class.remove(node, 'blue')用于删除class
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    //要知道node节点元素有没有指定的className
    has: function has(node, className) {
      return node.classList.contains(className);
    }
  },
  //dom.on(node, 'click', fn)用于添加事件监听
  on: function on(node, eventName, fn) {
    //告诉节点，事件名，事件处理函数
    node.addEventListener(eventName, fn);
  },
  //移除这个监听
  off: function off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },
  //dom.find('选择器')用于获取标签或标签们
  find: function find(selector, scope) {
    //给我一个选择器，返回对应的元素
    return (scope || document).querySelectorAll(selector); //如果有范围scope，则在scope里调用querySelector,如果没有scope则在document里调用
  },
  //dom.parent(node)用于获取父元素
  parent: function parent(node) {
    return node.parentNode;
  },
  //dom.children(node)用于获取子元素
  children: function children(node) {
    return node.children;
  },
  //dom.siblings(node)用于获取兄弟姐妹元素
  siblings: function siblings(node) {
    //返回节点的兄弟姐妹(兄弟姐妹不能包括自己)
    //children是伪数组，要变成数组才可以用filter
    return Array.from(node.parentNode.children).filter(function (n) {
      return n !== node;
    }); //在伪数组编程数组后对它进行过滤，只要这个元素不等于当前这个节点就把它放到数组里
  },
  //dom.next(node)用于获取弟弟
  next: function next(node) {
    var x = node.nextSibling;

    while (x && x.nodeType === 3) {
      //看如果是文本，是就下一个。。，如果下一个节点不是就返回
      x = x.nextSibling;
    }

    return x;
  },
  //dom.previous(node)用于获取哥哥
  previous: function previous(node) {
    var x = node.previousSiblings;

    while (x && x.nodeType === 3) {
      //看如果是文本，是再往前。。，如果不是就返回
      x = x.previousSiblings;
    }

    return x;
  },
  each: function each(nodeList, fn) {
    //给我一个节点列表，函数
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  //dom.index(node)用于获取一个元素排行老几。
  index: function index(node) {
    var list = dom.children(node.parentNode); //用list获取到爸爸的儿子

    var i;

    for (i = 0; i < list.length; i++) {
      if (list[i] === node) {
        //每一个与它作对比，看list（i）是否等于node，如果等于就是第i+1个
        break;
      }
    }

    return i;
  }
};
},{}],"C:/Users/Administrator/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "2465" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Administrator/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","dom.js"], null)
//# sourceMappingURL=/dom.1d0b6d56.js.map