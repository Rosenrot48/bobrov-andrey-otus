class myLeaf extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
    }
    set id(value) {
        this.ID = value;
    }
    get id(){
        return this.ID;
    }
    set item(values) {
        this.items = values;
        this.render();
    }
    get item(){
        return this.items;
    }




    render(){
        this.shadowRoot.innerHTML = `
            <style>
              :host {
                display: block;
                background-color: aquamarine;
                color: azure;
                padding:4px;
                padding-left:24px;
              }
            </style>
        <div>
        ${this.id}
        </div>
        `
        if (Array.isArray(this.items)) {
            this.items.forEach(item => {
                const childNode = createChild(item);
                this.shadowRoot.appendChild(childNode)
            })
        }
    }
}
class myTree extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    set tree(value) {
        if (this.hasAttribute('data')) {
            this._tree = JSON.parse(this.getAttribute('data'));
            this.render();
        }
    }

    get tree() {
        return this._tree;
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
              :host {
                display: block;
                background-color: lightblue;
                color: #333;
                padding:32px;
              }
        </style>
        `;
        const rootNode = createChild(this._tree);
        this.shadowRoot.appendChild(rootNode)
    }
}




function createChild(item) {
    const node = document.createElement('my-leaf');
    node.id = item.id;
    if (item.items) {
        node.items = item.items;
    }
    return node;
}

function registrationCustomElements() {
    window.customElements.define('my-leaf', myLeaf);
    window.customElements.define('my-tree', myTree);
}



registrationCustomElements();
<my-tree data={"id:1, items:[{id:2, items: [{id:3}],}]"}></my-tree>
