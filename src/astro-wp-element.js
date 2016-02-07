// Astro Framework - WordPress v0.3.0
// Copyright 2016 Ting Yang and Hector Jarquin
// Released under the MIT license
// Last updated: Feburary 7th, 2016 
//
// Support:
//  WordPress.com, the official RESTful api endpoint
//  WordPress.org (self hosted) with Jetpack json-api plugin and WP API
//  
//  

// custom event polyfill for IE9 - IE10
(function (document, window) {
    'use strict';
    function CustomEvent (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles,
                            params.cancelable, params.detail);
        return evt;
    }
    CustomEvent.prototype = window.CustomEvent.prototype;
    window.CustomEvent = CustomEvent;
})(document, window);

(function (document, window) {
    'use strict';

    
    /**
     * Define the "const" variables
     *
     */
    var event_FinishRequest = new CustomEvent("AstroAPI-render");

    // Astro defined attribute name
    var ASTRO_QUERY_DATASET = {
        host: "[data-api-host]",
        endpoint: "[data-api-endpoint]",
        property: "[data-api-property]"
    };

    var ASTRO_DATASET_ATTRIBUTE = {
        host: 'apiHost',
        endpoint: 'apiEndpoint',
        parameters: 'apiParameters',
        template: 'apiTemplate',
        singlePage: 'partialView' // will be use in other
    };
    
    var TEMPLATE_TYPE = /repeat|single/;
    
    var ERROR_MESSAGE = {
        template: "Not valid template type, the program will set the template to Single"
    };

    /**
     * The global value that will insert into window object
     *  {
     *      apiElements: [
     *              {
     *                  element: [] <- NodeList
     *                  url: string <- the blog url
     *                  jsoncontent: [] <- the posts
     *              }
     *      ]
     *  }
     *
     */

    var AstroAPI = {};
    /**
     * Util object contains helper functions 
     *
     */
    var Util = {
        /**
         * GetContentFromWordpress
         *
         * @param {string} url the api data endpoint
         * @param {function} callback return 2 params, err & json data
         */
        GetContentFromWordpress: function (url, callback) {
            var xmlhttp;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    // JSON.parse will crash when has unexpected response 'json'
                    callback(null, JSON.parse(xmlhttp.responseText));
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        },
        ExtractJsonValueByKey: function (param, json) {
            var p = param;
            var keys = p.split(".");
            
            for (var i = 0; i < keys.length; i+=1) {
                json = json[keys[i]];
                
            }

            return json;

        }
    };

    /**
     * getHosts
     *
     * @return {NodeList} return nodes that contains [data-api-host] attributes
     */
    function getHosts () {
        var apiHosts;
        apiHosts = document.querySelectorAll(ASTRO_QUERY_DATASET.host);
        return apiHosts || [];
    } 
    


    /**
     * getElements
     *
     * @param {nodeList} apiHosts All nodes that contains [data-api-host] attribute
     * @return {object} new custom object, see line 66
     */
    function getElements (apiHosts) {
        var apiElements = [];
        
        var i;
        for (i = 0; i < apiHosts.length; i+=1) {
            apiElements.push(
                {
                    'url': apiHosts[i].dataset[ASTRO_DATASET_ATTRIBUTE.host],
                    'domElements': apiHosts[i].querySelectorAll(ASTRO_QUERY_DATASET.endpoint),
                    'jsoncontent': []
                }        
            );
        }
        return apiElements;
    }
    
 


    // Element module
    /**
     * Element
     *
     * @param {string} url the blog URL from wordpress
     * @param {dom element} rawElement The dom element that has [data-api-endpoint] attribute
     * @return {{
     *      url The request url
     *      template What template going to build for this element
     *      childNode The child nodes
     *		endPoint The endpoint of the request
     *      elementNode The current element node
     *      properties The childNodes that contains [data-api-property] attribute
     * }} some public functions
     */
    function Element (url, rawElement) {
        
        var sourceURL = url;
                
        var dataset = rawElement.dataset; 
		
		function elementType () {
			var elementType;
			if (sourceURL.search(/public-api.wordpress.com/)) {
				elementType = "jetpack";
			} else {
				elementType = "wpapi";
			}
			return elementType;
		}
		
        function template  () {
            if (!dataset[ASTRO_DATASET_ATTRIBUTE.template]) {
                return 'single';
            }
            if (dataset[ASTRO_DATASET_ATTRIBUTE.template].search(TEMPLATE_TYPE) !== -1) {
                return dataset[ASTRO_DATASET_ATTRIBUTE.template];
            } 

            //if template is not defined, we assume it means render single item
        }


        function options() {
            var optionAttribute = dataset[ASTRO_DATASET_ATTRIBUTE.parameters] || null;
            return optionAttribute;
        }

        function endPoint() {
        	var type = dataset[ASTRO_DATASET_ATTRIBUTE.endpoint] || null;
            return type;
        }
        
        function requestURL () {
            var path = '';
            var opts = options();    
            // apend a / to URL
            if (sourceURL.slice(-1) !==  "/") {
                sourceURL= sourceURL + "/";
            }
            
            path += sourceURL + endPoint();
            
            if (opts !== null) {
                path += '?' + opts; 
            }
            return path;
        }
        

        function childnodes () {
            return rawElement.querySelector('*');
        }

        function parentNode () {
            return rawElement;
        }

        function properties () {
            return rawElement.querySelectorAll(ASTRO_QUERY_DATASET.property);
        }
        return {
            // public function
            url : requestURL,
            template: template,
            endPoint: endPoint,
            childnodes: childnodes,
            elementNode: parentNode,
            properties: properties,
            elementType: elementType
        };
    } 

    /**
     * getElementAmt
     * @summary This will return the # of ajax call is needed
     *          for aync in Fetch(), need to dispatch an event
     *          after all ajax call 
     *
     * @param {object} element AstroAPI
     */
    function getElementAmt(element) {
        var counter = 0;

        for (var i = 0; i < element.apiElements.length; i++) {
            counter += element.apiElements[i].domElements.length;
        }
        return counter;
    }
    /**
     * Init
     * @summary Gather the nessesery information from the nodes
     *          and build the object see line 61, the object will
     *          be use in Fetch() and Build()
     *
     *
     * 
     */
    function Init() {
        // find Hosts
        var hosts = getHosts();
        var elements = getElements(hosts);
        AstroAPI.apiElements = elements;
    }


    /**
     * Fetch
     * @summary A step after Init(), once it got called, it will
     *          loop throught AstroAPI.apiElements and do the ajax call
     *          for each api-element, then it will cache the json content to
     *          AstroAPI.apiElements.jsoncontent
     *
     * @param {function} callback Build the dom tree after retrive the json content from wordpress
     */
    function Fetch(callback) {
        // build element requirement 
        var elCounter = 0; // need to use for track when all ajax call are finished
        var i, e;
        var elAmt = getElementAmt(AstroAPI);
        AstroAPI.apiElements.forEach(function(apiElement) {
            for (i = 0; i < apiElement.domElements.length; i+=1) {
                e = Element(apiElement.url, apiElement.domElements[i]);
                // closure
                (function (e, apiElement) {
                    Util.GetContentFromWordpress(e.url(), function (err, data) {
                        // cache the content
                        if (err) {
                            callback(e, data);
                        }
                        if (Array.isArray(data)) {
                            apiElement.jsoncontent.push([data]);
                        }
                        if (!data.posts) {
                            apiElement.jsoncontent.push([data]);
                        } else {
                            apiElement.jsoncontent.push(data.posts);
                        }
                        // sorry for the messy code                       
                        // promises is not fully compatible in every browswer
                        // this nested code is ugly, but...
                        // this will be rewrite soon
                        // 
                        callback(e, data); // i know, this block of code smell
                        elCounter += 1;
                        if(elCounter === elAmt) {
                            document.dispatchEvent(event_FinishRequest); 
                        }
                    });
                })(e, apiElement);
            }
        });
    }

    /**
     * Build
     * @summary a callback for Fetch(), it will build the html if the
     *          api element template is list
     *
     * @param {object} element an instance of Element
     * @param {json} jsonContent content that receive from wordpress
     */
    function Build(element, jsonContent) {   
    	var items;
        if (element.template() === 'repeat') {
            // copy the nodes
            var nodes = element.childnodes();
            var i, virtual;
            var items = jsonContent[element.endPoint()] || jsonContent;
            
            console.log(jsonContent[element.endPoint()]);
            for (i = 1; i < items.length; i+= 1) {
                virtual = nodes.cloneNode(true);
                element.elementNode().appendChild(virtual);
            }
        } else {
        	items = jsonContent;
        }
        
        Render(element, items);
    }
    /**
     * Render
     * @summary Decision maker for render type base on the received json 
     *
     * @param {object} element instance of Element
     * @param {json object} json json object that received from WordPress
     */
    function Render(element, json) {
        var nodes, properties;
        var content;
        var renderType;
		
		nodes = element.elementNode(); 
    	properties = nodes.querySelectorAll(ASTRO_QUERY_DATASET.property);
    	
		if (element.template() === 'single') {
			if (element.elementType() === 'jetpack') {
				if (json.posts) {
					json = json[element.endPoint()][0];
				}
				RenderSinglePost(json, properties);
			}
		} else if (element.template() === 'repeat') {
			RenderList(element, json);
		}
    }

    /**
     * RenderList
     *
     * @param {object} element instance of Element
     * @param {json object} items json objects that received from wordpress
     */
    function RenderList(element, items) {
        var nodes, i, properties;
        // if the json with .posts is from .com
        // if the json type is array, its from .org
       
        for (i = 0; i < items.length; i+= 1) {
            // assign the coresponse html to the post json
            nodes = element.elementNode().children[i]; 
            properties = nodes.querySelectorAll(ASTRO_QUERY_DATASET.property);
            // this will insert the json to html inner html
            RenderSinglePost(items[i], properties);
        }
    }

    /**
     * RenderSinglePost
     *
     * @param {json object} json post json object
     * @param {nodelist} template The nodes that contains [data-api-property]
     */
    function RenderSinglePost(json, template) {
        var i, content;
            for ( i = 0; i < template.length; i += 1) {
                content = Util.ExtractJsonValueByKey(template[i].dataset.apiProperty, json);
                if (template[i].tagName === "IMG") {
                    template[i].setAttribute("src",
                        content);
                } else if (template[i].tagName === "A") {
                    template[i].setAttribute("href",
                       content);
                } else {
                    template[i].innerHTML = content;
                }
            }
    }


    /**
     * Start execute the magic
     *
     */
    Init();


    Fetch(function (element, jsonContent) {
        Build(element, jsonContent);
    });


    /*
     * Explosure the object to public
     *
     */
    // for other other usage
    AstroAPI.Util = Util;
    // put this to public
    window.AstroAPI = AstroAPI;
    window.ASTRO_QUERY_DATASET = ASTRO_QUERY_DATASET;
    window.ASTRO_DATASET_ATTRIBUTE = ASTRO_DATASET_ATTRIBUTE;


}(document, window));
