const DB_NAME = 'QuizDB';
const DB_VERSION = 1;
const STORE_NAME = 'quizAttempts';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("Error opening DB:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log("Successfully opened DB");
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('quizType', 'quizType', { unique: false });
      }
    };
  });
};

export const saveQuizAttempt = async (attemptData) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Add timestamp if not present
      const dataToSave = {
        ...attemptData,
        date: attemptData.date || new Date(),
      };

      const request = store.add(dataToSave);

      request.onsuccess = () => {
        console.log("Successfully saved quiz attempt");
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("Error saving quiz attempt:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in saveQuizAttempt:', error);
    throw error;
  }
};

export const getQuizAttempts = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in getQuizAttempts:', error);
    throw error;
  }
};

export const clearQuizHistory = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log("Successfully cleared quiz history");
        resolve();
      };

      request.onerror = () => {
        console.error("Error clearing quiz history:", request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error in clearQuizHistory:', error);
    throw error;
  }
};