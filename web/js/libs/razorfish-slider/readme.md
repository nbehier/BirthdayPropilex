### About

The slider creates functioning HTML markup.  It is up to you to stylize it.  Sample style/images are provided in the demo folder.

### Usage

```js
// create the slider
( new Razorfish.Slider( {
            width : 500
    , handleWidth : 12
    ,    useRange : true
    ,        tabs : [
          { text : 'Jan', date : new Date( '2012-01-01' ) }
        , { text : 'Feb', date : new Date( '2012-02-01' ) }
        , { text : 'Mar', date : new Date( '2012-03-01' ) }
        , { text : 'Apr', date : new Date( '2012-04-01' ) }
        , { text : 'May', date : new Date( '2012-05-01' ) }
        , { text : 'Jun', date : new Date( '2012-06-01' ) }
        , { text : 'Jul', date : new Date( '2012-07-01' ) }
        , { text : 'Aug', date : new Date( '2012-08-01' ) }
        , { text : 'Sep', date : new Date( '2012-09-01' ) }
        , { text : 'Oct', date : new Date( '2012-10-01' ) }
        , { text : 'Nov', date : new Date( '2012-11-01' ) }
        , { text : 'Dec', date : new Date( '2012-12-01' ) }
    ]
} ) )
    .prependTo( document.body )
    .bind     ( 'range', changeRange )
    .setRange ( 0, 11 );
```

### Demo

http://razorfish.github.com/JS-Range-Slider/