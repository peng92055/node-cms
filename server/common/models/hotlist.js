'use strict'
var log = require('debug')('db:hotlist')
var request = require('request'),
  _ = require('lodash'),
  async = require('async')

var app = require("../../server/server")

module.exports = function(Hotlist) {

  // Hotlist.on('attached', function(obj){
  //   var upsert = Hotlist.upsert;
  //   Hotlist.upsert = function(data, cb) {
  //     if(data.products && data.products.length > 0){

  //     }
  //     upsert.apply(this, arguments);
  //   };
  // });

  // Hotlist.save = function(data, cb) {

  //   Hotlist.upsert(data, function(err, inst) {
  //     if (err) {
  //       return cb(err)
  //     } else {
  //       inst.products.destroyAll(function(err) {
  //         if (err) {
  //           return cb(err)
  //         }

  //         var processes = []

  //         _.each(data.products, function(product) {
  //           product.hotlist_id = inst.id
  //           processes.push(function(cb) {
  //             inst.products.create(product, function(err, result) {
  //               cb(err, result)
  //             })
  //           })
  //         })

  //         async.parallel(processes, function(err, results) {
  //           cb(err, inst)
  //         })
  //       })
  //     }
  //   })
  // }

  // Hotlist.remoteMethod(
  //   'save', {
  //     accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
  //     returns: { arg: 'data', type: 'object', http: { source: 'res' } },
  //     description: '保存排行榜数据'
  //   }
  // );
}
