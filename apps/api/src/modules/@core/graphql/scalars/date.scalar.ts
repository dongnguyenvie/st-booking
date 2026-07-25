import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

/**
 * Custom Date scalar — accepts both Date objects and ISO 8601 strings.
 * Needed because Redis cache returns dates as ISO strings while DB returns Date objects.
 */
@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date scalar (ISO 8601 string ↔ Date object)';

  /** Serialize: convert Date or ISO string → ISO string for JSON response */
  serialize(value: unknown): string {
    if (value instanceof Date) {
      if (isNaN(value.getTime())) throw new Error(`Invalid Date: ${value}`);
      return value.toISOString();
    }
    if (typeof value === 'string') {
      const d = new Date(value);
      if (isNaN(d.getTime())) throw new Error(`Invalid date string: ${value}`);
      return d.toISOString();
    }
    if (value === null || value === undefined) return null as unknown as string;
    throw new Error(`Date scalar received unexpected type: ${typeof value}`);
  }

  /** Parse input value: ISO string from client variable → Date */
  parseValue(value: unknown): Date {
    if (typeof value === 'string') {
      const d = new Date(value);
      if (isNaN(d.getTime())) throw new Error(`Invalid date string: ${value}`);
      return d;
    }
    if (value instanceof Date) return value;
    throw new Error(`Date scalar expects string, received: ${typeof value}`);
  }

  /** Parse literal: inline GraphQL literal → Date */
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) return this.parseValue(ast.value);
    throw new Error(`Date scalar expects string literal, received: ${ast.kind}`);
  }
}
