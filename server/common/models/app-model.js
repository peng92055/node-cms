// to enable these logs set `DEBUG=db:appmodel` or `DEBUG=db:*`
var log = require('debug')('db:appmodel')
module.exports = function(AppModel) {

  AppModel.setup = function() {
    AppModel.base.setup.apply(this, arguments)

    this.beforeRemote('create', function(ctx, result, next) {
      log("befere create")
      ctx.args.data.created = Date.now()
      next()
    })

    this.beforeRemote('upsert', function(ctx, result, next){
      log("before update")
      ctx.args.data.modified = Date.now()
      next()
    })


    //retrieve pagination filters from request queries
    this.beforeRemote('find', function(ctx, result, next){
      if(ctx.req.query.page || ctx.req.query.limit){
        ctx.args.filter = ctx.args.filter || {}
        ctx.args.filter.limit = ctx.req.query.limit
        ctx.args.filter.skip = ctx.req.query.limit * (ctx.req.query.page -1)
      }
      next()
    })

    // this.afterRemote('find', function(ctx, result, next){
    //   // console.log(ctx)

    //   ctx.method.ctor.count(null,function(err, result){
    //     console.log(result)
    //     ctx.result = {
    //       data: ctx.result,
    //       count: result
    //     }
    //     next()
    //   })
    // })
    this.query = function(filter, cb){
      var pageList = {},
          pageCount = 0;
      var findPageList = this.find(filter).then(function(result){
        pageList = result;
      })

      delete filter.offset;
      delete filter.limit;
      delete filter.skip;
      var findPageCount = this.find(filter).then(function(result){
        pageCount = result.length;
      })
      
      Promise.all([findPageList,findPageCount]).then(function(){
        cb(null, pageList, pageCount, 'application/json')
      });
    }

    this.remoteMethod('query', {
      accepts: [
        {arg: 'filter', type: 'object'},
      ],
      http: {
        path: '/query',
        verb: 'GET'
      },
      returns:[
        {arg: 'data', type: 'object'},
        {arg: 'count', type: 'number'}
      ]
    });

    this.beforeRemote('query', function(ctx, result, next){
      if(ctx.req.query.page || ctx.req.query.limit){
        if(!ctx.req.query.page || ctx.req.query.page < 1) {
          ctx.req.query.page = 1
        }

        if(!ctx.req.query.limit || ctx.req.query.limit < 1) {
          ctx.req.query.limit = 10
        }
        ctx.args.filter = ctx.args.filter || {}
        ctx.args.filter.limit = ctx.req.query.limit
        ctx.args.filter.skip = ctx.req.query.limit * (ctx.req.query.page -1)
      }
      next();
    });
  }

  // AppModel.setup()
};