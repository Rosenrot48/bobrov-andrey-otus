    function getPath(element) {
    let pathArray = [];

    function getNth(element) {
        console.log(`${element.nodeName}:nth-child(${Array.from(element.parentNode.children).indexOf(element)+1})`);
        return  `${element.nodeName}:nth-child(${Array.from(element.parentNode.children).indexOf(element)+1})`;
    }
    function getId(element) {
        if (element.id){
            return `#${element.id}`
        }
        pathArray.push(getNth(element));
        return getId(element.parentElement);
    }
    let uniqPath = getId(element);
    while(pathArray.length > 0) {
        uniqPath += `>${pathArray.pop()}`
    }
    return uniqPath;
    }
    document.querySelectorAll(getPath($0));
