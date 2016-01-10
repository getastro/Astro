Astro
=====

[![Join the chat at https://gitter.im/Ting-y/Astro](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Ting-y/Astro?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A JavaScript framework to render JSON content, regardless skill level.

Astro renders JSON in a simple way. Using only data attributes in the HTML markup, renders publicly available JSON content that does not require authentication from WordPress.com or WordPress.org websites using Jetpack's REST JSON API. See it in action: [Astro home page](http://ting-y.github.io/Astro).


**Hightlights:**
* Fetch from a single API source or from multiple API sources in the same document
* Fetch a single page, single post, or a latest post (category is optional)
* Fetch collections (category and number of posts are optional)
* Templating parameters (title, content, featured image, etcetera)

###Getting Started
___
####Download
Include astro-wp-element.js file [Here](https://github.com/Ting-y/Astro/releases) inside body tag; before any other Javascript execution block.

####Include it into your html

Include astro file inside body tag and before any Javascript execuetion block
```javascript
<!DOCTYPE html>
<body>

<script src="astro-wp-element.js"></script>
</body>
</html>
```

####Create a template to render json content

**Examples**

* [Display a specific post](https://github.com/Ting-y/Astro/blob/master/examples/example1-display-single-post.html)
* [Display a list of post](https://github.com/Ting-y/Astro/blob/master/examples/example2-display-collections.html)
* [Display the most recent post in the category](https://github.com/Ting-y/Astro/blob/master/examples/example3-display-most-recently-post.html)

####Data attributes

**Summary**

| Data Attribute      | Required |Description                            |
|---------------------|----------|---------------------------------------|
| data-wp-source      | Yes      | To identify the content source
| data-wp-element     | Yes      | Magic is is happening within this block |
| data-wp-template    | Yes      | The return field you want to display|
| data-wp-options     | When using query parameter     | RESTful API qury parameters            |
| data-wp-layout      | When displaying collection     | This is required if rendering multiple posts |

[Data attributes usage detail & example](https://github.com/Ting-y/Astro/wiki/Data-attributes-usage-and-explanation)

###Support:

-  blog on wordpress.com
-  self hosted(wordpress.org) with jetpack json-api plugin enable


###Todo:
- More Unit tests
- Support other REST API plugin (WP-API, Json API) 
- Accessibility

###Reference:
WordPress official RESTful API endpoint
[Documentaion](https://developer.wordpress.com/docs/api/)

###Questions:
If you have any questions about Astro, please [create a new issue](https://github.com/Ting-y/Astro/issues) or Email [Ting](mailto:ting.yatingyang@gmail.com)
