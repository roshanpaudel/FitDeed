const admin = require('firebase-admin');

const serviceAccount = require('./config/fitdeed-1f2e2-firebase-adminsdk-fbsvc-c776031ef7.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const data = require('./firestore-data.json'); // Make sure this path is correct

async function importData() {
  try {
    console.log('Firebase Admin SDK initialized successfully.');
    console.log('Starting data import...');

    // Importing workoutPlans
    if (data.workoutPlans && Array.isArray(data.workoutPlans)) {
        const workoutPlansCollection = db.collection('workoutPlans');
        for (const plan of data.workoutPlans) {
          await workoutPlansCollection.add(plan);
          console.log(`Added workout plan: ${plan.name}`);
        }
    } else {
        console.log('No workoutPlans array found in JSON data or data is not an array.');
    }


    // Importing dietPlans
    if (data.dietPlans && Array.isArray(data.dietPlans)) {
      const dietPlansCollection = db.collection('dietPlans');
      for (const plan of data.dietPlans) {
        await dietPlansCollection.add(plan);
        console.log(`Added diet plan: ${plan.name}`);
      }
    } else {
        console.log('No dietPlans array found in JSON data or data is not an array.');
    }


    // Importing categories
    if (data.categories && Array.isArray(data.categories)) {
        const categoriesCollection = db.collection('categories');
        for (const category of data.categories) {
          await categoriesCollection.add(category);
          console.log(`Added category: ${category.name}`);
        }
    } else {
        console.log('No categories array found in JSON data or data is not an array.');
    }


    console.log('Data import complete.');
  } catch (error) {
    console.error('Error during data import:', error);
  }
}

importData();
