sap.ui.define([
	"com/samples/gb/masterdetail/samplemasterdetailgb/controller/Base.controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.samples.gb.masterdetail.samplemasterdetailgb.controller.Master", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.samples.gb.masterdetail.samplemasterdetailgb.view.Master
		 */
		onInit: function () {
			this.getRouter().getRoute("master").attachPatternMatched(this._masterPageRouteMatchedMethod, this);
			this.getRouter().getRoute("home").attachPatternMatched(this._homePageRouteMatchedMethod, this);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.samples.gb.masterdetail.samplemasterdetailgb.view.Master
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.samples.gb.masterdetail.samplemasterdetailgb.view.Master
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.samples.gb.masterdetail.samplemasterdetailgb.view.Master
		 */
		//	onExit: function() {
		//
		//	}
		_masterPageRouteMatchedMethod: function (oEvent) {
			this.showMessage("I", "The Master Route is matched with Time Parameter as : " + oEvent.getParameter("arguments").timeParam);
		},
		_homePageRouteMatchedMethod: function (oEvent) {
			this.showMessage("I", "The Home Route is matched with no Parameters");
		},
		onRouteToDetail: function () {
			this.navTo("detail", {
				timeParam: new Date().getTime()
			});
		}

	});

});