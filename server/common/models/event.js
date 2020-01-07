'use strict'
var log = require('debug')('db:event')
var request = require('request')

var app = require("../../server/server")

var JFWEB_URL_updateEvent = app.get('web_system_api') + '/event/update'

module.exports = function(Event) {

  //Event status:
  //0: not started
  //1: on going
  //2: stopped
  
  // Event.on('attached', function(obj){
  //   var find = Event.find;
  //   Event.find = function(filter, cb) {
  //     var filter = filter || {}
  //     if(!filter.order){
  //       filter.order = 'id DESC'
  //     }
  //     arguments[0] = filter
  //     return find.apply(this, arguments);
  //   };
  // });

  Event.beforeRemote('upsert', function(context, user, next) {

    var data = context.args.data
    if (data && data.id) {
      Event.findOne({
        where: {
          id: data.id
        }
      }, function(err, data_db) {
        // console.log(data_db)
        if(data_db.status != 1 && data.status == 1){
          data.endDate = null
          //start the event
          data.startDate = new Date()
        }else if(data_db.status == 1 && data.status == 2){
          //stop the event
          data.endDate = new Date()
        }
         data.modified = Date.now()
        next()
      })
    }else{
      data.created = Date.now()
      if(data.status == 1){
        data.startDate = new Date()
      }
      next()
    }
  })

  Event.afterRemote('upsert', function(context, user, next) {
    updateJfweb()
    next()
  })

  Event.afterRemote('delete', function(context, user, next) {
    updateJfweb()
    next()
  })

  function updateJfweb(){
    request.get({
      url: JFWEB_URL_updateEvent,
      json: true,
      headers:{
        "cookie": 'xin=jing'
      }
    }, function(err, response, data) {
      if (!err && response.statusCode == 200) {
        if(data.success){
          console.log("Update JFWeb events succeed!")
        }else{
          console.log("Update JFWeb events failed!")
        }
      } else {
        if (err) {
          log(err)
        }
      }
    })
  }

  Event.startEvent = function() {

  }
}
