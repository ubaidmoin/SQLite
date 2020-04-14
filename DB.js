import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'ReminderApp.db';
const database_version = '1.0';
const database_displayname = 'ReminderApp';
const database_size = 200000;

export default class DB {
  initDB() {
    let db;
    return new Promise((resolve) => {
      console.log("Plugin integrity check ...");
      SQLite.echoTest()
        .then(() => {
          // console.warn("Integrity check passed ...");
          // console.warn("Opening database ...");
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
          )
            .then(DB => {
              db = DB;
              console.log("Database OPEN");
              db.executeSql('SELECT * FROM Reminders LIMIT 1').then(() => {
                console.log("Database is ready ... executing query ...");              
              }).catch((error) => {
                console.log("Received error: ", error);
                console.log("Database not yet ready ... populating data");
                db.transaction((tx) => {
                  tx.executeSql('CREATE TABLE IF NOT EXISTS Reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, title, note, date, time, completed)');
                }).then(() => {
                  console.log("Table created successfully");
                }).catch(error => {
                  console.log(error);
                });
              });
              resolve(db);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log("echoTest failed - plugin not functional");
        });
    });
  }

  closeDatabase(db) {
    if (db) {
      db.close()
        .then(status => { })
        .catch(error => { });
    } else {
      // console.warn('Database was not OPENED');
    }
  }

  clearDB = () => {
    return new Promise(resolve => {
      this.initDB()
        .then(db => {
          db.transaction(async tx => {
            tx.executeSql('DROP TABLE IF EXISTS Reminders');

            resolve();
          })
            .then(result => {
              this.closeDatabase(db);
            })
            .catch(err => {
            });
        })
        .catch(err => {
        });
    });
  };

  getReminders() {
    return new Promise((resolve) => {
      var reminders = [];
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT id, title, note, date, time, completed FROM Reminders', []).then(([tx, results]) => {
            console.log("Query completed");
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`Reminder ID: ${row.id}, Reminder Name: ${row.title}`)
              const { id, title, note, date, time, completed } = row;
              reminders.push({
                id,
                title,
                note,
                date,
                time,
                completed
              });
            }
            console.log(reminders);            
            resolve(reminders);
            return reminders;
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  addReminder(prod) {
    console.warn(prod)    
    return new Promise((resolve) => {
      this.initDB().then((db) => {                
        db.transaction((tx) => {
          // console.warn('here')
          tx.executeSql('INSERT INTO Reminders ( title, note, date, time, completed) VALUES ("'+ prod.title+'","'+  prod.note+'","'+  prod.date+'","'+  prod.time+'","'+  prod.completed+'")').then(([tx, results]) => {
            resolve(results);
            // console.warn(results)
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  updateReminder(id, prod) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE Reminders SET completed = true WHERE id = ?', [prod.id]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  }
} //end of class
