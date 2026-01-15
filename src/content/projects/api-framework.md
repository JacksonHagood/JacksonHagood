# Web API Framework

A lightweight, fast web API framework built from scratch.

![Framework Diagram](/images/api-framework.png)

## Overview

This project is a custom HTTP framework designed for building RESTful APIs with minimal overhead and maximum flexibility.

## Features

- **Routing**: Declarative route definitions with parameter extraction
- **Middleware**: Composable middleware pipeline
- **Validation**: Built-in request validation
- **Documentation**: Auto-generated OpenAPI specs
- **Performance**: Optimized for high-throughput scenarios

## Example

```typescript
import { Router, json, cors } from './framework';

const app = new Router();

app.use(json());
app.use(cors());

app.get('/users/:id', async (ctx) => {
  const user = await getUser(ctx.params.id);
  return ctx.json(user);
});

app.post('/users', async (ctx) => {
  const data = await ctx.body();
  const user = await createUser(data);
  return ctx.json(user, 201);
});

app.listen(3000);
```

## Architecture

The framework follows a modular architecture with clear separation of concerns:

- **Core**: Request/Response handling
- **Router**: URL matching and parameter extraction
- **Middleware**: Request/Response transformation
- **Validators**: Input validation and sanitization

---

*Building APIs the right way*
