# Browser Extension Console Noise

While debugging the local dev server, the browser console was flooded with
errors that looked like the app was broken:

```
Uncaught SyntaxError: Identifier 'ZOTERO_CONFIG' has already been declared (at zotero_config.js:1:1)
Uncaught SyntaxError: Identifier 'MAX_BACKOFF' has already been declared (at http.js:1:1)
Uncaught SyntaxError: Identifier 'TranslateWeb' has already been declared (at translateWeb.js:1:1)
...
```

None of these files belong to the experiment. They are content scripts from
the Zotero Connector browser extension, which had been injected into the tab
twice (this can happen after the extension updates or the tab sits open across
dev-server reconnects). The errors occur in the extension's context and do not
affect the app.

How to tell the difference quickly: load `http://localhost:3000/` in a profile
with no extensions (incognito, or headless Chrome with `--dump-dom`). If the
app mounts and renders there, the console errors are extension noise. Fix by
hard-reloading the tab or disabling the extension on localhost.
