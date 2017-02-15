Configuration
======

## Config

Configuration values are defined in `app/config/config.*.yml` where `*` stand for your environment (`dev|staging|prod`).

```yaml
framework:
    express:
        port: 8182

my_stuff:
    name: Romain
    age:  31
```

## Accessing config in controllers

```node
// app/AcmeBundle/controller/default-controller.ts
indexAction()
{
    // access full config or config value
    let conf = this.app.config.all();
    let item = this.app.config.get('my_stuff.age');
}

```

## Injecting config in services

Basic dependency injection (DI) is provider by the `@Inject` annotation.

```node
// app/AcmeBundle/service/test-service.ts
import { Service } from './../../../../lyrics/component';
import { Inject } from './../../../../lyrics/routing';

@Inject([
    { age: '%my_stuff.age%' }  // see config.*.yml
])
export class TestService extends Service
{
    /**
     * Required when extending base services
     * you need this for proper DI injection
     */
    constructor() {
        super();
    }

    public getAge() {
        let age = this.injected.age;

        return age;
    }
}
```

[&laquo; Home](./../README.md)

[Controllers &raquo;](./CONTROLLERS.md)
