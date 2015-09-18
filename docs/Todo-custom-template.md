#Custom template

User can define the dom element template for the json date render

###Example

```html

<div data-api-single="page/4" >

    <!-- start define template here -->

    <div data-this-title></div>
    <img data-this-feature-image></div>
    <div data-this-content></div>

</div>
```

What it will be looks like after the library ran

```html
<div data-api-single="page/4">

    <!-- start define template here -->

    <div data-this-title>This is an post post</div>
    <img data-this-feature-image src="http://mywordpress.com/cat.png"></img>
    <div data-this-content>Code blocks can be taken a step further by adding syntax highlighting. In your fenced block, add an optional language identifier and we'll run it through syntax highlighting.</div>

</div>

```

###Rules

Each api element need to be wrapped by a dom element, ex, `<div>`, `<h1>` and etc.

Inside the element block, it must contains the placeholder for your fetching Response Parameters
and use attribute prefix `data-this-` + Response Parameters 
[Avaliable Response Parameters](https://developer.wordpress.com/docs/api/1.1/get/sites/%24site/posts/%24post_ID/)
