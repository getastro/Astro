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

    getQueryString: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

    },
    TemplateEngine: function(html, options) {
        var re = /<%(.+?)%>/g, 
    		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, 
    		code = 'with(obj) { var r=[];\n', 
    		cursor = 0, 
    		result;
    	var add = function(line, js) {
    		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
    			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
    		return add;
    	}
    	while(match = re.exec(html)) {
    		add(html.slice(cursor, match.index))(match[1], true);
    		cursor = match.index + match[0].length;
    	}
    	add(html.substr(cursor, html.length - cursor));
    	code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, '');
    	try { result = new Function('obj', code).apply(options, [options]); }
    	catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
    	return result;
    },


    buildOptions: function (dataset) {
        var options;
        options = {};
        options.parameters = [];
        if (!dataset.apiCollection) {
            if ( !dataset.apiSingle) {
                // can not do anything without type 
                return;
            }
        }

        options.parameters.push(dataset.apiOptions);
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
            }
        }
        return options;
    }, 
    buildURL: function (baseURL, options) {
        var link = baseURL;
        console.log(options); 
        if (options.type === "collection") {
            link += options.name + '/';
        } else if (options.type === "single") {
            link += options.name + '/' + options.id + '/';
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
    console.log(dataNodes);


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
            parentNodes.push({parentNode: dataNodes[size], childrenNodes: []});
        }     
    }

    console.log(parentNodes);
    
    // pick up the nessecery elements from dom tree 
    parentNodes.forEach(function (parentNode) {
        size = parentNode.parentNode.children.length;
        while(size--) {
            console.log(parentNode.parentNode.children[size].dataset);
            if (parentNode.parentNode.children[size].dataset.apiSingle ||
                parentNode.parentNode.children[size].dataset.apiCollection) {
                parentNode.childrenNodes.push(parentNode.parentNode.children[size]);
            }
        }
    });
    
   // then now classifly the dataset and buildOption and url
   // then fillin the tmeplate, this may not need to tempalteEngine anymore
   // because the template is defined by the user 

    function getJson (node, callback) {
        var queryOptions, requestURL;

        queryOptions = wp_api.buildOptions(node.dataset);
        requestURL = wp_api.buildURL(sourceUrl, queryOptions);

        wp_api.ajax(requestURL, function (data) {
            callback(data);
        });
    }
    
}());
