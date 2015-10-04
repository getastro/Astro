Astro
=====

[![Join the chat at https://gitter.im/Ting-y/Astro](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Ting-y/Astro?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Astro is a JS library framework to render JSON content, regardless skill level.

**Hightlight:**
* Fetch 1 post from wordpress
* Fetch all posts in 1 category and use custom template
* Fetch post(s) from different WordPress blogs

###Getting Started
___
####Download
astro-wp-element.js can be download from [Here](https://github.com/Ting-y/Astro/releases)

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


####Data attributes

**Summary**

| Data Attribute      | Required |Description                            |
|---------------------|----------|---------------------------------------|
| data-wp-source      | Yes      | To identify the content source
| data-wp-element     | Yes      | Magic is is happening within this block |
| data-wp-template    | Yes      | The return field you want to display|
| data-wp-options     | When displaying collection     | RESTful API qury parameters            |
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
