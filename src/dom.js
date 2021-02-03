window.dom = {
  //增
  create(string) {
    const container = document.createElement("template"); //template是专门用来容纳所有元素的，不会显示到页面
    container.innerHTML = string.trim(); //trim()去掉空格。把字符串变成容器里的内容
    return container.content.firstChild; //用template元素不能通过children拿到
    //把一段html写到标签里，这段html自动变成了html元素
  },

  //新增弟弟
  //在node节点后新加node2。
  //没有insertAfter,只有insertBefore
  //找到node节点的爸爸，然后调用爸爸的insertBefore方法，把node2插到node下一个节点的前面。下一节点为空，依然可以插入进来。
  after(node, node2) {
    console.log(node.nextSibling); //可以看下一节点是什么
    node.parentNode.insertBefore(node2, node.nextSibling);
  },

  //新增哥哥
  before(node, node2) {
    node.parentNode.insertBefore(node2, node); //node支持的一个接口
  },

  //新增儿子
  append(parent, node) {
    parent.appendChild(node); //直接用appendChild
  },

  //新增爸爸
  //在一个节点外面，加一个爸爸。
  wrap(node, parent) {
    dom.before(node, parent);
    dom.append(parent, node);
  },

  //删

  remove(node) {
    //用跟古老的接口
    //用这个节点的爸爸从树中删除这个节点儿子。
    node.parentNode.removeChild(node);
    return node; //返回移除的对象。如let div =dom.remove(div)能拿到被移除的节点。还能保留节点的引用
  },

  //删除所有后代
  empty(node) {
    //干掉这个节点的所有儿子，不能出现在树里面。可以调用儿子一个个删
    //node.innerHTML = ''//可以删，但获取不到节点的引用
    const { childNodes } = node; //const childNodes = code.childNodes。从node获取到它的childNodes
    const array = [];
    let x = node.firstChild;
    while (x) {
      //当x存在就把它移除并放到数组里
      array.push(dom.remove(node.firstChild)); //dom.remove移除会返回node节点，这直接push掉
      x = node.firstChild;
      //然后把x指向firstChild,上面已经移除了第一个节点，这里firstChild相当于第二个节点
    }
    return array;
  },

  //改
  // dom.attr(node, 'title',?)用于读写属性。
  //重载
  attr(node, name, value) {
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
  text(node, string) {
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
  html(node, string) {
    if (arguments.length === 2) {
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      return node.innerHTML;
    }
  },

  style(node, name, value) {
    if (arguments.length === 3) {
      //如dom.style(div, 'color' , 'red')
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === "string") {
        //如dom.style(div, 'color')
        return node.style[name];
      } else if (name instanceof Object) {
        //dom.style(div,{color: 'red'})
        const object = name;
        for (let key in object) {
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
    add(node, className) {
      node.classList.add(className);
    },

    // dom.class.remove(node, 'blue')用于删除class
    remove(node, className) {
      node.classList.remove(className);
    },

    //要知道node节点元素有没有指定的className
    has(node, className) {
      return node.classList.contains(className);
    },
  },

  //dom.on(node, 'click', fn)用于添加事件监听
  on(node, eventName, fn) {
    //告诉节点，事件名，事件处理函数
    node.addEventListener(eventName, fn);
  },

  //移除这个监听
  off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },

  //dom.find('选择器')用于获取标签或标签们
  find(selector, scope) {
    //给我一个选择器，返回对应的元素
    return (scope || document).querySelectorAll(selector);
    //如果有范围scope，则在scope里调用querySelector,如果没有scope则在document里调用
  },

  //dom.parent(node)用于获取父元素
  parent(node) {
    return node.parentNode;
  },

  //dom.children(node)用于获取子元素
  children(node) {
    return node.children;
  },

  //dom.siblings(node)用于获取兄弟姐妹元素
  siblings(node) {
    //返回节点的兄弟姐妹(兄弟姐妹不能包括自己)
    //children是伪数组，要变成数组才可以用filter
    return Array.from(node.parentNode.children).filter((n) => n !== node); //在伪数组编程数组后对它进行过滤，只要这个元素不等于当前这个节点就把它放到数组里
  },

  //dom.next(node)用于获取弟弟
  next(node) {
    let x = node.nextSibling;
    while (x && x.nodeType === 3) {
      //看如果是文本，是就下一个。。，如果下一个节点不是就返回
      x = x.nextSibling;
    }
    return x;
  },

  //dom.previous(node)用于获取哥哥
  previous(node) {
    let x = node.previousSiblings;
    while (x && x.nodeType === 3) {
      //看如果是文本，是再往前。。，如果不是就返回
      x = x.previousSiblings;
    }
    return x;
  },

  each(nodeList, fn) {
    //给我一个节点列表，函数
    for (let i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },

  //dom.index(node)用于获取一个元素排行老几。
  index(node){
    const list = dom.children(node.parentNode)//用list获取到爸爸的儿子
    let i
    for(i=0;i<list.length;i++){ 
      if(list[i] === node){//每一个与它作对比，看list（i）是否等于node，如果等于就是第i+1个
        break
      }
    }
    return i
  }
};
