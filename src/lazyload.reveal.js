import {setSources} from "./lazyload.setSources";
import {setData} from "./lazyload.data";
import {addClass, removeClass} from "./lazyload.class";

const callCallback = function (callback, argument) {
    if (callback) {
        callback(argument);
    }
};

const loadString = "load";
const errorString = "error";

const removeListeners = function(element, loadHandler, errorHandler) {
    element.removeEventListener(loadString, loadHandler);
    element.removeEventListener(errorString, errorHandler);
};

const addOneShotListeners = function(element, settings) {
    const onLoad = (event) => {
        onEvent(event, true, settings);
        removeListeners(element, onLoad, onError);
    }
    const onError = (event) => {
        onEvent(event, false, settings);
        removeListeners(element, onLoad, onError);
    }
    element.addEventListener(loadString, onLoad);
    element.addEventListener(errorString, onError);
};

const onEvent = function (event, success, settings) {
    const element = event.target;
    removeClass(element, settings.class_loading);
    addClass(element, (success ? settings.class_loaded : settings.class_error)); // Setting loaded or error class
    callCallback(success ? settings.callback_load : settings.callback_error, element); // Calling loaded or error callback
}

export const revealElement = function (element, settings, deps) {
    var _callCallback = callCallback,
        _addOneShotListeners = addOneShotListeners,
        _addClass = addClass;
    if (deps) {
        if (deps.callCallback) { _callCallback = deps.callCallback };
        if (deps.addOneShotListeners) { _addOneShotListeners = deps.addOneShotListeners };
        if (deps.addClass) { _addClass = deps.addClass };
    }
    _callCallback(settings.callback_enter, element);
    if (["IMG", "IFRAME"].indexOf(element.tagName) > -1) {
        _addOneShotListeners(element, settings);
        _addClass(element, settings.class_loading);
    }
    setSources(element, settings);
    setData(element, "was-processed", true);
    _callCallback(settings.callback_set, element);
};