/*
* MyTree - компонент, отображающий дерево
* Дерево содержится в структуре наподобие:
{
   id: 1,
   items: [
    {
      id: 2,
      items: [
        {
          id: 3
        }
      ]
    }
  ]
}
* 1) Один корневой элемент
* 2) Каждый элемент имеет атрибут id
* 3) Каждый элемент может иметь items - массив дочерних элементов
* Согласно "Custom Element Best Practices", объект получает дерево
* через установку свойства tree в рантайме
* Под капотом используется один корневой MyLeaf, которому передается вся структура дерева
*/

// function createChildNode(id, items) {
//     const node = document.createElement('my-leaf')
//     node.id = id
//     node.items = items
//     return node
// }
//
// export class MyTree extends HTMLElement {
//     constructor() {
//         super()
//         this.attachShadow({ mode: 'open' })
//         this._tree = {}
//     }
//     set tree(value) {
//         this._tree = value
//         this.render()
//     }
//     get tree() {
//         return this._tree
//     }
//     connectedCallback() {
//         this.render()
//     }
//     render() {
//         this.shadowRoot.innerHTML = `
//           <style>
//               :host {
//                 display: block;
//                 background-color: lightblue;
//                 color: #333;
//                 padding:32px;
//               }
//             </style>
//           `
//         const rootNode = createChildNode(this.tree.id, this.tree.items)
//         this.shadowRoot.appendChild(rootNode)
//     }
// }
//
// /*
//  * MyLeaf - компонент, отображающий поддерево
//  * Имеет свойство id - код
//  * Может иметь свойство items - массив дочерних элементов (структура - см. выше)
//  * Согласно "Custom Element Best Practices", свойства устанавливаются в рантайме
//  */
//
// export class MyLeaf extends HTMLElement {
//     constructor() {
//         super()
//         this.attachShadow({ mode: 'open' })
//     }
//     connectedCallback() {
//         this.render()
//     }
//     set id(value) {
//         this._id = value
//         this.render()
//     }
//     get id() {
//         return this._id
//     }
//     set items(value) {
//         this._items = value
//         this.render()
//     }
//     get items() {
//         return this._items
//     }
//     render() {
//         this.shadowRoot.innerHTML = `
//             <style>
//               :host {
//                 display: block;
//                 background-color: #888;
//                 color: #FFF;
//                 padding:4px;
//                 padding-left:24px;
//               }
//             </style>
//             <div>#${this.id}</div>
//           `
//         if (Array.isArray(this.items)) {
//             this.items.forEach(item => {
//                 const childNode = createChildNode(item.id, item.items)
//                 this.shadowRoot.appendChild(childNode)
//             })
//         }
//     }
// }
//
// export default function registerComponents() {
//     window.customElements.define('my-tree', MyTree)
//     window.customElements.define('my-leaf', MyLeaf)
// }
// import registerComponents from './my-tree.js'
//
// registerComponents()
//
// document.addEventListener('DOMContentLoaded', function(event) {
//   const treeData = {
//     id: 1,
//     items: [
//       {
//         id: 2,
//         items: [
//           {
//             id: 3,
//           },
//           {
//             id: 4,
//           },
//           {
//             id: 5,
//           }
//         ],
//       },
//       {
//         id: 6
//       }
//     ],
//   }
//   const myTree = document.getElementsByTagName('my-tree')[0]
//   if (myTree) {
//     myTree.tree = treeData
//   }
// })


const tree = {
    id : 1,
    items: [
        {
            id: 2,
            items: [
                {
                    id: 3,
                    items : [
                        {
                            id: 4,
                            items: [
                                {
                                    id: 5,
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 6
        }
    ]
}
let t = null;
console.log('hi')
function leaf(element) {
    for (const k of Object.keys(element)) {
        console.log(k, element[k]);
    }
    console.log('Я работаю');
    console.log(element);
    console.log(element.items)
    if (element.items){
        return f(element.items);
}
leaf(tree);
/*
 let array = [];
 function findAllLeaf(element) {
     for (const k of Object.keys(element)) {
         if (typeof element[k] !== 'object') {
             console.log(k);
             console.log(element[k]);
             if (element['items']) {
                 console.log(element['items']);
             }
             // TODO  вызывать myleaf, в тело объекта передавать element[k] и если есть element['items']
         }
         else {
             return findAllLeaf(element[k]);
         }
         // console.log(typeof element[k]);
     }
     if (typeof element === 'string') {
         console.log(element);
     }
     else if (typeof element === 'object') {
         return findAllLeaf(element);
     }
*/
}
// findAllLeaf(tree);
//
// function f(i) {
//     if (i < 10) {
//         setTimeout(() => {
//             console.log(i , new Date(Date.now()));
//             f(++i);
//         }, i*1000);
//
//     }
// }
//
// f(0);

// let t = 0;
// function summ(i) {
//      t += i;
//      if ( i > 1) {
//          return summ(--i);
//      }
//      if (i === 1) {
//          console.log(t);
//          console.log(t/60);
//          console.log(new Date(Date.now()))
//          return t;
//      }
// }
//
// summ(10);

// export class CustomTree extends HTMLElement{
//     constructor(){
//         super();
//     }
//     connectedCallback() {
//
//     }
// }
// export class CustomLeaf extends HTMLElement{
//     constructor(){
//         super();
//     }
//     connectedCallBack(){
//
//     }
//     disconnectedCallBack(){
//
//     }
//
// }
