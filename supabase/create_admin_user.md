# Créer un utilisateur (accès à l'app)

Comme il n'y a plus d'inscription publique, crée les comptes manuellement
depuis le dashboard Supabase :

1. **Authentication → Users → Add user → Create new user**
2. Renseigne l'email et un mot de passe, décoche "Send confirmation email" si
   tu veux l'activer immédiatement (sinon l'utilisateur reçoit un email de
   confirmation).
3. Répète pour chaque personne devant accéder à l'outil.

Alternative en CLI (nécessite `SUPABASE_SERVICE_ROLE_KEY`, jamais exposée au
front) :

```bash
curl -X POST 'https://lwbctqrnhnfygyqzegkh.supabase.co/auth/v1/admin/users' \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"changeme123","email_confirm":true}'
```
