
    let pathArray = [];

    var uniqPath;
    function getPath(element) {
        var path = element.nodeName.toLowerCase();
        for (let i = 0; i < element.classList.length; i++) {
            path = path + "." + element.classList[i]
        }
        pathArray.push(path);
        if (element.parentElement) {
            return getPath(element.parentElement)
        } else {
            // return pathArray
            for (let c = pathArray.length - 1; c > 0; c--) {
                if (c === pathArray.length - 1) {
                    uniqPath = pathArray[c];
                } else {
                    uniqPath = uniqPath + ">" + pathArray[c];
                }
            }
            // console.log(uniqPath);
            return uniqPath;
        }
    }
    document.querySelectorAll(uniqPath);
//
