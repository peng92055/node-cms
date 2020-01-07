'use strict';

var galleryThemes = require("../../data/glasses_theme.json");
var gallerySeries = require("../../data/glasses_series.json");
var galleryList = require("../../data/glasses_list.json");
var galleryIndex = require("../../data/glasses_index.json");

exports.theme = function(req,res){
	res.json(galleryThemes);
}

exports.series = function(req,res){
	res.json(gallerySeries);
}

exports.list = function(req,res){
	res.json(galleryList);
}

exports.index = function(req, res){
	res.json(galleryIndex);
}