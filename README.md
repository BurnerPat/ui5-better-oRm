# ui5-better-oRm
Provides a wrapper around the UI5s RenderManager (aka "oRm", hence the name) in order to provide a more object-oriented approach to building custom views

## Usage Example

```javascript
sap.ui.core.Control.extend('demo.myControl', {
    /* [...] */
    render: function (oRm, oControl) {
        // Overwrite oRm, because BetterORM should have full control over it
        oRm = new BetterORM(oRm);

        // Create an element: <div class="myDiv" myAttribute="Hello World"></div>
        var div = oRm.create("div").addClass("myDiv").attr("myAttribute", "Hello World");

        // Use the div as target for writeControlData()
        div.setControlData(oControl);

        // Append a p to the div: <p>Some Text</p>
        var p = div.create("p").html("Some text");

        // Append a UI5 control to the div
        div.addControl(_myControl);

        // Write the contents to the original oRm
        oRm.flush();
    }
});
```

The above example corresponds to the following code snippet using the "classic" Render Manager:

```javascript
sap.ui.core.Control.extend('demo.myControl', {
    /* [...] */
    render: function (oRm, oControl) {
        oRm.write("<div ");
        oRm.writeControlData(oControl);
        oRm.write(" class='myDiv' myAttribute='Hello World'>");
        oRm.write("<p>Some text</p>");
        oRm.renderControl(_myControl);
        oRm.write("</div>");
    }
});
```
