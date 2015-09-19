function Element(domBlock) {
    // should expect element is the parent dom wrap with childnodes
    var root = domBlock;
    console.log(root);
    console.log(root.dataset);
    return {
        getSourceURL: function () {
            // root should expect
            return root.dataset.apiSource
        },
        getChildElements: function () {
            return root.children;
        },
        getChildDataset: function () {
           return null;
        },
        test: function () {
            return "you sucks";
        }
    }
}
