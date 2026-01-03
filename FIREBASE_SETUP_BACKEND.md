# Firebase Setup for Backend (Node.js/Fastify)

## Backend मध्ये Firebase Configuration

Backend मध्ये Firebase Admin SDK साठी configuration file आवश्यक नाही. Environment variables वापरा.

### Option 1: Service Account JSON (Recommended)

1. Firebase Console → Project Settings → Service Accounts
2. "Generate new private key" क्लिक करा
3. JSON file download होईल (example: `firebase-service-account.json`)

**Important:** JSON file backend repository मध्ये ठेवू नका (security risk). ऐवजी:

**Environment Variable मध्ये सेट करा:**

```bash
# .env file मध्ये (सर्व JSON content एका line मध्ये)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

किंवा

**Individual Fields:**

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Option 2: JSON File (Development Only - Not Recommended for Production)

जर तुम्हाला development साठी JSON file वापरायची असेल:

1. Create folder: `ems_backend/config/` (optional, or root)
2. Download `firebase-service-account.json` from Firebase Console
3. Add to `.gitignore`:
   ```
   config/firebase-service-account.json
   *.json
   !package.json
   !package-lock.json
   !tsconfig.json
   ```
4. Update code to read from file (NOT IMPLEMENTED - use env vars instead)

### Current Implementation

Backend code already supports environment variables. No file needed!

Check: `src/services/notification.service.ts` - lines 32-52

### Security Notes

⚠️ **IMPORTANT:**
- JSON file कोणत्याही repository मध्ये commit करू नका
- Production मध्ये environment variables वापरा
- `.env` file `.gitignore` मध्ये असावी


