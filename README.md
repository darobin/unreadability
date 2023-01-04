
# unreadability

Decorate an HTML file with readability scoring.

```
unreadability input.html output.html
unreadability --w3c input.html output.html
```

The usage above pretty much says it all. This will annotate an HTML doc with a readability index.
The W3C mode skips a number of well-known sections that don't need this applied; it also skips
paragraphs that are shorter than 50 characters.
