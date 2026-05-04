import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'tripcngo-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Firestore Security Rules', () => {
  it('allows verified admin to create article', async () => {
    const adminAuth = testEnv.authenticatedContext('admin1', { email_verified: true });
    await assertSucceeds(adminAuth.firestore().collection('articles').add({
      title: 'Valid Title',
      category: 'National Policy',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  });

  it('denies unverified users from creating articles', async () => {
    const unverifiedAuth = testEnv.authenticatedContext('user1', { email_verified: false });
    await assertFails(unverifiedAuth.firestore().collection('articles').add({
      title: 'Valid Title',
      category: 'National Policy',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  });

  it('allows anyone to increment views', async () => {
    const genericAuth = testEnv.unauthenticatedContext();
    // Assuming article exists... logic for update
    const db = genericAuth.firestore();
    const docRef = db.collection('articles').doc('existing_id');
    // Using fake increments to simulate the rule:
    await assertSucceeds(docRef.update({ views: 5 }));
  });

  it('denies anyone from modifying invalid fields like title during increment', async () => {
    const genericAuth = testEnv.unauthenticatedContext();
    const db = genericAuth.firestore();
    const docRef = db.collection('articles').doc('existing_id');
    // Try to sneak title update
    await assertFails(docRef.update({ views: 5, title: 'Hacked!' }));
  });

  it('allows anonymous users to create feedback if valid', async () => {
    const genericAuth = testEnv.unauthenticatedContext();
    const db = genericAuth.firestore();
    await assertSucceeds(db.collection('feedbacks').add({
      name: 'John',
      email: 'john@example.com',
      message: 'Great website',
      createdAt: new Date()
    }));
  });
});
