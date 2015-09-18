var wp_api = {
    //var buildURL, buildOptions, ajax, TemplateEngine, getQueryString;

    ajax: function (URL, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status==200) {
                callback(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", URL ,true);
        xmlhttp.send();
   },

    buildOptions: function (dataset) {
        var options;
        options = {};
        if (!dataset.apiCollection) {
            if ( !dataset.apiSingle) {
                // can not do anything without type
                return;
            }
        }
        if (dataset.apiCollection) {
            switch (dataset.apiCollection) {
                case "pages":
                    options.type = "collection";
                    options.name = "posts";
                    option.parameters.push({key: "type", value : "page"})
                    break;
                case "posts":
                    options.type = "collection";
                    options.name = "posts";
                    break;
                case "categories":
                    options.name = "categories";
                    options.type = "collection";
                    break;
                default:
                    break;
            }
        } else if (dataset.apiSingle) {
            var apiType =dataset.apiSingle.slice(0, 4)
            switch (apiType) {
                case "page":
                    options.type = "single";
                    options.name = "posts";
                    options.id = dataset.apiSingle.slice(5);
                    break;
                case "post":
                    options.type = "single";
                    options.name = "posts";
                    options.id = dataset.apiSingle.slice(5);
                    break;
            }
        }

        if (dataset.apiOptions) {
            options.parameters = [];
            options.parameters.push(dataset.apiOptions);
        }


        return options;
    },
    buildURL: function (baseURL, options) {
        var link = baseURL;
        if (options.type === "collection") {
            link += options.name + '/';
        } else if (options.type === "single" && options.id) {
            link += options.name + '/' + options.id + '/';
        } else if (options.type === "single" && options.id == null) {
            link += options.name + '/';
        }

        if (options.parameters) {
            link += "?" + options.parameters[0];
        }

        return link;
    }

// execute the funtcions


};

(function () {
// execute the funtcions
    // 1. search the dom if data source exist
    var dataNodes, allNodes, size, sourceUrl, parentNodes, apiNodes;
    allNodes = document.getElementsByTagName("*");
    parentNodes = [];
    size = allNodes.length;

    
    dataNodes = [];
    while (size--) {
        if (Object.keys(allNodes[size].dataset).length > 0) {
            dataNodes.push(allNodes[size]);
        }
    }

    // find source url and the node before the parent

    size = dataNodes.length;


    //{
    //  parentNodes: [
    //      {
    //          parentNode: {node(with datasources}
    //          childNodes: [
    //              node(with api-single/api-collection/)
    //          ]
    //      }
    //  ]
    //
    var index = 0;
    while (size--) {        
        if (dataNodes[size].hasAttribute("data-api-source")) {
            parentNodes.push({parentNode: dataNodes[size], childNodes: []});
        }     
    }

    
    // pick up the nessecery elements from dom tree 
    parentNodes.forEach(function (parentNode) {
        var length = parentNode.parentNode.children.length;
        while(length--) {
            if (parentNode.parentNode.children[length].dataset.apiSingle ||
                parentNode.parentNode.children[length].dataset.apiCollection) {
                parentNode.childNodes.push(parentNode.parentNode.children[length]);
            }
        }
    });
    

    parentNodes.forEach (function (node ) {
        // find parent, then get dataset and source
        var base_url = node.parentNode.dataset.apiSource;

        // for each children node under this api source
        node.childNodes.forEach(function(cNode) {
            // c node has the dataset to make the path
            var option = wp_api.buildOptions(cNode.dataset);
            // c node has children for template
            getJson(cNode,base_url, function(result) {

                if (cNode.children.length > 0 ) {
                    if (!result.posts) {
                        for (var i = 0; i < cNode.children.length; i++) {
                            var properties = Object.keys(cNode.children[i].dataset);
                            
                            if (cNode.children[i].tagName === "IMG") {
                                cNode.children[i].setAttribute("src",  result[properties[0].substring(4).toLowerCase()]);
                            } else {
                                cNode.children[i].innerHTML = result[properties[0].substring(4).toLowerCase()];
                            }
                        }
                    } else {
                        // how to render template * 5
                        //<div>
                        // 
                        // var collectionsize = result.found
                        // find cNode's template, 
//                        console.log(result.found);
//                        console.log(cNode.children);
//                        var domChild = [];
//                        for (var id = 0; id < cNode.children.length; id++) {
//                            var properties = Object.keys(cNode.children[id].dataset);
//                            domChild.push({tag: cNode.children[id].tagName.toLowerCase(), property: properties[0].substring(4).toLowerCase()});
//                        }
//
//                        console.log(domChild);
//                        var virturalTrees = [];
//                        for (var index = 0; index < result.found; index++) {
//                            var virtualTree = document.createElement(cNode.tagName.toLowerCase());
//                            virturalTrees.push(virtualTree);
//                        }
//                        console.log(virturalTrees);
                    }
                }
            }); 
        });
    });


    
    // then now classify the dataset and buildOption and url
    // then filling  the template, this may not need to templateEngine anymore
    // because the template is defined by the user 
    
    
 
    function getJson (node, sourceUrl, callback) {
        var queryOptions, requestURL;

        queryOptions = wp_api.buildOptions(node.dataset);
        requestURL = wp_api.buildURL(sourceUrl, queryOptions);

        wp_api.ajax(requestURL, function (data) {
            callback(JSON.parse(data));
        });
    }
    
}());
