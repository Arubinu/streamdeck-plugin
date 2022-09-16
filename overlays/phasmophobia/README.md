# Overlay Phasmophobia

Add one of the HTML pages to your liking in OBS Studio, then crop it according to its positioning (this is why the overlay has two sides).

## Configuration

The Websocket server password is to be entered in the `js/main.js` file at line 4.
<br>To change the names of the proofs, it is directly in the body of the document of the HTML files.

## Style of elements

You can easily change the style of different elements when they are on, off, and even neutral.
<br>The following parts of code are to be added to the `Custom CSS` parameter of your browser source.

### Evidence icon
```css
.evidences > div > img {
	filter: blur(1px) invert(.4);
}
.evidences > div.enabled > img {
	filter: none;
}
.evidences > div.disabled > img {
	filter: blur(1px);
}
```

### Evidence Name
```css
.evidences > div > div {
	color: #aaa;
}
.evidences > div.enabled > div {
	color: #fff;
	text-decoration: underline;
}
.evidences > div.disabled > div {
	color: #fff;
	text-decoration: line-through;
}
```

### Hide evidence name
```css
.evidences > div > div {
	visibility: hidden;
}
```
