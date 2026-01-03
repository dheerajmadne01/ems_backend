# Firebase Environment Variables Setup (Backend)

## Backend मध्ये Firebase Configuration

Backend मध्ये Firebase Admin SDK साठी **कोणतीही file ठेवण्याची गरज नाही**. Environment variables वापरा.

### Step 1: Firebase Console मधून Service Account Key मिळवा

1. [Firebase Console](https://console.firebase.google.com/) मध्ये जा
2. तुमचा project select करा
3. **Project Settings** (⚙️ icon) → **Service Accounts** tab
4. **"Generate new private key"** button click करा
5. JSON file download होईल (example: `firebase-service-account-key.json`)

### Step 2: Environment Variable सेट करा

**Option 1: Service Account JSON (Recommended)**

`.env` file मध्ये add करा:

```env
# Firebase Service Account JSON (entire JSON content as string)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"ems-01-6cf82","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@ems-01-6cf82.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

**Important:** 
- JSON content एका line मध्ये असावी
- Single quotes वापरा
- Escape characters (`\n`) properly राखा

**Option 2: Individual Fields**

```env
FIREBASE_PROJECT_ID=ems-01-6cf82
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ems-01-6cf82.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### Step 3: Verify Setup

Backend start केल्यावर logs मध्ये दिसले पाहिजे:
```
✅ Firebase Admin SDK initialized
```

जर error आला तर:
- Environment variables properly set आहेत का तपासा
- JSON format correct आहे का तपासा
- Private key मध्ये `\n` properly escape आहेत का तपासा

### Security Notes

⚠️ **IMPORTANT:**
- JSON file कोणत्याही repository मध्ये commit करू नका
- `.env` file `.gitignore` मध्ये असावी
- Production मध्ये environment variables वापरा (not files)
- Service account key secret आहे - share करू नका

### Testing

1. Backend start करा
2. Logs check करा - "Firebase Admin SDK initialized" दिसले पाहिजे
3. Employee punch in करा
4. Admin ला notification मिळाले पाहिजे

