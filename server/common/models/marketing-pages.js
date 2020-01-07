'use strict'
var _  = require('lodash')
var request = require('request')
var app = require("../../server/server")
var log = require('debug')('db:MarketingPages')
var LoopBackContext = require('loopback-context')

var app = require("../../server/server")

module.exports = function(MarketingPages) {

  /**
  *     page document_status: 5: '已删除',1: '草稿（待发布）',2: '等待审核（不准许修改）',3: '发布'
  */

  MarketingPages.beforeRemote('upsert', function(context, user, next) {

    var page = context.args.data

    if(!page.id){
      //新增
      page.created = Date.now()
      if(page.status == 1) page.startDate = new Date()
      updateModifyType('create')
      next()
    }else{
      //修改
      page.modified = Date.now()
      if(page.document_status == 1){
        //保存为草稿
        MarketingPages.findOne({
          where: {
            id: page.id
          }
        }, function(err, page_db) {
          updatePageStatusByPageDb(page,page_db)
          if((page_db.status == 0 || page_db.status == 1) && page.status == 2){
            //停用操作
            updateModifyType('disable')
          }else if(page_db.status == 2 && page.status == 1){
            //启用操作
            updateModifyType('enable')
          }else{
            //修改操作
            updateModifyType('modify')
          }
          next()
        })
      }else{
        if(page.document_status == 3){
          //发布page
          updateModifyType('publish')
        }else if(page.document_status == 5){
          //删除
          updateModifyType('delete')
        }else{
          updateModifyType('other')
        }
        next()
      }
    }
  })

  MarketingPages.afterRemote('upsert', function(context, user, next) {
    var page = context.args.data;
    var ctx = LoopBackContext.getCurrentContext();
    var currentUser = ctx && ctx.get('currentUser');
    var MarketingPagesRecord = app.models.MarketingPagesRecord;

    var record = {
      "page_id": page.id,
      "modify_type": ctx.get('currentMarketingPageModifyType'),
      "user_id": currentUser.id,
      "user_email": currentUser.email,
      "user_name": currentUser.username,
      "modify_date": new Date()
    }

    MarketingPagesRecord.create(record);
    next()
  })

  MarketingPages.afterRemote('delete', function(context, user, next) {
    
    next()
  })

  function updatePageStatusByPageDb(page,page_db){
    if(page_db.status != 1 && page.status == 1){
      page.endDate = null
      //start the MarketingPages
      page.startDate = new Date()
    }else if(page_db.status == 1 && page.status == 2){
      //stop the MarketingPages
      page.endDate = new Date()
    }
    return page;
  }

  function updateModifyType(type){
    var ctx = LoopBackContext.getCurrentContext();
    ctx && ctx.set('currentMarketingPageModifyType',type);
  }
}
