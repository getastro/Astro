Astro
=====

[![Join the chat at https://gitter.im/Ting-y/Astro](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Ting-y/Astro?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Astro is a JS library framework to render JSON content, regardless skill level.

**Hightlight:**
* Fetch 1 post from wordpress
* Fetch all posts in 1 category and use custom template
* 


###Getting Started
___
####Download
Astro .js can be download from [Here](https://github.com/Ting-y/Astro/releases)

####Include it into your html

Include astro file inside body tag and before any Javascript execuetion block
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <title>Astro</title>
</head>
<body>

<script src="astro-wp-element.js"></script>
</body>
</html>
```

####Create a template to render json content

**Examples**

* [Display specific post](https://github.com/Ting-y/Astro/blob/master/examples/example1-display-single-post.html)
* [Display a list of post](https://github.com/Ting-y/Astro/blob/master/examples/example2-display-collections.html)


####Data attributes

**Summary**

| Data Attribute      | Required | Values                          | Description                     |
|---------------------|---------|---------------------------------|---------------------------------|
| data-wp-source      | Yes     | your wordpress url              | The wordpress blog              |
| data-wp-element     | Yes     | posts/#id                       | This will return the specific post |
| data-wp-template    | Yes     | title/content/featured_image    | The return field you want to display|
| data-wp-options     | ~Yes    | search=youNameIt&number=2       |  see [Query Parameter](https://developer.wordpress.com/docs/api/1.1/get/sites/%24site/posts/)   |
| data-wp-layout      | ~Yes    | list                            | This will render a list of post     |

[Data attributes usage detail & example](https://github.com/Ting-y/Astro/wiki/Data-attributes-usage-and-explanation)

###Support:

-  blog on wordpress.com
-  self hosted blog and enabled jetpack json-api plugin


###Todo:
- More Unit tests
- Implement get content from more than 1 source (standalone wordpress site using wp-api or json-api plugin)
- Accessibility

###Reference:
WordPress official Restful api endpoint
[Documentaion](https://developer.wordpress.com/docs/api/)

###Questions:question::
If you have any issues when using astro, please create a new issue or inbox :envelope: @ting-y



