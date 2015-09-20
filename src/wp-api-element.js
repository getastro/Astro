function RootElement(domBlock) {
    // should expect element is the parent dom wrap with childnodes
    var root = domBlock;

    return {
        getSourceURL: function () {
            // root should expect
            if (root.dataset.wpSource.slice(-1) !== "/") {
                return root.dataset.wpSource + "/";
            } else {
                return root.dataset.wpSource;
            }
        },
        getChildElements: function () {
            return root.querySelectorAll("[data-wp-element]");
        },

        count: function () {
            return root.querySelectorAll("[data-wp-element]").length;
        },
        test: function () {
            return "test Root";
        }
    }
}

function WPElement(domEl) {
    var element, expectedType;
    expectedType = ["posts", "categories"];
    
    element = domEl;
    function getSearchCriteria (element) {
        var criteria, data, index;
        if (!element) {
            return;
        }
        criteria = {};
        data = element.dataset;
        console.log(data);
        index = data.wpElement.indexOf("/");

        if (index !== -1) {
            criteria.itemId = data.wpElement.slice(index + 1); 
            criteria.type = data.wpElement.slice(0, index);
        } else {
            criteria.type = data.wpElement;
        }

        if (data.wpOptions) {
            criteria.options = data.wpOptions;
        }
        
        if (expectedType.indexOf(criteria.type) === -1) {
            console.error("data-wp-element only support posts");
            return null;
        } 
        return criteria;
    }
    function processUrl (url) {
        if(url.slice(-1) !== "/") {
            return url + "/";
        } else {
            return url;
        }
        
    }
    return {
        requestUrl: function (sourceUrl) {
            var component = getSearchCriteria(element);
            if (component){
            var url = '';
            url += processUrl(sourceUrl);
            if (component.itemId) { 
                url += component.type + "/" + component.itemId + "/"; 
                if (component.options) {
                    url+= "?" + component.options;
                }
            } else {
                url += component.type + "/";
                if (component.options) {
                    url+= "?" + component.options;
                }
            }

            return url;

            } else {
                return null;
            }
        }
    }
}
var util = (function () {
    return {
        test: function () {
            return "test util";
        }
    } 
});
