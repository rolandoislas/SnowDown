!function(){
var cdn = "//ddragon.leagueoflegends.com/cdn";
var version = "5.24.1";
var language = "en_US";
var champion;

function getChampions() {
	$.ajax({
		type: "GET",
		dataType:"json",
		url: cdn + "/" + version + "/data/" + language + "/champion.json",
		success: function(data) {
			champion = data;
			getSaleData();
		}
	});
}

function getSaleData() {
	$.ajax({
		type: "GET",
		dataType:"json",
		url: "/inc/data/sale_2015.json",
		success: function(data) {
			sale = data;
			populateChampionGrid();
			setRandomBackground();
		}
	});
}

function setRandomBackground() {
	var children = $(".championContainer").children().toArray();
	var random = children[Math.floor((Math.random() * (children.length - 1)))];
	setSplash.apply(random, [null, true]);
}

function populateChampionGrid(query) {
	$(".championContainer").html("");
	sale.forEach(function(s) {
		if ((!query) || s.name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
			$("<div>", {
				"class": "championImage"
			})
			.css("background", "url(" + getChampionImage(s.name) + ")")
			.css("background-size",  "cover")
			.attr("title", s.name + "\n" + s.date + "\n Normal: " + s.price + " RP\n Sale: " + s.sale + " RP")
			.data("name", s.name)
			.appendTo(".championContainer");
		}
	});
	// clear
	$("<div>", {
		"class": "clear"
	}).appendTo(".championContainer");
	// trim width
	var width = $(".championContainer").width();
	width -= width % 51;
	$(".championContainer").width(width);
	$(".skinSearch").width(width - 2);
}

function getSale(name) {
	var saleObj = {};
	sale.forEach(function(s) {
		if (s.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
			saleObj = s;
	});
	return saleObj;
}

function onSale(name) {
	var found = false;
	sale.forEach(function(s) {
		if (s.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
			found = true;
	});
	return found;
}

function getChampionImage(skinName) {
	return cdn + "/" + version + "/img/champion/" + getChampionFromSkin(skinName) + ".png";
}

function setSplash(event, backgroundOnly) {
	var championImage = $(this);
	$.ajax({
		type: "GET",
		dataType:"json",
		url: cdn + "/" + version + "/data/" + language + "/champion/" + getChampionFromSkin(championImage.data("name")) + ".json",
		success: function(data) {
			var splash = getSplash(data, championImage.data("name"));
			$(".splashContainer")
				.css("background", "url(" + splash + ")")
				.css("background-size", "cover");
			if (!backgroundOnly) {
				setSelectedChampionIcon(championImage);
				$(".selectionContainer").hide();
			}
		}
	});
}

function setSelectedChampionIcon(championImage) {
	if (typeof(championImage) === "undefined") {
		$(".selectedChampion").hide();
		$(".selectedChampionMessage").hide();
		return;
	}
	$(".selectedChampion")
	.css("background", championImage.css("background"))
	.css("background-size", "cover")
	.attr("title", $("#" + championImage.attr("aria-describedby") + " div").html())
	.show();
	$(".selectedChampionMessage").show();
}

function getChampionFromSkin(skinName) {
	var id = "";
	for (var key in champion.data) {
		// Skins without champion names
		if (skinName.toLowerCase().indexOf("mundo") > -1)
			id = "DrMundo";
		if (skinName.toLowerCase().indexOf("fiddle") > -1)
			id = "FiddleSticks";
		// General match
		if (skinName.toLowerCase().indexOf(" " + champion.data[key].name.toLowerCase()) > -1
			|| skinName.toLowerCase().indexOf(champion.data[key].name.toLowerCase() + " ") > -1)
			id = champion.data[key].id;
	}
	return id;
}

function getSplash(championData, skinName) {
	var splash = "";
	for (var key in championData.data) {
		championData.data[key].skins.forEach(function(skin) {
			if (skin.name.toLowerCase() === skinName.toLowerCase())
				splash = cdn + "/img/champion/splash/" + championData.data[key].id + "_" + skin.num + ".jpg";
		});
	}
	return splash;
}

function reset() {
	$(".selectionContainer").show();
	setSelectedChampionIcon();
}

function doSearch() {
	populateChampionGrid($(this).val());
}

function addEvents() {
	$(document).on("click", ".championContainer .championImage", setSplash);
	$(document).on("click", ".selectedChampion", reset);
	$(document).on("click", ".selectedChampionMessage", reset);
	$(document).on("propertychange change click keyup input paste", ".skinSearch", doSearch);
}
	
$(document).ready(function() {
	addEvents();
	getChampions();
	$(document).tooltip();
});
}();