-- Role granted to new self-signups. Only one role should carry this; the
-- invariant is enforced in RoleService.setDefault (Prisma cannot express a
-- partial unique index, and adding one by hand would show up as drift).
ALTER TABLE "roles" ADD COLUMN "is_default" BOOLEAN NOT NULL DEFAULT false;
