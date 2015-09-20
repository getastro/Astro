describe("Test Root Element", function() {
    var dom;
    beforeAll(function () {
        var singleElement='';
            singleElement += '<div id="root" data-wp-source="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">';
            singleElement += '    <div data-wp-element="post/10" >';
            singleElement += '        <h1 data-wp-template="title"></h1>';
            singleElement += '        <img data-wp-template="featured_image">';
            singleElement += '        <div data-wp-template="content"></div>';
            singleElement += '    </div>';
            singleElement += '</div>';
        
        dom = document.createElement('div');
        dom.innerHTML = singleElement;

    });
    it("should contain the apiSource", function() {
        var root, e;
            root = dom.querySelectorAll("[data-wp-source]");
            e = RootElement(root[0]);
            console.log(root[0]);
        expect(e.getSourceURL()).toBe("https://public-api.wordpress.com/rest/v1.1/sites/98941271/");
    });

    it("should contain 1 element", function () {
        var root, e;
            root = dom.querySelectorAll("[data-wp-source]");
        e = RootElement(root[0]);
        expect(e.count()).toBe(1);
    });
});

describe("Test WPElement", function () {
    var dom, root, child;
    beforeAll(function () {
        var singleElement='';
            singleElement += '<div id="root" data-wp-source="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">';
            singleElement += '    <div data-wp-element="posts/10" >';
            singleElement += '        <h1 data-wp-template="title"></h1>';
            singleElement += '        <img data-wp-template="featured_image">';
            singleElement += '        <div data-wp-template="content"></div>';
            singleElement += '    </div>';
            singleElement += '</div>';
        
        dom = document.createElement('div');
        dom.innerHTML = singleElement;
         
    }); 
    it("should able to create 1 WPElement", function () {
        var root, els;
            root = dom.querySelectorAll("[data-wp-source]");
        els = root[0].querySelectorAll("[data-wp-element]");
        expect(els.length).toBe(1);
    });

    it("should able to build the requestURL", function () {
        var root, els;
            root = dom.querySelectorAll("[data-wp-source]");
        els = root[0].querySelectorAll("[data-wp-element]");
        var wpEls = [];
        var rootEls = RootElement(root[0]);
        for (var i = 0; i < els.length; i++ ) {
            wpEls.push(WPElement(els[i])); 
        }
        expect(wpEls[0].requestUrl(rootEls.getSourceURL())).toContain("posts");
        console.log(wpEls[0].requestUrl(rootEls.getSourceURL()));
    });
});

describe("Test WPElement with wrong type", function () {
    var dom, root, child;
    beforeAll(function () {
        var singleElement='';
            singleElement += '<div id="root" data-wp-source="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">';
            singleElement += '    <div data-wp-element="exceptions/10" >';
            singleElement += '        <h1 data-wp-template="title"></h1>';
            singleElement += '        <img data-wp-template="featured_image">';
            singleElement += '        <div data-wp-template="content"></div>';
            singleElement += '    </div>';
            singleElement += '</div>';
        
        dom = document.createElement('div');
        dom.innerHTML = singleElement;
         
    }); 
    it ("should able to return null if the wp-element is not posts", function () {
        var root, els;
            root = dom.querySelectorAll("[data-wp-source]");
        els = root[0].querySelectorAll("[data-wp-element]");
        var wpEls = [];
        var rootEls = RootElement(root[0]);
        for (var i = 0; i < els.length; i++ ) {
            wpEls.push(WPElement(els[i])); 
        }
        expect(wpEls[0].requestUrl(rootEls.getSourceURL())).toBe(null);
        console.log(wpEls[0].requestUrl(rootEls.getSourceURL()));
    });
});


describe("Test WPElement with options", function () {
    var dom, root, child;
    beforeAll(function () {
        var singleElement='';
            singleElement += '<div id="root" data-wp-source="https://public-api.wordpress.com/rest/v1.1/sites/98941271/">';
            singleElement += '    <div data-wp-element="posts" data-wp-options="search=json&number=1&fields=title,content" >';
            singleElement += '        <h1 data-wp-template="title"></h1>';
            singleElement += '        <img data-wp-template="featured_image">';
            singleElement += '        <div data-wp-template="content"></div>';
            singleElement += '    </div>';
            singleElement += '</div>';
        
        dom = document.createElement('div');
        dom.innerHTML = singleElement;
         
    }); 
    it ("should able to return null if the wp-element is not posts", function () {
        var root, els;
            root = dom.querySelectorAll("[data-wp-source]");
        els = root[0].querySelectorAll("[data-wp-element]");
        var wpEls = [];
        var rootEls = RootElement(root[0]);
        for (var i = 0; i < els.length; i++ ) {
            wpEls.push(WPElement(els[i])); 
        }
        expect(wpEls[0].requestUrl(rootEls.getSourceURL())).toContain("fields");
        console.log(wpEls[0].requestUrl(rootEls.getSourceURL()));
    });
});
