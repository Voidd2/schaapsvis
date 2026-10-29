# Apple Wallet test chain

These files form a disposable, locally generated certificate chain used
only by `workers/members/test.mjs`. The names contain `TEST ONLY`, they are not
issued by Apple and Wallet will never accept passes signed with them.

Production certificates and private keys must only be stored as encrypted
Cloudflare secrets and must never be committed here.
