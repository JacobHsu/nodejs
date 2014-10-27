//First create a job Queue
var kue = require('kue')
  , jobs = kue.createQueue()
  ;

function newJob (name){

  name = name || 'Default_Name';
  var job = jobs.create('video conversion', {
        title:  name + '\'s to avi', user: 1, frames: 200
  });


  job
    .on('complete', function (){
      console.log('Job', job.id, 'converting', job.data.title, job.data.user, 'is done');
    })
    .on('failed', function (){
      console.log('Job', job.id, 'converting', job.data.title, job.data.user,'has failed');
    })

  job.save(function(err){
   if( !err ) console.log( job.id );
  });
  
}

jobs.process('video conversion', function (job, done){

  done && done();
});



function create() {
    var name = ['tobi', 'loki', 'jane', 'manny'][Math.random() * 4 | 0];
    console.log('- creating job for %s', name);  
    newJob(name);
}

setInterval(create, 3000);

/*
setInterval(function (){
    var name = ['tobi', 'loki', 'jane', 'manny'][Math.random() * 4 | 0];
    console.log('- creating job for %s', name);  
    newJob(name);
}, 3000);
*/


