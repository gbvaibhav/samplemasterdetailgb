/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/samples/gb/masterdetail/samplemasterdetailgb/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});