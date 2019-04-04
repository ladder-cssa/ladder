/*
    **************************** ABOUT 有關本檔案             ****************************

        script.js:

            This is the core JavaScript file for the functionality of 
            the Ladder web app, including user interface interactions
            and NOM-bassed neural network modelling structure.
            這是 Ladder 網頁應用程式運作的 JavaScript 檔案，包括使用者界面
            互動功能和以 NOM 為基礎的類神經網絡模型結構。

        Creators 創作團隊: 

            Yin-Chung Leung, Kai-Hsiang Lin, Rui-Hung Chang
            梁彥聰、林凱翔、張瑞紘

            @ Creative System and Software Applications Laboratory, National Cheng Kung Univerisity, Taiwan
            @ 創新系統軟體應用實驗室 —— 台灣 國立成功大學

        Version 版本:

            1903.02

        Website & Docs 網站及文件庫:
        
            English:    http://cssa.cc.ncku.edu.tw/ladder/
            中文:       http://cssa.cc.ncku.edu.tw/ladder/?lang=zh_TW

        Production in TAIWAN | 台灣製作
        

    **************************** COPYRIGHT NOTES 版權資訊     ****************************

        Copyright © 2019 Creative System and Software Applications Laboratory

        This file is part of Ladder.

        Ladder is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        Ladder is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with Ladder.  If not, see <https://www.gnu.org/licenses/>.

        本檔案是 Ladder 的一部分。

        Ladder 為自由軟體，在自由軟體聯盟發佈的GNU通用公共授權合約的約束下，你可以對其
        進行再發佈及修改。協議版本為第三版或（隨你）更新的版本。

　　    我們希望發佈的這款程式有用，但不保證，甚至不保證它有經濟價值和適合特定用途。詳
        情參見GNU通用公共授權合約。

　　    你理當已收到一份GNU通用公共授權合約的副本，如果沒有，請查閱<http://www.gnu.org/licenses/> 
　　    同時提供你的電子郵寄地址或傳統的郵件聯繫方式。

        Contact us 連繫我們:  ladder.cssa@gmail.com


    **************************** CREATORS 創作團隊            ****************************

        Developers  開發人員:

            Yin-Chung Leung 梁彥聰 (Dexter)

                Research Postgraduate 碩士研究生 (2017-)

                Department of Computer Science and Information Engineering, 
                National Cheng Kung University, 
                Tainan city 701,
                Taiwan 
                資訊工程研究所
                國立成功大學
                701 台南
                台灣

                YCLeung@outlook.com
        
        Acceptance Tests 驗收測試:

            Kai-Hsiang Lin 林凱翔

                Research Postgraduate 碩士研究生 (2018-)

                Department of Computer Science and Information Engineering, 
                National Cheng Kung University, 
                Tainan city 701,
                Taiwan 
                資訊工程研究所
                國立成功大學
                701 台南
                台灣

                ben85824@gmail.com

        >>>>>>>>>>>>>>>>>>>>>> PROJECT LEADER 項目領導 <<<<<<<<<<<<<<<<<<<<<<

            Jui-Hung Chang 張瑞紘

                Assistant Professor 副教授

                Computer and Network Center, and Department of Computer Science and Information Engineering, 
                National Cheng Kung University, 
                Tainan city 701,
                Taiwan 
                計算機與網絡中心 / 資訊工程學系暨研究所
                國立成功大學
                701 台南
                台灣

                changrh@mail.ncku.edu.tw
        
        
 */



/************** Basic Functionalities   **************/
/**
 * Returns the HTML element using an id.   --- UPDATED (Dexter) 20180723
 * @param {...String} ids - Element ID.
 * @returns {(Element|Array<Element>)} - The requested element. Return the only element if only one parameter of `ids` is given, otherwise an array of requested elements is returned.
 */
function $(...ids) {
    if (ids.length == 1)
        return ids[0] == "_body" ? document.body : document.getElementById(ids[0]);
    else
        return ids.map(id=>id == "_body" ? document.body : document.getElementById(id));
}

/**
 * Returns the class name of an object.   --- UPDATED (Dexter) 20180625
 * @param {*} obj - A JavaScript object.
 * @returns {String} - The class name.
 */
function classof(obj) {
    return obj.constructor.name;
}

/**
 * A generator to yield the combinations of elements in an array.   --- UPDATED (Dexter) 20180812
 * @param {Array<*>} array - A list of information to get the combinations of each element.
 * @yields {Array<*>} - A combination of elements of the given array.
 */
function* getCombinations(array) {
    /**
     * A recurssive function for generating combination of elements.   --- UPDATED (Dexter) 20180812
     * @param {Array<Array<Number>>} idxAry - An array of all combinations with each element as an array of indices of elements in a particular combination.
     * @param {Array<Number>} prev - Previous combination list. (from combinations with less/no elements)
     * @param {Array<Number>} next - Next combination list. (from combinations with more/full elements)
     */
    function combRec(idxAry,prev,next) {
        if (next.length) {
            combRec(combIdx,[...prev, next[0]], next.slice(1));
            combRec(combIdx,[...prev], next.slice(1));
        } else if (prev.length) {
            idxAry.push(prev);
        }
    }

    // Create the index array and get the combination of indexes.
    var len = array.length;
    var combIdx = new Array();
    combRec(combIdx,[],Array(len).fill(0).map((ele,idx)=>idx));
    combIdx.sort((a,b)=>a.length<=b.length?1:-1);

    // Yield the element on the generated combination indexes.
    var yIdx = 0;
    while (yIdx < combIdx.length) {
        yield combIdx[yIdx].map(idx=>array[idx]);
        yIdx++;
    }
}

/**
 * Compare whether two shapes are equal.   --- UPDATED (Dexter) 20180822
 * @param {Array<(Number|String)>} shape1 - One shape array, either `Number` or `"None"`.
 * @param {Array<(Number|String)>} shape1 - Another shape array, either `Number` or `"None"`.
 * @returns {Boolean} - Whether the 2 sahpes are equal.
 */
function shapeEquals(shape1, shape2) {
    return shape1.every((s,idx)=>shape2[idx] == s);
}

/**
 * Class representing a matrix operation.   --- UPDATED (Dexter) 20181121
 */
class Matrix {
    /**
     * Flatten a multi-dimensional array; assume the dimensional lengths are consistent across elements.   --- UPDATED (Dexter) 20180530
     * @param {Array<*>|*} ary - A multi-dimensional array; or the deepest dimensional element
     * @returns {Array<*>|*} - A flattened array.
     */
    static flatten(ary) {
        // Only flatten if ary is an array.
        if (ary instanceof Array) {
            return ary.map(e=>Matrix.flatten(e)).reduce((a,c)=>a.concat(c),[]);
        } else return ary;
    }

    /**
     * Add a multi-dimensional array or constant element-wise; assume the dimensional lengths are consistent across elements.   --- UPDATED (Dexter) 20181121
     * @param {...(Array<(Array|Number)|Number)>} matrices - A multi-dimensional array, or a constant value.
     * @returns {Array<(Array|Number)>} - The resultant matrix after the element-wise summation.
     */
    static add(...matrices) {
        if (matrices.some(mx=>mx instanceof Array)) {
            return matrices.find(mx => mx instanceof Array).map((ele,idx)=>Matrix.add(...matrices.map(mx=>mx instanceof Array ? mx[idx] : mx)));
        } else return matrices.reduce((a,b) => a+b);
    }

    /**
     * Flatten a multi-dimensional array; assume the dimensional lengths are consistent across elements.   --- UPDATED (Dexter) 20181121
     * @param {...(Array<(Array|Number)|Number)>} matrices - A multi-dimensional array, or a constant value.
     * @returns {Array<(Array|Number)>} - The resultant matrix after the element-wise multiplication.
     */
    static multiply(...matrices) {
        if (matrices.some(mx=>mx instanceof Array)) {
            return matrices.find(mx => mx instanceof Array).map((ele,idx)=>Matrix.multiply(...matrices.map(mx=>mx instanceof Array ? mx[idx] : mx)));
        } else return matrices.reduce((a,b) => a*b);
    }

    /**
     * Concat a multi-dimension array on the column (dimension 1) space.   --- UPDATED (Dexter) 20190128
     * @param {...Array<(Array|Number)>} matrices - A multi-dimensional arra.
     * @returns {Array<(Array|Number)>} - The resultant matrix after the element-wise multiplication.
     */
    static concatColumns(...matrices) {
        return matrices[0].map((row,rowID)=>matrices.reduce((a,b)=>a.concat(b[rowID]), []));
    }

    /**
     * Auto determine the type of all arrays.   --- UPDATED (Dexter) 20190128
     * @param {Array<(Array|Number)>} ary - A multi-dimensional arra.
     * @returns {Array<(Array|Number)>} - The resultant matrix after the element-wise auto-typing.
     */
    static autoType(ary) {
        if (ary instanceof Array) {
            return ary.map(ele=>Matrix.autoType(ele));
        } else {
            return isNaN(Number(ary)) ? ary : Number(ary);
        }
    }

    /**
     * Transform a matrix for every elements with a given function.   --- UPDATED (Dexter) 20190213
     * @param {Array<(Array|Number)>} ary - A multi-dimensional arra.
     * @returns {Array<(Array|Number)>} - The resultant matrix after the element-wise auto-typing.
     */
    static transform(ary, ftn) {
        if (ary instanceof Array) {
            return ary.map(ele=>Matrix.transform(ele, ftn));
        } else {
            return ftn(ary);
        }
    }
    
    /**
     * Slice a 2D array on the row aspect.   --- UPDATED (Dexter) 20180523
     * @param {*} ary - Array of data
     * @param {*} batchStart - Batch starting index (including)
     * @param {*} batchEnd - Batch ending index (excluding)
     */
    static rowSlicing(ary, batchStart = "None", batchEnd = "None") {
        return ary.slice(batchStart == "None" ? 0 : batchStart, batchEnd == "None" ? ary.length : batchEnd)
    }
}

/** An enumeration object.   --- UPDATED (Desxter) 20181128 */
class Enum {
    /**
     * Create an enumeration object.   --- UPDATED (Desxter) 20181128
     * @param {Object<String,Number>} obj - Enumeration content object in string key as property name with integer value.
     */
    constructor(obj) {
        var allKeys = [...Object.keys(obj)];
        Object.defineProperty(this, "_keyValuePairs", { value: new Map() });
        
        allKeys.forEach(k=>{
            // Ensure the keys are upper case in the first letter.
            var key = k[0].toUpperCase() + k.slice(1);
            this._keyValuePairs.set(key, obj[k]);
            Object.defineProperty(this, key, { get() { return this._keyValuePairs.get(key); }, enumerable: true });
        });
    }

    /**
     * Get the name of an enumeration value.   --- UPDATED (Desxter) 20181128
     * @param {Number} value - The enumeration value.
     * @returns {String} - The enumeration key.
     */
    getName(value) {
        return [...this._keyValuePairs.entries()].find(entry=>entry[1] == value)[0];
    }
    
    /**
     * Get the names of this enumeration object.   --- UPDATED (Desxter) 20181128
     * @returns {Array<String>} - The names of this enumeration object.
     */
    getNames() {
        return [...this._keyValuePairs.keys()];
    }

    /**
     * Get the values of this enumeration object.   --- UPDATED (Desxter) 20181128
     * @returns {Array<Number>} - The values of this enumeration object.
     */
    getValues() {
        return [...this._keyValuePairs.values()];
    }
}

// Add iterator to HTMLCollection object   --- UPDATED (Dexter) 20180521
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

/**
 * Stop event from propagations.   --- UPDATED (Dexter) 20180521
 * @param {Event} e - An `Event`.
 */
function stopPropagate(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * Check if an HTML element is or a child of any element of a specific rule.   --- UPDATED (Dexter) 20180521
 * @param {Element} ele - An HTML element.
 * @param {Function} ftn - A function returning a validation boolean.
 * @returns {Boolean} - Whether the requested element is or is a child of another element fullfilling the given validation function.
 */
function isOrDescendentOf(ele, ftn) {
    if (ftn(ele)) {
        return true;
    } else if (ele.parentElement) {
        ele = ele.parentElement;
        return isOrDescendentOf(ele, ftn);
    } else {
        return false;
    }
}


/** Class representing a UI theme.  --- UPDATED (Dexter) 20180521 */
class Theme {
    /**
     * Update the current app UI to a specific theme.   --- UPDATED (Dexter) 20180521
     * @param {String} themeName - A pre-defined theme name.
     * @param {Array<Array<String>>} customTheme - A customized 2-dimension theme array, with CSS variable name and value pair.
     */
    static update(themeName, customTheme) {
        // If the theme name is not "light" or the theme does not equal to the local storage, update the theme through stylesheet rule editing
        if (themeName != "light" || themeName != localStorage.themeName) {
            var toTheme = themeName == "custom" ? (customTheme || JSON.parse(localStorage.themeObj)) : (Theme.get(themeName || "light"));
            document.styleSheets[0].deleteRule(0);
            document.styleSheets[0].insertRule(`:root {${toTheme.map(r=>r.join(": ")).join("; ")}}`,0);
        } 
        
        // If new theme name is not the local storage one, update local storage settings
        if (themeName != localStorage.theme) localStorage.theme = themeName;

    }

    /**
     * Update the theme selection box after the page is loaded.   --- UPDATED (Dexter) 20180627
     */
    static updated() {
        if (localStorage.theme) $("selTheme").selectedIndex = [...$("selTheme").children].findIndex(opt=>opt.dataset.val == localStorage.theme);
    }

    /**
     * Get a predifined theme array.   --- UPDATED (Dexter) 20190209
     * @param {String} key - A pre-defined theme name.
     * @returns {Array<Array<String>>} - A 2D theme array, with CSS variable name and value pair.
     */
    static get(key) {
        if (key == "light") {
            return [["--bg-color", "hsl(0,0%,95%)"],
            ["--bg-tspr-color", "hsla(0,0%,95%,.3)"],
            ["--bg-tslc-color", "hsla(0,0%,95%,.5);"],
            ["--bg-acry-color", "hsla(0,0%,95%,.75)"],
            ["--bg-opq-color", "hsla(0,0%,95%,.9)"],
            ["--bg-lighter-color", "hsl(0,0%,100%)"],
            ["--bg-lighter-acry-color", "hsla(0,0%,100%,.75)"],
            ["--bg-lighter-opq-color", "hsla(0,0%,100%,.9)"],
            ["--bg-darker-color", "hsl(0,0%,85%)"],
            ["--bg-darker-acry-color", "hsla(0,0%,85%,.75)"],
            ["--bg-darker-opq-color", "hsla(0,0%,85%,.9)"],
            ["--bg-border-color", "var(--bg-darker-color)"],
            ["--top-color", "hsl(0,0%,10%)"],
            ["--top-tslc-color", "hsla(0,0%,10%,.5)"],
            ["--accent-color", "hsl(250,40%,60%)"],
            ["--accent-active-color", "var(--accent-acry-color)"],
            ["--accent-darker-color", "hsl(250,40%,50%)"],
            ["--accent-filter", "contrast(0.55) sepia(1) saturate(1.15) hue-rotate(211.5deg)"],
            ["--accent-tspr-color", "hsla(250,40%,60%,.3)"],
            ["--accent-tslc-color", "hsla(250,40%,60%,.5)"],
            ["--accent-acry-color", "hsla(250,40%,60%,.75)"],
            ["--accent-active-acry-color", "var(--accent-acry-color)"],
            ["--accent-opq-color", "hsla(250,40%,60%,.9)"],
            ["--accent-top-color", "hsl(0,0%,100%)"],
            ["--accent-top-filter", "grayscale(1) brightness(2)"],
            ["--accent-border-color", "var(--accent-color)"],
            ["--accent-border-tslc-color", "var(--accent-tspr-color)"],
            ["--accent-border-opq-color", "var(--accent-opq-color)"],
            ["--accent-text", "hsl(250,40%,60%)"],
            ["--ctx-icon-filter", "saturate(0) brightness(.6)"]]
        } else if (key == "dark") {
            return [["--bg-color", "hsl(0,0%,10%)"],
            ["--bg-tspr-color", "hsla(0,0%,10%,.3)"],
            ["--bg-tslc-color", "hsla(0,0%,10%,.5);"],
            ["--bg-acry-color", "hsla(0,0%,10%,.75)"],
            ["--bg-opq-color", "hsla(0,0%,10%,.9)"],
            ["--bg-lighter-color", "hsl(0,0%,5%)"],
            ["--bg-lighter-acry-color", "hsla(0,0%,0%,.75)"],
            ["--bg-lighter-opq-color", "hsla(0,0%,0%,.9)"],
            ["--bg-darker-color", "hsl(0,0%,20%)"],
            ["--bg-darker-acry-color", "hsla(0,0%,20%,.75)"],
            ["--bg-darker-opq-color", "hsla(0,0%,20%,.9)"],
            ["--bg-border-color", "var(--bg-darker-color)"],
            ["--top-color", "hsl(0,0%,90%)"],
            ["--top-tslc-color", "hsla(0,0%,90%,.5)"],
            ["--accent-color", "hsl(250,40%,60%)"],
            ["--accent-active-color", "var(--accent-acry-color)"],
            ["--accent-darker-color", "hsl(250,40%,50%)"],
            ["--accent-filter", "contrast(0.55) sepia(1) saturate(1.15) hue-rotate(211.5deg)"],
            ["--accent-tspr-color", "hsla(250,40%,60%,.3)"],
            ["--accent-tslc-color", "hsla(250,40%,60%,.5)"],
            ["--accent-acry-color", "hsla(250,40%,60%,.75)"],
            ["--accent-active-acry-color", "var(--accent-acry-color)"],
            ["--accent-opq-color", "hsla(250,40%,60%,.9)"],
            ["--accent-top-color", "hsl(0,0%,100%)"],
            ["--accent-top-filter", "grayscale(1) brightness(2)"],
            ["--accent-border-color", "var(--accent-color)"],
            ["--accent-border-tslc-color", "var(--accent-tspr-color)"],
            ["--accent-border-opq-color", "var(--accent-opq-color)"],
            ["--accent-text", "hsl(250,40%,80%)"],
            ["--ctx-icon-filter", "saturate(0) brightness(1.5)"]]
        } else if (key == "trueBlack") {
            return [["--bg-color", "hsl(0,0%,0%)"],
            ["--bg-tspr-color", "hsla(0,0%,0%,.3)"],
            ["--bg-tslc-color", "hsla(0,0%,0%,.5);"],
            ["--bg-acry-color", "hsla(0,0%,0%,.75)"],
            ["--bg-opq-color", "hsla(0,0%,0%,.9)"],
            ["--bg-lighter-color", "hsl(0,0%,0%)"],
            ["--bg-lighter-acry-color", "hsla(0,0%,0%,.75)"],
            ["--bg-lighter-opq-color", "hsla(0,0%,0%,.9)"],
            ["--bg-darker-color", "hsl(0,0%,15%)"],
            ["--bg-darker-acry-color", "hsla(0,0%,15%,.75)"],
            ["--bg-darker-opq-color", "hsla(0,0%,15%,.9)"],
            ["--top-color", "hsl(0,0%,80%)"],
            ["--top-tslc-color", "hsla(0,0%,80%,.5)"],
            ["--accent-color", "hsl(180,0%,16%)"],
            ["--accent-active-color", "hsl(180,40%,60%)"],
            ["--bg-border-color", "var(--accent-active-color)"],
            ["--accent-darker-color", "hsl(180,0%,5%)"],
            ["--accent-filter", "contrast(0.55) sepia(1) saturate(1.15) hue-rotate(141.5deg)"],
            ["--accent-tspr-color", "hsla(180,40%,16%,.35)"],
            ["--accent-tslc-color", "hsla(180,40%,16%,.5)"],
            ["--accent-acry-color", "hsla(180,40%,16%,.75)"],
            ["--accent-active-acry-color", "hsla(180,40%,60%,.75)"],
            ["--accent-opq-color", "hsla(180,40%,16%,.9)"],
            ["--accent-top-color", "hsl(0,0%,90%)"],
            ["--accent-top-filter", "grayscale(1) brightness(1.5)"],
            ["--accent-border-color", "var(--accent-active-color)"],
            ["--accent-border-tslc-color", "hsla(180,40%,60%,.5)"],
            ["--accent-border-opq-color", "hsla(180,40%,60%,.9)"],
            ["--accent-text", "hsl(180,40%,75%)"],
            ["--ctx-icon-filter", "saturate(0)"]]
        }
    }
}

/** Class representing the App environment.   --- UPDATED (Dexter) 20180523 */
class App {
    /**
     * Any application-related variables stored in this Map() object.   --- UPDATED (Dexter) 20180523
     * @returns {Map<String,*>} - A `Map` object with key-value pairs of application-related variables.
     */
    static get all() { return this._all; } static set all(v) { this._all = v; }

    /**
     * Translatable textual values stored in this `Map` object.   --- UPDATED (Dexter) 20180523
     * @returns {Map<String,Map<String,String>>} - A 2-dimension `Map` object, storing dictionary with 2-level-key on language code and variable key.
     */
    static get dict() { return this._dict; } static set dict(v) { this._dict = v; }

    /**
     * Core web worker that handles complicated computations.   --- UPDATED (Dexter) 20180523
     */
    static get worker() { return this._worker; } static set worker(v) { this._worker = v; }

    /**
     * Core web worker that handles complicated computations.   --- UPDATED (Dexter) 20180523
     * @returns {Worker} - The core worker of this application.
     */
    static get uid() { return this._uid; } static set uid(v) { this._uid = v; }

    /**
     * App preparation during the parsing of this script before DOM is loaded.   --- UPDATED (Dexter) 20180523
     */
    static prepare() {
        // Initialize necessary global app varialbles
        App.all = new Map(); App.uid = 0; App.dict = new Map();

        // Update the theme of the webpage from the loaclStorage.theme , to start before DOM is loaded because the styling rendering need to start asap.
        Theme.update(localStorage.theme);

        // Prepare the worker, noted a random versioning is added to prevent using of browser cache.
        App.worker = new Worker("worker.js?v="+Math.random());
        App.worker.addEventListener("message", App.workerMessage, false);

        // Status for language reading as zero.
        App.all.set("langRead", 0);
        
        // Initiate CSV setup.
        CSV.initiate();
        ChromeWebWorker.initiate();
        App.worker.postMessage({action: "initiate"});

        // Fetch "lang.csv" for all translatable textual content.
        fetch(App.getAppLocation() + "lang.csv?rand=" + Math.random()).then(e=>e.text()).then(App.langReady);

        // Add event listeners for window load and resize.
        window.addEventListener("load", App.loaded, false);
        window.addEventListener("resize", App.resize, false);
    }

    /**
     * Taking actions, especially those related to DOM elements.   --- UPDATED (Dexter) 20181221
     */
    static loaded(e) {
        // Initialize configurations (those related to localStorage settings).
        App.initConfig();

        // Add events for the navigation bar buttons
        $("homeBtn").addEventListener("click", App.backToStart, false);
        $("settingsBtn").addEventListener("click", App.toggleSettings, false);
        $("infoBtn").addEventListener("click", App.toggleAbout, false);
        $("propertiesBtn").addEventListener("click", App.toggleProperties, false);

        // Add events for the settings panel UI elements - updating language / theme / showing About Us / .
        $("selLang").addEventListener("change", App.updateLang, false);
        Theme.updated();
        $("selTheme").addEventListener("change", App.updateTheme, false);
        $("aboutDownNeuralSimplycode").addEventListener("click", App.downloadNeuralSimplycode, false);

        // Add drag and drop event to the startScreen for identifying drag and drop file actions.
        $("startScreen").addEventListener("dragover", App.dragOverStartScreen, false);
        $("startScreen").addEventListener("dragenter", App.dragEnterEle, false);
        $("startScreen").addEventListener("dragleave", App.dragLeaveEle, false);
        $("startScreen").addEventListener("drop", App.dropStartScreen, false);

        // Add default actions to checkbox - changing styles, updating values, dispatch a change event.
        [...document.getElementsByClassName("checkbox")].forEach(ele=>ele.addEventListener("click", (e)=>{
            ele.classList.toggle("ticked");
            ele.dataset.val = ele.dataset.val == "1" ? "" : "1";
            ele.dispatchEvent(new Event("change"));
        }, false));

        // Add default events to those elements that need on-screen validations, typically input elements.
        [...document.getElementsByClassName("val")].forEach(ele=>{
            ele.addEventListener("change", InputBox.toValidateEle, false);
            ele.addEventListener("focus", InputBox.toFocusEle, false);
        });

        // Initialize other classes.
        ContextMenu.initiate();
        SpreadSheet.initiate();
        Project.initiate();
        ProjectFolder.initiate();
        DashboardItem.initiate();
    }

    /**
     * Fired when a window resize event is triggered.   --- UPDATED (Dexter) 20180523
     * @param {Event} e - A `window.onresize` event.
     */
    static resize(e) {
        // Model editing graph, or results visualizations may need to update the sizes of SVGs, depending on the current page.
        if (!$("projectFolder").classList.contains("noDisplay")) {
            TrainLog.resizeAll();
            WeightGraph.resizeAll();
            TraceLog.resizeAll();
        } else if (!$("editModel").classList.contains("noDisplay")) {
            Project.resize();
        }
    }

    /**
     * Initialize app configurations, typically those from localStorage settings.   --- UPDATED (Dexter) 20190317
     */
    static initConfig() {
        // Get the localStorage current language settings, and set to App.all .
        const lang = (document.URL.includes("?lang=zh_TW") || document.URL.includes("zh/")) ? "zh-TW" : (document.URL.includes("?lang=en_US") || document.URL.includes("en/")) ? "en-US" : (localStorage["lang"] || "en-US");
        App.all.set("lang", lang);

        // If the current status of "langRead" is zero, the language file has not finished parsing, and increment the "langRead" to tell DOM is ready.
        if (App.all.get("langRead") == 0) App.all.set("langRead", 1);
        // In case the language file is ready, we can now refresh the app text boxes with the desired language.
        else App.refreshLang();

        // Update the language selection box to the currently saved language value.
        $("selLang").selectedIndex = [...$("selLang").children].findIndex(ele=>ele.dataset.val == lang);

        
        // Get the localStorage current preference of whether embedding NeuralSimplycode, and set to App.all .
        App.all.set("embedNeuralSimplycode", Number(localStorage["embedNeuralSimplycode"]) || 0);

        // If so, tick the box of embedding NeuralSimplycode in the context flyout of viewing Python codes
        if (localStorage["embedNeuralSimplycode"] == 1) {
            $("finalEmbedNeuralSimplycode").classList.add("ticked");
            $("finalEmbedNeuralSimplycode").dataset.val = 1;
        }

        // Add an event to that box for user firing a change on this preference.
        $("finalEmbedNeuralSimplycode").addEventListener("click", App.toggleEmbedNeuralSimplycode, false);
    }

    /**
     * Setting a key-value pair on @App.all and `localStorage`, typically for user settings.   --- UPDATED (Dexter) 20180523
     * @param {String} attr - `localStorage` item key.
     * @param {String} val - `localStorage` item value.
     */
    static setConfig(attr, val) {
        App.all.set(attr, val);
        localStorage[attr] = val;
    }

    /**
     * Update the app language to the changed language, fired from the change event in a selection box.   --- UPDATED (Dexter) 20180523
     * @param {Event} e - A `change` event from a `<select>` element.
     */
    static updateLang(e) {
        App.setLang(this.selectedOptions[0].dataset.val);
    }

    /**
     * Set the app language to a specific language code.   --- UPDATED (Dexter) 20180523
     * @param {String} lang - Language code of the requested translating language.
     */
    static setLang(lang) {
        App.setConfig("lang", lang);
        App.refreshLang();
    }

    /**
     * Referesh the language of the app.   --- UPDATED (Dexter) 20190317
     */
    static refreshLang() {
        // Only do this if the app is ready, both DOM is loaded and language file is ready. This is requested when the the second step is finished, so the status is still 1.
        if (App.all.get("langRead") == 1) {
            // Get the current language code
            const lang = App.all.get("lang");

            // Update document title.
            document.title = App.dict.get(lang).get("title");

            // Update the URL.
            const prefix = (document.URL.endsWith("en/") || document.URL.endsWith("zh/")) ? "../" : "";
            history.replaceState({}, document.title, prefix + (lang == "zh-TW" ? "zh/" : "en/"));

            // Update the URL if it's in a frame.
            if (window.parent) {
                const prefix = (window.parent.document.URL.endsWith("en/") || window.parent.document.URL.endsWith("zh/")) ? "../" : "";
                window.parent.history.replaceState({}, document.title, prefix + (lang == "zh-TW" ? "zh/" : "en/"));
            }

            // Update all language-specific links.
            for (let ele of [...document.getElementsByClassName("langLink")]) {
                ele.href = ele.dataset.href + (lang == "zh-TW" ? "?lang=zh_TW" : "");
            }

            // Update all translatable text boxes (.classList with "lt") batch by batch.
            App.refreshLangEle.bind([...document.getElementsByClassName("lt")])();
        }
    }

    /**
     * Refresh the language of the app on batched elements.   --- UPDATED (Dexter) 20180523
     * @param {DOMHighResTimeStamp} ts - Timestamp from `window.requestAnimationFrame`.
     */
    static refreshLangEle(ts) {
        // Get the current language code, and define the no. of elements to update in this batch
        const lang = App.all.get("lang"), l = Math.min(this.length, 20);

        // For each element to update, remove it from the full update list, and apply the translated text content to it.
        for (let i=0; i<l; i++) {
            const ele = this.pop();
            App.applyEleLang(ele, lang);
        }

        // If there are still elements on the queue, update it on the next frame through window.requestAnimationFrame
        if (this.length > 0) window.requestAnimationFrame(App.refreshLangEle.bind(this));
    }

    /**
     * Apply the language on one element.   --- UPDATED (Dexter) 20180523
     * @param {Element} ele - The HTML element to have language updated.
     * @param {String} lang - The language code of the requested translating language.
     */
    static applyEleLang(ele, lang = App.all.get("lang")) {
        if (ele.dataset.cuzLt) {
            // Show a customized language translation info on it.
            var toText = JSON.parse(ele.dataset.cuzLt)[lang];
            if (ele.dataset.ltType) {
                JSON.parse(ele.dataset.ltType).forEach(attr=>ele[attr] = toText);
            } else {
                ele.innerHTML = toText;
            }
        } else {
            // Get the translated text, or translated date, depending on the element dataset setting
            var toText = (ele.dataset.lt) ? App.getTxtFromLang(ele.dataset.lt, lang) : (ele.dataset.ltDate) ? App.getDateFromLang(new Date(Number(ele.dataset.ltDate)), lang) : "";

            // If there is a translated text, update the innerHTML, or using a template, depending on the element dataset setting
            if (toText) {
                toText = (!ele.dataset.ltTemp) ? toText : ele.dataset.ltTemp.replace("$$$", toText);
                if (ele.dataset.ltType) {
                    JSON.parse(ele.dataset.ltType).forEach(attr=>ele[attr] = toText);
                } else {
                    ele.innerHTML = toText;
                }
            }
        }
    }

    /**
     * Get the translated text from a specific language code.   --- UPDATED (Dexter) 20180523
     * @param {String} id - The key of dictionary lookup on a textual content.
     * @param {String} lang - The language code of the requested translating language.
     * @returns {String} - Translated text string.
     */
    static getTxtFromLang(id, lang = App.all.get("lang")) {
        // A key-value loopup from the App.dict Map() object
        return App.dict.has(lang) ? App.dict.get(lang).get(id) : "";
    }

    /**
     * Get the translated date from a specific language code.   --- UPDATED (Dexter) 20190119
     * @param {Date} date - A JavaScript `Date` Object.
     * @param {String} lang - The language code of the requested translating language.
     * @returns {String} - Translated date text string.
     */
    static getDateFromLang(date, lang = App.all.get("lang")) {
        return date.toLocaleDateString(lang, { month: 'short', day: 'numeric', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    /**
     * Create a customized language translation object.   --- UPDATED (Dexter) 20180819
     * @param {Function} ftn - A callback function with the language key as parameter. This function will loop the given function over available languages to get a language-specific string.
     * @returns {Object} - A language key-text pair.
     */
    static createCuzLT(ftn) {
        var lang = {};
        [...App.dict.keys()].forEach(key=>lang[key] = ftn(key));
        return lang;
    }

    /**
     * Update the app theme.   --- UPDATED (Dexter) 20180615
     * @param {Event} e - A `change` event from a `<select>` element.
     */
    static updateTheme(e) {
        Theme.update(this.selectedOptions[0].dataset.val);
    }

    /**
     * Respond to a message from the core `worker.js` Web Worker.   --- UPDATED (Dexter) 20180523
     * @param {MessageEvent} e - A message event sent from the web worker.
     */
    static workerMessage(e) {
        // Map to the core thread function depending on the e.data.action.
        if (e.data.action == "callFunction") {
            if (e.data.className == "App") {
                App[e.data.ftn](...e.data.args);
            } else if (e.data.className == "AppNotification") {
                AppNotification[e.data.ftn](...e.data.args);
            } else if (e.data.className == "ProjectFolder") {
                ProjectFolder[e.data.ftn](...e.data.args);
            } else if (e.data.className == "ContextMenu") {
                ContextMenu[e.data.ftn](...e.data.args);
            } else if (["TrainLog","WeightGraph","TraceLog"].includes(e.data.className)) {
                const classMethods = e.data.className == "TrainLog" ? TrainLog : e.data.className == "WeightGraph" ? WeightGraph : TraceLog;
                if (e.data.id) {
                    classMethods.all.get(e.data.id)[e.data.ftn](...e.data.args);
                } else {
                    classMethods[e.data.ftn](...e.data.args);
                }
            } 
        } else if (e.data.action.startsWith("subWorker")) {
            ChromeWebWorker.actions(e);
        } 
    }

    /**
     * Call the core `worker.js` Web Worker function seamlessly.   --- UPDATED (Dexter) 20180523
     * @param {String} className - The class name of a `class` in the web worker.
     * @param {String} ftn - A static function within the `class` in the web worker.
     * @param {*} args - Any arguments (web worker copy-able) to be attached to the function.
     */
    static workerFtn(className, ftn, ...args) {
        App.worker.postMessage({action: "callFunction", className: className, ftn: ftn, args: args});
    }
    
    /**
     * Toggle the appearance of the right-top settings flyout.   --- UPDATED (Dexter) 20190209
     * @param {Event} e - A `click` event from the setting button.
     */
    static toggleSettings(e) {
        stopPropagate(e);

        // Show the $("settings") object depending on whether it has been shown or not.
        if (ContextMenu.list.indexOf("settings") == -1) {
            ContextMenu.show("settings", true);
            this.classList.add("activated");
            $("settings").addEventListener("closeend", ()=>this.classList.remove("activated"), {once:true});
        } else ContextMenu.closeAll();
    }

    /**
     * Toggle the appearance of the About us right pane.   --- UPDATED (Dexter) 20190209
     * @param {Event} e - A `click` event from the information button.
     */
    static toggleAbout(e) {
        stopPropagate(e);

        // Show the $("about") object depending on whether it has been shown or not.
        if (ContextMenu.list.indexOf("about") == -1) {
            ContextMenu.show("about", true);
            this.classList.add("activated");
            $("about").addEventListener("closeend", ()=>this.classList.remove("activated"), {once:true});
        }
    }

    /**
     * Toggle the appearance of the Properties right pane.   --- UPDATED (Dexter) 20181221
     * @param {Event} e - A `click` event from the properties button.
     */
    static toggleProperties(e) {
        stopPropagate(e);

        // Show the $("editProp") object depending on whether it has been shown or not.
        $("editProp").classList.toggle("collapsed");
        this.classList.toggle("activated");
    }

    /**
     * Continues the language text reading from `lang.txt` after the file is fetched and read as text value.   --- UPDATED (Dexter) 20180523
     * @param {String} txt - A `String` value read from the `lang.txt` after all fetch actions.
     */
    static langReady(txt) {
        // Read the text as CSV asynchronously on a Web Worker
        CSV.readAsync(txt).then(dictCSV=>{
            // After reading, the returned value dictCSV should be a 2D array, and now it'll be stored in the App.dict Map() object.

            // Firstly, the title will be stored as referencing a language code to another Map() object.
            for (let c=1; c<dictCSV[0].length; c++) {
                App.dict.set(dictCSV[0][c], new Map());
            }

            // The sublevelled Map() object is actually mapping a key for selecting what content to be translated.
            for (let r=1; r<dictCSV.length; r++) {
                for (let c=1; c<dictCSV[0].length; c++) {
                    App.dict.get(dictCSV[0][c]).set(dictCSV[r][0], dictCSV[r][c]);
                }
            }

            // If the DOM is not ready, increment the "langRead".
            if (App.all.get("langRead") == 0) App.all.set("langRead", 1);
            // If the DOM is also ready, refresh the language on all translatable textual contents.
            else App.refreshLang();
        });
    }

    /**
     * Fires on dragging over the startScreen, to allow a drag "copy" action before dropping a file or folder here.   --- UPDATED (Dexter) 20180523
     * @param {DragEvent} e - A `drag` event on the startScreen.
     */
    static dragOverStartScreen(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    }

    /**
     * Style the element to give feedback to the user that this is a drappable zone.   --- UPDATED (Dexter) 20181221
     * @param {DragEvent} e - A `drag` event on the start screen.
     */
    static dragEnterEle(e) {
        e.preventDefault();
        // Ensure it is a element node, not a text node.
        if (e.currentTarget.dataset) {
            // Setup a dragCounter because the dragenter and dragleave event is cumbersome to handle that it may be triggered for any cross boundary mouse movements across inner-elements.
            e.currentTarget.dataset.dragCounter = e.currentTarget.dataset.dragCounter ? Number(e.currentTarget.dataset.dragCounter)+1 : 1;

            // Toggle the class list for the dragover style.
            e.currentTarget.classList.add("dragover");
        }
    }
    
    /**
     * Unstyle the element if the user's drag leaves the droppable zone.   --- UPDATED (Dexter) 20181221
     * @param {DragEvent} e - A `drag` event on an element.
     */
    static dragLeaveEle(e) {
        // Ensure it is a element node, not a text node.
        if (e.currentTarget.dataset) {
            // Decrement the dragCounter.
            const dragCount= e.currentTarget.dataset.dragCounter = e.currentTarget.dataset.dragCounter ? Number(e.currentTarget.dataset.dragCounter)-1 : 0;

            // Remove the style in case dragCounter is zero (Ensure the mouse has left the zone instead of crossing inner-element boundaries).
            if (dragCount == 0) e.currentTarget.classList.remove("dragover");
        }
    }

    /**
     * Reset and unstyle the element's drop zone status.   --- UPDATED (Dexter) 20181221
     * @param {DragEvent|DropEvent} e - A `drag`/`drop` event on an element.
     */
    static dragResetEle(e) {
        // Remove the dragCounter.
        delete e.currentTarget.dataset.dragCounter;

        // Remove the style in case dragCounter is zero (Ensure the mouse has left the zone instead of crossing inner-element boundaries).
        e.currentTarget.classList.remove("dragover");
    }

    /**
     * Allow dropping a file or folder on the startScreen.   --- UPDATED (Dexter) 20180523
     * @param {Event} e - A `drop` event on the start screen.
     */
    static dropStartScreen(e) {
        e.preventDefault();

        // Reset the dragCounter, and unstyle the dragover class.
        App.dragResetEle(e);

        if (e.dataTransfer.items.length == 1) {
            // If there is a file or a folder, try to get the item is a file first.
            var singleFile = e.dataTransfer.items[0].getAsFile();
            if (singleFile.name.endsWith(".json")) {
                // If it's really a file, we assume it is a .json project file and read it.
                Project.readJSONFile(singleFile);
            } else {
                // Otherwise, we first assume it is a folder and will read file by file as a NeuralSimplycode results folder structure.
                var webkitDir = e.dataTransfer.items[0].webkitGetAsEntry();
                // A customized fileList object will be based together, for recording the counts of files and status etc.
                var fileList = {counter: 0, all: new Map(), allRead: false, processed: false};
                ProjectFolder.readDir(webkitDir, fileList, true);
            }
        } else if (e.dataTransfer.items.length > 1) {
            // If too much items to identify, show notification and stop proceeding actions.
            AppNotification.show("tooManyFoldersT", "tooManyFoldersC", "cancel.svg");
        } 
    }

    /**
     * Switch the app page using a page id.   --- UPDATED (Dexter) 20181221
     * @param {String} pageID - An app page ID.
     */
    static gotoPage(pageID) {
        if (pageID == "startScreen") {
            // If it's going to the startScreen, show the startScreen and hide the home button.
            $("startScreen").classList.remove("noDisplay");
            $("appNav").classList.add("start");

            // Hide other pages that are not the startScreen.
            [...document.getElementsByClassName("page")].filter(ele=>ele.id != "startScreen").forEach(ele=>ele.classList.add("noDisplay"));
        } else {
            // If it's other pages, show the home button and that page.
            $("appNav").classList.remove("start");
            $(pageID).classList.remove("noDisplay");

            // Hide other pages.
            [...document.getElementsByClassName("page")].filter(ele=>ele.id != pageID).forEach(ele=>ele.classList.add("noDisplay"));

            // If it's the project folder page, resize the graphs.
            if (pageID == "projectFolder") {
                TrainLog.resizeAll();
                WeightGraph.resizeAll();
                TraceLog.resizeAll();
            } 
        }

        // Hide properties pane button if needed.
        if (pageID != "editModel")  {
            $("propertiesBtn").classList.add("noDisplay");
        }
    }

    /**
     * Get the image folder location.   --- UPDATED (Dexter) 20190317
     * @returns {String} - The image folder location.
     */
    static getImageLocation() {
        return (document.URL.endsWith("zh/") || document.URL.endsWith("en/")) ? "../img/" : "img/";
    }

    /**
     * For a template object that is to be duplicated, replace any image resources with a URL that can be used.   --- UPDATED (Dexter) 20190321
     * @param {Element} - The template HTML element.
     */
    static getTemplateImages(tempObj) {
        for (let img of tempObj.getElementsByClassName("tmpImg")) {
            img.src = App.getImageLocation() + img.dataset.src;
        }
    }

    /**
     * Get the actual app folder location.   --- UPDATED (Dexter) 20190317
     * @returns {String} - The actuall app folder location.
     */
    static getAppLocation() {
        return (document.URL.endsWith("zh/") || document.URL.endsWith("en/")) ? "../" : "";
    }

    /**
     * Go back to the start screen.   --- UPDATED (Dexter) 20180523
     * @param {Event} e - A `click` event.
     */
    static backToStart(e) {
        App.gotoPage("startScreen");
    }

    /**
     * Creates a global unique ID through integer increment.   --- UPDATED (Dexter) 20180523
     * @returns {Number} - A new unique ID.
     */
    static createUniqueID() {
        return App.uid += 1;
    }

    /**
     * An async function which allow the `.then()` method to be taken after a screen frame.   --- UPDATED (Dexter) 20180523
     * @returns {Promise<Boolean>} - Finishes after a screen frame update. Returns `true` when the next frame is reached.
     */
    static async nextFrame() {
        return new Promise(resolve=>window.requestAnimationFrame(()=>resolve(true)));
    }

    /**
     * An async function for getting the `NeuralSimplycode` source file.   --- UPDATED (Dexter) 20180523
     * @returns {Promise<String>} - Finishes after getting and parsing the `NeuralSimplycode` sourcefile, and resolve the source file. Resolve `import NeuralSimplycode\n` in case no NeuralSimplycode embedding is preferred.
     */
    static async getNeuralSimplycode() {
        // Get the current preference on whether to embed NeuralSimplycode
        var embed = App.all.get("embedNeuralSimplycode") == 1;

        if (embed) {
            // If embed, fetch NeuralSimplycode and parse as text string. In case of failure, it will be rejected with the error.
            return fetch(App.getAppLocation() + "NeuralSimplycode.py?rand=" + Math.random()).then(e=>e.text(), e=>Promise.reject(e));
        } else {
            // If not embed, resolve immediately as the Python "import NeuralSimplycode \n" row.
            return Promise.resolve("import NeuralSimplycode\n");
        }
    }

    /**
     * Toggling whether to embed `NeuralSimplycode` in output Python codes.   --- UPDATED (Dexter) 20180613
     * @param {Event} e - A `click` event, typically from toggling `$("finalEmbedNeuralSimplycode")`.
     */
    static toggleEmbedNeuralSimplycode(e) {
        // Update the app configuration on the embedding NeuralSimplycode option.
        App.setConfig("embedNeuralSimplycode",App.all.get("embedNeuralSimplycode") == 1 ? 0 :1);

        // Update the printed NeuralSimplycode if needed.
        if (!$("codePreview").classList.contains("noDisplay")) {
            Project.toViewPython();
        }
    }

    /**
     * Control the count of children elements, which is useful in preparing a list with varied item counts.   --- UPDATED (Dexter) 20181120
     * @param {Element} forObj - The parent element.
     * @param {Number} length - The target number of children.
     * @param {Element} templateObj - The template children element that would be cloned.
     * @param {String} className - The class of children to consider.
     * @param {Function} onCreate - A function that apply on every newly created elements.
     * @param {Function} onLoop - A function to loop all finally appearing children.
     */
    static controlChildrenCount(forObj, length, templateObj, className=null, onCreate=ele=>ele, onLoop=null) {
        // Define filter function for including specific class of children only, and to exclude templateObj if it's already a children.
        var filterFtn = className ? (templateObj.id ? (ele=>(ele.classList.contains(className) && ele.id != templateObj.id)) : (ele=>ele.classList.contains(className))) : ele=>true;
        var removeIDFtn = ele=>ele.dataset.temp != "y";
        var filterEle = eles=>(className? [...eles].filter(ele=> filterFtn(ele) && removeIDFtn(ele)) : [...eles].filter(ele=>removeIDFtn(ele)));

        // Find the original filtered children.
        var oriChildren = filterEle(forObj.children);
        var oriL = oriChildren.length;

        // Add / Remove children to match the requested length.
        if (length > oriL) {
            for (let i=oriL; i<length; i++) {
                // Clone the template element and remove the id.
                var newEle = templateObj.cloneNode(true);
                newEle.removeAttribute("id");
                newEle.classList.remove("noDisplay");
                delete newEle.dataset.temp;

                // Apply actions on the newly created element and push it into the parent element.
                onCreate(newEle);
                forObj.appendChild(newEle);
            }
        } else if (length < oriL) {
            // Remove uneccessary elements.
            for (let i=length; i<oriL; i++) {
                oriChildren[i].remove();
            }
        }
        
        // Loop the finally appearing children.
        if (onLoop) filterEle(forObj.children).forEach(onLoop);
    }

    
    /**
     * For each single HTML element, apply the value onto the UI. This is typically used during the option showing of sidebar.   --- UPDATED (Dexter) 20180726
     * @param {Element} ele - An HTML element of showing the value of a property.
     * @param {(Number|String|Boolean)} toValue - The value to be set.
     */
    static applyPropVal(ele, toValue) {
        // Determine what element is this, and apply the value to show for the user
        if (ele.localName == "input") {
            ele.value = (toValue == undefined || toValue == null)? "" : toValue;
        } else if (ele.localName == "select") {
            if (toValue instanceof Array) {
                ele.selectedIndex = [...ele.getElementsByTagName("option")].findIndex(opt=>toValue.every(([key,value])=>opt.dataset[key] == value));
            } else {
                ele.selectedIndex = [...ele.getElementsByTagName("option")].findIndex(opt=>(toValue == null ? opt.dataset.val == "" : opt.dataset.val == toValue));
            }
        } else if (ele.classList.contains("checkbox")) {
            ele.classList[toValue ? "add": "remove"]("ticked");
            ele.dataset.val = toValue ? "1" : "";
        }
    }
}

/**
 * Class representing a variable initializer.   --- UPDATED (Dexter) 20181125
 */
class IVarConfigInitializer {
    /**
     * Create an initializer.   --- UPDATED (Dexter) 20181125
     * @param {String} typeName - The name of the variable initializer type.
     */
    constructor(typeName) {
        /** @type {String} - The name of the variable initializer type. */
        this._type = typeName;
    }

    /**
     * Export this @VarConfig.Initializer object into a represtable object for project saving.   --- UPDATED (Dexter) 20181126
     * @returns {Object} - JSON-stringifiable object.
     */
    exportAsJSON() {
        // For each of the key of this TrainingProfile, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>obj[k] = this[k]);
        return obj;
    }

    /**
     * Parse a previously saved object into this class of @VarConfig.Initializer object.   --- UPDATED (Dexter) 20181128
     * @param {Object<String,*>} obj - JSON object from Project file.
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the @VarConfig.Initializer Class.
        [...Object.keys(obj)].forEach(k=>{
            this[k] = obj[k];
        });
    }

    /**
     * Get the python code constructor.   --- UPDATED (Deexter) 20181129
     * @param {String} libPrefix - Python library prefix.
     * @returns {String} - A Python coded constructor.
     */
    getPythonConstructor(libPrefix) {
        return `${libPrefix}VarConfig.${this._type}(${Train.getPyParams(...[...Object.keys(this)].filter(p=>p!="_type").map(p=>[p, this[p]]))})`;
    }
}

/**
 * Class representing a variable configuration.   --- UPDATED (Dexter) 20181125
 */
class VarConfig {
    static get Initializer() {return IVarConfigInitializer; }
    static get Constant() { return VarConfigConstant; }
    static get Zeros() { return VarConfigZeros; }
    static get Ones() { return VarConfigOnes; }
    static get RandomNormal() { return VarConfigRandomNormal; }
    static get TruncatedNormal() { return VarConfigTruncatedNormal; }
    static get RandomUniform() { return VarConfigRandomUniform; }
    static get Orthogonal() { return VarConfigOrthogonal; }
    static get Identity() { return VarConfigIdentity; }
    static get GlorotNormal() { return VarConfigGlorotNormal; }
    static get GlorotUniform() { return VarConfigGlorotUniform; }
    static get HeNormal() { return VarConfigHeNormal; }
    static get HeUniform() { return VarConfigHeUniform; }
    static get LecunNormal() { return VarConfigLecunNormal; }
    static get LecunUniform() { return VarConfigLecunUniform; }

    /**
     * Create a variable initializer.   --- UPDATED (Dexter) 20190210
     * @param {VarConfig.Initializer} initializer - The initializer configuration of this variable; default as the truncated normal initializer.
     * @param {Boolean} l1Loss - Whether to take L1-loss on this variable.
     * @param {Boolean} l2Loss - Whether to take L2-loss on this variable.
     * @param {Number} l1Decay - The constant for weighting L1-loss of this variable.
     * @param {Number} l2Decay - The constant for weighting L2-loss of this variable.
     * @param {String} device - The device like CPU or GPU this training will rely on.
     */
    constructor(initializer = new VarConfig.TruncatedNormal(), l1Loss = false, l2Loss = false, l1Decay = 1, l2Decay = 1, device = null) {
        /** @type {VarConfig.Initializer} - The initializer configuration of this variable; default as the truncated normal initializer. */
        this.initializer = initializer;
        /** @type {Boolean} - Whether to take L1-loss on this variable.*/
        this.l1Loss = l1Loss;
        /** @type {Boolean} - Whether to take L2-loss on this variable.*/
        this.l2Loss = l2Loss;
        /** @type {Number} - The constant for weighting L1-loss of this variable.*/
        this.l1Decay = l1Decay;
        /** @type {Number} - The constant for weighting L2-loss of this variable.*/
        this.l2Decay = l2Decay;
        /** @type {String} - The device like CPU or GPU this training will rely on.*/
        this.device = device;
    }

    /**
     * Export this VarConfig into a represtable object for project saving.   --- UPDATED (Dexter) 20181126
     * @returns {Object} - JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this VarConfig, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>{
            // train won't be stringified because of recussive references, while toNode and fromNode are restructured to be stringifiable.
            if (k != "initializer") {
                obj[k] = this[k];
            } else {
                obj[k] = this[k].exportAsJSON();
            }
        })
        return obj;
    }
    
    /**
     * Parse a previously saved object into this class of VarConfig.   --- UPDATED (Dexter) 20181124
     * @param {Object} obj - JSON object from Project file
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the VarConfig Class.
        [...Object.keys(obj)].forEach(k=>{
            if (k != "initializer") {
                this[k] = obj[k];
            } else {
                this[k] = new VarConfig[obj[k]._type]();
                this[k].parseJSON(obj[k]);
            }
        });
    }
    
    /**
     * Compare if it's the same as another variable configuration.   --- UPDATED (Dexter) 20181129
     * @param {VarConfig} varConfig - Another variable configuration.
     * @returns {Boolean} - Whether the two configs are equal.
     */
    equals(varConfig) {
        // If it's not the same initializer, return false.
        if (!(varConfig instanceof VarConfig)) return false;
        else if (this.initializer.constructor != varConfig.initializer.constructor) return false;

        // Check all values of initializer.
        var oriInitMap = new Map(Object.entries(this.initializer));
        for (let key of oriInitMap.keys()) {
            if (oriInitMap.get(key) != varConfig.initializer[key]) return false;
        }

        // Check all values in this object config.
        var thisConfigMap = new Map(Object.entries(this));
        for (let key of thisConfigMap.keys()) {
            if (key != "initializer" && thisConfigMap.get(key) != varConfig[key]) return false;
        }

        return true;
    }

    /**
     * Get the python code constructor.   --- UPDATED (Deexter) 20181129
     * @param {String} libPrefix - Python library prefix.
     * @returns {String} - A Python coded constructor.
     */
    getPythonConstructor(libPrefix) {
        return `${libPrefix}VarConfig(initializer = ${this.initializer.getPythonConstructor(libPrefix)}, ${Train.getPyParams(...["l1Loss","l2Loss","l1Decay","l2Decay","device"].map(p=>[p, this[p]]))})`;
    }
}

/**
 * Variable initializer with constant value.   --- UPDATED (Dexter) 20181125
 */
class VarConfigConstant extends VarConfig.Initializer {
    /**
     * Create a constant variable initializer.   --- UPDATED (Dexter) 20181125
     * @param {Number} value - A constant value of this initializer.
     */
    constructor(value = 0) {
        super("Constant");
        /** @type {Number} - A constant value of this initializer. */
        this.value = value;
    }
}

/**
 * Variable initializer with constant value zero (`0`).   --- UPDATED (Dexter) 20181125
 */
class VarConfigZeros extends VarConfig.Initializer {
    /**
     * Create a zero-constant variable initializer.   --- UPDATED (Dexter) 20181125
     */
    constructor() {
        super("Zeros");
    }
}

/**
 * Variable initializer with constant value one (`1`).   --- UPDATED (Dexter) 20181125
 */
class VarConfigOnes extends VarConfig.Initializer {
    /**
     * Create a one-constant variable initializer.   --- UPDATED (Dexter) 20181125
     */
    constructor() {
        super("Ones");
    }
}

/**
 * Random value variable initializer following a normal distribution.   --- UPDATED (Dexter) 20181125
 */
class VarConfigRandomNormal extends VarConfig.Initializer {
    /**
     * Create a random variable initializer following a normal distribution.   --- UPDATED (Dexter) 20181125
     * @param {Number} mean - The mean of the normal distribution of the random varaible initializer.
     * @param {Number} stddev - The standard deviation of the normal distribution of the random varaible initializer.
     */
    constructor(mean = 0, stddev = 1) {
        super("RandomNormal");
        /** @type {Number} - The mean of the normal distribution of the random varaible initializer. */
        this.mean = mean;
        /** @type {Number} - The standard deviation of the normal distribution of the random varaible initializer. */
        this.stddev = stddev;
    }
}

/**
 * Random value variable initializer following a truncated normal distribution with no values exceeding 2 standard deviations from the mean.   --- UPDATED (Dexter) 20181125
 */
class VarConfigTruncatedNormal extends VarConfig.Initializer {
    /**
     * Create a random variable initializer following a truncated normal distribution with no values exceeding 2 standard deviations from the mean.   --- UPDATED (Dexter) 20181125
     * @param {Number} mean - The mean of the normal distribution of the random varaible initializer.
     * @param {Number|String} stddev - The standard deviation of the normal distribution of the random varaible initializer. If "auto", it will be the 1/(first dimension of weight matrix) .
     */
    constructor(mean = 0, stddev = 1) {
        super("TruncatedNormal");
        /** @type {Number} - The mean of the normal distribution of the random varaible initializer. */
        this.mean = mean;
        /** @type {Number} - The standard deviation of the normal distribution of the random varaible initializer. */
        this.stddev = stddev;
    }
}

/**
 * Random value variable initializer following a uniform distribution within a range.   --- UPDATED (Dexter) 20181125
 */
class VarConfigRandomUniform extends VarConfig.Initializer {
    /**
     * Create a random variable initializer following a uniform distribution within a range.   --- UPDATED (Dexter) 20181125
     * @param {Number} minval - The minimum possible initialized value of random varaible initializer.
     * @param {Number} maxval - The maximum possible initialized value the random varaible initializer.
     */
    constructor(minval = -1, maxval = 1) {
        super("RandomUniform");
        /** @type {Number} - The minimum possible initialized value of random varaible initializer. */
        this.minval = minval;
        /** @type {Number} - The maximum possible initialized value the random varaible initializer. */
        this.maxval = maxval;
    }
}

/**
 * Random variable initializer generating an orthogonal matrix.   --- UPDATED (Dexter) 20181125
 */
class VarConfigOrthogonal extends VarConfig.Initializer {
    /**
     * Create a random variable initializer generating an orthogonal matrix.   --- UPDATED (Dexter) 20181125
     * @param {Number} gain - The multiplicative factor applying on the orthogonal matrix.
     */
    constructor(gain = 1) {
        super("Orthogonal");
        /** @type {Number} - The multiplicative factor applying on the orthogonal matrix. */
        this.gain = gain;
    }
}

/**
 * Variable initializer generating an identity matrix.   --- UPDATED (Dexter) 20181125
 */
class VarConfigIdentity extends VarConfig.Initializer {
    /**
     * Create a variable initializer generating an identity matrix.   --- UPDATED (Dexter) 20181125
     * @param {Number} gain - The multiplicative factor applying on the identity matrix.
     */
    constructor(gain = 1) {
        super("Identity");
        /** @type {Number} - The multiplicative factor applying on the identity matrix. */
        this.gain = gain;
    }
}

/**
 * A glorot normal initializer.   --- UPDATED (Dexter) 20181125
 */
class VarConfigGlorotNormal extends VarConfig.Initializer {
    /**
     * Create a glorot normal initializer.   --- UPDATED (Dexter) 20181125
     */
    constructor() {
        super("GlorotNormal");
    }
}

/**
 * A glorot uniform initializer.   --- UPDATED (Dexter) 20181125
 */
class VarConfigGlorotUniform extends VarConfig.Initializer {
    /**
     * Create a glorot uniform initializer.   --- UPDATED (Dexter) 20181125
     */
    constructor() {
        super("GlorotUniform");
    }
}

/**
 * A he normal initializer.   --- UPDATED (Dexter) 20181125
 */
class VarConfigHeNormal extends VarConfig.Initializer {
    /**
     * Create a he normal initializer.   --- UPDATED (Dexter) 20181125
     */
    constructor() {
        super("HeNormal");
    }
}

/**
 * A he uniform initializer.   --- UPDATED (Dexter) 20181125
 */
class VarConfigHeUniform extends VarConfig.Initializer {
    /**
     * Create a he uniform initializer.   --- UPDATED (Dexter) 20181125
     */
    constructor() {
        super("HeUniform");
    }
}

/**
 * A LeCun normal initializer.   --- UPDATED (Dexter) 20181125
 */
class VarConfigLecunNormal extends VarConfig.Initializer {
    /**
     * Create a LeCun normal initializer.   --- UPDATED (Dexter) 20181125
     */
    constructor() {
        super("LecunNormal");
    }
}

/**
 * A LeCun uniform initializer.   --- UPDATED (Dexter) 20181125
 */
class VarConfigLecunUniform extends VarConfig.Initializer {
    /**
     * Create a LeCun uniform initializer.   --- UPDATED (Dexter) 20181125
     */
    constructor() {
        super("LecunUniform");
    }
}


/**
 * Class representing a linear transformation configuration on a given tensor, controlling the behavior of the Wx+b operation.   --- UPDATED (Dexter) 20181125
 */
class LinearTransformConfig {
    /**
     * Create a linear transform option using customized variable configurations. By default, an identity transformation is given.   --- UDPATED (Dexter) 20181125
     * @param {VarConfig} weightConfig - The weight configuration. If `null`, no weight will be given, i.e. identity transformation.
     * @param {VarConfig} biasConfig - The bias configuration. If `null`, no bias will be given.
     */
    constructor(weightConfig = null, biasConfig = null) {
        /** @type {VarConfig} - The weight configuration. If `null`, no weight will be given, i.e. identity transformation. */
        this.weightConfig = weightConfig;
        /** @type {VarConfig} - The bias configuration. If `null`, no bias will be given. */
        this.biasConfig = biasConfig;
    }

    /**
     * Export this @LinearTransformConfig object into a represtable object for project saving.   --- UPDATED (Dexter) 20181126
     * @returns {Object} - JSON-stringifiable object.
     */
    exportAsJSON() {
        return {
            weightConfig: this.weightConfig == null ? null : this.weightConfig.exportAsJSON(), 
            biasConfig: this.biasConfig == null ? null : this.biasConfig.exportAsJSON()
        };
    }

    /**
     * Parse a previously saved object into this @LinearTransformConfig object.   --- UPDATED (Dexter) 20181128
     * @param {Object} obj - JSON object from Project file.
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the LinearTransformConfig Class.
        [...Object.keys(obj)].forEach(k=>{
            if (obj[k] == null) this[k] = null;
            else {
                if (!this[k]) this[k] = new VarConfig();
                this[k].parseJSON(obj[k]);
            }
        });
    }

    /**
     * Get the python code constructor.   --- UPDATED (Deexter) 20181129
     * @param {String} libPrefix - Python library prefix.
     * @param {Array<VarConfig>} varConfigsCache - Cached list of var config.
     * @param {Arrray<String>} allStr - Python writing lines.
     * @returns {String} - A Python-coded constructor.
     */
    getPythonConstructor(libPrefix, varConfigsCache, allStr) {
        var params = [...Object.keys(this)].map(k=>{
            // Check if this var config exists.
            if (this[k] !== null) {
                // Look for the incoming config.
                var prevVarConfigIdx = varConfigsCache.findIndex(varConfig=>varConfig.equals(this[k]));
                if (prevVarConfigIdx == -1) {
                    // Update the index of the var config to reference.
                    prevVarConfigIdx = varConfigsCache.length;

                    // Cache the incoming config.
                    varConfigsCache.push(this[k]);
                    
                    // Write the config setup.
                    allStr.push(`varConfig${prevVarConfigIdx} = ${this[k].getPythonConstructor(libPrefix)}\n`);
                }
                return `${k} = varConfig${prevVarConfigIdx}`;
            } else {
                return `${k} = None`;
            }
        }).join(", ");
        return `${libPrefix}LinearTransformConfig(${params})`;
    }

    /**
     * Create a basic linear transform config, with truncated normal distributed initialized weight and a constant initialized bias.   --- UPDATED (Dexter) 20181125
     * @param {Number} weightAvg - The mean of the normal distributed weight. If None, no weight will be given, i.e. identity transformation.
     * @param {(Number|String)} weightStdDev - The standard deviation of the normal distributed weight. If "auto", it will be 1/(last dimension of incoming tensor).
     * @param {Boolean} weightL1Loss - Whether to take L1-loss on this variable.
     * @param {Boolean} weightL2Loss - Whether to take L2-loss on this variable.
     * @param {Number} weightL1Decay - The constant for weighting L1-loss of this variable.
     * @param {Number} weightL2Decay - The constant for weighting L2-loss of this variable.
     * @param {Number} biasInitial - Constant initial value of biases. If None, no bias will be given.
     * @returns {LinearTransformConfig} - A @LinearTransformConfig object from the given basic configuration settings.
     */
    static createBasicConfig(weightAvg = 0.0, weightStdDev = 0.04, weightL1Loss = false, weightL2Loss = true,
                            weightL1Decay = 1, weightL2Decay = 0.004, biasInitial = 0.001) {
        return new LinearTransformConfig(weightAvg == null ? null : new VarConfig(new VarConfig.TruncatedNormal(weightAvg, weightStdDev),
                                                                                    weightL1Loss, weightL2Loss, weightL1Decay, weightL2Decay),
                                        biasInitial == null ? null : new VarConfig(new VarConfig.Constant(biasInitial)));
    }

    /**
     * Get the shape of layer-specific-processed tensor of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181126
     * @param {Array<(Number|String)>} preprocessedIncomingShape - A shape array of pre-proccessed incoming shape.
     * @param {Number} toUnit - The number of outcoming unit (channel) of the last dimension of the output tensor.
     * @param {Number} axis - The axis of matrix multiplication.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @returns {Array<Number>} - Return the shape of the tensor after layer-specific operation.
     */
    static processOperationShape(preprocessedIncomingShape, toUnit = 1, axis = -1, configChanges = {}) {
        // Can't build if incoming tensor has dimension lower than the required axis.
        if (axis >= preprocessedIncomingShape.length) return null;

        // Return the transformed operation.
        return [...preprocessedIncomingShape.slice(0,axis), toUnit];
    } 
}


/**
 * Class representing a trial result object, typically returned in validation on different changes in different class instances.   --- UPDATED (Dexter) 20190129
 */
class TrialResult {
    /**
     * Create a trial result object.   --- UPDATED (Dexter) 20190129
     * @param {Boolean} result 
     * @param {String} error 
     */
    constructor(result, error="") {
        this.result = result;
        this.error = error;
    }

    /**
     * Return a `Promise` object for whether the trial is success.   --- UPDATED (Dexter) 20190129
     * @returns {Promise<(Boolean|String)>} - A `Promise` object that gives the feedback of the trial.
     */
    asPromise() {
        return new Promise((resolve, reject)=>{
            if (this.result) resolve(true);
            else reject(this.error);
        });
    }
}

/** Class including types of preprocessing nodes and related preprocessing utilities.   --- UPDATED (Dexter) 20190201 */
class DataPreprocessing {
    /** Enumeration representing the instance / sub-class type of a @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190130 */
    static get InstanceClassEnum() {
        return new Enum({
            /** @type {Number} - Abstract class representing a data preprocessing node on a data source (@Source.Config object). */
            Node: 0,

            /** @type {Number} - Class representing a column configuration, i.e. preprocessing node of on a table-like source (like @Source.Table object). */
            ColumnsNode: 1,

            /** @type {Number} - Class representing a image configuration, i.e. preprocessing node of on a image-like source (like @Source.Image object). */
            ImageNode: 2
        });
    }

    /**
     * Parse a previously saved object into a new @DataPreprocessing.Node object. This will auto-determine the sub-class of the object, and pass the JSON object to the inner method to continue to parse.   --- UPDATED (Dexter) 20190131
     * @param {*} obj - JSON object from Project file.
     * @returns {DataPreprocessing.Node} - A @DataPreprocessing.Node object.
     */
    static parseJSON(obj) {
        // Parse this DataPreprocessing.Node object.
        var dataPreprocessingNode = new (DataPreprocessing[DataPreprocessing.InstanceClassEnum.getName(obj._instanceClass)])();
        dataPreprocessingNode.parseJSON(obj);
        return dataPreprocessingNode;
    }

    static get Node() { return DataPreprocessingNode; }
    static get ColumnsNode() { return ColConfig; }
    static get ImageNode() { return ImagePreprocessingNode; }

    static get Transformation() { return DataTransformation; }
}

/**
 * Class representing a data preprocessing node on a data source (@Source.Config object).   --- UPDATED (Dexter) 20190129
 */
class DataPreprocessingNode {
    /**
     * Creates a column configuration.   --- UPDATED (Dexter) 20190129
     * @param {Number} instanceClass - The instnace class, as defined in @DataPreprocessing.InstanceClassEnum .
     * @param {String} source   - The source of this @DataPreprocessing.Node, e.g. `null` if this is the root source; another key of @DataPreprocessing.Node if it's referencing to another.
     * @param {String} dtype    - The data type of the data output. If `null`, it will be automatically determined during data pre-processing, and converted to `tf.float32` if it's using as an input of data model.
     * @param {Array<String>} defaultHeader - A list of strings specifying the default header names of the data.
     */
    constructor(instanceClass=null, source=null, dtype=null, defaultHeader=null) {
        /** @type {Number} - The instnace class, as defined in @DataPreprocessing.InstanceClassEnum . */
        this._instanceClass = instanceClass; 
        /** @type {String} - The source of this @DataPreprocessing.Node, e.g. `null` if this is the root source; another key of @DataPreprocessing.Node if it's referencing to another. */
        this.source = source; 
        /** @type {String} - The data type of the data output. */
        this.dtype = dtype;
        /** @type {Number} - The topological order of this @DataPreprocessing.Node in data preprocessing. */
        this._order = 0;
        /** @type {Array<Number>} - The shape of each item of the data output, so the batch dimension is not included. */
        this._shape = null;
        /** @type {Array<String>} - A list of strings specifying the default header names of the data. */
        this.defaultHeader = defaultHeader;
        /** @type {Array<DataPreprocessing.Transformation.Config>} - An array of transformation info.*/
        this.transformations = [];

        /** @type {Array<(Number|String)>} - The receiving data shape from previous node. */
        this._dataShape = null;
        /** @type {TrainSource} - The @Source.Config where this @DataPreprocessing.ColumnsNode object is attached to. */
        this._trainSource = null;
        /** @type {String} - The column config key of this @DataPreprocessing.ColumnsNode object. */
        this._key = null;
        /** @type {Element} - The HTML element as shown on the model graph. */
        this.ele = null;
    }

    /**
     * Abstract method for getting whether all data is number.   --- UPDATED (Dexter) 20190320
     * @returns {Boolean} - Whether all data is number.
     */
    isNumber() { }
    
    /**
     * Export this @DataPreprocessing.Node object into a represtable object for project saving.   --- UPDATED (Dexter) 20190131
     * @returns {Object} JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this DataPreprocessing.Node object, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>{
            if (!["transformations","_trainSource"].includes(k)) {
                obj[k] = this[k];
            } else if (k == "transformations") {
                obj[k] = this.transformations.map(tx=>tx.exportAsJSON());
            }
        });
        return obj;
    }

    /**
     * Parse a previously saved object into this @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190131
     * @param {Object} obj - JSON object from Project file.
     */
    parseJSON(obj) {
        // All values will be parsed directly except those of specific data structure.
        [...Object.keys(obj)].forEach(k=>{
            if (!["transformations"].includes(k)) {
                this[k] = obj[k];
            } else if (k == "transformations") {
                // If there is .instanceClass property, use DataPreprocessing.Transformation to parse; otherwise, it's a legacy normal object.
                this[k] = obj[k].map(tx=> DataPreprocessing.Transformation.parseJSON(tx));
            }
        });
    }

    /**
     * The topological order of this @DataPreprocessing.Node data preprocessing.   --- UPDATED (Dexter) 20190124
     * @returns {Number} 
     */
    get order() {
        return this._order;
    }

    /**
     * The @Source.Config where this @DataPreprocessing.Node object is attached to.   --- UPDATED (Dexter) 20190124
     * @returns {TrainSource} 
     */
    get trainSource() {
        return this._trainSource;
    }

    /**
     * The column config key of this @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190124
     * @returns {String} 
     */
    get key() {
        return this._key;
    }

    /**
     * The receiving data shape from referencing @DataPreprocessing.Node node or root source of @Source.Config object.   --- UPDATED (Dexter) 20190124
     * @returns {Array<(Number|String)>}
     */
    get dataShape() {
        return this._dataShape;
    }

    /**
     * The output item shape of this @DataPreprocessing.Node node.   --- UPDATED (Dexter) 20190124
     * @returns {Array<(Number|String)>}
     */
    get itemShape() {
        return this._shape;
    }

    /**
     * The instance class of this @DataPreprocessing.Node node, as defined in @DataPreprocessing.InstanceClassEnum.   --- UPDATED (Dexter) 20190131
     * @returns {Number}
     */
    get instanceClass() {
        return this._instanceClass;
    }

    /**
     * Attach this @DataPreprocessing.Node object to a @Source.Config object.   --- UPDATED (Dexter) 20190130
     * @param {TrainSource} trainSource - The @Source.Config object to attach to.
     * @param {String} key - The node key to identify this @DataPreprocessing.Node object.
     */
    attachToSource(trainSource, key) {
        this._trainSource = trainSource;
        this._key = key;

        this.refreshDataShape();
    }
    
    /**
     * Copy the configuration of this @DataPreprocessing.Node object to another @DataPreprocessing.Node object   --- UPDATED (Dexter) 20190203
     * @param {DataPreprocessing.Node} node - Another @DataPreprocessing.Node object.
     */
    copy(node) {
        node.dtype = this.dtype;
        node.defaultHeader = this.defaultHeader;
        node.transformations = this.transformations.map(tx => tx.copy());
        node.setInputShape(this.dataShape);
        node.source = this.source;
        node.updateOrder();
    }

    /**
     * Update the topological order of the data preprocessing node.   --- UPDATED (Dexter) 20190203
     */
    updateOrder() {
        if (this.source == 0 || this.trainSource == null) {
            this._order = 0;
        } else {
            this._order = this.trainSource.colConfigs.get(this.source).order + 1;
        }
    }

    /**
     * Get the shape of the output of this @DataPreprocessing.Node object, including the batch dimension.   --- UPDATED (Dexter) 20190130
     * @param {Boolean} refresh - Whether to refresh the shape from root data.
     * @returns {Array<(Number|String)>} - The shape of the output of this @DataPreprocessing.Node object. This returns a new Array instance instead a pointer to the original shape.
     */
    getShape(refresh = false) {
        // If refresh is needed, compute the new shapes from the source of this DataPreprocessing.Node object.
        if (refresh) this.refreshDataShape();

        // The batch dimension is always None for flexible training, conresponding to the placeholder Tensor in NeuralSimplycode
        if (!this._shape) this.refreshItemShape();

        return ["None", ...this._shape];
    }

    /**
     * Get the shape of the input of this @DataPreprocessing.Node object, including the batch dimension.   --- UPDATED (Dexter) 20190130
     * @param {Boolean} refresh - Whether to refresh the shape from root data.
     * @returns {Array<(Number|String)>} - The shape of the input of this @DataPreprocessing.ColumnsNode object. This returns a new Array instance instead a pointer to the original shape.
     */
    getInputShape(refresh = false) {
        // If refresh is needed, compute the new shapes from the source of this DataPreprocessing.Node object.
        if (refresh) this.refreshDataShape();

        // The batch dimension is always None for flexible training, conresponding to the placeholder Tensor in NeuralSimplycode
        return [...this._dataShape];  
    }


    /**
     * Set the shape of the output of this @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190128
     * @param {Array<(Number|String)>} shape - The new item shape of the output of this @DataPreprocessing.Node object.
     */
    setItemShape(shape) {
        this._shape = [...shape];
    }

    /**
     * Set the input shape of the output of this @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190130
     * @param {Array<(Number|String)>} shape - The new shape of the output of this @DataPreprocessing.Node object.
     */
    setInputShape(shape) {
        this._dataShape = [...shape];
        this.refreshItemShape();
    }

    /**
     * Refresh the item shape, typically after updates of datashape.   --- UPDATED (Dexter) 20190130
     */
    refreshItemShape() {
        this.setItemShape(this.dataShape.slice(1));
    }

    /**
     * Refresh the shape of this @DataPreprocessing.Node object, based on updates of previous preprocessing shapes.   --- UPDATED (Dexter) 20190130
     */
    refreshDataShape() {
        if (this.trainSource) this.setInputShape(this.trainSource.getColShape(this.source, this.key, true));
    }

    /**
     * Show the layer name on an element.   --- UPDATED (Dexter)  20190129
     * @param {Element} ele - HTML element where the layer name to show.
     */
    showNameOnEle(ele) {
        const dppKey = this._key;
        if (["input", "target"].includes(dppKey)) {
            ele.innerText = App.getTxtFromLang(dppKey+"DppKey");
            ele.dataset.lt = dppKey+"DppKey";
        } else {
            ele.innerText = dppKey;
            ele.dataset.lt = dppKey;
        }
    }

    /**
     * Get the source ID and column config key.   --- UPDATED (Dexter) 20180625
     * @returns {Array[Number, String]} - A pair of source ID and colum config key.
     */
    getIDAndKey() {
        return [this.trainSource.train.sources.indexOf(this._trainSource), this._key];
    }

    /**
     * Get a list of connectable nodes.   --- UPDATED (Dexter) 20181217
     * @param {String} mode   - Connection mode name: "connect"
     * @returns {(ModelNode.Layer.Config|DataPreprocessing.Node)[]} - A list of connectable nodes.
     */
    getConnectableNodes() {
        return [...this.trainSource.train.layerProfiles.values()];
    }

    /**
     * Enforce a data type conversion when getting the output of this column config.   --- UPDATED (Dexter) 20190128
     * @param {String} dtype - The TensorFlow data type of this @DataPreprocessing.ColumnsNode object.
     */
    asType(dtype = "tf.float32") {
        this.dtype = dtype;
    }
}

/**
 * Class representing a column configuration, i.e. preprocessing node of on a table-like source (like @Source.Table object).   --- UPDATED (Dexter) 20180522
 */
class ColConfig extends DataPreprocessing.Node {
    /**
     * Creates a column configuration.   --- UPDATED (Dexter) 20190124
     * @param {String} source - The source of this @DataPreprocessing.ColumnsNode, e.g. `null` if this is the root source; another key of @DataPreprocessing.ColumnsNode if it's referencing to another.
     * @param {String} sourceCol - An @IndexRange parsable string specifying the column selection from the source.
     * @param {String} dtype - The data type of the data output. If `null`, it will be automatically determined during data pre-processing, and converted to `tf.float32` if it's using as an input of data model.
     * @param {Number} order - Feedforward (Topological) order of aligning all @ConConfig in a data source.
     */
    constructor(source=null, sourceCol="None:None", dtype=null, order=0) {
        super(DataPreprocessing.InstanceClassEnum.ColumnsNode, source, dtype);
        /** @type {String} - The data type of the data output. */
        this.dtype = dtype;
        /** @type {String} - The source of this @DataPreprocessing.ColumnsNode, e.g. `null` if this is the root source; another key of @DataPreprocessing.ColumnsNode if it's referencing to another. */
        this.source = source; 
        /** @type {String} - An @IndexRange parsable string specifying the column selection from the source. */
        this.sourceCol = sourceCol;
        /** @type {Map<Number,Function<<Array<Number>>,Array<Number>>>} - A data transformation `Map` object, using column index as key and column data transformation function as value.*/
        this.transformTo = new Map();
        /** @type {Map<Number,Object>} - A circlar info `Map` object, using column index as key and circular data definition as value. */
        this.circularInfo = new Map();
        /** @type {Map<Number,Set<String>>} - The column selections on which columns to convert to one hot encoding. */
        this.oneHotColumns = new Map();
        /** @type {Array<Object>} - The transformation definition information in action order. */
        this.transformations = [];
        /** @type {Array<Object>} - The cicular definition information in action order. */
        this.circular = [];
        /** @type {Number} - The topological order of this @DataPreprocessing.ColumnsNode in data preprocessing. */
        this._order = order;
    }

    /**
     * Export this @DataPreprocessing.ColumnsNode object into a represtable object for project saving.   --- UPDATED (Dexter) 20190131
     * @returns {Object} JSON-stringifiable object/
     */
    exportAsJSON() {
        // For each of the key of this ColConfig, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>{
            if (!["transformations","transformTo","circularInfo","_trainSource","_key","data","oneHotColumns"].includes(k))
                obj[k] = this[k];
            else if (k == "oneHotColumns") {
                obj[k] = [...this[k].entries()].map(ele=>[ele[0], [...ele[1]]]);
            } else if (k == "transformations") {
                obj[k] = this.transformations instanceof DataPreprocessing.Transformation.Config ? this.transformations.map(tx=>tx.exportAsJSON()) : this[k];
            }
        })
        return obj;
    }

    /**
     * Parse a previously saved object into this @DataPreprocessing.ColumnsNode object.   --- UPDATED (Dexter) 20190131
     * @param {Object} obj - JSON object from Project file.
     */
    parseJSON(obj) {
        // All values will be parsed directly, except those of specific data structure.
        [...Object.keys(obj)].forEach(k=>{
            if (!["transformations","oneHotColumns", "_instanceClass"].includes(k)) {
                this[k] = obj[k];
            } else if (k == "oneHotColumns") {
                // One Hot Columns is a Map object with index key and categorical value set.
                this[k] = new Map(obj[k].map(ele=>[ele[0], new Set(ele[1])]));
            } else if (k == "transformations") {
                // If there is .instanceClass property, use DataPreprocessing.Transformation to parse; otherwise, it's a legacy normal object.
                this[k] = obj[k].map(tx=> tx.instanceClass ? DataPreprocessing.Transformation.parseJSON(tx) : tx);
            }
        });
    }

    /**
     * Copy the configuration of this @DataPreprocessing.Node object to another @DataPreprocessing.ColumnsNode object   --- UPDATED (Dexter) 20190203
     * @param {DataPreprocessing.ColumnsNode} node - Another @DataPreprocessing.ColumnsNode object.
     */
    copy(node) {
        node.dtype = this.dtype;
        node.defaultHeader = this.defaultHeader;
        node.transformTo = new Map([...this.transformTo.entries()].map(([idx,ftn]) => [idx, ftn]));
        node.circularInfo = new Map([...this.circularInfo.entries()].map(([idx,cirObj]) => [idx, Object.assign({}, cirObj)]))
        node.oneHotColumns = new Map([...this.oneHotColumns.entries()].map(([idx,oneHotSet])=>[idx, new Set([...oneHotSet])]))
        node.transformations = this.transformations.map(tx=>Object.assign({}, tx));
        node.circular = this.circular.map(cir=>Object.assign({}, cir));
        node.source = this.source;
        node.sourceCol = this.sourceCol;
        node.setInputShape(this.dataShape);
        node.updateOrder();
    }

    /**
     * Determine if this @DataPreprocessing.ColumnsNode object has data derivable.   --- UPDATED (Dexter) 20190129
     * @returns {Boolean} - Whether this @DataPreprocessing.ColumnsNode object has data derivable.
     */
    hasData() {
        return (this.trainSource instanceof TableSource && this.trainSource.hasColData(this.key));
    }

    /**
     * Refresh the item shape, typically after updates of datashape.   --- UPDATED (Dexter) 20190130
     */
    refreshItemShape() {
        // Get the shape after column selection.
        var selShape = [TableSource.getColList(this.getInputShape()[1], this.sourceCol).length];

        // Update the shape if there is onehot columns added.
        if (this.oneHotColumns.size) {
            selShape[0] += [...this.oneHotColumns.values()].map(oneHotSet=>Math.max(1,oneHotSet.size)).reduce((a,b)=>a+b, 0) - this.oneHotColumns.size;
        }

        // Set the item shape.
        this.setItemShape([...selShape]);
    }

    /**
     * Get the root data of this @DataPreprocessing.ColumnsNode object in case this belongs to a @Source.Table object.   --- UPDATED (Dexter) 20190129
     * @returns {Array<Array<Number|String>>} - The root data.
     */
    getRootData() {
        if (this.trainSource instanceof TableSource) 
            return this.trainSource.getRootData(this.key);
        else
            return null;
    }

    /**
     * Get whether all data is number.   --- UPDATED (Dexter) 20190320
     * @param {Boolean} peek - Wether to determine using part of the data instead of the entire dataset.
     * @returns {Boolean} - Whether all data is number.
     */
    isNumber(peek = false) {
        var data = peek ? this.trainSource.getColData(this.key) : this.trainSource.getColData(this.key, undefined, 0, 30);
        return !data.some(row=>row.some(val=>isNaN(Number(val))));
    }

    /**
     * Enumeration representing the step of data preprocessing within a @DataPreprocessing.ColumnsNode object.   --- UPDATED (Dexter) 20190129
     * @returns {Enum}
     */
    static get StepEnum() {
        return new Enum({
            /** @type {Number} - The initial data received from previous root data or @DataPreprocessing.ColumnsNode object. */
            Input: 0,

            /** @type {Number} - Data just after transformations. */
            Transformed: 1,

            /** @type {Number} - Data just after circular data definitions. */
            CircularDataDefined: 2,

            /** @type {Number} - Data just after one-hot encoding column expansion. Also as the output of the data preproccessing. */
            Output: 3
        });
    }
}

/**
 * Class representing a image preprocessing node, i.e. preprocessing node of on a image-like source (like @Source.Image object).   --- UPDATED (Dexter) 20190130
 */
class ImagePreprocessingNode extends DataPreprocessing.Node {
    /**
     * Creates a image preprocessing node.   --- UPDATED (Dexter) 20190129
     * @param {String} dtype    - The data type of the data output. If `null`, it will be automatically determined during data pre-processing, and converted to `tf.float32` if it's using as an input of data model.
     * @param {Array<String>} defaultHeader - A list of strings specifying the default header names of the data.
     */
    constructor(dtype=null, defaultHeader=null) {
        super(DataPreprocessing.InstanceClassEnum.ImageNode, null, dtype, defaultHeader);
    }

    /**
     * Get whether all data is number.   --- UPDATED (Dexter) 20190320
     * @returns {Boolean} - Whether all data is number.
     */
    isNumber() {
        return true;
    }

    /**
     * Refresh the item shape, typically after updates of datashape.   --- UPDATED (Dexter) 20190130
     */
    refreshItemShape() {
        // Get the shape from the node input.
        var selShape = this.getInputShape().slice(1);

        // Update the shape if there is transformation - crop, applied.
        var filterTxs = this.transformations.filter(tx => tx instanceof DataPreprocessing.Transformation.Image.Crop);
        if (filterTxs.length) {
            selShape[0] = filterTxs[filterTxs.length - 1].height;
            selShape[1] = filterTxs[filterTxs.length - 1].width;
        }

        // Set the item shape.
        this.setItemShape([...selShape]);
    }

}

/** Sub-class containing methods and instance classes on transformation configurations on columns from a @DataPreprocessing.Node object.   --- RESERVED --- UPDATED (Dexter) 20190130 */
class DataTransformation {
    /**
     * Parse a previously saved object into a new @DataPreprocessing.Transformation.Config object. This will auto-determine the sub-class of the object, and pass the JSON object to the inner method to continue to parse.   --- UPDATED (Dexter) 20190131
     * @param {*} obj - JSON object from Project file.
     * @returns {DataPreprocessing.Transformation.Config} - A @DataPreprocessing.Transformation.Config object.
     */
    static parseJSON(obj) {
        // Parse this DataPreprocessing.Transformation.Config object. If there is instanceClass attribute, parse the JSON object. Otherwise, it's a legacy ColConfig object.
        if (obj._instanceClass) {
            var instanceClass = DataPreprocessing.Transformation[DataPreprocessing.Transformation.InstanceClassEnum.getName(obj._instanceClass)];
            var dataTransformationConfig = new (instanceClass[instanceClass.Types.getName(obj._method)])();
            dataTransformationConfig.parseJSON(obj);
            return dataTransformationConfig;
        } else {
            return obj;
        }
    }

    /** Enumeration representing the instance / sub-class type of a @DataPreprocessing.Transformation.Config object.   --- UPDATED (Dexter) 20190130 */
    static get InstanceClassEnum() {
        return new Enum({
            /** @type {Number} - The subclass of @DataPreprocessing.Transformation.Columns object */
            Columns: 1,

            /** @type {Number} - The subclass of @DataPreprocessing.Transformation.Image object */
            Image: 2
        });
    }

    static get Config() { return DataTransformationConfig; }
    static get Columns() { return ColumnsTransformation; }
    static get Image() { return ImageTransformation; }
}

/** Class representing a transformation configuration on data preprocessing.   --- UPDATED (Dexter) 20190130 */
class DataTransformationConfig {
    /**
     * Create a configruation for data transformation in data preprocessing.   --- UPDATED (Dexter) 20190130
     * @param {Number} instanceClass - The instance class, as defined in @DataPreprocessing.Transformation.InstanceClassEnum .
     * @param {Number} method - The method type of transformation.
     */
    constructor(instanceClass, method) {
        this._instanceClass = instanceClass;
        this._method = method;
    }

    /**
     * The enumeration value for the instance class of this @DataPreprocessing.Transformation.Config node.   --- UPDATED (Dexter) 20190131
     * @returns {Number}
     */
    get instanceClass() {
        return this._instanceClass;
    }

    /**
     * The enumeration value for the transformation method type of this @DataPreprocessing.Transformation.Confign node.   --- UPDATED (Dexter) 20190131
     * @returns {Number}
     */
    get method() {
        return this._method;
    }

    /**
     * Abstract method for copying a new object of this inastance.   --- UPDATED (Dexter) 20190203
     */
    copy() {}

    /**
     * Export this @DataPreprocessing.Transformation.Config object into a represtable object for project saving.   --- UPDATED (Dexter) 20190131
     * @returns {Object} JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this TrainingProfile, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>obj[k] = this[k]);
        return obj;
    }

    /**
     * Parse a previously saved object into this @DataPreprocessing.Transformation.Config object.   --- UPDATED (Dexter) 20190202
     * @param {Object} obj - JSON object from Project file.
     */
    parseJSON(obj) {
        // All values will be parsed directly,except the class identification, which has been set in the constructor.
        [...Object.keys(obj)].forEach(k=>{
            if (!["_instanceClass", "_method"].includes(k))
                this[k] = obj[k];
        });
    }

    /**
     * Get the Python constructor parameter string of this @DataPreprocessing.Transformation.Config object.   --- UPDATED (Dexter) 20190131
     * @returns {String} - The Python constructor parameter string.
     */
    getPythonParamStr() {
        return "";
    }

    /**
     * Get the Python constructor full string of this @DataPreprocessing.Transformation.Config object.   --- UPDATED (Dexter) 20190131
     * @param {String} libPrefix - Python library prefix.
     * @returns {String} - The Python constructor parameter string.
     */
    getPythonConstructor(libPrefix) {
        const txType = DataPreprocessing.Transformation.InstanceClassEnum.getName(this.instanceClass);
        return `${libPrefix}DataPreprocessing.Transformation.${txType}.${DataPreprocessing.Transformation[txType].Types.getName(this.method)}(${this.getPythonParamStr()})`;
    }
}

/** Sub-class containing methods and instance classes on transformation configurations on columns from a @DataPreprocessing.ColumnsNode object.   --- RESERVED --- UPDATED (Dexter) 20190130 */
class ColumnsTransformation {
    /** Enumeration representing the transformation method type of a @DataPreprocessing.Transformation.Columns.Config object.   --- RESERVED --- UPDATED (Dexter) 20190131 */
    static get Types() {
        return new Enum({
            Normalize: 1,
            Log: 2,
            Exponential: 3,
            Classify: 4,
            Power: 5,
            MissingData: 6
        });
    }

    /**
     * Get the transformation function from a specific transformation method.   --- RESERVED --- UPDATED (Dexter) 20190131
     * @param {Number} method -  The requested method type of transformation, as defined in @DataPreprocessing.Transformation.Columns.Types .
     * @return {Function<<Array<Number>>,Array<Number>>} - A transformation function for transforming a single column of data, i.e. with size `["None"]`.
     */
    static getFunctions(method) {
    }

    /**
     * Get the reversed transformation function from a specific transformation method, typically used in recovering actual predictions from model outputs.   --- RESERVED --- UPDATED (Dexter) 20190131
     * @param {Number} method - The requested method type of transformation, as defined in @DataPreprocessing.Transformation.Columns.Types .
     * @return {Function<<Array<Number>>,Array<Number>>} - A transformation function for transforming a single column of data, i.e. with size `["None"]`.
     */
    static getReversedFunctions(method) {
    }

    static get Config() { return ColumnsTransformationConfig; }
}

/** Sub-class representing a transformation configuration on columns preprocessing for @Source.Table objects.   --- RESERVED --- UPDATED (Dexter) 20190130 */
class ColumnsTransformationConfig extends DataPreprocessing.Transformation.Config {
    /**
     * Create a configruation for data transformation in columns preprocessing for @Source.Table objects.   --- RESERVED --- UPDATED (Dexter) 20190130
     * @param {Number} method - The method type of transformation, as defined in @DataPreprocessing.Transformation.Columns.Types .
     */
    constructor(method) {
        super(DataPreprocessing.Transformation.InstanceClassEnum.Columns, method);
    }
}

/** Sub-class containing methods and instance classes on transformation configurations on images from a @DataPreprocessing.ImageNode object.   --- UPDATED (Dexter) 20190131 */
class ImageTransformation {
    /**
     *  Enumeration representing the transformation method type of a @DataPreprocessing.Transformation.Image.Config object.   --- RESERVED --- UPDATED (Dexter) 20190131
     */
    static get Types() {
        return new Enum({
            /** @type {Number} Crop the input source image into a specific size. */
            Crop: 1,
            Flip: 2,
            Rotate: 3,
            
            Hue: 4,
            Contrast: 5,
            Saturation: 6,
            Brightness: 7,

            Normalize: 8,
            ToGrayscale: 9,
            ToRGB: 10
        });
    }

    static get Config() { return ImageTransformationConfig; }
    static get Crop() { return ImageTransformationConfigCrop; }
}

/** Sub-class representing an image transformation configuration on columns preprocessing for @Source.Image objects.   --- UPDATED (Dexter) 20190131 */
class ImageTransformationConfig extends DataPreprocessing.Transformation.Config {
    /**
     * Create a configruation for data transformation in columns preprocessing for @Source.Image objects.   --- RESERVED --- UPDATED (Dexter) 20190131
     * @param {Number} method - The method type of transformation, as defined in @DataPreprocessing.Transformation.Image.Types .
     */
    constructor(method) {
        super(DataPreprocessing.Transformation.InstanceClassEnum.Image, method);
    }
}

/** Sub-class representing an image transformation configuration for random cropping the size.   --- UPDATED (Dexter) 20190131 */
class ImageTransformationConfigCrop extends DataPreprocessing.Transformation.Image.Config {
    /**
     * Create an image transformation configuration for random cropping the size.   --- UPDATED (Dexter) 20190131
     * @param {Number} width - The cropped width in pixel.
     * @param {Number} height - The cropped height in pixel.
     */
    constructor(width, height) {
        super(DataPreprocessing.Transformation.Image.Types.Crop);
        this.width = width;
        this.height = height;
    }

    /**
     * Get the Python constructor parameter string of this @DataPreprocessing.Transformation.Image.Crop object.   --- UPDATED (Dexter) 20190131
     * @returns {String} - The Python constructor parameter string.
     */
    getPythonParamStr() {
        return `${this.width}, ${this.height}`;
    }

    /**
     * Copy a new object of this inastance.   --- UPDATED (Dexter) 20190203
     * @returns {DataPreprocessing.Transformation.Image.Crop} - The copied object.
     */
    copy() {
        var newObj = new DataPreprocessing.Transformation.Image.Crop();
        newObj.width = this.width;
        newObj.height = this.height;
        return newObj;
    }
}

/** Module containing classes regarding on data sources.   --- UPDATED (Dexter) 20190220 */
class Source {
    /** Enumeration representing the type of a @Source.Config object.   --- UPDATED (Dexter) 20190220 */
    static get Types() {
        return new Enum({
            /** @type {Number} - Abstract class representing a data source.  (Ref: @Source.Config). */
            Config: 0,
            /** @type {Number} - Class representing a table data source (Ref: @Source.Table). */
            Table: 1,
            /** @type {Number} - Class representing a CSV table data source (Ref: @Source.CSV). */
            CSV: 2,
            /** @type {Number} - Class representing a centralized class for different image datasets as an input source (Ref: @Source.Image). */
            Image: 3
        });
    }

    static get Config() { return TrainSource; }
    static get Table() { return TableSource; }
    static get CSV() { return CSVSource; }
    static get Image() { return ImageSource; }
}

/** Class representing a training data source.   --- UPDATED (Dexter) 20180818*/
class TrainSource {
    /**
     * Create a training data source.   --- UPDATED (Dexter) 20190221
     * @param {Number} instanceClass - The instnace class, as defined in @Source.Types .
     * @param {Array<(Number|String)} oriShape - The original data shape.
     * @param {Number} batchSize - Batch size when using batched training.
     * @param {Boolean} training - Whether this setup for training use only.
     * @param {Boolean} shuffle - Whether the data source will be shuffled on training.
     * @param {String} name - The name of this @Source.Config.
     * @param {Boolean} splittable - Whether the data source is splittable, for the purpose of partitioning validation data.
     */
    constructor (instanceClass = Source.Types.Config, oriShape = [], batchSize = 200, training = true, shuffle = true, name = "", splittable = false) {
        /** @type {Number} - The instnace class, as defined in @Source.Types .  */
        this._instanceClass = instanceClass;
        /** @type {String} - The type of this @Source.Config, like `"TableSource"`, `"CSVSource"`, etc. */
        this._type = "";
        /** @type {Number} - Epoch size of the data, i.e. total number of records in the training dataset. */
        this.epochSize = oriShape.length ? oriShape[0] : null;
        /** @type {Number} - Batch size when using batched training. */
        this.batchSize = batchSize;
        /** @type {TrainSource} - The validation subset of this @Source.Config object. */
        this.validation = null;
        /** @type {Train} - The @Train object where this @Source.Config belongs to. If this source is just constructed, it is not belonged to any training instance. */
        this.train = null;
        /** @type {Boolean} - Whether the data source will be shuffled on training. */
        this.shuffle = shuffle;
        /** @type {String} - The name of this @Source.Config. */
        this.name = name;
        /** @type {Boolean} - Whether the data source is splittable, for the purpose of partitioning validation data. */
        this.splittable = splittable;
        /** @type {Map<String,DataPreprocessing.Node>} - A `Map` object using a `String` as a key to map with a corresponding @DataPreprocessing.ColumnsNode object, storing all the column configurations (data preprocessing config) on this source. */
        this.colConfigs = new Map();
        /** @type {Boolean} - Whether this setup for training use only. */
        this._training = training;
        /** @type {Array<(Number|String)>} - The original shape of the data source, including the batch dimension. */
        this._oriShape = oriShape;
    }

    /**
     * Get the source id of this source in the parent @Train object.   --- UPDATED (Dexter) 20190129
     * @returns {Number} - The source id of this source in the parent @Train object.
     */
    get sourceID() {
        return this.train.sources.indexOf(this);
    }

    /**
     * Get the shape of the original (and primary) data of this @Source.Config object.   --- UPDATED (Dexter) 20190130
     * @returns {Array<(Number|String)>} - The shape of the original (and primary) data of this @Source.Config object.
     */
    get oriShape() {
        return this._oriShape;
    }

    /**
     * Whether this setup for training use only.   --- UPDATED (Dexter) 20190208
     * @returns {Boolean} - Whether this setup for training use only.
     */
    get training() {
        return this._training;
    }

    /**
     * Export this @Source.Config into a represtable object for project saving.   --- UPDATED (Dexter) 20180523
     * @returns {Object} JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this TrainSource, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>{
            if (k == "colConfigs") {
                // Noted the column configs are another Class, they'll be exported themselves.
                obj[k] = [...this.colConfigs.entries()].map(v=>[v[0], v[1].exportAsJSON()]);
            } else if (k != "train") {
                obj[k] = this[k];
            }
        })
        return obj;
    }

    /**
     * Parse a previously saved object into this @Source.Config object.   --- UPDATED (Dexter) 20190131
     * @param {Object} obj - JSON object from Project file
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the TrainSource Class.
        [...Object.keys(obj)].forEach(k=>{
            if (k != "colConfigs") {
                // For other properties, just directly assign the values.
                this[k] = obj[k];
            }
        });

        // Parse column config data.
        // For colConfigs, create the ColConfig first and parse them on their own.
        obj["colConfigs"].forEach(v=>{
            var colConfig = DataPreprocessing.parseJSON(v[1]);
            this.setItem(v[0], colConfig);
        });

        // Wrap up all information by setting circular data and transformation data.
        // They need to be set up at the end because they may be cross referencing each other.
        this.colConfigs.forEach((colConfig,dppKey)=>{
            if ((colConfig instanceof DataPreprocessing.ColumnsNode)) {
                colConfig.transformations.forEach((ti,idx)=>{
                    this.setTransform(dppKey, ti.cols, ti.scaleType, false);
                });
                colConfig.circular.forEach((ci,idx)=>{
                    this.setCircularOutput(dppKey, ci.cols, ci.min, ci.max, false);
                });
            }
        });
    }

    /**
     * Set the data shape of this training source, typically when full data is not available.   --- UPDATED (Dexter) 20190130
     * @param {Array<(Number|String)>} shape - The enforced shape, including the batch dimension.
     */
    setDataShape(shape) {
        this._oriShape = shape;
    }

    /**
     * Get a column configuration using a key.   --- UPDATED (Dexter) 20180622
     * @param {String} key - The key of the column configuration.
     * @returns {DataPreprocessing.Node} - A @DataPreprocessing.Node object with the requested key.
     */
    getItem(key) {
        return this.colConfigs.get(key);
    }

    /**
     * Set a column configuration using a key, and attach the @DataPreprocessing.Node object to this source.   --- UPDATED (Dexter) 20190124
     * @param {String} key - The key of the column config.
     * @param {DataPreprocessing.Node} colConfig - The @DataPreprocessing.Node object.
     * @returns {DataPreprocessing.Node} - The @DataPreprocessing.Node object.
     */
    setItem(key, colConfig) {
        this.colConfigs.set(key, colConfig);
        colConfig.attachToSource(this, key);
        return colConfig;
    }

    /**
     * Remove a column configuration using a key, and attach the @DataPreprocessing.Node object to this source.   --- UPDATED (Dexter) 20190130
     * @param {String} key - The key of for a @DataPreprocessing.ColumnsNode object.
     * @returns {TrialReuslt} - The trial result of removing the requested @DataPreprocessing.ColumnsNode object.
     */
    removeItem(key) {
        if (this.train.getLayersUsingSource(this.sourceID, key)) return new TrialResult(false, "preproDelWithLayer");
        else return new TrialResult(true);
    }

    /**
     * Get a generalized name of this @Source.Config object.   --- UPDATED (Dexter) 20180523
     * @returns {String} - The original name, or the (image) source type, or the file name, or the class name of this @Source.Config object.
     */
    getGeneralizedName() {
        return this.name || this.sourceType || this._fileName || this._type;
    }

    /**
     * Get the output shape of the parent of a @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190130
     * @param {String} dppKey - A parent column config key.
     * @param {String} requestingDppKey - The column config key of the requesting @DataPreprocessing.Node object. `null` if it's not requesting the preprocessing shape from another preprocessing node.
     * @param {Boolean} refresh - Whether to refresh the shape from root data.
     * @returns {Array<(Number|String)>} - The output shape.
     */
    getColShape(dppKey, requestingDppKey = null, refresh = false) {
        if (this.colConfigs.has(dppKey)) {
            return this.colConfigs.get(dppKey).getShape(refresh);
        } else {
            return this.oriShape;
        }
    }

    /**
     * Get the root column config key of a specific column configuration. This is a recursive function to find the parent column configuration.   --- UPDATED (Dexter) 20180627
     * @param {String} dppKey - The key for the requested @DataPreprocessing.ColumnsNode object in @Source.Config.colConfigs .
     * @returns {String} - The key for the requested root column configuration.
     */
    getRootDppKey(dppKey) {
        // If it's the root, the column config should have no value for the .source attribute.
        if (this.colConfigs.get(dppKey).source == null) return dppKey;
        // Otherwise, recursively call this function by referencing the source column key of this column configuration.
        else return this.getRootDppKey(this[dppKey].source);
    }

    /**
     * Apply the shape of a particular @DataPreprocessing.ColumnsNode object. No implementation on this class, see implementations on sub-classes.   --- UPDATED (Dexter) 20190125
     * @param {String} id - The source id of this training source in the @Train object.
     * @param {String} dppKey - The key of the updating @DataPreprocessing.ColumnsNode object.
     * @param {String} colSel - The column selection string to be made on the column config.
     * @param {Boolean} applyImmediately - Whether effect will be taken immediately on any changes once confirm proceeding layers have no conflicts.
     * @returns {TrialResult} - Return a result with `false`.
     */
    applyShapeChanges(id, dppKey, colSel, applyImmediately = true) {
        return new TrialResult(false);
    }

    /**
     * Parse a JSON object to a valid @Source.Config object.   --- UPDATED (Dexter) 20190207
     * @param {Object} obj - A JSON-object.
     * @returns {TrainSource} - The parsed @Source.Config object.
     */
    static parseJSON(obj) {
        var source;
        if (obj._type == "TableSource") {
            source = new TableSource();
        } else if (obj._type == "CSVSource") {
            source = new CSVSource();
        } else if (obj._type == "ImageSource") {
            source = new ImageSource();
        }
        source.parseJSON(obj);
        return source;
    }
}

/** Class representing operations on index range strings.   --- UPDATED (Dexter) 20181210 */
class IndexRange {
    /**
     * Parse an index range string into a list of selected indices.   --- UPDATED (Dexter) 20181210
     * @param {Number} selectionLength - The total seleection length.
     * @param {String} rangeStr - A range string, validated before submission.
     * @param {Boolean} repeatable - Whether selection can be repeatably selected.
     * @returns {Number[]} - A list of indices to be selected.
     */
    static parse(selectionLength, rangeStr, repeatable = false) {
        if (rangeStr.trim().length == 0) {
            return []
        } else if (rangeStr.startsWith("[") && rangeStr.endsWith("]")) {
            var allIdx = rangeStr.slice(1,-1).split(",").map(str=>Number(str.trim())).filter(n => n<selectionLength && n >= -selectionLength ).map(n=>n<0 ? (selectionLength + n) : n);
            return repeatable ? allIdx : [...(new Set(allIdx))];
        } else if (rangeStr.includes(":")) {
            var rangeSel = rangeStr.split(":").map(str=>str.trim());
            if (rangeSel[0] == "None" || rangeSel[0] == "") rangeSel[0] = 0;
            if (rangeSel[1] == "None" || rangeSel[1] == "") rangeSel[1] = selectionLength;
            rangeSel = rangeSel.map(n=>Number(n)).map(n=>Math.min(Math.max((n<0 ? (selectionLength + n) : n), 0), selectionLength));
            var nums = [];
            for (let i = rangeSel[0]; i<rangeSel[1]; i++) {
                nums.push(i);
            }
            return nums;
        } else {
            var allIdx = rangeStr.split(",").map(str=>Number(str.trim())).filter(n => n<selectionLength && n >= -selectionLength ).map(n=>n<0 ? (selectionLength + n) : n);
            return repeatable ? allIdx : [...(new Set(allIdx))];
        }
    }

    /**
     * Validate whether a range string is syntatically correct.   --- UPDATED (Dexter) 20181210
     * @param {Number} selectionLength - The total seleection length.
     * @param {String} rangeStr - A range string.
     * @returns {Boolean} - Whether the range string is correct.
     */
    static validate(selectionLength, rangeStr) {
        if (rangeStr.startsWith("[") && rangeStr.endsWith("]")) {
            var nums = rangeStr.slice(1,-1).split(",").map(str=>str.trim());
            return nums.every(num=>num.match(/[0-9\-]+/)) && nums.map(n=>Number(n)).every(n => n<selectionLength && n >= -selectionLength);
        } else if (rangeStr.includes(":")) {
            var nums = rangeStr.split(":").map(str=>str.trim());
            return nums.length == 2 && nums.every(num=>num=="" || num=="None" || num.match(/[0-9\-]+/));
        } else {
            var nums = rangeStr.split(",").map(str=>str.trim());
            return nums.every(num=>num.match(/[0-9\-]+/)) && nums.map(n=>Number(n)).every(n => n<selectionLength && n >= -selectionLength);
        }
    }

    /**
     * Get an index range string from a boolean array for selections on different columns.   --- UPDATED (Dexter) 20190129
     * @param {Array<Boolean>} selIndices - A boolean array for selections on different columns.
     * @return {String} - A column selection string that can be parsed by @IndexRange.parse() method.
     */
    static getStringFromIndices(selIndices) {
        const selCount = selIndices.filter(h=>h).length;
        if (selCount === 0) return "";
        else if (selCount === 1) return "[" + selIndices.indexOf(true) + "]";
        else if (selCount === selIndices.length) return "None:None";
        else {
            const str = selIndices.map(h=>h?1:0).join("");
            if (str.match(/^0*1*0*$/)) {
                if (str.startsWith("0")) {
                    if (str.endsWith("0")) {
                        return selIndices.indexOf(true) + ":" + (selIndices.lastIndexOf(true)+1);
                    } else {
                        return selIndices.indexOf(true) + ":None";
                    }
                } else {
                    return "None:" + (selIndices.lastIndexOf(true)+1);
                }
            } else {
                var trueIdx = [];
                selIndices.forEach((h,idx)=>{if (h) trueIdx.push(idx);});
                return "[" + trueIdx.join(", ") + "]";
            }
        }
    }
}

/** Class representing a table data source.   --- UPDATED (Dexter) 20180523 */
class TableSource extends Source.Config {
    /**
     * Create a @Source.Table object, a two-dimensional table.   --- UPDATED (Dexter) 20190221
     * @param {Array} inputArray - An input data table
     * @param {Array} outputArray - An output data table
     * @param {Boolean} hasHeading - Whether the table has heading
     * @param {Number} batchSize - Batch size when using batched training
     * @param {Number} testRatio - The test data proportion, in terms of %.
     * @param {Boolean} training - Setup for training use only
     * @param {Boolean} shuffle - Whether the data source will be shuffled on training
     * @param {String} name - Name of this TableSource
     */
    constructor(inputArray = [], outputArray = [], hasHeading = false, batchSize = 200, testRatio = 20, training = true, shuffle = true, name = "") {
        // Stack the input and output array.
        var allData = (outputArray.length == inputArray.length && inputArray.length > 0) ? Matrix.concatColumns(inputArray, outputArray) : inputArray;

        // Get the data shape.
        var shape = allData.length ? Train.shape(hasHeading?allData.slice(1):allData) : [0];

        // Create the data preprocessing node.
        super(Source.Types.Table, shape, batchSize, training, shuffle, name, true);

        /** @type {Array<Array<Number|String>>} - The original Source data */
        this._oriData = allData.length ? allData : null;

        // Auto handling data preprocessing column selections if there is output array given.
        if (outputArray.length) {
            var inputColCount = inputArray.length ? inputArray[0].length : 0;
            var outputColCount = outputArray.length ? outputArray[0].length : 0;
            const inputCol = inputColCount > 0 ? `None:${inputColCount}` : null;
            const targetCol = outputColCount > 0 ? `${inputColCount}:None` : null;
            if (inputArray.length) this.setItem("input", new DataPreprocessing.ColumnsNode(null, inputCol));
            if (outputArray.length) this.setItem("target", new DataPreprocessing.ColumnsNode(null, targetCol));
        } 

        /** @type {String} - The type of this @Source.Config, i.e. `"TableSource"` */
        this._type = "TableSource";

        /** @type {Boolean} - Whether the table has heading. */
        this._hasHeading = hasHeading;

        /** @type {Boolean} - Whether this source is fully extracted with every data known. */
        this._fullyExtracted = training;

        /** @type {Number} - The test data proportion, in terms of %. */
        this._testRatio = testRatio;
    }

    /**
     * Get the original data of this table source.   --- UPDATED (Dexter) 20190205
     * @returns {Array<Array<(Number|String)>>} - The original source data
     */
    get oriData() {
        return this._oriData;
    }

    /**
     * Return whether this table source include a heading.   --- UPDATED (Dexter) 20181208
     * @returns {Number} - Whether the table has heading.
     */
    get hasHeading() {
        return this._hasHeading;
    }

    /**
     * Get the test data proportion, in terms of %.   --- UPDATED (Dexter) 20190207
     * @returns {Number} - The test data proportion, in terms of %.
     */
    get testRatio() {
        return this._testRatio;
    }

    /**
     * Apply the shape of a particular column config.   --- UPDATED (Dexter) 20190130
     * @param {Number} id - The source id of this training source in the @Train object.
     * @param {String} dppKey - The key of the updating column config.
     * @param {String} colSel - An @IndexRange parsable string specifying the column selection from the source. `null` if only there are updates only on data preprocessing instead of selection changes, like one-hot encoding may alter the shape for one pre-processing node.
     * @param {Boolean} applyImmediately - Whether effect will be taken immediately on any changes once confirm proceeding layers have no conflicts.
     * @returns {TrialResult} - Return a result information: {result: Boolean - Whether the change can be applied (and updated) successfully, error: Object - Translatable information of error message} .
     */
    applyShapeChanges(id, dppKey, colSel = null, applyImmediately = true) {
        var train = this.train;

        var toDataShape;
        // If a new column selection is made
        if (colSel != null) {
            // Get the shape form the column selection on the output of the given column config.
            toDataShape = ["None", ...[TableSource.getColList(this.getColShape(this.colConfigs.has(dppKey) ? this.colConfigs.get(dppKey).source : null, undefined, false)[1], colSel).length]];
        } else {
            // Otherwise, just update the latest column config shape.
            toDataShape = this.colConfigs.get(dppKey).getShape();
        } 

        // Get all the layers from the training.
        var allLayers = [...train.layerProfiles.values()];

        // Create an object for the model tracing of whether this change can be applied.
        var configChanges = {type: "source", id1: id, id2: dppKey, shape: toDataShape};

        // Get all the next layers
        var nextLayers = this.train.getLayersUsingSource(id, dppKey);

        // Get all the final layers that is comparing with this data source
        var nextEnds = allLayers.filter(lp=>lp._final && lp.compareSourceID == id && lp.compareTensorIdx == dppKey);

        // Identify if this layer has a next layer.
        var hasNextLayer = (nextLayers.length + nextEnds.length) > 0;

        // Check for all next layers whether they can applied with the changes.
        var result = true, error = null;
        if (hasNextLayer) {
            // Set up the centralized object.
            var centralizedMap = new Map();
            nextLayers.forEach(l=>centralizedMap.set(l.name, {status: 1, layerProfile: l, fromShapeChanges: configChanges, configChanges: {}, outputShape: null}));
            nextEnds.forEach(l=>centralizedMap.set(l.name, {status: 1, layerProfile: l, fromShapeChanges: null, configChanges: configChanges, outputShape: configChanges.shape}));
            
            // Pass the change along the model nodes, and it will receive whether conflicts occurs from their resolve/reject returns.
            var nextLayerResults = [...nextLayers.map(lp=>lp.applyShapeChanges(configChanges, undefined, centralizedMap, false)), ...nextEnds.map(lp=>lp.applyShapeChanges(null, {"compareSourceID": lp.compareSourceID, "compareTensorIdx": lp.compareTensorIdx}))];
            [error, result] = Project.extractErrors(nextLayerResults);
        }

        // Try to apply this layer's change and affect the proceding layers.
        if (result) {
            if (applyImmediately) {
                // Apply the changes.
                if (hasNextLayer) centralizedMap.forEach((info, name)=>train.layerProfiles.get(name).commitChanges(info));

                if (colSel) {
                    // If no conflicts occurs, update this column config to the requested column selection, and resolve the Promise.
                    this.setItem(dppKey, new DataPreprocessing.ColumnsNode(null, colSel));
                }
            }
            return new TrialResult(true);
        } else return new TrialResult(false, error);
    }

    /**
     * Check if there is embedded data of a requested column configuration.    --- UPDATED (Dexter) 20190129
     * @param {String} dppKey - The key for the requested @DataPreprocessing.ColumnsNode object in @Source.Config.colConfigs .
     * @returns {Boolean} - Whether the requested column config has data defined from its root column configuration.
     */
    hasColData(dppKey = null) {
        // Ensure there is original data embedded.
        if (!this._oriData) return null;

        if (dppKey != null) {
            // Check if the node has specified at least one column.
            var colConfig = this.colConfigs.get(dppKey);
            var colConfigDataIdx = Array(Number(colConfig.source == null ? this._oriShape[1] : this.colConfigs.get(colConfig.source).getShape()[1])).fill(0).map((n,i)=>i);
            var colSourceCols = colConfig.sourceCol;
            var colSourceIdx = TableSource.colSpec([colConfigDataIdx], colSourceCols)[0];
            return colSourceIdx.length > 0;
        } else {
            return this._oriData != null && this._oriData.length > 0;
        }
    }

    /**
     * Get the all data of a data source, with specification of the range of the batch.   --- UPDATED (Dexter) 20181210
     * @param {(String|Number)} batchStart - Batch starting index (inclusive). If `"None"`, it notates `0`.
     * @param {(String|Number)} batchEnd - Batch ending index (exclusive). If `"None"`, it notes the column count.
     * @returns {Array<Array<(String|Number)>>} - A two-dimensional data array.
     */
    getAllData(batchStart = "None", batchEnd = "None") {
        // Ensure there is original data embedded.
        if (!this._oriData) return [];

        // Get the column config and the related datasource. If it's referencing another column config, it induces a recurssive function for getColData() on another column config.
        var dataSource = Matrix.rowSlicing(this.getRootData(), batchStart, batchEnd);

        // Return the columns.
        return dataSource;
    }

    /**
     * Get the output data of a particular data preprocessing node, with specification of the range of the batch.   --- UPDATED (Dexter) 20190130
     * @param {String} dppKey - The key for the requested @DataPreprocessing.ColumnsNode object in @Source.Config.colConfigs .
     * @param {Number} step - The step of data preprocessing within a @DataPreprocessing.ColumnsNode object.
     * @param {(String|Number)} batchStart - Batch starting index (inclusive). If `"None"`, it notates `0`.
     * @param {(String|Number)} batchEnd - Batch ending index (exclusive). If `"None"`, it notes the column count.
     * @returns {Array<Array<(String|Number)>>} - A two-dimensional data array.
     */
    getColData(dppKey, step = DataPreprocessing.ColumnsNode.StepEnum.Output, batchStart = "None", batchEnd = "None") {
        // Ensure there is original data embedded.
        if (!this._oriData) return [];

        // Get the column config and the related datasource. If it's referencing another column config, it induces a recurssive function for getColData() on another column config.
        var colConfig = this.colConfigs.get(dppKey);
        var dataSource = colConfig.source == null ? Matrix.rowSlicing(this.getRootData(), batchStart, batchEnd) : this.getColData(colConfig.source, batchStart, batchEnd);

        // Get the column selections from the input data source.
        var selCol = TableSource.colSpec(dataSource, colConfig.sourceCol);

        if (step == DataPreprocessing.ColumnsNode.StepEnum.Input) return selCol;

       // If there is transformation, apply each transformation function sequentially on each of the applied column indexes.
        colConfig.transformTo.forEach((ftnAry,idx)=>{
            var newCol = selCol.map(r=>r[idx]);
            newCol = ftnAry.reduce((a,b)=>b(a), newCol);
            newCol.forEach((c,ci)=>selCol[ci][idx]=c);
        });

        if (step == DataPreprocessing.ColumnsNode.StepEnum.Transformed) return selCol;

        // If there is circular data defined, apply the circular range mapping.
        colConfig.circularInfo.forEach((ci,idx)=>{
            var minV = ci.min, maxV = ci.max, rangeV = ci.range;
            selCol.forEach(r=>r[idx] = r[idx] >= minV ? (r[idx] - minV) % rangeV : (rangeV + (r[idx] - minV) % rangeV));
        })

        if (step == DataPreprocessing.ColumnsNode.StepEnum.CircularDataDefined) return selCol;

        // Handle the one-hot columns data.
        if (colConfig.oneHotColumns.size > 0) {
            // List all columns, perform transformation if needed.
            var allCols = [];
            
            for (let idx = 0; idx < selCol[0].length; idx++) {
                if (colConfig.oneHotColumns.has(idx)) {
                    var newCol = selCol.map(r=>r[idx]);
                    newCol = TableSource.convertCatToNumbers(newCol, true, new Map([...colConfig.oneHotColumns.get(idx)].map((v,idx)=>[v, idx])))["data"];
                    allCols.push(newCol);
                } else {
                    allCols.push(selCol.map(r=>[r[idx]]));
                }
            }

            //Concatenate all columns.
            selCol = Matrix.concatColumns(...allCols);
        }

        // Cast the data type if needed.
        if (colConfig.dtype != null) {
            if (colConfig.dtype == "tf.int64") {
                selCol = Matrix.transform(selCol, cell=>Math.round(cell));
            } else {
                selCol = Matrix.transform(selCol, cell=>Number(cell));
            }
        }

        // Return the columns.
        return selCol;
    }

    /**
     * Get the root data of a particular root data preprocessing column node.   --- UPDATED (Dexter) 20190205
     * @param {String} dppKey - The key for the requested @DataPreprocessing.ColumnsNode object in @Source.Config.colConfigs .
     * @returns {Array<Array<Number>>} - A two-dimensional data array.
     */
    getRootData(dppKey = null) {
        // Ensure there is original data embedded.
        if (!this.oriData) return null;

        if (dppKey) {
            // If it's not a root key, returns null.
            if (this.colConfigs.get(dppKey).source != null) return null;

            // Get the header names that is within the circular data definition.
            var colSourceIdx = TableSource.getColList(Number(this.oriShape[1]),  this.colConfigs.get(dppKey).sourceCol);
            return (this.hasHeading ? this.oriData.slice(1) : this.oriData).map(row=>row.filter((c,i)=>colSourceIdx.includes(i)));
        } else {
            return (this.hasHeading ? this.oriData.slice(1) : this.oriData);
        }
    }

    /**
     * Get the class count of all values in a particular column config.   --- UPDATED (Dexter) 20190125
     * @param {String} dppKey - The key for the requested @DataPreprocessing.ColumnsNode object in @Source.Config.colConfigs .
     * @returns {Number} - The class count of all values in the requested column config.
     */
    getClassCount(dppKey = null) {
        // Get the data.
        var colData = (this.getColData(dppKey));

        // Ensure the data is in format of array and there are some data existed.
        if (colData instanceof Array && colData.length > 0) {
            return TableSource.getDataClassCount(colData); 
        } else return null;
    }

    /**
     * Get the header names of a particular column config.   --- UPDATED (Dexter) 20190131
     * @param {String} dppKey - Column config key.
     * @param {Number} step - The step of data preprocessing within a @DataPreprocessing.ColumnsNode object.
     * @returns {Array<String>} - A list of header names.
     */
    getHeader(dppKey = null, step = DataPreprocessing.ColumnsNode.StepEnum.Output) {
        // Ensure there is original data embedded.
        var header = [], colCount = Number(this.oriShape[1]);
        if (!this.oriData || !this.hasHeading) {
            for (let j = 0; j < colCount; j++) {
                // Fill with default column grid id.
                header.push(String.fromCodePoint("A".codePointAt(0)+j));
            }
        } else {
            header = this.oriData[0];
        }
        
        // If there is no column key, return the original header.
        if (!dppKey) return header;

        // Get the column config.
        var colConfig = this.colConfigs.get(dppKey);

        // Get the source header.
        var sourceHeader = colConfig.source == null ? header : this.getHeader(colConfig.source);
        var toHeader = TableSource.colSpec([sourceHeader], colConfig.sourceCol)[0];

        // Returns if needs to check through the data preprocessing.
        if (![DataPreprocessing.ColumnsNode.StepEnum.Output].includes(step)) {
            return toHeader;
        }

        // Update the header list based on additional columns from one-hot encoding.
        var oneHotIdxs = this.colConfigs.get(dppKey).oneHotColumns;
        if (oneHotIdxs.size) {
            var finalHeader = [];
            toHeader.forEach((headerName, idx)=>{
                if (oneHotIdxs.has(idx)) {
                    // If the particular index of header is within the specification in one-hot columns, expand the headers with a postfix.
                    oneHotIdxs.get(idx).forEach(oneHotName=>{
                        finalHeader.push(`${headerName} (${oneHotName})`);
                    });
                } else {
                    finalHeader.push(headerName);
                }
            });
            return finalHeader;
        } else {
            return toHeader;
        }
    }

    
    /**
     * Get the output table of a particular data preprocessing node, with specification of the range of the batch.   --- UPDATED (Dexter) 20190205
     * @param {String} dppKey - Data preprocessing node key.
     * @param {Number} step - The step of data preprocessing within a @DataPreprocessing.ColumnsNode object.
     * @returns {Array<Array<(Number|String)>>} - A two-dimensional data array.
     */
    getColTable(dppKey = null, step = DataPreprocessing.ColumnsNode.StepEnum.Output) {
        return this._hasHeading ? [this.getHeader(dppKey, step),...this.getColData(dppKey, step)] : this.getColData(dppKey, step);
    }

    /**
     * Get the table of a data source.   --- UPDATED (Dexter) 20190131
     * @returns {Array<Array<(Number|String)>>} - A two-dimensional data array.
     */
    getAllTable() {
        return this._hasHeading ? [this.getHeader(),...this.getAllData()] : this.getAllData();
    }

    /**
     * Transform data in a particular column config.   --- UPDATED (Dexter) 20190320
     * @param {String} sourceDppKey - The @DataPreprocessing.ColumnsNode key that is to be applied with.
     * @param {String} cols - Index range string for selecting the columns from this @DataPreprocessing.ColumnsNode object.
     * @param {String} scaleType - The transformation type.
     * @param {Boolean} _pushSaves - Whether to push the transformation in @DataPreprocessing.ColumnsNode.transformations array. To be deprecated in later versions.
     */
    setTransform(sourceDppKey="target", cols="None:None", scaleType="normMinMax", _pushSaves=true) {
        // Get the column config and find out the column indexes that are actually referring to.
        var colConfig = this.colConfigs.get(sourceDppKey);
        var nowCols = TableSource.getColList(colConfig.getShape()[1], cols);

        nowCols.forEach(idx=>{
            // Get previously defined transformations within the transform Map objects.
            var tranxToAry = colConfig.transformTo.get(idx) || [];
            
            // Some types of transformation needs pre estimation of data.
            const needPreExtraction = ["normMinMax", "normMax", "classify"].includes(scaleType);
            var dataCol = (needPreExtraction && this._fullyExtracted && this._oriData)? this.getColData(sourceDppKey, DataPreprocessing.ColumnsNode.StepEnum.Input) : [];

            // For each of the specified columns, append the transformation actions:
            if (scaleType == "normMinMax") {
                var values = dataCol.map(row=>row[idx]);
                var minV = Math.min(...values);
                var maxV = Math.max(...values);
                tranxToAry.push(col=>col.map(v=>(v-minV)/(maxV-minV)));
            } else if (scaleType == "normMax") {
                var values = dataCol.map(row=>row[idx]);
                var minV = Math.min(...values);
                var maxV = Math.max(...values);
                var numRange = Math.max(0, maxV) - Math.min(0, minV);
                tranxToAry.push(col=>col.map(v=>v/numRange));
            } else if (scaleType == "log") {
                tranxToAry.push(col=>col.map(v=>Math.log(Math.min(v,0))));
            } else if (scaleType == "exp") {
                tranxToAry.push(col=>col.map(v=>Math.exp(v)));
            } else if (scaleType == "classify") {
                var convList = TableSource.convertCatToNumbers(dataCol.map(row=>row[idx]))["dict"];
                tranxToAry.push(col=>TableSource.convertCatToNumbers(col, false, convList)["data"]);
            } 
            colConfig.transformTo.set(idx, tranxToAry);
        })

        // Append the new transformation object, with a translatable name
        if (_pushSaves) {
            colConfig.transformations.push({scaleType: scaleType, cols: cols, colIdx: nowCols, lt: "tx" + scaleType[0].toUpperCase() + scaleType.slice(1)});
        }

        return {action: true};
    }

    /**
     * Clear all the transformations on one column of a @DataPreprocessing.ColumnsNode object.   --- UPDATED (Dexter) 20190130
     * @param {String} sourceDppKey - Key for a @DataPreprocessing.ColumnsNode
     * @param {Number} idx - The order of the transformation is to be removed
     */
    removeTransformItem(sourceDppKey, idx) {
        // Get the column config for the removal preparation.
        var colConfig = this.colConfigs.get(sourceDppKey);
        
        // Delete all the .transformTo related items, re-update using the setTransform() method.
        colConfig.transformations.splice(idx,1);
        colConfig.transformTo = new Map();
        colConfig.transformations.forEach((ti,idx)=>{
            this.setTransform(sourceDppKey, ti.cols, ti.scaleType, false);
        })
     }

    /**
     * Define any circular data columns in a particular column config.   --- UPDATED (Dexter) 20190124
     * @param {String} sourceDppKey - The @DataPreprocessing.ColumnsNode key that is to be applied with.
     * @param {colSel} cols - The array of columns for selecting the columns from this @DataPreprocessing.ColumnsNode
     * @param {Number} minV - Minimum value of the circular range (includes)
     * @param {Number} maxV - Maximum value of the circular range (excludes)
     * @param {Boolean} _pushSaves - Push a temp JS Object into .circular, need to define as false when the project is initiated from JSOn as the array should be created before turning into NeuralSimplycode-like structure
     * @returns {Object} "action" will determine whether the update is successful. If not, a "msg" will be returned. If yes, the JS circular object will be returned.
     */
    setCircularOutput(sourceDppKey="target", cols="None:None", minV=0, maxV=360, _pushSaves=true) {
        // Get the column config and find out the column indexes that are actually referring to.
        var colConfig = this.colConfigs.get(sourceDppKey);
        var nowCols = TableSource.getColList(colConfig.getShape()[1], cols);

        // Create a set to store previously defined column indexes.
        var allPrevIdx = new Set();
        colConfig.circular.forEach(c=>c.colIdx.forEach(idx=>allPrevIdx.add(idx)));

        // If the cols does not include previously defined items, it will proceed to updating the configuration.
        if (nowCols.some(idx=>allPrevIdx.has(allPrevIdx))) {
            return {action: false, msg: "prevCirError"};
        } else {
            // The settings will be updated as if in NeuralSimplycode in a Map() object;
            nowCols.forEach(idx=>colConfig.circularInfo.set(idx, {min: minV, max: maxV, range: maxV-minV}));

            // Another basic object storing the parametric info will also be stored in an Array for easier access in frontend environment
            var circularInfo = {cols: cols, colIdx: nowCols, min: minV, max: maxV};
            if (_pushSaves) colConfig.circular.push(circularInfo);
            return {action: true};
        }
    }

    /**
     * Remove a circular item from the property pane.   --- UPDATED (Dexter) 20190124
     * @param {String} sourceDppKey - The @DataPreprocessing.ColumnsNode key that is to be applied with.
     * @param {Number} idx - The index of the cicular data definition.
     */
    removeCircularItem(sourceDppKey, idx) {
        // Get the column config for the removal preparation.
        var colConfig = this.colConfigs.get(sourceDppKey);
        var ci = colConfig.circular[idx];
        var nowCols = TableSource.getColList(colConfig.getShape()[1], ci.cols);

        // Delete all the .circularInfo related items and the ._circluar temp objects.
        nowCols.forEach(i=>colConfig.circularInfo.delete(i));
        colConfig.circular.splice(idx, 1);
    }

    /**
     * Define the specific columns on a column config of a source to have a one-hot encoding.   --- UDPATED (Dexter) 20190130
     * @param {String} sourceDppKey - The @DataPreprocessing.ColumnsNode key that is to be applied with.
     * @param {colSel} cols - The array of columns for selecting the columns from this @DataPreprocessing.ColumnsNode
     * @param {Boolean} _pushSaves - Push a temp JS Object into .circular, need to define as false when the project is initiated from JSOn as the array should be created before turning into NeuralSimplycode-like structure
     * @returns {Object} "action" will determine whether the update is successful. If not, a "msg" will be returned. If yes, the JS circular object will be returned.
     */
    setOneHot(sourceDppKey="target", cols="None:None", _pushSaves=true) {
        // Get the column config and find out the column indexes that are actually referring to.
        var colConfig = this.colConfigs.get(sourceDppKey);
        var toColList = TableSource.getColList(colConfig.getShape()[1], cols);

        // Clear the one hot columns.
        var tempOldOneHot = colConfig.oneHotColumns;
        colConfig.oneHotColumns = new Map();

        // Set up the one hot columns.
        var oriData = this.getColData(sourceDppKey);
        const dataSize = oriData.length;
        var failIdxs = [];

        // Loop each selected columns and get all possible values
        for (let idx of toColList) {
            var toDict = new Set(oriData.map(row=>row[idx]));
            if (toDict.size > dataSize/2) failIdxs.push(idx);
            colConfig.oneHotColumns.set(idx, toDict);
        }

        // Avoid too many indices.
        if (failIdxs.length) {
            // Revert the one hot columns as well.
            colConfig.oneHotColumns = tempOldOneHot;

            // Revert the shape if it's not fine
            colConfig.refreshItemShape();

            return {result: false, error: "onehotTooMuch"};
        }


        if (_pushSaves) {
            // Try to check with layer compatabilities.
            var [id, dppKey] = colConfig.getIDAndKey();
            colConfig.refreshItemShape();

            var changeAction = this.applyShapeChanges(id, dppKey);
            if (!changeAction.result) {
                // Revert the one hot columns as well.
                colConfig.oneHotColumns = tempOldOneHot;

                // Revert the shape if it's not fine
                colConfig.refreshItemShape();

                return {result: false, error: changeAction.error};
            } else {
                // Update the model graph if it's a successful update.
                this.train._project.drawTrain();

                // If it's fine, update the spreadsheet.
                if (this._oriData) {
                    SpreadSheet.get("colDataPreview").setData(this.getColTable(dppKey));
                }
            }
        } 
        return {result: true};
    }

    /**
     * Update the column config once the data is updated.  --- RESERVED --- UPDATED (Dexter) 20180523
     * TODO [Model Editing/Data Updating]
     * Reason:  Data Updates has not been implemented.
     * Remarks:  This will affect the shape (though this may controlled in data input), as well as any transformation properties.
     */
    __dataUpdated__() {
    }

    /**
     * Convert a categorical data column to indexes.   --- UPDATED (Dexter) 20190127
     * @param {Array} column - a column of data
     * @param {Boolean} oneHot - whether to use one-hot encoding, if so, a 2D array of 1/0 is returned instead of a column of data with indexes
     * @param {Map<String,Number>} manualList - a manual Map for mapping the data value to an index
     * @returns {Object} - .data : the new column of converted data;  .dict : the Map object for key-index loopup
     */
    static convertCatToNumbers(column, oneHot=false, manualList=null) {
        if (manualList == null) manualList = new Map([...new Set(column)].map((v,idx)=>[v, idx]));
        if (oneHot) return {data: column.map(v=>[...manualList.keys()].map(k=>v==k?1:0)), dict: manualList};
        else return {data: column.map(v=>manualList.get(v)), dict: manualList};
    }

    /**
     * Get the categorical class count from an array.   --- UDPATED (Dexter) 20190128
     * @param {Array<Array<Number|String>>} array - An array of data.
     * @returns {Number} - The categorical class count.
     */
    static getDataClassCount(array) {
        return (new Set(Matrix.flatten(array))).size;
    }

    /**
     * Get the column index list based on a column selection.   --- UPDATED (Dexter) 20190129
     * @param {Number} colCount - The total count of columns in a table.
     * @param {String} rangeStr - An @IndexRange parsable string specifying the column selection from the source.
     * @returns {Array<Number>} - The indexes on the columns to be selected
     */
    static getColList(colCount, rangeStr = null) {
        // If no colSel is give, it assumes to return all columns
        if (rangeStr == null) 
            return Array(colCount).fill(0).map((n,idx)=>idx);

        return IndexRange.parse(colCount, rangeStr);
    }

    /**
     * Slicing an array using column selection and batches only. Noted this provides a direct ray on slicing arrays, instead of getting list of indexes in getColList() .   --- UPDATED (Dexter) 20181210
     * @param {Array} nparray - Array of data
     * @param {String} rangeStr - Index range of column selection.
     * @param {Number} batchStart - Batch starting index (including)
     * @param {Number} batchEnd - Batch ending index (excluding)
     * @returns {Array} Sliced columns and rows of data
     */
    static colSpec(nparray, rangeStr, batchStart = "None", batchEnd = "None") {
        // If no colSel is give, it assumes to return all columns
        if (rangeStr == undefined)
            return Matrix.rowSlicing(nparray, batchStart, batchEnd);

        // Different scenarios on the column selections:
        else if (rangeStr.includes(":")) {
            // Split the ":" to find the range start and end.
            var rangeInfo = rangeStr.split(":").map(str=>str.trim());
            
            // Range slicing with None.
            if (rangeInfo.some(ele=>ele == "None" || ele == "")) {
                if (rangeInfo[0] != "None" && rangeInfo[0].length)
                    // If it is Number:None, it is slicing the ending columns
                    return Matrix.rowSlicing(nparray, batchStart, batchEnd).map(r=>r.slice(Number(rangeInfo[0])));
                else if (rangeInfo[1] != "None" && rangeInfo[1].length)
                    // If it is None:Number, it is slicing the starting columns
                    return Matrix.rowSlicing(nparray, batchStart, batchEnd).map(r=>r.slice(0,Number(rangeInfo[1])));
                else
                    // If it is None:None, it assumes to return all columns
                    return Matrix.rowSlicing(nparray, batchStart, batchEnd);
            } 
            // Range slicing without None.
            else {
                return Matrix.rowSlicing(nparray, batchStart, batchEnd).map(r=>r.slice(Number(rangeInfo[0]),Number(rangeInfo[1])));
            }
        } else {
            // Otherwise, it is specifying indexes explicitly. 
            var colCount = nparray[0].length;
            var idxs = IndexRange.parse(colCount, rangeStr);
            return Matrix.rowSlicing(nparray, batchStart, batchEnd).map(r=>r.filter((c,idx)=>idxs.includes(idx)));
        }
    }
}

/** Class representing a CSV table data source.   --- UPDATED (Dexter) 20180523 */
class CSVSource extends TableSource {
    /**
     * Create a CSV table data source.   --- UPDATED (Dexter) 20190221
     * @param {String} fileName - The file path of the csv file
     * @param {Number} colCount -  The column count in the table
     * @param {String} encoding - Encoding format of the file
     * @param {Boolean} hasHeading - Whether the table has heading
     * @param {Number} batchSize - Batch size when using batched training
     * @param {Number} testRatio - The test data proportion, in terms of %.
     * @param {Boolean} training - Setup for training use only
     * @param {Boolean} shuffle - Whether the data source will be shuffled on training
     * @param {String} name - Name of this TableSource
     * @param {Array} _oriData - Any embedded data for the project editing
     */
    constructor(fileName = "", colCount = 1, encoding="utf8", hasHeading = true, batchSize = 200, testRatio = 20, training = true, shuffle = true, name = "", _oriData = []) {
        super(_oriData, undefined, hasHeading, batchSize, testRatio, training, shuffle, name);
        this._instanceClass = Source.Types.CSV;

        // Set the data source if it has not defined the data.
        if (!this.oriData) this.setDataShape(["None", colCount]);
        
        /** @type {String} - The full/relative file path of the CSV file. */
        this._path = fileName;

        /** @type {String} - The file name of the CSV file */
        this._fileName = fileName.slice(Math.max(fileName.lastIndexOf("/"), fileName.lastIndexOf("\\"))+1);

        /** @type {String} - The type of this @Source.Config, i.e. `"CSVSource"` */
        this._type = "CSVSource";
        
        /** @type {String} - Encoding format of the file. */
        this.encoding = encoding;
    }

    /**
     * Set the path of the CSV file to read.   --- UPDATED (Dexter) 20190206
     * @param {String} path - The path of the CSV file.
     */
    setPath(path) {
        this._path = path;
        this._fileName = path.slice(Math.max(fileName.lastIndexOf("/"), fileName.lastIndexOf("\\"))+1);
    }

    /**
     * The full/relative path of the CSV file to read.   --- UPDATED (Dexter) 20190206
     * @returns {String} - The full/relative path of the CSV file to read.
     */
    get path() {
        return this._path;
    }

    /**
     * The file name of the CSV file to read.   --- UPDATED (Dexter) 20190206
     * @returns {String} - The file name of the CSV file to read.
     */
    get fileName() {
        return this._fileName;
    }
}

/** Class representing a centralized class for different image datasets as an input source.   --- UPDATED (Dexter) 20180523 */
class ImageSource extends Source.Config {
    /**
     * Create an @Source.Image object, a type of @Source.Config handling the image data sources.   --- UPDATED (Dexter) 20190221
     * @param {String} sourceType - The source type of the ImageSource, only "cifar10", "mnist" supported currently
     * @param {String} coreDataDir - The directory of the data folder places
     * @param {Boolean} flattenImg - Whether to flatten into 1D when generating the images from the source
     * @param {Array} inputItemShape - Array specifying the array shape of one input item
     * @param {Number} batchSize - Batch size when using batched training
     * @param {Boolean} training - Setup for training use only
     * @param {Boolean} shuffle - Whether the data source will be shuffled on training
     */
    constructor(sourceType = "cifar10", coreDataDir = null, flattenImg = false, batchSize = 64, training = true, shuffle = true) {
        super(Source.Types.Image, undefined, batchSize, training, shuffle);

        // Initiate some common properties.
        /** @type {Array<(String|Number)>} - The shape of the label data. */
        this._labelShape = [];
        /** @type {String} - The image source type (the renowned image dataset) of this @Source.Image object. */
        this._sourceType = null;
        /** @type {String} - The type of this @Source.Config, i.e., `"ImageSource"`. */
        this._type = "ImageSource";
        /** @type {String} - The folder directory where the renowned data source is saved. */
        this.coreDataDir = (coreDataDir != null && coreDataDir != undefined) ? coreDataDir : ("D:/tmp/" + (sourceType == "cifar10" ? "cifar10_data" : sourceType == "mnist" ? "mnist" : ""));
        /** @type {Boolean} - Whether to flatten into 1D when generating the images from the source */
        this.flattenImg = flattenImg;

        this.setSourceType(sourceType);
    }

    /**
     * The source type of this @Source.Image object.   --- UPDATED (Dexter) 20190131
     * @returns {String} - The source type.
     */
    get sourceType() {
        return this._sourceType;
    }

    /**
     * The label shape of this @Source.Image object.   --- UPDATED (Dexter) 20190131
     * @returns {Array<(Number|String)>} - The label shape.
     */
    get labelShape() {
        return this._labelShape;
    }

    /**
     * Apply the shape of a particular column config.   --- UPDATED (Dexter) 20190131
     * @param {String} dppKey - The key of the updating column config..
     * @param {Boolean} applyImmediately - Whether effect will be taken immediately on any changes once confirm proceeding layers have no conflicts.
     * @returns {TrialResult} - Return a result information: {result: Boolean - Whether the change can be applied (and updated) successfully, error: Object - Translatable information of error message} .
     */
    applyShapeChanges(dppKey, applyImmediately = true) {
        var train = this.train;
        var id = this.sourceID;
        
        // Get the latest (after changes) column config shape
        var toDataShape = this.getColShape(dppKey);

        // Create an object for the model tracing of whether this change can be applied.
        var configChanges = {type: "source", id1: id, id2: dppKey, shape: toDataShape};

        // Get all the layers from the training.
        var allLayers = [...train.layerProfiles.values()];

        // Get all the next layers
        var nextLayers = this.train.getLayersUsingSource(id, dppKey);

        // Get all the final layers that is comparing with this data source
        var nextEnds = allLayers.filter(lp=>lp._final && lp.compareSourceID == id && lp.compareTensorIdx == dppKey);

        // Identify if this layer has a next layer.
        var hasNextLayer = (nextLayers.length + nextEnds.length) > 0;

        // Check for all next layers whether they can applied with the changes.
        var result = true, error = null;
        if (hasNextLayer) {
            // Set up the centralized object.
            var centralizedMap = new Map();
            nextLayers.forEach(l=>centralizedMap.set(l.name, {status: 1, layerProfile: l, fromShapeChanges: configChanges, configChanges: {}, outputShape: null}));
            nextEnds.forEach(l=>centralizedMap.set(l.name, {status: 1, layerProfile: l, fromShapeChanges: null, configChanges: configChanges, outputShape: configChanges.shape}));
            
            // Pass the change along the model nodes, and it will receive whether conflicts occurs from their resolve/reject returns.
            var nextLayerResults = [...nextLayers.map(lp=>lp.applyShapeChanges(configChanges, undefined, centralizedMap, false))];
            [error, result] = Project.extractErrors(nextLayerResults);
        }
        
        // Try to apply this layer's change and affect the proceding layers.
        if (result) {
            if (applyImmediately) {
                // Apply the changes.
                if (hasNextLayer) centralizedMap.forEach((info, name)=>train.layerProfiles.get(name).commitChanges(info));
            }
            return new TrialResult(true);
        } else return new TrialResult(false, error);
    
    }

    /**
     * Set the source type of this @Source.Image object.   --- UPDATED (Dexter) 20190207
     * @param {String} sourceType - The source type string.
     */
    setSourceType(sourceType) {
        // Set the data source shape.
        var inputItemShape = sourceType == "cifar10" ? [32,32,3] :  sourceType == "mnist" ? [28,28,1] : [];
        this._sourceType = sourceType;
        this.setDataShape(["None", ...inputItemShape]);

        // The shape of the column configs will be manually setup depending on the source type as like the shape of the output Tensors
        var dppConfig = new DataPreprocessing.ImageNode("tf.float32", ["Image"]);
        this.setItem("input", dppConfig);

        // Set the label data shape and data type.
        if (["cifar10", "stl10-labeled", "mnist"].includes(sourceType)) {
            this._labelShape = ["None", 1];
        }

        // Set the epoch size.
        if (sourceType == "cifar10") {
            this.epochSize = this._training ? 50000 : 10000;
        } else if (sourceType == "stl10-labeled") {
            this.epochSize = this._training ? 5000 : 8000;
        } else if (sourceType == "mnist") {
            this.epochSize = this._training ? 60000 : 10000;
        }

        // Preset with a crop transformation for specific datasets.
        if (["cifar10"].includes(sourceType)) {
            var tx = new DataPreprocessing.Transformation.Image.Crop(this.oriShape[2], this.oriShape[1]);
            this.setTransform("input", tx);
        } else {
            this.clearTransform("input");
        }

        // Set the data type of the column config.
        if (["cifar10", "stl10-labeled", "mnist"].includes(sourceType)) {
            var targetDpp = new DataPreprocessing.ColumnsNode(undefined, undefined, "tf.int64");
            this.setItem("target", targetDpp);
        } else {
            this.removeItem("target")
        }
    }

    /**
     * Get the output shape of the parent of a @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190130
     * @param {String} dppKey - A parent column config key.
     * @param {String} requestingDppKey - The column config key of the requesting @DataPreprocessing.Node object. `null` if it's not requesting the preprocessing shape from another preprocessing node.
     * @param {Boolean} refresh - Whether to refresh the shape from root data.
     * @returns {Array<(Number|String)>} - The output shape.
     */
    getColShape(dppKey, requestingDppKey = null, refresh = false) {
        if (this.colConfigs.has(dppKey)) {
            return this.colConfigs.get(dppKey).getShape(refresh);
        } else if (requestingDppKey != null) {
            return requestingDppKey == "input" ? this.oriShape : requestingDppKey == "target" ? this.labelShape : [];
        }
    }

    /**
     * Get the header names of a particular data preprocessing node.   --- UPDATED (Dexter) 20190131
     * @param {String} dppNodeKey - The key for a @DataPreprocessing.Node object in @Source.Image.colConfigs .
     * @returns {Array<String>} - A list of header names.
     */
    getHeader(dppNodeKey = null) {
        return dppNodeKey == "input" ? ["Images"] : dppNodeKey == "target" ? ["Class Labels"] : ["Images", "Class Labels"];
    }

    /**
     * Get the class count of all values in a particular column config.   --- UPDATED (Dexter) 20190125
     * @param {String} dppKey - The key for the requested @DataPreprocessing.ColumnsNode object in @Source.Config.colConfigs .
     * @returns {Number} - The class count of all values in the requested column config.
     */
    getClassCount(dppKey = null) {
        if (dppKey == "target") {
            if (["cifar10", "stl10-labeled", "mnist"].includes(this.sourceType)) {
                return 10;
            } else return null;
        } else return null;
    }

    /**
     * Transform data in a particular @DataPreprocessing.Transformation.Image preprocessing node.   --- UPDATED (Dexter) 20190130
     * @param {String} dppNodeKey - The data preprocessing key that is to be applied with.
     * @param {DataPreprocessing.Transformation.Image} transforamtionConfig - A transformation configuration object.
     */
    setTransform(dppNodeKey="input", transforamtionConfig=null) {
        this.colConfigs.get(dppNodeKey).transformations.push(transforamtionConfig);
    }

    /* Clear all transform data in a particular @DataPreprocessing.Transformation.Image preprocessing node.   --- UPDATED (Dexter) 20190902
     * @param {String} dppNodeKey - The data preprocessing key that is to be applied with.
     */
    clearTransform(dppNodeKey="input") {
        this.colConfigs.get(dppNodeKey).transformations = [];
    }
}

/** Class representing a configuration of training in a build.   --- UPDATED (Dexter) 20180615 */
class TrainingProfile {
    /**
     * Create a configuration of training in a build.   --- UPDATED (Dexter) 20190220
     * @param {Number} noOfEpoch - The number of epoches the training will go over for
     * @param {Number} initialLearningRate - The initial learning rate
     * @param {Number} learningRateDecayFactor - A decay factor for gradually reducing the learning rate
     * @param {Number} numEpochsPerDecay - The number of epoches to go over before each learning rate decay takes place
     * @param {Number} exponentialLossDecay - The exponential decay factor for reducing the moving average of the loss
     * @param {Number} exponentialVarDecay - The exponential decay factor for reducing the moving average of the training variables
     * @param {Number} crossValidationCount - The no. of rounds to go over for a cross validation epoch
     * @param {Number} crossValidationType - The type of cross validation
     * @param {Number} crossValidationProportion - The proportion of training data partition to take as a validation dataset
     * @param {String} optimizer - An optimizer for training the models
     * @param {Object} optimizerParams - Tensorflow optimizer paramerters in an object
     */
    constructor(noOfEpoch = 200, initialLearningRate = 0.001, learningRateDecayFactor = null, numEpochsPerDecay = null, exponentialLossDecay = 0.9, exponentialVarDecay=0.9999, crossValidationCount=0, crossValidationType="None", crossValidationProportion=0.2, optimizer="adam", optimizerParams = {}) {
        /** @type {Number} - The number of epoch to train in this build. */
        this.noOfEpoch = noOfEpoch;
        /** @type {Number} - The initial learning rate of training. */
        this.initialLearningRate = initialLearningRate;
        /** @type {Number} - The discount factor of each step of learning rate decay. */
        this.learningRateDecayFactor = learningRateDecayFactor;
        /** @type {Number} - The number of training epoch for each learning rate decay. */
        this.numEpochsPerDecay = numEpochsPerDecay;
        this.exponentialLossDecay = exponentialLossDecay;
        this.exponentialVarDecay = exponentialVarDecay;
        /** @type {String} - An optimizer for training the models */
        this.optimizer = optimizer;
        /** @type {Object<String,*>} - Tensorflow optimizer paramerters in an object. */
        this.optimizerParams = optimizerParams;

        /** @type {String} - The type of cross validation; `"None"` for no cross validation is to be used. */
        this.crossValidationType = crossValidationType;
        /** @type {Number} - The proportion of training data partition to take as a validation dataset. Normally for K-fold cross validation, the proportion is 1/K. */
        this.crossValidationProp = crossValidationProportion;
        /** @type {Number} - The number of cross validation rounds. For K-fold cross validation, one round will include K training rounds. For random cross validation, one round will inclue one training round.  */
        this.crossValidationCount = crossValidationCount;

        // Only 3 types of cross validation are supported.
        if (["None", "fold", "rand"].includes(crossValidationType))
            this.crossValidationType = crossValidationType;

        // Noted if the validation proportion is 1/0, or no cross validation rounds, it acts just like no cross validation.
        if (crossValidationProportion == 1 || crossValidationProportion == 0 || crossValidationCount == 0) {
            this.crossValidationType = "None";
            this.crossValidationProp = 0;
            this.crossValidationCount = 0;
        } else {
            if (crossValidationProportion > 1){
                // If cross validation propotion is over 1, it assumes it represents the no. of partition on the training data
                this.crossValidationProp = 1/crossValidationProportion;
                this.crossValidationCount = Math.round(crossValidationCount);
            } else {
                this.crossValidationProp = crossValidationProportion;
                this.crossValidationCount = Math.round(crossValidationCount);
            }
        }
    }

    /**
     * Export this TrainingProfile into a represtable object for project saving.   --- UPDATED (Dexter) 20180524
     * @returns {Object} JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this TrainingProfile, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>obj[k] = this[k]);
        return obj;
    }

    /**
     * Parse a previously saved object into this class of TrainingProfile.   --- UPDATED (Dexter) 20180524
     * @param {*} obj - JSON object from Project file
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the TrainingProfile Class.
        [...Object.keys(obj)].forEach(k=>{
            this[k] = obj[k];
        })
    }
}

/** Class representing a Tensorflow training.   --- UPDATED (Dexter) 20180701 */
class Train {
    /**
     * Creates a Tensorflow training.   --- UPDATED (Dexter) 20190128
     * @param {Project} project - The frontend project the user is working on while this training is attached to
     * @param {String} trainName - The name of this training.
     * @param {(TrainSource[]|TrainSource)} source - A training source or a list of training source that this training is using
     * @param {String} folder - The folder that this training results folder will save to.
     * @param {String} restorePath - A directory that referencing Tensorflow checkpoint files that this training will recover from.   --- BETA
     * @param {String} device - The device like CPU or GPU this training will rely on.
     * @param {Number} logFreq - The train logging frequency (per training step).
     * @param {Number} saveFreq - The model saving frequency (per training step).
     * @param {Number} testFreq - The test (with either validation or test dataset) frequency (per training step).
     * @param {Number} traceFreq - The trace logging frequency (per training step).
     * @param {Number} weightLogFreq - The weight logging frequency (per training step).
     * @param {Number} filterFreq - The image filter logging frequency (per training step).
     * @param {Number} runCount - The count of multi-run setup.
     * @param {TrainingProfile} trainingProfile - The training profile configuration this training is using
     * @param {Number} traceRecord - The count of records to trace with along the training.
     */
    constructor(project, trainName = "", source = null, folder = "", restorePath = null, device = '/cpu:0', logFreq = 0, saveFreq = 0, testFreq = 0, traceFreq = 0, weightLogFreq = 0, filterFreq = 0, runCount = null, trainingProfile = null, traceRecord=0) {
        /** @type {String} - The name of this training. */
        this.trainName = trainName;
        /** @type {String} - The folder that this training results folder will save to. */
        this.folder = folder;
        /** @type {Number} - The train logging frequency (per training step). */
        this.logFreq = logFreq;
        /** @type {Number} - The model saving frequency (per training step). */
        this.saveFreq = saveFreq;
        /** @type {Number} - The test (with either validation or test dataset) frequency (per training step). */
        this.testFreq = testFreq;
        /** @type {Number} - The weight logging frequency (per training step). */
        this.weightLogFreq = weightLogFreq;
        /** @type {Number} - The trace logging frequency (per training step). */
        this.traceFreq = traceFreq;
        /** @type {Number} - The image filter logging frequency (per training step).   --- RESERVED */
        this.filterFreq = filterFreq;
        /** @type {String} - The device like CPU or GPU this training will rely on. */
        this.device = device;
        /** @type {Map<String,ModelNode.Layer.Config>} - A key-value map storing all @ModelNode.Config objects in this @Train object. */
        this.layerProfiles = new Map();
        /** @type {Array<TrainingProfile>} - A list of all @TrainingProfile objects with array order as each build. */
        this.trainingProfiles = [trainingProfile || new TrainingProfile()];
        /** @type {Number} - The count of records to trace with along the training. */
        this.traceRecord = traceRecord;
        /** @type {Array<Array<*>>} - An array of all the items to be traced. */
        this.traceItems = [];
        /** @type {Array<TrainSource>} - A list of all @Source.Config training source objects attached to this @Train object. */
        this.sources = [];
        if (source != null) {
            if (source instanceof Array) this.setDataSources(...source);
            else this.addDataSource(source);
        }
        /** @type {Array<TrainSource>} - A list of all @Source.Config test source objects attached to this @Train object. */
        this.testSources = [];
        /** @type {String} - A directory that referencing Tensorflow checkpoint files that this training will recover from.   --- BETA */
        this.restorePath = restorePath;
        /** @type {Number} - The count of multi-run setup. */
        this.runCount = runCount || 1;
        /** @type {Number} - The current editing build no. */
        this._editingBuild = 0;
        /** @type {Array<Number|String>} - A tuple of training source id and column configuration key for specifying the editing @DataPreprocessing.ColumnsNode object. */
        this._editingColConfig = null;
        /** @type {Number} - The source id for specifying the editing @Source.Config object. */
        this._editingSource = 0;
        /** @type {String} - The layer name for specifying the editing @LayerProject object, also as the key in @Train.layerProfiles `Map` object. */
        this._editingLayer = "";
        /** @type {Project} - A reference to the project where this training belongs to. */
        this._project = project;
        /** @type {Number} - An auto-increment ID for naming of @ModelNode.Config objects injecting to this @Train object. */
        this._layerIDInc = 1;
    }

    /**
     * Export this Train into a represtable object for project saving.   --- UPDATED (Dexter) 20180524
     * @returns {Object} JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this Train, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>{
            if (k == "sources" || k == "trainingProfiles") {
                // Noted the sources and training profiles are other classes of objects that they will handle themselves.
                obj[k] = this[k].map(v=>v.exportAsJSON());
            } else if (k == "layerProfiles") {
                // Noted the .layerProfiles property is a Map() object, and now converting to a 2D array, while each LayerProfile will handle themselves.
                obj[k] = [...this[k].entries()].map(v=>[v[0],v[1].exportAsJSON()]);
            } else if (!["_project", "testSources", "_editingProfile", "_editingSource", "_editingColConfig"].includes(k)) {
                obj[k] = this[k];
            }
        })
        return obj;
    }

    /**
     * Parse a previously saved object into this class of Train.   --- UPDATED (Dexter) 20190221
     * @param {Object} obj - JSON object from Project file
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the Train Class.
        [...Object.keys(obj)].forEach(k=>{
            if (k == "sources") {
                // If it is a source, it will need to create their class and parse themselves.
                this.setDataSources(...obj[k].map(v=>{
                    var source = TrainSource.parseJSON(v);
                    new SpreadSheet("dataSourcePreview", 10, 3, source.hasHeading, false, true, true, null, false);
                    new SpreadSheet("colDataPreview", 10, 3, source.hasHeading, false, true, true, null, false);
                    return source;
                }));
            } else if (k == "trainingProfiles") {
                // If it is a training profile, it will need to create its class and parse itself.
                this.trainingProfiles = obj[k].map(v=>{
                    var tp = new TrainingProfile();
                    tp.parseJSON(v);
                    return tp;
                })
            } else if (k == "layerProfiles") {
                // If it is a layer profile, it will need to create its class and parse itself.
                this.layerProfiles = new Map(obj[k].map(v=>{
                    var lp = ModelNode.parseJSON(v[1]);
                    lp.train = this;
                    return [v[0], lp];
                }))

                // Noted the layer profile will have cross referencing, so it is done now after all layer profiles are created.
                this.layerProfiles.forEach(l=>{
                    // Complicated parsing, due to backward compatibility of 1 dimension connection without updated multi-build support.   --- TEMP (Dexter) 20181121
                    l.toNode = l.toNode.length ? (l.toNode[0] instanceof Array ? l.toNode.map(build=>build.map(ln=>this.layerProfiles.get(ln))) : [l.toNode.map(ln=>this.layerProfiles.get(ln))]): [[]];
                    l.fromNode = l.fromNode.length ? (l.fromNode[0] instanceof Array ? l.fromNode.map(build=>build.map(ln=>this.layerProfiles.get(ln))) : [l.fromNode.map(ln=>this.layerProfiles.get(ln))]) : [[]];
                    if (l.fromSource.length) {
                        if (l.fromSource.some(build=>build.length && !(build[0] instanceof Array))) {
                            l.fromSource = [l.fromSource];
                        }
                    } else l.fromSource = [[]];
                    
                    // Recover the incoming config node.
                    if (l.incomingConfig.coreNode) {
                        l.incomingConfig.coreNode = this.train.layerProfiles.get(l.incomingConfig.coreNode);
                    }

                    // Recover the incoming config node transformGate.
                    if (l.incomingConfig.transformGate) {
                        l.incomingConfig.transformGate = this.train.layerProfiles.get(l.incomingConfig.transformGate);
                    }
                })
            } else if (!["_project", "testSources", "_editingProfile", "_editingSource", "_editingColConfig"].includes(k)) {
                this[k] = obj[k];
            }  
        })
    }

    /**
     * Add a training data source to this training.   --- UPDATED (Dexter) 20180625
     * @param {TrainSource} source - A TrainSource data source
     */
    addDataSource(source) {
        this.sources.push(source);
        source.train = this;
    }

    /**
     * Set multiple training data sources to this training, while previous sources will be disposed.   --- UPDATED (Dexter) 20180625
     * @param {...TrainSource} sources - Multiple TrainSource data source objects
     */
    setDataSources(...sources) {
        this.sources = sources;
        sources.forEach(s=>s.train = this);
    }

    /**
     * Get the data source from a pair of source id and column config key.   --- UPDATED (Dexter) 20181217
     * @param {Number} sourceID - The source id.
     * @param {String} dppKey - The column config name.
     * @returns {DataPreprocessing.Node} - A specific column configuration.
     */
    getDataSource(sourceID, dppKey) {
        return this.sources[sourceID].colConfigs.get(dppKey);
    }

    /**
     * Get a list of layers directly using a particular data source.   --- UPDATED (Dexter) 20181217
     * @param {Number} sourceID - The source id.
     * @param {String} dppKey - The column config name.
     * @returns {ModelNode.Layer.Config[]} - A list of layer profile objects.
     */
    getLayersUsingSource(sourceID, dppKey) {
        const buildNo = this._editingBuild;
        return [...this.layerProfiles.values()].filter(lp=>lp.fromSource[buildNo].some(s=>s[0] == sourceID && s[1] == dppKey));
    }

    /**
     * Get a list of layers relayting a particular data source, including task layer comparisons or sequence processing.   --- UPDATED (Dexter) 20190130
     * @param {Number} sourceID - The source id.
     * @param {String} dppKey - The column config name.
     * @returns {ModelNode.Layer.Config[]} - A list of layer profile objects.
     */
    getLayersRelatingSource(sourceID, dppKey) {
        const buildNo = this._editingBuild;
        return [...this.layerProfiles.values()].filter(lp=>lp.relatedSources[buildNo].some(s=>s[0] == sourceID && s[1] == dppKey));
    }

    /**
     * Get all the available column configurations.   --- UPDATED (Dexter) 20181217
     * @returns {Array<DataPreprocessing.Node>} - An array of column configurations.
     */
    getAllColConfigs() {
        return Matrix.flatten(this.sources.map(s=>[...s.colConfigs.values()]));
    }

    /**
     * Set the property of this Train or one of its objects like layers, sources, etc.   --- UPDATED (Dexter) 20190129
     * @param {Element} ele - An HTML element of the user-interacting properties changes
     * @param {String} propType - The property type, like a train, training source, layer, etc.
     * @param {String} prop - The property name
     * @param {*} toValue - The value to be set
     * @param {String} id - A sub-id referencing, typically referring the id of a @TrainingProfile object.
     */
    setProp(ele,propType, prop, toValue, id) {

        if (propType == "Train") {
            if (prop == "device") {
                // CNN dilation is not supported in CPU calculation.
                if (toValue.startsWith("/cpu") && [...this.layerProfiles.values()].some(lp=>lp.convDilation != 0)) InputBox.showError(ele, "dilationDeviceErr", true);
                else this[prop] = toValue;
            } else {
                // If it's referring to "Train", the property is updating on this Train object.
                this[prop] = toValue;
            }
        } else if (propType == "TrainSource") {
            if (prop == "addColConfig") {
                if (toValue.trim().length) {
                    // Get the editing source id.
                    var source = id || this._editingSource;
                    var trial = this.sources[source].applyShapeChanges(source, ele.dataset.forColConfig, toValue, true);
                    if (!trial.result) {
                        InputBox.showError(ele, trial.error || "colAddError", true);
                    } else {
                        this._project.drawTrain();
                    }
                } 
            } else if (prop == "sourceType") {
                // Try to update the shape.
                var oldSourceType = this.sources[this._editingSource][prop];
                this.sources[this._editingSource].setSourceType(toValue);

                // Get the prepropcessing node.
                var dppNode = this.getDataSource(this._editingSource, "input");

                // Refresh preprocessing shape.
                dppNode.refreshDataShape();

                // Refresh the crop size.
                var oriShape = dppNode.getInputShape().slice(1);
                var txCrop = dppNode.transformations.filter(tx => tx instanceof DataPreprocessing.Transformation.Image.Crop);
                if (txCrop.length) {
                    txCrop[txCrop.length - 1].width = oriShape[1];
                    txCrop[txCrop.length - 1].height = oriShape[0];
                }

                // Refresh preprocessing shape.
                dppNode.refreshItemShape();

                var applyApplicable = this.sources[this._editingSource].applyShapeChanges("input", true);
                if (applyApplicable.result) {
                    // Redraw the graph.
                    this._project.drawTrain();

                    // Update the properties pane.
                    Project.now.showProp("TrainSource");
                } else {
                    // Revert the source type.
                    this.sources[this._editingSource].setSourceType(oldSourceType);
                    
                    // Refresh preprocessing shape.
                    dppNode.refreshDataShape();
                    
                    // Refresh the crop size.
                    var oriShape = dppNode.getInputShape().slice(1);
                    var txCrop = dppNode.transformations.filter(tx => tx instanceof DataPreprocessing.Transformation.Image.Crop);
                    if (txCrop.length) {
                        txCrop[txCrop.length - 1].width = oriShape[1];
                        txCrop[txCrop.length - 1].height = oriShape[0];
                    }

                    // Refresh preprocessing shape.
                    dppNode.refreshItemShape();
                    
                    InputBox.showError(ele, applyApplicable.error || "shapeAffected", true);
                }
            } else {
                // Other properties will be directly updated with no model tracing.
                this.sources[this._editingSource][prop] = toValue;
            }

        } else if (propType == "Layer") {

            // Get the layer profile.
            var layer = this.layerProfiles.get(this._editingLayer);

            if (["layerUnits", "convFilterWidth", "convDilation", "convPadding", "_convStrideX", "_convStrideY"].includes(prop)) {
                // If it's changing shape-related property, this would need model tracing.
                var configChanges = {};
                if (prop == "_convStrideX") configChanges["convStride"] = [toValue, layer["convStride"][1]];
                if (prop == "_convStrideY") configChanges["convStride"] = [layer["convStride"][0], toValue];
                configChanges[prop] = toValue;
                var applyApplicable = layer.applyShapeChanges(undefined, configChanges);
                if (applyApplicable.result) this._project.drawTrain();
                else InputBox.showError(ele, applyApplicable.error || "shapeAffected", true);
            } else if (prop == "refLayerName") {
                if (toValue == null) {
                    // Activate other configuration and hide the reference layer transpose option.
                    Project.activateLayerConfigs();
                    $("propTransRefWeightRow").classList.add("noDisplay");
                    layer[prop] = toValue;
                } else {
                    // Inactivate other configuration and show the reference layer transpose option.
                    Project.inactivateLayerConfigs();
                    $("propTransRefWeightRow").classList.remove("noDisplay");

                    // Re-check the layer configurations and apply the updates.
                    var refLayer = this.layerProfiles.get(toValue);

                    // Determine the shape match with this editing layer to check if transpose if needed.
                    var thisInputShapes = layer.getPreprocessedIncomingShape();
                    var lInputShape = refLayer.getPreprocessedIncomingShape();
                    var lOutputShape = refLayer.getOutputShape();
                    var refLayerTranspose = shapeEquals(lInputShape, thisInputShapes) ? false : shapeEquals(lOutputShape, thisInputShapes) ? true : null;
                    
                    // If no matched shape, this is not a referenceable layer.
                    if (refLayerTranspose === null) InputBox.showError(ele, applyApplicable.error || "notreferenceable", true);
                    else {
                        // Check if it is changeable.
                        var newOutputShape = refLayerTranspose ? lInputShape : lOutputShape;
                        var configChanges = {type: "layer", id1: this.name, refLayerName: toValue};
                        var applyApplicable = layer.applyShapeChanges(null, configChanges, undefined, true);
                        if (!applyApplicable.result) InputBox.showError(ele, applyApplicable.error || "notreferenceable", true);
                        else {
                            Project.now.showProp("Layer");
                            this._project.drawTrain();
                        }
                    }
                }
            } else if (prop == "predictOn") {
                // Update the Final Layer prediction columns.
                var configChanges = {};
                configChanges["compareSourceID"] = ele.selectedOptions[0].dataset.sourceID;
                configChanges["compareTensorIdx"] = ele.selectedOptions[0].dataset.cfKey;
                var applyApplicable = layer.applyShapeChanges(undefined, configChanges);
                if (applyApplicable.result) this._project.drawTrain();
                else InputBox.showError(ele, applyApplicable.error || "shapeAffected", true);
            } else {
                // Some non-shape affecting properties that may inherit through referencing layers.
                if (["weightAvg", "weightL1Loss", "weightL2Loss", "weightStdDev", "weightDecayRate"].includes(prop)) {
                    [...this.layerProfiles.values()].filter(lp=>lp.refLayerName == layer.name).forEach(lp=>{
                        lp[prop] = toValue;
                    })
                }
                // Otherwise, just update the properties in the layer proofile.
                layer[prop] = toValue;
            }

        } else if (propType == "TrainingProfile") {

            // If it's on training profile, just update the properties on it.
            this.trainingProfiles[Number(id)][prop] = toValue;

        } else if (propType == "IncomingConfig") {
            // Get the layer profile.
            var layer = this.layerProfiles.get(this._editingLayer);
            
            // If it's changing shape-related property, this would need model tracing.
            var configChanges = {};

            // Get the incoming config.
            if (prop == "method" || prop == "_instanceClass") {
                configChanges.incomingConfig = new IncomingConfig[toValue]();
            } else {
                configChanges.incomingConfig = this.layerProfiles.get(this._editingLayer).incomingConfig;
            }

            // For specific methods, set the values from the corresponding enumeration list.
            if (prop == "mergeDim") {
                configChanges.incomingConfig[prop] = IncomingConfig.MergeDimTypes[toValue];
            } else if (prop != "method" && prop != "_instanceClass") {
                configChanges.incomingConfig[prop] = toValue;
            }
           
            // Apply shape changes.
            var applyApplicable = layer.applyShapeChanges(undefined, configChanges);
            if (applyApplicable.result) this._project.drawTrain();
            else InputBox.showError(ele, applyApplicable.error || "shapeAffected", true);
        } else if (propType == "OutputConfig") {
            // Get the layer profile.
            var layer = this.layerProfiles.get(this._editingLayer);
            
            // If it's changing shape-related property, this would need model tracing.
            var configChanges = {};

            // Get the incoming config.
            if (prop == "method" || prop == "_instanceClass") {
                configChanges.outputConfig = new OutputConfig[toValue]();
            } else {
                configChanges.outputConfig = this.layerProfiles.get(this._editingLayer).outputConfig;
                configChanges.outputConfig[prop] = toValue;
            }

            // Apply shape changes.
            var applyApplicable = layer.applyShapeChanges(undefined, configChanges);
            if (applyApplicable.result) this._project.drawTrain();
            else InputBox.showError(ele, applyApplicable.error || "shapeAffected", true);
        } else if (propType == "VarConfig.Initializer") {
            // Get the layer profile.
            var layer = this.layerProfiles.get(this._editingLayer);
            var loc = id.split(".");

            if (prop == "_type") {
                // Try to use a new variable initializer.
                var varConfig = layer.getValue(...loc.slice(0,-1));
                
                // Assign the new var config object.
                varConfig[loc.slice(-1)[0]] = new VarConfig[toValue]();
            } else {
                // Get the existing variable initializer.
                var varConfigInit = layer.getValue(...loc);

                // Update the property;
                varConfigInit[prop] = toValue;
            }
        } else if (propType == "VarConfig") {
            // Get the var config object..
            var varConfig = this.layerProfiles.get(this._editingLayer).getValue(...id.split("."));
            
            // Update the value of the var config object.
            varConfig[prop] = toValue;
        } else if (propType == "DCNNLayer.PaddingTypes") {
            // Get the layer profile.
            var layer = this.layerProfiles.get(this._editingLayer);
            
            // Update the value of the padding method.
            layer[prop] = DCNNLayer.PaddingTypes[toValue];
        } else if (propType == "ColConfig") {
            if (prop == "sourceCol") {
                if (toValue.trim().length) {
                    // Try update the shape.
                    var colConfig = this.getDataSource(...this._editingColConfig);
                    var source = this.sources[this._editingColConfig[0]];
                    var trial = source.applyShapeChanges(this._editingColConfig[0], this._editingColConfig[1], toValue, true);
                    if (!trial.result) {
                        InputBox.showError(ele, "colSelectionError", true);
                    } else {
                        this._project.drawTrain();
                    }
                } else {
                    InputBox.showError(ele, "colSelectionMust", true);
                }
            } else if (prop == "_outW" || prop == "_outH") {
                // These are ImageSource image outputshape editing.
                var dppNode = this.getDataSource(...this._editingColConfig);
                var oriShape = dppNode.getShape().slice(1);
                var txCrop = dppNode.transformations.filter(tx => tx instanceof DataPreprocessing.Transformation.Image.Crop);
                if (txCrop.length) {
                    txCrop[txCrop.length - 1].width = prop == "_outW" ? Number(toValue) : oriShape[1];
                    txCrop[txCrop.length - 1].height = prop == "_outH" ? Number(toValue) : oriShape[0];
                }

                // Refresh preprocessing shape.
                dppNode.refreshDataShape();
                
                var applyApplicable = this.sources[this._editingSource].applyShapeChanges("input", true);
                if (applyApplicable.result) {
                    this._project.drawTrain();
                } else {
                    txCrop[txCrop.length - 1].width = oriShape[1];
                    txCrop[txCrop.length - 1].height = oriShape[0];

                    // Refresh preprocessing shape.
                    dppNode.refreshDataShape();

                    InputBox.showError(ele, applyApplicable.error || "shapeAffected", true);
                }
            } else if (prop == "onehot") {
                // Set the column ranges of one hot encoding.
                var trial = this.sources[this._editingColConfig[0]].setOneHot(this._editingColConfig[1], toValue);
                if (trial.result == false) InputBox.showError(ele, trial.error || "onehotError", true);
            } else {
                // Get the column config.
                var colConfig = this.getDataSource(...this._editingColConfig);

                // Update the value of the padding method.
                var oriValue = colConfig[prop];
                colConfig[prop] = toValue;

                if (prop == "dtype") {
                    // Check the change changes if needed
                    var applyApplicable = this.sources[this._editingSource].applyShapeChanges(this._editingColConfig[0], this._editingColConfig[1], null, true);
                    if (!applyApplicable.result) {
                        colConfig[prop] = oriValue;
                        InputBox.showError(ele, applyApplicable.error || "dtypeAffected", true);
                    } else {
                        SpreadSheet.get("colDataPreview").setData(this.sources[this._editingSource].getColTable(this._editingColConfig[1]));
                    }
                }
            }
        }
    }

    /**
     * Get the value of a requested property.   --- UPDATED (Dexter) 20190213
     * @param {String} propType - The property type, like a train, training source, layer, etc.
     * @param {String} prop - The property name
     * @param {String} id - A sub-id referencing, typically referring the id of a TrainingProfile
     * @returns {*} The value of the property
     */
    getProp(propType, prop, id) {
        if (propType == "Train") {
            // If it's referring to "Train", the property is directly on this Train object.
            return this[prop];
        } else if (propType == "TrainSource") {
            // Access the values on the TrainSource using the property string.
            return this.sources[this._editingSource][prop];
        } else if (propType == "Layer") {
            if (prop == "predictOn") {
                // If it's a fial layer, it may need to obtain the prediction info.
                var layer = this.layerProfiles.get(this._editingLayer);
                return [["sourceID", layer.compareSourceID], ["cfKey", layer.compareTensorIdx]]
            } else {
                // If it's a layer profile, get the layer first and access using the property string.
                return this.layerProfiles.get(this._editingLayer)[prop];
            }
        } else if (propType == "TrainingProfile") {
            // If it's a training profile, get the profile using id and access using the property string.
            return this.trainingProfiles[Number(id)][prop];
        } else if (propType == "IncomingConfig") {
            // If it's a layer incoming config, get the layer first and access using the property string.
            const incomingConfig = this.layerProfiles.get(this._editingLayer).incomingConfig;

            // For specific methods, get the values from the corresponding enumeration list.
            if (prop == "method" || prop == "_instanceClass") return IncomingConfig.Types.getName(incomingConfig[prop]);
            else if (prop == "mergeDim") return IncomingConfig.MergeDimTypes.getName(incomingConfig[prop]);
            else return incomingConfig[prop];
        } else if (propType == "OutputConfig") {
            // If it's a layer output config, get the layer first and access using the property string.
            const outputConfig = this.layerProfiles.get(this._editingLayer).outputConfig;

            // For specific methods, get the values from the corresponding enumeration list.
            if (prop == "method" || prop == "_instanceClass") return OutputConfig.Types.getName(outputConfig[prop]);
            else if (prop == "shape") {
                return `[${(this.getDataSource(...this._editingColConfig)[prop].join(", "))}]`;
            } else return outputConfig[prop];
        } else if (propType == "VarConfig.Initializer") {
            // Get the initializer.
            const loc = id.split(".");
            var varConfigInit = this.layerProfiles.get(this._editingLayer).getValue(...loc);

            // For specific methods, get the values from the corresponding enumeration list.
            return varConfigInit[prop];
        } else if (propType == "DCNNLayer.PaddingTypes") {
            // Get the value.
            const value = this.layerProfiles.get(this._editingLayer)[prop];

            // For specific methods, get the values from the corresponding enumeration list.
            return DCNNLayer.PaddingTypes.getName(value);
        } else if (propType == "ColConfig") {
            // If it's a column config, using the property string.
            return this.getDataSource(...this._editingColConfig)[prop];
        }
    }
    
    /**
     * Apply the shape of a particular column config or layer.   --- UPDATED (Dexter) 20180823
     * @param {String} type - Whether it is a data source or a layer.
     * @param {Array} toValue - A shape array or column selection array depending on what type of layer is to be changed.
     * @param {Number|String} id - Source ID if it is a training source; layer name if it is a layer.
     * @param {String} id2 - @DataPreprocessing.ColumnsNode key if it is a training source.
     * @param {Boolean} applyImmediately - Whether the shapes are updated immediately.
     * @returns {Object} - Return a result information: {result: Boolean - Whether the change can be applied (and updated) successfully, error: Object - Translatable information of error message} .
     */
    applyShapeChanges(type, toValue, id, id2, applyImmediately = true) {
        if (type == "source") {
            return this.sources[id].applyShapeChanges(id, id2, toValue, applyImmediately);
        } else if (type == "layer") {
            return this.layerProfiles.get(id).applyShapeChanges(null, toValue, undefined, applyImmediately);
        }
    }

    /**
     * Get a automated new profile name for the layer profile.   --- UPDATED (Dexter) 20181029
     * @param {ModelNode.Layer.Config} layerProfile - A layer profile without name.
     */
    getNewLayerName(layerProfile) {
        // If no layer name is given, the layer name will be the layer type followed by an incremental layer ID
        const nowLayerID = this.getNewLayerID();
        layerProfile.name = layerProfile._type +" " + nowLayerID;
        layerProfile._ltTemp = "$$$ " + nowLayerID;
        layerProfile._lt = layerProfile._type;
    }
    
    /**
     * Append a layer to the end node of the editing model.   --- UPDATED (Dexter) 20181029
     * @param {ModelNode.Layer.Config} layerProfile - A layer profile to be appended.
     * @param {Number|String|DataPreprocessing.Node|ModelNode.Layer.Config|null} appendAt - The source ID appending on, or the layer name appending on.
     * @returns {Boolean} - Whether it has been successful to append the layer.
     */
    appendLayer(layerProfile = new BasicLayer(), appendAt = null) {
        // If no layer name is given, get a new name automatically.
        if (!layerProfile.name) this.getNewLayerName(layerProfile);

        if  (!this.layerProfiles.has(layerProfile.name)) {
            // If there is no existing layer with the same name, action proceeds.
            if (layerProfile.train == null) {
                // If the layer is really new with no training its originally referencing, action proceeds.

                // Assign this Train to the layerProfile.train for referencing itself.
                layerProfile.train = this;

                // An indicator success to see if it can be finally added.
                var success = false;

                // Different case depending on using automatic append or specific appendType.
                if (appendAt == null) {
                    // If automatic, trace the latest layer profile.
                    var finalLayerProfiles = this.getEndingLayerProfiles();
                    // In case there is one and only one layer, try append the new layer on it
                    if (finalLayerProfiles.length == 1)
                        success = finalLayerProfiles[0].appendNode(layerProfile);
                    // If no latest layer, and there is one and only one training source, try append on that source.
                    else if ((finalLayerProfiles).length == 0 && (this.sources).length <= 1)
                        success = layerProfile.addSources(true, 0);
                } else if (classof(appendAt) == "String") {
                    // If it's specifically appending on a layer, get that layer and append on it.
                    success = this.layerProfiles.get(appendAt).appendNode(layerProfile);
                } else if (appendAt instanceof LayerProfile) {
                    // Append the new layer to the previous layer.
                    success = appendAt.appendNode(layerProfile);
                } else if (classof(appendAt) == "Number" || (appendAt instanceof DataPreprocessing.Node)) {
                    // If it's specifically appending on a training source, set the source on this new layer.
                    success = layerProfile.addSources(true, appendAt);
                }
                
                // If it's fine to append the layer, add this new layer to .layerProfiles, and redraw the model.
                if (success) {
                    this.layerProfiles.set(layerProfile.name,layerProfile);
                    this._project.drawTrain();
                    return true;
                } 
            }
        }
        return false;
    }

    /**
     * Attach a layer to one or more specific sources or existing layers.   --- UPDATED (Dexter) 20181029
     * @param {String|ModelNode.Layer.Config} layerProfile - The layer profile to be attached.
     * @param {...String|ModelNode.Layer.Config|Number|Array|DataPreprocessing.Node} layerOrSources - A list of source index, with its corresponding generated tensor index.
     * @param {Number} LayerOrSources[0] - The source index in case of making a index-key pair for stating a source. 
     * @param {String} LayerOrSources[1] - The source config key in case of making a index-key pair for stating a source. 
     * @returns {Boolean} - Whether it has been successful to append the layer.
     */
    attachLayer(layerProfile, ...layerOrSources) {
        //   1-1.  If only a string is given, find the layer from all layer profiles.
        if (!(layerProfile instanceof LayerProfile)) layerProfile = this.layerProfiles.get(layerProfile);
        
        //   1-2.  If there has not been name given, assign a unique layer name to it.
        if (!layerProfile.name) this.getNewLayerName(layerProfile);

        //   2. Assign the LayerProfile to this Train.
        layerProfile.train = this;

        //   3.  Loop all attaching layer or sources.
        var success = layerOrSources.every(ls=>{
            if (classof(ls) == "String" || ls instanceof LayerProfile) {
                //   3A. If this is a layer.
                //   Get the previous layer and append on it.
                const previousLayer = (classof(ls) == "String") ? this.layerProfiles.get(ls) : ls;
                return previousLayer.appendNode(layerProfile);
            } else {
                //   3B. If this is a data source.  
                //   Add the source to the layer profile.
                return layerProfile.addSources(false, ls);
            }
        });

        //  4.  If it's fine to attach, redraw the model.
        if (success) {
            //  4A. Set the layer profile into this train, and update the order.
            this.layerProfiles.set(layerProfile.name, layerProfile);
            if (!layerProfile._final) this.getFinalLayers().forEach(lp=>lp.updateOrder());
            
            //  4B. Draw the train.
            this._project.drawTrain();

            return true;
        } else {
            //  4B. Revert to previous state.
            //  4B-1.   Remove this layer from previous layers.
            layerOrSources.forEach(ls=>{
                if (classof(ls) == "String" || ls instanceof LayerProfile) {
                    const previousLayer = (classof(ls) == "String") ? this.layerProfiles.get(ls) : ls;
                    previousLayer.removeConnectionTo(layerProfile);
                } else {
                    layerProfile.removeSources(ls);
                }
            });

            return false;
        }
    }
    
    /**
     * Connect an existing layer or source to another layer.   --- UPDATED (Dexter) 20181220
     * @param {String|ModelNode.Layer.Config|Number|Array|DataPreprocessing.Node} fromLayerOrSource - The layer profile to be attached.
     * @param {...String|ModelNode.Layer.Config} layerProfiles - A list of source index, with its corresponding generated tensor index.
     * @param {Number} fromLayerOrSource[0] - The source index in case of making a index-key pair for stating a source. 
     * @param {String} fromLayerOrSource[1] - The source config key in case of making a index-key pair for stating a source. 
     * @returns {Boolean} - Whether it has been successful to append the layer.
     */
    connectLayer(fromLayerOrSource, ...layerProfiles) {
        // 1. Define where it will assign source, and the actual previous node parameter to be passed.
        var assignSource = false, previousNode;

        if (classof(fromLayerOrSource) == "String" || fromLayerOrSource instanceof LayerProfile) {
            //  2A. If this is a layer, get the layer profile object.
            previousNode = (classof(fromLayerOrSource) == "String") ? this.layerProfiles.get(fromLayerOrSource) : fromLayerOrSource;
        } else {
            //  2B. If this is a source, the parameter will be passed and it will be added to the layerProfiles' source.
            previousNode = fromLayerOrSource;
            assignSource = true;
        }

        //  3. If it's fine to attach, redraw the model.
        //  3-1. If only a string is given, find the layer from all layer profiles.
        layerProfiles = layerProfiles.map(lp => (lp instanceof LayerProfile) ? lp : this.layerProfiles.get(lp));

        var success = layerProfiles.every(lp=>{
            //  3-2.  If there has not been name given, assign a unique layer name to it.
            if (!lp.name) this.getNewLayerName(lp);

            //  3-3. Assign the LayerProfile to this Train.
            lp.train = this;

            //  3-4. Try add the source / node and return the results.
            return assignSource ? lp.addSources(false, previousNode) : previousNode.appendNode(lp);
        });

        //  4.  If it's fine to connect, redraw the model.
        if (success) {
            //  4A-1. Set the layer profile into this train, and update the order.
            layerProfiles.forEach(lp => this.layerProfiles.set(lp.name, lp));
            this.getFinalLayers().forEach(lp=>lp.updateOrder());
            
            //  4A-2. Draw the train.
            this._project.drawTrain();

            return true;
        } else {
            //  4B. Revert to previous state.
            if (!assignSource) {
                //  4B-A.   Remove later layers from this layer.
                layerProfiles.forEach(lp=>previousNode.removeConnectionTo(lp));
            } else {
                //  4B-B.   Remove this source from later layers.
                layerProfiles.forEach(lp=>lp.removeSources(previousNode));
            }

            return false;
        }
    }

    /**
     * Remove a connection between two nodes.   --- UPDATED (Dexter) 20181220
     * @param {String|ModelNode.Layer.Config|Array|DataPreprocessing.Node} fromLayerOrSource 
     * @param  {...String|ModelNode.Layer.Config|Array|DataPreprocessing.Node} toLayerOrSources 
     */
    removeConnections(fromLayerOrSource, ...toLayerOrSources) {
        // Get the model editing build no.
        const buildNo = this._editingBuild;

        if (classof(fromLayerOrSource) == "String" || fromLayerOrSource instanceof LayerProfile) {
            //  1A-1.  If this is a layer, get the layer profile object.
            const fromLayer = (classof(fromLayerOrSource) == "String") ? this.layerProfiles.get(fromLayerOrSource) : fromLayerOrSource;

            //  1A-2.  Check if it's fine to remove all the requested connections.
            var tempLinks = [];
            var success = toLayerOrSources.every(ls=>{
                if (classof(ls) == "String" || ls instanceof LayerProfile) {
                    const toLayer = (classof(ls) == "String") ? this.layerProfiles.get(ls) : ls;
                    if (fromLayer.toNode[buildNo].includes(toLayer)) {
                        tempLinks.push(["layer", fromLayer, toLayer]);
                        return fromLayer.removeConnectionTo(toLayer);
                    } else if (fromLayer.fromNode[buildNo].includes(toLayer)) {
                        tempLinks.push(["layer", toLayer, fromLayer]);
                        return toLayer.removeConnectionTo(fromLayer);
                    }
                } else {
                    tempLinks.push(["source", fromLayer, ls]);
                    return fromLayer.removeSources(ls);
                }                
            });

            //  2.  If it's fine to connect, redraw the model.
            if (success) {
                //  2A-1. Update the order.
                this.getFinalLayers().forEach(lp=>lp.updateOrder());
                
                //  2A-2. Draw the train.
                this._project.drawTrain();

                return true;
            } else {
                //  4B. Revert to previous state. Noted, some links may have been recovered if one particular link was an incorrect action above.
                tempLinks.forEach(tempInfo=>{
                    if (tempInfo[0] == "source") tempInfo[1].addSources(false, tempInfo[2]);
                    else if (tempInfo[0] == "layer") if (!tempInfo[1].fromNode.includes(tempInfo[2])) tempInfo[1].appendNode(tempInfo[2]);
                });

                return false;
            }
        } else {
            //  1A. If this is a source, the parameter will be passed and it will be added to the layerProfiles' source.
            var fromSource = fromLayerOrSource instanceof DataPreprocessing.Node ? fromLayerOrSource : this.getDataSource(...fromLayerOrSource);

            //  1B-2.  Check if it's fine to remove all the requested connections.
            var tempLinks = [];
            var success = toLayerOrSources.every(ls=>{
                // These must be layers.
                const toLayer = (classof(ls) == "String") ? this.layerProfiles.get(ls) : ls;
                
                // Try to remove the source.
                tempLinks.push(["source", fromSource, toLayer]);
                return toLayer.removeSources(fromSource);
            });

            //  2.  If it's fine to connect, redraw the model.
            if (success) {
                //  2A-1. Update the order.
                this.getFinalLayers().forEach(lp=>lp.updateOrder());
                
                //  2A-2. Draw the train.
                this._project.drawTrain();

                return true;
            } else {
                //  4B. Revert to previous state.
                tempLinks.forEach(tempInfo=>{
                    tempInfo[2].addSources(false, tempInfo[1]);
                });

                return false;
            }
        }
    }
    
    /**
     * Force update of different graph nodes with the layer connection information.   --- UPDATED (Dexter) 20181217
     * @param  {...ConnectingNodeInfo} connectingNodeInfos - Node connection information.
     */
    forceUpdateConnections(...connectingNodeInfos) {
        connectingNodeInfos.forEach(cn=>{
            if (cn.type == "Layer") {
                const layer = this.layerProfiles.get(cn.details.layerName);
                const buildNo = cn.buildNo;
                layer.fromNode[buildNo] = cn.details.fromNode.map(ln=>this.layerProfiles.get(ln));
                layer.fromSource[buildNo] = [...cn.details.fromSource];
                layer.toNode[buildNo] = cn.details.toNode.map(ln=>this.layerProfiles.get(ln));
                layer._order[buildNo] = cn.details.order;
                layer._shape[buildNo] = cn.details.shape;
            }
        });

        //  2A-2. Draw the train.
        this._project.drawTrain();
    }

    /**
     * Initiate an update on layer profile order.   --- UPDATED (Dexter) 20180830
     * @param {ModelNode.Layer.Config} layerProfile - A layer profile to update.
     */
    updateLayerOrder(layerProfile) {
        layerProfile.updateOrder();
    }

    /**
     * Get the current model ending layer profiles (leaf nodes).   --- UPDATED (Dexter) 20181028
     * @returns {ModelNode.Layer.Config[]} An array of ending layer of this model
     */
    getEndingLayerProfiles() {
        // Get the model editing build no.
        const buildNo = this._editingBuild;

        // Get all the layer and filter those with no output linking node.
        return [...this.layerProfiles.values()].filter(l=>l.toNode[buildNo].length ==  0);
    }

    /**
     * Get the final layer profiles (layers).   --- UPDATED (Dexter) 20181220
     * @returns {ModelNode.Layer.Config[]} An array of ending layer of this model
     */
    getFinalLayers() {
        // Get the model editing build no.
        const buildNo = this._editingBuild;

        // Get all the layer and filter those with no output linking node.
        return [...this.layerProfiles.values()].filter(l=>l._final);
    }

    /**
     * Get an incremental unique id for new layer registration purpose.   --- UPDATED (Dexter) 20180524
     * @returns {Number} Integer
     */
    getNewLayerID() {
        var toID = this._layerIDInc;
        this._layerIDInc += 1;
        return toID;
    }

    /**
     * An async function to get the Python code based on this training model.   --- UPDATED (Dexter) 20190225
     * @returns {Promise} Finishes once all Python codes has been prepared, and resolves with the Python code or reject with an Error.
     */
    async getPython() {
        // Get the NeuralSimplycode embedding or import statement first. In case embedding is needed, this will wait until the NeuralSimplycode.py is fetched and parsed.
        return App.getNeuralSimplycode().then(heading=>{
            // Now we have the heading and add some line breaks to seperate the core model codes.
            var heading = heading + "\nimport os\nimport sys\nnowPath = sys.argv[0]\nnowPathLength = len(nowPath)\nactualPath = nowPath[0:(max(nowPath.rfind('/'),0) or nowPathLength)][0:(max(nowPath.rfind('\\\\'),0) or 0)]\nif (len(actualPath)): os.chdir(actualPath)\n\n";

            // Define the import library prefix in case of embedding NeuralSimplycode
            var importNeuralSimplycode = App.all.get("embedNeuralSimplycode") == 0;
            var libPrefix = importNeuralSimplycode ? "NeuralSimplycode." : "";

            // Prepare an arry for all the lines of Python codes
            var allStr = [heading];

            // Prepare the sources, and remember which source indexes will be defined.
            var sourceIDList = [];

            // Get all the sources with at least one column config (has model linkable data), and loop for each source definition in Python.
            this.sources.filter(s=>s.colConfigs.size >= 1).forEach((s,idx)=>{

                // Prepare a variables that will store all the source arguments as a Python code.
                var sParams;

                // Depending on different types of training source, there are different actions:
                if (s._type == "TableSource") {
                    // For table source, ensure there are embedded data.
                    var inputData = s.getRootData();
                    if (inputData) {
                        // Define the input data in Python.
                        allStr.push("inputData"+idx+" = ["+inputData.slice(s._hasHeading ? 1 : 0).map(r=>"["+r.map(c=>isNaN(Number(c))?("\""+c+"\""):c).join(",")+"]").join(",")+"]\n");

                        // Define the table source constructor arguments in Python.
                        sParams = `inputArray = inputData${idx}, hasHeading = ${s._hasHeading ? "True" : "False"}, batchSize = ${s.batchSize}, testRatio = ${s.testRatio},
                                    training = ${s.training?"True":"False"}, shuffle = ${s.shuffle ? "True" : "False"}, name = "${s.name}"`;
                    }
                } else if (s._type == "CSVSource") {
                    // Define the csv source constructor arguments in Python.
                    sParams = `"${s.path}", encoding = "${s.encoding}", hasHeading = ${s._hasHeading ? "True" : "False"}, 
                                    batchSize = ${s.batchSize}, testRatio = ${s.testRatio}, shuffle = ${s.shuffle ? "True" : "False"}, name = "${s.name}"`;
                } else if (s._type == "ImageSource") {
                    // Define the image source constructor arguments in Python.
                    sParams = `sourceType = "${s.sourceType}", coreDataDir = "${s.coreDataDir.replace(/\\/g,"\\\\")}", ` +
                                `flattenImg = ${s.flattenImg ? "True" : "False"}, batchSize = ${s.batchSize}, training = ${s._training?"True":"False"}, shuffle = ${s.shuffle ? "True" : "False"}`;
                }

                // If there has been source parameters, we'll construct a @Source.Config in Python.
                if (sParams) {
                    // Assign a new @Source.Config (depending on which sub-class) to a variable in Python.
                    allStr.push(`source${idx} = ${libPrefix}${s._type}(${sParams})\n`);

                    // Get all the column configs and sort them in logical order.
                    var colConfigs = [...s.colConfigs.entries()];
                    colConfigs.sort((a,b)=>a[1]._order > b[1]._order ? 1 : -1);

                    // For each column configs, define it in logical order in Python code.
                    colConfigs.forEach(cf=>{
                        var k = cf[0], v = cf[1];
                        if (v instanceof DataPreprocessing.ColumnsNode) {
                            // Set Selections.
                            if (s instanceof TableSource)
                                allStr.push(`source${idx}.selColumns(newDppKey = "${k}", sourceDppKey = ${v.source == null ? "None" : ("\"" + v.source + "\"")}, cols = "${v.sourceCol}")\n`);

                            // Set Transformation.
                            v.transformations.forEach(t=>{
                                allStr.push(`source${idx}.setTransform(sourceDppKey = "${t.source || k}", cols = "${t.cols}", scaleType = "${t.scaleType}")\n`);
                            });

                            // Set Circular Definition.
                            v.circular.forEach(c=>{
                                allStr.push(`source${idx}.setCircularOutput(sourceDppKey = "${c.source || k}", cols = "${c.cols}", minV = ${c.min}, maxV = ${c.max})\n`);
                            });

                            // Set One Hot Encoding.
                            if (v.oneHotColumns.size)
                                allStr.push(`source${idx}.setOneHot(sourceDppKey = "${k}", cols = "[${[...v.oneHotColumns.keys()].join(",")}]")\n`);

                            // Set Data Type.
                            if (v.dtype != null) {
                                allStr.push(`source${idx}["${k}"].asType(${libPrefix}TrainSource.getDataType("${v.dtype}"))\n`);
                            }
                        } else if (v instanceof DataPreprocessing.ImageNode) {
                            // Set Transformation.
                            v.transformations.forEach(tx=>{
                                allStr.push(`source${idx}.setTransform(dppNodeKey = "${tx.source || k}", transforamtionConfig = ${tx.getPythonConstructor(libPrefix)})\n`);
                            });

                            // Set Data Type.
                            if (v.dtype != null) {
                                allStr.push(`source${idx}["${k}"].asType(${libPrefix}TrainSource.getDataType("${v.dtype}"))\n`);
                            }
                        }
                    })
                    
                    // Add this source index and later this may reference to the Train constructor.
                    sourceIDList.push(idx);
                }

                // Set the test data for some type of data sources.
                if (["TableSource","CSVSource"].includes(s._type)) {
                    allStr.push(`testSource${idx} = source${idx}.splitTestDataset(test = ${s._testRatio/100}, shuffle = ${s.shuffle ? "True" : "False"})\n`);
                } else if (s._type == "ImageSource") {
                    allStr.push(`testSource${idx} = source${idx}.copyConfigAsNewSource(training = False)\n`);
                }
            })
            
            // For all training profiles, define the configurations in Python.
            this.trainingProfiles.forEach((tp, idx)=>{
                var coreParams = Train.getPyParams(...[["crossValidationProportion",tp.crossValidationProp/100],...["noOfEpoch","initialLearningRate","learningRateDecayFactor","numEpochsPerDecay","exponentialLossDecay","exponentialVarDecay","crossValidationCount","crossValidationType","optimizer"].map(p=>[p,tp[p]])]);
                allStr.push(`config${idx} = ${libPrefix}TrainingProfile(${coreParams})\n`);
            })

            // If there has been data source, a Train is able to set up. (Noted if written solely in NeuralSimplycode, a data source can be defined later after object construction.)
            if (sourceIDList.length) {

                // Get all the Train parameters and assign as constructor parameters in Python. At them same time, refer necessary variables like training profiles or training sources as defined previously.
                const coreParams = Train.getPyParams(...["folder","restorePath","device","logFreq","saveFreq","testFreq","traceFreq","weightLogFreq","filterFreq","runCount","traceRecord"].map(p=>[p,this[p]]));
                const sList = sourceIDList.length > 1 ? ("["+sourceIDList.map(s=>`source${s}`).join(",")+"]") : `source${sourceIDList[0]}`;
                const tsList = sourceIDList.length > 1 ? ("["+sourceIDList.map(s=>`testSource${s}`).join(",")+"]") : `testSource${sourceIDList[0]}`;
                const tpList = this.trainingProfiles.length > 1 ? ("["+this.trainingProfiles.map(s=>`config${s}`).join(",")+"]") : `config0`;
                allStr.push(`train = ${libPrefix}Train(${libPrefix}TimeHelper.getDateTimeStr(), source = ${sList}, testSource = ${tsList}, trainingProfile = ${tpList}, ${coreParams})\n`)
                
                // Build by training profile list.
                this.trainingProfiles.forEach((tp,buildNo)=>{
                    // Cache all variable config objects, and a list of 
                    var varConfigs = [], incomingConfigs = [], outputConfigs = [], noWeightLoggings = [];

                    // Get all the layer profiles and sort them in logical (feedforward) order.
                    var layerProfiles = [...this.layerProfiles.values()];
                    layerProfiles.sort((a,b)=>a._order[buildNo] > b._order[buildNo]? 1: -1);

                    // For each layer profile, append the layer to the Train object in Python.
                    layerProfiles.forEach(lp=>{
                        // Look for the incoming config.
                        var prevIncomingConfigIdx = incomingConfigs.findIndex(incomingConfig=>incomingConfig.equals(lp.incomingConfig));
                        if (prevIncomingConfigIdx == -1) {
                            // Update the index of the incoming config to reference.
                            prevIncomingConfigIdx = incomingConfigs.length;

                            // Cache the incoming config.
                            incomingConfigs.push(lp.incomingConfig);
                            
                            // Write the config setup.
                            allStr.push(`incomingConfig${prevIncomingConfigIdx} = ${lp.incomingConfig.getPythonConstructor(libPrefix, varConfigs, allStr)}\n`);
                        } 
                        
                        // Add the output config.
                        if (lp.outputConfig) {
                            // Look for the output config.
                            var prevOutputConfigIdx = outputConfigs.findIndex(outputConfig=>outputConfig.equals(lp.outputConfig));
                            if (prevOutputConfigIdx == -1) {
                                // Update the index of the output config to reference.
                                prevOutputConfigIdx = outputConfigs.length;

                                // Cache the output config.
                                outputConfigs.push(lp.outputConfig);
                                
                                // Write the config setup.
                                allStr.push(`outputConfig${prevOutputConfigIdx} = ${lp.outputConfig.getPythonConstructor(libPrefix)}\n`);
                            } 
                        }

                        // Depending on different types of LayerProfiles, assign the parameters to the Python constructor arguments.
                        var lParams;
                        if (lp._type == "Collector") {
                            lParams = Train.getPyParams(...[["incomingConfig", "incomingConfig"+prevIncomingConfigIdx, "var"], ["outputConfig", "outputConfig"+prevOutputConfigIdx], ["dropout",lp.dropout/100],...["flattenToAxis","activation","batchNorm"].map(p=>[p,lp[p]])]);
                        } else if (lp._type == "BasicLayer") {
                            lParams = Train.getPyParams(...[["incomingConfig", "incomingConfig"+prevIncomingConfigIdx, "var"], ["linearTransform", lp.linearTransform.getPythonConstructor(libPrefix, varConfigs, allStr), "var"], ["outputConfig", "outputConfig"+prevOutputConfigIdx, "var"], ["dropout",lp.dropout/100],["refLayerName",lp.refLayerName?lp.refLayerName.replace(/\s/g,""):lp.refLayerName], ...["layerUnits", "flattenToAxis","activation","batchNorm","refLayerTranspose"].map(p=>[p,lp[p]])]);
                        } else if (lp._type == "CNNLayer") {
                            lParams = Train.getPyParams(...[["incomingConfig", "incomingConfig"+prevIncomingConfigIdx, "var"], ["linearTransform", lp.linearTransform.getPythonConstructor(libPrefix, varConfigs, allStr), "var"], ["outputConfig", "outputConfig"+prevOutputConfigIdx, "var"], ["refLayerName",lp.refLayerName?lp.refLayerName.replace(/\s/g,""):lp.refLayerName], ["convStride", lp.convStride, "list"], ...["layerUnits", "convFilterWidth","convPadding","convDilation","reshape","activation","batchNorm","refLayerTranspose"].map(p=>[p,lp[p]])]);
                        } else if (lp._type == "DCNNLayer") {
                            lParams = Train.getPyParams(...[["incomingConfig", "incomingConfig"+prevIncomingConfigIdx, "var"], ["linearTransform", lp.linearTransform.getPythonConstructor(libPrefix, varConfigs, allStr), "var"], ["outputConfig", "outputConfig"+prevOutputConfigIdx, "var"], ["refLayerName",lp.refLayerName?lp.refLayerName.replace(/\s/g,""):lp.refLayerName], ["convStride", lp.convStride, "list"], ["dconvPadding", `${libPrefix}DCNNLayer.PaddingTypes.${DCNNLayer.PaddingTypes.getName(lp.dconvPadding)}`, "var"], ...["layerUnits", "convFilterWidth","convPadding","convDilation","refLayerTranspose","activation","batchNorm"].map(p=>[p,lp[p]])]);
                        } else if (lp._type == "Classifier") {
                            lParams = Train.getPyParams(["incomingConfig", "incomingConfig"+prevIncomingConfigIdx, "var"], ["linearTransform", lp.linearTransform.getPythonConstructor(libPrefix, varConfigs, allStr), "var"], ...["classCount","compareSourceID","compareTensorIdx","measurement","activation"].map(p=>[p,lp[p]]));
                        } else if (lp._type == "Regressor") {
                            lParams = Train.getPyParams(["incomingConfig", "incomingConfig"+prevIncomingConfigIdx, "var"], ["linearTransform", lp.linearTransform.getPythonConstructor(libPrefix, varConfigs, allStr), "var"], ...["compareSourceID","compareTensorIdx","measurement","activation"].map(p=>[p,lp[p]]));
                        }

                        // Disable the weight loggings.
                        if (!lp.weightLogging) noWeightLoggings.push(lp.name);

                        // Collect the arguments and attach the layer to the Train object in Python.
                        allStr.push(`train.attachLayer(${libPrefix}${lp._type}(name = "${lp.name.replace(/\s/g,"")}", ${lParams})${(lp.fromNode[buildNo].length > 0 ? (", " + lp.fromNode[buildNo].map(l=>"\""+l.name.replace(/\s/g,"")+"\"").join(", ")) : "") + (lp.fromSource[buildNo].length > 0 ? (", ") + lp.fromSource[buildNo].map(s=>"("+s[0]+", \""+s[1]+"\")").join(", ") : "")}, buildNo = ${buildNo})\n`);

                        // TODO [Model Editing/Predictions]
                        // Action:  Revise build logic: The layer creation should be before the loop of training profiles. 
                        // Reason:  Build connections will be revised in NeuralSimplycode.
                    });

                    // Disable all weight loggings.
                    if (noWeightLoggings.length) allStr.push(`train.switchOffWeightLogging(${noWeightLoggings.map(name=>"\""+name.replace(/\s/g,"")+"\"").join(", ")})\n`)
                
                });
                
            }

            // Train the model in Python.
            allStr.push(`train.fit()\n`);

            // TODO [Model Editing/Predictions]
            // Action:  Add prediction data to the Python codes, and call predict() in NeuralSimplycode. 
            // Reason:  Data predictions has not been implemented.

            // Resolve the Python code.
            return Promise.resolve(allStr.join(""));
        }, e=>Promise.reject(e))
    }

    /**
     * Get a string as Python arguments from the still-in-JS parameter-value mapping.   --- UPDATED (Dexter) 20180524
     * @param {...Array} params - Argument slots: params[0] - Python argument key, params[1] - The value in still-in-JS object, params[2] - The type of the previous value
     * @returns {String} Python function arguments
     */
    static getPyParams(...params) {
        // Join these arguments together with a ", " .
        return params.map(param=>{
            // Get the python argument key, expected value, and value type from the function parameters
            const pyName = param[0];
            const toItem = param[1];
            const type = param[2];

            // Depending on different expected values, map to a Python-readable data type if needed.
            var toVal = "";
            if (type == "shape") toVal = `(${toItem.join(",")},)`;
            else if (type == "var") toVal = toItem;
            else if (type == "list") toVal = `[${toItem.join(",")}]`;
            else if (toItem == null || toItem == undefined || toItem == "None") toVal = "None";
            else if (toItem === true) toVal = "True";
            else if (toItem === false) toVal = "False";
            else if (!isNaN(Number(toItem))) toVal = toItem;
            else toVal = `"${toItem.replace(/"/g, "\"\"").replace(/\\/g,"\\\\")}"`;

            // Return the argument name, value pair
            return `${pyName} = ${toVal}`;
        }).join(", ");
    }

    /**
     * Get the shape of an array.   --- UPDATED (Dexter) 20180524
     * @param {Array} ary - A multi-dimensional array
     * @returns {Array} Shape of the array, like [1,2,2]
     */
    static shape(ary) {
        // Assume each records are of the same length in each dimension, while-loop the array and check for the length as the shape value.
        var dimTest = ary, dimShape = [];
        while (dimTest instanceof Array){
            dimShape.push(dimTest.length);
            dimTest = dimTest[0];
        }
        return dimShape;
    }
}

/**
 * Class representing a type of handling merging higher dimensioned nodes to the lower dimensioned core node.   --- UPDATED (Dexter) 20181125
 */
class IncomingConfig {
    /**
     * Enumeration representing the available methods for incoming configuration.   --- UPDATED (Dexter) 20181125
     * @returns {Enum}
     */
    static get Types() {
        return new Enum({
            /** @type {Number} Abstract class representing an layer incoming configruation object. */
            Config: 0,
            /** @type {Number} Concatenate all incoming nodes. Nodes should have either the same number of dimensions, or higher dimension than the core incoming node. */
            Concat: 1,
            /** @type {Number} Abstract class representing an option of summing incoming nodes element-wise. */
            ElementWiseConfig: 2,
            /** @type {Number} Elemenally sum all incoming nodes. Nodes should be same in dimensions, or the pre-feature dimensions should be the multiple of the core incoming node. Implementation of ResNet or Highway Network may consider using this method. */
            Sum: 3,
            /** @type {Number} Elementally multiply all incoming nodes. Nodes should be same in dimensions, or the pre-feature dimensions should be the multiple of the core incoming node. */
            Multiply: 4,
            /** @type {Number} Elementally sum and multiply the elemenental min of all incoming nodes with weighted proportion on summation and multiplication. Nodes should be same in dimensions, or the pre-feature dimensions should be the multiple of the core incoming node. */
            Blend: 5
        });
    }
    
    /**
     * Sub-class representing the type of handling merging higher dimensioned nodes to the lower dimensioned core node.   --- BETA --- UPDATED (Dexter) 20181125
     * @returns {Enum}
     */
    static get MergeDimTypes() {
        return new Enum({
            /** @type {Number} A subsampling is used.*/
            SubSample: 1,
            
            /** @type {Number} Pre-operation axis are stacked in blocks of multiple of the core node dimensions as the operation dimension.*/
            SpaceToDepth: 2,
            
            /** @type {Number} Adjacent features in the dimensions before the operation dimension will be max-pooled to the dimensions as the core node.*/
            MaxPool: 3,
            
            /** @type {Number} Adjacent features in the dimensions before the operation dimension will be mean-pooled to the dimensions as the core node.*/
            MeanPool: 4
        });
    }

    static get Config() { return IncomingConfigConfig; }
    static get Concat() { return IncomingConfigConcat; }
    static get ElementWiseConfig() { return IncomingConfigElementWiseConfig; }
    static get Sum() { return IncomingConfigSum; }
    static get Multiply() { return IncomingConfigMultiply; }
    static get Blend() { return IncomingConfigBlend; }
}

/**
 * A instance class representing an incoming configruation object.   --- UPDATED (Dexter) 20181128
 */
class IncomingConfigConfig {
    /**
     * Create an incoming configuration object.  --- UPDATED (Dexter) 20180921
     * @param {Number} method - A numerical representation for the incoming option method type.
     * @param {Number} axis - The operation axis.
     * @param {ModelNode.Layer.Config} coreNode - The reference index of the LayerProfile.fromNode list. If `null`, an automated selection will be used.
     * @param {Number} mergeDim - The type of dimension-merging methods if needed.
     */
    constructor(method, axis = -1, coreNode = null, mergeDim = IncomingConfig.MergeDimTypes.SubSample) {
        /** @type {Number} - The instnace class, as defined in @ModelNode.Layer.Incoming.Types .  */
        this._instanceClass = method;
        /** @type {String} - The layer in the LayerProfile.fromNode list to act as the core code for incoming combination. If `null`, an automated selection will be used. When implemented in prgoramming runtime, it should be a @ModelNode.Config object. */
        this.coreNode = coreNode;
        /** @type {Number} - The merge dimension method, as defined in @ModelNode.Layer.Incoming.MergeDimMethods . */
        this.mergeDim = mergeDim;
        /** @type {Number} - The operation axis. */
        this.axis = axis;
    }

    /**
     * A numerical representation for the incoming option method type.   --- UPDATED (Dexter) 20190221
     * @returns {Number} - A numerical representation for the incoming option method type.
     */
    get method() {
        return this._instanceClass;
    }

    /**
     * Returns the method string of this incoming configuration.   --- UPDATED (Dexter) 20181125
     * @returns {String} - The name of this method.
     */
    toString() {
        return IncomingConfig.Types.getName(this.method);
    }

    /**
     * Export this IncomingConfig into a represtable object for project saving.   --- UPDATED (Dexter) 20190221
     * @returns {Object} JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this Train, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>{
            if (k == "coreNode") {
                obj[k] = this[k] == null ? null : this[k].name;
            } else {
                obj[k] = this[k];
            }
        })
        return obj;
    }

    /**
     * Parse a previously saved object into this class of IncomingConfig.   --- UPDATED (Dexter) 20190221
     * @param {Object} obj - JSON object from Project file
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the IncomingConfig Class.
        [...Object.keys(obj)].forEach(k=>{
            this[k] = obj[k];
        });
        // Core node will be recovered in Train.parseJSON() because it needs to wait all LayerProfiles to be loaded.
    }

    /**
     * Compare if it's the same as another incoming configuration.   --- UPDATED (Dexter) 20181129
     * @param {IncomingConfig.Config} incomingConfig - Another incoming configuration.
     * @returns {Boolean} - Whether the 2 configs are equal.
     */
    equals(incomingConfig) {
        // It's not equal if they're not the same type.
        if (!(incomingConfig instanceof IncomingConfig.Config)) return false;
        else if (this.method != incomingConfig.method) return false;

        // Check all values in this object config.
        var thisConfigMap = new Map(Object.entries(this));
        for (let key of thisConfigMap.keys()) {
            if (thisConfigMap.get(key) != incomingConfig[key]) return false;
        }

        return true;
    }

    /**
     * Get the python code constructor.   --- UPDATED (Deexter) 20181227
     * @param {String} libPrefix - Python library prefix.
     * @param {VarConfig[]} varConfigsCache - Cached list of var config.
     * @param {String[]} allStr - Python writing lines.
     * @returns {String} - A Python coded constructor.
     */
    getPythonConstructor(libPrefix, varConfigsCache, allStr) {
        var allKeys = [...Object.keys(this)].filter(k=>!["_instanceClass", "method", "mergeDim"].includes(k));
        var nonLinearTransformParams = Train.getPyParams(...allKeys.filter(k=>!(this[k] instanceof LinearTransformConfig)).map(p=>[p, this[p]]));
        var linearTransformParams = allKeys.filter(k=>(this[k] instanceof LinearTransformConfig)).map(p => `${p} = ` + this[p].getPythonConstructor(libPrefix, varConfigsCache, allStr)).join(", ");
        return `${libPrefix}IncomingConfig.${IncomingConfig.Types.getName(this.method)}(mergeDim = ${libPrefix}IncomingConfig.MergeDimTypes.${IncomingConfig.MergeDimTypes.getName(this.mergeDim)}, ${[nonLinearTransformParams, linearTransformParams].join(", ")})`;
    }
}

/**
 * Class representing an option of concatenating incoming nodes.   --- UPDATED (Dexter) 20181125
 */
class IncomingConfigConcat extends IncomingConfig.Config {
    /**
     * Create an incoming concatenation option.   --- UPDATED (Dexter) 20181125
     * @param {ModelNode.Layer.Config} coreNode - The reference index of the LayerProfile.fromNode list. If null, a selection on nearest and smallest dimensioned node will be used.
     * @param {Number} axis - Incoming node will be flattened to this axis for concatenation.
     * @param {Number} mergeDim - The type of dimension-merging methods if needed.
     */
    constructor(coreNode = null, axis = 1, mergeDim = IncomingConfig.MergeDimTypes.SubSample) {
        super(IncomingConfig.Types.Concat, axis, coreNode, mergeDim);
    }
}

/**
 * Abstract class representing an option of combining incoming nodes element-wise.   --- UPDATED (Dexter) 20181125
 */
class IncomingConfigElementWiseConfig extends IncomingConfig.Config {
    /**
     * Create an incoming configuration object with element-wise operation.   --- UPDATED (Dexter) 20190123
     * @param {Number} method - A numerical representation for the incoming option method type.
     * @param {ModelNode.Layer.Config} coreNode - The reference index of the @ModelNode.Layer.Config.fromNode list. If `null`, a selection on the node with smallest dimensioned and longest path from the root source will be used.
     * @param {Number} axis - The operation axis.
     * @param {Number} mergeDim - The type of dimension-merging methods if needed.
     * @param {(ModelNode.Layer.Config|int)} transformGate - The reference layer of the @ModelNode.Layer.Config.fromNode list of the node on which a transform gate will apply with distributed total proportion of nodes as 1. If `-1`, a sellection on the node with shortest path from the root source will be used. If `null`, no transform gate will be used. Implemenetation of Highway Network may need this option.
     * @param {LinearTransformConfig} transformConfig - The linear transform configuration of the transform gate.
     * @param {LinearTransformConfig} dimensionMappingConfig - The linear transform configuration of any mismatched dimensioned data with the coreNode. If `null`, the dimensions stated in `self.axis` should be the same across all incoming nodes.
     */
    constructor (method = null, coreNode = null, axis = -1, mergeDim = IncomingConfig.MergeDimTypes.SubSample, transformGate = null,
        transformConfig = new LinearTransformConfig(new VarConfig(new VarConfig.TruncatedNormal(0.0, 0.05))),
        dimensionMappingConfig = new LinearTransformConfig(new VarConfig(new VarConfig.TruncatedNormal(0.0, 0.05)))) {
        super(method, axis, coreNode, mergeDim);
        /** @type {(String|int)} - The layer in the .fromNode list of the applying layer on which a transform gate will apply with distributed total proportion of nodes as 1. If `-1`, a sellection on the node with shortest path from the root source will be used. If `null`, no transform gate will be used. Implemenetation of Highway Network may need this option. When implemented in prgoramming runtime, it should be a @ModelNode.Config object. */
        this.transformGate = transformGate;
        /** @type {Train.Variable.LinearTransform} - The linear transform configuration of the transform gate. */
        this.transformConfig = transformConfig;
        /** @type {Train.Variable.LinearTransform} - The linear transform configuration of any mismatched dimensioned data with the coreNode. If `null`, the dimensions stated in `this.axis` should be the same across all incoming nodes.*/
        this.dimensionMappingConfig = dimensionMappingConfig;
    }

    /**
     * Export this IncomingElementWiseOperation into a represtable object for project saving.   --- UPDATED (Dexter) 20181126
     * @returns {Object} JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this Train, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>{
            if (k == "coreNode" || k == "transformGate") {
                obj[k] = this[k] == null ? null : this[k].name;
            } else if (["transformConfig", "dimensionMappingConfig"].includes(k)) {
                obj[k] = obj[k] == null ? null : obj[k].exportAsJSON();
            } else {
                obj[k] = this[k];
            }
        })
        return obj;
    }

    /**
     * Parse a previously saved object into this class of IncomingElementWiseOperation.   --- UPDATED (Dexter) 20181126
     * @param {Object} obj - JSON object from Project file
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the IncomingElementWiseOperation Class.
        [...Object.keys(obj)].forEach(k=>{
            if (["transformConfig", "dimensionMappingConfig"].includes(k)) {
                this[k] = new LinearTransformConfig();
                this[k].parseJSON(obj[k]);
            } else {
                this[k] = obj[k];
            }
        });
        // Core node, transformGate will be recovered in Train.parseJSON() because it needs to wait all LayerProfiles to be loaded.
    }

    /**
     * Compare if it's the same as another incoming element-wise ops configuration.   --- UPDATED (Dexter) 20181129
     * @param {IncomingConfig.ElementWiseConfig} incomingConfig - Another incoming element-wise ops configuration.
     * @returns {Boolean} - Whether the 2 configs are equal.
     */
    equals(incomingConfig) {
        // It's not equal if they're not the same type.
        if (!(incomingConfig instanceof IncomingConfig.ElementWiseConfig)) return false;
        else if (this.method != incomingConfig.method) return false;

        // Check all values in this object config.
        var thisConfigMap = new Map(Object.entries(this));
        for (let key of thisConfigMap.keys()) {
            if (!["transformConfig", "dimensionMappingConfig"].includes(key) && thisConfigMap.get(key) != incomingConfig[key]) return false;
            else if (["transformConfig", "dimensionMappingConfig"].includes(key) && (!thisConfigMap.get(key).weightConfig.equals(incomingConfig[key].weightConfig) || !thisConfigMap.get(key).biasConfig.equals(incomingConfig[key].biasConfig))) return false;
        }

        return true;
    }
}

/**
 * Class representing an option of summing incoming nodes element-wise.   --- UPDATED (Dexter) 20181125
 */
class IncomingConfigSum extends IncomingConfig.ElementWiseConfig {
    /**
     * Create an incoming summation option object.   --- UPDATED (Dexter) 20181125
     * @param {ModelNode.Layer.Config} coreNode - The reference index of the LayerProfile.fromNode list. If null  a selection on the node with smallest dimensioned and longest path from the root source will be used.
     * @param {Number} axis - The operation axis.
     * @param {Number} mergeDim - The type of dimension-merging methods if needed.
     * @param {Number} transformGate - The reference index of the LayerProfile.fromNode list of the node on which a transform gate will apply with distributed total proportion of nodes as 1. If -1, a sellection on the node with shortest path from the root source will be used. If null no transform gate will be used. Implemenetation of Highway Network may need this option.
     * @param {LinearTransformConfig} transformConfig - The linear transform configuration of the transform gate.
     * @param {LinearTransformConfig} dimensionMappingConfig - The linear transform configuration of any mismatched dimensioned data with the coreNode. If null the dimensions stated in `self.axis` should be the same across all incoming nodes.
     */
    constructor(coreNode = null, axis = -1, mergeDim = IncomingConfig.MergeDimTypes.SubSample, transformGate = null,
        transformConfig = new LinearTransformConfig(new VarConfig(new VarConfig.TruncatedNormal(0.0, 0.05))),
        dimensionMappingConfig = new LinearTransformConfig(new VarConfig(new VarConfig.TruncatedNormal(0.0, 0.05)))) {
        super(IncomingConfig.Types.Sum, coreNode, axis, mergeDim, transformGate, transformConfig, dimensionMappingConfig);
    }
}

/**
 * Class representing an option of multiplying incoming nodes element-wise.   --- UPDATED (Dexter) 20181125
 */
class IncomingConfigMultiply extends IncomingConfig.ElementWiseConfig {
    /**
     * Create an incoming multiplication option object.   --- UPDATED (Dexter) 20181125
     * @param {LayerPModelNode.Layer.Configrofile} coreNode - The reference index of the LayerProfile.fromNode list. If null  a selection on the node with smallest dimensioned and longest path from the root source will be used.
     * @param {Number} axis - The operation axis.
     * @param {Number} mergeDim - The type of dimension-merging methods if needed.
     * @param {Number} transformGate - The reference index of the LayerProfile.fromNode list of the node on which a transform gate will apply with distributed total proportion of nodes as 1. If -1, a sellection on the node with shortest path from the root source will be used. If null no transform gate will be used. Implemenetation of Highway Network may need this option.
     * @param {LinearTransformConfig} transformConfig - The linear transform configuration of the transform gate.
     * @param {LinearTransformConfig} dimensionMappingConfig - The linear transform configuration of any mismatched dimensioned data with the coreNode. If null the dimensions stated in `self.axis` should be the same across all incoming nodes.
     */
    constructor(coreNode = null, axis = -1, mergeDim = IncomingConfig.MergeDimTypes.SubSample, transformGate = null,
        transformConfig = new LinearTransformConfig(new VarConfig(new VarConfig.TruncatedNormal(0.0, 0.05))),
        dimensionMappingConfig = new LinearTransformConfig(new VarConfig(new VarConfig.TruncatedNormal(0.0, 0.05)))) {
        super(IncomingConfig.Types.Multiply, coreNode, axis, mergeDim, transformGate, transformConfig, dimensionMappingConfig);
    }
}

/**
 * Class representing an option of blending incoming nodes element-wise.   --- UPDATED (Dexter) 20181125
 */
class IncomingConfigBlend extends IncomingConfig.ElementWiseConfig {
    /**
     * Create an incoming blending option object with x1 + x2 + ... + xN - N * (x1 * x2 * x3 * ... * xN).   --- UPDATED (Dexter) 20181125
     * @param {ModelNode.Layer.Config} coreNode - The reference index of the LayerProfile.fromNode list. If null a selection on the node with smallest dimensioned and longest path from the root source will be used.
     * @param {Number} axis - The operation axis.
     * @param {Number} mergeDim - The type of dimension-merging methods if needed.
     * @param {Number} transformGate - The reference index of the LayerProfile.fromNode list of the node on which a transform gate will apply with distributed total proportion of nodes as 1. If -1, a sellection on the node with shortest path from the root source will be used. If null no transform gate will be used. Implemenetation of Highway Network may need this option.
     * @param {LinearTransformConfig} transformConfig - The linear transform configuration of the transform gate.
     * @param {LinearTransformConfig} dimensionMappingConfig - The linear transform configuration of any mismatched dimensioned data with the coreNode. If null the dimensions stated in `self.axis` should be the same across all incoming nodes.
     * @param {Boolean} learnableBlend - If `true`, instead of originally blending, it will follow a1 * x1 + a2 * x2 + ... + aN * xN + b * (x1 * x2 * x3 * ... * xN) where a1 = a2 = ... = aN = 1 and b = N are learnable initialized constant values.
     */
    constructor(coreNode = null, axis = -1, mergeDim = IncomingConfig.MergeDimTypes.SubSample, transformGate = null,
        transformConfig = new LinearTransformConfig(new VarConfig(new VarConfig.TruncatedNormal(0.0, 0.05))),
        dimensionMappingConfig = new LinearTransformConfig(new VarConfig(new VarConfig.TruncatedNormal(0.0, 0.05))),
        learnableBlend = false) {
        super(IncomingConfig.Types.Blend, coreNode, axis, mergeDim, transformGate, transformConfig, dimensionMappingConfig);
        /** @type {Boolean} - If `true`, instead of originally blending, it will follow a1 * x1 + a2 * x2 + ... + aN * xN + b * (x1 * x2 * x3 * ... * xN) where a1 = a2 = ... = aN = 1 and b = N are learnable initialized constant values. */
        this.learnableBlend = learnableBlend;
    }
}

/**
 * Module including classes on output configurations of a NOM high level model node.   --- UPDATED (Dexter) 20181125
 */
class OutputConfig {
    /**
     * Enumeration defining the available methods for output configuration of a NOM high level model node.   --- UPDATED (Dexter) 20181125
     */
    static get Types() { 
        return new Enum({
            /** @type {Number}  - Abstract class representing representing a configuration for the output node.  */
            Config: 0,
            /** @type {Number}  - Output as node matrix operations. */
            Default: 1,
            /** @type {Number}  - Flatten the output on the requested axis.. */
            Flatten: 2,
            /** @type {Number}  - Reshape the output as specific shape.. */
            Reshape: 3,
            /** @type {Number}  - Select a specific dimension channel. --- RESERVED. */
            SelectChannel: 4
        });
    }

    static get Config() { return OutputConfigConfig; }
    static get Default() { return OutputConfigDefault; }
    static get Flatten() { return OutputConfigFlatten; }
    static get Reshape() { return OutputConfigReshape; }
    static get SelectChannel() { return OutputConfigSelectChannel; }
}

/**
 * Class representing  an output configurations of an NOM high level model node.   --- UPDATED (Dexter) 20181126
 */
class OutputConfigConfig {
    /**
     * Create an output configuration object.  --- UPDATED (Dexter) 20181125
     * @param {Number} method - A numerical representation for the output option method type.
     */
    constructor(method) {
        /** @type {Number} - The instnace class, as defined in @ModelNode.Layer.Output.Types .  */
        this._instanceClass = method;
    }
    
    /**
     * A numerical representation for the output option method type.   --- UPDATED (Dexter) 20190221
     * @returns {Number} - A numerical representation for the output option method type.
     */
    get method() {
        return this._instanceClass;
    }

    /**
     * Returns the method string of this output configuration.   --- UPDATED (Dexter) 20180921
     * @returns {String} - The name of this method.
     */
    toString() {
        return OutputConfig.Types.getName(this.method);
    }

    /**
     * Export this OutputConfig into a represtable object for project saving.   --- UPDATED (Dexter) 20181126
     * @returns {Object} JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this OutputConfig, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>obj[k] = this[k]);
        return obj;
    }

    /**
     * Parse a previously saved object into this class of IncomingConfig.   --- UPDATED (Dexter) 20181124
     * @param {Object} obj - JSON object from Project file
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the IncomingConfig Class.
        [...Object.keys(obj)].forEach(k=>{
            this[k] = obj[k];
        });
    }

    /**
     * Compare if it's the same as another output configuration.   --- UPDATED (Dexter) 20181129
     * @param {OutputConfigConfig} outputConfig - Another output configuration.
     */
    equals(outputConfig) {
        // It's not equal if they're not the same type.
        if (!(outputConfig instanceof OutputConfigConfig)) return false;
        else if (this.method != outputConfig.method) return false;

        // Check all values in this object config.
        var thisConfigMap = new Map(Object.entries(this));
        for (let key of thisConfigMap.keys()) {
            if (key != "initializer" && thisConfigMap.get(key) != outputConfig[key]) return false;
        }

        return true;
    }

    /**
     * A virtual method to get the python code constructor.   --- UPDATED (Deexter) 20181129
     * @param {String} libPrefix - Python library prefix.
     * @returns {String} - A Python coded constructor.
     */
    getPythonConstructor(libPrefix) {
        var allKeys = [...Object.keys(this)].filter(k=>!["method","_instanceClass"].includes(k));
        return `${libPrefix}OutputConfig.${OutputConfig.Types.getName(this.method)}(${Train.getPyParams(...allKeys.map(k=>[k, this[k]]))})`;
    }
}

/**
 * Class representing an output configurations of an NOM high level model node with no changes.   --- UPDATED (Dexter) 20181126
 */
class OutputConfigDefault extends OutputConfigConfig {
    /**
     * Create a default output config.   --- UPDATED (Dexter) 20181125
     */
    constructor() {
        super(OutputConfig.Types.Default);
    }
}

/**
 * Class representing n output configurations of an NOM high level model node with matrix flattening.   --- UPDATED (Dexter) 20181125
 */
class OutputConfigFlatten extends OutputConfigConfig {
    /**
     * Create a flattening output config.   --- UPDATED (Dexter) 20181125
     * @param {Number} axis - The flattening axis of the output node.
     */
    constructor(axis = 1) {
        super(OutputConfig.Types.Flatten);
        /** @type {Number} - The flattening axis of the output node. */
        this.axis = axis;
    }
}

/**
 * Class representing an output configurations of an NOM high level model node with matrix reshaping.   --- UPDATED (Dexter) 20181125
 */
class OutputConfigReshape extends OutputConfigConfig {
    /**
     * Create a reshaping output config.   --- UPDATED (Dexter) 20181125
     * @param {Number[]} shape - The shape of the available dimensions of each item.
     */
    constructor(shape = ["None", -1]) {
        super(OutputConfig.Types.Reshape);
        /** @type {Array<Number>} - The flattening axis of the output node. */
        this.shape = shape;
    }

    /**
     * Get the python code constructor.   --- UPDATED (Deexter) 20190210
     * @param {String} libPrefix - Python library prefix.
     * @returns {String} - A Python coded constructor.
     */
    getPythonConstructor(libPrefix) {
        var allKeys = [...Object.keys(this)].filter(k=>!["method","_instanceClass"].includes(k));
        return `${libPrefix}OutputConfig.${OutputConfig.Types.getName(this.method)}(shape = [${this.shape.join(", ")}])`;
    }
}

/**
 * Class representing an output configurations of an NOM high level model node with channel selection.   --- RESERVED --- UPDATED (Dexter) 20181125
 */
class OutputConfigSelectChannel extends OutputConfigConfig {
    /**
     * Create a chanel selection output config.   --- RESERVED --- UPDATED (Dexter) 20181125d
     * @param {Number} axis - The selection axis of the output node.
     * @param {Number} channel - The selection channel of the output node.
     */
    constructor(axis = 1, channel = 0) {
        super(OutputConfig.Types.SelectChannel);
        this.axis = axis;
        this.channel = channel;
    }
}

/** Class including different types of graph model nodes in a data model node.   --- RESERVED --- UPDATED (Dexter) 20190201 */
class ModelNode {
    /**
     * Enumeration managing the types of model nodes.   --- RESERVED --- UPDATED (Dexter) 20190201
     */
    static get Types() {
        return new Enum({
            /** @type {Number} - Abstract class representing a model node configuration. */
            Config: 0,

            /** @type {Number} - Class including different types of high-level Ladder model layer. */
            Layer: 1
        });
    }

    /**
     * Parse a previously saved object into a new @ModelNode.Config object. This will auto-determine the sub-class of the object, and pass the JSON object to the inner method to continue to parse.   --- UPDATED (Dexter) 20190210
     * @param {*} obj - JSON object from Project file.
     * @returns {ModelNode.Config} - A @ModelNode.Config object.
     */
    static parseJSON(obj) {
        // Currently, only Ladder layer is allowed.
        return ModelNode.Layer.parseJSON(obj);
    }
    
    static get Config() { return ModelNodeConfig; }
    static get Layer() { return ModelNodeLayer; }
}

/** Abstract class representing a model node configuration.   --- RESERVED --- UPDATED (Dexter) 20190201 */
class ModelNodeConfig {
    /**
     * Create a graph model node.   --- RESERVED --- UPDATED (Dexter) 20190201
     * @param {Number} nodeType - The node type of this object, as defined in @ModelNode.Types .
     * @param {String} name - The name of this layer; the base name hierarchy in TensorFlow model.
     */
    constructor(nodeType = ModelNode.Types.Config, name = null) {
        /** @type {Number} - The type of the model node. */
        this._nodeType = nodeType;
        /** @type {String} - The name of this model node; the base name hierarchy in TensorFlow model. */
        this.name = name;
        /** @type {Array<Array<{0: Number, 1: String}>>} - A 2 dimension array of a list of incoming sources in each build. Each source is represented in a 2-value array, with the first value as the source index and the second value as the data preprocessing node key. */
        this.fromSource = [[]];
        /** @type {Array<Array<String>>} - A 2 dimension array of a list of incoming model nodes in each build. Each model node is represented by the node name. When implemented in prgoramming runtime, it should be a @ModelNode.Config object. */
        this.fromNode = [[]];
        /** @type {Array<Array<String>>} - A 2 dimension array of a list of connecting model nodes in each build. Each model node is represented by the node name. When implemented in prgoramming runtime, it should be a @ModelNode.Config object. */
        this.toNode = [[]];
        /** @type {Array<Array<Number|String>>} - A list of shapes in the order of each build. Each shape should be a list of number or `"None"`. */
        this._shape = [[]];
        /** @type {Array<Number>>} - A list of topological orders in the graph of each build. */
        this._order = [];
        /** @type {Train} - The @Train object where this @Source.Config belongs to. If this layer is just constructed, it is not belonged to any training instance. */
        this.train = null;
    }

    /**
     * The node type of this object, as defined in @ModelNode.Types .   --- RESERVED --- UPDATED (Dexter) 20190201
     * @returns {Number} - The node type of this object, as defined in @ModelNode.Types .
     */
    get nodeType() {
        return this._nodeType;
    }
}

/** Class including different types of high-level Ladder model layer.   --- RESERVED --- UPDATED (Dexter) 20190201 */
class ModelNodeLayer {
    /**
     * Enumeration managing the types of high-level Ladder model layer.   --- RESERVED --- UPDATED (Dexter) 20190201
     */
    static get Types() {
        return new Enum({
            /** @type {Number} - Abstract class representing a high level Ladder model layer. */
            Config: 0,
            /** @type {Number} - A collector layer, without any dimensional transformation from all the input layers. */
            Collector: 1,
            /** @type {Number} - A fully connected layer, aka dense layer, etc. */
            FullyConnected: 2,
            /** @type {Number} - A 2D convolutional layer, providing auto reshaping of data which are not 2D images. */
            Convolution: 3,
            /** @type {Number} - A 2D de-convolutional layer. */
            Deconvolution: 4,
            /** @type {Number} - Class including different types of task layers. */
            Task: 5,
        });
    }

    /**
     * Parse a previously saved object into a new @ModelNode.Layer.Config object. This will auto-determine the sub-class of the object, and pass the JSON object to the inner method to continue to parse.   --- UPDATED (Dexter) 20190210
     * @param {*} obj - JSON object from Project file.
     * @returns {ModelNode.Layer.Config} - A @ModelNode.Layer.Config object.
     */
    static parseJSON(obj) {
        var layerUnits = obj.layerUnits;
        var lp =  obj._type == "Collector" ? new Collector() :
        obj._type == "BasicLayer" ? new BasicLayer(undefined, layerUnits) :
        obj._type == "CNNLayer" ? new CNNLayer(undefined, layerUnits) :
        obj._type == "DCNNLayer" ? new DCNNLayer(undefined, layerUnits): 
        obj._type == "Classifier"? new Classifier() : 
        obj._type == "Regressor" ? new Regressor() : null;
        lp.parseJSON(obj, this);
        return lp;
    }

    static get Incoming() {return IncomingConfig;}
    static get Output() {return OutputConfig;}
    static get Config() { return LayerProfile; }
    static get FullyConnected() { return BasicLayer; }
    static get Convolution() { return CNNLayer;}
    static get Deconvolution() { return DCNNLayer; }
    static get Collector()  {return Collector; }
    static get Task()  {return ModelNodeLayerTask; }
}

/** Class including different types of high-level Ladder task layers.   --- RESERVED --- UPDATED (Dexter) 20190201 */
class ModelNodeLayerTask {
    /**
     * Enumeration managing the types of high-level Ladder task layer.   --- RESERVED --- UPDATED (Dexter) 20190201
     */
    static get Types() {
        return new Enum({
            /** @type {Number} - Abstract class representing a high level Ladder task layer. */
            Config: 0,
            /** @type {Number} - Abstract class representing a task of classifier, to compare model predictions with discrete classes. */
            Classifier: 1,
            /** @type {Number} - Abstract class representing a task of regressor, to compare model predictions with continous variables. */
            Regressor: 2
        });
    }

    static get Config() { return FinalLayer; }
    static get Classifier() { return Classifier; }
    static get Regressor() { return Regressor; }
}

/** Class representing a high level NOM model layer.   --- UPDATED (Dexter) 20180524 */
class LayerProfile extends ModelNode.Config {
    /**
     * Create a high level NOM model layer.   --- UPDATED (Dexter) 20190221
     * @param {Number} layerType - The type of the NOM layer, as defined in @ModelNode.Layer.Types .
     * @param {String} name - The name of this layer.
     * @param {Number} layerUnits - The number of hidden units in this layer.
     * @param {Boolean} final - Whether this is a final layer (training task).
     * @param {IncomingConfig.Config} incomingConfig - Input configurations.
     * @param {LinearTransformConfig} linearTransform - The linear transformation configuration.
     * @param {String} activation - The activation function of this layer.
     * @param {Object} activationParams - Activation parameters as defined in Tensorflow.
     * @param {Boolean} batchNorm - Whether to use batch normalization before activation function.
     * @param {Object} batchNormParams - Batch normalization parameters as defined in Tensorflow.
     * @param {Number} dropout - The keep probability of dropout during training.
     * @param {OutputConfig.Config} outputConfig - - Output configurations.
     */
    constructor(layerType = ModelNode.Layer.Types.Config, name=null, layerUnits = 150, final = false, 
        incomingConfig = new IncomingConfig.Concat(),
        linearTransform = LinearTransformConfig.createBasicConfig(0, 0.004, false, true, undefined, 0.004, 0.001),
        activation = "relu", activationParams = {}, 
        batchNorm = true, batchNormParams = {}, dropout = 100,
        outputConfig = new OutputConfig.Default()) {
        
        // Define layer setup configurations.
        super(ModelNode.Types.Layer, name);
        /** @type {Number} - The type of the NOM layer, as defined in @ModelNode.Layer.Types . */
        this._layerType = layerType;
        /** @type {String} - The customized language-text template. */
        this._ltTemp = "";
        /** @type {String} - The language-text lookup key. */
        this._lt = "";
        /** @type {Number} - The number of hidden units in this layer. */
        this.layerUnits = layerUnits;
        /** @type {LinearTransformConfig} - The linear transformation configuration of this layer. */
        this.linearTransform = linearTransform;
        /** @type {Boolean} - Whether to use batch normalization before activation function. */
        this.batchNorm = batchNorm;
        /** @type {Object<String,*>} - Batch normalization parameters as defined in Tensorflow. */
        this.batchNormParams = batchNormParams;
        /** @type {String} - The activation function of this layer. */
        this.activation = activation;
        /** @type {Object<String, *>} - Activation parameters as defined in Tensorflow. */
        this.activationParams = activationParams;
        /** @type {IncomingConfig} - The input configurations of this layer. */
        this.incomingConfig = incomingConfig;
        /** @type {OutputConfig.Config} - The output configurations of this layer. */
        this.outputConfig = outputConfig;

        // Define model-related information.
        this.ele = null;
        this._final = final;
        
        // Information that is used within a build.
        this._outputTensors = [];
        this._built = false;
        this._inputCollections = [];
        this._weights = [];
        /** @type {Boolean} - Whether to allow logging the learning parameters in weight graph. */
        this.weightLogging = true;
        
        // Define training-related information.
        /** @type {Number} - The keep probability of dropout during training. */
        this.dropout = dropout;
        this._dropoutTensor = null;
    }

    /**
     * Get the related sources on this layer profile.   --- UPDATED (Dexter) 20190130
     * @returns {Array<Array<Number|String>>} - A list of related source identification pairs in every builds.
     */
    get relatedSources() {
        return this.fromSource;
    }

    /**
     * Export this LayerProfile into a represtable object for project saving.   --- UPDATED (Dexter) 20181126
     * @returns {Object} - JSON-stringifiable object
     */
    exportAsJSON() {
        // For each of the key of this LayerProfile, put them into a new blank object.
        var obj = {};
        [...Object.keys(this)].forEach(k=>{
            // train won't be stringified because of recussive references, while toNode and fromNode are restructured to be stringifiable.
            if (!["train","toNode","fromNode","incomingConfig", "outputConfig", "linearTransform"].includes(k)) {
                obj[k] = this[k];
            } else if (k == "toNode" || k == "fromNode") {
                obj[k] = this[k].map(build=>build.map(l=>l.name));
            } else if (["incomingConfig", "linearTransform", "outputConfig"].includes(k)) {
                obj[k] = this[k] == null ? null : this[k].exportAsJSON();
            } 
        })
        return obj;
    }
    
    /**
     * Parse a previously saved object into this class of LayerProfile.   --- UPDATED (Dexter) 20190210
     * @param {Object} obj - JSON object from Project file
     */
    parseJSON(obj) {
        // Iterate the object keys and take actions on mapping back to the LayerProfile Class.
        [...Object.keys(obj)].forEach(k=>{
            if (!["train","_shape","_order","incomingConfig", "outputConfig", "linearTransform"].includes(k)) {
                this[k] = obj[k];
            } else if (["_shape","_order"].includes(k)) {
                // Backward compatibility for one-dimension shape or order.
                if (obj[k].length && (obj[k][0] instanceof Array)) {
                    this[k] = obj[k];
                } else {
                    this[k] = [obj[k]];
                }
            } else if (k == "linearTransform") {
                if (obj[k] != null) {
                    this[k] = new LinearTransformConfig();
                    this[k].parseJSON(obj[k]);
                } else obj[k] = null;
            } else if (k == "incomingConfig") {
                this[k] = new IncomingConfig[IncomingConfig.Types.getName(obj[k]._instanceClass)]();
                this[k].parseJSON(obj[k]);
            } else if (k == "outputConfig") {
                if (obj[k] != null) {
                    this[k] = new OutputConfig[OutputConfig.Types.getName(obj[k]._instanceClass)]();
                    this[k].parseJSON(obj[k]);
                } else obj[k] = null;
            } 
        });
    }

    /**
     * Check if this layer is a final layer.   --- UPDATED (Dexter) 20181121
     * @returns {Boolean} - Whether this layer is a final layer.
     */
    isFinal() {
        // It's final if there is a task layer
        return this instanceof ModelNode.Layer.Task.Config;
    }
    
    /**
     * Append a layer after this layer.   --- UPDATED (Dexter) 20181121
     * @param {ModelNode.Layer.Config} layerProfile - A layer profile to append after this layer
     * @returns {Boolean} Whether the new layer has been successfully appended after this layer
     */
    appendNode(layerProfile) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // If the layer is already appended on it, returns true.
        if (layerProfile.fromNode[buildNo].includes(this)) return true;

        // The next layer pushes this layer in the .fromNode .
        layerProfile.fromNode[buildNo].push(this);

        // Check for the shape of the next layer, return true/false for whether the new layer is successfully appended.
        var success = layerProfile.updateShape();
        if (success) {
            // If it's fine to have logical shape in the next layer, push the new layer to this layer's .toNode .
            this.toNode[buildNo].push(layerProfile);

            // The next layer will have the logical order higher than this.
            this.train.updateLayerOrder(layerProfile);

            return true;
        } else {
            // Revert previous status.
            layerProfile.fromNode[buildNo] = layerProfile.fromNode[buildNo].slice(0,-1);
            return false;
        }
    }

    /**
     * Remove a specific connection from this layer.   --- UPDATED (Dexter) 20181219
     * @param {ModelNode.Layer.Config} layerProfile - A layer profile to append after this layer.
     * @returns {Boolean} Whether the new layer has been successfully appended after this layer.
     */
    removeConnectionTo(layerProfile) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // The next layer clear this layer from the .fromNode , and return true if it is already not there.
        const oriIdx = layerProfile.fromNode[buildNo].indexOf(this);
        if (oriIdx != -1) layerProfile.fromNode[buildNo].splice(oriIdx, 1);
        else return true;

        // Check for the shape of the next layer, return true/false for whether the new layer is successfully appended.
        var success = [...layerProfile.fromNode[buildNo], ...layerProfile.fromSource[buildNo]].length > 0 ? layerProfile.updateShape() : false;
        if (success) {
            // If it's fine to have logical shape in the next layer, clear the next layer from this layer's .toNode .
            this.toNode[buildNo].splice(this.toNode[buildNo].indexOf(layerProfile), 1);

            // The next layer will have the logical order higher than this.
            this.train.updateLayerOrder(layerProfile);

            return true;
        } else {
            // Revert previous status.
            layerProfile.fromNode[buildNo].push(this);
            return false;
        }
    }

    /**
     * Set multiple training data sources to this layer.   --- UPDATED (Dexter) 20181115
     * @param {Boolean} clear - Whether to clear previous sources.
     * @param {...Number|Array|DataPreprocessing.Node} sources - A list of sources of the Train.sources this layer is linking to.
     * @returns {Boolean} Whether the setup is successful.
     */
    addSources(clear, ...sources) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // Clear all previously defined source linkages if needed.
        if (clear) this.fromSource[buildNo] = [];

        // Assign the source IDs to this referencing sources, with "input" column config as default.
        var newSourceCount = 0;
        sources.forEach(s=>{
            const st = (s instanceof DataPreprocessing.Node ? s.getIDAndKey() : s instanceof Array ? s : [s,"input"]);
            if (this.fromSource[buildNo].findIndex(fst => fst[0] == st[0] && fst[1] == st[1]) == -1) {
                this.fromSource[buildNo].push(st);
                newSourceCount += 1;
            }
        });

        // Check if the shape of this layer is reasonable to confirm the setup.
        var success = this.updateShape();
        if (success) {
            // Update the layer orders.
            this.train.updateLayerOrder(this);
            return true;
        } else {
            // Revert previous status.
            this.fromSource[buildNo] = this.fromSource[buildNo].slice(0,-newSourceCount);
            return false;
        }
    }

    /**
     * Remove one or multiple training data sources from this layer.   --- UPDATED (Dexter) 20181029
     * @param {...Number|Array|DataPreprocessing.Node} sources - A list of sources of the Train.sources this layer is linking to.
     * @returns {Boolean} Whether the setup is successful.
     */
    removeSources(...sources) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        sources.forEach(source=>{
            // Get the source tuple id.
            const tupleID = source instanceof DataPreprocessing.Node ? source.getIDAndKey() : source instanceof Array ? source : [source,"input"];

            // Remove the source from this layer.
            this.fromSource[buildNo].splice(this.fromSource[buildNo].findIndex(sid=>sid[0] == tupleID[0] && sid[1] == tupleID[1]), 1);
        });

        // Check if the shape of this layer is reasonable to confirm the setup.
        var success = this.updateShape();
        if (success) {
            // Update the layer orders.
            this.train.updateLayerOrder(this);
            return true;
        } else {
            // Revert previous status.
            sources.forEach(source=>{
                // Get the source tuple id.
                const tupleID = source instanceof DataPreprocessing.Node ? source.getIDAndKey() : source instanceof Array ? source : [source,"input"];

                // Push back the tuple id.
                this.fromSource[buildNo].push(tupleID);
            });
            return false;
        }
    }

    /**
     * Append this layer on a previously another layer or data source.   --- UPDATED (Dexter) 20180812
     * @param {ModelNode.Layer.Config|DataPreprocessing.Node} layerOrSource - The layer profile or column config on which this layer append.
     * @returns {ModelNode.Layer.Config|null} - This layer profile object; null if the append is not successful.
     */
    appendOn(layerOrSource) {
        var success = false;
        if (layerOrSource instanceof LayerProfile) {
            // Ensure the previous layer is attached to a training model.
            success = layerOrSource.train.appendLayer(this, appendAt = layerOrSource);
        } else if (layerOrSource instanceof DataPreprocessing.Node) {
            // Ensure the column config is attached to a training model.
            success = layerOrSource.trainSource.train.appendLayer(this, appendAt = layerOrSource);
        }
        return success ? this : null;
    }
    
    /**
     * Attach this layer to several previous another layer or data source.   --- UPDATED (Dexter) 20180812
     * @param {...(ModelNode.Layer.Config|DataPreprocessing.Node)} layerOrSources - The layer profile or column config on which this layer append.
     * @returns {ModelNode.Layer.Config} - This layer profile object.
     */
    attachTo(...layerOrSources) {
        // Get all previous layers.
        var allPreviousTrains = layerOrSources.map(ls=>(ls instanceof LayerProfile) ? ls.train : (ls.trainSource == null) ?  null : ls.trainSource.train);
        
        // Ensure all previous layers and sources are under the same training model.
        if (allPreviousTrains[0] == null || allPreviousTrains.some(t => t!=allPreviousTrains[0])) {
            return null
        } else {
            // Attach this layer.
            allPreviousTrains[0].attachLayer(this, ...layerOrSources);
            return this;
        }
    }

    /**
     * Get a list of connectable nodes.   --- UPDATED (Dexter) 20181028
     * @param {String} mode   - Connection mode name: "connect" | "attach"
     * @returns {(ModelNode.Layer.Config|DataPreprocessing.Node)[]} - A list of connectable nodes.
     */
    getConnectableNodes(mode) {
        var layers = [...this.train.layerProfiles.values()].filter(mode == "connect" ? (lp=>lp!=this && !lp.hasPathTo(this)) : (lp=>lp!=this && !this.hasPathTo(lp)));
        var sources = mode == "connect" ? [] : this.train.getAllColConfigs().filter(cf=>cf.ele != null);
        return [...layers, ...sources];
    }

    /**
     * Update the output shape of this layer.   --- UPDATED (Dexter) 20181124
     * @returns {Array} The shape of the output this layer.
     */
    updateShape() {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // Assign the ._shape by getting the shape through immitating the graph building.
        var newShape = this.getOutputShape();
        if (newShape) this._shape[buildNo] = newShape;
        return newShape;
    }

    /**
     * Update the order of this layer in a chained way.   --- UPDATED (Dexter) 20181121
     */
    updateOrder() {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        this._order[buildNo] = Math.max(...this.fromNode[buildNo].map(lp=>lp._order[buildNo]), 0) + 1;
        this.toNode[buildNo].forEach(lp=>lp.updateOrder());
    }

    /**
     * Apply any shape changes based on preceding layer changes or changes made in the layer properties.   --- UPDATED (Dexter) 20181130
     * @param {Object[]} fromShapeChanges - See definition on LayerProfile.getInputShape() method.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Boolean} applyImmediately - Whether effect will be taken immediately on any changes once confirm proceeding layers have no conflicts.
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Object} - Return a result information: {result: Boolean - Whether the change can be applied (and updated) successfully, error: Object - Translatable information of error message} .
     */
    applyShapeChanges(fromShapeChanges, configChanges = {}, centralizedMap = new Map(), applyImmediately = true) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // Have previous check on centralized map.
        var chainCheck = this.applyShapeChainChecks(fromShapeChanges, configChanges, centralizedMap), itself;
        if (chainCheck.error) return {result: true};
        else [fromShapeChanges, configChanges, itself] = [chainCheck.fromShapeChanges, chainCheck.configChanges, chainCheck.itself];

        // Try building this layer with the new shape.
        var newShape = this.getOutputShape(fromShapeChanges, configChanges, centralizedMap);

        // If shape can't be built, reject the change.
        if (!newShape) {
            var cuzLTMsg = App.createCuzLT(lang=>this._ltTemp.replace("$$$", App.getTxtFromLang(this._lt,lang)) + ": " + App.getTxtFromLang("notCompWithPrev",lang));
            return {result: false, error: cuzLTMsg};
        }

        // If it's fine, set up the change information and prepare to apply this change to proceding layers.
        var nextFromShapeChanges = {type: "layer", id1: this.name, id2: 0, shape: newShape};

        // Identify if this layer has a next layer.
        var hasNextLayer = this.toNode[buildNo].length > 0;

        // If this layer is already in centralized map, update itself.
        if (itself) {
            itself.status = 2;
            itself.outputShape = newShape;
        }

        // Check for all next layers whether they can applied with the changes.
        var result = true, error = null;
        if (hasNextLayer) {
            // Add next layers to the centralized map that will be affected.
            this.toNode[buildNo].forEach(l=>centralizedMap.set(l.name, {status: 1, layerProfile: l, fromShapeChanges: nextFromShapeChanges, configChanges: {}, outputShape: null}));

            // Request next layer results and check if they're fine with the changes.
            var nextLayerResults = [...this.toNode[buildNo].map(lp=>lp.applyShapeChanges(nextFromShapeChanges, undefined, centralizedMap, false))];
            [error, result] = Project.extractErrors(nextLayerResults);
        } 

        // Try to apply this layer's change and affect the proceding layers.
        if (result && applyImmediately) {
            // Apply the changes.
            centralizedMap.forEach((info)=>info.layerProfile.commitChanges(info));

            // Apply this change.
            var thisInfo = {configChanges: configChanges, outputShape: newShape};
            this.commitChanges(thisInfo);
        }

        return error ? {result: false, error: error} : {result: true};

    }

    /**
     * Apply any shape changes based on preceding layer changes or changes made in the layer properties. The function is defined in the subclasses.   --- UPDATED (Dexter) 20180824
     * @param {Object[]} fromShapeChanges - See definition on LayerProfile.getInputShape() method.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Boolean} applyImmediately - Whether effect will be taken immediately on any changes once confirm proceeding layers have no conflicts.
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Object} - Return a result information: {result: Boolean - Whether the change can be applied (and updated) successfully, error: Object - Translatable information of error message} .
     */
    applyShapeChainChecks(fromShapeChanges, configChanges, centralizedMap = new Map()) {
        var itself;
        if (centralizedMap.size) {
            // Ensure all previous layers are fine with the changes.
            var previousNodes = [...centralizedMap.values()].filter(lInfo=>lInfo.layerProfile.hasPathTo(this));
            var previousResolved = previousNodes.every(lInfo=>lInfo.status == 2);
            var cuzLTMsg = App.createCuzLT(lang=>this._ltTemp.replace("$$$", App.getTxtFromLang(this._lt,lang)) + ": " + App.getTxtFromLang("notCompWithPrev",lang));
            if (previousResolved.length < previousNodes.length) return {result: false, error: cuzLTMsg};

            // Update from centralizedMap.
            if (centralizedMap.has(this.name)) {
                itself = centralizedMap.get(this.name);
                fromShapeChanges = fromShapeChanges || itself.fromShapeChanges;
                configChanges = Object.keys(configChanges).length ? configChanges : itself.configChanges;
            }
        } else {
            // Include itself into the change list.
            itself = {status: 1, layerProfile: this, fromShapeChanges: fromShapeChanges, configChanges: configChanges, outputShape: null};
            centralizedMap.set(this.name, itself);
        }
        return {result: true, fromShapeChanges: fromShapeChanges, configChanges: configChanges, itself: itself};
    }

    /**
     * Commit the changes, typically after all validation tests.   --- UPDATED (Dexter) 20181130
     * @param {Object} changeInfo - The change info.
     * @param {Object} changeInfo.configChanges - The layer onfiguration changes.
     * @param {Number[]} changeInfo.outputShape - The output shape of this layer.
     */
    commitChanges(changeInfo) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        if (changeInfo.configChanges) [...Object.keys(changeInfo.configChanges)].forEach(k => this[k] = changeInfo.configChanges[k]);
        this._shape[buildNo] = changeInfo.outputShape;
    }

    /**
     * Merge fromShapeChanges where there may be previous changes as stated in centralizedMap but new changes from chained changes.   --- UPDATED (Dexter) 20180830
     * @param {Object[]} fromShapeChanges - See definition on LayerProfile.getInputShape() method.
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @return {Object[]} - A merged version of fromShapeChanges.
     */
    mergeShapeChanges(fromShapeChanges = null, centralizedMap = new Map()) {
        var thisPrevConfigInfo = centralizedMap.get(this.name);
        if (thisPrevConfigInfo && thisPrevConfigInfo.fromShapeChanges && thisPrevConfigInfo.fromShapeChanges.type == "dynamic" && fromShapeChanges) {
            if (fromShapeChanges.type != "dynamic") fromShapeChanges = {type: "dynamic", info: [fromShapeChanges]};
            thisPrevConfigInfo.fromShapeChanges.info.forEach(oriInfo=>{
                if (!fromShapeChanges.info.find(newInfo=>newInfo.type == oriInfo.type && newInfo.type == oriInfo.type && newInfo.type == oriInfo.type)) {
                    fromShapeChanges.info.push(oriInfo);
                }
            });
        }
        return fromShapeChanges;
    }

    /**
     * Get the shape of collected input of this layer by immitating the nodes collection.   --- UPDATED (Dexter) 20181126
     * @param {(Number|String)[][]} incomingShapes - A list of shape arrays of incoming tensors.
     * @returns {Array} - Return the shape of the combined incoming shape.
     */
    combineIncomingShapes(incomingShapes, configChanges = {}) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // There should be at least one incoming shape.
        if (incomingShapes.length == 0) return null;

        // If there is only one node, just pass the node to the layer.
        else if (incomingShapes.length == 1) return incomingShapes[0];
        
        // Before any checking, reshape any incoming nodes of shape [None] into [None,1].
        incomingShapes = incomingShapes.map(shape=>shape.length == 1 ? [shape[0], 1] : shape);

        // Prepare necessary information.
        var coreShape = null;
        var incomingConfig = configChanges.incomingConfig || this.incomingConfig;
        var lowestDim = Math.min(...incomingShapes.map(s=>s.length));
        var isElementWiseOp = [IncomingConfig.Types.Sum, IncomingConfig.Types.Multiply, IncomingConfig.Types.Blend]

        // Determine the core node.
        if (incomingConfig.coreNode == null) {
            // Find the nodes with lowest number of dimensions.
            var lowDShapes = incomingShapes.filter(s=>s.length == lowestDim);
            
            // Determine the core node according to the lowest total dimension.
            var totalDims = lowDShapes.map(s=>s.slice(1,-1).reduce((a,b) => a*b, 1));
            var lowestTotalDims = Math.min(...totalDims);
            coreShape = lowDShapes[totalDims.findIndex(s=>s==lowestTotalDims)];
        } else {
            // Ensure the coreNode is in the incoming node.
            if (!this.fromNode[buildNo].includes(incomingConfig.coreNode)) return null;

            // Assign the core node.
            coreShape = incomingConfig.coreNode.getPreprocessedIncomingShape();
        }

        // Locate the core index.
        var coreIdx = incomingShapes.findIndex(s=>shapeEquals(s, coreShape));
        if (coreIdx == -1) return null;

        // Determine the concatenation axis.
        var axis = incomingConfig.axis == -1 ? coreShape.length - 1 : incomingConfig.axis;

        // Failes for illogical connections.
        if (axis >= coreShape.length) return null;
        else if (!incomingShapes.map(s=>s.slice(0,axis)).every(s=>(shapeEquals(s, coreShape.slice(0,axis)) || s.every((si, idx)=>(si == coreShape[idx] || (si == "None" && coreShape[idx] == "None") || (si % coreShape[idx] == 0)))))) {
            return null;
        }

        // Align the dimensions of all tensors through reshaping.
        incomingShapes.forEach((s,idx, ary)=>{
            if (s.length > axis) {
                // If other nodes are having shape longer than the core node, reshape it as the same dimension length.
                ary[idx] = [...s.slice(0,axis), s.slice(axis).reduce((x,y)=>x*y, 1)];
            } else if (s.length < axis) {
                // If other nodes are having shape shorter than the core node, reshape it (create 1 dimension) as the same dimension length.
                var newShape = [];
                for (let dimIdx = 0; dimIdx < axis; dimIdx ++ ) {
                    newShape.push(dimIdx < s.length ? s[dimIdx] : 1);
                }
                ary[idx] = newShape;
            }

            if (!shapeEquals(ary[idx].slice(0,axis), coreShape.slice(0,axis))) {
                // Handle dimension reduction on dimensions before operation axis. --- BETA
                // Understand how dimensions are to be split.
                var compareSplit = ary[idx].slice(0,axis).map((dim,dimIdx)=>(dim == "None" || coreShape[dimIdx] == "None") ? "None" : Math.round(dim/coreShape[dimIdx]));

                // Handle incoming nodes according to the defined methods.
                if ([IncomingConfig.MergeDimTypes.SpaceToDepth, IncomingConfig.MergeDimTypes.SubSample].includes(incomingConfig.mergeDim)) {
                    ary[idx][axis] *= compareSplit.reduce((a,b)=>a*(b=="None" ? 1 : b), 1);
                } else if ([IncomingConfig.MergeDimTypes.MaxPool, IncomingConfig.MergeDimTypes.MeanPool].includes(incomingConfig.method)) {
                    // Throw error if there is no multiplicable axis.
                    if (compareSplit.slice(1).includes("None")) return null;

                    for (let dimIdx = 1; dimIdx < axis; dimIdx++)
                        ary[idx][dimIdx] /= compareSplit[dimIdx];
                }
            }
        });

        if (incomingConfig.method == IncomingConfig.Types.Concat) {
            // Concatenate all tensors.

            // Not applicable if not all incoming nodes having dimensions equal except the axis dimension.
            var firstShape = incomingShapes[0];
            if (!incomingShapes.every(s=>s.every((sd,si)=>sd == firstShape[si] || si == axis))) return null;
            return [...firstShape.slice(0,axis), incomingShapes.map(s=>s[axis]).reduce((a,b)=>a+b,0), ...firstShape.slice(axis+1)];

        } else if (isElementWiseOp) {
            // If they are having element-wise operations: --- BETA

            // Convert the dimensions if the core axis dimension are not the same with another node.
            return incomingShapes[coreIdx];
        } else return null;
    }

    /**
     * Get the shape of preprocessed incoming nodes of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181126
     * @param {(Number|String)[]} combinedIncomingShape - A shape array of combined incoming shape.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Array} - Return the shape of the pre-proccessed incoming shape.
     */
    preprocessIncomingShape(combinedIncomingShape, configChanges = {}, centralizedMap = new Map()) {
        return combinedIncomingShape;
    }

    /**
     * Get the shape of layer-specific-processed tensor of this layer by immitating layer-specific operations.   --- UPDATED (Dexter) 20181126
     * @param {(Number|String)[]} preprocessedIncomingShape - A shape array of pre-proccessed incoming shape.
     * @returns {Array} - Return the shape of the tensor after layer-specific operation.
     */
    processOperationShape(preprocessedIncomingShape, configChanges = {}) {
        return preprocessedIncomingShape;
    }

    /**
     * Get the shape of output of this layer by immitating the output processing.   --- UPDATED (Dexter) 20190210
     * @param {(Number|String)[]} operatedShape - A shape array of layer-specific operations.
     * @returns {Array} - Return the shape of the output tensor.
     */
    processOperatedShape(operatedShape, configChanges = {}) {
        // Prepare necessary information.
        var outputConfig = configChanges.outputConfig || this.outputConfig;

        if (outputConfig instanceof OutputConfig.Flatten) {
            // Get the flatten axis.
            const axis = outputConfig.axis;

            // If the axis is out of range, it'll be an error.
            if (axis <= 0 || axis >= operatedShape.length) return null;

            // Reshape according to the flatten axis.
            else return [...operatedShape.slice(0, axis), operatedShape.slice(axis).reduce((a,b)=>a*b, 1)];
        } else if (outputConfig instanceof OutputConfig.Reshape) {
            // Get the new shape.
            const newShape = [...outputConfig.shape];

            // Get the total dimension specified in the new shape.
            var confirmShape = Math.round(newShape.filter(s=>!["None", -1].includes(s)).reduce((a,b) => a*b, 1));

            // Get the total dimension specified in the original shape.
            var totalShape = Math.round(operatedShape.filter(s=>s != "None").reduce((a,b) => a*b, 1));

            // Confirm if the remaining axis (with value -1) is an integer.
            if (totalShape % confirmShape == 0) {
                // Replace the remaining axis (with value -1) with the reshaped dimension.
                const idx = newShape.indexOf(-1);
                if (idx == -1) {
                    return (totalShape/confirmShape == 0) ? newShape : null;
                } else {
                    newShape[idx] = Math.round(totalShape/confirmShape);
                    return newShape;
                }
            } else {
                return null;
            }
        } else return operatedShape;
    }

    /**
     * Try to get the shapes of the incoming layer nodes.   --- UPDATED (Dexter) 20190320
     * @param {Object[]} fromShapeChanges - An array of shape information of the preceding layers.
     * @param {String} fromShapeChanges[].type - The type of the preceding layer, "source", "layer" or "dynamic".
     * @param {Number|String} fromShapeChanges[].id1 - The source ID if the preceding layer is a "source"; the layer name if it's a "layer".
     * @param {String} fromShapeChanges[].id2 - The column config name if the preceding layer is a "source".
     * @param {Number[]} fromShapeChanges[].shape - A shape array specifying the new shape of the preceding layer.
     * @param {Object[]} fromShapeChanges[].info - An array of listed from source or node info.
     * @param {String} fromShapeChanges[].info[].type - The type of the preceding layer, "source" or "layer".
     * @param {Number|String} fromShapeChanges[].info[].id1 - The source ID if the preceding layer is a "source"; the layer name if it's a "layer".
     * @param {String} fromShapeChanges[].info[].id2 - The column config name if the preceding layer is a "source".
     * @param {Number[]} fromShapeChanges[].info[].shape - A shape array specifying the new shape of the preceding layer.
     * @returns {Number[][]} An array of shapes of preceding layers.
     */
    getIncomingShapes(fromShapeChanges=null) {
        // Get the model editing build no. if it has been pushed into a train.
        const buildNo = this.train ? this.train._editingBuild : undefined;

        // Enusre the data sources are numbers.
        if (this.fromSource[buildNo].length && this.fromSource[buildNo].some(s=>!this.train.getDataSource(...s).isNumber())) return null;

        var fromTensors;
        if (!fromShapeChanges) {
            // If no changes is given, return the list of shapes of preceding layers / sources.
            fromTensors = [...this.fromSource[buildNo].map(s=>this.train.getDataSource(...s).getShape()), ...this.fromNode[buildNo].map(lp=>lp._shape[buildNo])];
        } else {
            // Depending on whether the change is made on "source" or "layer", get the list of non-affecting layers' shapes.
            if (fromShapeChanges.type != "dynamic") {
                if (fromShapeChanges.type == "source") {
                    // Enusre the data sources are numbers.
                    fromTensors = [...this.fromSource[buildNo].map(s=>{
                        if (s[0] != fromShapeChanges.id1 && s[1] != fromShapeChanges.id2) {
                            let dppNode = this.train.getDataSource(...s);
                            return dppNode.getShape() && dppNode.isNumber(true);
                        } else return null;
                    }), ...this.fromNode[buildNo].map(lp=>lp._shape[buildNo])];
                } else if (fromShapeChanges.type == "layer") {
                    fromTensors = [...this.fromSource[buildNo].map(s=>this.train.getDataSource(...s).getShape()), ...this.fromNode[buildNo].map(lp=>{
                        if (lp.name != fromShapeChanges.id1)
                            return lp._shape[buildNo];
                        else return null;
                    })];
                }

                // The new list will include those non-affected preceding layers, and the new shape as requested.
                fromTensors = [...fromTensors.filter(shape=>shape), fromShapeChanges.shape];
            } else {
                // Map all new sources / layers with their shapes or updated shapes.
                fromTensors = fromShapeChanges.info.map(lp=>{
                    if (lp.shape) return lp.shape;
                    else if (lp.type == "layer") {
                        return this.train.layerProfiles.get(lp.id1)._shape[buildNo];
                    } else if (lp.type == "source") {
                        return this.train.getDataSource(lp.id1, lp.id2).getShape();           
                    } else return null;
                });
            }
        }

        // Return all the newly defined shapes of preceding layers.
        return fromTensors;
    }

    /**
     * Get the combined and pre-proccessed incoming shapes (before any layer-specific processing).   --- UPDATED (Dexter) 20181217
     * @param {Object[]} fromShapeChanges - See definition on LayerProfile.getInputShape() method.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Array} Return the shape of the preprocessed incoming shape of this layer; null if conflicts occurs and it can't be built logically.
     */
    getPreprocessedIncomingShape(fromShapeChanges=null, configChanges = {}, centralizedMap = new Map()) {
        // Get the list of shapes of preceding layers.
        var incomingShapes = this.getIncomingShapes(fromShapeChanges);
        if (incomingShapes == null) return null;

        // Get the combined incoming shape.
        var combinedIncomingShapes = this.combineIncomingShapes(incomingShapes, configChanges);
        return combinedIncomingShapes == null ? null : this.preprocessIncomingShape(combinedIncomingShapes, configChanges, centralizedMap);
    }

    /**
     * Get the shape of processed operations of this layer by immitating the graph building.   --- UPDATED (Dexter) 20190210
     * @param {Object[]} fromShapeChanges - See definition on LayerProfile.getInputShape() method.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Array} Return the shape of the output of this layer; null if conflicts occurs and it can't be built logically.
     */
    getPreprocessedOperationShape(fromShapeChanges = null, configChanges = {}, centralizedMap = new Map()) {
        // Check if there is previously set centralizedMap, and replace with current fromShapeChanges if needed.
        fromShapeChanges = this.mergeShapeChanges(fromShapeChanges, centralizedMap);
        var thisPrevConfigInfo = centralizedMap.get(this.name);
        
        // Get the list of shapes of preceding layers.
        var preprocessedIncomingShape = this.getPreprocessedIncomingShape(fromShapeChanges, configChanges, centralizedMap);
        if (preprocessedIncomingShape == null) return null;

        // Update the inputShape if needed.
        if (thisPrevConfigInfo) thisPrevConfigInfo.preprocessedIncomingShape = preprocessedIncomingShape;

        // Get layer-specific tensor processing shape.
        return this.processOperationShape(preprocessedIncomingShape, configChanges);
    }
    
    /**
     * Get the shape of output of this layer by immitating the graph building.   --- UPDATED (Dexter) 20181126
     * @param {Object[]} fromShapeChanges - See definition on LayerProfile.getInputShape() method.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Array} Return the shape of the output of this layer; null if conflicts occurs and it can't be built logically.
     */
    getOutputShape(fromShapeChanges = null, configChanges = {}, centralizedMap = new Map()) {
        // Check if there is previously set centralizedMap, and replace with current fromShapeChanges if needed.
        fromShapeChanges = this.mergeShapeChanges(fromShapeChanges, centralizedMap);
        var thisPrevConfigInfo = centralizedMap.get(this.name);
        
        // Get the list of shapes of preceding layers.
        var preprocessedIncomingShape = this.getPreprocessedIncomingShape(fromShapeChanges, configChanges, centralizedMap);
        if (preprocessedIncomingShape == null) return null;

        // Update the inputShape if needed.
        if (thisPrevConfigInfo) thisPrevConfigInfo.preprocessedIncomingShape = preprocessedIncomingShape;

        // Get layer-specific tensor processing shape.
        var operatedShape = this.processOperationShape(preprocessedIncomingShape, configChanges);
        if (operatedShape == null) return null;

        return this.processOperatedShape(operatedShape, configChanges);
    }

    /**
     * Check if there is any path to a specific layer profile.   --- UPDATED (Dexter) 20180812
     * @param {ModelNode.Layer.Config} layerProfile - A specific layer profile to check whether this layer is connected to.
     * @returns {Boolean} - Whether there is path to the specific layer profile.
     */
    hasPathTo(layerProfile) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // If the specific layer profile has a lower order, it must not have been connected after this layer.
        if (layerProfile._order[buildNo] <= this._order[buildNo]) return false;

        // If the layer profile is just after this layer, it is connected.
        else if (this.toNode[buildNo].indexOf(layerProfile) > -1) return true;

        // Otherwise, check all proceeding layers if any of them has connected to the specific layer profile.
        else return this.toNode[buildNo].some(l=>l.hasPathTo(layerProfile));
    }

    /**
     * Remove this layer from the training.   --- UPDATED (Dexter) 20181227
     * @param {Number} removalType - The type of removing this node: 0 (default) - Auto edge reconnections; 1 - Disable new connections; 2 - Force all new connections.
     */
    remove(removalType = 0) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // Try to observe the changes after the removal of this node.
        var thisFromNodes = this.fromNode[buildNo];
        var thisFromSources = this.fromSource[buildNo];

        // If some of the layers are using this layer as reference layer, reject the removal.
        if ([...this.train.layerProfiles.values()].some(lp=>lp.refLayerName == this.name)) {
            // Give error message on not successful deletion.
            AppNotification.show("noDelT", "noDelCRef", "cancel.svg");
        } else {
            // Try to understand if this layer can be deleted.
            const successInfo = this.toNode[buildNo].map(l=>{
                // If no new connections are allowed and the proceeding layer is only connected to this layer, this will be an error.
                if (removalType == 1 && l.fromNode[buildNo].length == 1) return {results: false};

                // If there must be diverting a connection to the new layer, try build using both the sources and nodes from the original and this layer.
                else {
                    // New layers are all this and original layers, with no duplicated layers.
                    var newLayerIn = [...(new Set([...thisFromNodes, ...l.fromNode[buildNo].filter(lf => lf != this)].map(l=>l.name)))];

                    // New Sources are all this and original sources, with no duplicated layers.
                    var newSourceIn = [...thisFromSources, ...l.fromSource[buildNo]].filter((s,idx,ary)=>ary.findIndex(s2=>s2[0] == s[0] && s2[1] == s[1]) == idx);

                    var newInfo = [...newLayerIn.map(ln=>({type: "layer", id1: ln})), ...newSourceIn.map(s=>({type: "source", id1: s[0], id2: s[1]}))];

                    if (removalType == 2) {
                        // Try build the next layer with the new configurations.
                        return {results: l.getOutputShape({type: "dynamic", info: newInfo}), info: newInfo};
                    } else if (removalType == 0) {
                        // Try build all combination of possible incoming path;
                        var allComb = getCombinations(newInfo);
                        for (var info of allComb) {
                            const success = l.getOutputShape({type: "dynamic", info: newInfo});
                            if (success) return {results: true, info: info};
                        }
                        return {results: false};
                    }
                }
            });

            if (successInfo.some(si=>!si.results)) {
                // Give error message on not successful deletion.
                AppNotification.show("noDelT", "noDelC", "cancel.svg");
            } else {
                // Delete the layer from Train collections.
                this.train.layerProfiles.delete(this.name);

                // Remove the layer from previous nodes.
                this.fromNode[buildNo].forEach(l=>l.toNode[buildNo] = l.toNode[buildNo].filter(t=>t!=this));
                this.toNode[buildNo].forEach((l,idx)=>l.fromNode[buildNo] = l.fromNode[buildNo].filter(t=>t!=this));
                this.toNode[buildNo].forEach((l,idx)=>l.updateOrder());

                // Attach to the new connections.
                this.toNode[buildNo].forEach((l,idx)=>{
                    var attachOn = successInfo[idx].info.filter(info=>info.type == "layer" ? l.fromNode[buildNo].findIndex(fl=>fl.name == info.id1) == -1 : l.fromSource[buildNo].findIndex(fs=>fs[0] == info.id1 && fs[1] == info.id2) == -1).map(info=>info.type == "layer" ? this.train.layerProfiles.get(info.id1) : this.train.getDataSource(info.id1, info.id2));
                    if (attachOn.length) l.attachTo(...attachOn);
                    else l.updateShape();
                });
                
                // Re-draw the project.
                this.train._project.drawTrain();

                // Give successful message on not successful deletion.
                AppNotification.show("delT", "", "delete.svg");
            }
        }
    }

    /**
     * Remove this layer from the training.   --- UPDATED (Dexter) 20181220
     * @param {Boolean} startFromThis - Whether this layer is the starting point to remove layer.
     */
    removeThisAndAllProceedings(startFromThis = true) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // If some of the layers are using this layer as reference layer and they are not the direct path, reject the removal.
        if ([...this.train.layerProfiles.values()].some(lp=>lp.refLayerName == this.name && !this.hasPathTo(lp))) {
            // Give error message on not successful deletion.
            AppNotification.show("noDelT", "noDelCRef", "cancel.svg");
        } else {
            // Delete the layer from Train collections.
            this.train.layerProfiles.delete(this.name);

            // Remove the layer from previous nodes.
            this.fromNode[buildNo].forEach(l=>l.toNode[buildNo] = l.toNode[buildNo].filter(t=>t!=this));

            // Loop all next layers.
            this.toNode[buildNo].forEach(l=>l.removeThisAndAllProceedings(false));

            // Remove the layer from previous nodes.
            this.fromNode[buildNo].forEach(l=>l.toNode[buildNo] = l.toNode[buildNo].filter(t=>t!=this));

            // Update the orders of any final layers.
            this.train.getFinalLayers().forEach(l=>l.updateOrder());

            // Re-draw the project.
            if (startFromThis) this.train._project.drawTrain();
        }
    }
    
    /**
     * Show the layer name on an element.   --- UPDATED (Dexter)  20180818
     * @param {Element} ele - HTML element where the layer name to show.
     */
    showNameOnEle(ele) {
        if (this._ltTemp)  {
            ele.dataset.ltTemp = this._ltTemp;
            ele.dataset.lt = this._lt;
            App.applyEleLang(ele);
        } else {
            ele.innerText = this.name;
            ele.dataset.lt = ele.dataset.ltTemp = "";
        }
    }

    /**
     * Get a specific object from a layer profile with given attribute names path.   --- UPDATED (Dexter) 20181129
     * @param  {...String} attrNames - The path to the object.
     * @returns {Any} - The requested variable configuration.
     */
    getValue(...attrNames) {
        var value = this;
        for (let attr of attrNames) value = value[attr];
        return value;
    }
}

/**
 * Class representing a collector layer, without any dimensional transformation from all the input layers.   --- UPDATED (Dexter) 20181126
 */
class Collector extends ModelNode.Layer.Config {
    /**
     * Create a collector layer, without any dimensional transformation from all the input layers.   --- UPDATED (Dexter) 20190221
     * @param {String} name - The name of this layer.
     * @param {String} activation - The activation function of this layer.
     * @param {Object} activationParams - Activation parameters as defined in Tensorflow.
     * @param {IncomingConfig} incomingConfig - Input configurations.
     * @param {Boolean} batchNorm - Whether to use batch normalization before activation function.
     * @param {Object} batchNormParams - Batch normalization parameters as defined in Tensorflow.
     * @param {Number} dropout - The keep probability of dropout during training.
     * @param {OutputConfig} outputConfig - Output configurations.
     */
    constructor(name = null, 
                activation = "linear", activationParams = {},
                incomingConfig = new IncomingConfig.Concat(),
                batchNorm = true, batchNormParams = {},
                dropout = 100, outputConfig = new OutputConfig.Default()) {
        super(ModelNode.Layer.Types.Collector, name, -1, false, incomingConfig, null, activation, activationParams, 
            batchNorm, batchNormParams, dropout, outputConfig);
        this._type = "Collector";
    }

    /**
     * Get the shape of preprocessed incoming nodes of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181126
     * @param {(Number|String)[]} combinedIncomingShape - A shape array of combined incoming shape.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Array} - Return the shape of the pre-proccessed incoming shape.
     */
    preprocessIncomingShape(combinedIncomingShape, configChanges = {}, centralizedMap = new Map()) {
        return combinedIncomingShape;
    }

    /**
     * Get the shape of layer-specific-processed tensor of this layer by immitating layer-specific operations.   --- UPDATED (Dexter) 20181126
     * @param {(Number|String)[]} preprocessedIncomingShape - A shape array of pre-proccessed incoming shape.
     * @returns {Array} - Return the shape of the tensor after layer-specific operation.
     */
    processOperationShape(preprocessedIncomingShape, configChanges = {}) {
        return preprocessedIncomingShape;
    }

}

/** Class representing a basic layer, aka fully connected layer, dense layer, etc.   --- UPDATED (Dexter) 20180524 */
class BasicLayer extends ModelNode.Layer.Config {
    /**
     * Create a basic layer, aka fully connected layer, dense layer, etc.   --- UPDATED (Dexter) 20190221
     * @param {String} name - The name of this layer.
     * @param {Number} layerUnits - The number of hidden units in this layer.
     * @param {Number} flattenToAxis - The flattening axis after consolidating all preceding layers.
     * @param {String} refLayerName - Any referenced weight that this layer mirrors for.
     * @param {Boolean} refLayerTranspose - Whether transpose is required for the referenced weight.
     * @param {IncomingConfig} incomingConfig - Input configurations.
     * @param {LinearTransformConfig} linearTransform - The linear transformation configuration.
     * @param {String} activation - The activation function of this layer.
     * @param {Object} activationParams - Activation parameters as defined in Tensorflow.
     * @param {Boolean} batchNorm - Whether to use batch normalization before activation function.
     * @param {Object} batchNormParams - Batch normalization parameters as defined in Tensorflow.
     * @param {Number} dropout - The keep probability of dropout during training.
     * @param {OutputConfig} outputConfig - - Output configurations.
     */
    constructor(name=null, layerUnits = 150, flattenToAxis = 1, refLayerName = null, refLayerTranspose = false, 
        incomingConfig = new IncomingConfig.Concat(),
        linearTransform = LinearTransformConfig.createBasicConfig(0, 0.004, false, true, undefined, 0.004, 0.001),
        activation = "relu", activationParams = {}, 
        batchNorm = true,  batchNormParams = {}, dropout = 100, 
        outputConfig = new OutputConfig.Default()) {
        super(ModelNode.Layer.Task.FullyConnected, name, layerUnits, false, 
            incomingConfig, linearTransform,
            activation, activationParams, 
            batchNorm, batchNormParams, 
            dropout, outputConfig);
        /** @type {Number} - The flattening axis after consolidating all preceding layers. */
        this.flattenToAxis = flattenToAxis;
        /** @type {String} - Any referenced weight that this layer mirrors for. */
        this.refLayerName = refLayerName;
        /** @type {Boolean} - Whether transpose is required for the referenced weight. */
        this.refLayerTranspose = refLayerTranspose;
        this._type = "BasicLayer";
    }

    /**
     * Get the shape of preprocessed incoming nodes of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181126
     * @param {(Number|String)[]} combinedIncomingShape - A shape array of combined incoming shape.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Array} - Return the shape of the pre-proccessed incoming shape.
     */
    preprocessIncomingShape(combinedIncomingShape, configChanges = {}, centralizedMap = new Map()) {
        // Apply layer configs from referencing layer.
        var refLayerName = configChanges.refLayerName || this.refLayerName, refLayerInfo, hasRefLayerInfo = false, refLayer;
        if (refLayerName) {
            // Get the layer properties from the changed or original reference layer configs.
            refLayerInfo = centralizedMap.get(refLayerName);
            hasRefLayerInfo = !!refLayerInfo;
            refLayer = this.train.layerProfiles.get(refLayerName);

            // No reference for non-matched type of layer.
            if (refLayer._type != "BasicLayer") return null;
            
            // Update flattenToAxis.
            configChanges.flattenToAxis = (hasRefLayerInfo && "flattenToAxis" in refLayerInfo.configChanges) ? refLayerInfo.configChanges.flattenToAxis : refLayer.flattenToAxis;
        }

        // Apply flatten to axis.
        var flattenToAxis = "flattenToAxis" in configChanges ? configChanges.flattenToAxis : this.flattenToAxis;
        if (flattenToAxis >= combinedIncomingShape.length) return null;
        var preprocessedIncomingShape = [...combinedIncomingShape.slice(0,flattenToAxis), combinedIncomingShape.slice(flattenToAxis).reduce((a,b)=>a*b, 1)]

        if (refLayerName) {
            // Determine whether transpose is needed. If neither transpose can be operated, this cannot be referenced, and the changes can't be applied.
            var refInputShape = (hasRefLayerInfo && "preprocessedIncomingShape" in refLayerInfo) ? refLayerInfo.preprocessedIncomingShape : refLayer.getPreprocessedIncomingShape();
            var refOutputShape = (hasRefLayerInfo && "outputShape" in refLayerInfo) ? refLayerInfo.outputShape : refLayer.getOutputShape();
            var refLayerTranspose = shapeEquals(refInputShape, preprocessedIncomingShape) ? false : shapeEquals(refOutputShape, preprocessedIncomingShape) ? true : null;
            if (refLayerTranspose === null) return null;
            
            // Apply other reference layer configurations.
            configChanges.refLayerTranspose = refLayerTranspose;
            configChanges.layerUnits = refLayerTranspose ? refInputShape.slice(-1)[0] : refOutputShape.slice(-1)[0];
            configChanges.linearTransform = (hasRefLayerInfo && "linearTransform" in refLayerInfo) ? refLayerInfo.linearTransform : refLayer.linearTransform;
        }

        return preprocessedIncomingShape;
    }

    /**
     * Get the shape of layer-specific-processed tensor of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181126
     * @param {(Number|String)[]} preprocessedIncomingShape - A shape array of pre-proccessed incoming shape.
     * @returns {Array} - Return the shape of the tensor after layer-specific operation.
     */
    processOperationShape(preprocessedIncomingShape, configChanges = {}) {
        // Get layerUnits from new config changes or existing attribute.
        var layerUnits = "layerUnits" in configChanges ? configChanges.layerUnits : this.layerUnits;
        var flattenToAxis = "flattenToAxis" in configChanges ? configChanges.flattenToAxis : this.flattenToAxis;

        // Return the transformed operation.
        return LinearTransformConfig.processOperationShape(preprocessedIncomingShape, layerUnits, flattenToAxis);
    }

    /**
     * Test the default nodes collection and preprocessing shape.   --- UPDATED (Dexter) 20181127
     * @param {Array} previousShapes - Preceding layer shape
     * @returns {Array} The reshaped shape
     */
    static testDefaultNodesCollection(incomingShapes) {
        var basicLayer = new BasicLayer();
        basicLayer.train = Project.now.train;
        return basicLayer.getPreprocessedIncomingShape({type: "dynamic", info: incomingShapes.map(s=>({shape: s}))});
    }
}

/** Class representing a convolutional layer.   --- UPDATED (Dexter) 20180524 */
class CNNLayer extends ModelNode.Layer.Config {
    /**
     * Create a convolutional layer.   --- UPDATED (Dexter) 20190221
     * @param {String} name - The name of this layer.
     * @param {Number} layerUnits - The number of hidden units in this layer.
     * @param {Number} convFilterWidth - The convolutional layer filter width.
     * @param {Boolean} convPadding - Whether to use padding on this convolutional layer, i.e. the output image size will be the same as the previous one.
     * @param {Number[]} convStride - The stride of the convolutional layer filter.   --- BETA
     * @param {Number} convDilation - The convolution dilation of the convolutional layer filter.
     * @param {Array} reshape - The shape of reshaping previous layers. If not specified, it will automatically reshaped if the previous layer can't interpret as an image.
     * @param {String} refLayerName - Any referenced weight that this layer mirrors for.
     * @param {Boolean} refLayerTranspose - Whether transpose is required for the referenced weight.
     * @param {IncomingConfig} incomingConfig - Input configurations.
     * @param {LinearTransformConfig} linearTransform - The linear transformation configuration.
     * @param {String} activation - The activation function of this layer.
     * @param {Object} activationParams - Activation parameters as defined in Tensorflow.
     * @param {Boolean} batchNorm - Whether to use batch normalization before activation function.
     * @param {Object} batchNormParams - Batch normalization parameters as defined in Tensorflow.
     * @param {OutputConfig} outputConfig - - Output configurations.
     */
    constructor(name=null, layerUnits = 30, convFilterWidth=3, convPadding=true, convStride=[1,1], convDilation=0, reshape=null, refLayerName = null, refLayerTranspose = false, 
                incomingConfig = new IncomingConfig.Concat(),
                linearTransform = LinearTransformConfig.createBasicConfig(0, 0.05, false, true, undefined, 0, 0.001),
                activation = "relu", activationParams = {}, 
                batchNorm = true,  batchNormParams = {}, 
                outputConfig = new OutputConfig.Default()) {
        super(ModelNode.Layer.Types.Convolution, name, layerUnits, false, incomingConfig, linearTransform, 
                activation, activationParams, 
                batchNorm, batchNormParams, 100, outputConfig);
        /** @type {Number} - The convolutional layer filter width. */
        this.convFilterWidth = convFilterWidth;
        /** @type {Boolean} - Whether to use padding on this convolutional layer, i.e. the output image size will be the same as the previous one. */
        this.convPadding = convPadding;
        /** @type {{0: Number, 1: Number}} - The stride of the convolutional layer filter. */
        this.convStride = convStride;
        /** @type {Number} - The convolution dilation of the convolutional layer filter. */
        this.convDilation = convDilation;
        /** @type {Array<Number>} - The shape of reshaping previous layers. If `null`, it will automatically reshaped if the previous layer can't interpret as an image. */
        this.reshape = reshape;
        /** @type {String} - Any referenced weight that this layer mirrors for. */
        this.refLayerName = refLayerName;
        /** @type {Boolean} - Whether transpose is required for the referenced weight. */
        this.refLayerTranspose = refLayerTranspose;
        this._type = "CNNLayer";
        [this._convStrideX, this._convStrideY] = convStride;
    }

    /**
     * Get the shape of preprocessed incoming nodes of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181205
     * @param {(Number|String)[]} combinedIncomingShape - A shape array of combined incoming shape.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Array} - Return the shape of the pre-proccessed incoming shape.
     */
    preprocessIncomingShape(combinedIncomingShape, configChanges = {}, centralizedMap = new Map()) {
        // Apply layer configs from referencing layer.
        var refLayerName = configChanges.refLayerName || this.refLayerName, refLayerInfo, hasRefLayerInfo = false, refLayer;
        if (refLayerName) {
            // Get the layer properties from the changed or original reference layer configs.
            refLayerInfo = centralizedMap.get(refLayerName);
            hasRefLayerInfo = new Boolean(refLayerInfo);
            refLayer = this.train.layerProfiles.get(refLayerName);
            
            // No reference for non-matched type of layer.
            if (!["CNNLayer", "DCNNLayer"].includes(refLayer._type)) return null;
            
            // Update flattenToAxis.
            configChanges.reshape = (hasRefLayerInfo && reshape in refLayerInfo.configChanges) ? refLayerInfo.configChanges.reshape : refLayer.reshape;
        }

        // Apply preprocessing reshape to support CNN for other shapes of data.
        var preprocessedIncomingShape;
        if (combinedIncomingShape.length != 4) {
            var reshape = "reshape" in configChanges ? configChanges.reshape : this.reshape;
            if (reshape == null) {
                if (combinedIncomingShape.length > 4) {
                    // If more than 4 dimension, flatten to the 4th dim.
                    const flattenSize = combinedIncomingShape.slice(3).reduce((a,b) => a*b, 1);
                    preprocessedIncomingShape = [...combinedIncomingShape.slice(0,3), flattenSize];
                } else if (combinedIncomingShape.length == 3) {
                    // If only 3 dimension, supplement a dimension.
                    preprocessedIncomingShape = [...combinedIncomingShape, 1];
                } else if (combinedIncomingShape.length == 2) {
                    // If only 2 dimension, auto reshape to a 2D picture with 1 channel.
                    const lastShape = combinedIncomingShape.slice(-1)[0];
                    var largestDim = 1, anotherDim = 1;
                    for (let d = 2; d < Math.floor(lastShape**.5) + 1; d++) {
                        if (lastShape % d == 0) {
                            largestDim = d;
                            anotherDim = lastShape / d;
                        }
                    }
                    if (largestDim > 1) {
                        preprocessedIncomingShape = [combinedIncomingShape[0], largestDim, anotherDim, 1];
                    } else return null;
                } else if (combinedIncomingShape.length == 1) return null;
            } else {
                // Check whether the reshape is matched with fromShape.
                var originalFromShapeTotal = combinedIncomingShape.slice(1).reduce((a,b)=>a*b,1);
                var newReshape = reshape.reduce((a,b)=>a*b,1);
                if (originalFromShapeTotal != newReshape) return null;

                // Update the reshape.
                preprocessedIncomingShape = [combinedIncomingShape[0], ...reshape];
            }
        } else {
            preprocessedIncomingShape = combinedIncomingShape;
        }

        if (refLayerName) {
            // Determine whether transpose is needed. If neither transpose can be operated, this cannot be referenced, and the changes can't be applied.
            var refInputShape = (hasRefLayerInfo && "preprocessedIncomingShape" in refLayerInfo) ? refLayerInfo.preprocessedIncomingShape : refLayer.getPreprocessedIncomingShape();
            var refOutputShape = (hasRefLayerInfo && "outputShape" in refLayerInfo) ? refLayerInfo.outputShape : refLayer.getOutputShape();
            
            // Apply other reference layer configurations.
            configChanges.refLayerTranspose = refLayer._type == "DCNNLayer";
            configChanges.layerUnits = refLayerTranspose ? refInputShape.slice(-1)[0] : refOutputShape.slice(-1)[0];
            ["convFilterWidth", "convPadding", "convStride", "convDilation", "linearTransform"].forEach(prop=>{
                configChanges[prop] = (hasRefLayerInfo && prop in refLayerInfo) ? refLayerInfo[prop] : refLayer[prop];
            });
        }

        return preprocessedIncomingShape;
    }

    /**
     * Get the shape of layer-specific-processed tensor of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181127
     * @param {(Number|String)[]} preprocessedIncomingShape - A shape array of pre-proccessed incoming shape.
     * @returns {Array} - Return the shape of the tensor after layer-specific operation.
     */
    processOperationShape(preprocessedIncomingShape, configChanges = {}) {
        // Get the layer properties from either config changes or original configs.
        var convPadding = "convPadding" in configChanges? configChanges.convPadding : this.convPadding;
        var convFilterWidth = "convFilterWidth" in configChanges? configChanges.convFilterWidth : this.convFilterWidth;
        var convStride = "convStride" in configChanges? configChanges.convStride : this.convStride;
        var convDilation = "convDilation" in configChanges? configChanges.convDilation : this.convDilation;
        var layerUnits = "layerUnits" in configChanges ? configChanges.layerUnits : this.layerUnits;

        // Determine whether CNN padding is used.
        if (convPadding) {
            return [...preprocessedIncomingShape.slice(0,-1), layerUnits];
        } else {
            // If no padding is used, the shape will be changed according to the CNN filter and dilation configurations.
            var height = preprocessedIncomingShape[1];
            var width = preprocessedIncomingShape[2];
            var stridesH = height - (convFilterWidth + convDilation * (convFilterWidth-1)) + 1;
            var stridesW = width - (convFilterWidth + convDilation * (convFilterWidth-1)) + 1;
            var newHeight = Math.ceil(stridesH / convStride[0]);
            var newWidth = Math.ceil(stridesW / convStride[1]);

            // Ensure CNN on previous image produce an image, i.e. filter with dilation size larger than original image size.
            if (newWidth > 0 && newHeight > 0) {
                return [preprocessedIncomingShape[0], newHeight, newWidth, layerUnits];
            } else return null;
        }
    }

    /**
     * Test the default nodes collection and preprocessing shape.   --- UPDATED (Dexter) 20181127
     * @param {Array} previousShapes - Preceding layer shape
     * @returns {Array} The reshaped shape
     */
    static testDefaultNodesCollection(incomingShapes) {
        var convLayer = new CNNLayer();
        convLayer.train = Project.now.train;
        return convLayer.getPreprocessedIncomingShape({type: "dynamic", info: incomingShapes.map(s=>({shape: s}))});
    }
}

/** Class representing a DCNN Layer.   --- UPDATED (Dexter) 20180819 */
class DCNNLayer extends ModelNode.Layer.Config {
    /**
     * Create a DCNN layer.   --- UPDATED (Dexter) 20190221
     * @param {String} name - The name of this layer.
     * @param {Number} layerUnits - The number of hidden units in this layer.
     * @param {Number} convFilterWidth - The deconvolution filter width.
     * @param {Boolean} convPadding - Whether to use padding on this deconvolution layer, i.e. the output image size will be the same as the previous one.
     * @param {Number[]} convStride - The stride of this deconvolution filter.   --- BETA
     * @param {Number} convDilation - The convolution dilation of this deconvolution filter.
     * @param {Number} dconvPadding - The deconvolution padding method, as defined in DCNNLayer.PaddingTypes .   --- BETA
     * @param {String} refLayerName - Any referenced kernal that this layer mirrors for.
     * @param {Boolean} refLayerTranspose - Whether transpose is required for the referenced weight.
     * @param {IncomingConfig} incomingConfig - Input configurations.
     * @param {LinearTransformConfig} linearTransform - The linear transformation configuration.
     * @param {String} activation - The activation function of this layer.
     * @param {Object} activationParams - Activation parameters as defined in Tensorflow.
     * @param {Boolean} batchNorm - Whether to use batch normalization before activation function.
     * @param {Object} batchNormParams - Batch normalization parameters as defined in Tensorflow.
     */
    constructor(name=null, layerUnits=30, convFilterWidth=3, convPadding=true, convStride=[1,1], convDilation=0, dconvPadding=0, refLayerName=null, refLayerTranspose = false, 
                incomingConfig = new IncomingConfig.Concat(),
                linearTransform = LinearTransformConfig.createBasicConfig(0, 0.05, false, true, undefined, 0, 0.001),
                activation = "relu", activationParams = {}, 
                batchNorm = true, batchNormParams = {}, 
                outputConfig = new OutputConfig.Default()) {
        super(ModelNode.Layer.Types.Deconvolution, name, layerUnits, false, incomingConfig, linearTransform,
                activation, activationParams, 
                batchNorm, batchNormParams, 100, outputConfig);
        /** @type {Number} - The deconvolution layer filter width. */
        this.convFilterWidth = convFilterWidth;
        /** @type {Boolean} - Whether to use padding on this deconvolution layer, i.e. the output image size will be the same as the previous one. */
        this.convPadding = convPadding;
        /** @type {{0: Number, 1: Number}} - The stride of the deconvolution layer filter. */
        this.convStride = convStride;
        /** @type {Number} - The convolution dilation of this deconvolution filter.*/
        this.convDilation = convDilation;
        /** @type {Number} - The deconvolution padding method, as defined in ModelNode.Layer.Deconvolution.PaddingTypes .   --- BETA */
        this.dconvPadding = dconvPadding;
        /** @type {String} - Any referenced weight that this layer mirrors for. */
        this.refLayerName = refLayerName;
        /** @type {Boolean} - Whether transpose is required for the referenced weight. */
        this.refLayerTranspose = refLayerTranspose;
        this._type = "DCNNLayer";
        [this._convStrideX, this._convStrideY] = convStride;
    }
    
    /**
     * Get the shape of preprocessed incoming nodes of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181205
     * @param {(Number|String)[]} combinedIncomingShape - A shape array of combined incoming shape.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Array} - Return the shape of the pre-proccessed incoming shape.
     */
    preprocessIncomingShape(combinedIncomingShape, configChanges = {}, centralizedMap = new Map()) {
        // Apply layer configs from referencing layer.
        var refLayerName = configChanges.refLayerName || this.refLayerName, refLayerInfo, hasRefLayerInfo = false, refLayer;
        if (refLayerName) {
            // Get the layer properties from the changed or original reference layer configs.
            refLayerInfo = centralizedMap.get(refLayerName);
            hasRefLayerInfo = new Boolean(refLayerInfo);
            refLayer = this.train.layerProfiles.get(refLayerName);
            
            // No reference for non-matched type of layer.
            if (!["CNNLayer", "DCNNLayer"].includes(refLayer._type)) return null;
        }

        // Apply preprocessing reshape to support CNN for other shapes of data.
        var preprocessedIncomingShape;
        if (combinedIncomingShape.length != 4) {
            if (combinedIncomingShape.length > 4) {
                // If more than 4 dimension, flatten to the 4th dim.
                const flattenSize = combinedIncomingShape.slice(3).reduce((a,b) => a*b, 1);
                preprocessedIncomingShape = [...combinedIncomingShape.slice(0,3), flattenSize];
            } else if (combinedIncomingShape.length == 3) {
                // If only 3 dimension, supplement a dimension.
                preprocessedIncomingShape = [...combinedIncomingShape, 1];
            } else return null; // 2 or lower dimension is not supported.
        } else {
            preprocessedIncomingShape = combinedIncomingShape;
        }

        if (refLayerName) {
            // Determine whether transpose is needed. If neither transpose can be operated, this cannot be referenced, and the changes can't be applied.
            var refInputShape = (hasRefLayerInfo && "preprocessedIncomingShape" in refLayerInfo) ? refLayerInfo.preprocessedIncomingShape : refLayer.getPreprocessedIncomingShape();
            var refOutputShape = (hasRefLayerInfo && "outputShape" in refLayerInfo) ? refLayerInfo.outputShape : refLayer.getOutputShape();
            
            // Apply other reference layer configurations.
            configChanges.refLayerTranspose = refLayer._type == "CNNLayer";
            configChanges.layerUnits = refLayerTranspose ? refInputShape.slice(-1)[0] : refOutputShape.slice(-1)[0];
            if (refLayer._type == "DCNNLayer") configChanges.dconvPadding = (hasRefLayerInfo && "dconvPadding" in refLayerInfo) ? refLayerInfo.dconvPadding : refLayer.dconvPadding;
            ["convFilterWidth", "convPadding", "convStride", "convDilation", "linearTransform"].forEach(prop=>{
                configChanges[prop] = (hasRefLayerInfo && prop in refLayerInfo) ? refLayerInfo[prop] : refLayer[prop];
            });
        }

        return preprocessedIncomingShape;
    }

    /**
     * Get the shape of layer-specific-processed tensor of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181127
     * @param {(Number|String)[]} preprocessedIncomingShape - A shape array of pre-proccessed incoming shape.
     * @returns {Array} - Return the shape of the tensor after layer-specific operation.
     */
    processOperationShape(preprocessedIncomingShape, configChanges = {}) {
        // Get the layer properties from either config changes or original configs.
        var convPadding = "convPadding" in configChanges? configChanges.convPadding : this.convPadding;
        var convFilterWidth = "convFilterWidth" in configChanges? configChanges.convFilterWidth : this.convFilterWidth;
        var convStride = "convStride" in configChanges? configChanges.convStride : this.convStride;
        var convDilation = "convDilation" in configChanges? configChanges.convDilation : this.convDilation;
        var layerUnits = "layerUnits" in configChanges ? configChanges.layerUnits : this.layerUnits;

        // Determine whether CNN padding is used.
        if (convPadding) {
            return [...preprocessedIncomingShape.slice(0,-1), layerUnits];
        } else {
            // If no padding is used, the shape will be changed according to the CNN filter and dilation configurations.
            var height = preprocessedIncomingShape[1];
            var width = preprocessedIncomingShape[2];
            var paddingPxH = convFilterWidth+convDilation*(convFilterWidth-1)-1+height*(convStride[0] - 1);
            var paddingPxW = convFilterWidth+convDilation*(convFilterWidth-1)-1+width*(convStride[1] - 1);
            var newHeight = height+paddingPxH;
            var newWidth = width+paddingPxW;

            // Ensure DCNN on previous image produce an image, i.e. filter with dilation size larger than original image size.
            if (newWidth > 0 && newHeight > 0) {
                return [preprocessedIncomingShape[0], newHeight, newWidth, layerUnits];
            } else return null;
        }
    }

    /**
     * Enumeration definining the methods for deconvolutional padding.   --- UPDATED (Dexter) 20181217
     */
    static get PaddingTypes() { 
        return new Enum({
            /** @type {Number} - Enlarge the image using bicubic resize. */
            Bicubic: 0, 
            /** @type {Number} - Enlarge the image using bilinear resize */
            Bilinear: 1, 
            /** @type {Number} - Enlarge the image using nearest neighbor resize. */
            NearestNeighbor: 2, 
            /** @type {Number} - Pad the image with zeros. */
            Zeros: 3
        });
    }
}

/** Class representing a final layer (training task).   --- UPDATED (Dexter) 20180524 */
class FinalLayer extends ModelNode.Layer.Config {
    /**
     * Creates a final layer.   --- UPDATED (Dexter) 20190221
     * @param {Number} taskType
     * @param {String} name - The name of this layer
     * @param {Number} compareSourceID - The source index of the source this task is comparing with
     * @param {String} compareTensorIdx - The key for the data preprocessing node of the target source this task is comparing with
     * @param {String} measurement - The measurement of the training task, like MSE or accuracy, in comparing the target data and model predictions
     * @param {Object} measurementOptions - The measurement options of the measurement of this training task.
     * @param {IncomingConfig} incomingConfig - Input configurations.
     * @param {LinearTransformConfig} linearTransform - The linear transformation configuration.
     * @param {String} activation - The activation function of this layer
     * @param {Object} activationParams - Activation parameters as defined in Tensorflow
     * @param {Boolean} batchNorm - Whether to use batch normalization before activation function
     * @param {Object} batchNormParams - Batch normalization parameters as defined in Tensorflow
     * @param {Number} dropout - The keep probability of dropout during training
     */
    constructor(taskType = ModelNode.Layer.Task.Types.Config, name = "", compareSourceID = 0, compareTensorIdx = "target", measurement = "accuracy", measurementOptions = {}, 
                incomingConfig = new IncomingConfig.Concat(),
                linearTransform = LinearTransformConfig.createBasicConfig(0, 0.004, false, true, undefined, 0.004, 0.001),
                activation = "relu", activationParams = {}, 
                batchNorm = true, batchNormParams = {}, dropout = 100) {
        super(ModelNode.Layer.Types.Task, name, -1, true, 
            incomingConfig, linearTransform, 
            activation, activationParams,
            batchNorm, batchNormParams, dropout, 
            null);
        /** @type {Number} - The type of the NOM task, as defined in @ModelNode.Layer.Task.Types . */
        this._taskType = taskType;
        /** @type {String} - The measurement of the training task, like MSE or accuracy, in comparing the target data and model predictions. */
        this.measurement = measurement;
        /** @type {Object<String,*>} - The measurement options of the measurement of this training task. */
        this.measurementOptions = measurementOptions;
        /** @type {Number} - The source index of the source this task is comparing with. */
        this.compareSourceID = compareSourceID;
        /** @type {String} - The key for the data preprocessing node of the target source this task is comparing with. */
        this.compareTensorIdx = compareTensorIdx;
        this._targetTensors = null;
        this._trainTensors = [];
        this._predictionTensors = null;
        this._evalTotal = 0;
        this._evalCumScore = 0;
        this._evalCumList = [];
        this._evalTotList = [];
    }

    /**
     * Get the shape of output of this layer, with no output processing of FinalLayer.   --- UPDATED (Dexter) 20181127
     * @param {(Number|String)[]} operatedShape - A shape array of layer-specific operations.
     * @returns {Array} - Return the shape of the output tensor.
     */
    processOperatedShape(operatedShape, configChanges = {}) {
        return operatedShape;
    }

    /**
     * Apply any shape changes based on preceding layer changes or changes made in the layer properties.   --- UPDATED (Dexter) 20180824
     * @param {Object[]} fromShapeChanges - See definition on LayerProfile.getInputShape() method.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Boolean} applyImmediately - Whether effect will be taken immediately on any changes once confirm proceeding layers have no conflicts.
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Object} - Return a result information: {result: Boolean - Whether the change can be applied (and updated) successfully, error: Object - Translatable information of error message} .
     */
    applyShapeChanges(fromShapeChanges, configChanges = {}, centralizedMap = new Map(), applyImmediately = true) {
        // Have previous check on centralized map.
        var chainCheck = this.applyShapeChainChecks(fromShapeChanges, configChanges, centralizedMap), itself;
        if (chainCheck.error) return {result: true};
        else [fromShapeChanges, configChanges, itself] = [chainCheck.fromShapeChanges, chainCheck.configChanges, chainCheck.itself];

        // Try to build the new shape depending on whether changes made on preceding layers or this layer.
        var newShape = this.getOutputShape(fromShapeChanges, configChanges, centralizedMap);

        // If no shape is built from preceding layers, simply reject the change.
        if (!newShape) {
            var cuzLTMsg = App.createCuzLT(lang=>this._ltTemp.replace("$$$", App.getTxtFromLang(this._lt,lang)) + ": " + App.getTxtFromLang(fromShapeChanges ? "notCompWithPrev" : "changeAffectLay",lang));
            return {result: false, error: cuzLTMsg};
        }

        // If this layer is already in centralized map, update itself.
        if (itself) {
            itself.status = 2;
            itself.outputShape = newShape;
        }

        // Try to apply this layer's change and affect the proceding layers.
        if (applyImmediately) {
            // Apply the changes.
            centralizedMap.forEach((info)=>info.layerProfile.commitChanges(info));

            // Apply this change.
            var thisInfo = {configChanges: configChanges, outputShape: newShape};
            this.commitChanges(thisInfo);
        }
        return {result: true};
    }

    /**
     * Remove this layer from the training.   --- UPDATED (Dexter) 20180807
     */
    remove() {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // Delete the layer from Train collections.
        this.train.layerProfiles.delete(this.name);

        // Remove the layer from previous nodes.
        this.fromNode[buildNo].forEach(l=>l.toNode[buildNo] = l.toNode[buildNo].filter(t=>t!=this));

        // Re-draw the project.
        this.train._project.drawTrain();
    }

    /**
     * Remove this layer from the training.   --- UPDATED (Dexter) 20180810
     * @param {Boolean} startFromThis - Whether this layer is the starting point to remove layer.
     */
    removeThisAndAllProceedings(startFromThis = true) {
        this.remove();
    }

    /**
     * Update the order of this layer, noted it should be the largest order.   --- UPDATED (Dexter) 20181025
     */
    updateOrder() {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        this._order[buildNo] = Math.max(...this.train.getEndingLayerProfiles().filter(lp=>lp!=this).map(lp=>lp._order[buildNo]), ...this.fromNode[buildNo].map(lp=>lp._order[buildNo]), 0) + 1;
    }
}

/** Class representing a classifier.   --- UPDATED (Dexter) 20180524 */
class Classifier extends ModelNode.Layer.Task.Config {
    /**
     * Creates a classifier, comparing the class as the last dimension of the actual and predicted data.   --- UPDATED (Dexter) 20190221
     * @param {String} name - The name of this layer
     * @param {Number} classCount - Number of class to handle in this classifier
     * @param {Number} compareSourceID - The source index of the source this task is comparing with
     * @param {String} compareTensorIdx - The key for the column config of the target this task is comparing with
     * @param {String} measurement - The measurement of the training task, like MSE or accuracy, in comparing the target data and model predictions
     * @param {Object} measurementOptions - The measurement options of the measurement of this training task.
     * @param {IncomingConfig} incomingConfig - Input configurations.
     * @param {LinearTransformConfig} linearTransform - The linear transformation configuration.
     * @param {String} activation - The activation function of this layer
     * @param {Object} activationParams - Activation parameters as defined in Tensorflow
     */
    constructor(name="", classCount = 1, compareSourceID = 0, compareTensorIdx = "target", measurement = "accuracy", measurementOptions = {},
                incomingConfig = new IncomingConfig.Concat(),
                linearTransform = LinearTransformConfig.createBasicConfig(0, "auto", false, true, undefined, 0, 0),
                activation = "relu", activationParams = {}) {
        super(ModelNode.Layer.Task.Types.Classifier, name, compareSourceID, compareTensorIdx, measurement, measurementOptions,
            incomingConfig, linearTransform,
            activation, activationParams, false)
        /** @type {Number} - Number of class to handle in this classifier. `-1` (Beta) for auto-determining the class count from training data. */
        this.classCount = classCount;
        this._type = "Classifier";
    }

    /**
     * Apply any shape changes based on preceding layer changes or changes made in the layer properties.   --- UPDATED (Dexter) 20190213
     * @param {Object[]} fromShapeChanges - See definition on LayerProfile.getInputShape() method.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Boolean} applyImmediately - Whether effect will be taken immediately on any changes once confirm proceeding layers have no conflicts.
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Object} - Return a result information: {result: Boolean - Whether the change can be applied (and updated) successfully, error: Object - Translatable information of error message} .
     */
    applyShapeChanges(fromShapeChanges, configChanges = {}, centralizedMap = new Map(), applyImmediately = true) {
        // Additional error message.
        if ("compareSourceID" in configChanges && "compareTensorIdx" in configChanges) {
            var dppNode = this.train.getDataSource(configChanges.compareSourceID, configChanges.compareTensorIdx);
            if (dppNode.getShape().slice(-1) != 1) {
                return new TrialResult(false, "classifierShapeErr");
            } else if (dppNode.dtype != "tf.int64") {
                return new TrialResult(false, "classifierDTypeErr");
            }
        }

        return super.applyShapeChanges(fromShapeChanges, configChanges, centralizedMap, applyImmediately);
    }

    /**
     * Get the shape of layer-specific-processed tensor of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181126
     * @param {(Number|String)[]} preprocessedIncomingShape - A shape array of pre-proccessed incoming shape.
     * @returns {Array} - Return the shape of the tensor after layer-specific operation.
     */
    processOperationShape(preprocessedIncomingShape, configChanges = {}) {
        // Get layerUnits from new config changes or existing attribute.
        var compareSourceID = "compareSourceID" in configChanges ? configChanges.compareSourceID : this.compareSourceID;
        var compareTensorIdx = "compareTensorIdx" in configChanges ? configChanges.compareTensorIdx : this.compareTensorIdx;
        var compareShape = "shape" in configChanges ? configChanges.shape : this.train.getDataSource(compareSourceID, compareTensorIdx).getShape();

        // Determine the from and to shape mapping, the first dimension should be the same based on the batched sampling
        // If the target tensor has the last dimension of 1 but originally flattened, reshape it.
        var originalByRow = false;
        if (compareShape.slice(-1)[0] == 1) {
            compareShape = [...compareShape.slice(0,-1)];
        }

        // Handling arbitrary class counts.
        var toClassCount = (this.classCount == -1) ? this.train.sources[this.compareSourceID].getClassCount(this.compareTensorIdx) : this.classCount;
        if (toClassCount == null) return null;

        // Check if the previous shape dimension is more or equal to the comparing shape.
        const targetDim = compareShape.length;
        if (!shapeEquals(preprocessedIncomingShape.slice(0,targetDim), compareShape.slice(0,targetDim))) return null;

        // Linear transform to flatten the previous layer up to the feature-realted dimensions and fully connected to the target shape.
        var midShape = LinearTransformConfig.processOperationShape(preprocessedIncomingShape, toClassCount, targetDim);
        if (midShape == null) return null;

        // Return the final shape of the prediction tensor.
        var argmaxPredictionShape = midShape.slice(0, targetDim);
        return originalByRow ? [...argmaxPredictionShape, 1] : [...argmaxPredictionShape];
    }
}

/** Class representing a regressor.   --- UPDATED (Dexter) 20180524 */
class Regressor extends ModelNode.Layer.Task.Config {
    /**
     * Create a regressor.   --- UPDATED (Dexter) 20190221
     * @param {String} name - The name of this layer
     * @param {Number} compareSourceID - The source index of the source this task is comparing with
     * @param {String} compareTensorIdx - The key for the column config of the target this task is comparing with
     * @param {String} loss - The loss function of the training task. If not specified, it will equal to the measurement function.
     * @param {String} measurement - The measurement of the training task, like MSE or accuracy, in comparing the target data and model predictions
     * @param {Object} measurementOptions - The measurement options of the measurement of this training task.
     * @param {IncomingConfig} incomingConfig - Input configurations.
     * @param {LinearTransformConfig} linearTransform - The linear transformation configuration.
     * @param {String} activation - The activation function of this layer
     * @param {Object} activationParams - Activation parameters as defined in Tensorflow
     */
    constructor(name="", compareSourceID = 0, compareTensorIdx = "target", loss = "MSE", measurement = "MSE", measurementOptions = {},
                incomingConfig = new IncomingConfig.Concat(),
                linearTransform = LinearTransformConfig.createBasicConfig(0, "auto", false, true, undefined, 0, 0),
                activation = "relu", activationParams = {}) {
        super(ModelNode.Layer.Task.Types.Regressor, name, compareSourceID, compareTensorIdx, measurement, measurementOptions,
                incomingConfig, linearTransform, 
                activation, activationParams, 
                false);
        /** @type {String} - The loss function of the training task. If not specified, it will equal to the measurement function. */
        this.loss = loss == undefined ? this.measurement : loss;
        this._type = "Regressor";
    }

    /**
     * Apply any shape changes based on preceding layer changes or changes made in the layer properties.   --- UPDATED (Dexter) 20190213
     * @param {Object[]} fromShapeChanges - See definition on LayerProfile.getInputShape() method.
     * @param {Object} configChanges - Key-value pair object of any shape-related layer properties
     * @param {Boolean} applyImmediately - Whether effect will be taken immediately on any changes once confirm proceeding layers have no conflicts.
     * @param {Map} centralizedMap - The affected layers info in the current change.
     * @returns {Object} - Return a result information: {result: Boolean - Whether the change can be applied (and updated) successfully, error: Object - Translatable information of error message} .
     */
    applyShapeChanges(fromShapeChanges, configChanges = {}, centralizedMap = new Map(), applyImmediately = true) {
        // Additional error message.
        if ("compareSourceID" in configChanges && "compareTensorIdx" in configChanges) {
            var dppNode = this.train.getDataSource(configChanges.compareSourceID, configChanges.compareTensorIdx);
            if (dppNode.dtype == "tf.int64") {
                return new TrialResult(false, "regressorDTypeErr");
            } else if (dppNode.oneHotColumns.size > 0) {
                return new TrialResult(false, "regressorOneHotErr");
            }
        }

        return super.applyShapeChanges(fromShapeChanges, configChanges, centralizedMap, applyImmediately);
    }

    /**
     * Get the shape of layer-specific-processed tensor of this layer by immitating the combined incoming shape preprocessing.   --- UPDATED (Dexter) 20181126
     * @param {(Number|String)[]} preprocessedIncomingShape - A shape array of pre-proccessed incoming shape.
     * @returns {Array} - Return the shape of the tensor after layer-specific operation.
     */
    processOperationShape(preprocessedIncomingShape, configChanges = {}) {
        // Get layerUnits from new config changes or existing attribute.
        var compareSourceID = "compareSourceID" in configChanges ? configChanges.compareSourceID : this.compareSourceID;
        var compareTensorIdx = "compareTensorIdx" in configChanges ? configChanges.compareTensorIdx : this.compareTensorIdx;
        var compareShape = "shape" in configChanges ? configChanges.shape : this.train.getDataSource(compareSourceID, compareTensorIdx).getShape();

        if (shapeEquals(preprocessedIncomingShape, compareShape)) {
            // If the shape is already matched, no conversion is needed.
            return [...compareShape];
        } else {
            // Determine the from and to shape mapping, the first dimension should be the same based on the batch dimension.
            // If the target tensor has shape of [None] only, reshape as [None, 1] for weight multiplication.
            if (compareShape.length == 1) compareShape = [...compareShape, 1];

            // Determine the shared shape dimensions so as to flatten the previous layer. 
            // Supplement a dimension if the dimension of the lower dimensioned array has shape same with those dimensions of another array.
            var toAxis = 0;
            for (let d = 0; d < Math.min(preprocessedIncomingShape.length, compareShape.length); d++) {
                if (preprocessedIncomingShape[d] != compareShape[d]) break;
                toAxis += 1;
            }
            var midShape = (toAxis == preprocessedIncomingShape.length) ? [...preprocessedIncomingShape, 1] : preprocessedIncomingShape;

            // Determine the hidden units and perform linear Transform.
            var toUnit = toAxis < compareShape.length ? compareShape.slice(compareShape).reduce((x,y)=>x*y,1) : 1;
            midShape = LinearTransformConfig.processOperationShape(midShape, toUnit, toAxis);
            if (midShape == null) return null;

            // Return the shape of the prediction tensor.
            return [...compareShape];
        }
    }
}

/** Class representing an input range.   --- UPDATED (Dexter) 20180724 */
class InputRange {
    /**
     * Create a handler for an input range object.   --- UPDATED (Dexter) 20180806
     * @param {Element} rangeEle - The HTML element of the inputRange element, typically with `inputRange` class.
     * @param {Element} valueEle - The HTML element that display the value of the range.
     * @param {String} actionType - Whether the range type is on hover or drag basis.
     * @param {Bool} renderNow - Whether to render the range immediately on this creation of object.
     */
    constructor(rangeEle, valueEle, actionType = "drag", renderNow = true) {
        this.rangeEle = rangeEle;
        this.valueEle = valueEle;
        this.dataVal = []; this.criticalAry = [];
        this.step = -1;
        this.min = 0;
        this.max = 100;
        this.value = 50;
        this.dragging = false;
        this.actionType = actionType;

        // Render immediately if needed.
        if (renderNow) this.render();

        // Add event listeners on the element depending on the action type.
        if (actionType == "hover") this.rangeEle.addEventListener("pointermove", this.pointermove.bind(this), false);
        else {
            this.rangeEle.addEventListener("pointerdown", this.pointerdown.bind(this), false);
            this.rangeEle.addEventListener("pointermove", this.pointermove.bind(this), false);
            this.rangeEle.addEventListener("pointerup", this.pointerup.bind(this), false);
        }
    }

    /**
     * Add event listener on the input range object; alias of adding on the range element.   --- UPDATED (Dexeter) 20180806
     * @param {*+} args - Argumenets of the addEventListener() method.
     */
    addEventListener(...args) { this.rangeEle.addEventListener(...args); }

    /**
     * Remove event listener on the input range object; alias of removing on the range element.   --- UPDATED (Dexeter) 20180806
     * @param {*+} args - Argumenets of the removeEventListener() method.
     */
    removeEventListener(...args) { this.rangeEle.removeEventListener(...args); }

    /**
     * Set the data values on the available points of the input range.   --- UPDATED (Dexter) 20180806
     * @param {Number[]} - An array of numbers of valid values.
     */
    setDataValues(ary) {
        this.step = -1;
        ary.sort((a,b)=>a-b);
        this.min = ary[0];
        this.max = ary[ary.length - 1];
        this.dataVal = ary;
        this.render();
    }

    /**
     * Set the minimum and maximum value of the input range.   --- UPDATED (Dexter) 20180806
     * @param {Number} min - The minumum value of the range.
     * @param {Number} max - The maximum value of the range.
     */
    setMinMax(min, max) {
        this.min = min;
        this.max = max;
        this.render();
    }

    /**
     * Set the step interval of the input range.   --- UPDATED (Dexter) 20180806
     * @param {Number} step - The interval of valid values.
     */
    setStep(step) {
        this.step = step;
        this.render();
    }

    /**
     * Set the current display value of the input range.   --- UPDATED (Dexter) 20180806
     * @param {Number} value - The value to assign for the display of the input range.
     */
    setValue(value) {
        // Set the value.
        this.value = this.rangeEle.dataset.val = value;

        // Show the value if needed.
        if (this.valueEle) this.valueEle.innerText = value;

        // Set the position of the range dot.
        this.rangeEle.getElementsByClassName("rangeDot")[0].style.marginLeft = (value-this.min)/(this.max-this.min)*100 + "%";
    }

    /**
     * Render the input range element.   --- UPDATED (Dexter) 20180806
     */
    render() {
        // Create a seperation array of numbers representing the relative accumulated value from 0 to 1 on each of the range labels.
        var seperationArray = [];
        if (this.dataVal) {
            seperationArray = this.dataVal.reduce((map,val,idx,ary)=>(idx>=1?map.concat((val-ary[idx-1])/(this.max-this.min)):map),[])
        } else if (!this.dataVal && this.step) {
            const count = Math.ceil((this.max-this.min)/this.step)+1;
            const ary = Array(count).map((v,idx)=>idx*this.step).concat(this.max);
            seperationArray = ary.reduce((map,val,idx,ary)=>(idx>=1?map.concat((val-ary[idx-1])/(this.max-this.min)):map),[])
        } 

        if (!seperationArray.length) {
            // If there is no specific labels, draw only the last label.
            seperationArray = [1];
        } else {
            // If there are specific labels, determine the critical positions that affect the value changing, typically the middle point between two labels.
            this.criticalAry = seperationArray.reduce((map,val,idx,ary)=>(idx>=1?map.concat(val/2+seperationArray[idx-1]/2+map[idx-1]):map),[seperationArray[0]/2]);

            // If there are too much labels, we won't draw them all and only the last label will be drawn.
            if (seperationArray.length > 30) seperationArray = [1];
        }
        
        if (seperationArray.length <=30) {
            // Draw all the range marks as the seperationArray specifies.
            App.controlChildrenCount(this.rangeEle.getElementsByClassName("rangeMarks")[0], seperationArray.length+1, document.createElement("div"), undefined, undefined, (ele,idx)=>{
                if (idx >=1) ele.style.marginLeft = seperationArray[idx-1]*100 + "%";
            });
        }
       
    }

    /**
     * TODO [Input Range/Drag Action Type]
     * Action:  Initiate drag action using pointerdown event. 
     * Reason:  Drag Action Type is not supported yet.
     * @param {PointerEvent} e - A pointerdown event, typically from the rangeEle object.
     */
    pointerdown(e) {
    }

    /**
     * Fired on pointing moving on the rangeEle object.   --- UPDATED (Dexter) 20180806
     * @param {PointerEvent} e - A pointermove event, typically from the rangeEle object.
     */
    pointermove(e) {
        if (this.actionType == "hover") {
            // Get the current position.
            const oriVal = Number(this.rangeEle.dataset.val);
            const line = e.target.children[0];
            const min = line.offsetLeft-e.target.offsetLeft;
            const max = min+line.clientWidth;
            var nowAt = Math.min(Math.max(0,(e.offsetX - min)/(max-min)),1);

            // Determin the current value.
            var nowVal = 0;
            if (this.criticalAry.length == 0) {
                nowVal = nowAt*(this.max-this.min) + this.min
            } else {
                var idx = 0;
                while (nowAt >= this.criticalAry[idx]) {
                    idx++;
                }
                nowVal = this.dataVal[idx];
                nowAt = (nowVal - this.min)/(this.max-this.min);
            }

            // Re-poisition the range dot and display the value.
            this.rangeEle.getElementsByClassName("rangeDot")[0].style.marginLeft = nowAt*100 + "%";
            this.rangeEle.dataset.val = nowVal;
            if (this.valueEle) this.valueEle.innerText = nowVal;

            // Dispatch a change event.
            if (nowVal != oriVal) this.rangeEle.dispatchEvent(new Event("change"));
        }
        // TODO [Input Range/Drag Action Type]
        // Action:  Observe drag action using pointerdown event. 
        // Reason:  Drag Action Type is not supported yet.
    }

    /**
     * TODO [Input Range/Drag Action Type]
     * Action:  End drag action using pointerdown event. 
     * Reason:  Drag Action Type is not supported yet.
     * @param {PointerEvent} e - A pointerup event, typically from the rangeEle object.
     */
    pointerup(e) {
        if (this.dragging) {
        }
    }
}

/** Class representing a spreadsheet.   --- UPDATED (Dexter) 20180627*/
class SpreadSheet  {
    /**
     * Create a spreadsheet object.   --- UPDATED (Dexter) 20181208
     * @param {String} id - The HTML element ID that this spreadsheet is placing onto.
     * @param {Number} row - The number of rows that this spreadsheet contains.
     * @param {Number} col - The number of columns that this spreadsheet contains.
     * @param {Boolean} hasHeader - Whether the table has header.
     * @param {Boolean} showGridID - Whether to show A,B,C,D / 1,2,3,4 on column/row starts.
     * @param {Boolean} hideMoreCol - Whether to show ... instead of full table.
     * @param {Boolean} hideMoreRow - Whether to show ... instead of full table.
     * @param {Array} table - The 2D array of original data.
     * @param {Boolean} editable - Whether this spreadsheet is editable.
     * @param {Number[]} activeCellID - A pair of integer describing the current active cell position in [x,y] format.
     * @param {Boolean} makeActiveDefault - Enforce a default active cell for any click on the spreadsheet as the constructor activeCellID.
     */
    constructor(id, row=null, col=null, hasHeader=false, showGridID=false, hideMoreCol=true, hideMoreRow=true, table=[], editable=false, activeCellID=[0,0], makeActiveDefault=false) {
        this.id = id;

        // Properties regarding the data of the spreadsheet.
        this.table = table;
        this._changeE = []; 

        // Properties regarding the editing of the spreadsheet.
        this.editable = editable;
        this.pastable = false;
        this.editing = false;
        
        // Properties regarding the display of the spreadsheet.
        this.hideMoreCol = this._oriHideMoreCol = hideMoreCol;
        this.hideMoreRow = this._oriHideMoreRow = hideMoreRow;
        this.hasHeader = hasHeader
        this.showGridID = showGridID;
        this._row = row; this._col = col;
        this._oriRow = row; this._oriCol = col;

        // Properties regarding the cells selection.
        this.focused = false;
        this.clicking = false;
        this.selectedStart = this.selectedEnd = this.selectedIni = activeCellID;
        this.defaultActiveCellID = makeActiveDefault ? activeCellID : null;
        this._activeCellID = activeCellID;
        this._selChangeE = []; this._selCellInfo = {};
        this._colSelRange = "";
        this.focusRing = null;
        this.clipBoardData = "";
        
        // Properties regarding the full column selection mode.
        this._fullColSelectionMode = 0;
        this._fullColSelectionMulti = true;
        this._selectedCols = [];

        // Get the spreadsheet container.
        this.container = $(id);
        this.initiateGrids();
        
        // Assign this spreadsheet to SpreadSheet.all
        SpreadSheet.all.set(id,this);
    }

    /**
     * Reset the default size of the spreadsheet.   --- UPDATED (Dexter) 20181221
     * @param {Number} width - The new default column width.
     * @param {Number} height - The new default column height.
     */
    resetSize(width, height) {
        if (width != undefined) this._oriCol = this._col = width;
        if (height != undefined) this._oriRow = this._row = height;
    }

    /**
     * Update whether the spreadsheet should include header.   --- UPDATED (Dexter) 20181208
     * @param {Boolean} hasHeader - Whether the spreadsheet should include header.
     * @param {Boolean} updateImmediately - Whether to update the displayed spreadsheet immediately.
     */
    setIncludeHeader(hasHeader, updateImmediately = true) {
        this.hasHeader = hasHeader;
        if (updateImmediately) {
            this.initiateGrids();
            this.refresh();
        }
    }
    
    /**
     * Start a full column seleciton mode. (A row on top of the table for column highlighting.)   --- UPDATED (Dexter) 20181207
     */
    startColSelectionMode(multiSelection = true) {
        // Remove column selection mode.
        $(this.id).classList.add("colSelMode");
        this._fullColSelectionMode = 1;
        this._fullColSelectionMulti = multiSelection;
    }

    /**
     * Update the behaviour of whether multi-columns are allowed in column selection mode.   --- UPDATED (Dexter) 20181208
     */
    setColSelectionMode(multiSelection = true) {
        this._fullColSelectionMulti = multiSelection;
    }

    /**
     * Get the range of selected columns.   --- UPDATED (Dexter) 20181207
     */
    getColSelectedRange() {
        return this._colSelRange;
    }

    /**
     * End a full column selection mode.   --- UPDATED (Dexter) 20181207
     */
    endColSelectionMode() {
        // Remove column selection mode.
        $(this.id).classList.remove("colSelMode");
        this._fullColSelectionMode = 0;

        // Clear column selection range.
        this._colSelRange = "";
    }
    
    /**
     * Reset the row column state to initial construction of the spreadsheet object.   --- UPDATED (Dexter) 20181201
     */
    resetRowColStates() {
        // Initiate the original row column states.
        this._row = this._oriRow; this._col = this._oriCol;
        this.hideMoreCol = this._oriHideMoreCol; this.hideMoreRow = this._oriHideMoreRow;
        this.selectedStart = this.selectedEnd = this.selectedIni = (this._activeCellID || [0,0]);
    }

    /**
     * Clear and initiate all the grids in the spreadsheet.   --- UPDATED (Dexter) 20181211
     */
    initiateGrids() {
        var hasHeader = this.hasHeader, showGridID = this.showGridID;

        // Clear and reset the content.
        this.container.innerHTML = "";

        // A pasting holder for one-click only (multi-cell pasting) action.
        var ipHolder = this.ipHolder = document.createElement("input");
        ipHolder.classList.add("spreadSheetInputHolder");
        ipHolder.readOnly = true;
        ipHolder.addEventListener("paste", this.pasteOnActiveCell.bind(this), false);
        ipHolder.addEventListener("copy", this.copySelectedCells.bind(this), false);
        this.container.appendChild(ipHolder);

        // Create a row for column selections.
        var colSelRow = document.createElement("div");
        colSelRow.classList.add("colSelection");
        this.container.appendChild(colSelRow);
        if (showGridID) colSelRow.classList.add("hasFirstCol");

        // Prepare the spreadsheet element.
        var ss = this.ssObj = document.createElement("div");
        this.tableID = ss.id = this.id + "-spreadsheet";
        ss.classList.add("spreadsheet");
        ss.addEventListener("contextmenu", this.onContextMenu.bind(this), false);
        if (hasHeader || showGridID) ss.classList.add("hasHeader");
        if (showGridID) ss.classList.add("hasFirstCol");
        if (this.hideMoreRow) ss.classList.add("hideMoreRow");
        if (this.hideMoreCol) ss.classList.add("hideMoreCol");

        // Depending on whether to hide more columns, or whether grid ids are shown, determine the total row/col counts as displayed in the spreadsheet.
        const totalRowCount = this.rowCount + ((hasHeader || showGridID)?1:0) + (this.hideMoreRow?1:0), totalColCount = this.colCount + (showGridID?1:0) + (this.hideMoreCol?1:0);

        // Create the column selection row.
        for (let j = 0, added = 0; j<totalColCount; j++) {
            var cell = document.createElement("div");
            if (!showGridID || j>0) {
                cell.innerText = "⯆";
                cell.dataset.col = added;
                cell.addEventListener("click", this.toggleColSelection.bind(this), false);
                added ++;
            }
            colSelRow.appendChild(cell);
        }

        // Initiate the selected column array
        this._selectedCols = this._selectedCols.slice(0,this.dataColCount);
        for (let i = this._selectedCols.length; i < this.dataColCount; i++) {
            this._selectedCols.push(false);
        }

        // Create the cells and assign their events.
        for (let i = 0 ; i < totalRowCount; i++ ) {
            var row = document.createElement("div");
            for (let j=0; j < totalColCount; j++) {
                var cell = document.createElement("div");
                cell.dataset.col = j-(this.showGridID?1:0); cell.dataset.row=i-((this.showGridID||this.hasHeader)?1:0);
                row.appendChild(cell);
                cell.addEventListener("pointerdown", this.cellDown.bind(this), false);
                if ((!hasHeader || (i > 0)) && (!showGridID || (j > 0)) && (!(this.hideMoreRow && this.hideMoreCol) || (j < totalColCount-1 && i < totalRowCount - 1)))
                    if (this.editable)
                        cell.addEventListener("dblclick", this.editCell.bind(this), false);
            }
            ss.appendChild(row);
        }

        // Place spreadsheet column names.
        if (showGridID) {
            for (let j = 1; j < totalColCount - (this.hideMoreCol ? 1 : 0); j++)
                ss.children[0].children[j].innerText = String.fromCodePoint("A".codePointAt(0)+j-1);
            for (let i = 1; i < totalRowCount - (this.hideMoreRow ? 1 : 0); i++)
                ss.children[i].children[0].innerText = i;
        }

        // Showing more columnns.
        if (this.hideMoreRow) {
            var moreRows = ss.children[totalRowCount-1].children[0];
            moreRows.innerText = "...";
            moreRows.addEventListener("click", this.showMoreRows.bind(this), false);
        }
        if (this.hideMoreCol) {
            var moreCols = ss.children[0].children[totalColCount-1];
            moreCols.innerText = "...";
            moreCols.addEventListener("click", this.showMoreCols.bind(this), false);
        }

        // Set focus ring.
        var focusRing = document.createElement("div");
        focusRing.classList.add("focusRing");
        this.focusRing = focusRing;
        ss.appendChild(focusRing);

        // Append this spreadsheet to the container, and register all pointer events.
        this.container.appendChild(ss);
        ss.addEventListener("click", this.clicked.bind(this), false);
        ss.addEventListener("dlclick", this.dblClicked.bind(this), false);
        ss.addEventListener("pointerdown", this.pointerdown.bind(this), false);
        ss.addEventListener("pointerup", this.pointerup.bind(this), false);

        
        // Ensure it's focusing.
        if (this.focused) {
            ss.classList.add("focused");
            App.nextFrame().then(e=>this.ipHolder.focus());
            ipHolder.addEventListener("blur", this.blurIPHolder.bind(this), {once: true, capture: false});
        }

        // Initial the focus ring.
        this.display(true);
    }

    /**
     * Get the row count of this table, as appearing to the user.   --- UPDATED (Dexter) 20181221
     * @returns {Number} No. of rows
     */
    get rowCount() {
        return this.hideMoreRow? this._row : Math.max(this._oriRow, this.dataRowCount);
    }

    /**
     * Get the column count of this table, as appearing to the user.   --- UPDATED (Dexter) 20181221
     * @returns {Number} No. of columns
     */
    get colCount() {
        return (this.hideMoreCol || !this.table.length)? this._col : this.dataColCount;
    }

    /**
     * Get the data row count.   --- UPDATED (Dexter) 20181208
     */
    get dataRowCount() {
        return this.table && this.table.length ? (this.table.length - (this.hasHeader ? 1 : 0)) : 0;
    }

    /**
     * Get the data column count.   --- UPDATED (Dexter) 20181208
     */
    get dataColCount() {
        return this.table && this.table.length ? Math.max(...this.table.map(r=>r.length)) : 0;
    }

    /**
     * Expend the spreadsheet to show more rows.   --- UPDATED (Dexter) 20181208
     */
    showMoreRows() {
        var newRow = this._row;
        newRow += 10;
        if (this.dataRowCount) newRow = Math.min(this.dataRowCount, newRow);
        this._row = newRow;
        if (newRow == this.dataRowCount) this.hideMoreRow = false;
        this.initiateGrids();
        this.refresh();
    }

    /**
     * Expend the spreadsheet to show more columns.   --- UPDATED (Dexter) 20181201
     */
    showMoreCols() {
        var newCol = this._col, maxCol = this.dataColCount;
        newCol += 3;
        if (maxCol) newCol = Math.min(maxCol, newCol);
        this._col = newCol;
        if (newCol == maxCol) this.hideMoreCol = false;
        this.initiateGrids();
        this.refresh();
    }
    
    /**
     * Actions fired from a pointer down event.   --- UPDATED (Dexter) 20180524
     * @param {PointerEvent} e - A pointer down event
     */
    pointerdown(e) {
        // The entire pointer click cycle will be remembered 
        this.clicking = true;
    }

    /**
     * Actions fired from a pointer up event.   --- UPDATED (Dexter) 20180524
     * @param {PointerEvent} e - A pointer up event
     */
    pointerup(e) {
    }

    /**
     * Toggle the focus status of this spreadsheet.   --- UPDATED (Dexter) 20181208
     */
    toggleFocus() {
        // Toggle the focus status.
        this.focused = !this.focused;

        // If it's now not focusing, the spreadsheet style will remove focus.
        if (!this.focused) this.ssObj.classList.remove("focused");
        else {
            // Otherwise, it'll be on focus style, and focus on the one-click input holder, and add an event to understand if it is trying to blur the spreadsheet.
            this.ssObj.classList.add("focused");
            App.nextFrame().then(e=>this.ipHolder.focus());
            this.ipHolder.addEventListener("blur", this.blurIPHolder.bind(this), {once: true, capture: false});
        }
    }

    /**
     * Actions fired from a click of this spreadsheet.   --- UPDATED (Dexter) 20181208
     * @param {PointerEvent|Event} e - A click event, preferred to be a PointerEvent
     */
    clicked(e) {
        if (!this.focused && !this.editing) {
            // If it's not in focus, toggle the focus status, and focus on the active cell.
            this.toggleFocus();
        } else if (this.editing) {
            // TODO [Spreadsheet/Editing]
            // Action:  Unfocus editing cell.
            // Reason:  Spreadsheet editing has not been implemented.
        }
        // The entire pointer click process is ended.
        this.clicking = false;
    }

    /**
     * Actions fired from a double click of this spreadsheet.   --- UPDATED (Dexter) 20181208
     * @param {PointerEvent|Event} e - A double click event, preferred to be a PointerEvent
     */
    dblClicked(e) {
        this.clicking = false;
    }

    /**
     * Focus on the spreadsheet with selected cells, typically when the spreadsheet is displayed on the screen again.   --- UPDATED (Dexter) 20181210
     * @param {Boolean} focus - Whether to focus on the spreadsheet afterwards.
     */
    display(focus = false) {
        App.nextFrame().then(e=>{
            this.setSelection(this.selectedStart, this.selectedEnd, false);
            if (focus && !this.focused) this.clicked();
        });
    }

    /**
     * Force to focus on a cell.   --- UPDATED (Dexter) 20181208
     * @param {Number[]} selectionStart - The row and col position of the start cell of the spreadsheet.
     * @param {Number[]} selectionEnd - The row and col position of the end cell of the spreadsheet.
     * @param {Boolean} updatingColSel - Whether this selection will update the column selection, typically false when it's only a resuming selection.
     */
    setSelection(selectionStart, selectionEnd = null, updatingColSel = true) {
        if (selectionEnd === null || (selectionStart[0] === selectionEnd[0] && selectionStart[1] === selectionEnd[0])) {
            const selCellID = this.toChildrenCellPos(selectionStart);
            var activeCell = this.ssObj.children[selCellID[0]].children[selCellID[1]];
            this.setFocusRing(activeCell);
            this.setSelectedData(selectionStart, null, null, false, updatingColSel);
        } else {
            const fromCell = this.getCellFromPos(this.toChildrenCellPos(selectionStart));
            const toCell = this.getCellFromPos(this.toChildrenCellPos(selectionEnd));
            this.setFocusRing(fromCell, toCell);
            this.setSelectedData(selectionStart, selectionEnd, null, false, updatingColSel);
        }
    }

    /**
     * Set the selected columns based on a requested selection.   --- UPDATED (Dexter) 20181209
     * @param {String} colRangeStr - Column selection range string.
     */
    setColSelection(colRangeStr) {
        if (IndexRange.validate(this._selectedCols.length, colRangeStr)) {
            const selIdx = IndexRange.parse(this._selectedCols.length, colRangeStr);
            this._selectedCols.forEach((h,idx,ary) => ary[idx] = selIdx.includes(idx));
            this._colSelRange = colRangeStr;
        } else if (colRangeStr.trim() === "") {
            this._selectedCols = this._selectedCols.map(e=>false);
            this._colSelRange = "";
        }
    }

    /**
     * Toggle the column selection.   --- UPDATED (Dexter) 20181211
     * @param {Event} e - A click event, typically from the top arrow selection.
     */
    toggleColSelection(e) {
        const col = Number(e.target.dataset.col);
        this._selectedCols[col] = !this._selectedCols[col];
        this.__updateColHighlights__();
        this.selectionChanged();
    }

    /**
     * Set the selected data.   --- UPDATED (Dexter) 20181221
     * @param {Number[]} selectionStart - The row and col position of the start cell of the spreadsheet.
     * @param {Number[]} selectionEnd - The row and col position of the end cell of the spreadsheet.
     * @param {Boolean} includeHeader - Whether header is included within the selected data.
     * @param {Boolean} updatingColSel - Whether this selection will update the column selection, typically false when it's only a resuming selection.
     */
    setSelectedData(selectionStart, selectionEnd = null, selectionInitial = null, includeHeader = false, updatingColSel = true) {
        // Return if there is no selection at all.
        if (selectionStart[0] == undefined || selectionStart[1] == undefined) return;

        // Set the selection initial as the start selection cell if there is no defined initial position.
        if (!selectionInitial) selectionInitial = selectionStart;
        this.selectedIni = selectionInitial;

        if (selectionEnd == null || (selectionStart[0] == selectionEnd[0] && selectionStart[1] == selectionEnd[1])) {
            // Assign the new active cell to this spreadsheet.
            this.selectedStart = this.selectedEnd = selectionStart;
            const fromCell = this.getCellFromPos(this.toChildrenCellPos(selectionStart));
            
            // Assign the current position to the temp clipboard data.
            this.clipBoardData = fromCell.innerHTML;

            // Update selected columns if needed.
            if (this._fullColSelectionMode && updatingColSel) {
                this._selectedCols[selectionStart[1]] = this._fullColSelectionMode == 1;
            }
        } else {
            // Assign the new active cell to this spreadsheet.
            this.selectedStart = selectionStart;
            this.selectedEnd = selectionEnd;
            
            // Assign the current position to the temp clipboard data.
            var toStr = "";
            const startRow = Math.min(selectionStart[0], selectionEnd[0]), startCol = Math.min(selectionStart[1], selectionEnd[1]);
            const endRow = Math.max(selectionStart[0], selectionEnd[0]), endCol = Math.max(selectionStart[1], selectionEnd[1]);
            const headerRowStart = (this.hasHeader ? 1 : 0);
            const maxRow = Math.min(this.table.length-1, endRow + headerRowStart);
            for (let i = startRow + (includeHeader ? 0 : headerRowStart); i <= maxRow; i++) {
                for (let j = startCol; j <= endCol; j++) {
                    toStr += this.table[i][j];              // Noted values with tab or breakline won't work.   --- TODO
                    if (j < endCol) toStr += "\t";
                }
                if (i < endRow + headerRowStart) toStr += "\n";
            }
            this.clipBoardData = toStr;

            // Update selected columns if needed.
            if (this._fullColSelectionMode && updatingColSel) {
                for (let i = startCol; i <= endCol; i++) {
                    this._selectedCols[i] = this._fullColSelectionMode == 1;
                }
            }
        }

        // Update full column selection mode highlights.
        if (this._fullColSelectionMode) this.__updateColHighlights__();

        this.selectionChanged();
    }

    /**
     * Set the focus ring of the selected cells.   --- UPDATED (Dexter) 20181208
     * @param {Element} fromCell - The start cell element.
     * @param {Element} toCell - The end cell element.
     */
    setFocusRing(fromCell, toCell = null) {
        // If there is no toCell or fromCell equals to cell.
        if (toCell == null || fromCell == toCell) {
            var bbox = fromCell.getBoundingClientRect();
            var spreadSheet = this.ssObj.getBoundingClientRect();
            this.focusRing.style.left = (bbox.left - spreadSheet.left) + "px";
            this.focusRing.style.top = (bbox.top - spreadSheet.top) + "px";
            this.focusRing.style.width = (bbox.width) + "px";
            this.focusRing.style.height = (bbox.height) + "px";
        } 

        // If there is a range of cells selected.
        else {
            var fromBox = fromCell.getBoundingClientRect();
            var toBox = toCell.getBoundingClientRect();
            var spreadSheet = this.ssObj.getBoundingClientRect();
            const lefter = toBox.left - fromBox.left;
            const topper = toBox.top - fromBox.top;
            const minLeft = lefter >= 0 ? fromBox.left : toBox.left;
            const minTop = topper >= 0 ? fromBox.top : toBox.top;
            const toWidth = (lefter >= 0 ? (toBox.left - fromBox.left + toBox.width) : (fromBox.left - toBox.left + fromBox.width));
            const toHeight = (topper >= 0 ? (toBox.top - fromBox.top + toBox.height) : (fromBox.top - toBox.top + fromBox.height));
            this.focusRing.style.left = (minLeft - spreadSheet.left) + "px";
            this.focusRing.style.top = (minTop - spreadSheet.top) + "px";
            this.focusRing.style.width = toWidth + "px";
            this.focusRing.style.height = toHeight + "px";
        }
    }

    /**
     * Update the column highlights, typically during column selection mode.   --- UPDATED (Dexter) 20190129
     */
    __updateColHighlights__() {
        // Update column highlights.
        const colSelectionRow = this.ssObj.parentElement.getElementsByClassName("colSelection")[0];
        this._selectedCols.forEach((highlighted, idx)=>{
           colSelectionRow.children[idx + ((this.showGridID) ? 1 : 0)].classList[highlighted ? "add" : "remove"]("activated");
           this.changeHighlightArea(this.toChildrenCellPos([0, idx]), this.toChildrenCellPos([this.rowCount - ((this.hideMoreRow) ? 0 : 1), idx]), highlighted);
        });

        // Update the selection range.
        this._colSelRange = IndexRange.getStringFromIndices(this._selectedCols);
    }

    /**
     * Change the highlight status of an area of cells.   --- UPDATED (Dexter) 20181210
     * @param {Number[]} fromCellPos - The from cell position.
     * @param {Number[]} toCellPos - The to cell position.
     * @param {Boolean} mode - Whether to highlight the cells.
     */
    changeHighlightArea(fromCellPos, toCellPos = null, mode = true) {
        const fromY = Math.min(fromCellPos[0], toCellPos[0]), toY = Math.max(fromCellPos[0], toCellPos[0]);
        const fromX = Math.min(fromCellPos[1], toCellPos[1]), toX = Math.max(fromCellPos[1], toCellPos[1]);
        const classListAction = mode ? "add" : "remove";
        for (let y = fromY; y <= toY; y++) {
            for (let x = fromX; x <= toX; x++) {
                this.getCellFromPos([y, x]).classList[classListAction]("highlighted");
            }
        }
    }

    /**
     * Copy the values of the selected cells.   --- UPDATED (Dexter) 20181208
     * @param {Event} e - A copy event, typically from the hidden input holder.
     */
    copySelectedCells(e) {
        e.preventDefault();
        if (this.clipBoardData && this.clipBoardData.length) {
            e.clipboardData.setData('text/plain', this.clipBoardData);
            e.clipboardData.setData("text/html", "<table>"+ this.clipBoardData.split("\n").map(row=>"<tr><td>" + row.split("\t").join("</td><td>") + "</td></tr>").join("") + "</table>"); // Noted values with tab or breakline won't work.   --- TODO
        }
    }

    /**
     * Fires when a pointer down on a spreadsheet cell.   --- UPDATED (Dexter) 20181208
     * @param {PointerEvent} e - A PointerEvent triggered from pointerdown on a spreadsheet cell.
     */
    cellDown(e) {
        // Ensure there is no restricted default active cell, the spreadsheet is focused and it's not a right click.
        if (!this.defaultActiveCellID && this.focused && (e.button == 0 || (this._fullColSelectionMode && e.button == 2))) {
            // Get the current cell location.
            const startCellX = Number(e.currentTarget.dataset.col);
            const startCellY = Number(e.currentTarget.dataset.row);

            // Check if it's within the shown cells.
            const withinX = startCellX <= this.colCount - 1;
            const withinY = startCellY <= this.rowCount - 1;

            // If it's not pointerdown on the more row/columns, there can be a focus.
            if ((withinX && withinY) || e.shiftKey) {
                // Prepare the events to be triggered by document pointermove and pointerdown.
                this._selCellInfo.moveEvent = this.selectingCells.bind(this);
                this._selCellInfo.upEvent = this.selectedCells.bind(this);
                document.addEventListener("pointermove", this._selCellInfo.moveEvent, false);
                document.addEventListener("pointerup", this._selCellInfo.upEvent, false);

                // Store the A1 cell position.
                var ss = this.ssObj;
                var x1y1 = ss.children[(this.showGridID || this.hasHeader) ? 1 : 0].children[this.showGridID ? 1 : 0].getBoundingClientRect();
                this._selCellInfo.startSSX = x1y1.left;
                this._selCellInfo.startSSY = x1y1.top;

                // Store the accumulated table borders of the whole spreadsheet.
                this._selCellInfo.heights = [...ss.children].slice((this.showGridID || this.hasHeader) ? 1 : 0).map(ele=>ele.getBoundingClientRect().height).map((h,idx,ary)=>ary.slice(0,idx+1).reduce((a,b)=>a+b, 0));
                this._selCellInfo.widths = [...[...ss.children][0].children].slice(this.showGridID ? 1 : 0).map(ele=>ele.getBoundingClientRect().width).map((w,idx,ary)=>ary.slice(0,idx+1).reduce((a,b)=>a+b, 0));
                
                // Update the selection mode as add (1) /remove (2).
                if (this._fullColSelectionMode) this._fullColSelectionMode = e.button == 2 ? 2 : 1;
                
                // If it's a multi-selection from the shift key, just act like a new pointer move action
                if (e.shiftKey) {
                    // Set the initial selection.
                    this._selCellInfo.iniCellX = this.selectedIni[1];
                    this._selCellInfo.iniCellY = this.selectedIni[0];

                    // If it's selecting a cell only, focus on that particular cell.
                    if (startCellX >= 0 && startCellY >= 0 && !this._fullColSelectionMode) {
                        [this._selCellInfo.startCellY, this._selCellInfo.startCellX] = this.selectedIni;
                        this._selCellInfo.endCellX = startCellX; this._selCellInfo.endCellY = startCellY;
                        this.setFocusRing(this.getCellFromPos(this.toChildrenCellPos(this.selectedIni)), e.currentTarget);
                        this._selCellInfo.selectingAll = 0;
                    } 
                    // If it's selecting a column, focus on the column.
                    else if ((this._fullColSelectionMode && !(startCellX == -1)) || (startCellX >= 0 && startCellY == -1)) {
                        this._selCellInfo.startCellX = this.selectedIni[1]; this._selCellInfo.endCellX = startCellX;
                        this._selCellInfo.startCellY = 0; this._selCellInfo.endCellY = this.dataRowCount - 1;
                        var lastCellPos = this.toChildrenCellPos([this.rowCount-((this.hideMoreRow) ? 0 : 1), startCellX]);
                        var firstCellPos = this.toChildrenCellPos([0, this._selCellInfo.startCellX]);
                        this.setFocusRing(this.getCellFromPos(firstCellPos), this.getCellFromPos(lastCellPos));
                        this._selCellInfo.selectingAll = 2;
                    } 
                    // If it's selecting a row, focus on the row.
                    else if (!this._fullColSelectionMode && startCellX == -1 && startCellY >= 0) {
                        this._selCellInfo.startCellY = this.selectedIni[0]; this._selCellInfo.endCellY = startCellY;
                        this._selCellInfo.startCellX = 0; this._selCellInfo.endCellX = this.dataColCount - 1;
                        var lastCellPos = this.toChildrenCellPos([startCellY, this.colCount-((this.hideMoreCol) ? 0 : 1)]);
                        var firstCellPos = this.toChildrenCellPos([this._selCellInfo.startCellY, 0]);
                        this.setFocusRing(this.getCellFromPos(firstCellPos), this.getCellFromPos(lastCellPos));
                        this._selCellInfo.selectingAll = 1;
                    } 
                    // If it's selecting the entire spreadsheet, focus on the spreadsheet.
                    else if (startCellX == -1 && startCellY == -1) {
                        this._selCellInfo.startCellY = 0; this._selCellInfo.endCellY = this.dataRowCount - 1;
                        this._selCellInfo.startCellX = 0; this._selCellInfo.endCellX = this.dataColCount - 1;
                        var lastCellPos = this.toChildrenCellPos([this.rowCount-((this.hideMoreRow) ? 0 : 1), this.colCount-((this.hideMoreCol) ? 0 : 1)]);
                        var firstCellPos = this.toChildrenCellPos([0, 0]);
                        this.setFocusRing(this.getCellFromPos(firstCellPos), this.getCellFromPos(lastCellPos));
                        this._selCellInfo.selectingAll = 3;
                    }
                }

                // Otherwise, set focus ring for a typical cell or area (clicking on the grid ids).
                else {
                    // Set the initial selection.
                    this._selCellInfo.iniCellX = startCellX;
                    this._selCellInfo.iniCellY = startCellY;

                    // If it's selecting a cell only, focus on that particular cell.
                    if (startCellX >= 0 && startCellY >= 0 && !this._fullColSelectionMode) {
                        this._selCellInfo.startCellX = this._selCellInfo.endCellX = startCellX;
                        this._selCellInfo.startCellY = this._selCellInfo.endCellY = startCellY;
                        this.setFocusRing(e.currentTarget);
                        this._selCellInfo.selectingAll = 0;
                    } 
                    // If it's selecting a column, focus on the column.
                    else if ((this._fullColSelectionMode && !(startCellX == -1)) || (startCellX >= 0 && startCellY == -1)) {
                        this._selCellInfo.startCellX = this._selCellInfo.endCellX = startCellX;
                        this._selCellInfo.startCellY = 0; this._selCellInfo.endCellY = Math.max(0,this.dataRowCount - 1);
                        var lastCellPos = this.toChildrenCellPos([this.rowCount-((this.hideMoreRow) ? 0 : 1), startCellX]);
                        var firstCellPos = this.toChildrenCellPos([0, startCellX]);
                        this.setFocusRing(this.getCellFromPos(firstCellPos), this.getCellFromPos(lastCellPos));
                        this._selCellInfo.selectingAll = 2;
                    } 
                    // If it's selecting a row, focus on the row.
                    else if (!this._fullColSelectionMode && startCellX == -1 && startCellY >= 0) {
                        this._selCellInfo.startCellY = this._selCellInfo.endCellY = startCellY;
                        this._selCellInfo.startCellX = 0; this._selCellInfo.endCellX = Math.max(0,this.dataColCount - 1);
                        var lastCellPos = this.toChildrenCellPos([startCellY, this.colCount-((this.hideMoreCol) ? 0 : 1)]);
                        var firstCellPos = this.toChildrenCellPos([startCellY, 0]);
                        this.setFocusRing(this.getCellFromPos(firstCellPos), this.getCellFromPos(lastCellPos));
                        this._selCellInfo.selectingAll = 1;
                    } 
                    // If it's selecting the entire spreadsheet, focus on the spreadsheet.
                    else if (startCellX == -1 && startCellY == -1) {
                        this._selCellInfo.startCellY = 0; this._selCellInfo.endCellY = Math.max(0,this.dataRowCount - 1);
                        this._selCellInfo.startCellX = 0; this._selCellInfo.endCellX = Math.max(0,this.dataColCount - 1);
                        var lastCellPos = this.toChildrenCellPos([this.rowCount-((this.hideMoreRow) ? 0 : 1), this.colCount-((this.hideMoreCol) ? 0 : 1)]);
                        var firstCellPos = this.toChildrenCellPos([0, 0]);
                        this.setFocusRing(this.getCellFromPos(firstCellPos), this.getCellFromPos(lastCellPos));
                        this._selCellInfo.selectingAll = 3;
                    }
                }
            }
        }
    }

    /**
     * Fires when a pointer move during a cell selection process.   --- UPDATED (Dexter) 20181208
     * @param {PointerEvent} e - A PointerEvent triggered from pointermove during a cell selection process.
     */
    selectingCells(e) {
        // Get the current position and the spreadsheet object.
        const currentPosX = e.pageX, currentPosY = e.pageY;
        var ss = this.ssObj;

        // Column selection mode case.
        if (this._selCellInfo.selectingAll == 2) {
            // Get the latest first (A1) cell position.
            var x1y1 = ss.children[(this.showGridID || this.hasHeader) ? 1 : 0].children[this.showGridID ? 1 : 0].getBoundingClientRect();
            const firstX = this._selCellInfo.startSSX = x1y1.left;

            // Get the offset of current pointer.
            const offsetX = currentPosX - firstX;

            // Find which column is hovering on.
            const corX = offsetX <= this._selCellInfo.widths[0] ? 0 : offsetX >= this._selCellInfo.widths.slice(-1)[0] ? this._selCellInfo.widths.length - 1 : this._selCellInfo.widths.findIndex(w=>offsetX < w);
            this._selCellInfo.endCellX = corX < this.colCount ? corX : (this.dataColCount - 1);
                
            // Get the first and last cell for the focus ring.
            const lastCellPos = this.toChildrenCellPos([0, corX]);
            const firstCellPos = this.toChildrenCellPos([this.rowCount-((this.hideMoreRow) ? 0 : 1), this._selCellInfo.startCellX]);
            this.setFocusRing(this.getCellFromPos(firstCellPos), this.getCellFromPos(lastCellPos));
        } 
        // Normal selection case.
        else if (this._selCellInfo.selectingAll == 0) {
            // Get the latest first cell position.
            var x1y1 = ss.children[(this.showGridID || this.hasHeader) ? 1 : 0].children[this.showGridID ? 1 : 0].getBoundingClientRect();
            const firstX = this._selCellInfo.startSSX = x1y1.left;
            const firstY = this._selCellInfo.startSSY = x1y1.top;

            // Get the offset of current pointer.
            const offsetX = currentPosX - firstX;
            const offsetY = currentPosY - firstY;
            
            // Find which cell is hovering on.
            const corX = offsetX <= this._selCellInfo.widths[0] ? 0 : offsetX >= this._selCellInfo.widths.slice(-1)[0] ? this._selCellInfo.widths.length - 1 : this._selCellInfo.widths.findIndex(w=>offsetX < w);
            const corY = offsetY <= this._selCellInfo.heights[0] ? 0 : offsetY >= this._selCellInfo.heights.slice(-1)[0] ? this._selCellInfo.heights.length - 1 : this._selCellInfo.heights.findIndex(h=>offsetY < h);
            this._selCellInfo.endCellX = corX < this.colCount ? corX : (this.dataColCount - 1);
            this._selCellInfo.endCellY = corY < this.rowCount ? corY : (this.dataRowCount - 1);

            // Get the first and last cell for the focus ring.
            const lastCellPos = this.toChildrenCellPos([corY, corX]);
            const firstCellPos = this.toChildrenCellPos([this._selCellInfo.startCellY, this._selCellInfo.startCellX]);
            this.setFocusRing(this.getCellFromPos(firstCellPos), this.getCellFromPos(lastCellPos));
        }
    }

    /**
     * Fires when a pointer up during a cell selection process.   --- UPDATED (Dexter) 20181208
     * @param {PointerEvent} e - A PointerEvent triggered from pointerup during a cell selection process.
     */
    selectedCells(e) {
        // Remove selection events.
        document.removeEventListener("pointermove", this._selCellInfo.moveEvent, false);
        document.removeEventListener("pointerup", this._selCellInfo.upEvent, false);

        // Get the last cell element.
        this.setSelectedData([this._selCellInfo.startCellY, this._selCellInfo.startCellX], [this._selCellInfo.endCellY, this._selCellInfo.endCellX], [this._selCellInfo.iniCellY, this._selCellInfo.iniCellX], this._selCellInfo.selectingAll == 2);

        // Clear temporary selection object.
        this._selCellInfo = {};

        // Force a click event.
        this.clicked(e);
    }

    /**
     * Fired when having a context menu action on the spreadsheet.   --- UPDATED (Dexter) 20181210
     * @param {Event} e - A contextmenu event.
     */
    onContextMenu(e) {
        e.preventDefault();
    }

    /**
     * Actions fires after blurring the hidden input holder.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - A blur event from the hidden input holder
     */
    blurIPHolder(e) {
        e.stopPropagation();
        // If the user is not clicking on the spreadsheet, the spreadsheet has been blurred.
        if (!this.clicking) {
            this.toggleFocus();
        } else if (!this.editing) {
            // If it is not editing but still clicking on the spreadsheet, refocus this hidden input holder.
            App.nextFrame().then(e=>this.ipHolder.focus());
            this.ipHolder.addEventListener("blur", this.blurIPHolder.bind(this), {once: true, capture: false});
        }
    }

    /**
     * Add a customized function when the spreadsheet data is changed.   --- UPDATED (Dexter) 20180524
     * @param {Function} ftn - A function to be called later.
     */
    addChangeEvent(ftn) {
        this._changeE.push(ftn);
    }

    /**
     * Remove a customized function when the spreadsheet data is changed.   --- UPDATED (Dexter) 20181208
     * @param {Function} ftn - A function to be called later.
     */
    removeChangeEvent(ftn) {
        const ftnIdx = this._changeE.indexOf(ftn);
        if (ftnIdx != -1) this._changeE.splice(ftnIdx, 1);
    }

    /**
     * Add a customized function when the spreadsheet selection is changed.   --- UPDATED (Dexter) 20181207
     * @param {Function} ftn - A function to be called later.
     */
    addSelectionChangeEvent(ftn) {
        this._selChangeE.push(ftn);
    }

    /**
     * Remove a customized function when the spreadsheet selection is changed.   --- UPDATED (Dexter) 20181208
     * @param {Function} ftn - A function to be called later.
     */
    removeSelectionChangeEvent(ftn) {
        const ftnIdx = this._selChangeE.indexOf(ftn);
        if (ftnIdx != -1) this._selChangeE.splice(ftnIdx, 1);
    }

    /**
     * Actions fired when the data has been changed, and will call the functions in ._changeE.   --- UPDATED (Dexter) 20180524
     */
    changed() {
        this._changeE.forEach(ftn=>ftn.bind(this)({value: this.table}));
    }

    /**
     * Actions fired when the data selection has been changed, and will call the functions in ._selChangeE.   --- UPDATED (Dexter) 20181207
     */
    selectionChanged() {
        this._selChangeE.forEach(ftn=>ftn.bind(this)({selectionStart: this.selectedStart, selectionEnd: this.selectedEnd, colSelRange: this.getColSelectedRange()}));
    }

    /**
     * Refresh the data on the HTML spreadsheet from a specific range.   --- UPDATED (Dexter) 20190127
     * @param {Number[]} rangeStart - The start coordinate (inclusive)
     * @param {Number[]} relativeEnd - The end coordinate (exclusive)
     */
    showData(rangeStart = null, relativeEnd = null) {
        // Get the data and its shape
        var ary = this.table;
        const shape = Train.shape(ary);

        // Determine the start position and end position
        const startPos = rangeStart || [0,0];
        if (this.hasHeader) startPos[0] -= 1;
        const endPos = relativeEnd ? [Math.min(this.rowCount, startPos[0]+relativeEnd[0]), Math.min(this.colCount, startPos[1]+relativeEnd[1])] : [this.rowCount, this.colCount];

        // Transform the position to the HTML element position.
        const fromCellID = this.toChildrenCellPos(startPos);
        const toCellID = this.toChildrenCellPos(endPos);

        // For each HTML elements, show the cell data as from the data table.
        if (ary.length) {
            for (let i=fromCellID[0]; i< toCellID[0]; i++) {
                for (let j=fromCellID[1]; j< toCellID[1]; j++) {
                    // Find the HTML element of the cell.
                    const fromCellY = i-fromCellID[0], fromCellX = j-fromCellID[1];
                    var cell = this.ssObj.children[i].children[j];
    
                    // Ensure data exists in the table, otherwise, blank cell results.
                    if (ary[fromCellY] && ary[fromCellY][fromCellX] != undefined) {
                        // Display the data.
                        cell.innerText = ary[fromCellY][fromCellX];
    
                        // Adjust the style by determining if the data is a number.
                        if (isNaN(Number(ary[fromCellY][fromCellX]))) {
                            cell.classList.add("isText");
                        } else {
                            cell.classList.remove("isText");
                        }
                    } else {
                        cell.innerText = "";
                    }
                }
            }
        } else {
            const startI = this.showGridID ? fromCellID[0]+1 : fromCellID[0];
            if (this.showGridID) {
                for (let j = fromCellID[1]; j < toCellID[1]; j++) {
                    // Fill with default column grid id.
                    this.ssObj.children[0].children[j].innerText = String.fromCodePoint("A".codePointAt(0)+j-1);
                }
            }
            for (let i = startI; i < toCellID[0]; i++) {
                for (let j = fromCellID[1]; j < toCellID[1]; j++) {
                    // Find the HTML element of the cell.
                    this.ssObj.children[i].children[j].innerText = "";
                }
            }
        }
    }

    /**
     * Set the data of this spreadsheet, and will overwrite all previous data.   --- UPDATED (Dexter) 20181207
     * @param {Array} ary - The data table for this spreadsheet
     */
    setData(ary) {
        // Auto parse data format of data.
        ary = Matrix.autoType(ary);

        // Ensure this new array contains data.
        if (ary.length) {
            // Store the new array into .table property.
            this.table = ary;

            // Reset the row column states.
            this.resetRowColStates();

            // Hide show more buttons if needed.
            const dataLength = this.dataRowCount;
            if (this.hideMoreRow && this._row >= dataLength) {
                this._row = dataLength;
                this.hideMoreRow = false;
            }
            const maxCol = this.dataColCount;
            if (this.hideMoreCol && this._col >= maxCol) {
                this._col = maxCol;
                this.hideMoreCol = false;
            }
        }
    
        // Initiate all the grids.
        this.initiateGrids();

        // Refresh the data in HTML elements and fires a change event.
        this.refresh();
    }

    /**
     * Refresh this table.   --- UPDATED (Dexter) 20180524
     */
    refresh() {
        this.showData();
        this.changed();
    }

    /**
     * TODO [Spreadsheet/Dynamic Width]
     * Action:  Update the width of a column as requested. 
     * Reason:  Customized width is not supported.
     * @param {Number} col - The column index
     * @param {Number} rem - Length using "rem" as unit
     */
    setColWidth(col, rem) {

    }

    /**
     * Paste when it has been one-click on the spreadsheet.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - A paste event on the hidden input holder
     */
    pasteOnActiveCell(e) {
        e.preventDefault();

        // Get the text from the clipboard, and read it as a csv or tsv
        const text = e.clipboardData.getData("text");
        var ary = CSV.read(text, [',','\t']);

        // If there is some data, proceed with actions.
        if (ary.length) {
            if (!this.table.length || (this.table.length <= ary.length && this.table[0].length <= ary[0].length)) {
                // If previously there is no data, just replace and show the data.
                this.table = ary;
                this.showData();
            } else if (this.selectedStart[0] == this.selectedEnd[0] && this.selectedStart[1] == this.selectedEnd[1]) {
                // Otherwise, check the current position.
                const selectionStart = this.selectedStart;

                // Understand the column range of the new data.
                const pColCount = Math.max(...ary.map(r=>r.length));

                // For all changing cells, update the records.
                for (let i=selectionStart[0]; i< ary.length;i++) {
                    for (let j=selectionStart[0]; j<pColCount; j++) {
                        this.table[i][j] = ary[i-selectionStart[0]][j-selectionStart[0]];
                    }
                }

                // Update the data in HTML elements from the active cell.
                this.showData(selectionStart, [ary.length, pColCount]);
            }

            // Fires the change actions.
            this.changed();
        }
    }
    
    /**
     * Convert coordinates from the data array position to the HTML element.   --- UPDATED (Dexter) 20181210
     * @param {Number[]} coor - Corrdinate of the data cell in the data array position in (y,x).
     * @returns {Number[]} - Coordinates of the data cell in the HTML element.
     */
    toChildrenCellPos(coor) {
        return [Math.min(coor[0], this.rowCount)+((this.showGridID||this.hasHeader)?1:0), Math.min(coor[1], this.colCount)+(this.showGridID?1:0)];
    }

    /**
     * Get the cell element from a position.   --- UPDATED (Dexter) 20181210
     * @param {Number[]} pos - The position of the cell.
     * @param {Element} - The cell element.
     */
    getCellFromPos(pos) {
        return this.ssObj.children[pos[0]].children[pos[1]];
    }

    /**
     * Convert coordinates from the HTML element to the data array position.   --- UPDATED (Dexter) 20180524
     * @param {Number[]} coor - Coordinates of the data cell in the HTML element in (y,x).
     * @returns {Number[]} Corrdinate of the data cell in the data array position.
     */
    toActualCellPos(coor) {
        return [coor[0]-((this.showGridID||this.hasHeader)?1:0), coor[1]-(this.showGridID?1:0)];
    }

    /**
     * Clear the data table and the HTML element data cells.   --- UPDATED (Dexter) 20180524
     */
    clear() {
        this.table = [];
        this.showData();
    }

    /**
     * A global collection of all spreadsheet objects.   --- UPDATED (Dexter) 20180524
     */
    static get all() { return this._all; } static set all(v) { this._all = v; }

    /**
     * Initiation after the app is loaded.   --- UPDATED (Dexter) 20180524
     */
    static initiate() {
        // Setup a global property SpreadSheet.all for storing a key-value lookup on the spreadsheets.
        SpreadSheet.all = new Map();
    }
    
    /**
     * Get a spreadsheet object using its container HTML element ID.   --- UPDATED (Dexter) 20180524
     * @param {String} id - Spreadsheet container HTML element ID
     */
    static get(id) {
        return this.all.get(id);
    }
}

/** Class representing a temp information regarding a node afftecting in a connection.   --- UPDATED (Dexter) 20181124 */
class ConnectingNodeInfo {
    /**
     * Create a connecting node information.   --- UPDATED (Dexter) 20181124
     * @param {ModelNode.Layer.|DataPreprocessing.Node} layerOrSource - The layer name to copy existing info.
     * @param {Train} train - The editing train object. If no train is given, Project.now.train will be used.
     */
    constructor(layerOrSource, train) {
        const thisTrain = train || Project.now.train;
        const build = thisTrain._editingBuild;
        this.buildNo = build;
        this.type = layerOrSource instanceof LayerProfile ? "Layer" : "Source";
        var details = {};
        if (this.type == "Layer") {
            details.layerName = layerOrSource.name;
            details.fromSource = [...layerOrSource.fromSource[build]];
            details.fromNode = layerOrSource.fromNode[build].map(lp=>lp.name);
            details.toNode = layerOrSource.toNode[build].map(lp=>lp.name);
            details.shape = layerOrSource._shape[build];
            details.order = layerOrSource._order[build];
        } else {
            details.keys = layerOrSource.getIDAndKey();
            details.toNode = layerOrSource.trainSource.train.getLayersUsingSource(...details.keys);
        }
        this.details = details;
    }
}

/** Class representing a model editing project.   --- UPDATED (Dexter) 20180521 */
class Project {
    /**
     * Create a model editing project.   --- UPDATED (Dexter) 20180521
     * @param {number} id - The element id of the editing graph.
     */
    constructor(id="editGraph") {
        /** @type {Train} - The @Train object this project is editing. */
        this.train = null;
        this.id = id;
        this.updatingEdges = [];
        this.latestLayerType = "TrainSource";
        this.connectionMode = false;
        this.connectingLayerOrSource = null;
        this.connectionNode = null;
        this.connectionAffectingNodes = null;
        this.clear();
    }

    /**
     * Draw the training model onto the core editing pane.   --- UPDATED (Dexter) 20190213
     */
    drawTrain() {
        var graph = $(this.id);
        var sourceRow = graph.getElementsByClassName("sourceRow")[0];
        var colConfigCount = 0;
        var latestLayerRow = sourceRow;

        // For each training source, draw the input source with their column configurations.
        this.train.sources.forEach((source,idx)=>{

            // Create a new HTML element if no source has ever been created.
            var sourceNode = sourceRow.children[idx];
            if (!sourceNode) {
                sourceNode = $("layerItemTemp").cloneNode(true);
                sourceNode.id = "";
                this.latestLayerType = sourceNode.dataset.type = "TrainSource";
                sourceNode.classList.add("inputSource");
                sourceNode.addEventListener("contextmenu", Project.toShowCMSource, false);
                sourceNode.addEventListener("click", this.toShowPropFromNode.bind(this), false);
                sourceRow.appendChild(sourceNode);
            } 
            
            // Update the HTML element to fit the values of this specific source.
            sourceNode.dataset.sourceID = idx;
            var sourceNameNode = sourceNode.getElementsByClassName("layerName")[0];
            var name = source.getGeneralizedName();

            // Noted if the name is the original source type, we may use a translatable value.
            if (source._type == name) {
                sourceNameNode.innerText =  App.getTxtFromLang(name);
                sourceNameNode.dataset.lt = name;
            } else {
                sourceNameNode.innerText = name;
                sourceNameNode.dataset.lt = "";
            }
            sourceNode.getElementsByClassName("shapeVal")[0].innerText = "[" + source._oriShape.join(", ") + "]";


            // Adding all column configs of this source to the graph
            source.colConfigs.forEach((colConfig, dppKey)=>{
                
                // The root column configs are added first
                if (colConfig.getShape() || colConfig.hasData()) {

                    // Create a new row if no column configs has ever been created.
                    // A new row is appended just after the previous connecting edge row.
                    // This action would be similar to later row creation for new layers.
                    var colConfigRow = graph.getElementsByClassName("colConfigRow")[0];
                    if (!colConfigRow) {
                        var colConfigRow = document.createElement("div");
                        colConfigRow.classList.add("graphrow");
                        colConfigRow.classList.add("colConfigRow");
                        var prevEdge = sourceRow.nextElementSibling;
                        prevEdge.insertAdjacentElement("afterend", colConfigRow);
                        var anotheredge = prevEdge.cloneNode(true);
                        colConfigRow.insertAdjacentElement("afterend", anotheredge);
                    }
                    latestLayerRow = colConfigRow;

                    // Create a HTML element if no column configs has ever been created in that row.
                    var colConfigNode = colConfigRow.children[colConfigCount];
                    if (!colConfigNode) {
                        colConfigNode = $("layerItemTemp").cloneNode(true);
                        colConfigNode.id = "";
                        colConfigNode.dataset.type = "ColConfig";
                        colConfigNode.addEventListener("contextmenu", Project.toShowCMInput, false);
                        colConfigNode.addEventListener("click", this.toShowPropFromNode.bind(this), false);
                        colConfigNode.getElementsByClassName("outputNode")[0].addEventListener("click", Project.toEditOutputLink, false);
                        colConfigRow.appendChild(colConfigNode);
                    } 

                    // Update the HTML element to fit the values of this specific column config.
                    colConfigNode.dataset.dppKey = dppKey;
                    colConfigNode.dataset.sourceID = idx;
                    colConfigNode.dataset.fromLayer = JSON.stringify([idx]);
                    colConfigNode.getElementsByClassName("shapeVal")[0].innerText = "[" + colConfig.getShape().join(", ") + "]";
                    colConfig.ele = colConfigNode;
                    
                    // Noted if the name is the defined config type, we may use a translatable value.
                    var colConfigNameNode = colConfigNode.getElementsByClassName("layerName")[0];
                    colConfig.showNameOnEle(colConfigNameNode);
                    
                    // Increment the column config counter to allower later loops to check for the existence of HTML elements.
                    colConfigCount += 1;
                    
                } else {
                    // TODO [Model Editing/Data Preprocessing]
                    // Action: Add layers of column configs if it is not rooted with the original data source.
                    // Reason:  Derived Column configs has not been implemented.
                    // Remarks: This is to match with NeuralSimplycode TableSource.selColumns() .
                }

            });

            // TODO [Model Editing/Model Drawing]
            // Action: Remove too many column configs HTML elements as from previous draw state to current draw state.
            // Reason: Customized column configs has not been implemented.

            // In case no column config is used, we'll remove any col config rows.
            if (colConfigCount == 0) {
                [...graph.getElementsByClassName("colConfigRow")].forEach(ele=>{
                    if (ele.nextElementSibling.classList.contains("edgeRow")) ele.nextElementSibling.remove();
                    ele.remove();
                });
            } else {
                this.latestLayerType = "ColConfig";
            }

        });

        // TODO [Model Editing/Model Drawing]
        // Action: Remove too many source HTML elements as from previous draw state to current draw state.
        // Remarks: Multiple TrainSource has not been implemented.
        
        
        // Layers won't necessarily be sorted in Train.layerProfiles.
        // Need to remember how many layers has been added in each feed forward row of layers.
        var layerNodeCounts = [], skipNodeCounts = [];

        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // Add each layer into the graph. For graphical logic, the layer profiles are now sorted by the ._order proerty
        var layerProfiles = [...this.train.layerProfiles.entries()];
        layerProfiles.sort((a,b)=>a[1]._order[buildNo]>b[1]._order[buildNo] ? 1 : a[1]._order[buildNo]==b[1]._order[buildNo] ? 0 : -1);
        const availableOrders = [...new Set(layerProfiles.map(l=>l[1]._order[buildNo]-1))];
        const hiddenLayerCount = availableOrders.length - layerProfiles.filter(l=>l[1]._final).length ? 1 : 0;

        // Remove additional layer rows.
        [...graph.getElementsByClassName("layerRow")].forEach((lr,idx)=>{
            if (idx >= hiddenLayerCount) {
                lr.nextElementSibling.remove();
                lr.remove();
            }
        });

        // Loop every layer profile for getting the node onto the graph.
        var nowRow = 0;
        layerProfiles.forEach((lp, idx)=>{
            var l = lp[1], ln = lp[0];

            // The feed farward order is yet stored in ._order property, which is useful for organizing the feed-forward network graphically.
            var layerNo = l._order[buildNo] - 1;
            var layerRowIdx = availableOrders.indexOf(layerNo);

            // A change of layer row occurs.
            if (nowRow != layerRowIdx) {
                // Remove previous row's excessive layer nodes.
                if (layerRowIdx > 0) [...graph.getElementsByClassName("layerRow")[nowRow].children].filter(ele=>ele.classList.contains("layer")).slice(layerNodeCounts[nowRow]).forEach(n=>n.remove());

                // Update current row.
                nowRow = layerRowIdx;
            }


            // Define necessary layers.
            var isFinal = l._final;
            var layerRow, layerNode;
            var nowLayerCount = (layerNodeCounts[layerRowIdx] == undefined) ? (layerNodeCounts[layerRowIdx] = 1) : (layerNodeCounts[layerRowIdx] += 1);

            // Layers are in 2 cases and handled differently if they are final task layer.
            if (!isFinal) {
                // Ensure the current feed forard row has been created.
                layerRow = graph.getElementsByClassName("layerRow")[layerRowIdx];
                if (!layerRow){
                    layerRow = document.createElement("div");
                    layerRow.classList.add("graphrow");
                    layerRow.classList.add("layerRow");
                    var prevEdge = latestLayerRow.nextElementSibling;
                    prevEdge.insertAdjacentElement("afterend", layerRow);
                    var anotheredge = prevEdge.cloneNode(true);
                    layerRow.insertAdjacentElement("afterend", anotheredge);
                }
                latestLayerRow = layerRow;
                this.latestLayerType = "Layer";
            } else {
                // Ensure the final layer row is created because this is a FinalLayer.
                layerRow = graph.getElementsByClassName("finalLayerRow")[0];
                if (!layerRow) {
                    layerRow = document.createElement("div");
                    layerRow.classList.add("graphrow");
                    layerRow.classList.add("finalLayerRow");
                    var prevEdge = latestLayerRow.nextElementSibling;
                    prevEdge.insertAdjacentElement("afterend", layerRow);
                    // Noted the final layer row won't insert another row of new edge connection
                }
                this.latestLayerType = "FinalLayer";
            }
            
            // Ensure an HTML element exists for placing this layer.
            var layerNode = [...layerRow.children].filter(ele=>ele.classList.contains("layer"))[nowLayerCount - 1];
            if (!layerNode) {
                layerNode = $("layerItemTemp").cloneNode(true);
                layerNode.id = "";
                layerNode.dataset.type = "Layer";
                if (isFinal) {
                    layerNode.classList.add("finalLayer");
                }
                layerNode.addEventListener("click", this.toShowPropFromNode.bind(this), false);
                layerNode.addEventListener("contextmenu", isFinal ? Project.toShowCMFinalLayer : Project.toShowCMLayer, false);
                layerNode.getElementsByClassName("receiveNode")[0].addEventListener("click", Project.toEditInputLink, false);
                if (!isFinal) layerNode.getElementsByClassName("outputNode")[0].addEventListener("click", Project.toEditOutputLink, false);

                // Push the new layer node before any other nodes like edge connections.
                let otherNode = [...layerRow.children].filter(ele=>!ele.classList.contains("layer"));
                if (otherNode.length) {
                    layerRow.insertBefore(layerNode, otherNode[0]);
                } else {
                    layerRow.appendChild(layerNode);
                }
            } 

            // Update the element info to fit with the current layer details.
            layerNode.dataset.layerName = ln;
            l.ele = layerNode;
            var layerNameNode = layerNode.getElementsByClassName("layerName")[0];

            // Sometimes the layer name is translatable, as according to Train special name ordering strategy.
            if (l._ltTemp) {
                layerNameNode.dataset.lt = l._lt;
                layerNameNode.dataset.ltTemp = l._ltTemp;
                App.applyEleLang(layerNameNode);
            } else {
                layerNameNode.innerText = ln;
                layerNameNode.dataset.lt = layerNameNode.dataset.ltTemp = "";
            }
            
            // For order > 2 layers, they may not have previous node correction directly on previous layer, some edge connections may need to skip across several orders.
            if (l._order[buildNo] > 1) {
                // From the perspective of just added layer node, check the previous layer.
                const prevRowID = layerRowIdx-1;
                const prevRow = layerRow.previousElementSibling.previousElementSibling;
                const prevRowEles = [...prevRow.children].filter((ele,idx)=>idx < layerNodeCounts[prevRowID] + (skipNodeCounts[prevRowID] || 0));
                var layerNodeFrom = [];

                // Determine if the source is not found in the previous layer.
                l.fromSource[buildNo].forEach((fromSource,idx,ary)=>{
                    let checkLayerRow = prevRow, checkLayerRowEles = prevRowEles, checkRowID = prevRowID, workingNode = layerNode, linkingNodeIdx;
                    while ((linkingNodeIdx = checkLayerRowEles.findIndex(preLn=>Number(preLn.dataset.sourceID) == fromSource[0] && preLn.dataset.dppKey == fromSource[1])) == -1 && checkRowID >= 0) {
                        // Accumulate the layer connection counts.
                        let nowLayConnCount = (skipNodeCounts[checkRowID] == undefined) ? (skipNodeCounts[checkRowID] = 1) : (skipNodeCounts[checkRowID] += 1);
                        
                        // Use existing layer connections if needed.
                        checkLayerRowEles = [...checkLayerRow.children].filter((ele,idx)=>idx < layerNodeCounts[prevRowID] + (skipNodeCounts[prevRowID] || 0));
                        let checkingConn = checkLayerRowEles.filter(ele=>ele.classList.contains("layerConn"));
                        var layerConn;
                        if (checkingConn.length < nowLayConnCount) {
                            layerConn = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            layerConn.classList.add("layerConn");
                            checkLayerRow.appendChild(layerConn);
                        } else {
                            layerConn = checkingConn[nowLayConnCount - 1];
                        }
                        
                        // Update layer connection information.
                        layerConn.dataset.sourceID = fromSource[0];
                        layerConn.dataset.dppKey = fromSource[1];
                        delete layerConn.dataset.layerName;

                        // Update the fromLayer and assign the newly created element as the working node.
                        if (checkRowID == prevRowID) layerNodeFrom.push(nowLayConnCount + layerNodeCounts[checkRowID] - 1);
                        else workingNode.dataset.fromLayer = JSON.stringify([nowLayConnCount + layerNodeCounts[checkRowID] - 1]);
                        workingNode = layerConn;
                        
                        // Pop upper along the network.
                        checkRowID -= 1;
                        checkLayerRow = checkLayerRow.previousElementSibling.previousElementSibling;
                        if (checkRowID >= 0)  checkLayerRowEles = [...checkLayerRow.children].filter((ele,idx)=>idx < layerNodeCounts[checkRowID] + (skipNodeCounts[checkRowID] || 0));
                        else checkLayerRowEles = [...checkLayerRow.children];
                    }

                    // Assign the from layer index of the source
                    if (checkRowID == prevRowID) layerNodeFrom.push(linkingNodeIdx);
                    else workingNode.dataset.fromLayer = JSON.stringify([linkingNodeIdx]);
                });

                l.fromNode[buildNo].forEach((fromNode,idx,ary)=>{
                    let checkLayerRow = prevRow, checkLayerRowEles = prevRowEles, checkRowID = prevRowID, workingNode = layerNode, linkingNodeIdx;
                    while ((linkingNodeIdx = checkLayerRowEles.findIndex(preLn=>preLn.dataset.layerName == fromNode.name)) == -1 && checkRowID > 0) {
                        // Accumulate the layer connection counts.
                        let nowLayConnCount = (skipNodeCounts[checkRowID] == undefined) ? (skipNodeCounts[checkRowID] = 1) : (skipNodeCounts[checkRowID] += 1);
                        
                        // Use existing layer connections if needed.
                        checkLayerRowEles = [...checkLayerRow.children].filter((ele,idx)=>idx < layerNodeCounts[prevRowID] + (skipNodeCounts[prevRowID] || 0));
                        let checkingConn = checkLayerRowEles.filter(ele=>ele.classList.contains("layerConn"));
                        var layerConn;
                        if (checkingConn.length < nowLayConnCount) {
                            layerConn = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            layerConn.classList.add("layerConn");
                            checkLayerRow.appendChild(layerConn);
                        } else {
                            layerConn = checkingConn[nowLayConnCount - 1];
                        }
                        
                        // Update layer connection information.
                        layerConn.dataset.layerName = fromNode.name;
                        delete layerConn.dataset.sourceID;
                        delete layerConn.dataset.dppKey;

                        // Update the fromLayer and assign the newly created element as the working node.
                        if (checkRowID == prevRowID) layerNodeFrom.push(nowLayConnCount + layerNodeCounts[checkRowID] - 1);
                        else workingNode.dataset.fromLayer = JSON.stringify([nowLayConnCount + layerNodeCounts[checkRowID] - 1]);
                        workingNode = layerConn;
                        
                        // Pop upper along the network.
                        checkRowID -= 1;
                        checkLayerRow = checkLayerRow.previousElementSibling.previousElementSibling;
                        if (checkRowID >= 0) checkLayerRowEles = [...checkLayerRow.children].filter((ele,idx)=>idx < layerNodeCounts[checkRowID] + (skipNodeCounts[checkRowID] || 0));
                        else checkLayerRowEles = [...checkLayerRow.children];
                    }

                    // Assign the from layer index of the source
                    if (checkRowID == prevRowID) layerNodeFrom.push(linkingNodeIdx);
                    else workingNode.dataset.fromLayer = JSON.stringify([linkingNodeIdx]);
                });

                layerNode.dataset.fromLayer = JSON.stringify(layerNodeFrom);
            } else {
                const souceLayer = [...layerRow.previousElementSibling.previousElementSibling.children];
                layerNode.dataset.fromLayer = JSON.stringify(l.fromSource[buildNo].map(fromSource=>souceLayer.findIndex(preLn=>Number(preLn.dataset.sourceID) == fromSource[0] && preLn.dataset.dppKey == fromSource[1])));
            }
            
            if (!isFinal) {
                // Display the shape if it's a data preprocessing node or a hidden layer.
                layerNode.getElementsByClassName("shapeVal")[0].innerText = "[" + (l._shape[buildNo]).join(", ") + "]";
            } else {
                // If it's a final layer, display the prediction task data preprocessing column.
                var dppNode = l.train.getDataSource(l.compareSourceID, l.compareTensorIdx);
                dppNode.showNameOnEle(layerNode.getElementsByClassName("predDppNode")[0]);
            }
        });

        // Remove unecessary layer connection nodes.
        [...graph.getElementsByClassName("layerRow")].forEach((ele, idx)=>{
            [...ele.children].filter(ele=>ele.classList.contains("layerConn")).slice(skipNodeCounts[idx]).forEach(n=>n.remove());
        });

        // Remove latest row's excessive nodes.
        if (layerNodeCounts.length && graph.getElementsByClassName("layerRow")[nowRow]) [...graph.getElementsByClassName("layerRow")[nowRow].children].filter(ele=>ele.classList.contains("layer")).slice(layerNodeCounts[nowRow]).forEach(n=>n.remove());

        // Remove final layer row if there is no finaly layer anymore.
        if (layerProfiles.filter(l=>l[1]._final).length === 0 && graph.getElementsByClassName("finalLayerRow").length) {
            graph.getElementsByClassName("finalLayerRow")[0].remove();
        }

        // Later to update all connecting edges, and to show proactive next action to the user.
        this.refreshEdges();
        this.showNextAction();

    }

    /**
     * Export this project as a JSON file.    --- UPDATED (Dexter) 20180521
     */
    exportAsJSON() {

        // Extract the current train object as JSON
        var str = JSON.stringify(this.train.exportAsJSON());

        // After getting the JSON string, assign the string to a data URL through a Blob creation, followed by a manual click download link action.
        var dataURL = URL.createObjectURL(new Blob([str], {type : 'application/json'}));
        $("downloadHolder").href = dataURL;
        $("downloadHolder").download = "project.json";
        $("downloadHolder").click();

    }

    /**
     * To refresh the model editing graph in the layer connection aspect.   --- UPDATED (Dexter) 20180521
     */
    refreshEdges() {

        // All edgeSVG are the connection between incremental layers, the SVGs will be updated one by one due to performance issues
        this.updatingEdges = [...$(this.id).getElementsByClassName("edgeSVG"), ...$(this.id).getElementsByClassName("layerConn")];
        window.requestAnimationFrame(this.refreshBatchedEdge.bind(this));

    }

    /**
     * A bactched update for model connection edges.    --- UPDATED (Dexter) 20181214
     * @param {DOMHighResTimeStamp} ts - A timestamp in case of a window.requestAnimation() called.
     */
    refreshBatchedEdge(ts) {
        // If there exists non-updated edges, we'll proceed with the details; otherwise, stop future batched calls.
        if (this.updatingEdges.length) {
            // Edges are updated from the top. 
            var toUpdateEdge = this.updatingEdges[0];
            var bbox, prevPos, nextPos;
            var isDirEdge = toUpdateEdge.classList.contains("edgeSVG");

            if (isDirEdge) {
                // Firstly, we need to resize the SVG viewbox according to the container size.
                var parent = toUpdateEdge.parentElement;
                var prevLayer = parent.previousElementSibling;
                var nextLayer = parent.nextElementSibling;
                bbox = parent.getBoundingClientRect();

                // Collect the position information on every layer nodes before and after this updating edge SVG box.
                prevPos = [...prevLayer.children].filter(ele=>ele.classList.contains("layer")||ele.classList.contains("layerConn")).map(ele=>{
                    var lbbox = ele.getBoundingClientRect();
                    return lbbox.left - bbox.left + (lbbox.width/2);
                });
                nextPos = [...nextLayer.children].filter(ele=>ele.classList.contains("layer")||ele.classList.contains("layerConn")).map(ele=>{
                    var lbbox = ele.getBoundingClientRect();
                    return {pos: lbbox.left - bbox.left + (lbbox.width/2), from: JSON.parse(ele.dataset.fromLayer)};
                });
            } else {
                // If it's a layer connecting edge, just use the middle of the svg.
                bbox = toUpdateEdge.getBoundingClientRect();
                prevPos = [bbox.width/2];
            }
            toUpdateEdge.setAttribute("viewbox", `0 0 ${bbox.width} ${bbox.height}`);

            // If there is no next layer elements, we'll make the center as default.
            // This is the typical case for model not finished editing where the final layer has not been added.
            if (!nextPos || !nextPos.length) nextPos = [{pos: bbox.width/2, from: [0]}];

            // For each next position of the following feedforward layers, we need to connect with previous layers.
            var edgeIdx = 0;
            nextPos.forEach(info=>{
                // Each layer may have several incoming edges.
                info.from.forEach(fromIdx=>{
                    // Ensure a <path> exists in this SVG for a new edge
                    var edge = toUpdateEdge.childNodes[edgeIdx];
                    if (!edge) {
                        edge = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        edge.setAttribute("stroke-width", 2);
                        toUpdateEdge.appendChild(edge);
                    }
                    
                    if (isDirEdge) {
                        // Update relevant positioning issues for creating the edge with an arrow if it is a normal connecting edge.
                        var slope = bbox.height/(info.pos-prevPos[fromIdx]);
                        var center = [prevPos[fromIdx]+(info.pos-prevPos[fromIdx])*.6, bbox.height*.6];
                        var arrowLen = 16;
                        var deg = (slope < 70) ? (Math.atan2(bbox.height, (info.pos-prevPos[fromIdx])) - Math.PI) : -Math.PI/2;
                        var deg1 = deg + Math.PI*0.2;
                        var arrow1 = [arrowLen*Math.cos(deg1) , arrowLen*Math.sin(deg1)];
                        var deg2 = deg - Math.PI*0.2;
                        var arrow2 = [arrowLen*Math.cos(deg2) , arrowLen*Math.sin(deg2)];
                        edge.setAttribute("d", `M ${prevPos[fromIdx]} 0 L ${info.pos} ${bbox.height} M ${center[0]} ${center[1]} l ${arrow1[0]} ${arrow1[1]} M ${center[0]} ${center[1]} l ${arrow2[0]} ${arrow2[1]}`);
                    } else {
                        // If it's a layer connecting edge, just draw a straight line to pass through a layer.
                        edge.setAttribute("d", `M ${prevPos[fromIdx]} 0 L ${info.pos} ${bbox.height}`);
                    }
                    edgeIdx++;
                })
            });

            // Remove any edges that may arise due to no. of edges in previous state larger than the current state
            if (toUpdateEdge.childNodes.length > edgeIdx) {
                [...toUpdateEdge.childNodes].slice(nextPos.reduce((a,b)=>a+b.from.length, 0)).forEach(ele=>ele.remove());
            }

            // After the edge creation, we'll remove from the stored list of this.updatingEdges
            this.updatingEdges = this.updatingEdges.slice(1);

            // If there exists non-updated edges, we'll proceed with the details; otherwise, stop future batched calls.
            if (this.updatingEdges.length) window.requestAnimationFrame(this.refreshBatchedEdge.bind(this));
        }
    }

    /**
     * Call when window resized, typically to update all SVG edges.   --- UPDATED (Dexter) 20180521
     */
    resize() {
        this.refreshEdges();
    }

    /**
     * To show properties on the right panel.   --- UPDATED (Dexter) 20190213
     * @param {String} type - "Train", "TrainSource", "ColConfig", "Layer".
     */
    showProp(type) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // Show the requesting property panel.
        [...$("editProp").getElementsByClassName("propWin")].forEach(ele=>{
            if (ele.id.endsWith(type)) ele.classList.remove("noDisplay");
            else ele.classList.add("noDisplay");
        });

        // Remove any previously input validation failures.
        [...$("editProp").getElementsByClassName("warn")].forEach(ele=>{
            ele.classList.remove("warn");
            if (ele.dataset.warnLT) delete ele.dataset.warnLT;
            if (ele.dataset.warnCuzLT) delete ele.dataset.warnCuzLT;
        });

        // Update Property Panel title bar.
        $("propTitle").innerText = App.getTxtFromLang(type);
        $("propTitle").dataset.lt = type;

        // The following includes different "type"s of properties logic.
        if (type == "Train") {

            // Show the core name of the property window, display the translatable name if needed.
            if (this.train.trainName == "train")  {
                $("propTrainName").innerText = App.getTxtFromLang("training");
                $("propTrainName").dataset.lt = "training";
            } else {
                $("propTrainName").innerText = this.train.trainName;
                $("propTrainName").dataset.lt = "";
            }
            
            // Show the learning rate decay options.
            if (this.train.trainingProfiles[0].numEpochsPerDecay == null) {
                $("propEpochPerLRSwitch").classList.remove("noDisplay");
                $("propLRDecayRow").classList.add("noDisplay");
                $("propEpochPerLR").classList.add("noDisplay");
                $("cancelValidation").classList.add("noDisplay");
            } else {
                $("propEpochPerLRSwitch").classList.add("noDisplay");
                $("propLRDecayRow").classList.remove("noDisplay");
                $("propEpochPerLR").classList.remove("noDisplay");
                $("cancelValidation").classList.remove("noDisplay");
            }

            // Query for each "propVal" elements, and apply the values on them
            [...$("propWinTrain").getElementsByClassName("propVal")].forEach(ele=>this.applyPropVal(ele));

            // It's special for "propCrossValType", because changing its value will have different properties show up.
            // Dispatch a change event manually to make the show up effective.
            $("propCrossValType").dispatchEvent(new Event("change"));

        } else if (type == "TrainSource") {

            // Collect the effective source object
            var target = this.train.sources[this.train._editingSource];

            // Show the core name of the property window, display the translatable name if needed.
            if (target.name == "")  {
                $("propSourceName").innerText = App.getTxtFromLang(target._type);
                $("propSourceName").dataset.lt = target._type;
            } else {
                $("propSourceName").innerText = target.trainName;
                $("propSourceName").dataset.lt = "";
            }

            // Query for available "propRow" that are applicable to this Data Source type.
            [...$("propWinTrainSource").getElementsByClassName("propRow")].forEach(row=>{
                if (!row.dataset.subClass || JSON.parse(row.dataset.subClass).includes(target._type)) {
                    // Query for each "propVal" elements, and apply the values on them.
                    row.classList.remove("noDisplay");
                    [...row.getElementsByClassName("propVal")].forEach(ele=>this.applyPropVal(ele));
                } else {
                    row.classList.add("noDisplay");
                }
            });

            // Special Action - Show if this data source is splittable for validation use.
            var toStatus = target.splittable ? "propAllow" : "propDisable";
            $("propCVSource").innerText = App.getTxtFromLang(toStatus) ;
            $("propCVSource").dataset.lt = toStatus;

            // Display embedded data if it has.
            if (target._oriData) {
                $("propDataSourcePreviewGroup").classList.remove("noDisplay");
                SpreadSheet.get("dataSourcePreview").setData(target.getAllTable());
            } else {
                $("propDataSourcePreviewGroup").classList.add("noDisplay");
            }

        } else if (type == "ColConfig") {

            // Collect the effective column config object.
            var dppKey = this.train._editingColConfig[1];
            var source = this.train.sources[this.train._editingColConfig[0]];
            var colConfig = this.train.getDataSource(...this.train._editingColConfig);

            // Show the core name of the property window, display the translatable name if needed.
            if (dppKey == "input" || dppKey == "target")  {
                $("propColConfigName").innerText = App.getTxtFromLang(dppKey + "DppKey");
                $("propColConfigName").dataset.lt = dppKey + "DppKey";
           } else {
                $("propColConfigName").innerText = dppKey;
                $("propColConfigName").dataset.lt = "";
           }
           
           // Query for available "propGroup" that are applicable to this Data Source type.
           [...$("propWinColConfig").getElementsByClassName("propGroup")].forEach(g=>{
                if (!g.dataset.subClass || JSON.parse(g.dataset.subClass).some(t=>t==source._type)) {
                    // Some of the groups may have been collapsed , which will need to be neglected
                    if (!g.classList.contains("canCollapse")) g.classList.remove("noDisplay");

                    if (g.id == "propTxCirGroup") {
                        // Update the transformation information
                        Project.updateTransformList(this.train._editingColConfig[0], dppKey, false);

                        // Update the circular information
                        Project.updateCircularList(this.train._editingColConfig[0], dppKey, false);
                    }
                } else {
                    g.classList.add("noDisplay");
                }
            });

            // Query for each "propVal" elements, and apply the values on them
            [...$("propWinColConfig").getElementsByClassName("propVal")].forEach(ele=>{
                if (!["propOneHot", "propColumns"].includes(ele.id)) {
                    this.applyPropVal(ele);
                }
            });

            // Only show cropping for CIFAR source.
            if (source instanceof ImageSource && colConfig.key == "input" && source.sourceType == "cifar10") {
                $("propImgOutWRow").classList.remove("noDisplay");
                $("propImgOutHRow").classList.remove("noDisplay");
            } else {
                $("propImgOutWRow").classList.add("noDisplay");
                $("propImgOutHRow").classList.add("noDisplay");
            }


            // Show Image cropping info.
            if (!$("propImgOutWRow").classList.contains("noDisplay")) {
                const outputShape = colConfig.getShape();
                $("propImgOutW").value = outputShape[2];
                $("propImgOutH").value = outputShape[1];
            }

            // Determine the column selection range.
            if (!isOrDescendentOf($("propColumns"), ele=>ele.classList.contains("noDisplay"))) {
                $("propColumns").dataset.selLen = Number(colConfig.getInputShape()[1]);
                $("propColumns").value = colConfig.sourceCol;
            }

            // Set the column selection info for one-hot data.
            if (!isOrDescendentOf($("propOneHot"), ele=>ele.classList.contains("noDisplay"))) {
                $("propOneHot").dataset.selLen = Number(colConfig.getInputShape()[1]);
                var colSelIndices = [];
                for (let idx = 0; idx < colConfig.getInputShape()[1]; idx++) {
                    colSelIndices.push((colConfig.oneHotColumns.has(idx)) ? true : false);
                }
                $("propOneHot").value = IndexRange.getStringFromIndices(colSelIndices);
            }

            // Display embedded data if it has.
            if (source._oriData) {
                $("propDataPreviewGroup").classList.remove("noDisplay");
                SpreadSheet.get("colDataPreview").setData(source.getColTable(dppKey));
            } else {
                $("propDataPreviewGroup").classList.add("noDisplay");
            }
            
        } else if (type == "Layer") {

            // Collect the effective layer object
            var layName = this.train._editingLayer;
            var layer = this.train.layerProfiles.get(layName);

            // Show the core name of the property window, display the translatable name if needed.
            layer.showNameOnEle($("propLayerName"));

            // Determine if it's now final layer, and assign a new key for clarifications.
            var fullType = (layer._final ? "FinalLayer" : "Layer") + "-" + layer._type;

            // Query for available "propGroup" that are applicable to this Layer type
            [...$("propWinLayer").getElementsByClassName("propGroup")].forEach(g=>{
                if (!g.dataset.subClass || JSON.parse(g.dataset.subClass).some(t=>fullType.startsWith(t))) {
                    // Some of the groups may have been collapsed , which will need to be neglected
                    if (!g.classList.contains("canCollapse")) g.classList.remove("noDisplay");

                    // Query for available "propRow" that are applicable to this Layer type.
                    [...g.getElementsByClassName("propRow")].forEach(row=>{
                        if (!row.dataset.subClass || JSON.parse(row.dataset.subClass).some(t=>fullType.startsWith(t))) {
                            // Query for each "propVal" elements, and apply the values on them.
                            row.classList.remove("noDisplay");
                        } else {
                            row.classList.add("noDisplay");
                        }
                    });
                } else {
                    g.classList.add("noDisplay");
                }
            });

            // Determine if it's now final layer, and assign a new key for clarifications.
            const layerType = layer._type;
            $("propLayerType").dataset.lt = layerType;
            $("propLayerType").innerText = App.getTxtFromLang(layerType);

            // Determine if layer reference is allowed.
            var referenceable = false, hasRefLayer = layer.refLayerName != null;
            if (layer._order[buildNo] >= 1) {
                var allLayers = [...Project.now.train.layerProfiles.values()].filter(l=>!l.refLayerName && l._order[buildNo] < layer._order[buildNo]);
                
                if (layerType == "BasicLayer") {
                    // Get the input shapes of this editing layer.
                    var thisInputShapes = layer.getPreprocessedIncomingShape();
                    
                    // Filter possible layers that can be referenced.
                    var basiclayers = allLayers.filter(l=>l._type == "BasicLayer").filter(l=>{
                        // Determine the shape match with this editing layer to check if transpose if needed.
                        var lInputShape = l.getPreprocessedIncomingShape();
                        var lOutputShape = l.getOutputShape();
                        var refLayerTranspose = shapeEquals(lInputShape, thisInputShapes) ? false : shapeEquals(lOutputShape, thisInputShapes) ? true : null;

                        // If no matched shape, this is not a referenceable layer.
                        if (refLayerTranspose === null) return false;

                        // Otherwise, check the new output shape and see if it's possible with later layers.
                        else if (layer.toNode[buildNo].length) {
                            var newOutputShape = refLayerTranspose ? lInputShape : lOutputShape;
                            var configChanges = {type: "layer", id1: this.name, shape: newOutputShape};
                            var nextLayerResults = layer.applyShapeChanges(null, configChanges, undefined, false);
                            return nextLayerResults.result;
                        } 

                        // If there is no later layers, it's fine with any reference layers.
                        else return true;
                    });

                    if (basiclayers.length > 0) {
                        // If it is a BasicLayer, find if there is any previous layer with the same input/output shape as current input shape.
                        referenceable = true;
    
                        // Show the basic layer as options for parameters sharing.
                        App.controlChildrenCount($("propLayerRef"), basiclayers.length+1, document.createElement("option"), undefined, undefined, (ele,idx)=>{
                            if (idx >= 1) {
                                ele.dataset.val = basiclayers[idx-1].name;
                                basiclayers[idx-1].showNameOnEle(ele);
                            }
                        });
                    }
                } else if (["CNNLayer", "DCNNLayer"].includes(layerType)) {
                    // CPU processing disables CNN dilations.
                    if (this.train.device.startsWith("/cpu")) {
                        $("propDilationRow").classList.add("noDisplay");
                    } else {
                        $("propDilationRow").classList.remove("noDisplay");
                    }
                }
            }

            // Show/Hide layer referencing options.
            if (referenceable) {
                $("propLayerRefRows").classList.remove("noDisplay");
                if (hasRefLayer) {
                    $("propTransRefWeightRow").classList.remove("noDisplay");
                    this.applyPropVal($("propLayerRef"));
                } else $("propTransRefWeightRow").classList.add("noDisplay");
            } else $("propLayerRefRows").classList.add("noDisplay");
            if (hasRefLayer) Project.inactivateLayerConfigs();
            else Project.activateLayerConfigs();

            // Determine whether to show incoming configurations.
            if (layer.getIncomingShapes().length > 1) {
                $("propIncomingConfigGroup").classList.remove("noDisplay");
            } else {
                $("propIncomingConfigGroup").classList.add("noDisplay");
            }

            // Determine whether to show output configurations.
            if (layer.isFinal()) {
                $("propOutputConfigGroup").classList.add("noDisplay");
            } else {
                $("propOutputConfigGroup").classList.remove("noDisplay");

                if (layer.outputConfig instanceof OutputConfig.Flatten) {
                    $("propOCFlattenRow").classList.remove("noDisplay");
                    $("propOCReshapeRow").classList.add("noDisplay");
                } else if (layer.outputConfig instanceof OutputConfig.Reshape) {
                    $("propOCFlattenRow").classList.add("noDisplay");
                    $("propOCReshapeRow").classList.remove("noDisplay");
                } else {
                    $("propOCFlattenRow", "propOCReshapeRow").forEach(ele=>ele.classList.add("noDisplay"));
                }
                
                // Assign validations on output manipulations.
                var shape = layer.getPreprocessedOperationShape();
                $("propOCFlatten").dataset.max = shape.length - 1;
                $("propOCReshape").dataset.shapeTotal = shape.filter(n=>n!="None" && n!= -1).reduce((a,b)=>a*b, 1);
                $("propOCReshape").dataset.restrictedShape = "None"
            }

            // If it's FinalLayer, show with the measurement that is using with.
            if (fullType.startsWith("FinalLayer")) {
                // TODO [Model Editing/Task Measurement]
                // Action: Switch to the measurement that this FinalLayer is undertaking.
                // Reasons: Currently only one measurement is implemented.
                $("propMes").innerText = App.getTxtFromLang(layer.measurement);
                $("propMes").dataset.lt = layer.measurement;

                // Give users to choose what the task is comparing with, by adding the available column config in this training source.
                var sources = layer.train.sources;
                var colSelBox = $("propPred"), selCount = 0; 
                [...colSelBox.children].forEach(ele=>ele.remove());
                sources.forEach((s,idx)=>{
                    s.colConfigs.forEach((cf, cfKey)=>{
                        var opt = colSelBox.children[selCount] || document.createElement("option");
                        opt.classList.add("lt");
                        colSelBox.appendChild(opt);
                        opt.dataset.sourceID = idx; opt.dataset.cfKey = cfKey;
                        cf.showNameOnEle(opt);
                        selCount ++;
                    });
                });

                // Set the selection value.
                $("propPred").selectedIndex = [...$("propPred").children].findIndex(ele=>Number(ele.dataset.sourceID) == layer.compareSourceID && ele.dataset.cfKey == layer.compareTensorIdx);
            }

            // Apply all prop values
            [...$("propWinLayer").getElementsByClassName("propVal")].filter(ele=>!isOrDescendentOf(ele,eop=>eop.classList.contains("noDisplay"))).forEach(ele=>this.applyPropVal(ele));
        }
    }

    /**
     * Activate layer configuration properties.   --- UPDATED (Dexter) 20180825
     */
    static activateLayerConfigs() {
        $("propTransRefWeight", "propHiddenSize", "propFilterWidth", "propDilation", "propPadding").forEach(ele=>ele.classList.remove("inactive"));
    }

    /**
     * Inactivate layer configuration properties.   --- UPDATED (Dexter) 20180825
     */
    static inactivateLayerConfigs() {
        $("propTransRefWeight", "propHiddenSize", "propFilterWidth", "propDilation", "propPadding").forEach(ele=>ele.classList.add("inactive"));
    }
    
    /**
     * The action fired after clicking a model node, to show the properties of the clicking node.   --- UPDATED (Dexter) 20180522
     * @param {PointerEvent} e - a PointerEVent from the pointer interaction with a model node
     */
    toShowPropFromNode(e) {
        // Get the current target element
        var ele = e.currentTarget;

        // Extract the information, and remember the editing element type and details.
        if (ele.dataset.type == "TrainSource") {
            this.train._editingSource = Number(ele.dataset.sourceID);
        } else if (ele.dataset.type == "Layer" || ele.dataset.type.startsWith("FinalLayer")) {
            this.train._editingLayer = ele.dataset.layerName;
        } else if (ele.dataset.type == "ColConfig") {
            this.train._editingColConfig = [Number(ele.dataset.sourceID), ele.dataset.dppKey];
        }

        // Show the properties of the editing node on the right panel.
        this.showProp(ele.dataset.type);
    }

    /**
     * Similar to .toShowPropFromNode() but more likely to be fired arbitrarily instead of pointer interaction with that node.   --- UPDATED (Dexter) 20180522
     * @param {String} type - The type of element to be changed
     * @param {String/Number} id1 - Source index for "TrainSource" or "ColConfig"; layer name for "Layer"
     * @param {Number} id2 - For "ColConfigs", it's the key for .colConfigs
     */
    toShowProp(type, id1, id2) {
        // Extract the information, and remember the editing element type and details.
        if (type == "TrainSource") {
            this.train._editingSource = id1;
        } else if (type == "Layer" || type.startsWith("FinalLayer")) {
            this.train._editingLayer = id1;
        } else if (type == "ColConfig") {
            this.train._editingColConfig = [id1, id2];
        }
        
        // Show the properties of the editing node on the right panel.
        this.showProp(type);
    }

    /**
     * For each single HTML element, apply the value onto the UI. This is typically used after .showProp() .   --- UPDATED (Dexter) 20180718
     * @param {Element} ele - HTML element of showing the value of a property
     */
    applyPropVal(ele) {
        // Get the property value from the Train object
        var toValue = this.train.getProp(ele.dataset.propType, ele.dataset.prop, ele.dataset.id);
        App.applyPropVal(ele, toValue);
    }

    /**
     * To change update the training parameters according to the user updates from the HTML elements.   --- UPDATED (Dexter) 20190210
     * @param {Element} ele - HTML element of a property is being edited
     */
    setPropVal(ele) {
        // Get the value of the user input, while the input has also made a copy into ele.dataset.val .
        var toValue = null;

        // For some special types of element, the value getting is a bit different.
        if (ele.localName == "select") toValue = ele.selectedOptions[0].dataset.val || null;
        else if (ele.classList.contains("checkbox")) toValue = (ele.dataset.val == "1");
        else if (ele.dataset.valType == "number") toValue = ele.value.trim() != "" ? Number(ele.value) : null;
        else if (ele.dataset.valType == "text") toValue = ele.value.trim();
        else if (ele.dataset.valType == "indexRange") toValue = ele.value.trim();
        else if (ele.dataset.valType == "shape") toValue = ele.value.trim().slice(1,-1).split(",").map(n=>{
                                                                let nT = n.trim();
                                                                return nT == "None" ? nT : Number(nT);
                                                            });
        else toValue = ele.value || ele.dataset.val;
        
        // If it's not checkbox, the dataset value will be updated to the new value. (Checkbox already updated.)
        if (!ele.classList.contains("checkbox"))
            if (ele.localName == "input") {
                if (ele.dataset.valType == "shape") {
                    ele.dataset.val = `[${toValue.join(", ")}]`;
                } else ele.dataset.val = (toValue == null || toValue == undefined)? "" : toValue;
            } else ele.dataset.val = toValue;
        
        // Set the value into the Train object.
        this.train.setProp(ele,ele.dataset.propType, ele.dataset.prop, toValue, ele.dataset.id);
    }

    /**
     * To clear the currently drawn model graph.   --- UPDATED (Dexter) 20180522
     */
    clear() {
        var graph = $(this.id);

        // Clear all elements within sourceRow, which represents every sources in Train.
        [...graph.getElementsByClassName("sourceRow")[0].children].forEach(ele=>ele.remove());

        // For other layers, we just need to remove the entire row.
        [...graph.getElementsByClassName("colConfigRow")].forEach(ele=>ele.remove());
        [...graph.getElementsByClassName("layerRow")].forEach(ele=>ele.remove());
        [...graph.getElementsByClassName("finalLayerRow")].forEach(ele=>ele.remove());

        // For edgeRow, we need to keep the first one, which must display for any project startups.
        [...graph.getElementsByClassName("edgeRow")].slice(1).forEach(ele=>ele.remove());

        // Clear model connection mode.
        this.endConnectionMode();
    }

    /**
     * To show the next action buttons at the end of the model graph.   --- UPDATED (Dexter) 20180522
     * @param {String} prevLayer - Previous Layer TYpe
     */
    showNextAction(prevLayer=this.latestLayerType) {
        // Map the previous layer type to the Next Action Type.
        var activeAction = (prevLayer == "TrainSource") ? ((this.train.sources.some(s=>["TableSource","CSVSource"].includes(s._type) && [...s.colConfigs.values()].every(cc=>!cc.getShape()))) ? "sourceActions"  : "layerActions"): (prevLayer == "Layer" || prevLayer == "ColConfig") ? "layerActions" : (prevLayer == "FinalLayer") ? "finalActions" : "";

        // Display the Next Action Type through toggling the "noDisplay" class.
        [...$(this.id).getElementsByClassName("nextActionBtns")].forEach(ele=>{
            if (ele.classList.contains(activeAction)) ele.classList.remove("noDisplay");
            else ele.classList.add("noDisplay");
        })
    }

    /**
     * To start the connection mode of this project.   --- UPDATED (Dexter) 20181221
     * @param {String} mode - Connection mode name: "connect" | "attach"
     * @param {Element} layerEle - An HTML element on displaying the layer node.
     */
    startConnectionMode(mode, layerEle) {
        // Clear previous connection mode and start a new one.
        if (this.connectionMode) this.endConnectionMode();
        this.connectionMode = mode;
        
        // Get the connectable nodes by first updating the connection graph view.
        var connectableNodes = this.updateConnectionMode(mode, layerEle);
        this.connectionNode = new ConnectingNodeInfo(connectableNodes[0]);
        this.connectionAffectingNodes = connectableNodes[1].filter(lpos=>lpos instanceof LayerProfile).map(lp => new ConnectingNodeInfo(lp));
        
        // Inactivate other model changes.
        $("cmLayerBef", "cmLayerAtt", "cmLayerAft", "cmLayerCrt", "cmLayerCnt", "cmLayerDel", "cmLayerDelLater", "cmInputDelLater",
            "cmFinLayBef", "cmFinLayAtt", "cmFinLayDel", "cmInputAft", "cmInputCrt", "cmInputCnt", "cmInputDelLater").forEach(ele=>ele.classList.add("inactive"));
        [...document.getElementsByClassName("nextAction")].forEach(ele=>ele.classList.add("inactive"));
    }
    
    /**
     * To start the connection mode of this project.   --- UPDATED (Dexter) 20181217
     * @param {String} mode - Connection mode name: "connect" | "attach"
     * @param {Element} layerEle - An HTML element on displaying the layer node.
     * @returns {(ModelNode.Layer.Config|DataPreprocessing.Node)[]} - A list of connectable nodes.
     */
    updateConnectionMode(mode, layerEle) {
        // Get the model editing build no.
        const buildNo = this.train._editingBuild;

        // Get the layer or source from the activating element.
        const layerOrSource = this.connectingLayerOrSource = (layerEle.dataset.layerName || [Number(layerEle.dataset.sourceID), layerEle.dataset.dppKey]);

        // Get the layer object, and assign to the affectting information.
        const isLayer = !(layerOrSource instanceof Array); 
        var editingNode = isLayer ? this.train.layerProfiles.get(layerOrSource) : this.train.getDataSource(...layerOrSource);

        // Display toolbar of connection mode.
        $(mode == "connect" ? "connectToBtns" : "attachOnBtns").classList.remove("noDisplay");
        editingNode.showNameOnEle($(mode == "connect" ? "toolboxCntLayerName" : "toolboxAttLayerName"));

        // Start connection mode, and show connection buttons.
        $("editGraph").classList.add("connectionMode");
        $("editProp").classList.add("connectionMode");
        editingNode.ele.classList.add(mode == "connect" ? "activatedOutput": "activatedReceive");
        var connectableNodes = editingNode.getConnectableNodes(mode);

        // If it's a layer, all connectable nodes will need to check if they have connections with the editiingNode.
        if (isLayer) {
            connectableNodes.forEach(lpos=>{
                lpos.ele.classList.remove("selectedReceive", "selectedOutput", "pendingReceive", "pendingOutput");
                if (lpos instanceof LayerProfile) {
                    lpos.ele.classList.add((editingNode[mode == "connect" ? "toNode" : "fromNode"][buildNo].includes(lpos) ? "selected" : "pending") + (mode == "connect" ? "Receive": "Output"));
                } else {
                    const sourceConfigInfo = lpos.getIDAndKey();
                    lpos.ele.classList.add((editingNode["fromSource"][buildNo].some(s=>s[0] == sourceConfigInfo[0] && s[1] == sourceConfigInfo[1]) ? "selected" : "pending") + "Output");
                }
            });
        }
        // Otherwise, all connectable nodes will need to check if they are using the ediitng source.
        else {
            connectableNodes.forEach(lp=>{
                lp.ele.classList.remove("selectedReceive", "selectedOutput", "pendingReceive", "pendingOutput");
                const sourceConfigInfo = editingNode.getIDAndKey();
                lp.ele.classList.add((lp["fromSource"][buildNo].some(s=>s[0] == sourceConfigInfo[0] && s[1] == sourceConfigInfo[1]) ? "selected" : "pending") + "Receive");
            })
        }
        
        return [editingNode, connectableNodes];
    }

    /**
     * To end the connection mode of this project.   --- UPDATED (Dexter) 20181028
     */
    endConnectionMode() {
        // Clear all connection mode styles.
        $(this.connectionMode == "connect" ? "connectToBtns" : "attachOnBtns").classList.add("noDisplay");
        [...document.getElementsByClassName("layer")].forEach(ln=>ln.classList.remove("activatedReceive", "activatedOutput", "selectedReceive", "selectedOutput", "pendingReceive", "pendingOutput"));
        $("editGraph").classList.remove("connectionMode");
        $("editProp").classList.remove("connectionMode");

        // Revert all temp info.
        this.connectionMode = false;
        this.connectingLayerOrSource = null;
        this.connectionNode = null;
        this.connectionAffectingNodes = null;

        // Reactivate other model changes.
        $("cmLayerBef", "cmLayerAtt", "cmLayerAft", "cmLayerCrt", "cmLayerCnt", "cmLayerDel", "cmLayerDelLater", 
            "cmFinLayBef", "cmFinLayAtt", "cmFinLayDel", "cmInputAft", "cmInputCrt", "cmInputCnt", "cmInputDelLater").forEach(ele=>ele.classList.remove("inactive"));
        [...document.getElementsByClassName("nextAction")].forEach(ele=>ele.classList.remove("inactive"));
    }

    /**
     * To end the connection mode of this project, and revert to a previous state.   --- UPDATED (Dexter) 20181124
     */
    revertConnections() {
        // Revert the connections.
        this.train.forceUpdateConnections(this.connectionNode, ...this.connectionAffectingNodes);

        // End connection mode.
        this.endConnectionMode();
    }

    /**
     * To update the layer connection on a certain layer node.   --- UPDATED (Dexter) 20181029
     * @param {Element} layerEle - An HTML element on displaying the layer node.
     */
    updateConnectionOn(layerEle) {
        const mode = this.connectionMode, source = this.connectingLayerOrSource, layerOrSource = (layerEle.dataset.layerName || [Number(layerEle.dataset.sourceID), layerEle.dataset.dppKey]);
        const connClass = mode == "connect" ? "Receive" : "Output";
        const selfClass = mode == "connect" ? "Output" : "Receive";
        if (layerEle.classList.contains("activated" + selfClass)) {
            this.endConnectionMode();
        } else{
            var success = false, action;
            if (layerEle.classList.contains("selected" + connClass)) {
                // Try to remove the layer connection.
                success = this.train.removeConnections(source, layerOrSource);
                action = "remove";
            } else if (layerEle.classList.contains("pending" + connClass)) {
                // Try to connect / attach the layer.
                action = "create";
                success = (mode == "connect") ? this.train.connectLayer(source, layerOrSource) : this.train.attachLayer(source, layerOrSource);
            }

            if (!success) {
                // Give error message on not successful deletion.
                AppNotification.show("conFailed", action + "ConFailedTxt", "cancel.svg");
            }

            // Resume the connection mode.
            this.updateConnectionMode(mode, (source instanceof Array ? this.train.getDataSource(...source) : this.train.layerProfiles.get(source)).ele);
        } 
    }

    /**
     * Project.now :  The current Project object as shown to the user.   --- UPDATED (Dexter) 20180522
     */
    static get now() { return this._now; } static set now(v) { this._now = v; }

    /**
     * To initiate Project-related items at the beginning after the app is loaded.   --- UPDATED (Dexter) 20190224
     */
    static initiate() {
        // Start Screen Buttons - Add "click" events for new project start up or open file picker for old project openning.
        $("startProject").addEventListener("click", Project.toStartNewProject, false);
        $("openProject").addEventListener("click", Project.toOpenProjectClick,false);

        // Show Start Screen First Time Guidence.
        if (!localStorage["visited"]) {
            // Remove display: none of the tutorial button.
            var tutorialBtn = $("tutorialBtn");
            tutorialBtn.classList.remove("noDisplay");

            // When the element is shown in DOM, make it visible.
            ContextMenu.untilShown(tutorialBtn).then(()=>{
                tutorialBtn.classList.remove("hide");
                localStorage["visited"] = true;
            });
        }

        /* TrainSource step by step setup */
        // The input holder for opening a .json project file - Add "change" event to detect a file is to be opened.
        $("openProjectBtn").addEventListener("change", Project.toOpenProject,false);

        // 1st Stage TrainSource Setup - whether to start with a TableSource (or CSVSource), or an ImageSource (CIFAR10 is the only supported type at the meantime).
        $("startFromTable").addEventListener("click", Project.startWithTable, false);
        $("startFromCIFAR10").addEventListener("click", Project.startWithImage, false);

        // For a TableSource, user can pick a file as a sample, and we have another input element for listening after the file is selected from the File Picker.
        $("startSourceLocationBtn").addEventListener("click", Project.selFileAsSource, false);
        $("startSourceLocationFile").addEventListener("change", Project.readStartFile.bind(this), false);

        // Setting up a spreadsheet for user pasting data
        var ss = new SpreadSheet("pasteSourceTable", 5, 3, true, true, true, true, undefined, false, undefined, true);
        ss.defaultActiveCellID = ss.selectedStart;
        ss.addChangeEvent(Project.updateStartData);

        // Other TableSource startup parameters - full source location, column counts; need to clear up as browser may remain the value after refreshes.
        $("startSourceLocation").addEventListener("change", Project.showLocWarn, false);
        $("startColCount").value = $("startSourceLocation").value = "";

        // Dynamically update the spreadsheet for whether header is included.
        $("startHasHeader").addEventListener("change", Project.updatePasteDataIncludeHeader, false);

        // Finishing the TrainSource setup.
        $("startEditGOBtn").addEventListener("click", Project.startFinish, false);

        // Image source startup parameters.
        $("startImageLocation").addEventListener("change", Project.showLocWarn, false);
        $("startImageLocation").addEventListener("change", Project.updateImageLocation, false);
        $("startImageData").addEventListener("change", Project.updateImageLocation, false);

        /* Context Menu Buttons */
        // 4 Context Menus allowed for right-clicking the train models, the background "editGraph" is setup here, while other nodes will be setup during element creation in drawTrain() .
        $("editGraph").addEventListener("contextmenu", Project.toShowCMBG, false);
        $("cmBGSaveImg").addEventListener("click", Project.toSaveAsPic, false);
        $("cmBGProp").addEventListener("click", Project.toShowPropFromCM, false);
        $("cmSourceProp").addEventListener("click", Project.toShowPropFromCM, false);
        $("cmInputProp").addEventListener("click", Project.toShowPropFromCM, false);
        $("cmLayerProp").addEventListener("click", Project.toShowPropFromCM, false);
        $("cmFinLayProp").addEventListener("click", Project.toShowPropFromCM, false);

        // Column Config Editing Buttons
        $("cmInputAft").addEventListener("click", Project.toInsertAfterSource, false);
        $("cmInputCrt").addEventListener("click", Project.toCreateAfterSource, false);
        $("cmInputCnt").addEventListener("click", Project.toConnectSource, false);

        // Layer Editing Buttons
        $("cmLayerBef").addEventListener("click", Project.toInsertBefore, false);
        $("cmLayerAtt").addEventListener("click", Project.toAttachOn, false);
        $("cmLayerAft").addEventListener("click", Project.toInsertAfter, false);
        $("cmLayerCrt").addEventListener("click", Project.toCreateAfter, false);
        $("cmLayerCnt").addEventListener("click", Project.toConnectTo, false);
        $("cmFinLayBef").addEventListener("click", Project.toInsertBefore, false);
        $("cmLayerDel").addEventListener("click", Project.toDelLayer, false);
        $("cmLayerDelLater").addEventListener("click", Project.toDelLaterLayers, false);
        $("cmFinLayDel").addEventListener("click", Project.toDelFinalLayer, false);

        /* Properties Pane */
        // Clicking the background will show Train and TrainProfile properties; other nodes will have event listerners added during .drawTrain() .
        $("editGraph").addEventListener("click", Project.toShowPropBG, false);
        
        // UX for displaying learning rate decay.
        $("propEpochPerLRSwitch").addEventListener("change", Project.toggleLearningRateDecay, false);
        $("propEpochPerLR").addEventListener("blur", Project.toggleLearningRateDecay, false);
        $("cancelValidation").addEventListener("click", Project.cancelLearningRateDecay, false);

        // For cross-validation, it's special that changing the validation type will toggle the display for further detail properties.
        $("propCrossValType").addEventListener("change", Project.toggleValidationInfo, false);

        // There is a helper for users to understand what is the detail of some configuration properties.
        [...document.getElementsByClassName("infoBtn")].forEach(ele=>ele.addEventListener("click", Project.showPropInfo, false));

        // There is a dialog for users to select columns.
        [...document.getElementsByClassName("colSelBtn")].forEach(ele=>ele.addEventListener("click", Project.showColSel, false));

        // Set up a spreadsheet for column selection use.
        var ss = new SpreadSheet("selColTable", 5, 3, true, true, false, true, undefined, false, [-1,-1], false);
        ss.startColSelectionMode();
        ss.addSelectionChangeEvent(Project.updateSelCol);

        // All values would not use the standardized InputBox.toValidateEle() event, but to use Project.toChangeVal() .
        [...$("editProp").getElementsByClassName("propVal")].forEach(ele=>{
            ele.removeEventListener("change", InputBox.toValidateEle, false)
            ele.addEventListener("change", Project.toChangeVal, false)
        });

        // Buttons for collapsing/expanding advanced proparty values.
        [...$("editProp").getElementsByClassName("propAdvance")].forEach(ele=>{
            ele.addEventListener("click", Project.toggleHiddenInfo, false)
        })

        // Add events for more options to appear according to chaning the output config.
        $("propOCMethod").addEventListener("change", Project.changeOutputConfig, false);

        // Add Circular / Transformation to ColConfigs.
        $("defCirCol").addEventListener("click", Project.toShowCirData, false);
        $("addTransCol").addEventListener("click", Project.toShowTransform, false);

        /* Graph-related issues */
        // Allow resizing the Project object.
        window.addEventListener("resize", Project.reize, false);

        // Top-left buttons
        $("editModelTopSave").addEventListener("click", Project.toExportAsJSON, false);
        $("editModelTopView").addEventListener("click", Project.toViewPython, false);

        // Top toolbox
        $("attFinish").addEventListener("click", Project.toEndConnectionMode, false);
        $("cntFinish").addEventListener("click", Project.toEndConnectionMode, false)
        $("attCancel").addEventListener("click", Project.toRevertConnections, false);
        $("cntCancel").addEventListener("click", Project.toRevertConnections, false);


        /* Next Acions and corresponding context flyout buttons */
        // Selecting columns from a TableSource.
        $("actionSelFeature").addEventListener("click", Project.toShowSelCol, false);
        
        // Appending a Layer.
        $("actionAppendLayer").addEventListener("click", Project.toAppendLayer, false);
        $("appLayerType").addEventListener("change", Project.changeAppendLayerType, false);
        $("appLayerRef").addEventListener("change", Project.changeAppendLayerRef, false);

        // Variable Configs.
        [...document.getElementsByClassName("varConfigBtn")].forEach(btn=>btn.addEventListener("click", Project.toEditVarConfig, false));
        $("propVCInitializer").addEventListener("change", Project.updateVarConfigInitOptions, false);
        
        // Appending a FinalLayer as the training task. Noted toggling the type of "Classifier" will toggle the display of No. of Classes option.
        $("actionSetTask").addEventListener("click", Project.toShowSetTask, false);
        $("addFinalConfirm").addEventListener("click", Project.toSetTask, false);
        $("finLayerType").addEventListener("change", Project.checkShowClass, false);

        // Saving the Project or Python program.
        $("actionSaveProj").addEventListener("click", Project.toExportAsJSON, false);
        $("actionSaveProg").addEventListener("click", Project.toRefreshAndSavePython, false);

        // Viewing the Python
        $("actionViewCodes").addEventListener("click", Project.toViewPython, false);
        $("viewPythonSave").addEventListener("click", Project.toSavePython, false);

        // Noted the event for $("finalEmbedNeuralSimplycode") is registered in App.initConfig() because it's toggling localStorage info (user settings).
    }

    /**
     * Start a project after clicking the button on the startScreen.   --- UPDATED (Dexter) 20180524
     */
    static toStartNewProject() {
        App.gotoPage("editModel");
        Project.startNewProject();
    }
    
    /**
     * To start a new blank model editing project.   --- UPDATED (Dexter) 20180524
     */
    static startNewProject() {
        // Display the input step-by-step screen instead of the model editing graph.
        $("editStart").classList.remove("noDisplay");
        $("editCore").classList.add("noDisplay");

        // Clear previous connection mode if needed.
        if (Project.now && Project.now.connectionMode) { Project.now.endConnectionMode(); }

        // Assign a new project to Project.now .
        var p = Project.now = new Project("editGraph");

        // Hide input source details at first.
        $("startSourceInfo").classList.add("hide");

        // Remove activations on selected start data source type.
        [...$("startSourceType").children].forEach(btn=>btn.classList.remove("activated"));

        // Clear the input table spreadsheet.
        var ss = SpreadSheet.get("pasteSourceTable");
        ss.setIncludeHeader(true);
        ss.clear();
        ss.display();

        // Restore all input elements to the default values in the step-by-step guide.
        InputBox.restoreDefault(...$("editStart").getElementsByTagName("input"), ...$("editStart").getElementsByTagName("select"));

        // Restore all checkbox elements to the default values in the step-by-step guide.
        [...$("editStart").getElementsByClassName("checkbox")].forEach(ele=>{
            // Toggle the classlist and .dataset.val to align the checkbox status with the default value.
            if (ele.dataset.default == "") {
                ele.classList.remove("ticked");
                ele.dataset.val = "";
            } else {
                ele.classList.add("ticked");
                ele.dataset.val = 1;
            }
        });

        // Restore the image folder directory.
        Project.updateImageLocation();
    }

    /**
     * Open a project by click the startScreen button.   --- UPDATED (Dexter) 20180524
     */
    static toOpenProjectClick() {
        // Reset the file input holder value, and click it.
        $("openProjectBtn").value = "";
        $("openProjectBtn").click()
    }

    /**
     * Actions fired when user has selected a file to open as a project.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - A change event fired from $("openProjectBtn")
     */
    static toOpenProject(e) {
        // Get the single file from the File Picker.
        var file = e.target.files[0];

        // Ensure the file is a .json file, and parse the JSON project file.
        if (file.name.endsWith(".json")) {
            Project.readJSONFile(file);
        } else {
            AppNotification.show("incorrectProjT", "incorrectProjC", "warning.svg");
        }
    }

    /**
     * Parse a JSON file and read the text to prepare it to be a Project.   --- UPDATED (Dexter) 20190222
     * @param {File} file - A File object as sent from the File Picker
     * @param {String} encoding - An encoding string, as specified in @https://encoding.spec.whatwg.org/#names-and-labels .
     * @param {Function<<Number>>} progressCallback - A callback with parameter as the reading progress in %.
     * @returns {Promise<String>} - Returns the text containing in the file.
     */
    static async readFileAsText(file, encoding = "utf8", progressCallback = null) {
        // If there is a file, create a FileReader object to read it.
        var fr = new FileReader();
        return new Promise((resolve,reject)=>{
            // Reject with error in case of any reading error.
            fr.addEventListener("error", e=>{
                reject("frReadingErrorC")
            });
            
            // Read the file, and auto-handle BOM; reject in case of any encoding error.
            fr.addEventListener("load", e=>{
                var txt = e.target.result;

                // Handles specially for utf-8-sig.
                if (encoding == "utf-8-sig") {
                    if (txt.startsWith("\uFEFF")) {
                        txt = txt.slice(1);
                    } else if (txt.startsWith("\u00EF\u00BB\u00BF")) {
                        txt = txt.slice(3);
                    }
                }

                // Check if there is error.
                if (txt.includes("�")) {
                    reject("frEncodingError");
                } 

                resolve(txt);
            });

            // Show the progress of the file reading.
            if (progressCallback != null) {
                fr.addEventListener("progress", e=>{
                    progressCallback(e.loaded / e.total * 100);
                });
            }

            // Request the file reader to read as text.
            fr.readAsText(file, encoding == "utf-8-sig" ? "utf8" : encoding);
        });
    }

    /**
     * Parse a JSON file and read the text to prepare it to be a Project.   --- UPDATED (Dexter) 20190222
     * @param {File} file - A File object as sent from the File Picker
     */
    static async readJSONFile(file) {
        // Go to the model editing page.
        App.gotoPage("editModel");

        // Show the properties button.
        $("propertiesBtn").classList.remove("noDisplay");

        // Show notification that the webpage is reading the file.
        var nf = AppNotification.show("projectReadingT", "", "waiting.svg", false);
        AppNotification.progressInit(nf);

        // Read the JSON File.
        try {
            var jsonFile = await Project.readFileAsText(file, undefined, perc=>AppNotification.progress(nf, perc));
        } catch(e) {
            // Display notification for finishing reading the project.
            if (classof(e) == "String") {
                AppNotification.update(nf, "projectFailed", e, "cancel.svg");
            } else {
                AppNotification.update(nf, "projectFailed", "", "cancel.svg");
            }
            return;
        }

        // Create a new project and assign to Project.now .
        Project.now = new Project("editGraph");

        // Parse the JSON text.
        var obj = JSON.parse(jsonFile);

        // Create a blank Train object.
        Project.now.train = new Train(Project.now, "train");

        // Parse the JSON from the Train object to recover the data structure.
        Project.now.train.parseJSON(obj);

        // Draw the training model and show the "Train" properties.
        Project.now.drawTrain();
        Project.now.showProp("Train");

        // Show the model editing environment instead of step-to-step data source setup.
        $("editStart").classList.add("noDisplay");
        $("editCore").classList.remove("noDisplay");

        // Display notification for finishing reading the project.
        AppNotification.update(nf, "projectSuccess", "","ok.svg");
    }

    /**
     * Show TableSource options after user selects starting with a table source.   --- UPDATED (Dexter) 20180524
     */
    static startWithTable() {
        // Toggle the Table/CIFAR source details.
        $("startAsTable").classList.remove("noDisplay");
        $("startAsCIFAR").classList.add("noDisplay");

        // Show the source details.
        $("startSourceInfo").classList.remove("hide");

        // Toggle the activation of the source type selection buttons.
        $("startFromTable").classList.add("activated");
        $("startFromCIFAR10").classList.remove("activated");
    }

    /**
     * Show ImageSource options after user selects starting with a image source.   --- UPDATED (Dexter) 20180524
     */
    static startWithImage() {
        // Toggle the Table/CIFAR source details.
        $("startAsTable").classList.add("noDisplay");
        $("startAsCIFAR").classList.remove("noDisplay");

        // Show the source details.
        $("startSourceInfo").classList.remove("hide");

        // Toggle the activation of the source type selection buttons.
        $("startFromTable").classList.remove("activated");
        $("startFromCIFAR10").classList.add("activated");
    }

    /** 
     * Show the File Picker if the user would like to use a file as a CSV Source.   --- UPDATED (Dexter) 20180524
     */
    static selFileAsSource() {
        // Reset the file input holder value, and click it.
        $("startSourceLocationFile").value = "";
        $("startSourceLocationFile").click();
    }

    /**
     * Update the data source details when the user changes the data in the spreadsheet.   --- UPDATED (Dexter) 20181221
     * @param {Event} e - A change event from the spreadsheet
     */
    static updateStartData(e) {
        if (e.value.length) {
            // If there is data, update the column count, and allow data embedding.
            $("startColCount").value = e.value[0].length;
            $("startEmbedDataSec").classList.remove("inactive");

            // By default, embed the data.
            if (!$("startEmbedData").dataset.val) {
                $("startEmbedData").click();
            }
        } else {
            // Clear data embedding.
            if ($("startEmbedData").dataset.val) {
                $("startEmbedData").click();
            }
            
            // Otherwise, disable data embedding.
            $("startEmbedDataSec").classList.add("inactive");
        }
    }

    /**
     * Actions fired on chaning the file of a Table source.   --- UPDATED (Dexter) 20190225
     * @param {Event} e - A change event for the input holder
     */
    static async readStartFile(e) {
        // Get the only file from the input holder.
        var file = e.target.files[0];
        
        // Ensure the file ends with CSV file, where it is the only supported file format currently.
        if (![".csv"].some(ext=>file.name.endsWith(ext))) {
            InputBox.showError($("startSourceLocationBtn"), "onlyCSVC", "warning.svg");
            return;
        }

        // Update the file name, and show warnning in case it is not a full path.
        $("startSourceLocation").value = file.name;
        Project.showLocWarn.bind($("startSourceLocation"))();
        
        // Setup file reader to read the incoming data file.
        var fr = new FileReader();
        fr.addEventListener("load", this.finishReadStartFile, false);
        fr.readAsText(file);
        // TODO [Project/Open Data File]
        // Action:  Add progress info during the reading of the file. 
        // Reason:  File reader progress event has not been implemented.

        // Show notification that the webpage is reading the file.
        var nf = AppNotification.show("readCSVProgress", "", "waiting.svg", false);
        AppNotification.progressInit(nf);

        // Read the import File.
        try {
            const encoding = $("startEncoding").selectedOptions[0].dataset.jsVal || $("startEncoding").selectedOptions[0].dataset.val;
            var csvText = await Project.readFileAsText(file, encoding, perc=>AppNotification.progress(nf, perc));
        } catch(e) {
            // Display notification for finishing reading the project.
            if (classof(e) == "String") {
                AppNotification.update(nf, "readCSVErrorT", e, "cancel.svg");
            } else {
                AppNotification.update(nf, "readCSVErrorT", "", "cancel.svg");
            }
            return;
        }

        // Parse the data asynchronously and set the data to the spreadsheet afterwards.
        try {
            var table = await CSV.readAsync(csvText);
        } catch(e) {
            // Display notification for finishing reading the project.
            if (classof(e) == "String") {
                AppNotification.update(nf, "readCSVErrorT", e, "cancel.svg");
            } else {
                AppNotification.update(nf, "readCSVErrorT", "", "cancel.svg");
            }
            return;
        }

        // Get the data source spreadsheet
        var ss = SpreadSheet.get("pasteSourceTable");
        ss.setData(table);

        // By default, embed the data.
        if (!$("startEmbedData").dataset.val) {
            $("startEmbedData").click();
        }

        // Display notification for finishing reading the project.
        AppNotification.update(nf, "readCSVFinishT", "","ok.svg");
    }

    /**
     * Show location warning after chaning the $("startSourceLocation"), give users info on files placing regarding full/relative data path.   --- UPDATED (Dexter) 20181209
     * @param {Event} e - A change event from the source location project starting page.
     */
    static showLocWarn(e)  {
        // Check if the path started from root, if not add a warning.
        if (!["/","\\"].includes(this.value[0]) && ![":/",":\\"].includes(this.value.slice(1,3))) {
            $(this.dataset.locWarn).classList.remove("noDisplay");
        } else {
            $(this.dataset.locWarn).classList.add("noDisplay");
        }
    }

    /**
     * Update the location list when there is an update on start image dataset and location.   --- UPDATED (Dexter) 20190126
     * @param {Event} e - A change event from the source location or dataset type.
     */
    static updateImageLocation(e) {
        // Validate the $("startImageLocation") path.
        if (InputBox.validate($("startImageLocation"))) {
            const pathTxt = $("startImageLocation").value.trim();
            var path = pathTxt.length ? pathTxt.split(/[\/\\]/g) : [];
            if (path.length > 0 && path.slice(-1)[0].trim().length == 0) path = path.slice(0,-1);

            // Draw the root path.
            var hasRoot = 0, codeLocation = path.length;
            if (codeLocation) {
                if (path[0].length == 0) {
                    hasRoot = 1; 
                } else if (path[0][1] == ":") {
                    path[0] = path[0][0];
                    hasRoot = 2;
                } else {
                    codeLocation = 0;
                }
            }

            // There is a subfolder for CIFAR-10 datasets.
            const imageType = $("startImageData").selectedOptions[0].dataset.val;
            
            // Calculate the item list of different folder: a list following [padding, name, folder:0 / file:1] syntax.
            const specificFileList = imageType == "cifar10" ? [[0,"cifar-10-batches-bin", 0],[1,"data_batch_1.bin", 1], [1, "data_batch_2.bin", 1], [1,"data_batch_3.bin", 1], [1, "data_batch_4.bin", 1], [1,"data_batch_5.bin", 1], [1,"data_batch_6.bin", 1],[1,"test_batch.bin", 1]] 
                                    : imageType == "mnist" ? [[0,"train-images.idx3-ubyte", 1], [0,"train-labels.idx1-ubyte", 1], [0,"t10k-images.idx3-ubyte", 1], [0,"t10k-labels.idx1-ubyte", 1]] : [];
            const extraLen = specificFileList.length;
            specificFileList.forEach(ele=>ele[0] += path.length);
            const allFolders = [...path.map((p,idx)=>[idx, p, 0]), ...specificFileList];

            // Create a path item.
            var pathItem = document.createElement("div");
            pathItem.classList.add("propListItem");
            var icon = document.createElement("div");
            icon.classList.add("iconSVG");
            pathItem.appendChild(icon);
            var pathName = document.createElement("div");
            pathName.classList.add("pathName");
            pathItem.appendChild(pathName);

            // Create elements in the path list.
            App.controlChildrenCount($("propFolderLocations"), path.length + extraLen + (hasRoot ? 0 : 1), pathItem, "propListItem", undefined, ele=>{
                var pathNameEle = ele.getElementsByClassName("pathName")[0];
                pathNameEle.classList.remove("lt");
                delete pathNameEle.dataset.lt;
                delete pathNameEle.dataset.ltTemp;
            });

            // Loop the folders and files and add the info into the list item.
            var listItemIdx = 0, listItems = [...$("propFolderLocations").getElementsByClassName("propListItem")];
            var paddingEle = document.createElement("div");
            paddingEle.classList.add("dirPad");

            var currentPath = [];
            allFolders.forEach((itemInfo, idx)=>{
                let listItem = listItems[listItemIdx];

                // Clear Icon
                listItem.getElementsByClassName("iconSVG")[0].innerHTML = "";

                // Add padding of directory.
                App.controlChildrenCount(listItem, itemInfo[0], paddingEle, "dirPad", undefined);

                // Add the code file.
                if (idx == codeLocation && !hasRoot) {
                    // Assign the list item content.
                    let nameItem = listItem.getElementsByClassName("pathName")[0];
                    nameItem.classList.add("lt");
                    nameItem.dataset.lt = "pyCodeLoc";
                    App.applyEleLang(nameItem);
                    
                    var iconImg = document.createElement("img");
                    iconImg.src = App.getImageLocation() + "code.svg";
                    listItem.getElementsByClassName("iconSVG")[0].append(iconImg);

                    // Increment the list item index.
                    listItemIdx ++; listItem = listItems[listItemIdx];

                    // Add padding of directory.
                    App.controlChildrenCount(listItem, itemInfo[0], paddingEle, "dirPad", undefined);
                }

                // Clear Icon
                listItem.getElementsByClassName("iconSVG")[0].innerHTML = "";

                // Handle if it's the root. 
                if (idx == 0 && hasRoot) {
                    // Assign the list item content.
                    let nameItem = listItem.getElementsByClassName("pathName")[0];
                    nameItem.classList.add("lt");
                    if (hasRoot == 1) {
                        nameItem.dataset.lt = "rootFolder";
                        delete nameItem.dataset.ltTemp;
                    } else {
                        nameItem.dataset.lt = "diskFolder";
                        nameItem.dataset.ltTemp = "$$$ " + itemInfo[1];
                    }
                    App.applyEleLang(nameItem);

                    // Set the icon.
                    var iconImg = document.createElement("img");
                    iconImg.src = App.getImageLocation() + "PCRoot.svg";
                    listItem.getElementsByClassName("iconSVG")[0].append(iconImg);

                    // Determine the actual path.
                    currentPath[itemInfo[0]] = hasRoot == 2 ? ("/"+itemInfo[1]+":") : "";
                }
                
                // Handle for normal cases.
                else {
                    listItem.getElementsByClassName("pathName")[0].innerText = itemInfo[1];
                    var iconImg = document.createElement("img");
                    iconImg.src = App.getImageLocation() + (itemInfo[2] == 0 ? "folder.svg" : "image.svg");
                    listItem.getElementsByClassName("iconSVG")[0].append(iconImg);
                    currentPath[itemInfo[0]] = itemInfo[1];
                }

                listItemIdx ++; 
            });
        }
    }

    /**
     * Update the paste spreadsheet for whether to include header based on changing the requirement.   --- UPDATED (Dexter) 20181208
     * @param {Event} e - A change event from the $("pasteSourceTable") checkbox.
     */
    static updatePasteDataIncludeHeader(e) {
        SpreadSheet.get("pasteSourceTable").setIncludeHeader(this.dataset.val == "1", true);
    }

    /**
     * Show the properties of batckground on the Properties Pane.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - An Event, typcially click event from the model editing background
     */
    static toShowPropBG(e) {
        // Ensure the event is not fired from the model elements but only the background.
        if (!e || !isOrDescendentOf(e.target, (ele)=>ele.classList.contains("layer") || ele.localName == "button"))
            Project.now.showProp("Train");
    }

    /**
     * Show the context menu of the background.   --- UPDATED (Dexter) 20180630
     * @param {PointerEvent} e - A context menu event on the model editing background.
     */
    static toShowCMBG(e) {
        if (!isOrDescendentOf(e.target, ele=>ele.classList.contains("nextAction"))) {
            e.preventDefault(); e.stopPropagation();

            // Show the context menu and pass relevant PointerEvent information
            ContextMenu.show("cmBG", true, {x: e.pageX, y: e.pageY, pointerType: e.pointerType}, false);
        }
    }
    
    /**
     * TODO [Model Editing/Graph Exporting]
     * Action:  Show the flyout on selecting which image type and what resolution the graph is exporting to. 
     * Reason:  Model Exporting as Image has not been implemented.
     */
    static toSaveAsPic(e) {
    }

    /**
     * Show the properties of batckground on the Properties Pane as clicked from "Properties" in a context menu.   --- UPDATED (Dexter) 201812214
     * @param {Event} e - An Event, typcially click event from the properties button in a context menu
     */
    static toShowPropFromCM(e) {
        // Close all context menus
        ContextMenu.manualCloseAll();

        // Find out the current editing element throught the context menu saved data, and request for properties display based on the info.
        var dataset = this.parentElement.parentElement.parentElement.dataset;
        Project.now.toShowProp(dataset.actionId, dataset.id1, dataset.id2);

        // Toggle properties pane if needed.
        if ($("editProp").classList.contains("collapsed")) $("propertiesBtn").click();
    }

    /**
     * Show the context menu of a data source.   --- UPDATED (Dexter) 20181025
     * @param {Event} e - An Event, typcially click event from one data source
     */
    static toShowCMSource(e) {
        e.preventDefault(); e.stopPropagation();

        // Set relevant identifiable information onto the context menu.
        $("cmSource").dataset.actionId = this.dataset.type;
        $("cmSource").dataset.id1 = this.dataset.sourceID;

        // Show the context menu and pass relevant PointerEvent information/
        ContextMenu.show("cmSource", true, {x: e.pageX, y: e.pageY, pointerType: e.pointerType}, false);
    }

    /**
     * Show the context menu of a data source column config.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - An Event, typcially click event from one data source
     */
    static toShowCMInput(e) {
        e.preventDefault(); e.stopPropagation();

        // Set relevant identifiable information onto the context menu.
        $("cmInput").dataset.actionId = this.dataset.type;
        $("cmInput").dataset.id1 = this.dataset.sourceID;
        $("cmInput").dataset.id2 = this.dataset.dppKey;
        $("cmInput").dataset.displayName = this.getElementsByClassName("layerName")[0].innerText;

        // Show the context menu and pass relevant PointerEvent information/
        ContextMenu.show("cmInput", true, {x: e.pageX, y: e.pageY, pointerType: e.pointerType}, false);
    }

    /**
     * Show the context menu of a layer.   --- UPDATED (Dexter) 20180630
     * @param {Event} e - An Event, typcially click event from one layerNode
     */
    static toShowCMLayer(e) {
        e.preventDefault(); e.stopPropagation();

        // TODO [Model Editing/Predictions]
        // Action:  Add prediction data to the Python codes, and call predict() in NeuralSimplycode. 
        // Reason:  Data predictions has not been implemented.
        
        // Set relevant identifiable information onto the context menu.
        $("cmLayer").dataset.actionId = this.dataset.type;
        $("cmLayer").dataset.id1 = this.dataset.layerName;
        $("cmLayer").dataset.layerName = this.getElementsByClassName("layerName")[0].innerText;

        // Show the context menu and pass relevant PointerEvent information/
        ContextMenu.show("cmLayer", true, {x: e.pageX, y: e.pageY, pointerType: e.pointerType}, false);
    }
    
    /**
     * Show the context menu of a final layer.   --- UPDATED (Dexter) 20180630
     * @param {Event} e - An Event, typcially click event from one layerNode
     */
    static toShowCMFinalLayer(e) {
        e.preventDefault(); e.stopPropagation();

        // TODO [Model Editing/Predictions]
        // Action:  Add prediction data to the Python codes, and call predict() in NeuralSimplycode. 
        // Reason:  Data predictions has not been implemented.
        
        // Set relevant identifiable information onto the context menu.
        $("cmFinLay").dataset.actionId = this.dataset.type;
        $("cmFinLay").dataset.id1 = this.dataset.layerName;
        $("cmFinLay").dataset.layerName = this.getElementsByClassName("layerName")[0].innerText;

        // Show the context menu and pass relevant PointerEvent information/
        ContextMenu.show("cmFinLay", true, {x: e.pageX, y: e.pageY, pointerType: e.pointerType}, false);
    }

    /**
     * Actions fired after user clicking $("startEditGOBtn") , and prepare necessary setup from the given data source info.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - An Event, typcially click event from $("startEditGOBtn")
     */
    static startFinish(e) {
        // Depending on which type of data source, validate on the input elements and start a model editing graph.
        if ($("startAsCIFAR").classList.contains("noDisplay")) {
            if (InputBox.validateAll($("startColCount"), [$("startSourceLocation"), $("startEmbedData")])) {
                Project.startGraph("TableSource");
            } else {
                AppNotification.show("incorrectStartT", "incorrectStartC", "warning.svg");
            }
        } else {
            if (InputBox.validateAll($("startImageLocation"))) {
                Project.startGraph("ImageSource");
            } else {
                AppNotification.show("incorrectStartT", "incorrectStartC", "warning.svg");
            }
        }
    }

    /**
     * Start a model editing graph from a given type of data source.   --- UPDATED (Dexter) 20190130
     * @param {String} source - A source type whether it is a "TableSource" or "ImageSource"
     */
    static startGraph(source) {
        // Show the properties button.
        $("propertiesBtn").classList.remove("noDisplay");

        // Display the model editing environment instead of the data source setup details.
        $("editStart").classList.add("noDisplay");
        $("editCore").classList.remove("noDisplay");

        // Prepare the data source to create Train object later on.
        var dataSource;
        if (source == "TableSource") {
            // If it's a TableSource, check if it has heading and whether it is a CSV file.
            var hasHeading = $("startHasHeader").dataset.val == "1" ? true : false;
            var toCSV = $("startSourceLocation").value;

            // Create the data source based on the given info.
            dataSource = toCSV ? new CSVSource(toCSV, Number($("startColCount").value), $("startEncoding").selectedOptions[0].dataset.val, hasHeading) : new TableSource(SpreadSheet.get("pasteSourceTable").table, undefined, hasHeading);

            // Create the table preview info
            new SpreadSheet("dataSourcePreview", 10, 3, hasHeading, false, true, true, null, false);
            new SpreadSheet("colDataPreview", 10, 3, hasHeading, false, true, true, null, false);

            // If it is a CSVSource and allows data embedding, assign the spreadsheet table into the ._oriData property.
            if (toCSV && $("startEmbedData").dataset.val == "1") {
                dataSource._oriData = SpreadSheet.get("pasteSourceTable").table;
            }
        } else if (source == "ImageSource") {
            // If it's an ImageSource, simply assign the folder location to create the ImageSource.
            dataSource = new ImageSource($("startImageData").selectedOptions[0].dataset.val, $("startImageLocation").value)
        }

        // Create a new Train object based on the source and assign to Project.now
        Project.now.train = new Train(Project.now, "train", dataSource, "D:/tmp/", undefined, undefined, 100, undefined, -1, -1, undefined, undefined, 1, undefined, 15);

        // Draw the training model and show the properties of the training. 
        Project.now.drawTrain();
        Project.now.showProp("Train");
    }

    /**
     * Called when a window.resize takes place, ref: App.resize() .   --- UPDATED (Dexter) 201902222
     */
    static resize(e) {
        // If there is an editing project, resize it and try to refresh the graph visually.
        if (Project.now.train) {
            Project.now.resize();
        }
    }

    /**
     * Actions fired after the user has changed for a property value.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - A change event from a property value element
     */
    static toChangeVal(e) {
        // If ther is a project, validate the element, then try to set the value into the current training.
        if (Project.now) {
            if (InputBox.validate(this)) {
                Project.now.setPropVal(this);
            }
        }
    }

    /**
     * Toggle the display of detail learning rate decay configurations.   --- UPDATED (Dexter) 20180718
     * @param {Event} e - A change event typically from changing the $("propEpochPerLRSwitch") selection or $("propEpochPerLR") type changes.
     */
    static toggleLearningRateDecay(e) {
        if (this.id == "propEpochPerLRSwitch" && this.selectedOptions[0].dataset.val == "Y") {
            $("propEpochPerLRSwitch").classList.add("noDisplay");
            $("propLRDecayRow").classList.remove("noDisplay");
            $("propEpochPerLR").classList.remove("noDisplay");
            $("cancelValidation").classList.remove("noDisplay");
            $("propEpochPerLR").focus();
            $("propLRDecay").value = 0.5;
            Project.toChangeVal.bind($("propLRDecay"))();
        } else if (this.id == "propEpochPerLR" && this.value.trim() == "") {
            Project.cancelLearningRateDecay();
        }
    }

    /**
     * Cancel the learning rate decay configurations.   --- UPDATED (Dexter) 20180718
     * @param {Event} e - A click event typically from changing the $("cancelValidation") .
     */
    static cancelLearningRateDecay(e) {
        $("propEpochPerLR").value = ""; $("propLRDecay").value = "";
        Project.toChangeVal.bind($("propEpochPerLR"))();
        Project.toChangeVal.bind($("propLRDecay"))();
        $("propEpochPerLRSwitch").classList.remove("noDisplay");
        $("propLRDecayRow").classList.add("noDisplay");
        $("propEpochPerLR").classList.add("noDisplay");
        $("cancelValidation").classList.add("noDisplay");
        $("propEpochPerLRSwitch").selectedIndex = 0;
    }

    /**
     * Toggle the display of detail validation configuration depending on the changes on the validation type.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - A change event typically from changing the $("propCrossValType") selection
     */
    static toggleValidationInfo(e) {
        if (this.selectedOptions[0].dataset.val == "None") {
            // If there is no validation needed, don't show the properties for validation proportion or validationrounds.
            $("propValPropRow").classList.add("noDisplay");
            $("propValRoundRow").classList.add("noDisplay");
        } else {
            // Otherwise, display the validation details.
            $("propValPropRow").classList.remove("noDisplay");
            $("propValRoundRow").classList.remove("noDisplay");
        }
    }

    /**
     * Show a helper for users to understand what is meaning of a property.   --- UPDATED (Dexter) 20180718
     * @param {Event} e - A click event typically from clicking a helper button.
     */
    static showPropInfo(e) {
        $("propInfo").getElementsByClassName("propInfoTxt")[0].innerHTML = App.getTxtFromLang(this.dataset.for)
        ContextMenu.show("propInfo", false, {x: e.pageX, y: e.pageY});
    }

    /**
     * Show the column selection flyout from the next action button.   --- UPDATED (Dexter) 20181205
     * @param {Event} e - A click event typically from clicking $("actionSelFeature") button
     */
    static toShowSelCol(e) {
        // Remember the editing project id.
        $("selFeatures").dataset.editingID = Project.now.id;

        // If there is data source, proceed with follow-up actions.
        if (Project.now.train.sources.length == 1) {
            // Restore the defaults of the flyout.
            InputBox.restoreDefault($("ctxInputCols"), $("ctxTargetCols"));

            // Determin the min and max for the column selection.
            $("ctxInputCols").dataset.selLen = $("ctxTargetCols").dataset.selLen = Number(Project.now.train.sources[0]._oriShape[1]);

            // Display the flyout with the relevant PointerEvent info.
            ActionDialog.show("selFeatures", undefined, undefined, {x: e.pageX, y: e.pageY}, e=>{
                return InputBox.validateAll($("ctxInputCols"), $("ctxTargetCols"));
            }).then(e=>{
                // If it's fine, set the values into the Project.now.train to make the column selection effective.
                Project.now.train.setProp($("ctxInputCols"),"TrainSource", "addColConfig", $("ctxInputCols").value, 0);
                if ($("ctxTargetCols").value) 
                    Project.now.train.setProp($("ctxTargetCols"),"TrainSource", "addColConfig", $("ctxTargetCols").value, 0);

                // Close all the flyouts.
                ContextMenu.manualCloseAll();
            }, e=>{});
        }
    }

    /**
     * Show the dialog of column selection.   --- UPDATED (Dexter) 20190131
     * @param {Event} e - A click event.
     */
    static showColSel(e) {
        // Collect the effective source object
        var target = Project.now.train.sources[Project.now.train._editingSource];

        // Display the flyout with the relevant PointerEvent info.
        const msg = App.getTxtFromLang("toTickCol") + App.getTxtFromLang(this.dataset.forProp);
        var ss = SpreadSheet.get("selColTable");
        ss.setIncludeHeader(target.hasHeading, false); 
        if (!target.hasHeading) ss.resetSize(target.getHeader().length);
        ss.setData(this.dataset.tableType == "source" ? target.getAllTable() : target.getColTable(Project.now.train._editingColConfig[1], this.dataset.preprocessingStep ? DataPreprocessing.ColumnsNode.StepEnum[this.dataset.preprocessingStep] : undefined));
        const currentSelVal = $(this.dataset.forId).value;
        ss.setColSelection(currentSelVal);

        // Allow the popup window to resize in case more data in the spreadsheet has to be revealed.
        $("selColumns").addEventListener("showend", ()=>{ ss.addChangeEvent(Project.updateSelColPos); ss.display(true); }, {once: true, capture: false});
        $("selColumns").addEventListener("closestart", ()=>{ ss.removeChangeEvent(Project.updateSelColPos) }, {once: true, capture: false});

        // Show the select column dialog.
        ActionDialog.show("selColumns", undefined, msg, {x: e.pageX, y: e.pageY, stack: true}, undefined).then(e=>{
            $(this.dataset.forId).value = ss.getColSelectedRange();
            $(this.dataset.forId).dispatchEvent(new Event("change"));
        }, e=>{});
    }

    /**
     * Fires when the column selection is updated in the column selection flyout.   --- UPDATED (Dexter) 20181210
     * @param {Object} e - An simulated event when column selection is updated.
     */
    static updateSelCol(e) {
        $("selColRangeStr").innerHTML = e.colSelRange;
    }

    /**
     * Update the select column panel position in case of any changes.   --- UPDATED (Dexter) 20181208
     * @param {Event} e - A click event, typically from buttons affecting the data appearance of the spreadsheet.
     */
    static updateSelColPos(e) {
        ContextMenu.updatePos("selColumns");
    }

    /**
     * Update the properties options when changing the output manipulation method.   --- UPDATED (Dexter) 20181208
     * @param {Event} e - A click event typically from clicking the `$("propOCMethod")` button
     */
    static changeOutputConfig(e) {
        const selVal = this.selectedOptions[0].dataset.val;
        if (selVal == "Default") {
            $("propOCFlattenRow", "propOCReshapeRow").forEach(ele=>ele.classList.add("noDisplay"));
        } else if (selVal == "Flatten") {
            $("propOCFlattenRow").classList.remove("noDisplay");
            $("propOCReshapeRow").classList.add("noDisplay");
            $("propOCFlatten").value = "1";
        } else if (selVal == "Reshape") {
            $("propOCFlattenRow").classList.add("noDisplay");
            $("propOCReshapeRow").classList.remove("noDisplay");
            $("propOCReshape").value = "[None,-1]";
        }
    }

    /**
     * Show the adding circular data definition flyout from Properties Pane.   --- UPDATED (Dexter) 20181211
     * @param {Event} e - A click event typically from clicking `$("defCirCol")` button
     */
    static toShowCirData(e) {
        // Remember the editing project id.
        $("defCirColCtx").dataset.editingID = Project.now.id;

        // Proceed in case there is data source.
        if (Project.now.train.sources.length == 1) {
            // Get the column config
            var editingColConfig = Project.now.train._editingColConfig;
            var colConfig = Project.now.train.getDataSource(...editingColConfig);

            // Define the column selection range for validation use
            var lastDim = colConfig.getShape()[1];
            $("defCirColSelCols").dataset.selLen = lastDim;

            // Restore the defaults of the flyout.
            InputBox.restoreDefault($("defCirColSelCols"), $("defCirColMin"), $("defCirColMax"));

            // Show the flyout with necessary PointerEvents info
            ActionDialog.show("defCirColCtx", undefined, undefined, {x: e.pageX, y: e.pageY}, e=>{
                // Validate the input boxes of the circular definition adding flyout.
                if (!InputBox.validateAll($("defCirColSelCols"), $("defCirColMin"), $("defCirColMax"))) return false;

                // Get the information, and pass to the TrainSource object to set the circular output details.
                var toUpdate = Project.now.train.sources[editingColConfig[0]].setCircularOutput(editingColConfig[1], $("defCirColSelCols").value, Number($("defCirColMin").value), Number($("defCirColMax").value));

                // If the update isn't successful, a failure prompt will appear.
                if (toUpdate.action !== true) InputBox.showError($("defCirColConfirm"), toUpdate.msg, false, undefined, ContextMenu.step()+1);

                return toUpdate.action === true;
            }).then(e=>{
                // If it's fine, update the transformation list, and close all flyouts.
                Project.updateCircularList(editingColConfig[0], editingColConfig[1]);
                ContextMenu.manualCloseAll();
            }, e=>{});
        }
    }

    /**
     * Show the adding data transforamtion flyout from the Properties Pane.   --- UPDATED (Dexter) 20181211
     * @param {Event} e - A click event typically from clicking `$("addTransCol")` button
     */
    static toShowTransform(e) {
        // Remember the editing project id.
        $("addTxmCtx").dataset.editingID = Project.now.id;
        
        // Proceed in case there is data source.
        if (Project.now.train.sources.length == 1) {
            // Get the column config
            var editingColConfig = Project.now.train._editingColConfig;
            var colConfig = Project.now.train.getDataSource(...editingColConfig);

            // Define the column selection range for validation use
            var lastDim = colConfig.getShape()[1];
            $("defTxmSelCols").dataset.selLen = lastDim;

            // Restore the defaults of the flyout.
            InputBox.restoreDefault($("defTxmSelCols"), $("defTransSel"), $("defCirColMax"));

            // Show the flyout with necessary PointerEvents info
            ActionDialog.show("addTxmCtx", undefined, undefined, {x: e.pageX, y: e.pageY}, e=>{
                // Check basic input validation.
                if (!InputBox.validateAll($("defTxmSelCols"))) return false;
                
                // Get the information, and pass to the TrainSource object to set the transformation details
                var toUpdate = Project.now.train.sources[editingColConfig[0]].setTransform(editingColConfig[1], $("defTxmSelCols").value, $("defTransSel").selectedOptions[0].dataset.val);

                // If the update isn't successful, a failure prompt will appear
                if (!toUpdate)  InputBox.showError(this, toUpdate.msg, false, undefined, ContextMenu.step()+1);

                return toUpdate;
            }).then(e=>{
                // If it's fine, update the transformation list, and close all flyouts.
                Project.updateTransformList(editingColConfig[0], editingColConfig[1]);
                ContextMenu.manualCloseAll();
            }, e=>{});
        }
    }

    /**
     * Update the circular data definition list on the Properties Pane.   --- UPDATED (Dexter) 20190321
     * @param {Number} sourceIdx - The index of the TrainSource to request
     * @param {String} dppKey - The column key of the ColConfig in the TrainSource
     * @param {Boolean} updateImmediately - Update the list of data preview immediately.
     */
    static updateCircularList(sourceIdx, dppKey, updateImmediately = true) {
        // Get the elements and the column config.
        var cList = $("propCirList");
        var allCItems = cList.getElementsByClassName("propListItem");
        var source = Project.now.train.sources[sourceIdx];
        var colConfig = source.colConfigs.get(dppKey);

        // Remove unnecessary HTML elements listing circular data definition.
        if (allCItems.length > colConfig.circular.length+1) {
            [...allCItems].slice(colConfig.circular.length+1).forEach(ele=>ele.remove());
        }

        // For each .circular item, show the definition info in an ordered list.
        colConfig.circular.forEach((ci,idx)=>{
            // Ensure an HTML element is available for a definition.
            var show = allCItems[idx+1];
            if (!show) {
                show = $("colConfigCirTemp").cloneNode(true);
                App.getTemplateImages(show);
                show.removeAttribute("id");
                show.getElementsByClassName("rmv")[0].addEventListener("click", Project.toRemoveCircularItem, false);
                cList.insertBefore(show, cList.children[cList.children.length-1]);
            }

            // Update the index of this circular info on the HTML element.
            show.dataset.idx = idx;

            // Depending whether data is available, the displayed info is different.
            if (source._hasHeading && source._oriData) {
                // Get the header names that is within the circular data definition.
                var allNames = source.getHeader(dppKey, DataPreprocessing.ColumnsNode.StepEnum.Input).filter((v,i)=>ci.colIdx.includes(i));

                // Display the circular info as a range, followed by the header names.
                show.getElementsByClassName("cirCol")[0].innerText = `[${ci.min}, ${ci.max}) -  ${allNames.join(", ")}`;
            } else {
                // Display the circular info as a range, followed by the selCol values.
                show.getElementsByClassName("cirCol")[0].innerText = `[${ci.min}, ${ci.max}) -  ${ci.cols}`;
            }
        });

        // Update data preview if needed.
        if (source._oriData && updateImmediately) {
            SpreadSheet.get("colDataPreview").setData(source.getColTable(dppKey));
        }
    }

    /**
     * Delete a circular definition as requeseted from the user.   --- UPDATED (Dexter) 20190124
     * @param {Event} e - A click event on the deletion of a circular definition.
     */
    static toRemoveCircularItem(e) {
        // Remove the circular item in the TrainSource
        var editingColConfig = Project.now.train._editingColConfig;
        var source = Project.now.train.sources[editingColConfig[0]];
        var dppKey = editingColConfig[1];
        source.removeCircularItem(editingColConfig[1], Number(this.parentElement.dataset.idx));
        
        // Decrement the index of all next transform items
        var nextTI = this.parentElement.nextElementSibling;
        while (nextTI && nextTI.dataset.idx) {
            nextTI.dataset.idx = Number(nextTI.dataset.idx) - 1;
            nextTI = nextTI.nextElementSibling;
        }

        // Remove the row on the listed circular items
        this.parentElement.remove();

        // Update data preview if needed.
        if (source._oriData) {
            SpreadSheet.get("colDataPreview").setData(source.getColTable(dppKey));
        }
    }

    /**
     * Update the transformation list on the Properties Pane.   --- UPDATED (Dexter) 20190321
     * @param {Number} sourceIdx - The index of the TrainSource to request
     * @param {String} dppKey - The column key of the ColConfig in the TrainSource
     * @param {Boolean} updateImmediately - Update the list of data preview immediately.
     */
    static updateTransformList(sourceIdx, dppKey, updateImmediately = true) {
        // Get the elements and the column config.
        var tList = $("propTranxList");
        var allTItems = tList.getElementsByClassName("propListItem");
        var source = Project.now.train.sources[sourceIdx];
        var colConfig = source.colConfigs.get(dppKey);

        // Remove unnecessary HTML elements listing transformation functions.
        if (allTItems.length > colConfig.transformations.length+1) {
            [...allTItems].slice(colConfig.transformations.length+1).forEach(ele=>ele.remove());
        }

        // For each ColConfig.transformations item, show the transformation info in an ordered list.
        colConfig.transformations.forEach((ti,idx)=>{
            // Ensure an HTML element is available for a transformation.
            var show = allTItems[idx+1];
            if (!show) {
                show = $("colConfigTxTemp").cloneNode(true);
                App.getTemplateImages(show);
                show.removeAttribute("id");
                show.getElementsByClassName("rmv")[0].addEventListener("click", Project.toRemoveTransformItem, false);
                tList.insertBefore(show, tList.children[tList.children.length-1]);
            }

            // Update the index of this transform info on the HTML element.
            show.dataset.idx = idx;
            show.getElementsByClassName("txType")[0].innerText = App.getTxtFromLang(ti.lt)+": ";
            show.getElementsByClassName("txType")[0].dataset.lt = ti.lt;

            // Depending whether data is available, the displayed info is different.
            if (source._hasHeading && source._oriData) {
                // Get the header names that is within the transformation actions.
                var allNames = source.getHeader(dppKey, DataPreprocessing.ColumnsNode.StepEnum.Input).filter((v,i)=>ti.colIdx.includes(i));

                // Display the transformation info as a range, followed by the header names.
                show.getElementsByClassName("txCols")[0].innerText = `${allNames.join(", ")}`;
            } else {
                // Display the transformation info as a range, followed by the selCol values.
                show.getElementsByClassName("txCols")[0].innerText = `[ ${ti.cols} ]`;
            }
        });

        // Update data preview if needed.
        if (source._oriData && updateImmediately) {
            SpreadSheet.get("colDataPreview").setData(source.getColTable(dppKey));
        }
    }

    /**
     * Delete a transformation as requeseted from the user.   --- UPDATED (Dexter) 20190124
     * @param {Event} e - A click event on the deletion of a transformation action.
     */
    static toRemoveTransformItem(e) {
        // Remove the transform item in the TrainSource
        var editingColConfig = Project.now.train._editingColConfig;
        var source = Project.now.train.sources[editingColConfig[0]];
        var dppKey = editingColConfig[1];
        source.removeTransformItem(dppKey, Number(this.parentElement.dataset.idx));

        // Decrement the index of all next transform items
        var nextTI = this.parentElement.nextElementSibling;
        while (nextTI && nextTI.dataset.idx) {
            nextTI.dataset.idx = Number(nextTI.dataset.idx) - 1;
            nextTI = nextTI.nextElementSibling;
        }

        // Remove the row on the listed circular items
        this.parentElement.remove();

        // Update data preview if needed.
        if (source._oriData) {
            SpreadSheet.get("colDataPreview").setData(source.getColTable(dppKey));
        }
    }

    /**
     * Prepare insertion of a layer.   --- UPDATED (Dexter) 20181220
     * @param {ModelNode.Layer.Config|DataPreprocessing.Node} atNode - The editing node at which the insertion is made.
     * @param {String} method - The action of insertion: "before" or "after".
     * @param {Bool} relink - For the method of "after", relink the original toNode if needed.
     * @returns {Object} - The insertion information.
     */
    static prepareInsertNode(atNode, method = "after", relink = true) {
        // Get the model editing build no.
        const train = Project.now.train;
        const buildNo = train._editingBuild;

        var atLayer, atSource, prevLayers, prevSources, nextLayers, fromNodes, toNodes;

        if (!atNode && ["after", "add"].includes(method)) {
            // If no from node is give, this is a direct append to the latest nodes.
            atLayer = [...train.getEndingLayerProfiles()].filter((ele,idx)=>idx == 0);
            atSource = !atLayer.length ? [train.getDataSource(0, "input")] : [];

            // Refill the from node from the auto-collected nodes.
            fromNodes = atLayer.length ? [atLayer[0].name] : [...atSource.map(s=>s.getIDAndKey())];
            toNodes = [];

            // Get the layer profiles and col config objects.
            prevLayers = [...atLayer];
            prevSources = [...atSource];
            nextLayers = [];
        } else if (atNode) {
            if (method == "before" && atNode instanceof LayerProfile) {
                // If it's inserting before, it should be a layer profile.
                atLayer = atNode;

                // Get the new node information.
                fromNodes = [...atNode.fromSource[buildNo], ...atNode.fromNode[buildNo].map(l=>l.name)];
                toNodes = [atNode.name];
            } else if (["after", "add"].includes(method)) {
                if (atNode instanceof LayerProfile) {
                    // If this is a layer profile, assign to atLayer.
                    atLayer = atNode;

                    // Get the new node information
                    fromNodes = [atNode.name];
                    toNodes = relink ? [...atNode.toNode[buildNo].map(l=>l.name)] : [];
                } else {
                    // If this is a column config, assign to atLayer.
                    atSource = atNode

                    // Get the new node information
                    const colConfigTuple = atNode.getIDAndKey();
                    fromNodes = [colConfigTuple];
                    toNodes = relink ? [...train.getLayersUsingSource(...colConfigTuple).map(l=>l.name)] : [];
                }
            }

            // Otherwise, get the layer profile and column config objects.
            prevLayers = fromNodes.filter(item=>classof(item) == "String").map(ln=>train.layerProfiles.get(ln));
            prevSources = fromNodes.filter(item=>classof(item) != "String").map(tuple=>train.getDataSource(...tuple));
            nextLayers = toNodes.map(ln=>train.layerProfiles.get(ln));
        } 

        // Understand how many previous layers exist in the model.
        if ((prevLayers.length + prevSources.length) > 1) {
            // If there are too many latest layers, CNN Layer won't be appendable on them.
            $("appLayCNN").disabled = true;
            $("newCNNLayer").classList.add("noDisplay");
        } else {
            // Otherwise, check the shape of the latest layers or data sources.
            var prevShapes = [...prevSources.map(s=>s.getShape()), ...prevLayers.map(lp => lp._shape[buildNo])];

            // Determine if CNN/DCNN are available by using default settings of testing processable incoming shapes.
            var newShape = CNNLayer.testDefaultNodesCollection(prevShapes);

            // If it's ok to auto reshape for CNN use, allow the CNN Layer to be created.
            if (newShape) {
                $("appLayCNN").disabled = false;
                $("appLayDCNN").disabled = false;
            } else {
                $("appLayCNN").disabled = true;
                $("appLayDCNN").disabled = true;
            }
        }

        // Determine the latest order.
        if (prevLayers.length == 0) {
            $("appLayerCtx").dataset.order = 0;
        } else {
            $("appLayerCtx").dataset.order = Math.max(...prevLayers.map(l=>l._order[buildNo]));
        }
        
        // Clear and restore existing form values.
        $("appLayerType").selectedIndex = 0;
        $("appLayerRef").selectedIndex = 0;
        InputBox.restoreDefault($("appLayerRef"), $("appLayerCount"), $("appFilterWidth"), $("appDilation"), $("appPadding"), $("appStrideX"), $("appStrideY"));

        // Hide dilation option in case of CPU processing.
        if (train.device.startsWith("/cpu")) {
            $("appDilationRow").classList.add("noDisplay");
        } else {
            $("appDilationRow").classList.remove("noDisplay");
        }

        // Remember to from/to nodes and input shapes.
        $("appLayerCtx").dataset.fromNodes = JSON.stringify(fromNodes);
        $("appLayerCtx").dataset.toNodes = JSON.stringify(toNodes);
        var prevShapes = fromNodes.map(info=>classof(info) == "String" ? train.layerProfiles.get(info)._shape[buildNo] : train.getDataSource(...info).getShape());
        $("appLayerCtx").dataset.prevShapes = JSON.stringify(prevShapes);

        // Update layer type specific properties.
        Project.changeAppendLayerType.bind($("appLayerType"))();

        return {prevLayers: prevLayers, prevSources: prevSources, prevShapes: prevShapes, nextLayers: nextLayers, atLayer: atLayer, method: method};
    }

    /**
     * Validate the insertion after some layers.   --- UPDATED (Dexter) 20190320
     * @param {Object} insertionInfo - The insertion data.
     * @param {ModelNode.Layer.Config[]} insertionInfo.prevLayers - Previous layers.
     * @param {DataPreprocessing.Node[]} insertionInfo.prevSources - Previous data sources.
     * @param {Number[][]} insertionInfo.prevShapes - Previous shapes.
     * @param {ModelNode.Layer.Config[]} insertionInfo.nextLayers - Next layers.
     * @param {ModelNode.Layer.Config} insertionInfo.currentLayer - Current Layer.
     */
    static insertValidation(insertionInfo) {
        // Get the model editing build no.
        const buildNo = Project.now.train._editingBuild;

        // Validate for the layer count.
        var layerCountSucc = InputBox.validate($("appLayerCount"));
        if (!layerCountSucc) return false;
        
        // Ensure all sources are numbers. 
        if (insertionInfo.prevSources.some(dppNode=>!dppNode.isNumber(true))) {
            InputBox.showError($("appLayerCtxErr"), "strInputErr", "warning.svg");
            return false;
        }

        // Validate for layer-specific items.
        var hiddenSize = Number($("appLayerCount").value);
        var newLayerType = $("appLayerType").selectedOptions[0].dataset.val, newLayer;
        if (newLayerType == "CNNLayer") {
            newLayer = new CNNLayer(undefined, hiddenSize, Number($("appFilterWidth").value), $("appPadding").dataset.val == "1", [Number($("appStrideX").value), Number($("appStrideY").value)], Number($("appDilation").value));
        } else if (newLayerType == "DCNNLayer") {
            newLayer = new DCNNLayer(undefined, hiddenSize, Number($("appFilterWidth").value), $("appPadding").dataset.val == "1", [Number($("appStrideX").value), Number($("appStrideY").value)], Number($("appDilation").value));
        } else if (newLayerType == "BasicLayer") {
            if (insertionInfo.nextLayers.length == 0) return true;
            else newLayer = new BasicLayer(undefined, hiddenSize);
        } else if (newLayerType == "Collector") {
            if (insertionInfo.nextLayers.length == 0) return true;
            else newLayer = new Collector();
        } else return false;
        newLayer.train = Project.now.train;

        // Warn if the input cannot pass for the compatibility test.
        var shapeSucc = newLayer.getOutputShape({type: "dynamic", info: insertionInfo.prevShapes.map(s=>{return {shape:s};})});
        if (!shapeSucc) {
            if (newLayerType == "CNNLayer" || newLayerType == "DCNNLayer") {
                InputBox.showError($("appLayerCtxErr"), "notCompWithPrev", "warning.svg");
            }
            return false;
        } else {
            InputBox.clearWarn($("appLayerCtxErr"));
            if (insertionInfo.nextLayers.length == 0) return true;
            
            // Consider the case of matching with next layers.
            else if (insertionInfo.nextLayers.length) {
                // Create a TEMP name for new layer for checking use, and prepare the update shae of this new layer.
                newLayer.name = "TEMP";
                var nextFromShapeChanges = {type: "layer", id1: "TEMP", id2: 0, shape: shapeSucc};

                // Mimic the changes by routing the next layers from their original edges to the new shape.
                var centralizedMap = new Map();
                insertionInfo.nextLayers.forEach(nl=>{
                    var newFromLayers = nl.fromNode[buildNo].filter(nlBef=>!insertionInfo.prevLayers.includes(nlBef)).map(l=>{
                        return {type: "layer", id1: l.name, id2: 0};
                    });
                    var newSourceFromLayers = nl.fromSource[buildNo].filter(nlBefS=>!insertionInfo.prevSources.some(pvS=>pvS.getIDAndKey().every((ik,idx)=>ik==nlBefS[idx]))).map(s=>{
                        return {type: "source", id1: s[0], id2: s[1]};
                    })
                    newFromLayers.push(nextFromShapeChanges, ...newSourceFromLayers);
                    centralizedMap.set(nl.name, {status: 1, layerProfile: nl, fromShapeChanges: {type: "dynamic", info: [nextFromShapeChanges]}, configChanges: {}, outputShape: null});
                });

                // Request next layer results and check if they're fine with the changes.
                var nextLayerResults = [...insertionInfo.nextLayers.map(lp=>lp.applyShapeChanges(nextFromShapeChanges, undefined, centralizedMap, false))];
                return Project.extractErrors(nextLayerResults, (e)=>{
                    InputBox.showError($("appLayerCtxErr"), "notCompWithNext", "warning.svg");
                })[0] == null;
            }
        }
    }
    
    /**
     * Append a layer at the end of the model.   --- UPDATED (Dexter) 20181217
     * @param {Event} e - A click event typically from clicking $("actionAppendLayer") append layer button
     */
    static toAppendLayer(e) {
        // Collect all insertion information.
        var insertionInfo = Project.prepareInsertNode();

        // Show the append layer message box.
        ActionDialog.show("appLayerCtx", App.getTxtFromLang("appLayerT"), App.getTxtFromLang("appLayerC"), {x: e.pageX, y: e.pageY}, e=>{
            return Project.insertValidation(insertionInfo);
        }).then(e=>{
            // Get the values and assign as constructor parameters.
            var newLayerType = $("appLayerType").selectedOptions[0].dataset.val;
            var hiddenSize = Number($("appLayerCount").value);

            // Create the new layer and append to the current Train object.
            var newLayer;
            if (newLayerType == "Collector") {
                newLayer = new Collector();
            } else if (newLayerType == "BasicLayer") {
                newLayer = new BasicLayer(undefined, hiddenSize);
            } else if (newLayerType == "CNNLayer") {
                newLayer = new CNNLayer(undefined, hiddenSize, Number($("appFilterWidth").value), $("appPadding").dataset.val == "1", [Number($("appStrideX").value), Number($("appStrideY").value)], Number($("appDilation").value));
            } else if (newLayerType == "DCNNLayer") {
                newLayer = new DCNNLayer(undefined, hiddenSize, Number($("appFilterWidth").value), $("appPadding").dataset.val == "1", [Number($("appStrideX").value), Number($("appStrideY").value)], Number($("appDilation").value));
            }
            newLayer.train = Project.now.train;

            // Assign the reference layer if needed.
            if ($("appLayerRef").selectedOptions[0].dataset.val != "None") {
                newLayer.refLayerName = $("appLayerRef").selectedOptions[0].dataset.val;
                newLayer.refLayerTranspose = $("appTransRefWeight").dataset.val == "1";
            }

            // Attach the layer.
            Project.now.train.attachLayer(newLayer, ...insertionInfo.prevLayers, ...insertionInfo.prevSources);

            // Close all the flyouts.
            ContextMenu.manualCloseAll();
        });
    }
    
    /**
     * Change settings triggered from changing the layer type to be appended.   --- UPDATED (Dexter) 20180818
     * @param {Event} e - A click event typically from changing the $("appLayerType") append layer type.
     */
    static changeAppendLayerType(e) {
        // Get the model editing build no.
        const buildNo = Project.now.train._editingBuild;

        const layerType = this.selectedOptions[0].dataset.val;
        
        // Whether the layer type has referenceable layer.
        const nowOrder = Number($("appLayerCtx").dataset.order);
        const fromNode = JSON.parse($("appLayerCtx").dataset.fromNodes);
        const toNode = JSON.parse($("appLayerCtx").dataset.toNodes);
        const inputShapes = JSON.parse($("appLayerCtx").dataset.prevShapes);
        if (nowOrder >= 1) {
            var allLayers = [...Project.now.train.layerProfiles.values()].filter(l=>!l.refLayerName);

            if (layerType == "BasicLayer") {
                // Confirm either one side of the shape equals
                var newInputShape = BasicLayer.testDefaultNodesCollection(inputShapes);
                var newOutputShapes = toNode.length ? toNode.map(ln=>Project.now.train.layerProfiles.get(ln)) : null;
                
                var basiclayers = allLayers.filter(l=>l._type == "BasicLayer" && l._order[buildNo] <= nowOrder).filter(l=>{
                    var lInputShape = l.getPreprocessedIncomingShape();
                    var lOutputShape = l.getOutputShape();
                    return (lInputShape.every((s,idx)=>s==newInputShape[idx]) || lOutputShape.every((s,idx)=>s==newInputShape[idx]));
                });

                if (basiclayers.length > 0) {
                    // If it is a BasicLayer, find if there is any previous layer with the same input/output shape as current input shape.
                    $("appLayerRefRows").classList.remove("noDisplay");

                    // Show the basic layer as options for parameters sharing.
                    App.controlChildrenCount($("appLayerRef"), basiclayers.length+1, document.createElement("option"), undefined, undefined, (ele,idx)=>{
                        if (idx >= 1) {
                            ele.dataset.val = basiclayers[idx-1].name;
                            basiclayers[idx-1].showNameOnEle(ele);
                        }
                    });
                } else {
                    $("appLayerRefRows").classList.add("noDisplay");
                }
            } else if (layerType == "CNNLayer" || layerType == "DCNNLayer" || layerType == "Collector") {
                $("appLayerRefRows").classList.add("noDisplay");
            }
        } else {
            $("appLayerRefRows").classList.add("noDisplay");
        }

        // Whether to show layer-specific rows.
        if (["CNNLayer", "DCNNLayer"].includes(this.selectedOptions[0].dataset.val) && ($("appLayerRefRows").classList.contains("noDisplay") || $("appLayerRef").selectedOptions[0].dataset.val == "None")) {
            $("newCNNLayer").classList.remove("noDisplay");
        } else {
            $("newCNNLayer").classList.add("noDisplay");
        }

        // Hide hidden units if it's a collector.
        if (["Collector"].includes(this.selectedOptions[0].dataset.val)) {
            $("newLayerConfigSep", "newHiddenSizeRow").forEach(ele=>ele.classList.add("noDisplay"));
        } else {
            $("newLayerConfigSep", "newHiddenSizeRow").forEach(ele=>ele.classList.remove("noDisplay"));
        }

        // Trigger the detail settings of layer reference.
        Project.changeAppendLayerRef.bind($("appLayerRef"))();

        if (!$("appLayerCtx").classList.contains("hide")) {
            // Update the position of the context menu due to potential size changes.
            App.nextFrame().then(e=>ContextMenu.updatePos("appLayerCtx"));
        }
    }

    /**
     * Change settings triggered from changing the layer type to be appended.   --- UPDATED (Dexter) 20181217
     * @param {Event} e - A click event typically from changing the $("appLayerType") append layer type.
     */
    static changeAppendLayerRef(e) {
        const refLayerName = this.selectedOptions[0].dataset.val;
        const inputShapes = JSON.parse($("appLayerCtx").dataset.prevShapes);
        const toNode = JSON.parse($("appLayerCtx").dataset.toNodes);

        if (refLayerName == "None") {
            // Allow users to amend the new layer settings. 
            $("appLayerCount", "appFilterWidth", "appDilation", "appStrideX", "appStrideY", "appPadding").forEach(ele=>ele.classList.remove("inactive"));
            $("appTransRefWeightRow").classList.add("noDisplay");
        } else {
            // Since it is referencing a layer, disable users to amend the new layer settings. 
            $("appLayerCount", "appFilterWidth", "appDilation", "appStrideX", "appStrideY", "appPadding").forEach(ele=>ele.classList.add("inactive"));
            $("appTransRefWeightRow").classList.remove("noDisplay");
            
            // Get the reference layer.
            const refLayer = Project.now.train.layerProfiles.get(refLayerName);
            if (refLayer._type == "BasicLayer") {
                // Get the current appending layer shape info.
                var newInputShape = BasicLayer.testDefaultNodesCollection(inputShapes);
                var newOutputShapes = toNode.length ? toNode.map(ln=>Project.now.train.layerProfiles.get(ln)) : null;

                // Get the reference layer shape info.
                var lInputShape = refLayer.getPreprocessedIncomingShape();
                var lOutputShape = refLayer.getOutputShape();

                // Check if the referenced weights are transposable.
                if (!shapeEquals(lInputShape, lOutputShape)) $("appTransRefWeight").classList.add("inactive");
                if (shapeEquals(newInputShape, lInputShape)) {
                    App.applyPropVal($("appLayerCount"),lOutputShape.slice(-1));
                    App.applyPropVal($("appTransRefWeight"),false);
                } else {
                    App.applyPropVal($("appLayerCount"),lInputShape.slice(-1));
                    App.applyPropVal($("appTransRefWeight"),true);
                }
            } else if (refLayer._type == "CNNLayer" || refLayer._type == "DCNNLayer") {
                App.applyPropVal($("appLayerCount"),refLayer.getPreprocessedIncomingShape().slice(-1));
                App.applyPropVal($("appTransRefWeight"),true);
                App.applyPropVal($("appDilation"),refLayer.convDilation);
                App.applyPropVal($("appStrideX"),refLayer.convStride[0]);
                App.applyPropVal($("appStrideY"),refLayer.convStride[1]);
                App.applyPropVal($("appPadding"),refLayer.convPadding);
                $("appTransRefWeight").classList.remove("inactive");
            }
        }

        if (!$("appLayerCtx").classList.contains("hide")) {
            // Update the position of the context menu due to potential size changes.
            App.nextFrame().then(e=>ContextMenu.updatePos("appLayerCtx"));
        }
    }

    /**
     * Show the setting training task flyout from the next action button.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - A click event typically from clicking $("actionSetTask") button
     */
    static toShowSetTask(e) {
        // Remember the editing project id.
        $("addFinalCtx").dataset.editingID = Project.now.id;

        // Ensure there is one training data source.
        if (Project.now.train.sources.length == 1) {
            // Give users to choose what the task is comparing with, by adding the available column config in this training source.
            var colConfigs = Project.now.train.sources;
            var colSelBox = $("propTaskToCtx");
            var selCount = 0, defaultKey = 0;
            colConfigs.forEach((s,idx)=>{
                s.colConfigs.forEach((cf, cfKey)=>{
                    var opt = colSelBox.children[selCount];
                    if (!opt) colSelBox.appendChild(opt = document.createElement("option"));
                    opt.dataset.sourceID = idx; opt.dataset.cfKey = cfKey;
                    opt.innerHTML = `${s.getGeneralizedName()} - ${(App.getTxtFromLang(cfKey+"DppKey") || cfKey)}`;
                    if (cfKey == "target") defaultKey = selCount;
                    // No .dataset.lt is needed because the box must be closed before language changing.
                    selCount ++;
                });
            });

            // Ask users to define target column if there is no target column.
            if (!Project.now.train.sources[0].colConfigs.has("target") && Project.now.train.sources[0] instanceof TableSource) {
                $("finalTarCols").dataset.min = -Project.now.train.sources[0]._oriShape[1];
                $("finalTarCols").dataset.max = Project.now.train.sources[0]._oriShape[1]-1;
                $("ctxTargetColsAtFinal").classList.remove("noDisplay");
                
                // No .dataset.lt is needed because the box must be closed before language changing.
                var opt = colSelBox.children[selCount];
                if (!opt) colSelBox.appendChild(opt=document.createElement("option"));
                opt.dataset.sourceID = 0; opt.dataset.cfKey = "target";
                opt.innerHTML = `${Project.now.train.sources[0].getGeneralizedName()} - ${App.getTxtFromLang("targetDppKey")}`;
                defaultKey = selCount;
                selCount ++;
            } else {
                $("ctxTargetColsAtFinal").classList.add("noDisplay");
            }

            // Remove redundant colselboxes.
            if (colSelBox.children.length > selCount) {
                [...colSelBox.children].slice(selCount).forEach(ele=>ele.remove());
            }
            colSelBox.selectedIndex = defaultKey;
            
            // Update if classifier count need to be shown.
            $("finLayerType").dispatchEvent(new Event("change"));

            // Display the flyout with the relevant PointerEvent info.
            ContextMenu.show("addFinalCtx", true, {x: e.pageX, y: e.pageY});
        }
    }

    /**
     * Append a final layer to the current Train object.   --- UPDATED (Dexter) 20181210
     * @param {Event} e - A click event typically from clicking $("addFinalConfirm") confirm button
     */
    static toSetTask(e) {
        // Get the column config source index and key from the selected comparing option.
        var toCompareTo = $("propTaskToCtx").selectedOptions[0];
        var compareSourceID = Number(toCompareTo.dataset.sourceID);
        var compareTensorIdx = toCompareTo.dataset.cfKey;

        // In case target columns are newly defined, validate the column selection.
        if ($("ctxTargetColsAtFinal").classList.contains("noDisplay") || (compareTensorIdx != "target" || compareSourceID != 0) || InputBox.validate($("finalTarCols"))) {
            // In case a classifier is to be appended, validate the class count.
            if ($("finLayerClassCountRow").classList.contains("noDisplay") || InputBox.validate($("finLayerClassCount"))) {
                // Get the final layer type and the hidden size info.
                var newLayerType = $("finLayerType").selectedOptions[0].dataset.val;
                var hiddenSize = Number($("appLayerCount").value);

                // Try if the new final layer can be appended.
                var appended;
                if (newLayerType == "Classifier") {
                    if (InputBox.validate($("finLayerClassCount"))) {
                        const classCount = Number($("finLayerClassCount").value);
                        appended = Project.now.train.appendLayer(new Classifier(undefined, classCount, compareSourceID, compareTensorIdx));
                    }
                } else {
                    if (!$("ctxTargetColsAtFinal").classList.contains("noDisplay") && $("finalTarCols").value) {
                        Project.now.train.setProp($("finalTarCols"), "TrainSource", "targetCol", $("finalTarCols").value);
                    } 
                    appended = Project.now.train.appendLayer(new Regressor(undefined, compareSourceID, compareTensorIdx));
                }

                // If it can be appended,close all the flyouts.
                if (appended) ContextMenu.manualCloseAll();
                // Otherwise, a notification will be displayed to warn the user.
                else  AppNotification.show("noAppendT","noAppendC","cancel.svg"); 
            }
        }
    }

    /**
     * Insert a layer after from a button.   --- UPDATED (Dexter) 20181220
     * @param {Event} e - A click event, typically from column config related insert after buttons.
     */
    static toInsertAfterSource(e) {
        // Find out the current editing element throught the context menu saved data, and request for properties display based on the info.
        var dataset = this.parentElement.parentElement.parentElement.dataset;
        const dataSource = Project.now.train.getDataSource(dataset.id1, dataset.id2);
        var insertionInfo = Project.prepareInsertNode(dataSource, "after");
        Project.toInsert(e, dataset.displayName, insertionInfo);
    }

    /**
     * Insert a layer before from a button.   --- UPDATED (Dexter) 20180812
     * @param {Event} e - A click event, typically from layer related insert before buttons.
     */
    static toInsertBefore(e) {
        // Find out the current editing element throught the context menu saved data, and request for properties display based on the info.
        var dataset = this.parentElement.parentElement.parentElement.dataset;
        var editingLayer = Project.now.train.layerProfiles.get(dataset.id1);
        var insertionInfo = Project.prepareInsertNode(editingLayer, "before");
        Project.toInsert(e, dataset.layerName, insertionInfo);
    }

    /**
     * Insert a layer after from a button.   --- UPDATED (Dexter) 20180820
     * @param {Event} e - A click event, typically from layer related insert after buttons.
     */
    static toInsertAfter(e) {
        // Find out the current editing element throught the context menu saved data, and request for properties display based on the info.
        var dataset = this.parentElement.parentElement.parentElement.dataset;
        var editingLayer = Project.now.train.layerProfiles.get(dataset.id1);
        var insertionInfo = Project.prepareInsertNode(editingLayer, "after");
        Project.toInsert(e, dataset.layerName, insertionInfo);
    }

    /**
     * Insert a layer.   --- UPDATED (Dexter) 20181217
     * @param {Event} e - A click event, typically from layer related insert before buttons.
     * @param {String} oriLayerDisplayName - The display name of the original layer.
     * @param {Object} insertionInfo - The insertion data.
     * @param {ModelNode.Layer.Config[]} insertionInfo.prevLayers - Previous layers.
     * @param {DataPreprocessing.Node[]} insertionInfo.prevSources - Previous data sources.
     * @param {Number[][]} insertionInfo.prevShapes - Previous shapes.
     * @param {ModelNode.Layer.Config[]} insertionInfo.nextLayers - Next layers.
     * @param {ModelNode.Layer.Config} insertionInfo.currentLayer - Current Layer.
     */
    static toInsert(e, oriLayerDisplayName, insertionInfo) {
        // Get the model editing build no.
        const buildNo = Project.now.train._editingBuild;

        // Show and validate the insertion dialog.
        const insLangKey = insertionInfo.method == "before" ? "insertLayerB" : insertionInfo.method == "after" ? "insertLayerA" : "insertLayerC";
        ActionDialog.show("appLayerCtx", App.getTxtFromLang(insertionInfo.method == "add" ? "appLayerT" : "insertLayerT"), App.getTxtFromLang(insLangKey+"1T") + (oriLayerDisplayName || insertionInfo.atLayer.name) + App.getTxtFromLang(insLangKey+"2T"), {x: e.pageX, y: e.pageY, pointerType: e.pointerType},(e)=>{
            return Project.insertValidation(insertionInfo);
        }).then(e=>{
            if (e) {
                // Get the values and assign as constructor parameters.
                var newLayerType = $("appLayerType").selectedOptions[0].dataset.val;
                var hiddenSize = Number($("appLayerCount").value);

                // Create the new layer and append to the current Train object.
                var newLayer;
                if (newLayerType == "Collector") {
                    newLayer = new Collector();
                } else if (newLayerType == "BasicLayer") {
                    newLayer = new BasicLayer(undefined, hiddenSize);
                } else if (newLayerType == "CNNLayer") {
                    newLayer = new CNNLayer(undefined, hiddenSize, Number($("appFilterWidth").value), $("appPadding").dataset.val == "1", [Number($("appStrideX").value), Number($("appStrideY").value)], Number($("appDilation").value));
                } else if (newLayerType == "DCNNLayer") {
                    newLayer = new DCNNLayer(undefined, hiddenSize, Number($("appFilterWidth").value), $("appPadding").dataset.val == "1", [Number($("appStrideX").value), Number($("appStrideY").value)], Number($("appDilation").value));
                }
                newLayer.train = Project.now.train;

                // Assign the reference layer if needed.
                if ($("appLayerRef").selectedOptions[0].dataset.val != "None") {
                    newLayer.refLayerName = $("appLayerRef").selectedOptions[0].dataset.val;
                    newLayer.refLayerTranspose = $("appTransRefWeight").dataset.val == "1";
                }

                // Attach the new layer to previous layers and sources.
                insertionInfo.prevLayers.forEach(pl=>{
                    pl.toNode[buildNo] = pl.toNode[buildNo].filter(plNext=>!insertionInfo.nextLayers.includes(plNext));
                });
                Project.now.train.attachLayer(newLayer, ...insertionInfo.prevLayers, ...insertionInfo.prevSources);

                // Switch the next layers to the new layer.
                insertionInfo.nextLayers.forEach(nl=>{
                    // Detach the previous layers.
                    nl.fromNode[buildNo] = nl.fromNode[buildNo].filter(nlBef=>!insertionInfo.prevLayers.includes(nlBef));
                    nl.fromSource[buildNo] = nl.fromSource[buildNo].filter(nlBefS=>!insertionInfo.prevSources.some(pvS=>pvS.getIDAndKey().every((ik,idx)=>ik==nlBefS[idx])));

                    // Attach the next layers to the new layer.
                    Project.now.train.attachLayer(nl, newLayer);
                });

                // Close all the flyouts.
                ContextMenu.manualCloseAll();
            }
        }, e=>{});
    }

    /**
     * Create a layer after from a button.   --- UPDATED (Dexter) 20181220
     * @param {Event} e - A click event, typically from layer related insert before buttons.
     */
    static toCreateAfterSource(e) {
        // Find out the current editing element throught the context menu saved data, and request for properties display based on the info.
        const dataset = this.parentElement.parentElement.parentElement.dataset;
        const dataSource = Project.now.train.getDataSource(dataset.id1, dataset.id2);
        var insertionInfo = Project.prepareInsertNode(dataSource, "add", false);
        Project.toInsert(e, dataset.displayName, insertionInfo);
    }
    
    /**
     * Create a layer after from a button.   --- UPDATED (Dexter) 20181025
     * @param {Event} e - A click event, typically from layer related insert before buttons.
     */
    static toCreateAfter(e) {
        // Find out the current editing element throught the context menu saved data, and request for properties display based on the info.
        var dataset = this.parentElement.parentElement.parentElement.dataset;
        var editingLayer = Project.now.train.layerProfiles.get(dataset.id1);
        var insertionInfo = Project.prepareInsertNode(editingLayer, "add", false);
        Project.toInsert(e, dataset.layerName, insertionInfo);
    }

    /**
     * Attach a layer on other layers, triggered from a button.   --- UPDATED (Dexter) 20181028
     * @param {Event} e - A click event, typically from layer related insert before buttons.
     */
    static toAttachOn(e) {
        // Close all context menus.
        ContextMenu.manualCloseAll();

        // Start layer connection mode.
        const layer = Project.now.train.layerProfiles.get(this.parentElement.parentElement.parentElement.dataset.id1);
        Project.now.startConnectionMode("attach", layer.ele);
    }

    /**
     * Connect a source to other layers, triggered from a button.   --- UPDATED (Dexter) 20181220
     * @param {Event} e - A click event, typically from source related connect to buttons.
     */
    static toConnectSource(e) {
        // Close all context menus.
        ContextMenu.manualCloseAll();
        
        // Start layer connection mode.
        const dataset = this.parentElement.parentElement.parentElement.dataset;
        const dataSource = Project.now.train.getDataSource(dataset.id1, dataset.id2);
        Project.now.startConnectionMode("connect", dataSource.ele);
    }

    /**
     * Connect a layer to other layers, triggered from a button.   --- UPDATED (Dexter) 20181028
     * @param {Event} e - A click event, typically from layer related connect to buttons.
     */
    static toConnectTo(e) {
        // Close all context menus.
        ContextMenu.manualCloseAll();
        
        // Start layer connection mode.
        const layer = Project.now.train.layerProfiles.get(this.parentElement.parentElement.parentElement.dataset.id1);
        Project.now.startConnectionMode("connect", layer.ele);
    }

    /**
     * End current connection mode.   --- UPDATED (Dexter) 20181028
     * @param {Event} e - A click event, typically from layer related insert before buttons.
     */
    static toEndConnectionMode(e) {
        // Close all context menus.
        ContextMenu.manualCloseAll();
        
        // End layer connection mode.
        Project.now.endConnectionMode();
    }

    /**
     * End current connection mode and revert to previous state.   --- UPDATED (Dexter) 20181124
     * @param {Event} e - A click event, typically from layer related insert before buttons.
     */
    static toRevertConnections(e) {
        // Close all context menus.
        ContextMenu.manualCloseAll();
        
        // End layer connection mode.
        Project.now.revertConnections();
    }

    /**
     * Edit the input link of a layer node.   --- UPDATED (Dexter) 20181028
     * @param {Event} e - A click event, typically from layer related insert before buttons.
     */
    static toEditInputLink(e) {
        if (Project.now.connectionMode) {
            Project.now.updateConnectionOn(this.parentElement);
        } else {
            // Start layer connection mode.
            Project.now.startConnectionMode("attach", this.parentElement);
        }
    }

    /**
     * Edit the output link of a layer node.   --- UPDATED (Dexter) 20181028
     * @param {Event} e - A click event, typically from layer related insert before buttons.
     */
    static toEditOutputLink(e) {
        if (Project.now.connectionMode) {
            Project.now.updateConnectionOn(this.parentElement);
        } else {
            // Start layer connection mode.
            Project.now.startConnectionMode("connect", this.parentElement);
        }
    }
    
    /**
     * Delete a layer from a button.   --- UPDATED (Dexter) 20180810
     * @param {Event} e - A click event, typically from layer related delete buttons.
     */
    static toDelLayer(e) {
        // Find out the current editing element throught the context menu saved data, and request for properties display based on the info.
        var dataset = this.parentElement.parentElement.parentElement.dataset;
        ActionDialog.show("warningMsg", App.getTxtFromLang("cmDelLayer"), App.getTxtFromLang("cfDelLayer") + dataset.layerName + App.getTxtFromLang("cfDelLayer2"), {x: e.pageX, y: e.pageY, pointerType: e.pointerType}).then((e)=>{
            Project.now.train.layerProfiles.get(dataset.id1).remove();
            Project.now.showProp("Train");
        }, e=>{});
    }

    /**
     * Delete a layer and it's proceeding layers from a button.   --- UPDATED (Dexter) 20180810
     * @param {Event} e - A click event, typically from layer related delete buttons.
     */
    static toDelLaterLayers(e) {
        // Find out the current editing element throught the context menu saved data, and request for properties display based on the info.
        var dataset = this.parentElement.parentElement.parentElement.dataset;
        ActionDialog.show("warningMsg", App.getTxtFromLang("cmDelAll"), App.getTxtFromLang("cfDelLayer") + dataset.layerName + App.getTxtFromLang("cfDelLayer3"), {x: e.pageX, y: e.pageY, pointerType: e.pointerType}).then((e)=>{
            Project.now.train.layerProfiles.get(dataset.id1).removeThisAndAllProceedings();
            Project.now.showProp("Train");
        }, e=>{});
    }

    /**
     * Delete a final layer from a button.   --- UPDATED (Dexter) 20180807
     * @param {Event} e - A click event, typically from final layers related delete buttons.
     */
    static toDelFinalLayer(e) {
        // Find out the current editing element throught the context menu saved data, and request for properties display based on the info.
        var dataset = this.parentElement.parentElement.parentElement.dataset;
        ActionDialog.show("warningMsg", App.getTxtFromLang("cmDelLayer"), App.getTxtFromLang("cfDelLayer") + dataset.layerName + App.getTxtFromLang("cfDelLayer2"), {x: e.pageX, y: e.pageY, pointerType: e.pointerType}).then((e)=>{
            Project.now.train.layerProfiles.get(dataset.id1).remove();
            Project.now.showProp("Train");
        }, e=>{});
    }

    /**
     * Extract errors from the error results returned.   --- UPDATED (Dexter) 20181129
     * @param {Array} nextLayerResults - Error lists of next layer results (may be stacked).
     * @param {Function} callback - A callback function if there exists errors.
     * @returns {Object[]} - A list of errors.
     */
    static extractErrors(nextLayerResults, callback = null) {
        var error = null, result = true;
        if (!nextLayerResults.every(a=>a.result)) {
            result = false;
            error = [];
            nextLayerResults.forEach(r=>"error" in r ? (classof(r.error) == "Array" ? r.error.forEach(e=>error.push(e)) : error.push(r.error)) : true);
        }
        return [error, result];
    }

    /**
     * Edit a variable configuration.   --- UPDATED (Dexter) 20181129
     * @param {Event} e - A click event typically from clicking .varConfigBtn buttons.
     */
    static toEditVarConfig(e) {
        // Locate the variable config in the layer data structure.
        var loc = this.dataset.id.split(".");

        // Get the editing layer profile.
        var layer = Project.now.train.layerProfiles.get(Project.now.train._editingLayer);
        var varConfig = layer.getValue(...loc);

        // Update var conifg panel info and display all info.
        var panel = $("varConfigCtx");
        var initializer = varConfig.initializer;
        Project.showVarConfigInitOptions(initializer);
        [...panel.getElementsByClassName("propVal")].forEach(ele=>ele.dataset.id = ele.dataset.propType == "VarConfig" ? this.dataset.id : (this.dataset.id + ".initializer"));

        // Apply the var config options and write their values.
        ["propL1Loss", "propL2Loss", "propL1Rate", "propL2Rate"].forEach(str=>{
            var ele = $(str);
            ele.classList.remove("noDisplay");
            App.applyPropVal(ele, varConfig[ele.dataset.prop]);
        });


        // Show the var config editing window.
        ActionDialog.show("varConfigCtx", App.getTxtFromLang("varConfig"), undefined, {x: e.pageX, y: e.pageY}, e=>{
            return InputBox.validateAll(...[...e.target.getElementsByClassName("propVal")].filter(ele=>!isOrDescendentOf(ele, parent=>parent.classList.contains("noDisplay"))));
        }).then(e=>{
            // See if a new initializer is needed.
            var newInitializerName = $("propVCInitializer").selectedOptions[0].dataset.val;
            if (newInitializerName != initializer._type) initializer = varConfig.initializer = new VarConfig[newInitializerName]();

            // Determine the active options to update, with the requested initializer.
            var activeOpts = ["propVCInitializer", "propL1Loss", "propL2Loss", "propL1Rate", "propL2Rate"];
            if (["Constant"].includes(initializer._type)) {
                activeOpts.push("propVCValue");
            } else if (["Normal", "TruncatedNormal"].includes(initializer._type)) {
                activeOpts.push("propVCMean", "propVCStdDev");
            } else if (["RandomUniform"].includes(initializer._type)) {
                activeOpts.push("propVCMinVal","propVCMaxVal");
            } else if (["Orthogonal", "Identity"].includes(initializer._type)) {
                activeOpts.push("propVCGain");
            }

            // Update the values.
            activeOpts.forEach(str=>{
                Project.now.setPropVal($(str));
            });

            
            // Update the property pane initializer.
            App.applyPropVal($(this.dataset.rowInitializer), initializer._type);
        }, e=>{});
    }

    /**
     * Show the variable configuration initializer options.   --- UPDATED (Dexter) 20181129
     * @param {VarConfig.Initializer} initializer - The variable config initializer name;
     */
    static showVarConfigInitOptions(initializer) {
        // Prepare option lists.
        var allOpts = ["propRowVCValue", "propRowVCMean", "propRowVCStdDev", "propRowVCMinVal", "propRowVCMaxVal", "propRowVCGain"];
        var activeOpts = ["propRowVCInitializer"];

        // Determine the active options with the requested initializer.
        if (["Constant"].includes(initializer._type)) {
            activeOpts.push("propRowVCValue");
        } else if (["RandomNormal", "TruncatedNormal"].includes(initializer._type)) {
            activeOpts.push("propRowVCMean", "propRowVCStdDev");
        } else if (["RandomUniform"].includes(initializer._type)) {
            activeOpts.push("propRowVCMinVal","propRowVCMaxVal");
        } else if (["Orthogonal", "Identity"].includes(initializer._type)) {
            activeOpts.push("propRowVCGain");
        }

        // Disable non-active options.
        allOpts.filter(str=>activeOpts.indexOf(str) == -1).forEach(str=>$(str).classList.add("noDisplay"));

        // Activate the active options and write their values.
        activeOpts.forEach(str=>{
            var row = $(str);
            row.classList.remove("noDisplay");
            var ele = row.getElementsByClassName("propVal")[0];
            App.applyPropVal(ele, initializer[ele.dataset.prop]);
        });
    }

    /**
     * Updatte the form showing different var config init options.   --- UPDATED (Dexter) 20190213
     * @param {Event} e - An event, typically from changing the initializer type.
     */
    static updateVarConfigInitOptions(e) {
        // Create a default variable config object from the newly selected value.
        var newType = this.selectedOptions[0].dataset.val;
        Project.showVarConfigInitOptions(new VarConfig[newType]());
        
        // Update the position of the context menu due to potential size changes.
        App.nextFrame().then(e=>ContextMenu.updatePos("varConfigCtx"));
    }

    /**
     * Show/Hide class count on the setting train task flyout when changing the type of final task.   --- UPDATED (Dexter) 20190213
     * @param {Event} e - A change event, typicallly from $("finLayerType") 
     */
    static checkShowClass(e) {
        // Display the class count property editing only if the final layer type is a classifier.
        if (this.selectedOptions[0].dataset.val == "Classifier") {
            $("finLayerClassCountRow").classList.remove("noDisplay");
        } else {
            $("finLayerClassCountRow").classList.add("noDisplay");
        }

        // Show information on the task.
        $("addTaskTips").dataset.for = "taskInfo" + this.selectedOptions[0].dataset.val;

        // Update the position.
        App.nextFrame().then(e=>ContextMenu.updatePos("addFinalCtx"));
    }

    /**
     * Toggle the advanced properties info in the Properties Pane by clicking "Advanced Options..." buttons.   --- UPDATED (Dexter) 20180524
     */
    static toggleHiddenInfo() {
        // Toggle the display of the advanced properties.
        this.parentElement.nextElementSibling.classList.toggle("noDisplay");

        // Toggle the arrow direction and the activation status of this button.
        var tarIcon = this.getElementsByClassName("icon")[0];
        tarIcon.innerText = tarIcon.innerText == "⏷" ? "⏶" : "⏷";
        this.classList.toggle("activated");
    }

    /**
     * Save the project as a JSON file.   --- UPDATED (Dexter) 20180524
     */
    static toExportAsJSON() {
        // If it has a Train object now, export as JSON in the Project object.
        if (Project.now) {
            Project.now.exportAsJSON();
        }
    }

    /**
     * Show the python code flyout.  --- UPDATED (Dexter) 20180524
     * @param {Event} e - A click event from any UI buttons to show the Python codes
     */
    static toViewPython(e) {
        // Ensure there is an editing Train object,
        if (Project.now.train) {
            // Get the Python code from the Train object.
            Project.now.train.getPython().then(val=>{
                // The code is then displayed into a text box.
                $("pythonCodes").value = val;

                // Display the flyout with the relevant PointerEvent info.
                ContextMenu.show("codePreview", true, {x: e.pageX, y: e.pageY});
            }, e=> AppNotification.show("errorT","errorPythonC","cancel.svg"));
        }
    }

    /**
     * Get the latest Python codes from the currently editing Train object.  --- UPDATED (Dexter) 20180524
     */
    static toRefreshPython() {
        // Ensure there is an editing Train object,
        if (Project.now.train) {
            return Project.now.train.getPython();
        }
    }

    /**
     * Prepare the textbox and save the Python codes.  --- UPDATED (Dexter) 20180524
     * @param {Event} e - A click event from any saving Python buttons.
     */
    static toSavePython(e) {
        // Save the code in the textbox
        Project.savePython($("pythonCodes").value);

        // Close all context menus
        ContextMenu.manualCloseAll();
    }
    
    /**
     * Save the Python codes.  --- UPDATED (Dexter) 20180524
     * @param {String} str - The string to be saved
     */
    static savePython(str) {
        // Create the blob then dataURL from the string.
        var dataURL = URL.createObjectURL(new Blob([str], {type : 'application/python'}));

        // Assign the data URL to a download holder link, and manually click on the link for the download.
        $("downloadHolder").href = dataURL;
        $("downloadHolder").download = Project.now.train.trainName + ".py";
        $("downloadHolder").click();
    }

    /**
     * Refresh the Python code and directly save the Python code without viewing the code.  --- UPDATED (Dexter) 20180524
     * @param {Event} e - A click event from any directly saving Python buttons.
     */
    static toRefreshAndSavePython(e) {
        // Refresh the Python codes from the training object, and save the string directly or show errors depending on the resolved Promise.
        Project.toRefreshPython().then(v=>Project.savePython(v), e=> AppNotification.show("errorT","errorPythonC","cancel.svg"))
    }
}

/** Class representing a project results folder.   --- UPDATED (Dexter) 20180524 */
class ProjectFolder {
    /**
     * The single notification representing the status of this results folder.   --- UPDATED (Dexter) 20180524
     */
    static get nf() { return this._nf; } static nf(v) { this._nf = v; }
    /**
     * The list of dates current dashboards are displaying.   --- UPDATED (Dexter) 20180524
     */
    static get date() { return this._date; } static date(v) { this._date = v; }
    /**
     * A map of dates that special logs contains, with the key as the log name and the value as the subset of dates with that log.   --- UPDATED (Dexter) 20180721
     */
    static get specialLogDates() { return this._specialLogDates; } static specialLogDates(v) { this._specialLogDates = v; }

    /**
     * Initiation after the app is loaded.   --- UPDATED (Dexter) 20180524
     */
    static initiate() {
        // Initialize static variables for ProjectFolder.
        ProjectFolder.nf = null; ProjectFolder.date = []; ProjectFolder.specialLogDates = new Map();

        // Add events for clicking and selecting folders using the startScreen button.
        $("startProjectFolder").addEventListener("click", ProjectFolder.folderPicker, false);
        $("inputProjectFolder").addEventListener("change", ProjectFolder.change, false);

        // Add events for the buttons selecting dates, switching train/weight dashboards, and showing options.
        $("selDates").addEventListener("click", ProjectFolder.showDates, false);
        [...$("graphTools").children].forEach(btn=>btn.addEventListener("click", ProjectFolder.switchDashBoard, false));
        $("dashBoardOptionsBtn").addEventListener("click", DashboardItem.showSettings, false);
        $("cmGIOptions").addEventListener("click", DashboardItem.showSettings, false);

        // Add events for showing and saving graph images.
        $("cmGIView").addEventListener("click", GraphItem.showAsImage, false);
        $("cmGISave", "graphImgSave").forEach(ele=>ele.addEventListener("click", GraphItem.saveAsImage, false));
    }

    /**
     * Actions fired after clicking to choose a folder at the startScreen.   --- UPDATED (Dexter) 20180524
     */
    static folderPicker() {
        // Clear the file input holder value, and manually click it.
        $("inputProjectFolder").value = "";
        $("inputProjectFolder").click();
    }

    /**
     * Actions fired after clicking to switch dates in the dashboard.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - A click event to show the list of available dates for a dashboard result, typically $("selDates")
     */
    static showDates(e) {
        e.stopPropagation();

        // Show the flyout of selecting dates, and pass necessary PointerEvent info.
        ContextMenu.show("folderDates",true,{x: e.pageX, y: e.pageY})
    }

    /**
     * Actions fired after the user selecting new folder to open.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - A change event that the folder input button receives new folder and files
     */
    static change(e) {
        // Collect all files and regroup in folders
        ProjectFolder.submitFilesToWorker(new Map(Array.from(e.target.files).map(f=>[f.webkitRelativePath,f])));
    }

    /**
     * Recusively read the file system directory as got from the dropped folder.   --- UPDATED (Dexter) 20180524
     * @param {FileSystemDirectoryEntry} dir - File system directory to read
     * @param {Object} list - Global status of reading the root folder
     * @param {Number} list.counter - The counter of status on reading a file
     * @param {Map} list.all - A key-value map on the relative path and a File object
     * @param {Boolean} list.processed - Whether the files have been given to Web Worker to process with
     * @param {Boolean} list.allRead - Whether all the files and folders have looped through
     * @param {Boolean} root - Whether the reading object is the root folder.
     */
    static readDir(dir, list, root=false) {
        // Depending on whether this is a file or a directory, different actions have to been taken:
        if (dir.isDirectory) {
            // If this is a directory, create a reader and read the entries of each items in it.
            let directoryReader = dir.createReader();
            list.counter++;
            directoryReader.readEntries(function(entries) {
                list.counter--;
                
                // For each entry, read them.
                entries.forEach(function(entry) {
                    ProjectFolder.readDir(entry, list);
                });

                // Check if there remains no reading file, all have been read, there have been files, and files not submitted to the Worker
                if (list.counter == 0 && list.allRead && list.all.size && !list.processed) {
                    // If so, the function has been fully executed and submit all the files to the Worker for further processes.
                    list.processed = true;
                    ProjectFolder.submitFilesToWorker(list.all);
                }
            });
        } else if (dir.isFile) {
            list.counter++;
            
            // If this is a file, read it in fil() function.
            dir.file(f=>{
                list.counter--;

                // After reading the file, set the file in list.all
                list.all.set(dir.fullPath.slice(1), f);

                // Check if there remains no reading file, all have been read, there have been files, and files not submitted to the Worker
                if (list.counter == 0 && list.allRead && list.all.size && !list.processed) {
                    // If so, the function has been fully executed and submit all the files to the Worker for further processes.
                    list.processed = true;
                    ProjectFolder.submitFilesToWorker(list.all);
                }
            }, f=>{
                AppNotification.show("missingFileT", "missingFileC", "cancel.svg");
            });
        }
        if (root) {
            // If all files have been read, check if there remains no reading file, there have been files and files have not been submitted to the Worker
            list.allRead = true;
            if (list.counter == 0 && list.all.size && !list.processed) {
                // If so, the function has been fully executed and submit all the files to the Worker for further processes.
                list.processed = true;
                ProjectFolder.submitFilesToWorker(list.all);
            }
        }
    }

    /**
     * Submit a Map of File objects with the corresponding relative paths to the Worker for further processes.   --- UPDATED (Dexter) 20180524
     * @param {Map} fileMap - A file map using the relative path as key and a File object as the value
     */
    static submitFilesToWorker(fileMap) {
        // Show notification that the folder is reading.
        ProjectFolder.nf = AppNotification.show("folderReadingT", "", "waiting.svg", false);

        // Pass the fileMap to the Web Worker to structure there.
        App.worker.postMessage({action: "newProjectFolder", files: fileMap});

        // The start screen cannot be touched for further updates.
        $("startScreen").classList.add("ianctive");
    }

    /**
     * Feedback from the Web Worker that the folder read is not NeuralSimplycode structured.   --- UPDATED (Dexter) 20180524
     */
    static incorrectFolderReadIn() {
        // Update the notification to show the incorrect status.
        AppNotification.update(ProjectFolder.nf, "frIncorrectT", "frIncorrectC", "cancel.svg", true);

        // Resume the startScreen for further interactions.
        $("startScreen").classList.remove("inactive");
    }
    
    /**
     * Feedback from the Web Worker that the folder has read completely and the dashboard UI can be prepared.   --- UPDATED (Dexter) 20180723
     * @param {Date} nowDate - Current date involved in the dashboards.
     * @param {Date[]} dateList - Array of dates the project folder contains.
     * @param {Map()} specialLogDates - Map of special logs that may optionally appears in different trials, key of the log name with value of a set of numbers representing the dates where weightlogs exist/
     */
    static startFolderUI(nowDate, dateList, specialLogDates = new Map()) {
        // Update the notification status to analysing the data.
        AppNotification.update(ProjectFolder.nf, "frAnalysisT", "", "waiting.svg", false);
        
        // Clear all previous graphs and go to the page "projectFolder".
        TrainLog.clearAll(); WeightGraph.clearAll(); TraceLog.clearAll();
        App.gotoPage("projectFolder");
        
        // Remove the inactive class of startScreen so later users can interact with the startScreen.
        $("startScreen").classList.remove("inactive");

        // Assign the specialLogDates to a current static variable.
        ProjectFolder.specialLogDates = specialLogDates;

        // In case there are more than one dates existed in the folder, update the date selection boxes.
        if (dateList.length > 1) {
            // Allow the selection of dates
            $("selDates").classList.remove("inactive");
            
            // Ensure there are enough buttons for folder date selection.
            App.controlChildrenCount($("fdDateSel"), dateList.length, $("fdDateTemp"), undefined, ele=>{
                // Add Event for clicking the selection and change the date
                ele.children[0].addEventListener("click", ProjectFolder.toSwitchToDate, false);
            }, (ele,idx)=>{
                // Update values of the date selection buttons
                const date = dateList[idx];
                var dDate = ele.children[0];
                dDate.innerText = App.getDateFromLang(date);
                ele.dataset.date = dDate.dataset.ltDate = Number(date);
            })
        } else {
            // Disable the selection of dates.
            $("selDates").classList.add("inactive");
        }

        // Switch to the selected date.
        ProjectFolder.switchToDate([Number(nowDate)]);
    }

    /**
     * After selecting a date, switch to that date for dashboard data display.   --- UPDATED (Dexter) 20180524
     * @param {Event} e - A click event, typically from clicking the button of selecting one date.
     */
    static toSwitchToDate(e) {
        // Switch only if there is really change, i.e. the newly clicked button has not been activated.
        if (!this.parentNode.classList.contains("activated")) 
            ProjectFolder.switchToDate([Number(this.dataset.ltDate)])
    }

    /**
     * Switch the dashboard data display to specific list of dates.   --- UPDATED (Dexter) 20180723
     * @param {Number[]} dateAry - An array of number representation of dates
     */
    static switchToDate(dateAry = []) {
        // Closs all context menus (close the selection boxes).
        ContextMenu.closeAll();

        // Determine what is the current dashboard, and later update it.
        const graph = $("trainLogBtn").classList.contains("activated") ? "TrainLog" : $("weightGraphBtn").classList.contains("activated") ? "WeightGraph" : "TraceLog";

        // Assign the new date to the static variable.
        ProjectFolder.date = dateAry;
        
        // Display on the heading $("curDate") what training is displaying.
        if (dateAry.length == 1) {
            var toDate = dateAry[0];
            var toDateDate = new Date(toDate);
            $("curDate").innerText = App.getDateFromLang(toDateDate);
            $("curDate").dataset.ltDate = toDate;
            $("curDate").dataset.ltTemp = $("curDate").dataset.lt = "";
        } else if (dateAry.length > 1) {
            $("curDate").innerText = dateAry.length +" "+ App.getDateFromLang("trainingTimes");
            $("curDate").dataset.ltDate = "";
            $("curDate").dataset.lt = "trainingTimes";
            $("curDate").dataset.ltTemp = dateAry.length +" $$$";
        }

        // Update the selection status of the buttons on the date selection buttons.
        var fdItems = [...$("folderDates").getElementsByClassName("selFD")];
        fdItems.forEach((ele)=>{
            if (dateAry.includes(Number(ele.dataset.date))) {
                ele.classList.add("activated");
                ele.children[1].innerText = "✔";
            } else {
                ele.classList.remove("activated");
                ele.children[1].innerText = "";
            }
        });

        // Check if the date can have weight graph display, toggle the "inactive" class of switching to Weight Graph if needed.
        const logBtnNames = {"weightLog": "weightGraphBtn", "traceLog": "traceLogBtn"};
        ProjectFolder.specialLogDates.forEach((dates,log)=>{
            if (dateAry.length == 1 && dates.has(dateAry[0])) $(logBtnNames[log]).classList.remove("inactive");
            else $(logBtnNames[log]).classList.add("inactive");
        })

        // Call the worker to draw the current graph of the current dates.
        App.workerFtn("ProjectFolder", "drawFolder", graph, dateAry, undefined, ...(graph=="TrainLog"?TrainLog:graph=="WeightGraph"?WeightGraph:TraceLog).getOptions());
    }

    /**
     * Switch to a desired dashboard.   --- UPDATED (Dexter) 20180721
     * @param {Event} e - A click event, typically from a button under $("graphTools") .
     */
    static switchDashBoard(e) {
        // Loop all dashboard switching buttons.
        [...$("graphTools").children].forEach(btn=>{
            // Depending on whether the button is this clicking button, toggle the activation status of the button, and the display of the corresponding graph.
            if (btn.id == this.id) {
                btn.classList.add("activated");
                $(btn.dataset.for).classList.remove("noDisplay");
                
                // Call the follow up actions on the requested dashboard.
                const toFunctions = {"trainLogBtn": "switchedToTrainLog", "weightGraphBtn": "switchedToWeightLog",
                                    "traceLogBtn": "switchedToTraceLog"};
                if (toFunctions[btn.id]) ProjectFolder[toFunctions[btn.id]]();

                if (btn.id == "trainLogBtn") {
                    // Train logs won't have inactive dates, so remove inactive class of date selection buttons.
                    [...$("folderDates").getElementsByClassName("selFD")].forEach(ele=>ele.classList.remove("inactive"));
                } else {
                    // Noted some dates may not have weight information, and add inactive status to them.
                    [...$("folderDates").getElementsByClassName("selFD")].forEach(ele=>{
                        if (!ProjectFolder.specialLogDates.get(btn.dataset.log).has(Number(ele.dataset.date))) ele.classList.add("inactive");
                        else ele.classList.remove("inactive");
                    });
                }
            } else {
                btn.classList.remove("activated");
                $(btn.dataset.for).classList.add("noDisplay");
            }
        });
    }

    /**
     * Switch to training log dashboard.   --- UPDATED (Dexter) 20180723
     */
    static switchedToTrainLog() {
        // After the SVG is display, resize the graph, and request the worker to draw the train log of the current dates.
        App.nextFrame().then(()=>{
            TrainLog.resizeAll();
            App.workerFtn("ProjectFolder", "drawFolder", "TrainLog", ProjectFolder.date, undefined, ...TrainLog.getOptions("dashBoardSVG"));
        });
    }

    /**
     * Switch to weight graph dashboard.   --- UPDATED (Dexter) 20180723
     */
    static switchedToWeightLog() {
        // After the SVG is display, resize the graph, and request the worker to draw the train log of the current dates.
        App.nextFrame().then(()=>{
            WeightGraph.resizeAll();
            App.workerFtn("ProjectFolder", "drawFolder", "WeightGraph", ProjectFolder.date, undefined, ...WeightGraph.getOptions("weightGraphSVG"));
        });
    }

    /**
     * Switch to trace log dashboard.   --- UPDATED (Dexter) 20180723
     */
    static switchedToTraceLog(e) {
        App.workerFtn("ProjectFolder", "drawFolder", "TraceLog", ProjectFolder.date, undefined, ...TraceLog.getOptions("traceLogDashboard"));
    }

    /**
     * Feedback from the Web Worker that the project folder notification has to be updated.   --- UPDATED (Dexter) 20180525
     * @param {*} nofMsgs - Parameters for calling the AppNotification.update(): title, msg, icon
     */
    static readingError(...nofMsgs) {
        AppNotification.update(ProjectFolder.nf, ...nofMsgs, true);
        App.gotoPage("startScreen");
    }

    /**
     * Feedback from the Web Worker that the project folder reading has finished.   --- UPDATED (Dexter) 20180525
     */
    static finishReadIn() {
        AppNotification.update(ProjectFolder.nf, "frFinishT", "", "folder.svg", true);
    }
}

/** Class representing a result option.   --- UPDATED (Dexter) 20180802 */
class ResultOptions {
    constructor() {
        this.changed = false;
    }

    /**
     * Update the attribute of the ResultOptions.   --- UPDATED (Dexter) 20180802
     * @param {String} attr - The attribute key to be updated.
     * @param {*} val - The value to be set as.
     */
    setAttribute(attr,val) {
        if (this[attr] != val) this.changed = true;
        this[attr] = val;
    }

    /**
     * Get the latest changed ResultOptions object if it has.   --- UDPATED (Dexter) 20180802
     * @returns {ResultOptions|null} - Return this object and renew the change status, return null if this is not changed as before.
     */
    flushNew() {
        if (this.changed) {
            this.changed = false;
            return this;
        } else {
            return null;
        }
    }
}

/** Class representing a dashboard option.   --- UPDATED (Dexter) 20180722 */
class DashBoardOptions extends ResultOptions {
    /** 
     * Create a dashboard option.   --- UPDATED (Dexter) 20180802
     */
    constructor() {
        super();
        this.fontSize = "auto";
        this.showLegend = true;
    }
}

/** Class representing an data option.   --- UPDATED (Dexter) 20181120 */
class DataOptions extends ResultOptions {
    /**
     * Create a data option.   --- UPDATED (Dexter) 20181120
     */
    constructor() {
        super();
        this.build = [];
        this.runNo = [];
        this.cvNo = []; // no record for auto; -1 for test.
    }
}

/** Class representing a dashboard item, like a training log or weight graph.   --- UPDATED (Dexter) 20180722 */
class DashboardItem {
    /**
     * Create a dashboard to be shown.   --- UPDATED (Dexter) 20180722
     * @param {String} id - The id of the dashboard item that this result is displaying.
     * @param {String} type - The sub-class name.
     * @param {Bool} submittable - Whether only super class of this DashboardItem would be enough for constructing an item in the worker, and to submit and create in the worker.
     */
    constructor(id, type, submittable=false) {
        const obj = this.obj = $(id);
        this.id = id;
        this.idx = DashboardItem.all(type).size;
        this.type = type;
        this.nf = null;

        // Sub-class need to create all necessary variables and submit the the worker on themselves.
        if (submittable) this.createInWorker();
    }

    /**
     * Send to the worker to create this item.   --- UPDATED (Dexter) 20180722
     */
    createInWorker() {
        App.workerFtn(this.type, "create", this.id);
    }

    /**
     * Show a notification regarding this graph item.   --- UPDATED (Dexter) 20180525
     * @param {Boolean} isNew - Whether this is a new notification
     * @param {String} title - Title of this notification (A translate content key)
     * @param {String} msg - Message of this notification (A translate content key)
     * @param {String} icon - The icon of this notification
     * @param {Boolean} cancellable - Whether the notification can be cancelled by the user
     */
    showNotification(isNew, title, msg, icon, cancellable) {
        if (isNew) {
            // If it's new but there are previous notification, close it.
            if (this.nf) AppNotification.toClose(this.nf);

            // Show the new notification.
            var nf = AppNotification.show(title, msg, icon, cancellable);

            // Remember this notification if this is not cancellable.
            if (!cancellable) this.nf = nf;
        } else {
            // Show the new notification.
            var nf = AppNotification[this.nf ? "update" : "show"](this.nf, title, msg, icon, cancellable);
            
            // Remember this notification if this is not cancellable.
            if (!cancellable) this.nf = nf;
        }
    }

    /**
     * Remove this graph item from its sub-call .all list.   --- UPDATED (Dexter) 20180525
     */
    remove() {
        // Remove from .all 
        App.workerFtn(this.type, "remove", id);
        this.obj.remove();
        DashboardItem.all(this.type).delete(this.id);
    }

    /**
     * Clear all dashboard. Actions specified in sub-classes.   --- UPDATED (Dexter) 20180722
     * @param {*} item 
     */
    clear() {
    }
    
    /**
     * Called when the GraphItem needs to be redrawn .   --- UPDATED (Dexter) 201800802
     */
    update() {
        App.workerFtn("DashboardItem", "redraw", this.id, this.dashBoardOptions, this.dataOptions, true);
    }

    /**
     * Show notification to user regarding the graph is creating.   --- UPDATED (Dexter) 20180725
     */
    creatingGraph() {
        this.obj.classList.add("noShow");
        this.showNotification(true, "creatingGraphT", "", "trainLog.svg", false);
    }

    /**
     * Update notification to user regarding the graph has been created.   --- UPDATED (Dexter) 20180725
     */
    createdGraph() {
        this.obj.classList.remove("noShow");
        this.showNotification(false, "createdGraphT", "", "trainLog.svg", true);
    }

    /**
     * Update notification to user regarding no data record can be displayed.   --- UPDATED (Dexter) 20180527
     */
    noRecords() {
        this.showNotification(false, "noDataRecordsT", "noDataRecordsC", "warning.svg", true);
    }

    /**
     * Update notification to tell user that the graph can't be created because of too many data.   --- UPDATED (Dexter) 20180527
     */
    tooMuchData() {
        this.showNotification(false, "tooMuchDataT", "", "cancel.svg", true);
    }

    /**
     * Get all of the displaying graph items in a sub class.   --- UPDATED (Dexter) 20180722
     * @param {String} type - The sub-class name
     * @returns {Map} The map of all graph items using key (SVG element) value (GraphItem objects) pairs
     */
    static all(type) {
        if (type == "TrainLog") return TrainLog.all;
        else if (type == "WeightGraph") return WeightGraph.all;
        else if (type == "TraceLog") return TraceLog.all;
    }

    /**
     * Get the DashboardItem object from the dashboard HTML element.   --- UPDATED (Dexter) 20180722
     * @param {String} id - The container id of the Dashboard item.
     * @returns {DashboardItem} - The returned DashboardItem object.
     */
    static get(id) {
        return TrainLog.all.get(id) || WeightGraph.all.get(id) || TraceLog.all.get(id);
    }

    /**
     * Initiation after the app is loaded.   --- UPDATED (Dexter) 20180727
     */
    static initiate() {
        // Initiate all subclasses.
        TrainLog.initiate();
        WeightGraph.initiate();
        TraceLog.initiate();

        // Initate the setting panels.
        [...$("dataOnHid").children].forEach(ele=>{
            ele.addEventListener("dragstart", DashboardItem.startDragCol, false);
            ele.addEventListener("drop", DashboardItem.replaceCol, false);
            ele.addEventListener("dragover", DashboardItem.dragOverCol, false);
            ele.addEventListener("dragenter", App.dragEnterEle, false);
            ele.addEventListener("dragleave", App.dragLeaveEle, false);
        });
        $("dataOnPri", "dataOnOth", "dataOnHid").forEach(ele=>{
            ele.addEventListener("drop", DashboardItem.dropCol, false);
            ele.addEventListener("dragover", DashboardItem.dragOverCol, false);
            ele.addEventListener("dragenter", App.dragEnterEle, false);
            ele.addEventListener("dragleave", App.dragLeaveEle, false);
        });

        // Add event listener on chaning the graph properties.
        $("optAutoAxis", "optTrainFontSize", "optTrainShowLeg", 
        "optWeightFontSize", "optWeightShowLeg", "optWeightColor",
        "optTraceTar", "optTrainLogRunNoMore", "optWeightGraphRunNoMore",
        "optTrainLogCVNoMore", "optWeightGraphCVNoMore").forEach(ele=>ele.addEventListener("change", DashboardItem.updateOptions, false));

        $("optTrainLogRunNo", "optWeightGraphRunNo").forEach(ele=>ele.addEventListener("change", GraphItem.updateRunNoAuto, false));
        $("optTrainLogCVNo", "optWeightGraphCVNo").forEach(ele=>ele.addEventListener("change", GraphItem.updateCVNoAuto, false));
    }

    /**
     * Toggle the display of graph settings.   --- UPDATED (Dexter) 20180525
     * @param {Event} e - A click event, typically from $("settingsBtn")
     */
    static showSettings(e) {
        stopPropagate(e);
        
        // Show the right panel of graph settings.
        ContextMenu.show("graphSettings", true);

        // Control the display of which properties window to be shown.
        const displayingItem = DashboardItem.get(this.dataset.id || [...$("dashBoard").children].find(ele=>!ele.classList.contains("noDisplay")).id);
        const displayingType = classof(displayingItem);
        [...$("graphSettings").getElementsByClassName("propWin")].forEach(ele=>{
            if (ele.id.endsWith(displayingType)) ele.classList.remove("noDisplay");
            else ele.classList.add('noDisplay');
        });

        // Provide the header name.
        const langType = "db"+displayingType;
        $("dbOptionTitle").innerText = App.getTxtFromLang(langType);
        $("dbOptionTitle").dataset.lt = langType;
        $("graphSettings").dataset.for = displayingItem.id;

        if (displayingType == "TrainLog") {
            // Apply Properties.
            App.applyPropVal($("optAutoAxis"), displayingItem.dataOptions.yAxisType == "auto");
            App.applyPropVal($("optTrainFontSize"), displayingItem.dashBoardOptions.fontSize);
            App.applyPropVal($("optTrainShowLeg"), displayingItem.dashBoardOptions.showLegend);

            // Set the axis data.
            var rmvCols = [...$("dataOnPri").children, ...$("dataOnOth").children];
            rmvCols.forEach(ele=>{
                $("dataOnHid").appendChild(ele.parentElement.removeChild(ele));
            });

            var allCols = [...$("dataOnHid").children];
            displayingItem.dataOptions.y1.forEach(v=>{
                var toEle = allCols.find(ele=>ele.dataset.val == v);
                $("dataOnPri").appendChild(toEle.parentElement.removeChild(toEle));
            });
            displayingItem.dataOptions.y2.forEach(v=>{
                var toEle = allCols.find(ele=>ele.dataset.val == v);
                $("dataOnOth").appendChild(toEle.parentElement.removeChild(toEle));
            });

        } else if (displayingType == "WeightGraph") {
            // Apply Properties.
            App.applyPropVal($("optWeightColor"), JSON.stringify(displayingItem.dashBoardOptions.channel));
            App.applyPropVal($("optWeightFontSize"), displayingItem.dashBoardOptions.fontSize);
            App.applyPropVal($("optWeightShowLeg"), displayingItem.dashBoardOptions.showLegend);
        } else if (displayingType == "TraceLog") {
            // Apply Properties.
            App.applyPropVal($("optTraceTar"), displayingItem.dashBoardOptions.displayTarget);
        }
    }

    /**
     * Start to drag a column name and assign necessary data.   --- UPDATED (Dexter) 20180802
     * @param {Event} e - Typically a `dragstart` event of dragging a column name.
     */
    static startDragCol(e) {
        e.dataTransfer.setData("text", e.target.dataset.val);
    }
    
    /**
     * Allow a drop action when one is dragging over this element.   --- UPDATED (Dexter) 20180802
     * @param {Event} e - Typically a `dragover` event of dragging a column name.
     */
    static dragOverCol(e) {
        e.preventDefault();
    }

    /**
     * Replace a originally positioned column by the newly droped column.   --- UPDATED (Dexter) 20180802
     * @param {Event} e - Typically a `drop` event on a column item.
     */
    static replaceCol(e) {
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        App.dragResetEle(e);
        const onVal = e.dataTransfer.getData("text");
        if (this.dataset.val != onVal) {
            var rmvCols = [...$("dataOnPri").children, ...$("dataOnOth").children, ...$("dataOnHid").children];
            var fromEle = rmvCols.find(ele=>ele.dataset.val == onVal);
            this.parentElement.insertBefore(fromEle.parentElement.removeChild(fromEle), this);
            DashboardItem.updateCols();
        }
    }

    /**
     * Drop a column newly added to a drop region.   --- UPDATED (Dexter) 20180802
     * @param {Event} e - Typically a `drop` event on an axis definition region.
     */
    static dropCol(e) {
        e.preventDefault(); 
        App.dragResetEle(e);
        var rmvCols = [...$("dataOnPri").children, ...$("dataOnOth").children, ...$("dataOnHid").children];
        var fromEle = rmvCols.find(ele=>ele.dataset.val == e.dataTransfer.getData("text"));
        this.appendChild(fromEle.parentElement.removeChild(fromEle));
        DashboardItem.updateCols();
    }

    /**
     * Update the columns details for the dashboard.   --- UPDATED (Dexter) 20180803
     */
    static updateCols() {
        // Get the dashboard item and the property attribute.
        const forID = $("graphSettings").dataset.for;
        const dashBoardItem = DashboardItem.get(forID);

        // Update the y1/y2 items.
        dashBoardItem.dataOptions.setAttribute("y1", [...$("dataOnPri").children].map(ele=>ele.dataset.val));
        dashBoardItem.dataOptions.setAttribute("y2", [...$("dataOnOth").children].map(ele=>ele.dataset.val));

        // Ask the worker to update the dashboard.
        dashBoardItem.update();
    }

    /**
     * Update options from user settings.   --- UPDATED (Dexter) 20180802
     * @param {Event} e - Typically a `change` event from 
     */
    static updateOptions(e) {
        // Get the dashboard item and the property attribute.
        const forID = $("graphSettings").dataset.for;
        const dashBoardItem = DashboardItem.get(forID);
        const prop = this.dataset.prop;
        const toVal = this.tagName == "INPUT" ? this.dataset.val : this.tagName == "SELECT" && !this.multiple ? this.selectedOptions[0].dataset.val : this.tagName == "SELECT" ? [...this.selectedOptions].map(opt=>opt.dataset.val) : "";

        // Update the options accordingly.
        if (prop == "fontSize") dashBoardItem.dashBoardOptions.setAttribute("fontSize", toVal == "auto" ? toVal : Number(toVal));
        else if (prop == "showLegend") dashBoardItem.dashBoardOptions.setAttribute("showLegend", this.dataset.val == "1");
        else if (prop == "autoAxis") dashBoardItem.dataOptions.setAttribute("yAxisType", this.dataset.val == "1" ? "auto" : "none");
        else if (prop == "channel") dashBoardItem.dashBoardOptions.setAttribute("channel", JSON.parse(toVal));
        else if (prop == "displayTarget") dashBoardItem.dashBoardOptions.setAttribute("displayTarget", toVal);
        else if (prop == "runNo") dashBoardItem.dataOptions.setAttribute("runNo", toVal);
        else if (prop == "cvNo") dashBoardItem.dataOptions.setAttribute("cvNo", toVal);

        // Ask the worker to update the dashboard.
        dashBoardItem.update(!["channel"].includes(prop));
    }
}

/** Class representing a graph item, like a training log or weight graph.   --- UPDATED (Dexter) 20180525 */
class GraphItem extends DashboardItem {
    /**
     * Create a graph item to be shown on SVG.   --- UPDATED (Dexter) 20180525
     * @param {String} id - The SVG item that this graph item is displaying
     * @param {String} type - The sub-class name
     * @param {Boolean} arbitrarySize - Whether the SVG is arbitrarily sized
     */
    constructor(id, type, arbitrarySize = false) {
        super(id, type);
        this.arbitrarySize = arbitrarySize;

        // Get the current SVG size and adjust the SVG viewbox.
        const obj = this.obj;
        const w = this.width = arbitrarySize ? (obj.clientWidth || Number(window.getComputedStyle(this.obj).width.slice(0,-2))) : obj.width.baseVal.value;
        const h = this.height = arbitrarySize ? (obj.clientHeight || Number(window.getComputedStyle(this.obj).height.slice(0,-2))) : obj.height.baseVal.value;
        obj.setAttribute("viewBox", "0 0 " + w + " " + h);

        this.createInWorker();

        // Attach to a context menu.
        this.obj.addEventListener("contextmenu", GraphItem.toShowCM.bind(this), false);
    }
    
    /**
     * Send to the worker to create this item.   --- UPDATED (Dexter) 20180722
     */
    createInWorker() {
        App.workerFtn(this.type, "create", this.id, this.width, this.height);
    }

    /**
     * Called when the GraphItem needs to be redrawn .   --- UPDATED (Dexter) 20181120
     * @param {Boolean} forceRefresh - Whether to force an update on all elements of the SVG.
     */
    update(forceRefresh=true) {
        App.workerFtn("DashboardItem", "redraw", this.id, this.dashBoardOptions, this.dataOptions, forceRefresh);
    }

    /**
     * Draw a list of elements on the SVG.   --- UPDATED (Dexter) 20180726
     * @param {PreSVGElement[]} eleList - The list of pre-SVG elements to be drawn
     * @param {Function} ftn - A follow-up function when an element is drawn
     */
    draw(eleList, ftn=null) {
        // For each elements, draw on the SVG.
        eleList.forEach(ele=>{
            // Create the SVG element
            var e = document.createElementNS("http://www.w3.org/2000/svg", ele.type);

            // Assign the attributes, datasets, and class to the element
            ele.attr.forEach((v,k)=>e.setAttribute(k,v));
            ele.dataset.forEach((v,k)=>(e.dataset[k]=v));
            ele.class.forEach(v=>e.classList.add(v));
            ele.clearClass.forEach(v=>e.classList.remove(v));

            // The ID will be unique, concat the graph item id and the draw.js assigned id.
            e.id = this.id + "-" + ele.id;

            // If it is a text, fill in its text content. Noted it should use translated text if needed.
            if ((ele.type == "text" || ele.type == "tspan") && (ele.textContent || e.dataset.lt)) {
                if (e.classList.contains("lt")) {
                    if (!ele.dataset.ltTemp) delete ele.dataset.ltTemp;
                    App.applyEleLang(e);
                } else {
                    e.textContent = ele.textContent;
                }
            }

            if (!ele.appendIn) {
                // If there is no request on appending to a specific object, just append to the SVG object.
                this.obj.appendChild(e);
            } else {
                // Otherwise, append to the specific object.
                $(this.id + "-" + ele.appendIn).appendChild(e);
            }

            // Call the follow-up action if needed. The pre-SVG element info with the newly created element will be passed as paramenters.
            if (ftn) ftn(ele,e);
        })
    }

    /**
     * Re-draw a list of elements on the SVG.   --- UPDATED (Dexter) 20180803
     * @param {PreSVGElement[]} eleList - The list of pre-SVG elements to be drawn
     * @param {Function} ftn - A follow-up function when an element is drawn
     */
    redraw (eleList, ftn=null) {
        // Partition the requested list to check if they have really draw or not.
        var drawnList = eleList.filter(ele=>$(this.id + "-" + ele.id));
        var nonDrawn = eleList.filter(ele=>!drawnList.includes(ele));

        // In case there are any nondrwan items, call the draw function to create the elements from the beginning.
        if (nonDrawn.length) this.draw(nonDrawn, ftn);

        // For each redraw elements, update their properties.
        drawnList.forEach(ele=>{
            var e = $(this.id + "-" + ele.id);
            ele.attr.forEach((v,k)=>e.setAttribute(k,v));
            ele.class.forEach(v=>e.classList.add(v));
            ele.clearClass.forEach(v=>e.classList.remove(v));
            if (ele.dataset.size) {
                ele.dataset.forEach((v,k)=>(e.dataset[k]=v));
            }
            if (ele.textContent) {
                if (e.classList.contains("lt")) {
                    if (!ele.dataset.ltTemp) delete ele.dataset.ltTemp;
                    App.applyEleLang(e);
                } else {
                    e.textContent = ele.textContent;
                }
            }
            if (ele.appendIn && (this.id + "-" + ele.appendIn) != e.parentElement.id) {
                $(this.id + "-" + ele.appendIn).appendChild($(e.parentElement.id).removeChild(e));
            }
        });
    }

    /**
     * Reset or initiate all necessary variables that will affect the pointer interactions with the graph.   --- UPDATED (Dexter) 20180525
     */
    resetPointerActions() {
    }

    /**
     * Clear all elements in this SVG and reset all interaction settings.   --- UPDATED (Dexter) 20180525
     * @param {*} item 
     */
    clear() {

        if (this.obj.childNodes.length > 0) {
            while (this.obj.lastChild) {
                this.obj.removeChild(this.obj.lastChild);
            }
        }
        this.resetPointerActions();
    }

    /**
     * Remove a list of element using id referencing.   --- UPDATED (Dexter) 20180525
     * @param {String[]} eleList - A list of element ids
     */
    removeEle(eleList) {
        // If the count is small, just remove now.
        if (eleList.length < 80) {
            eleList.forEach(id=>{
                if ($(this.id + "-" + id)) $(this.id + "-" + id).remove();
            })
        } else {
            // Otherwise, prepare a batched element removeal for each 80 elements.
            function stagedRemove() {
                // Update the current removing element list.
                var removal = eleList.slice(-80);
                eleList = eleList.slice(0,-80);

                // Remove the sliced short list of elements.
                removal.forEach(id=>{
                    $(this.id + "-" + id).remove();
                })

                // If there are still elements, remove that after a frame update.
                if (eleList.length > 0) window.requestAnimationFrame(stagedRemove.bind(this));
            }
            stagedRemove.bind(this)();
        }
    }

    /**
     * Called when a window.resize takes place, ref: App.resize() .   --- UPDATED (Dexter) 20180804
     */
    resize() {
        if (this.arbitrarySize && window.getComputedStyle(this.obj).display != "none" && (this.obj.clientWidth || Number(window.getComputedStyle(this.obj).width.slice(0,-2))) > 0) {
            const w = this.width = (this.obj.clientWidth || Number(window.getComputedStyle(this.obj).width.slice(0,-2))) ;
            const h = this.height = (this.obj.clientHeight || Number(window.getComputedStyle(this.obj).height.slice(0,-2)));
            this.obj.setAttribute("viewBox", "0 0 " + w + " " + h);
            App.workerFtn(this.type, "resize", this.id, w, h);
        }
    }
    
    /**
     * Fired when right clicking a graph item to show the context menu.   --- UPDATED (Dexter) 20180726
     * @param {Event} e - A contextmenu event, typically arised from right clicking a graph item.
     */
    static toShowCM(e) {
        e.preventDefault();
        ContextMenu.show("cmGraphItem", true, {x: e.pageX, y: e.pageY, pointerType: e.pointerType});
    }

    /**
     * Show the SVG graph as an image in a flyout.   --- UPDATED (Dexter) 20180804
     * @param {Event} e - A click event, typically arised from right clicking the $("cmGIView") button.
     */
    static showAsImage(e) {
        ContextMenu.closeAll();

        // Get the currnet dashboard item.
        const displayingItem = DashboardItem.get([...$("dashBoard").children].find(ele=>!ele.classList.contains("noDisplay")).id);
       
        // Show the image preview flyout.
        ContextMenu.show("imgPreview", true, {x: e.pageX, y: e.pageY, pointerType: e.pointerType});
        
        // Resize the $("graphImgEle") for the flyout positioning, and get the image url for displaying the image.
        App.nextFrame().then(e=>{
            const imgW = $("graphImgEle").parentElement.clientWidth;
            $("graphImgEle").style.height = imgW/displayingItem.width * displayingItem.height + "px";
            GraphItem.getImageURL(displayingItem).then(url=>$("graphImgEle").src = url);
        });
    }

    /**
     * Download a GraphItem SVG as an png image.   --- UPDATED (Dexter) 20180804
     * @param {Event} e - A click event, typically arised from Download as Image buttons.
     */
    static saveAsImage(e) {
        ContextMenu.closeAll();

        // Get the currnet dashboard item.
        const displayingItem = DashboardItem.get([...$("dashBoard").children].find(ele=>!ele.classList.contains("noDisplay")).id);
        
        // Get the URL and save it.
        GraphItem.getImageURL(displayingItem).then(url=>{
            // Noted: Edge 17 has bug: can't open picture data url using <a> download link.
            if (navigator.msSaveOrOpenBlob) {
                var imgURL = url.replace("data:image/png;base64,","");
                var bytes = atob(imgURL);
                var byteArrays = [];
                for (var i = 0; i < bytes.length; i += 512) {
                    var byteSlice = bytes.slice(i, i + 512);
                    var byteArray = new Uint8Array([...byteSlice].map(c=>c.charCodeAt(0)));
                    byteArrays.push(byteArray);
                }
                var blob = new Blob(byteArrays, {type: "image/png"});
                navigator.msSaveOrOpenBlob(blob, App.getTxtFromLang("graphImg") + ".png");
            } else {
                $("downloadHolder").href = url;
                $("downloadHolder").download = App.getTxtFromLang("graphImg") + ".png";
                $("downloadHolder").click();
            }
        });
    }

    /**
     * An async method to get the image url of a currently displaying dashboard item.   --- UPDATED (Dexter) 20180804
     * @param {GraphITem} displayingItem - The displaying graph item to be converted.
     */
    static async getImageURL(displayingItem) {
        return new Promise(resolve=>{
            // Get the current dashboard svg and svg styling css.
            const innerSVG = $(displayingItem.id).innerHTML;
            fetch(App.getAppLocation() + "styleSVG.css?rand=" + Math.random()).then(r=>r.text()).then(css=>{
                // Create the svg in a virtual image element, and prepare to draw it on a canvas.
                const w = displayingItem.width, h = displayingItem.height;
                var imgEle = new Image();
                var canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                var ctx = canvas.getContext('2d');
                const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
                                    <style type="text/css"><![CDATA[
                                        ${css}
                                    ]]></style>
                                    ${innerSVG}
                                </svg>`;
                
                // After the svg image is rendered, render it in canvas.
                imgEle.onload = function() {
                    // Draw the vitual image (svg) onto a canvas.
                    ctx.drawImage(imgEle, 0, 0);

                    // Create a url from this canvas and show onto the image element.
                    var url = canvas.toDataURL();
                    resolve(url);
                }

                // Set the virtual image as this svg image.
                imgEle.src = "data:image/svg+xml," + encodeURIComponent(data);
            });
        });
    }

    /**
     * Update the status of the auto run no. in the properties pane.   --- UPDATED (Dexter) 20181121
     * @param {Event} e - The initiating event, typically a change event.
     */
    static updateRunNoAuto(e) {
        if (this.selectedOptions[0].dataset.val == "all") {
            // Get the dashboard item and the property attribute.
            const forID = $("graphSettings").dataset.for;
            const dashBoardItem = DashboardItem.get(forID);
            dashBoardItem.dataOptions.setAttribute("runNo", []);

            // Ask the worker to update the dashboard.
            dashBoardItem.update();
            
            // Hide the multi-selection box.
            $(this.dataset.forDetail).classList.add("noDisplay");
        } else {
            // Show the multi-selection box for details.
            $(this.dataset.forDetail).classList.remove("noDisplay");
        }
    }

    /**
     * Update the status of the auto run no. in the properties pane.   --- UPDATED (Dexter) 20181121
     * @param {Event} e - The initiating event, typically a change event.
     */
    static updateCVNoAuto(e) {
        if (this.selectedOptions[0].dataset.val == "testRound") {
            // Get the dashboard item and the property attribute.
            const forID = $("graphSettings").dataset.for;
            const dashBoardItem = DashboardItem.get(forID);
            dashBoardItem.dataOptions.setAttribute("cvNo", []);

            // Ask the worker to update the dashboard.
            dashBoardItem.update();

            // Hide the multi-selection box.
            $(this.dataset.forDetail).classList.add("noDisplay");
        } else {
            // Show the multi-selection box for details.
            $(this.dataset.forDetail).classList.remove("noDisplay");
        }
    }
}

/** Class representing train log options.   --- UPDATED (Dexter) 20180803 */
class TrainLogGraphOptions extends DashBoardOptions {
    constructor() {
        super();
        this.dualAxis = true; 
        this.graphSize = "auto";
        this.movingAverageType = "opacity"; 
        this.hueStart = Math.floor(Math.random() * 360);
    }
}

/** Class representing options for a train log, typically data extraction related options.   --- UPDATED (Dexter) 20180803 */
class TrainLogDataOptions extends DataOptions {
    constructor() {
        super();
        this.onSVG = "dashBoardSVG";
        this.y1 = ["Average Loss", "Tests+++"];
        this.x = "Global Step"; 
        this.y2 = ["Learning Rate***"];
        this.movingAvg = new Map([["Average Loss","auto"],["Total Loss","auto"],["Tests+++","auto"],["Examples per Second","auto"],["Seconds per Step","auto"]]);
        this.yAxisType = "auto";
        this.y1Min = "auto"; this.y1Max = "auto"; this.y1Interval = "auto";
        this.xMin = "auto"; this.xMax = "auto"; this.xInterval = "auto";
        this.xOnY1 = "auto";
        this.y2Min = "auto"; this.y2Max = "auto"; this.y2Interval = "auto";
        this.showRange = "shadow";  // "shadow"/"shadowbox"/false
        this.showDev = true;
        this.mvAvgStep = .3;
    }
}

/** Class representing a train log, a line chart representation for different measurements in trainlog or testlog.   --- UPDATED (Dexter) 20180525 */
class TrainLog extends GraphItem {
    /**
     * Create a train log to be shown on SVG.   --- UPDATED (Dexter) 20180525
     * @param {String} id - The SVG item that this graph item is displaying
     * @param {Boolean} arbitrarySize - Whether the SVG is arbitrarily sized
     */
    constructor(id, arbitrarySize = false) {
        super(id, "TrainLog", arbitrarySize);

        // Reset dashboard options.
        var dashBoardOptions = new TrainLogGraphOptions();
        this.dashBoardOptions = Object.assign(dashBoardOptions, TrainLog.currentOptions);
        var dataOptions = new TrainLogDataOptions();
        this.dataOptions = Object.assign(dataOptions, TrainLog.currentDataOptions);

        // Initiate all pointer actions, and add event for users to interact with data line info.
        this.resetPointerActions();
        this.obj.addEventListener("pointermove", this.showInfo.bind(this), false);
        this.obj.addEventListener("contextmenu", this.clearHoveringInfo.bind(this), false);
    }
    
    /**
     * Reset or initiate all necessary variables that will affect the pointer interactions with the graph.   --- UPDATED (Dexter) 20180525
     */
    resetPointerActions() {
        // Below prepares the dataline information for users to interact with data line info.
        this.dlInfos = new Map(); 
        this.plotTop = this.plotBottom = this.plotLeft = this.plotRight = 0;
    }
    
    /**
     * Display data line information if needed.   --- UPDATED (Dexter) 20180525
     * @param {PointerEvent} e - A pointer move event typically from this SVG element
     */
    showInfo(e) {
        e.stopPropagation();

        // Get the pointer position relative to the SVG element.
        const bbox = this.obj.getBoundingClientRect();
        const offsetX = e.pageX - bbox.left, offsetY = e.pageY - bbox.top;

        // Get the vertical data hover lines, linking the x-axis with a data line.
        var hoverLines = this.obj.getElementsByClassName("hoverLine"), hoverPoints = this.obj.getElementsByClassName("hoverPoint");
        if (hoverLines.length) {
            // Ensure there are some dataline info for checking up hovering interactions.
            if (this.dlInfos.size) {
                // Provides actions only when pointer position is within the plot area.
                if (offsetY >= this.plotTop && offsetY <= this.plotBottom && offsetX >= this.plotLeft && offsetX <= this.plotRight) {
                    var showInfo = new Map(),nearestXKey,nearestX=Infinity, touchCount=0, showX = 0, posX = 0, posY = window.innerHeight, showInterval = (this.plotBottom-this.plotTop)/10;
                    // Each dataline info contains all necessary positions to interact with the pointer.
                    this.dlInfos.forEach((dlInfo,dlKey)=>{
                        
                        // Display the hover line.
                        $(this.id + "-hoverLine_"+dlKey).setAttribute("opacity", 1);
                        $(this.id + "-hoverPoint_"+dlKey).setAttribute("opacity", 1);

                        // Check which x is now, by comparing the interval list in dlInfo.hoverList .
                        const idx = dlInfo.hoverList.findIndex((hl,idx,list)=>offsetX >= list[idx] && offsetX <= list[idx+1]);
                        const dataPoint = dlInfo.dataPoints[idx];
                        if (isNaN(dataPoint.atY)) dataPoint.atY = this.plotBottom;

                        // Adjust the hover line, get the current x position, and the length should be from x axis to the data point.
                        $(this.id + "-hoverLine_"+dlKey).setAttribute("d", `M ${dataPoint.atX} ${dataPoint.atY} L ${dataPoint.atX} ${this.plotBottom}`);
                        $(this.id + "-hoverPoint_"+dlKey).setAttribute("cx", dataPoint.atX);
                        $(this.id + "-hoverPoint_"+dlKey).setAttribute("cy", dataPoint.atY);

                        // Suppose the pointer does not touch the line.
                        var touchLine = false;

                        // Check if the pointer is between the y interval arond the data point; also display in case the current info flyout is already displayed.
                        if ((touchLine = offsetY >= dataPoint.atY-showInterval && offsetY <= dataPoint.atY+showInterval) || ContextMenu.list.includes(this.id+"-plotInfo")) {
                            // In case of touched criteria matched, increment the touch count for later use.
                            if (touchLine) touchCount++;

                            // Determine the highest position Y of all touched points, by comparing with previously stored posY.
                            posY = (touchCount == 1 && touchLine) ? dataPoint.atY : (!touchCount || touchLine) ? Math.min(posY, dataPoint.atY) : posY;

                            // Record necessary information that it may be shown on the data point flyout.
                            showInfo.set(dlKey, {touched: touchLine, info: dataPoint.valY, posX: dataPoint.atX, showX:  dataPoint.valX});
                        }

                    })

                    // If there is data info updates
                    if (showInfo.size) {

                        // Get the plot info flyout
                        const plotInfoID = this.id+"-plotInfo";
                        const plotInfoObj = $(plotInfoID);
                        
                        // Ensure the flyout has enough elements for displaying the data point data
                        var infoItems = [...plotInfoObj.getElementsByClassName("plotInfoItem")];
                        const valDiff = (infoItems.length-1) - (touchCount || showInfo.size);
                        if (valDiff > 0) {
                            for (let i=0; i<valDiff; i++) {
                                infoItems[infoItems.length-i-1].remove();
                            }
                        } else if (valDiff < 0) {
                            for (let i=0; i<Math.abs(valDiff); i++) {
                                var infoItem = $("plotInfoTem").cloneNode(true);
                                infoItem.removeAttribute("id");
                                plotInfoObj.getElementsByClassName("ctx")[0].appendChild(infoItem);
                            }
                        }

                        // The data point info (y-values) will be displayed from the second children (The first one is a template).
                        var cID = 1;
                        infoItems = [...plotInfoObj.getElementsByClassName("plotInfoItem")];
                        
                        // For each data info, assign the values to display.
                        showInfo.forEach((v,dlKey)=>{
                            if (!touchCount || v.touched){
                                const lineName = dlKey.split("_")[0];
                                var iLabel = infoItems[cID].getElementsByClassName("yLabel")[0];
                                TrainLog.setColNameAsInnerText(iLabel, lineName);
                                var iValue = infoItems[cID].getElementsByClassName("yValue")[0];
                                iValue.innerText = v.info;

                                // Display the x-info for only the axis data point which is nearest to the pointer.
                                const xDiff = Math.abs(offsetX-v.posX);
                                nearestX = Math.min(nearestX,xDiff)
                                if (nearestX == xDiff) {
                                    posX = v.posX
                                    showX = v.showX
                                }
                                cID ++;
                            }
                        });

                        // Display the x-value as well.
                        var xLabel = plotInfoObj.getElementsByClassName("xLabel")[0];
                        xLabel.innerText = $(this.id+"-xLabel").textContent;
                        xLabel.dataset.lt = $(this.id+"-xLabel").dataset.lt;
                        var xValue = plotInfoObj.getElementsByClassName("xValue")[0];
                        xValue.innerText = showX;

                        // Show the data info flyout.
                        ContextMenu.show(this.id+"-plotInfo", false, {x: posX+bbox.left, y: posY+bbox.top});

                    }
                } else {
                    // Remove the hover lines and close the info flyout if it is not in range.
                    this.clearHoveringInfo();
                    ContextMenu.close(this.id+"-plotInfo");
                }
            } 
        }
    }

    /**
     * Clear hovering SVG elements.   --- UPDATED (Dexter) 2070804
     */
    clearHoveringInfo() {
        var hoverLines = this.obj.getElementsByClassName("hoverLine"), hoverPoints = this.obj.getElementsByClassName("hoverPoint");
        [...hoverLines, ...hoverPoints].forEach(hl=>hl.setAttribute("opacity", 0));
    }

    /**
     * Set up pointer hovering information as data prepared from the "draw.js" Web Worker.   --- UPDATED (Dexter) 20180527
     * @param {Map(String,dlInfo)} dlInfos - Data line information
     * @param {dataPoint[]} dlInfo.dataPoints - A sorted list of data point information of one data line
     * @param {Number} dataPoint.atX - The x-coordinate of the data point on the SVG element
     * @param {Number} dataPoint.atY - The y-coordinate of the data point on the SVG element
     * @param {Number} dataPoint.valX - The value of x of the data point
     * @param {Number} dataPoint.valY - The value of y of the data point
     * @param {Number[]} dlInfo.hoverList - The x-position of the boundaries, including leftmost and rightmost, of all x segments of one data line
     * @param {Number} topmost - The y-coordinate of the upper boundary of the plot area on the SVG element.
     * @param {Number} bottommost - The y-coordinate of the lower boundary of the plot area on the SVG element.
     * @param {Number} leftmost - The x-coordinate of the left boundary of the plot area on the SVG element.
     * @param {Number} rightmost - The x-coordinate of the right boundary of the plot area on the SVG element.
     */
    setUpHover(dlInfos, topmost, bottommost, leftmost, rightmost) {
        this.dlInfos = dlInfos; 
        this.plotTop = topmost; this.plotBottom = bottommost;
        this.plotLeft = leftmost; this.plotRight = rightmost;
    }

    /**
     * Set up available runs and cross validations for properties pane selections.   --- UPDATED (Dexter) 20181121
     * @param {Number[]} availableRuns - The available list of run numbers.
     * @param {Number[]} availableCVs - The available list of cross validation numbers.
     */
    setUpRunCVOptions(availableRuns, availableCVs) {
        App.controlChildrenCount($("optTrainLogRunNoMore"), availableRuns.length, document.createElement("option"), null, undefined, (ele,idx) => {
            ele.dataset.val = ele.innerText = availableRuns[idx];
        });
        availableCVs = availableCVs.filter(ele=>ele!="-1");
        App.controlChildrenCount($("optTrainLogCVNoMore"), availableCVs.length, document.createElement("option"), null, undefined, (ele,idx) => {
            ele.dataset.val = ele.innerText = availableCVs[idx];
        });
    }

    /**
     * All of the displaying Trainlog graph items.   --- UPDATED (Dexter) 20180527
     */
    static get all() { return this._all; } static set all(v) { this._all = v; }

    /**
     * Current user dashboard option.   --- UPDATED (Dexter) 20180723
     */
    static get currentOptions() { return this._currentOptions; } static set currentOptions(v) { this._currentOptions = v; }

    /**
     * Current user data option.   --- UPDATED (Dexter) 20180723
     */
    static get currentDataOptions() { return this._currentDataOptions; } static set currentDataOptions(v) { this._currentDataOptions = v; }

    /**
     * Initiation after the app is loaded.   --- UPDATED (Dexter) 20180723
     */
    static initiate() {
        TrainLog.currentOptions = new TrainLogGraphOptions();
        TrainLog.currentDataOptions = new TrainLogDataOptions();
        TrainLog.all = new Map();
        TrainLog.all.set("dashBoardSVG", new TrainLog("dashBoardSVG", true));
    }

    /**
     * Resize all train logs.   --- UPDATED (Dexter) 20180804
     */
    static resizeAll() {
        TrainLog.all.forEach(db=>db.resize());
    }

    /**
     * Clear all train logs.   --- UPDATED (Dexter) 20180803
     */
    static clearAll() {
        TrainLog.all.forEach(db=>{
            db.clear()
            db.dashBoardOptions = Object.assign(db.dashBoardOptions, new TrainLogGraphOptions());
            db.dataOptions = new TrainLogDataOptions();
        });
        App.workerFtn("TrainLog", "clearAll");
    }

    /**
     * Get current user options.   --- UPDATED (Dexter) 20180803
     * @param {String} id - A Dashboard object id in case of returnning a specific option.
     */
    static getOptions(id="dashBoardSVG") {
        return [TrainLog.get(id).dashBoardOptions, TrainLog.get(id).dataOptions];
    }
    
    /**
     * Set the innertext as the name of a column.   --- UPDATED (Dexter) 20181111
     * @param {Element} ele - A HTML element.
     * @param {String} name - The name of the column.
     */
    static setColNameAsInnerText(ele, name) {
        if (name.indexOf(": ") == -1) {
            ele.dataset.lt = name;
            delete ele.dataset.ltTemp;
        } else {
            const actualName = name.split(": ");
            ele.dataset.lt = actualName[1];
            ele.dataset.ltTemp = actualName[0] + ": $$$";
        }
        App.applyEleLang(ele);
    }
}

/** Class representing weight dashBoard options.   --- UPDATED (Dexter) 20180722 */
class WeightGraphOptions extends DashBoardOptions {
    constructor() {
        super();
        this.step = "auto";
        this.fixedRange = false;
        this.channel = [[0,75,50,0], [0,0,50,.5],[120,0,50,.5], [120,75,50,1]];
    }
}

/** Class representing options for a train log, typically data extraction related options.   --- UPDATED (Dexter) 20180722 */
class WeightGraphDataOptions extends DataOptions {
    constructor() {
        super();
        this.sorted = false;
        this.weightItem = "auto";
    }
}

/** Class representing a weight graph, a grid color representation of weight logs.   --- UPDATED (Dexter) 20180525 */
class WeightGraph extends GraphItem {
    /**
     * Create a weight graph to be shown on SVG.   --- UPDATED (Dexter) 20180726
     * @param {String} id - The SVG item that this graph item is displaying
     * @param {Boolean} arbitrarySize - Whether the SVG is arbitrarily sized
     */
    constructor(id, arbitrarySize = false) {
        super(id, "WeightGraph", arbitrarySize);
        
        // Reset dashboard options.
        var dashBoardOptions = new WeightGraphOptions();
        this.dashBoardOptions = Object.assign(dashBoardOptions, WeightGraph.currentOptions);
        var dataOptions = new WeightGraphDataOptions();
        this.dataOptions = Object.assign(dataOptions, WeightGraph.currentDataOptions);

        // Initiate all pointer actions, and add events for users adjusting the step shown on weight graph.
        this.resetPointerActions();
        this.obj.addEventListener("pointermove", this.changeStep.bind(this), false);
    }

    /**
     * Draw a list of elements on the SVG.   --- UPDATED (Dexter) 20180525
     * @param {PreSVGElement[]} eleList - The list of pre-SVG elements to be drawn
     */
    draw(eleList) {
        // Noted for weightgraphs, elements may have special events, and would need to add after the super.draw() finishes for each element.
        super.draw(eleList, this.addEvent.bind(this));
    }

    /**
     * Re-draw a list of elements on the SVG.   --- UPDATED (Dexter) 20180525
     * @param {PreSVGElement[]} eleList - The list of pre-SVG elements to be drawn
     */
    redraw(eleList) {
        // Noted for weightgraphs, elements may have special events, and would need to add after the super.draw() finishes for each element.
        super.redraw(eleList, this.addEvent.bind(this));
    }

    /**
     * Actions follow-up from every element created on the SVG.   --- UPDATED (Dexter) 20180527
     * @param {PreSVGElement} eleInfo - The PreSVGElement information
     * @param {Element} ele - The SVG element created
     */
    addEvent(eleInfo,ele) {
        if (eleInfo.id.startsWith("grid_")) {
            // If it's a grid, add pointermove event to allow display of grid information to the user.
            ele.addEventListener("pointermove", this.displayGridInfo, false);
        } else if (eleInfo.id.includes("weightGraphTitle")) {
            // If it's the title, add click event to allow weight switching.
            ele.addEventListener("click", this.switchWeightCol, false);
        }
    }

    /**
     * Display the weight grid data information on hovering the grid.   --- UPDATED (Dexter) 20180527
     * @param {PointerEvent} e - A pointermove event, typically from moving on a weight grid SVG element.
     */
    displayGridInfo(e) {
        // Get the grid info flyout id, the concat of the weight graph SVG element id and "-weightInfo".
        const toObjID = this.id.split("-")[0]+"-weightInfo";

        // Get the grid dimensional information.
        const gridInfo = JSON.parse(this.id.split("grid_")[1]);

        // Display the values on the flyout.
        $(toObjID).getElementsByClassName("aryValue")[0].innerText = gridInfo.join("][");
        $(toObjID).getElementsByClassName("weightVal")[0].innerText = this.dataset.val;

        // Display the flyout.
        ContextMenu.show(toObjID, false, {x:e.pageX, y: e.pageY});
    }

    /**
     * Show the selection of different weights/biases.   --- UPDATED (Dexter) 20180527
     * @param {Event} e - A click event, typically from the graph title.
     */
    switchWeightCol(e) {
        e.stopPropagation();

        // Only show when there are more than 1 weight/bias.
        if ($("weightCols").getElementsByClassName("ctx")[0].children.length > 1)  {
            ContextMenu.show("weightCols", true, {x:e.pageX, y: e.pageY});
        }
    }
    
    /**
     * Reset or initiate all necessary variables that will affect the pointer interactions with the graph.   --- UPDATED (Dexter) 20180525
     */
    resetPointerActions() {
        // Below the setup for which weight to be shown.
        this.currentItem = null;

        // Below the setup for adjusting the step shown on weight graph.
        this.dashBoardOptions.step = "auto"; 
        this.hoverList = []; this.allSteps=[]; this.minX = this.minY = this.maxX = this.maxY = 0;
    }
    
    /**
     * Update the data info flyout for showing if the current display is a bias.   --- UPDATED (Dexter) 20180527
     * @param {Boolean} bias - Whether the current graph is a bias
     */
    updateType(bias) {
        // Get the weight info text of the data info flyout of this weight graph.
        var weightText = $(this.id+"-weightInfo").getElementsByClassName("weightIdx")[0].children[0];

        // Display the translated text of whether showing the info as bias or weight.
        if (bias) {
            weightText.dataset.lt = "bias";
            weightText.innerText = App.getTxtFromLang("bias");
        } else {
            weightText.dataset.lt = "weight";
            weightText.innerText = App.getTxtFromLang("weight");
        }
    }

    /**
     * Change the weight graph data to a typical recorded step as the user hover over the recorded step line.   --- UPDATED (Dexter) 20181121
     * @param {PointerEvent} e - A pointermove event, typically when user moving on the recorded step line
     */
    changeStep(e) {
        e.stopPropagation();

        // Get all the positions required to trace the step where the user is hovering on.
        const bbox = this.obj.getBoundingClientRect();
        const offsetX = e.pageX - bbox.left, offsetY = e.pageY - bbox.top;

        // Only action if there are multiple recorded steps and within the recorded step box.
        if (this.hoverList.length && offsetY >= this.minY && offsetY <= this.maxY && offsetX >= this.minX && offsetX <= this.maxX) {
            ContextMenu.closeAll();

            // Find the step where pointer is within the range.
            const idx = this.hoverList.findIndex((hl,idx,list)=>offsetX >= list[idx] && offsetX <= list[idx+1]);
            const newStep = this.allSteps[idx];

            // If there is a step change with respect to current status, take action.
            if (newStep != this.stepNow){
                // Update the displaying step to the hovering step.
                this.dashBoardOptions.setAttribute("step", newStep);

                // Ask the Web Worker to redraw the graph given the aboved options.
                App.workerFtn("WeightGraph", "redraw", this.id, this.dashBoardOptions);

                // Update the displaying step to this hovering step.
                this.stepNow = newStep; 
            }

            // Update the shadow of the step pinning along with pointer movement.
            const maxSlide = $(this.id+"-stepBoxRange").getBoundingClientRect();
            $(this.id+"-stepBoxSliderShadow").setAttribute("cx", Math.max(Math.min(offsetX,maxSlide.left+maxSlide.width-bbox.left), maxSlide.left-bbox.left));
        } 
    }

    /**
     * Update the graph because of switching the graph into a new weight/bias item.   --- UPDATED (Dexter) 20181121
     * @param {String} colName - The column name of the selected weight/bias.
     */
    switchToWeight(colName) {
        ContextMenu.closeAll();
        var newOptions = new WeightGraphDataOptions();

        // Update the displaying weight/bias to the selected one.
        this.currentItem = newOptions.weightItem = colName;

        // Ask the Web Worker to redraw the graph given the aboved options.
        App.workerFtn("WeightGraph", "redraw", this.id, null, newOptions);

        // Display notification for drawing
        this.creatingGraph();
    }

    /**
     * Set up pointer hovering information of recorded steps as data prepared from the "draw.js" Web Worker.   --- UPDATED (Dexter) 20180527
     * @param {Number[]} hoverList - The x-position of the boundaries, including leftmost and rightmost, of all x segments of recorded steps
     * @param {Number[]} allSteps - A sorted array of all recorded step numbers
     * @param {Number} minY - The y-coordinate of the upper boundary of the recorded step box
     * @param {Number} maxY - The y-coordinate of the lower boundary of the recorded step box
     * @param {Number} stepNow - The current displaying recorded step
     */
    updateSliderAction(hoverList, allSteps, minY, maxY, stepNow) {
        this.hoverList = hoverList; 
        this.minY = minY; this.maxY = maxY; this.minX = hoverList[0]; this.maxX = hoverList[hoverList.length-1];
        this.stepNow = stepNow; this.allSteps=allSteps;
    }

    /**
     * Update the weight/bias selection buttons.   --- UPDATED (Dexter) 20180527
     * POTENTIAL BUG: not supported for multi panes of weight graphs, due to conflict of sharing $("weightCols")  --- (Dexter) 20180723
     * @param {String[]} allCols - The column names of all the recorded weights/biases
     * @param {String} nowCol - The currently displaying weight/bias
     */
    updateAllCol(allCols, nowCol) {
        // Ensure there are enough buttons for the weight/bias selection.
        /*var colList = [...$("weightCols").getElementsByClassName("selFD")];
        const valDiff = (colList.length-1) - allCols.length;
        if (valDiff > 0) {
            for (let i=0; i<valDiff; i++) {
                colList[colList.length-i-1].remove();
            }
        } else if (valDiff < 0) {
            for (let i=0; i<Math.abs(valDiff); i++) {
                var fdItem = $("wcTemp").cloneNode(true);
                fdItem.removeAttribute("id");
                $("weightCols").getElementsByClassName("ctx")[0].appendChild(fdItem);
                fdItem.addEventListener("click", WeightGraph.switchToWeight, false);
            }
        }*/
        App.controlChildrenCount($("weightCols").getElementsByClassName("ctx")[0], allCols.length, $("wcTemp"), "selFD", (ele)=>{
            ele.removeAttribute("id");
            ele.addEventListener("click", WeightGraph.switchToWeight, false);
        }, (ele, idx, ary)=>{
            let colName = allCols[idx];
            ele.children[0].innerText = colName;
            ele.dataset.id = this.id;
            ele.dataset.weightName = colName;
            if (colName == nowCol) {
                ele.classList.add("activated");
            } else {
                ele.classList.remove("activated");
            }
        });
        /*
        // For each of the columns, display the name and assign activation class status to them.
        colList = [...$("weightCols").getElementsByClassName("selFD")].slice(1);
        allCols.forEach((colName,cID)=>{
            var toEle = colList[cID].children[0];
            toEle.innerText = colName;
            colList[cID].dataset.id = this.id;
            colList[cID].dataset.weightName = colName;
            if (colName == nowCol) {
                colList[cID].classList.add("activated");
            } else {
                colList[cID].classList.remove("activated");
            }
        });*/
    }
    
    /**
     * All of the displaying Weight graph items.   --- UPDATED (Dexter) 20180527
     */
    static get all() { return this._all; } static set all(v) { this._all = v; }

    /**
     * Current user dashboard option.   --- UPDATED (Dexter) 20180723
     */
    static get currentOptions() { return this._currentOptions; } static set currentOptions(v) { this._currentOptions = v; }

    /**
     * Current user data option.   --- UPDATED (Dexter) 20180723
     */
    static get currentDataOptions() { return this._currentDataOptions; } static set currentDataOptions(v) { this._currentDataOptions = v; }

    /**
     * Initiation after the app is loaded.   --- UPDATED (Dexter) 20180527
     */
    static initiate() {
        WeightGraph.currentOptions = new WeightGraphOptions();
        WeightGraph.currentDataOptions = new WeightGraphDataOptions();
        WeightGraph.all = new Map();
        WeightGraph.all.set("weightGraphSVG", new WeightGraph("weightGraphSVG", true));
    }

    /**
     * Resize all weight graphs.   --- UPDATED (Dexter) 20180804
     */
    static resizeAll() {
        WeightGraph.all.forEach(db=>db.resize());
    }

    /**
     * Clear all weight graphs.   --- UPDATED (Dexter) 20180803
     */
    static clearAll() {
        WeightGraph.all.forEach(db=>{
            db.clear()
            db.dashBoardOptions = Object.assign(db.dashBoardOptions, new WeightGraphOptions());
            db.dataOptions = new WeightGraphDataOptions();
        });
        App.workerFtn("WeightGraph", "clearAll");
    }

    /**
     * Get current user options.   --- UPDATED (Dexter) 20180802
     * @param {String} id - A Dashboard object id in case of returnning a specific option.
     */
    static getOptions(id="weightGraphSVG") {
        return [WeightGraph.get(id).dashBoardOptions, WeightGraph.get(id).dataOptions];
    }

    /**
     * Actions fired after user selecting one weight/bias from the selection flyout.   --- UPDATED (Dexter) 20180527
     * @param {Event} e - A click event, typically from a weight/bias selection button.
     */
    static switchToWeight(e) {
        // Only fires for clicking a non-displaying weight/bias.
        if (!this.classList.contains("activated")) {
            // Collect this button's info and ask the WeightGraph object to switch to the selected weight.
            const graphID = this.dataset.id, toWeight = this.dataset.weightName;
            WeightGraph.all.get(graphID).switchToWeight(toWeight);

            // Update the activation class status of all the selection buttons in this flyout.
            [...this.parentNode.children].forEach(ele=>{
                if (ele != this) ele.classList.remove("activated");
                else ele.classList.add("activated");
            })
        }
    }

    /**
     * Set up available runs and cross validations for properties pane selections.   --- UPDATED (Dexter) 20181121
     * @param {Number[]} availableRuns - The available list of run numbers.
     * @param {Number[]} availableCVs - The available list of cross validation numbers.
     */
    setUpRunCVOptions(availableRuns, availableCVs) {
        App.controlChildrenCount($("optWeightGraphRunNoMore"), availableRuns.length, document.createElement("option"), null, undefined, (ele,idx) => {
            ele.dataset.val = ele.innerText = availableRuns[idx];
        });
        availableCVs = availableCVs.filter(ele=>ele!="-1");
        App.controlChildrenCount($("optWeightGraphCVNoMore"), availableCVs.length, document.createElement("option"), null, undefined, (ele,idx) => {
            ele.dataset.val = ele.innerText = availableCVs[idx];
        });
    }
}

/** Class representing trace log options.   --- UPDATED (Dexter) 20180722 */
class TraceLogOptions extends DashBoardOptions {
    constructor() {
        super();
        this.display = "auto";      // "auto": default UX /"table": show in table format
        this.displayTarget = "stack";     // Whether to show the target results for comparison
    }
}

/** Class representing trace log data options.   --- UPDATED (Dexter) 20180722 */
class TraceLogDataOptions extends DataOptions {
    constructor() {
        super();
        this.step = "auto";
        this.round = "auto";
        this.finalLayer = "auto";
        this.runNo = -1;
        this.cvNo = -1;
    }
}

/** Class representing a trace log, a visualization of traced sampled records.   --- UPDATED (Dexter) 20180721 */
class TraceLog extends DashboardItem {
    /**
     * Create a trace log to be shown.   --- UPDATED (Dexter) 20180722
     */
    constructor(id) {
        super(id, "TraceLog");
        TraceLog.all.set(id, this);
        this.allFinalLayers = [];
        this.finalLayer = "";

        // Reset dashboard options.
        var dashBoardOptions = new TraceLogOptions();
        this.dashBoardOptions = Object.assign(dashBoardOptions, TraceLog.currentOptions);
        var dataOptions = new TraceLogDataOptions();
        this.dataOptions = Object.assign(dataOptions, TraceLog.currentDataOptions);

        // Send to the worker to create it.
        App.workerFtn("TraceLog", "create", id);

        // Update reference of the range input.
        this.stepInput = new InputRange(document.getElementsByClassName("tlRange")[0], document.getElementsByClassName("tlRangeVal")[0], "hover");
        this.obj.getElementsByClassName("traceFinalLayer")[0].addEventListener("click", this.switchFinalLayers.bind(this), false);
        this.obj.getElementsByClassName("tlRange")[0].addEventListener("change", this.changeStep.bind(this), false);
    }

    /**
     * Draw the necessary information.   --- UPDATED (Dexter) 20180805
     * @param {String} subAction - The sub-action of what data has to be drawn
     * @param {*} data - The data for drawing on the dashboard.
     */
    draw(subAction, data) {
        if (subAction == "setTitle") {
            // Set the title of the text.
            this.obj.getElementsByClassName("traceFinalLayer")[0].innerText = data.current;

            // Set the final layer selections.
            this.finalLayer = data.current;
            this.allFinalLayers = data.all;
            var allSteps = data.allSteps;
            this.stepInput.setDataValues(allSteps);
            this.stepInput.setValue(data.atStep);
            if (allSteps.length == 1) {
                this.stepInput.rangeEle.classList.add("noDisplay");
            } else {
                this.stepInput.rangeEle.classList.remove("noDisplay");
            }
            
        } else if (subAction == "setHeader") {
            // Depending on different cases, control the appearance of the title boxes.
            if (data.display == "hide") {
                this.obj.getElementsByClassName("tltPred")[0].classList.remove("noDisplay");
                ["tltTruth","tltPredTruth","tlhTruth"].map(c=>this.obj.getElementsByClassName(c)[0]).forEach(ele=>ele.classList.add("noDisplay"));
            } else if (data.display == "stack") {
                this.obj.getElementsByClassName("tltPredTruth")[0].classList.remove("noDisplay");
                ["tltTruth","tltPred","tlhTruth"].map(c=>this.obj.getElementsByClassName(c)[0]).forEach(ele=>ele.classList.add("noDisplay"));
            } else if (data.display == "side") {
                ["tltPred","tltTruth","tlhTruth"].map(c=>this.obj.getElementsByClassName(c)[0]).forEach(ele=>ele.classList.remove("noDisplay"));
                this.obj.getElementsByClassName("tltPredTruth")[0].classList.add("noDisplay");
            }
            this.obj.getElementsByClassName("traceLogType")[0].dataset.type = data.display;
           
            // Create the headers.
            function setText(ele, text) {
                const hasIdx = ["class label","label","value","target","original image","reconstructed image","result","image","class"].indexOf(text.toLowerCase());
                if (hasIdx != -1) {
                    const transItem = ["txtCL","txtL","txtV","txtT","txtOI","txtRI","txtR","txtI","txtC"][hasIdx];
                    ele.innerText = App.getTxtFromLang(transItem);
                    ele.dataset.lt = transItem;
                    ele.classList.add("lt");
                } else {
                    ele.innerText = text;
                    ele.classList.remove("lt");
                }
            }

            var newDIV = document.createElement("div");
            var newWrap = document.createElement("div");
            newDIV.appendChild(newWrap);
            App.controlChildrenCount(this.obj.getElementsByClassName("tlhInput")[0], data.input.length, newDIV,undefined,undefined,(ele,idx)=>{
                setText(ele.children[0], data.input[idx]);
            });
            App.controlChildrenCount(this.obj.getElementsByClassName("tlhPred")[0], data.target.length, newDIV,undefined,undefined,(ele,idx)=>{
                setText(ele.children[0], data.target[idx]);
            });
            if (!this.obj.getElementsByClassName("tlhTruth")[0].classList.contains("noDisplay")) {
                App.controlChildrenCount(this.obj.getElementsByClassName("tlhTruth")[0], data.target.length, newDIV,undefined,undefined,(ele,idx)=>{
                    setText(ele.children[0], data.target[idx]);
                });
            }
        } else if (subAction == "prepareRows") {
            const displayType = data.display;
            var newDIV = document.createElement("div");
            var newWrap = document.createElement("div");
            newDIV.appendChild(newWrap);
            
            // Understand how many cells are required.
            const inputCells = this.obj.getElementsByClassName("tlhInput")[0].children.length, 
                    predCells = this.obj.getElementsByClassName("tlhPred")[0].children.length,
                    truthCells = this.obj.getElementsByClassName("tlhTruth")[0].children.length;

            // Ensure there is enough rows and cells.
            App.controlChildrenCount(this.obj.getElementsByClassName("traceLogAllRows")[0], data.size, this.obj.getElementsByClassName("traceLogRowTemp")[0], "traceLogRow", ele=>{
                ele.classList.remove("traceLogRowTemp");
                if (displayType == "side") ele.getElementsByClassName("tlrTruth")[0].classList.remove("noDisplay");
            }, ele=>{
                App.controlChildrenCount(ele.getElementsByClassName("tlrInput")[0], inputCells, newDIV);
                App.controlChildrenCount(ele.getElementsByClassName("tlrPred")[0], predCells, newDIV, undefined, undefined, ele=>{
                    if (displayType == "stack") {
                        if (ele.children[0].innerHTML) ele.children[0].innerHTML = "";
                        App.controlChildrenCount(ele.children[0], 2, document.createElement("div"));
                        ele.children[0].children[1].classList.add("targetValue");
                    } else if (ele.children[0].children > 1) {
                        ele.children[0].innerHTML = "";
                    }
                });
                if (displayType == "side") {
                    App.controlChildrenCount(ele.getElementsByClassName("tlrTruth")[0], truthCells, newDIV);
                    ele.getElementsByClassName("tlrTruth")[0].classList.remove("noDisplay");
                } else ele.getElementsByClassName("tlrTruth")[0].classList.add("noDisplay");
                [[inputCells,"tlrInput"],[predCells,"tlrPred"],[truthCells,"tlrTruth"]].forEach(info=>{
                    var cell = ele.getElementsByClassName(info[1])[0];
                    cell.classList.remove("big", "bigbig"); 
                    if (info[0] == 1) ele.getElementsByClassName(info[1])[0].classList.add("bigbig");
                    else if (info[0] <= 5) ele.getElementsByClassName(info[1])[0].classList.add("big");
                });
            });
        } else if (subAction == "setData") {
            const displayType = data.display;

            // Loop all columns.
            var allCols = displayType == "hide" ? ["input", "predicted"] : ["input","predicted","truth"];
            allCols.forEach(col=>{
                const dataType = data[col].dataType;
                
                for (let i=data.fromIdx; i<data.fromIdx+data.length; i++) {
                    var rowEle = this.obj.getElementsByClassName("traceLogRow")[1+i];
                    var toData = data[col].data[i], toCell;
                    
                    if (col == "input") toCell = rowEle.getElementsByClassName("tlrInput")[0];
                    else {
                        if (displayType == "stack") {
                            toCell = rowEle.getElementsByClassName("tlrPred")[0];
                        } else {
                            if (col == "predicted") toCell = rowEle.getElementsByClassName("tlrPred")[0];
                            else if (col == "truth") toCell = rowEle.getElementsByClassName("tlrTruth")[0];
                        }
                    }

                    if (dataType == "Image") {
                        toCell = toCell.children[0].children[0];
                        if (!toCell.children.length || toCell.children[0].tagName != "CANVAS") {
                            toCell.innerHTML = "";
                            toCell.appendChild(document.createElement("canvas"));
                        }
                        var canvas = toCell.getElementsByTagName("canvas")[0];
                        var ctx = canvas.getContext('2d');
                        canvas.width = toData.width;
                        canvas.height = toData.height;
                        ctx.putImageData(toData, 0, 0);
                    } else if (["Table", "Value"].includes(dataType)) {
                        [...toCell.children].forEach((c,idx)=>{
                            if (col == "input" || displayType != "stack") c.children[0].innerText = toData[idx];
                            else if (displayType == "stack") {
                                if (col == "predicted") c.children[0].children[0].innerText = toData[idx];
                                else if (col == "truth") c.children[0].children[1].innerText = "( "+ toData[idx] + " )";
                            } 
                        });
                    }
                }
            });
        }
    }

    /**
     * Called when a window.resize takes place, ref: App.resize() .   --- UPDATED (Dexter) 20180723
     */
    resize() {
        App.nextFrame().then(e=>{
            const colPairs = [["tlrInput", "tltInput"]];
            const displayType = this.obj.getElementsByClassName("traceLogType")[0].dataset.type;
            if (["hide", "side"].includes(displayType)) colPairs.push(["tlrPred","tltPred"]);
            if (displayType == "side") colPairs.push(["tlrTruth","tltTruth"]);
            else if (displayType == "stack") colPairs.push(["tlrPred","tltPredTruth"]);

            colPairs.forEach(pair=>{
                const cellCount = this.obj.getElementsByClassName("traceLogHeaders")[0].getElementsByClassName(pair[0])[0].children.length;
                var allCols = [...this.obj.getElementsByClassName(pair[0])].filter(ele=>!ele.parentElement.classList.contains("traceLogType") && !ele.parentElement.classList.contains("traceLogRowTemp"));
                for (let i=0; i<cellCount; i++) {
                    var allCells = allCols.map(col=>col.children[i]);
                    const maxWidth = Math.max(...allCells.map(ele=>ele.children[0].clientWidth));
                    allCells.forEach(ele=>ele.style.width = maxWidth + "px");
                }
                pair.push(allCols);
            });

            App.nextFrame().then(e=>{
                colPairs.forEach(pair=>{
                    var allCols = pair[2];
                    const inputWidth = Math.max(...allCols.map(ele=>ele.clientWidth));
                    this.obj.getElementsByClassName(pair[1])[0].style.width = inputWidth + "px";
                });
            });
        });
    }
    
    /**
     * Show the selection of different final layers.   --- UPDATED (Dexter) 20180723
     */
    switchFinalLayers(e) {
        e.stopPropagation();

        // Create selection boxes in the final layer selection flyout.
        const totalLayerCount = this.allFinalLayers.length;
        App.controlChildrenCount($("allTraceFinalLayers"), totalLayerCount, $("wcTemp"), undefined, ele=>ele.addEventListener("click", TraceLog.switchToFinalLayer, false), (ele,idx)=>{
            ele.children[0].innerText = ele.dataset.val = this.allFinalLayers[idx];
            if (this.allFinalLayers[idx] == this.finalLayer) ele.classList.add("activated");
        });

        // Remember which trace log the selection box is handling.
        $("allTraceFinalLayers").dataset.for = this.id;

        // Show the selection box.
        ContextMenu.show("traceFinalLayers", true, {x:e.pageX, y: e.pageY});
    }

    /**
     * Change the trace log data to a typical recorded step as the user hover over the recorded step line.   --- UPDATED (Dexter) 20180724
     * @param {Event} e - A change event, typically when user moving on the recorded step line
     */
    changeStep(e) {
        this.dataOptions.step = Number(e.target.dataset.val);

        // Ask the Web Worker to redraw the graph given the aboved options.
        App.workerFtn("TraceLog", "redraw", this.id, null, this.dataOptions);
    }

    /**
     * All of the displaying trace log items.   --- UPDATED (Dexter) 20180721
     */
    static get all() { return this._all; } static set all(v) { this._all = v; }

    /**
     * Current user dashboard option.   --- UPDATED (Dexter) 20180723
     */
    static get currentOptions() { return this._currentOptions; } static set currentOptions(v) { this._currentOptions = v; }

    /**
     * Current user data option.   --- UPDATED (Dexter) 20180723
     */
    static get currentDataOptions() { return this._currentDataOptions; } static set currentDataOptions(v) { this._currentDataOptions = v; }

    /**
     * Initiation after the app is loaded.   --- UPDATED (Dexter) 20180723
     */
    static initiate() {
        TraceLog.currentOptions = new TraceLogOptions();
        TraceLog.currentDataOptions = new TraceLogDataOptions();
        TraceLog.all = new Map();
        new TraceLog("traceLogDashboard");
    }

    /**
     * Resize all trace logs.   --- UPDATED (Dexter) 20180723
     */
    static resizeAll() {
        TraceLog.all.forEach(db=>db.resize());
    }

    /**
     * Clear all train logs.   --- UPDATED (Dexter) 20180805
     */
    static clearAll() {
        TraceLog.all.forEach(db=>{
            db.dashBoardOptions = Object.assign(db.dashBoardOptions, new TraceLogOptions());
            db.dataOptions = new TraceLogDataOptions();
        });
    }

    /**
     * Get current user options.   --- UPDATED (Dexter) 20180802
     * @param {String} id - A Dashboard object id in case of returnning a specific option.
     */
    static getOptions(id="traceLogDashboard") {
        return [TraceLog.get(id).dashBoardOptions, TraceLog.get(id).dataOptions];
    }

    /**
     * Update the graph because of switching the trace log into a new final layer item.   --- UPDATED (Dexter) 20180723
     * @param {Event} e - Typically a "click" event from the selection of a final layer selection item.
     */
    static switchToFinalLayer(e) {
        if (!this.classList.classList.contains("activated")) {
            ContextMenu.closeAll();
            traceLog = TraceLog.all.get(this.parent.dataset.for);
            traceLog.dataOptions.finalLayer = this.dataset.val;
            App.workerFtn("TraceLog", "redraw", this.id, null, newOptions);
        }
    }
}

/** Class of static functions controlling a context menu or flyout.   --- UPDATED (Dexter) 20180528 */
class ContextMenu {
    /**
     * Stores a list of actively shown ContextMenu objects.   --- UPDATED (Dexter) 20180528
     */
    static get list() { return this._list; } static list(v) { this._list = v; }

    /**
     * Initiation after the app is loaded.   --- UPDATED (Dexter) 20190212
     */
    static initiate() {
        this.list = [];

        // All close / cancel buttons
        [...document.getElementsByClassName("closeBtn")].forEach(btn=>btn.addEventListener("click", ContextMenu.manualCloseAll, false));
    }

    /**
     * Get the current context menu / flyout stack level.   --- UPDATED (Dexter) 20180528
     * @returns {Number} - The stack level
     */
    static step() {
        return Math.max(...ContextMenu.list.map(ele=>ele.stack),0);
    }

    /**
     * Display a context menu / flyout.   --- UPDATED (Dexter) 20190209
     * @param {String} id - The id of the context menu / flyout HTML element
     * @param {Boolean} closeOthers - Whether to close other context menu / flyout
     * @param {Object} pos - The position or details of showing this context menu / flyout
     * @param {Number} pos.x - The pageX of the position to be shown
     * @param {Number} pos.y - The pageY of the position to be shown
     * @param {String} pos.pointerType - The pointerType as the same definition of PointerEvent of initiating this action
     * @param {Boolean} stack - Whether to stack the new context menu / flyout onto a higher level
     */
    static show(id, closeOthers, pos=null, stack=false) {
        // Update the stack level.
        stack = typeof(stack) === "number" ? stack : !closeOthers ? (ContextMenu.step() + 1) : 0;
        
        // Get the object first.
        var cm = $(id);

        // Avoid triggering on the case when the element is still closing.
        if (cm.classList.contains("hide") && !cm.classList.contains("noDisplay")) return;

        if (!ContextMenu.list.includes(id)) {
            // If the context menu has not appeared, actions to show the context menu.

            // Close other context menus if needed.
            ContextMenu.closeIfs(ele=>ele.stack >= stack);

            // Protect the "pointerdown" action on the context menu to prevent clicking on it will close the context menu.
            ContextMenu.protect(cm);

            // Update the style to show the element.
            cm.classList.remove("noDisplay");

            // Since the element may be closing at the moment, just remove the .endClose function because it now appears again.
            cm.removeEventListener("transitionend", ContextMenu.endClose, false);

            // Push the context menu to the appearing list.
            ContextMenu.list.push({id: id, stack: stack});
            cm.style.zIndex = 100+stack;

            // Let the element be drawn on DOM first. (To allow transition effect of showing the context menu.)
            ContextMenu.untilShown(cm).then(()=>{
                // After it's drawn, update the position of the element.
                ContextMenu.updatePos(id, pos);
                $(id).dispatchEvent(new Event("showstart"));

                // Add a event that when it's fully appeared, any "pointerdown" effect from other areas will trigger the close all action.
                cm.addEventListener("transitionend", ()=>{
                    document.addEventListener("pointerdown", ContextMenu.closeAll, {once: true, capture: false});
                    $(id).dispatchEvent(new Event("showend"));
                }, {once: true, capture: false});
            });

            // Switch the context menu type to compact if the action is initiated by a mouse.
            if (pos && pos.pointerType == "mouse") cm.classList.add("compact");
            else cm.classList.remove("compact");
        } else if (pos) {
            // If the context menu has appeared while a new position is passed, update the position of the context menu.
            ContextMenu.updatePos(id, pos);
        }
    }

    /**
     * An async function to allow a then action to follow up until the element is drawn on DOM.   --- UPDATED (Dexter) 20180528
     * @param {Element} ele - The HTML element of the context menu or flyout
     * @returns {Promise} Promise to be resolved after the element is drawn
     */
    static async untilShown(ele) {
        return new Promise((resolve,reject)=>{
            function newFrame(ts) {
                // If it has drawn, it must have nonzero .clientWidth or .clientHeight property, and resolve the Promise at that time.
                if (ele.clientWidth || ele.clientHeight) resolve(true);
                // Otherwise, requestAnimationFrame to check on next frame.
                else window.requestAnimationFrame(newFrame);
            }
            newFrame();
        });
    }

    /**
     * Update the position fo the context menu / flyout.   --- UPDATED (Dexter) 20180819
     * @param {String} id - The id of the HTML element of the context menu / flyout
     * @param {Object} pos - The position or details of showing this context menu / flyout
     * @param {Number} pos.x - The pageX of the position to be shown
     * @param {Number} pos.y - The pageY of the position to be shown
     */
    static updatePos(id, pos = {}) {
        // Get the element and remove the "hide" class.
        var ele = $(id);

        ele.classList.remove("hide");
        if (ele.classList.contains("contextmenu")) {
            // If no position is given, derive the position from existing position.
            if (pos != null && !pos.x) {
                if (!ele.dataset.pos) {
                    var shiftPos = ele.dataset.at ? JSON.parse(ele.dataset.at) : [0,0];
                    var bbox = ele.getElementsByClassName("ctx")[0].getBoundingClientRect();
                    if (ele.classList.contains("fromCenter")) shiftPos[1] -= 0.5;
                    pos.x = bbox.left - shiftPos[0]*bbox.width;
                    pos.y = bbox.top - shiftPos[1]*bbox.height;
                } else {
                    pos = JSON.parse(ele.dataset.pos);
                }
            } else if (pos != null && pos.x) {
                ele.dataset.pos = JSON.stringify(pos);
            }
            
            // Get the element size.
            var box = ele.getElementsByClassName("ctx")[0];
            var h = box.clientHeight, w = box.clientWidth;

            // Check if the element has shift position, this default position is showing on the right bottom relative to the given position.
            var shiftPos = ele.dataset.at ? JSON.parse(ele.dataset.at) : [0,0];

            // For those element that have special appearing positioning, there may be compensation on the position.
            var compH = h;
            if (ele.classList.contains("fromCenter")) compH *= 0.5;
            else compH *= 0;

            // Determine the actual coordinates of the context menu.
            var toX = Math.max(Math.min(window.innerWidth-w,pos.x + shiftPos[0] * w),0);
            var toY = Math.max(Math.min(window.innerHeight- (h - compH), pos.y + shiftPos[1] * h), compH);
            
            // Assign the final coordinates as inline CSS style.
            ele.style.left = toX + "px";
            ele.style.top = toY + "px";
        }
    }

    /**
     * Protect the HTML element that any "pointerdown" event on it won't be bubbled to the document level to prevent a close of all context menus / flyouts.   --- UPDATED (Dexter) 20180528
     * @param {Element} ele - The HTML elment of the context menu / flyout
     */
    static protect(ele) {
        ele.addEventListener("pointerdown", ContextMenu.closeToThis, false);
    }

    /**
     * Close a specific context menu / flyout.   --- UPDATED (Dexter) 20180807
     * @param {String} id - The id of the HTML element of the context menu / flyout
     * @param {Boolean} manualClose - Whether this is a manual close which is not triggered by the document "pointerdown" event
     */
    static close(id, manualClose=false) {
        // Get the closing context menu, and exclude it from the appearing list.
        const ele = $(id);
        ContextMenu.list = ContextMenu.list.filter(ele=>ele.id != id);

        // Hide the context menu, remove the protection, and add a event to allow it to be fully closed.
        ele.classList.add("hide");
        ele.removeEventListener("pointerdown", ContextMenu.closeToThis, false);
        ele.addEventListener("transitionend", ContextMenu.endClose, false);
        ele.dispatchEvent(new Event("closestart"));
        
        // If it is a manual close, remove the document "pointerdown" event.
        if (manualClose) document.removeEventListener("pointerdown", ContextMenu.closeAll, {once: true, capture: false});
    }

    /**
     * Close all context menus / flyouts.   --- UPDATED (Dexter) 20180528
     * @param {Event} e - A pointerdown event, typically from the document level
     */
    static closeAll(e) {
        // Remove all the context menus at the current stack.
        var step = ContextMenu.step();
        ContextMenu.closeIfs(ele=>ele.stack >= step);

        // If there are still context menus, continue to provide the document pointer down event.
        if (ContextMenu.list.length) {
            App.nextFrame().then(()=>document.addEventListener("pointerdown", ContextMenu.closeAll, {once: true, capture: false}));
        }
    }

    /**
     * Manually close all context menus / flyouts if this is not triggered by document "pointerdown" event.   --- UPDATED (Dexter) 20180528
     */
    static manualCloseAll() {
        // Remove the "pointerdown" event of the document that is not called.
        document.removeEventListener("pointerdown", ContextMenu.closeAll, {once: true, capture: false})

        // Close all the context menus.
        ContextMenu.closeAll();
    }

    /**
     * Close the context menus under specific criteria.   --- UPDATED (Dexter) 20180528
     * @param {Function} ftn - A customized function that check witht the HTML elements of the context menus / flyouts
     */
    static closeIfs(ftn) {
        // Filter the context menus by the customized function
        ContextMenu.list.filter(ele=>ftn(ele)).forEach((ele,idx)=>{
            // Close the elements under the specific criteria
            ContextMenu.close(ele.id)
        });
    }

    /**
     * Close the context menus until this level.   --- UPDATED (Dexter) 20181205
     * @param {*} e - An event
     */
    static closeToThis(e) {
        stopPropagate(e);
        var step = ContextMenu.list.find(ele=>ele.id == this.id).stack;
        ContextMenu.closeIfs(ele=>ele.stack > step);
    }

    /**
     * Fully close the context menu / flyout.   --- UPDATED (Dexter) 20181205
     * @param {Event} e - A transitionend event typically from the ending of closing a context menu / flyout
     */
    static endClose(e) {
        if (e.target == this || e.target.classList.contains("ctxWrapper")) {
            // Don't display the element anymore.
            this.classList.add("noDisplay");
            this.dispatchEvent(new Event("closeend"));
            this.removeEventListener("transitionend", ContextMenu.endClose, false);

            // In case the context menu only appears once, remove it from the DOM.
            if (this.dataset.once == "1") {
                this.remove();
            }
        }
    }
    
}

/** Class representing an action flyout with  */
class ActionDialog {
    /**
     * Show a warning message.   --- UPDATED (Dexter) 20180817
     * @param {String} msgTitle - The translation key of warning message title.
     * @param {String} msg - The translation key of warning content title.
     * @param {Object} pos - The position or details of showing this message flyout.
     * @param {Number} pos.x - The pageX of the position to be shown.
     * @param {Number} pos.y - The pageY of the position to be shown.
     * @param {String} pos.pointerType - The pointerType as the same definition of PointerEvent of initiating this action.
     * @param {Boolean} pos.stack - Whether the dialog will stack over another one.
     * @param {Function|Boolean} actionConditions - A criteria (function) for whether the action can be successfully resolved.
     * @returns {Promise} - A Promise resolves if it is pressed with OK, rejects if the message is dismissed.
     */
    static async show(id, msgTitle, msg=null, pos={x: window.innerWidth/2, y: window.innerHeight/2, stack: false}, actionConditions=null) {
        // Write the context of the warning flyout.
        if (msgTitle) $(id).getElementsByClassName("actionTitle")[0].innerHTML = msgTitle;
        if (msg) $(id).getElementsByClassName("actionMsg")[0].innerHTML = msg;

        // Display the warning message.
        App.nextFrame().then(()=>{
            ContextMenu.show(id, !pos.stack, pos);
        })
        
        // Return the promise
        return new Promise((resolve, reject)=>{
            var actionBtns = [...$(id).getElementsByClassName("actionBtn")];
            function confirmMsg(e) {
                if (actionConditions === null || actionConditions({action: this.dataset.action, event: e, target: $(id)})) {
                    actionBtns.forEach(btn=>btn.removeEventListener("click", confirmMsg, {capture: false}));
                    $(id).removeEventListener("closestart", closeMsg, {once: true, capture: false});
                    ContextMenu.closeAll();
                    resolve({action: this.dataset.action, event: e});
                }
            }
            function closeMsg(e) {
                actionBtns.forEach(btn=>btn.removeEventListener("click", confirmMsg, {once: true, capture: false}));
                reject(e);
            }
            actionBtns.forEach(btn=>btn.addEventListener("click", confirmMsg, {capture: false}));
            $(id).addEventListener("closestart", closeMsg, {once: true, capture: false});
        })
    }
}

// Class representing handler for showing warning messages.   --- UPDATED (Dexter) 20180807
class WarningMsg {
    /**
     * Show a warning message.   --- UPDATED (Dexter) 20180807
     * @param {String} msgTitle - The translation key of warning message title.
     * @param {String} msg - The translation key of warning content title.
     * @param {Object} pos - The position or details of showing this message flyout.
     * @param {Number} pos.x - The pageX of the position to be shown.
     * @param {Number} pos.y - The pageY of the position to be shown.
     * @param {String} pos.pointerType - The pointerType as the same definition of PointerEvent of initiating this action.
     * @returns {Promise} - A Promise resolves if it is pressed with OK, rejects if the message is dismissed.
     */
    static async show(msgTitle, msg, pos) {
        // Write the context of the warning flyout.
        $("warningMsg").getElementsByClassName("warnTitle")[0].innerHTML = msgTitle;
        $("warningMsg").getElementsByClassName("warnMsg")[0].innerHTML = msg;

        // Display the warning message.
        App.nextFrame().then(()=>{
            ContextMenu.show("warningMsg", true, pos);
        })
        
        // Return the promise
        return new Promise((resolve, reject)=>{
            function confirmMsg(e) {
                $("warningMsg").removeEventListener("closestart", closeMsg, {once: true, capture: false});
                ContextMenu.closeAll();
                resolve(e);
            }
            function closeMsg(e) {
                $("warnOK").removeEventListener("click", confirmMsg, {once: true, capture: false});
                reject(e);
            }
            $("warnOK").addEventListener("click", confirmMsg, {once: true, capture: false});
            $("warningMsg").addEventListener("closestart", closeMsg, {once: true, capture: false});
        });
    }
}

/** Class static functions controlling an a user-input element.   --- UPDATED (Dexter) 20180528 */
class InputBox {
    /**
     * Show an error of a user-input element.   --- UPDATED (Dexter) 20180819
     * @param {Element} obj - An HTML element regarding on a user-input, not neceessarily to be `<input>`, but may also `<select>` or `<div>` with class "checkbox"
     * @param {(String|Array<Object>)} msg - A translation key for the message to be displayed, or an object with translation key-value pairs.
     * @param {Boolean} removeOth - Whether to remove other context menus / flyouts
     * @param {String} icon - An icon on the validation flyout
     * @param {(Number|Boolean)} stack - Whether this flyout is stacking over previous context menus / flyouts
     */
    static showError(obj, msg, removeOth=true, icon="", stack = ContextMenu.step()+1) {
        // Determine if this is a special message.
        if (classof(msg) == "Array") msg = msg.slice(-1)[0];
        const cuzMsg = classof(msg) != "String";

        // Only to display validations on those elements who are not hiding or not displaying.
        if (!isOrDescendentOf(obj, ele=>["hide", "noDisplay"].some(c=>ele.classList.contains(c)))) {
            if (!obj.dataset.warnID || !$(obj.dataset.warnID) || ContextMenu.list.every(m=>m.id != obj.dataset.warnID)) {
                // Only display new flyout if there is no previously attached validation flyout

                // Add a "warn" class to this user-input element.
                obj.classList.add("warn");

                // Clone a input validation template and assign the warning detail to this user-input element.
                var ele = $("inputVal").cloneNode(true);
                ele.id = "inputError-"+App.createUniqueID();
                if (cuzMsg) {
                    obj.dataset.warnLT = "";
                    obj.dataset.warnCuzLT = JSON.stringify(msg);
                } else {
                    obj.dataset.warnLT = msg;
                    obj.dataset.warnCuzLT = "";
                }
                obj.dataset.warnID = ele.id;
                document.body.appendChild(ele);

                // Write the input validation context.
                const txtEle = $(ele.id).getElementsByClassName("text")[0];
                if (cuzMsg) {
                    txtEle.dataset.cuzLt = JSON.stringify(msg);
                    App.applyEleLang(txtEle);
                } else {
                    txtEle.innerHTML = App.getTxtFromLang(msg);
                    txtEle.dataset.lt = msg;
                }
                txtEle.previousElementSibling.innerText = icon;

                // Get the position and show the input validation flyout.
                const bbox = obj.getBoundingClientRect();
                ContextMenu.show(ele.id, removeOth, {x: bbox.left + bbox.width/2, y: bbox.top}, stack)
            } else {
                // Otherwise, just re-use the current validation flyout.

                // Get the original input validation flyout.
                var content = $(obj.dataset.warnID).getElementsByClassName("text")[0]

                // If the original flyout is not equal to the new message, re-write the message on it.
                if (cuzMsg && content.dataset.cuzLt != JSON.stringify(msg)) {
                    content.dataset.cuzLt = content.dataset.warnCuzLT = JSON.stringify(msg);
                    App.applyEleLang(content);
                } if (content.dataset.lt != msg) {
                    content.dataset.lt = content.dataset.warnLT = msg;
                    content.innerHTML = App.getTxtFromLang(msg);
                }
            }
        }

    }

    /**
     * Re-show the original error, typically when the user-input element is re-focused.  --- UPDATED (Dexter) 20180528
     * @param {Element} obj - An HTML element regarding on a user-input, not neceessarily to be `<input>`, but may also `<select>` or `<div>` with class "checkbox"
     */
    static showOriError(obj) {
        if (obj.dataset.warnCuzLT) InputBox.showError(obj, JSON.parse(obj.dataset.warnCuzLT), false, "", true)
        else if (obj.dataset.warnLT) InputBox.showError(obj, obj.dataset.warnLT, false, "", true)
    }

    /**
     * Restore the default value of the user-input element.  --- UPDATED (Dexter) 20180818
     * @param {...Element} objs - Multiple HTML elements regarding on a user-input, not neceessarily to be `<input>`, but may also `<select>` or `<div>` with class "checkbox"
     */
    static restoreDefault(...objs) {
        objs.forEach(obj=>{
            App.applyPropVal(obj, obj.dataset.default)
            InputBox.clearWarn(obj);
        });
    }

    /**
     * Clear the warning info of the user-input element.   --- UPDATED (Dexter) 20180819
     * @param {Element} obj - An HTML element regarding on a user-input, not neceessarily to be `<input>`, but may also `<select>` or `<div>` with class "checkbox"
     */
    static clearWarn(obj) {
        obj.classList.remove("warn");
        if (obj.dataset.warnID && $(obj.dataset.warnID)) ContextMenu.close(obj.dataset.warnID);
        delete obj.dataset.warnID;
        delete obj.dataset.warnLT;
        delete obj.dataset.warnCuzLT;
    }

    /**
     * Validate on the user-input element.  --- UPDATED (Dexter) 20190210
     * @param {Element} obj - An HTML element regarding on a user-input, not neceessarily to be `<input>`, but may also `<select>` or `<div>` with class "checkbox"
     * @param {Boolean} multi - Whether multiple elements is being validated
     * @param {Boolean} showMsg - Whether to show the input validation flyout
     * @param {Number|Boolean} stack - Whether this flyout is stacking over previous context menus / flyouts
     * @returns {Boolean} Whether the element is validated successfully
     */
    static validate(obj, multi=false, showMsg=true, stack = ContextMenu.step()+1) {
        // Prepare the basic information for easier referencing.
        const dataset = obj.dataset, type = obj.dataset.valType, val = (obj.value || obj.dataset.val || "").trim();

        // Make the default result as false.
        var result = false;

        if (val.length) {
            // Validate if there is a value written.
            if (obj.localName == "select") {
                // If it is a select box, it's result is always true.
                result = true;
            } else if (type == "number" || type == "numberAuto") {
                // If it's a number, validate through the min, max, range, step logics.
                var num = Number(val);
                if (isNaN(num)) {
                    if (type == "numberAuto" && val == "auto") {
                        result = true;
                    } else if (showMsg) InputBox.showError(obj, "notaNumber", !multi, undefined, stack);
                } else {
                    const hasMin = !!dataset.min, hasMax = !!dataset.max, min = Number(dataset.min), max = Number(dataset.max);
                    if (hasMin && hasMax && (num < min || num > max)) {
                        if (showMsg) InputBox.showError(obj, "numOutofRange", !multi, undefined, stack);
                    } else if (hasMin && (num < min)) {
                        if (showMsg) InputBox.showError(obj, "numLowerMin", !multi, undefined, stack);
                    } else if (hasMax && (num > max)) {
                        if (showMsg) InputBox.showError(obj, "numLargerMax", !multi, undefined, stack);
                    } else {
                        const hasStep = !!dataset.step, step = Number(hasStep);
                        if (hasStep && num%step != 0) {
                            if (showMsg) InputBox.showError(obj, "numOutofStep", !multi, undefined, stack);
                        } else {
                            result = true;
                        }
                    }
                } 
            } else if (type == "fileLoc") {
                // If it's a file, check with the path and supported type logic.
                if (["//","\\\\","*","?","\"","<",">","|"].some(e=>val.includes(e)) || (["/","\\"].every(e=>val.includes(e))) || (val.split(/[\/\\]/g)[0].length > 2 && val[1] == ":") || [...val].filter(e=>e==":").length > 1 || ([-1,1].every(idx=>idx!=val.indexOf(":")))) {
                    if (showMsg) InputBox.showError(obj, "invalidPath", !multi, undefined, stack);
                } else {
                    const hasType = !!dataset.fileType;
                    if (hasType && !JSON.parse(dataset.fileType).some(t=>val.endsWith(t))) {
                        if (showMsg) InputBox.showError(obj, "invalidFileType", !multi, undefined, stack);
                    } else {
                        result = true;
                    }
                }
            } else if (type == "folderLoc") {
                // If it's a folder, check with the path logic.
                if (["//","\\\\","*","?","\"","<",">","|"].some(e=>val.includes(e)) || (["/","\\"].every(e=>val.includes(e))) || (val.split(/[\/\\]/g)[0].length > 2 && val[1] == ":") || [...val].filter(e=>e==":").length > 1 || ([-1,1].every(idx=>idx!=val.indexOf(":")))) {
                    if (showMsg) InputBox.showError(obj, "invalidFolderPath", !multi, undefined, stack);
                } else if (!["/","\\"].some(s=>val.endsWith(s))) {
                    result = true;
                    var folderSlash = ["/","\\"].find(s=>val.includes(s));
                    obj.value = obj.dataset.val = val+ (folderSlash || "/");
                } else {
                    result = true;
                }
            } else if (type == "checkbox") {
                // If it's a check box, it's always true.
                result = true;
            } else if (type == "colSel") {
                // If it's a column selection, check with the array logic.
                var ary = val.split(",").map(v=>v.trim());
                if (ary.some(s=>isNaN(Number(s)) && s!="None")) {
                    if (showMsg) InputBox.showError(obj, "colNumNone", !multi, undefined, stack);
                } else if (ary.filter(s=>!isNaN(Number(s))).some(s=>Number(s) < Number(dataset.min) || Number(s) > Number(dataset.max) || Number(s) % 1 != 0)) {
                    if (showMsg) InputBox.showError(obj, "colOutofRange", !multi, undefined, stack);
                } else if (ary.length != 2 && ary.filter(s=>s=="None").length > 0) {
                    if (showMsg) InputBox.showError(obj, "colIncNone", !multi, undefined, stack);
                } else {
                    result = true;
                }
            } else if (type == "indexRange") {
                if (IndexRange.validate(Number(dataset.selLen), val)) result = true;
                else InputBox.showError(obj, "idxRangeError", !multi, undefined, stack);
            } else if (type == "shape") {
                if (val.startsWith("[") && val.endsWith("]")) {
                    var ary = val.slice(1,-1).split(",").map(n=>n.trim()=="None" ? "None" : Number(n));
                    var currentTotal = ary.filter(n=>n!="None" && n!=-1).reduce((a,b)=>a*b,1);

                    if (ary.some(n=>n!="None" && isNaN(n))) InputBox.showError(obj, "shapeNaNErr", !multi, undefined, stack);
                    else if (ary.filter(n=>n == -1).length > 1) InputBox.showError(obj, "shapeFlexError", !multi, undefined, stack);
                    else if (ary.filter(n=>n=="None").length > (("noneCount" in dataset) ? Number(dataset.noneCount) : 1)) InputBox.showError(obj, "shapeTooManyNoneError", !multi, undefined, stack);
                    else if (dataset.restrictedShape && dataset.restrictedShape.split(",").map(n=>n.trim()=="None" ? "None" : Number(n)).some((n,idx) => n!= ary[idx])) {
                        var cuzError = {"zh-TW": App.getTxtFromLang("shapeRestrictedError", "zh-TW") + dataset.restrictedShape, "en-US": App.getTxtFromLang("shapeRestrictedError", "zh-TW") + dataset.restrictedShape};
                        InputBox.showError(obj, cuzError, !multi, undefined, stack);
                    } else if (ary.some(n=>n !="None" && (n%1 != 0 || n < -1 || n == 0))) InputBox.showError(obj, "shapeIntError", !multi, undefined, stack);
                    else if (!dataset.shapeTotal || (ary.some(n=>n==-1) && currentTotal > Number(dataset.shapeTotal)) || (ary.every(n=>n > 0) && currentTotal != Number(dataset.shapeTotal))) InputBox.showError(obj, "shapeTotalDimError", !multi, undefined, stack);
                    else result = true;
                } else {
                    InputBox.showError(obj, "shapeFormatErr", !multi, undefined, stack);
                }
            }
        } else if (obj.required) {
            // If there is no value, but it's a required field, it will have error.
            if (showMsg) InputBox.showError(obj, "missingVal", !multi, undefined, stack);
        } else {
            result = true;
        }
        
        // If the result is fine, remove the warnings and reset the dataset to unlink with any current input validation flyouts.
        if (result) InputBox.clearWarn(obj);

        return result;
    }

    /**
     * Validation fires after a change of a user-input element.  --- UPDATED (Dexter) 20180528
     * @param {Event} e - A change event from the user-input element.
     */
    static toValidateEle(e) {
        InputBox.validate(this);
    }

    /**
     * Show original error flyout when the user focus again on a warning user-input element.  --- UPDATED (Dexter) 20180528
     * @param {Event} e - A focus event from the user-input element.
     */
    static toFocusEle(e) {
        InputBox.showOriError(this);
    }

    /**
     * Validate and ensure all given user-input elements are validated.  --- UPDATED (Dexter) 20180528
     * @param {...(Element|Array<Element>)} eles - Multiple HTML elements regarding on a user-input; if an array is given, just validate on any truth of the validation among them
     * @returns {Boolean} Whether all of the given elements are correctly validated
     */
    static validateAll(...eles) {
        return eles.map(ele=>ele instanceof Array ? InputBox.validateAny(...ele) : InputBox.validate(ele, true)).every(b=>b);
    }

    /**
     * Validate and ensure any one of the given user-input elements are validated, assuming this list is required and at least one element must be true in validation.  --- UPDATED (Dexter) 20180528
     * @param {...Element} eles - Multiple HTML elements regarding on a user-input
     * @returns {Boolean} Whether one of the given elements are correctly validated
     */
    static validateAny(...eles) {
        // Get the list of those elements with values.
        var hasList = eles.filter(ele=>(ele.dataset.val||ele.value));
        if (hasList.length) {
            // For those have values, validate them.
            eles.forEach(ele=>ele.classList.remove("warn"));
            return hasList.every(ele=>InputBox.validate(ele, true, false));
        } else {
            // If none of them has values, give a warning.
            eles.forEach(ele=>ele.classList.add("warn"));
            return false;
        }
    }
}

/** Class of static functions controlling in app notifications.  --- UPDATED (Dexter) 20190321 */
class AppNotification {
    /**
     * Show an in-app notification.  --- UPDATED (Dexter) 20190209
     * @param {String} title - A translatable key for the in-app notification title
     * @param {String} msg - A translatable key for the in-app notification message
     * @param {String} icon - An icon for the in-app notification
     * @param {Boolean} cancellable - Whether the in-app notification is closeable by the user
     * @returns {Element} The HTML element of the to-be-shown in-app notification
     */
    static show(title, msg, icon, cancellable = true) {
        // Clone an in-app notification template, and fill in the content, then insert it them into the $("notification").
        var newNF = $("notificationTemplate").cloneNode(true);
        App.getTemplateImages(newNF);
        newNF.id = "";
        newNF.getElementsByClassName("nfClose")[0].addEventListener("click", AppNotification.close, false);
        if (icon.endsWith(".svg")) {
            var iconSVG = new Image();
            iconSVG.src = App.getImageLocation() + icon;
            newNF.getElementsByClassName("icon")[0].innerHTML = "";
            newNF.getElementsByClassName("icon")[0].append(iconSVG);
        } else {
            newNF.getElementsByClassName("icon")[0].innerHTML = icon || "";
        }
        newNF.getElementsByClassName("nfTxt")[0].dataset.lt = msg;
        newNF.getElementsByClassName("nfTxt")[0].innerText = msg ? App.getTxtFromLang(msg) : "";
        newNF.getElementsByClassName("nfTitleTxt")[0].dataset.lt = title;
        newNF.getElementsByClassName("nfTitleTxt")[0].innerText = title ? App.getTxtFromLang(title) : "";
        $("notifications").insertBefore(newNF, $("notifications").children[0]);
        
        // If it is cancellable, close the notification after some seconds; or do not allow users to click on the close button.
        if (cancellable) AppNotification.toClose(newNF, 4750);
        else {
            newNF.getElementsByClassName("nfClose")[0].classList.add("inactive");
        }
        return newNF;
    }

    /**
     * Update an in-app notification.  --- UPDATED (Dexter) 20180528
     * @param {Element} obj - The HTML element of the to-be-shown in-app notification
     * @param {String} title - A translatable key for the in-app notification title
     * @param {String} msg - A translatable key for the in-app notification message
     * @param {String} icon - An icon for the in-app notification
     * @param {Boolean} cancellable - Whether the in-app notification is closeable by the user
     * @returns {Element} The HTML element of the to-be-shown in-app notification
     */
    static update(obj, title, msg, icon, cancellable = true) {
        // Update the notification details.
        if (icon.endsWith(".svg")) {
            var iconSVG = new Image();
            iconSVG.src = App.getImageLocation() + icon;
            obj.getElementsByClassName("icon")[0].innerHTML = "";
            obj.getElementsByClassName("icon")[0].append(iconSVG);
        } else {
            obj.getElementsByClassName("icon")[0].innerHTML = icon || "";
        }
        obj.getElementsByClassName("nfTxt")[0].dataset.lt = msg;
        obj.getElementsByClassName("nfTxt")[0].innerText = msg ? App.getTxtFromLang(msg) : "";
        obj.getElementsByClassName("nfTitleTxt")[0].dataset.lt = title;
        obj.getElementsByClassName("nfTitleTxt")[0].innerText = title ? App.getTxtFromLang(title) : "";
        
        // If it is cancellable, close the notification after some seconds; or do not allow users to click on the close button.
        if (cancellable) {
            obj.getElementsByClassName("nfClose")[0].classList.remove("inactive");
            AppNotification.toClose(obj, 4750);
        } else {
            obj.getElementsByClassName("nfClose")[0].classList.add("inactive");
        }
        return obj;
    }

    /**
     * Initiate a progress in an in-app notification.  --- UPDATED (Dexter) 20190222
     * @param {Element} obj - The HTML element of the to-be-shown in-app notification.
     * @param {String} title - A translatable key for the in-app notification title. If `null`, it will use the existing title.
     * @param {String} progressLabel - A translatable key for the in-app notification progress label.
     */
    static progressInit(obj, title=null, progressLabel = "readLabel") {
        // Create waiting icon.
        var iconSVG = new Image();
        iconSVG.src = App.getImageLocation() + "waiting.svg";
        obj.getElementsByClassName("icon")[0].innerHTML = "";
        obj.getElementsByClassName("icon")[0].append(iconSVG);

        // Create Notifiication Title.
        if (title) {
            obj.getElementsByClassName("nfTitleTxt")[0].dataset.lt = title;
            obj.getElementsByClassName("nfTitleTxt")[0].innerText = title ? App.getTxtFromLang(title) : "";
        }

        // Cancel default translatable text.
        obj.getElementsByClassName("nfTxt")[0].classList.remove("lt");
        obj.getElementsByClassName("nfTxt")[0].append("( ");

        // Create the progress label.
        var progresLabel = document.createElement("span");
        progresLabel.classList.add("lt");
        progresLabel.dataset.lt = progressLabel;
        progresLabel.innerText = progressLabel ? App.getTxtFromLang(progressLabel) : "";
        obj.getElementsByClassName("nfTxt")[0].append(progressLabel);

        // Create the progress number.
        var progressNum = document.createElement("span");
        progressNum.classList.add("progressNum");
        progressNum.innerText = "0.0";
        obj.getElementsByClassName("nfTxt")[0].append(progressNum);

        obj.getElementsByClassName("nfTxt")[0].append(" % )");

        
        // Disallow users to click on the close button.
        obj.getElementsByClassName("nfClose")[0].classList.add("inactive");
    }

    /**
     * Update a progress in an in-app notification.  --- UPDATED (Dexter) 20190222
     * @param {Element} obj - The HTML element of the to-be-shown in-app notification.
     * @param {Number} percentage - The progress percentage.
     */
    static progress(obj, percentage = 0) {
        // Create waiting icon.
        obj.getElementsByClassName("progressNum")[0].innerText = Math.round(percentage*100)/100;
    }

    /**
     * Close an in-app notification, with this bound as the in-app notification close button.  --- UPDATED (Dexter) 20180528
     */
    static close() {
        // Get the in-app notification element, and add the hide class to it.
        const pane = this.parentNode.parentNode;
        pane.classList.add("hide");

        // Prepare to remove the element after the notification fades out of the view.
        pane.addEventListener("transitionend", ()=>pane.remove(), {once: true, bubble: true});
    }

    /**
     * Prepare to close an in-app notification.  --- UPDATED (Dexter) 20180528
     * @param {Element} obj - The HTML element of the in-app notification.
     * @param {Number} delay - The number of microseconds to delay before the in-app notification is closed.
     */
    static toClose(obj, delay=0) {
        if (delay) setTimeout(AppNotification.close.bind(obj.getElementsByClassName("nfClose")[0]), delay);
        else AppNotification.close.bind(obj.getElementsByClassName("nfClose")[0])();
    }
}

/*  CSV Parsing adapted from a stackoverflow answer:
    https://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data*/
/** Class of static functions for handling CSV format strings.  --- UPDATED (Dexter) 20180528 */
class CSV {
    /**
     * A worker for handling asynchronous CSV parsing.  --- UPDATED (Dexter) 20180528
     */
    static get worker() { return this._worker; } static worker(v) { this._worker = v; }

    /**
     * A status of whether a Worker is reading a string.  --- UPDATED (Dexter) 20180528
     */
    static get reading() { return this._reading; } static reading(v) { this._reading = v; }

    /**
     * Initiation after the app is loaded.   --- UPDATED (Dexter) 20180528
     */
    static initiate() {
        CSV.worker = new Worker("readCSV.js");
        CSV.reading = false;
    }

    /**
     * Read the string into a table (2D-array).   --- UPDATED (Dexter) 20190220
     * CSV Parsing adapted from a stackoverflow answer:
     * https://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
     * @param {String} str - The original string to be parsed
     * @param {String[]} del - Characters acts as the delimiters
     * @returns {Array} 2-dimension array as a table
     */
    static read(str, del = [","]) {
        var ary = [];
        var inQ = false, row, col;
        for (let i = row = col = 0; i < str.length; i++) {
            let ch = str[i], nc = str[i+1];
            ary[row] = ary[row] || [];
            ary[row][col] = ary[row][col] || '';

            if (ch == '"' && inQ && nc == '"') { ary[row][col] += ch; ++i; continue; }  
            if (ch == '"') { inQ = !inQ; continue; }
            if (del.includes(ch) && !inQ) { ++col; continue; }

            if (ch == '\r' && nc == '\n' && !inQ) { ++row; col = 0; ++i; continue; }
            if (ch == '\n' && !inQ) { ++row; col = 0; continue; }
            if (ch == '\r' && !inQ) { ++row; col = 0; continue; }

            ary[row][col] += ch;
        }
        return ary.filter(row=>row.length>=2 || (row.length == 1 && row[0].length));
    }

    /**
     * Read a string asynchronously into a table (2D-array).   --- UPDATED (Dexter) 20180524
     * @param {String} str - The original string to be parsed
     * @param {String[]} del - Characters acts as the delimiters
     * @param {Boolean} errorAsDefault - Whether to display default CSV error in-app notification in case of error reading
     * @returns {Promise} A Promise that is resolved after the Worker has parsed the string
     */
    static readAsync(str,del=[','], errorAsDefault=true) {
        // Only read in Worker for long strings.
        if (str.length > 200) {
            // In case there is a reading worker, restart it.
            if (CSV.reading) {
                CSV.worker.terminate();
                CSV.worker = new Worker("readCSV.js");
            }

            return new Promise((resolve,reject)=>{
                // Update the status of the CSV reading, and add a message to the worker.
                CSV.reading = true;
                CSV.worker.addEventListener("message", e=>{
                    // Revert the reading status.
                    CSV.reading = false;

                    // Resolve the Promise with the results.
                    if (e.data.action="ok") resolve(e.data.data);
                    else {
                        if (errorAsDefault) AppNotification.show("readCSVErrorT","readCSVErrorC","cancel.svg")
                        reject(e.data.error);
                    }
                }, {once: true, capture: false});
                CSV.worker.postMessage({str: str, del: del})
            });
        } else {
            return Promise.resolve(CSV.read(str,del));
        }
    }
}

/** Class representing a partial implementation of nested Web Worker for supporting Chrome. Limited documentation provided.  --- UPDATED (Dexter) 20180804 */
class ChromeWebWorker {
    constructor(url, id) {
        this.url = url;
        this.id = id;
        this.worker = new Worker(url);
    }
    postMessage(msg) {
        this.worker.postMessage(msg);
    }
    listenMsg() {
        this.worker.addEventListener("message", (e) => {
            App.worker.postMessage({action: "subWorkerMsg", url: this.url, id: this.id, data: e.data})
        }, false);
    }
    terminate() {
        this.worker.terminate();
    }

    /**
     * Any subworkers stored.   --- UPDATED (Dexter) 20180804
     */
    static get all() { return this._all; } static set all(v) { this._all = v; }

    static initiate() {
        ChromeWebWorker.all = new Map();
    }

    static actions(e) {
        if (e.data.action == "subWorkerCreate") {
            ChromeWebWorker.all.set(e.data.url+"??"+e.data.id, new ChromeWebWorker(e.data.url, e.data.id));
        } else if (e.data.action == "subWorkerMsg") {
            ChromeWebWorker.all.get(e.data.url+"??"+e.data.id).postMessage(e.data.msg);
        } else if (e.data.action == "subWorkerAddMsg") {
            ChromeWebWorker.all.get(e.data.url+"??"+e.data.id).listenMsg();
        } else if (e.data.action == "terminateSubWorker") {
            ChromeWebWorker.all.get(e.data.url+"??"+e.data.id).terminate();
            ChromeWebWorker.all.delete(e.data.url+"??"+e.data.id);
        }
    }
}


// Preapre the app befoer the DOM is loaded.
App.prepare();