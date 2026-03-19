# Row Level Security (RLS) Policies

This document explains the Row Level Security configuration for the HTML Playground application.

## Overview

Row Level Security (RLS) is enabled on the `snippets` table to control access at the database level. This provides an additional security layer beyond application-level checks.

## Security Model

The HTML Playground uses a **public, anonymous sharing model**:
- No user authentication required
- Anyone can create snippets
- Anyone can view snippets
- Snippets are **immutable** (cannot be updated or deleted)

## Configured Policies

### 1. Allow Public Read Access

**Policy Name:** `Allow public read access`

**Operation:** SELECT

**Rule:** `USING (true)`

**Description:** Allows anyone to read all snippets from the database. This enables the core sharing functionality where users can access snippets via URL without authentication.

**SQL:**
```sql
CREATE POLICY "Allow public read access"
  ON snippets FOR SELECT
  USING (true);
```

### 2. Allow Public Insert Access

**Policy Name:** `Allow public insert access`

**Operation:** INSERT

**Rule:** `WITH CHECK (true)`

**Description:** Allows anyone to create new snippets. The `WITH CHECK (true)` clause means any row can be inserted (subject to table constraints like payload size and mode validation).

**SQL:**
```sql
CREATE POLICY "Allow public insert access"
  ON snippets FOR INSERT
  WITH CHECK (true);
```

### 3. No UPDATE Policy

**Description:** There is intentionally **no UPDATE policy** defined. This means no one can modify existing snippets, making them immutable once created.

**Rationale:** 
- Ensures snippet integrity
- Prevents malicious modification of shared snippets
- Simplifies the security model

### 4. No DELETE Policy

**Description:** There is intentionally **no DELETE policy** defined. This means no one can delete snippets through the application.

**Rationale:**
- Ensures shared URLs remain valid indefinitely
- Prevents accidental or malicious deletion
- Simplifies the security model

**Note:** Database administrators can still delete snippets directly if needed for moderation or cleanup.

## Security Considerations

### What RLS Protects Against

✅ Unauthorized updates to existing snippets
✅ Unauthorized deletion of snippets
✅ Ensures consistent access rules across all clients

### What RLS Does NOT Protect Against

❌ Spam or malicious snippet creation (rate limiting needed at application/API level)
❌ Large payload attacks (mitigated by payload_size_check constraint)
❌ Inappropriate content (content moderation needed at application level)

## Testing RLS Policies

### Test Read Access (Should Succeed)

```sql
-- As anonymous user
SELECT * FROM snippets LIMIT 10;
```

### Test Insert Access (Should Succeed)

```sql
-- As anonymous user
INSERT INTO snippets (html, css, javascript, mode)
VALUES ('<h1>Test</h1>', '', '', 'single');
```

### Test Update Access (Should Fail)

```sql
-- As anonymous user
UPDATE snippets 
SET html = '<h1>Modified</h1>' 
WHERE id = 'some-uuid';
-- Expected: ERROR: new row violates row-level security policy
```

### Test Delete Access (Should Fail)

```sql
-- As anonymous user
DELETE FROM snippets WHERE id = 'some-uuid';
-- Expected: ERROR: new row violates row-level security policy
```

## Modifying Policies

If you need to modify the RLS policies in the future:

1. **Disable a policy:**
   ```sql
   DROP POLICY "policy_name" ON snippets;
   ```

2. **Add a new policy:**
   ```sql
   CREATE POLICY "policy_name"
     ON snippets FOR operation
     USING (condition);
   ```

3. **Disable RLS entirely (not recommended):**
   ```sql
   ALTER TABLE snippets DISABLE ROW LEVEL SECURITY;
   ```

## Future Enhancements

Potential RLS policy enhancements for future versions:

- **User authentication:** Add policies based on user_id for private snippets
- **Soft delete:** Add a deleted_at column with policies to hide deleted snippets
- **Moderation:** Add admin role with UPDATE/DELETE permissions
- **Rate limiting:** Implement at application level, not RLS

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
