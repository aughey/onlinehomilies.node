const csv = require('csvtojson');
var MongoClient = require('mongodb').MongoClient
var Q = require('q');
var tables = "sessions groups recordings".split(' ');

Q.nfcall(MongoClient.connect, "mongodb://localhost/onlinehomilies").then((db) => {
    Q.all(tables.map((t) => {
        var collection = db.collection(t);
        return collection.remove({}).then(() => {
            var promises = [];
            var deferred = Q.defer();
            csv().fromFile('private/' + t + '.csv')
                .on('json', (jsonObj) => {
                    if (jsonObj.date) {
                        jsonObj.date = new Date(jsonObj.date);
                    }
                    if (jsonObj.id) {
                        jsonObj.sqlite_id = jsonObj.id
                        delete jsonObj.id
                    }
                    Object.keys(jsonObj).forEach((key) => {
                        if (key.endsWith("id") && !key.startsWith('youtube')) {
                            jsonObj[key] = parseInt(jsonObj[key]);
                        }
                    });
                    promises.push(collection.insert(jsonObj));
                    //        console.log(jsonObj);
                    // combine csv header row and csv line to a json object 
                    //     // jsonObj.a ==> 1 or 4 
                })
                .on('done', (error) => {
                    Q.all(promises).then(() => {
                        deferred.resolve();
                        console.log(t + ' end')
                    });
                })
            return deferred.promise;
        });
    })).then(() => {
        var deferred = Q.defer();
        var sessions = db.collection('sessions');
        var recordings = db.collection('recordings');
        var promises = []
        sessions.find({}).forEach(s => {
            var p = recordings.find({
                session_id: s.sqlite_id
            }).toArray().then(recordings => {
                s.recordings = recordings;
		recordings.forEach((r) => {
		  if(r.youtube_id) {
		    r.youtube_url = 'http://www.youtube.com/embed/' + r.youtube_id;
		  }
		});
                return sessions.update({_id: s._id},s);
            }).then(() => {
                console.log("Updated session id " + s._id);
            });
            promises.push(p);
        }, () => {
            console.log('done');
            Q.all(promises).then(() => {
                deferred.resolve(true);
            });
        });
        return deferred.promise;

    }).then(() => {
        console.log("Closing database");
        db.close();
    });
});
