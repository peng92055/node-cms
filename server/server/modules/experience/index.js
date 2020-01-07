'use strict';

var request = require("request")
var app = require("../../server")
  // var Canvas = require("canvas")
var Q = require("q")

var glass_region_url = "http://ai.yyf.biz:8091/glass_region";
var glass_region_server = "http://192.168.0.146:8080",
  glass_region_api = "/glass_region",
  glass_tag_server = "http://192.168.1.154:9000",
  glass_face_tag_api = "/face";

module.exports = function(app) {

  var router = app.loopback.Router();

  var galleryCtrl = require("../controllers/gallery.controller");
  /**
   *   gallery api
   */
  router.get('/api/gallery/theme', galleryCtrl.theme)
  router.get('/api/gallery/series', galleryCtrl.series)
  router.get('/api/gallery/list', galleryCtrl.list)
  router.get('/api/gallery/index', galleryCtrl.index)

  /**
   *  glass region api
   */
  //验证图片中是否包含眼镜
  router.post('/api/glass_region/validateGlass', validateGlass)
    //获取图片中包含眼镜的位置
  router.post('/api/glass_region/getGlassPosition', getGlassPosition)
    //验证手势
  router.post('/api/glass_region/validateGesture', validateGesture)
    //获取图片标签
  router.post('/api/glass_region/getImgTags', getImgTags)
    //获取脸部信息
  router.post('/api/glass_region/getFaceInfo', getFaceInfo)

  app.use(router);

};

//missition_id 0:预测眼镜区域 1:判断是否有眼镜 2:判断是否为点赞手势
function requestPost(url, imgBase64, mission_id, callback) {
  var formData = {
    "format": "base64",
    "name": "EXE_Glass_Region_" + Date.now() + ".jpg",
    "data": imgBase64,
    "md5": "",
    "key": "",
    "mission_id": mission_id
  };

  request.post({
    url: url,
    formData: formData,
    json: true
  }, (err, response, data) => {
    if (err) {
      return console.log(err)
    }
    if (response.statusCode != 200) {
      return console.log(response.statusCode)
    }
    callback(err, response, data)
  });
}

function region(req, res) {
  console.log('------------------------------');
  // console.log(req.body.imgBase64);
  console.log('------------------------------');
  requestPost(glass_region_url, req.body.imgBase64, function(error, response, data) {
    console.log('success');
    res.json({
      "result": data
    })
  })
}

function getGlassPosition(req, res) {
  var url = glass_region_server + glass_region_api;
  requestPost(url, req.body.imgBase64, 0, function(error, response, data) {
    if (error || response.statusCode != 200) {
      res.json({
        result: "error"
      })
    } else if (data) {
      // {"status": 1, "mission_id": 0, "glass_regions": [[29, 73, 145, 67]], "image_name": "0035697e91a7630453865fa9a8876652.jpg", "desc": "success"}
      // statua为0，属于验证失败
      res.json({
        result: data
      })
    } else {
      res.json({
        "result": false
      })
    }
  })
}

function validateGlass(req, res) {
  var url = glass_region_server + glass_region_api;
  requestPost(url, req.body.imgBase64, 1, function(error, response, data) {
    if (error || response.statusCode != 200) {
      res.json({
        result: "error"
      })
    } else if (data && data.probability && data.probability[1] >= 0.8) {
      res.json({
        "result": true
      })
    } else {
      res.json({
        "result": false
      })
    }
  })
}

function validateGesture(req, res) {
  var url = glass_region_server + glass_region_api;
  requestPost(url, req.body.imgBase64, 2, function(error, response, data) {
    if (error || response.statusCode != 200) {
      return res.json({
        result: "error"
      })
    } else if (data && data.probability && data.probability[1] >= 0.8) {
      res.json({
        "result": true
      })
    } else {
      res.json({
        "result": false
      })
    }
  })
}

function getImgTags(req, res) {
  var imageData = req.body.imgBase64 //完整的源图片的base64编码

  requestTagServer("", imageData, function(error, response, data) {
    if (error || response.statusCode != 200) {
      return res.json({
        result: "error"
      })
    }
    if (data) {
      res.json({
        "result": data
      })
    } else {
      res.json({
        "result": false
      })
    }
  })
}

function getClipImageData(imageData, clipSetting) {
  var deferred = Q.defer();
  var Image = Canvas.Image,
    image = new Image;
  image.src = imageData;

  var canvas = new Canvas(clipSetting[2], clipSetting[3]),
    ctx = canvas.getContext('2d');
  ctx.drawImage(image, clipSetting[0], clipSetting[1], clipSetting[2], clipSetting[3], 0, 0, clipSetting[2],
    clipSetting[3]);

  canvas.toDataURL('image/jpeg', function(err, jpeg) {
    if (err) {
      deferred.reject(err)

    } else {
      jpeg = jpeg.replace("data:image/jpeg;base64,", "");
      deferred.resolve(jpeg)
    }
  });

  return deferred.promise;
}

function requestTagServer(api, imgData, callback) {
  // console.log(imgData)
  var requestUrl = glass_tag_server + api;
  var postOptions = {
    "url": requestUrl,
    "body": {
      "data": imgData
    },
    "content-type": "application/json",
    "json": true
  }

  request.post(postOptions, callback);
}

function getFaceInfo(req, res) {
  var imageData = req.body.imgBase64;

  requestTagServer("/face/", imageData, function(error, response, data) {
    console.log(data)
    if (error || response.statusCode != 200) {
      return res.json({
        "result": "error"
      })
    }
    if (data && data.faces && data.faces.length > 0 && data.faces[0].attributes) {
      res.json({
        "result": {
          "gender": data.faces[0].attributes["gender"]["value"],
          "age": data.faces[0].attributes["age"]["value"]
        }
      })
    } else {
      res.json({
        "result": false
      })
    }
  })
}