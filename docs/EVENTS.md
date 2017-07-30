Event
======

Defining routes
------

Listen to events in *services* (only).

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

    EventDispatcher.emit('test.event', {name: name});

    return this.renderHtml('<p>Hello {{name}}</p>', { name: name });
}
```

[&laquo; Controllers](./../CONTROLLERS.md)

[Routing &raquo;](./ROUTING.md)
