// com/samples/gb/masterdetail/samplemasterdetailgb/controller/Base.controller
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, JSONModel) {
	return Controller.extend("com.samples.gb.masterdetail.samplemasterdetailgb.controller.BaseController", {
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		getRoute: function (routeName) {
			return this.getRouter().getRoute(routeName);
		},
		navTo: function (route, parameters) {
			this.getRouter().navTo(route, parameters);
		},
		makeJSONModel: function (data) {
			if (jQuery.isEmptyObject(data)) {
				data = {};
			}
			return new JSONModel(data);
		},
		setModel: function (model, modelName) {
			this.getView().setModel(model, modelName);
		},
		getModel: function (modelName) {
			return this.getView().getModel(modelName);
		},
		getPropertyFromModel: function (modelName, path) {
			return this.getModel(modelName).getProperty(path);
		},
		setPropertyInModel: function (modelName, path, value) {
			this.getModel(modelName).setProperty(path, value);
		},
		setBusy: function (state) {
			this.setPropertyInModel("busyModel", "/flag", state ? true : false);
		},
		getCustomDataValues: function (customData) {
			var values = {};
			jQuery.each(customData, function (ix, ox) {
				values[ox.getKey()] = ox.getValue();
			});
			return values;
		},
		showMessage: function (messageType, message, options) {
			if (typeof (options) !== "object") {
				options = {};
			}
			if (messageType === "E") {
				MessageBox.error(message, options);
			} else if (messageType === "I") {
				MessageBox.information(message, options);
			} else if (messageType === "C") {
				MessageBox.confirm(message, options);
			} else {
				MessageBox.show(message, options);
			}
		},
		showMessageToast: function (message) {
			sap.m.MessageToast.show(message);
		},
		errorHandlerGenericFunction: function (message) {
			this.setBusy(false);
			if (typeof (message) === "object") {
				if (typeof (message.toString) === "function") {
					message = message.toString();
				} else {
					message = JSON.stringify(message);
				}
			}
			this.showMessage("E", message);
		},
		convertArrayToObject: function (data, objectKey) {
			return data.map((x) => {
				var object = {};
				object[objectKey] = x;
				return object;
			});
		},
		makeODataCreateCall: function (requestObject) {
			// {
			// 	modelName:
			// 	entitySet:
			// 	payload:
			// 	urlParameters:
			// }
			return new Promise((resolve, reject) => {
				if (typeof (requestObject) === "object" && !jQuery.isEmptyObject(requestObject)) {
					this.getView().getModel(requestObject.modelName).create(`/${requestObject.entitySet}`, requestObject.payload, {
						urlParameters: jQuery.extend({}, requestObject.hasOwnProperty("urlParameters") ? requestObject.urlParameters : {}, {}),
						success: function (oData) {
							resolve(oData);
						},
						error: function (oError) {
							reject(oError);
						}
					});
				} else {
					reject("Not the correct Format of Request Object");
				}
			});
		},
		makeODataReadCall: function (requestObject) {
			return new Promise((resolve, reject) => {
				if (typeof (requestObject) === "object" && !jQuery.isEmptyObject(requestObject)) {
					requestObject.filters = requestObject.hasOwnProperty("filters") ? requestObject.filters : [];
					this.getView().getModel(requestObject.modelName).read(`/${requestObject.entitySet}`, {
						filters: requestObject.filters,
						urlParameters: jQuery.extend({}, requestObject.hasOwnProperty("urlParameters") ? requestObject.urlParameters : {}, {}),
						success: function (oData) {
							resolve(oData);
						},
						error: function (oError) {
							reject(oError);
						}
					});
				} else {
					reject("Not the correct Format of Request Object");
				}
			});
		},
		makeFilterArray: function (propsArray, filterOprator, query, orAnd) {
			var filterArray = [];
			jQuery.each(propsArray, function (ix, ox) {
				filterArray.push(new sap.ui.model.Filter(ox, sap.ui.model.FilterOperator[filterOprator], query));
			});
			if (filterArray.length > 1 && orAnd) {
				filterArray = [new sap.ui.model.Filter({
					filters: filterArray,
					and: orAnd.toUpperCase() === "OR" ? false : true
				})];
			}
			return filterArray;
		},
		removeNullKeys: function (objectOnReview) {
			var objectToReturn = {};
			var keys = this.getLodashParser().keys(objectOnReview);
			jQuery.each(keys, (idx, obx) => {
				if (objectOnReview[obx] || typeof (objectOnReview[obx]) === "boolean") {
					if (objectOnReview[obx] instanceof Array) {
						objectToReturn[obx] = [];
						jQuery.each(objectOnReview[obx], (idy, oby) => {
							var objToPush = this.removeNullKeys(oby);
							objectToReturn[obx].push(objToPush);
						});
					} else if (objectOnReview[obx] instanceof Object) {
						objectToReturn[obx] = this.removeNullKeys(objectOnReview[obx]);
					} else {
						objectToReturn[obx] = objectOnReview[obx];
					}
				}
			});
			return objectToReturn;
		}
	});
});