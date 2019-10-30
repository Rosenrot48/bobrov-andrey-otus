
    let pathArray = [];

    var uniqPath;
    function getPath(element) {
        var path = element.nodeName.toLowerCase();
        // console.log(element.attributes);
        for (let i = 0; i < element.classList.length; i++) {
            path = path + "." + element.classList[i]
        }
        pathArray.push(path);
        if (element.parentElement) {
            return getPath(element.parentElement)
        } else {
           return pathArray
            for (let c = pathArray.length - 1; c > 0; c--) {
                if (c === pathArray.length - 1) {
                    uniqPath = pathArray[c];
                } else {
                    uniqPath = uniqPath + ">" + pathArray[c];
                }
            }
            // console.log(uniqPath);
            path = null;
            pathArray = [];
            // return document.querySelectorAll(uniqPath);
            return uniqPath;
        }


    }
    document.querySelectorAll(getPath($0));











    let pathArray = [];

    var uniqPath;

    function getPath(element) {
        if (element.childElementCount > 1) {
            for (let t of element.childNodes) {
                if (t === element) {
                    console.log(t);
                    console.log('equals');
                    console.log(element)
                }
            }
        }
        if (element.parentElement) {
            console.log(element.parentElement);
            return getPath(element.parentElement);
        }
    }
