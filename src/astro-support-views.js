// Astro single page app - views v0.2.0
// Copyright 2016 Ting Yang and Hector Jarquin
// Released under the MIT license
// Last updated: February 7th, 2016
// 
// Requirement: IE11+
// 
// Summary:
// Turn a data-api-endpoint node to a single page application
// once the item is clicked, it will render a single view 
//
(function (document, window) {
    // create custom event for page state
    var event_OnSinglePgaeView = new CustomEvent("Astro-OnSingleView");
    var event_OnRepeatView = new CustomEvent("Astro-OnRepeatView");
   
    window.ASTRO_QUERY_DATASET.view = "[data-app-view]"; // set the value
    window.ASTRO_QUERY_DATASET.container = "[data-app-landing]";
    window.ASTRO_DATASET_ATTRIBUTE.appView = "appView";
    
    var AstroLookUpTable = {};
    
    var store = {
        currentView: null
    }

    /**
     * BuildAstroLoopUpTable
     * @summary the object holds the hash table for the key-value pair of url and post json
     * @param {object} AstroAPI The AstroAPI element
     */
    function BuildAstroLoopUpTable(AstroAPI) {
    	var articleURL;
        AstroAPI.apiElements.forEach(function(host, index) {
            // build the hash table here!
            for (var i = 0; i < host.jsoncontent.length; i++) {
            	
                for (var j = 0; j < host.jsoncontent[i].length; j++) {
                	// if URL property existed or link
                	// depend on the json available property
                	articleURL = host.jsoncontent[i][j].URL || host.jsoncontent[i][j].link;
                    AstroLookUpTable[articleURL] = host.jsoncontent[i][j]; 
                }
            }
        });
    }

    /**
     * BluePrint
     * @summary This is the building plan for the views
     * @param {node} doc dom tree
     * @return {object} The object holds the avaliable views and relate elements
     */
    function BluePrint(doc) {
        var appViews = [];
        var viewsNode = doc.querySelectorAll(ASTRO_QUERY_DATASET.view);
        var mainListNodes = []; // the list wpelement nodes
        var views = []; // the views element node.
        for (var i = 0; i < viewsNode.length; i++) {
            if (viewsNode[i].dataset[window.ASTRO_DATASET_ATTRIBUTE.endpoint]) {
                mainListNodes.push(viewsNode[i]);
            } else {
                views.push(viewsNode[i]);
                var temp = {
                        name: viewsNode[i].dataset[window.ASTRO_DATASET_ATTRIBUTE.appView],
                        viewElement: viewsNode[i],
                        list: []
                    } 
                appViews.push(temp);
            }
        } 

        // return appView object 
        for (var j = 0; j < mainListNodes.length; j++) {
            appViews.forEach(function (view) {
                if (view.name === mainListNodes[j].dataset[window.ASTRO_DATASET_ATTRIBUTE.appView]) {
                    view.list.push(mainListNodes[j]);
                }
            });
        }  
        return appViews;
    }

    /**
     * InsertAnchor
     * @summary append the specified data-app-view value to the anchor
     *          href = ...html/#viewname#posturl
     *
     * @param {object} appViews the blue print object
     */
    function InsertAnchor (appViews) {
        for(var i = 0; i < appViews.length; i++) {
            for (var j = 0; j < appViews[i].list.length; j++) {
                var node = appViews[i].list[j];
                var a = node.querySelectorAll("[data-app-anchor]");
                for (var k = 0; k < a.length; k++) {
                    a[k].setAttribute('href', "#" + node.dataset[window.ASTRO_DATASET_ATTRIBUTE.appView] + "#" 
                                + a[k].getAttribute('href'));
                }
            }
        } 
    }

    /**
     * extractView
     *
     * @param {string} hash The current hash value from url
     * @return {node} The view node
     */
    function extractView (hash) {
        var lastHashindex = hash.lastIndexOf('#');
        var viewName = hash.substring(1, lastHashindex);
        var app_views = document.querySelectorAll("[data-app-view=" + viewName + "]");
        if (app_views.length > 0) {
            var lastView = app_views[app_views.length - 1];
            store.currentView = lastView;
            return lastView;
        }
    } 

    /**
     * Render
     * @summary this will be call after the navigation state change
     *          it will decide what to render base on the url
     * @param {object} bluePrint the blue print object
     */
    function Render(bluePrint) {
        // this will be call when started
        // then decide what to do 
        var mainView = document.querySelector(ASTRO_QUERY_DATASET.container);

        if (window.location.hash.length < 1) {
            if (store.currentView !== null) {
                store.currentView.style.display = "none"; 
            }
            RenderMain(mainView);
        } else {
            var el = extractView(window.location.hash);
            RenderView(el, mainView, bluePrint);
        }
    }
    
    /**
     * RenderView
     * @summary Render the template and hide the astro list veiw
     *          and it will dispatch an event after it render, it gives
     *          users has oppotunities to do something when the event triggered
     *
     * @param {node} viewEl The view need to be render
     * @param {node} mainView the node has astro-body attribute
     * @param {object} bluePrint the blue print object
     */
    function RenderView(viewEl, mainView, bluePrint) {
        viewEl.style.display = "block"; // show the view 
        mainView.style.display = "none"; // hide the content in astro-body
        window.scrollBy(100, -window.pageYOffset);
        
        // extract the post url from current URL
        var urlTemp = window.location.hash;
        var index = urlTemp.lastIndexOf('#');
        var viewName = urlTemp.substring(1, index);
        urlTemp = urlTemp.substring(index + 1);

        bluePrint.forEach(function (view) {
            if (view.name == viewName) {
                var templates = view.viewElement.querySelectorAll(ASTRO_QUERY_DATASET.property);
                var postJson = AstroLookUpTable[urlTemp];
                RenderSinglePost(postJson, templates);
            }
        });

        document.dispatchEvent(event_OnSinglePgaeView);
    }

    /**
     * RenderMain
     *
     * @param {node} mainView The node has astro-body
     */
    function RenderMain(mainView) {
        mainView.style.display = "block";
        document.dispatchEvent(event_OnRepeatView);
    }
    
    /**
     * RenderSinglePost
     *
     * @param {json object} json post json object
     * @param {nodelist} properties The nodes that contains [data-api-property]
     */
    function RenderSinglePost(json, properties) {
        var i, content;
            for ( i = 0; i < properties.length; i += 1) {
                content = AstroAPI.Util.ExtractJsonValueByKey(properties[i].dataset[ASTRO_DATASET_ATTRIBUTE.properties], json);
                if (properties[i].tagName === "IMG") {
                    properties[i].setAttribute("src",
                        content);
                } else if (properties[i].tagName === "A") {
                    properties[i].setAttribute("href",
                       content);
                } else {
                    properties[i].innerHTML = content;
                }
            }
    }

    document.addEventListener('AstroAPI-render', function (e) {
        if (!window.AstroAPI) {
            console.error("astro-wp-element.js is not found");
            return;
        }
     
        // execute the magic
        BuildAstroLoopUpTable(AstroAPI); 
        var bluePrint = BluePrint(document);
        InsertAnchor(bluePrint); 
        Render(bluePrint);
        // when the navigation changed 
        window.addEventListener('hashchange', function()  {
            Render(bluePrint);
        });
    });
}) (document, window);

