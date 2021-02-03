//没封装之前就是document.createElement('div')
const div = dom.create("     <div>newDiv</div>");
console.log(div);

dom.after(test, div);//把创建的div插入到test元素后面

const div3 = dom.create('<div id="parent"></div>');
dom.wrap(test,div3);//给test新增一个爸爸div3

const nodes = dom.empty(window.empty)//找到html中empty元素，删掉，然后把它所有儿子都弄出来
console.log(nodes)//然后打印出所有儿子


dom.attr(test, 'title', 'Hi, I am dw')//参数长度为3，设置。写
const title = dom.attr(test, 'title')//参数长度为2,读。获取test元素的title属性，并赋给变量title。读
console.log(`title: ${title}`)//title值为title

dom.text(test, '你好，这是新的内容')
dom.text(test)


dom.style(test,{border: '1px solid red', color: 'blue'})//有一个test节点，里面有属性名，后面是属性值
console.log(dom.style(test, 'border'))//读。第二个参数可能是对象也可能是字符串。如果是对象就是设置，是字符串就是读
dom.style(test, 'border', '1px solid black')//也可以三个参数读

dom.class.add(test, 'red')//在test元素上添加一个类名red
dom.class.add(test, 'blue')//在test元素上添加一个类名blue
dom.class.remove(test, 'blue')//又删除了blue类
console.log(dom.class.has(test,'blue'))//检查test元素里有没有blue类名


const fn = ()=>{  
    console.log('点击了')
}
dom.on(test, 'click', fn)//

dom.off(test, 'click' , fn)//移除监听


const testDiv = dom.find('#test')[0]
console.log(testDiv)//没有范围

const test2 = dom.find('#test2')[0]
console.log(dom.find('.red', test2)[0])//两个参数，指定在找的范围是什么（默认是在document找）

console.log(dom.parent(test))

//console.log(dom.siblings(dom.find('#s2')[0]))//找到e2，再获取它的兄弟节点

const s2 = dom.find('#s2')[0]
console.log(dom.siblings(s2))
console.log(dom.next(s2))

const t = dom.find('#travel')[0]//find返回的是一个数组，找到第一个元素
dom.each(dom.children(t),(n)=>dom.style(n, 'color' ,'red'))
//遍历它的子元素，对子元素进行一个each操作，每一个用n站位，n的color为red

console.log(dom.index(s2))