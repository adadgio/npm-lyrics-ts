Event
======

Defining routes
------

Listen to events in *services* or *controllers*

```node
@Listen('test.event')
test(e: any)
{
    const event = e;
    this.doSomethingWithAge();
}
```

And trigger them from anywhere.

```node
@Route('/index', {type: 'GET'})
indexAction(request: Request)
{
    const name = 'Bilbo Baggins';
    
    // also emit event for other very important operations
    EventDispatcher.emit('test.event', {name: name});

    return this.renderHtml('<p>Hello {{name}}</p>', { name: name });
}
```
