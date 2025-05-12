# Factory Pattern Safety Demo (Angular + TypeScript)

This quick project shows the difference between multiple patterns of creating objects from external (potentially bad) data in TypeScript. It was built as a practical example to explore why factory functions offer more safety than object literals.

If you're building a case for not using typed object literals in your application, this might help clearly demonstrate the specific issues. You can also tweak the data or add tests to prove a point or two.

I wanted a live example because I think it better shows what actually happens to your data under different scenarios.

Run it with the console open to see the errors..

<img width="1477" alt="Screenshot 2025-05-11 at 11 21 47 PM" src="https://github.com/user-attachments/assets/a3ceeb26-bbdc-4060-9f41-6005a7520aa3" />

The example uses a simple `Employee` model with these fields:
```typescript
export type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
};





