/*
    **************************** ABOUT 有關本檔案             ****************************

        worker.js:

            This is the JavaScript Web Worker file of the Ladder
            Web App to manage project folder parsing and controlling
            graph drawing flow.
            這是 Ladder 網頁應用程式的 JavaScript Web Worker 檔案。內裡
            包括管理專案資料夾的閱覽操作和管控資料圖表的繪製流程。

        Creators 創作團隊: 

            Yin-Chung Leung, Kai-Hsiang Lin, Jui-Hung Chang
            梁彥聰、林凱翔、張瑞紘

            @ Creative System and Software Applications Laboratory, National Cheng Kung Univerisity, Taiwan
            @ 創新系統軟體應用實驗室 —— 台灣 國立成功大學

        Version 版本:

            1903.00

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



/** Class defining CSV-related functions.   --- UPDATED (Dexter) 20180524 */
class CSV {
    /**
     * Read the string into a table (2D-array).   --- UPDATED (Dexter) 20180220
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
}

/** Class representing a partial implementation of nested Web Worker for supporting Chrome.   --- UPDATED (Dexter) 20180804 */
class ChromeWebWorker {
    constructor(url, id) {
        this.url = url;
        this.id = id;
        this.msgFtns = [];
        self.postMessage({action: "subWorkerCreate", url: url, id: id});
        ChromeWebWorker.all.set(this.url + '??' + this.id, this);
    }
    postMessage(msg) {
        self.postMessage({action: "subWorkerMsg", url: this.url, id: this.id, msg: msg});
    }
    addEventListener(type, ftn, bubble) {
        if (type == "message") {
            postMessage({action: "subWorkerAddMsg", url: this.url, id: this.id});
            this.msgFtns.push(ftn);
        }
    }
    terminate() {
        self.postMessage({action: "terminateSubWorker", url: this.url, id: this.id});
    }

    static get all() { return this._all; } static set all(v) { this._all = v; }

    static initiate() {
        ChromeWebWorker.all = new Map();
    }

    static receiveMsg(e) {
        if (e.data.action == "subWorkerMsg") {
            var worker = ChromeWebWorker.all.get(e.data.url + '??' + e.data.id);
            worker.msgFtns.forEach(ftn=>ftn({data: e.data.data}));
        }
        
    }
}

/** Class representing a training trial result of a date.   --- UPDATED (Dexter) 20180721 */
class TrialResult {
    /**
     * Creates a trial results of a specific date.   --- UPDATED (Dexter) 20180721
     * @param {Number} date - Number representation of a date
     */
    constructor(date) {
        this.date = date;
        this.trainLog = [];
        this.weightLog = [];
        this.testLog = [];
        this.cuzLog = [];
        this.traceLog = [];
        this.data = [];
        this.predictions = [];
        this.images = [];
        this.filters = [];
    }

    /**
     * Iterates on a 2D key-value paired array of trial result information.   --- UPDATED (Dexter) 20180721
     * @param {Function} ftn - A high level map function on iterating the key-value paired array of trial result information
     * @returns {Array} A mapped array on the trial result information based on the given function
     */
    map(ftn) {
        return [["trainLog", this.trainLog],["weightLog", this.weightLog],["cuzLog", this.cuzLog],["traceLog", this.traceLog],
                        ["testLog", this.testLog], ["data", this.data], ["predictions", this.predictions],
                        ["images", this.images], ["filters", this.filters]].map(ftn);
    }

    /**
     * Returns the value whether this trial result is blank, i.e. no information stored.   --- UPDATED (Dexter) 20180721
     * @returns {Boolean} Whether there is no logged information in this trial result
     */
    isBlank() {
        return this.trainLog.length == 0 && this.weightLog.length == 0 && this.cuzLog.length == 0 && 
        this.traceLog.length == 0 && this.testLog.length == 0 && this.data.length == 0 && 
        this.predictions.length == 0 && this.images.length == 0 && this.filters.length == 0;
    }

    /**
     * Get the results only on a specific build of the training.   --- UPDATED (Dexter) 20180721
     * @param {Number} buildNo - An integer representing the build number of the result log
     */
    getResultsFromBuildNo(buildNo) {
        return {trainLog: this.trainLog[buildNo], weightLog: this.weightLog[buildNo], testLog: this.testLog[buildNo], cuzLog: this.cuzLog[buildNo],
                traceLog: this.traceLog[buildNo],
                data: this.data[buildNo], predictions: this.predictions[buildNo], images: this.images[buildNo], filters: this.filters[buildNo]};
    }
}

/** Class representing a dashboard option.   --- UPDATED (Dexter) 20180722 */
class DashBoardOptions {
    /** Create a dashboard option */
    constructor() {
        this.fontSize = "auto";
        this.showLegend = true;
    }
}

/** Class representing an data option.   --- UPDATED (Dexter) 20180722 */
class DataOptions {
    constructor() {
        this.build = [];
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
    }
}

/** Class representing a dashboard item, like a training log or weight graph.   --- UPDATED (Dexter) 20180722 */
class DashboardItem {
    /**
     * Create a dashboard to be shown.   --- UPDATED (Dexter) 20180722
     * @param {String} id - The id of the dashboard item that this result is displaying.
     */
    constructor(id) {
        this.id = id; 
        this.initateWorker();
        this.drawingAction = null;
        this.drawn = false;
        this.data = null;
        this.conData = null;
        this.taskID = 0;
        this.dashBoardOptions = this.dataOptions = null;
    }

    /**
     * Get the object of the graph item, typically transferring information to a sub-Worker.   --- UPDATED (Dexter) 20180722
     * @param {Boolean} fullData - Whether full data is to be used.
     */
    toObject(fullData = true) {
        return {
            id: this.id, drawingAction: this.drawingAction, 
            data: (fullData || this.conData == null) ? this.data : null ,
            dashBoardOptions: this.dashBoardOptions, dataOptions: this.dataOptions, 
            conData: fullData? null :this.conData
        }
    }
    /**
     * Draw the data on the designated frontend element.   --- UPDATED (Dexter) 20180722
     * @param {Map} - A Map object with key-value pairs as the log type and File objects
     * @param {DashBoardOptions} dashBoardOptions - The dashboard options on the dashboard
     * @param {DataOptions} dataOptions - The data options on the dashboard
     */
    draw(datasets, dashBoardOptions, dataOptions = undefined) {
        this.__drawPreparation__(datasets, dashBoardOptions, dataOptions);
        this.__drawStart__();
    }

    /**
     * Prepare the drawing by assigning requested data and options.   --- UPDATED (Dexter) 20180722
     * @param {Map} - A Map object with key-value pairs as the log type and File objects.
     * @param {DashBoardOptions} dashBoardOptions - The graph options on the dashboard.
     * @param {DataOptions} dataOptions - The data options on the dashboard.
     */
    __drawPreparation__(datasets, dashBoardOptions, dataOptions = undefined) {
        // Restart worker if needed.
        this.restartWorkerIfNeeded();

        // The current action is "draw".
        this.drawingAction ="draw";

        // Increment a task number for worker task identification.
        this.taskID++;

        // Set the data and clear previous consolidated data.
        this.data = datasets;
        this.conData = null;

        // Setup requested graph options and data options.
        this.dashBoardOptions = dashBoardOptions;
        this.dataOptions = dataOptions;
    }

    /**
     * After preparing all the stuff, give feedback to the frontend and request the worket to start drawing.   --- UPDATED (Dexter) 20180722
     */
    __drawStart__() {
        // Ask the main thread to clear the SVG elements and show notification of creating the graph.
        mainThreadDashboardItemFtn(this.type, "clear", this.id);
        mainThreadDashboardItemFtn(this.type, "creatingGraph", this.id);

        // Ask the sub-worker to update the graph.
        this.worker.postMessage({action: "updateGraph", type: this.type, data: this.toObject(), taskID: this.taskID});
        
        // This is being asked to drawn now.
        this.drawn = true;
    }

    /**
     * Redraw the dashboard. No action is done for this base class   --- UPDATED (Dexter) 20180722
     * @param {DashBoardOptions} dashBoardOptions - The dashboard options on the dashboard
     * @param {DataOptions} dataOptions - The data options on the dashboard
     */
    redraw(dashBoardOptions = null, dataOptions = null) {
    }

    /**
     * Clear and reset this DashboardItem.   --- UPDATED (Dexter) 20180722
     */
    clear() {
        this.worker.terminate();
        this.initateWorker();
        this.drawingAction = null;
        this.drawn = false;
        this.data = null;
        this.conData = null;
        this.dashBoardOptions = this.dataOptions = null;
    }

    /**
     * Remove this graph item from its sub-call .all list.   --- UPDATED (Dexter) 20180530
     */
    remove() {
        // End the sub-Worker and remove from .all .
        this.worker.terminate();
        DashboardItem.all(this.type).delete(this.id);
    }

    /**
     * Restart worker if needed. Disabled because of potential browser crash due to frequent restarting.   --- UPDATED (Dexter) 20180530
     */
    restartWorkerIfNeeded() {
        /*  Too frequent worker termination and initiation will cause browser crash
            if (this.drawingAction) {
                this.worker.terminate(); 
                this.initateWorker();
            }
        
       if (this.drawingAction && (Date.now()-this.workerTime > 500)) {
            this.worker.terminate(); 
            this.initateWorker();
        }*/
    }

    /**
     * Initiate a sub-Worker for detailed data consolidation or element positioning.   --- UPDATED (Dexter) 20180804
     */
    initateWorker() {
        // Construct a new Worker.
        this.worker = self.Worker ? new Worker("draw.js?v="+workerVer) : new ChromeWebWorker("draw.js?v="+workerVer, this.id);

        // Remember the time of Worker creation.
        this.workerTime = new Date(Date.now());

        // Add a message event for receiving any Worker updates.
        this.worker.addEventListener("message", this.getMsg.bind(this), false);
    }

    /**
     * Actions fired after receiving a message from the sub-worker.   --- UPDATED (Dexter) 20180723
     * @param {MessageEvent} e - A message event from the sub-Worker
     */
    getMsg(e) {
        // Ensure the returned Worker task is the latest request.
        if (e.data.taskID == this.taskID) {
            if (e.data.action == "tooMuchData") {
                // Ask the main thread to update notification that too much data is to be shown.
                mainThreadDashboardItemFtn(this.type, "tooMuchData", this.id);
            } else if (e.data.action == "noData") {
                // Ask the main thread to update notification that no data is to be shown, typically due to no logged records.
                mainThreadDashboardItemFtn(this.type, "noRecords", this.id);
            } else {
                // See if there are sub class specific further actions.
                this.getMsgOnMoreActions(e.data);
            }
        }
    }

    /**
     * Sub-class specific actions fired after receiving a message from the sub-worker.   --- UPDATED (Dexter) 20180530
     * @param {Object} data - A message event data object from the sub-Worker
     */
    getMsgOnMoreActions(data) {
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
     * Redraw a specific dashboard item with optional new options.   --- UPDATED (Dexter) 20180804
     * @param {String} id - The container id of the Dashboard item.
     * @param {*} params - Any parameters to be passes for redraw() method as defined in each sub-classes.
     */
    static redraw(id, ...params) {
        DashboardItem.get(id).redraw(...params);
    }
}

/** Class representing a graph item, like a training log or weight graph.   --- UPDATED (Dexter) 20180722 */
class GraphItem extends DashboardItem {
    /**
     * Create a graph item to be shown on SVG.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the SVG item that this graph item is displaying.
     * @param {Number} width - The width of the SVG element.
     * @param {Number} height - The height of the SVG element.
     */
    constructor(id, width, height) {
        super(id);
        this.width = width;
        this.height = height;
        this.drawnEle = new Map();
        this.creatingEle = new Set();
    }

    /**
     * Get the object of the graph item, typically transferring information to a sub-Worker.   --- UPDATED (Dexter) 20180530
     * @param {Boolean} fullData - Whether full data is to be used.
     */
    toObject(fullData = true) {
        return {
            id: this.id, width: this.width, height: this.height, 
            drawingAction: this.drawingAction, data: (fullData || this.conData == null) ? this.data : null ,
            drawnEle: this.drawnEle, dashBoardOptions: this.dashBoardOptions,
            dataOptions: this.dataOptions, conData: fullData? null :this.conData
        }
    }

    /**
     * Draw the data on the SVG.   --- UPDATED (Dexter) 20180722
     * @param {Map} - A Map object with key-value pairs as the log type and File objects
     * @param {TrainLogGraphOptions|WeightGraphOptions} dashBoardOptions - The graph options on the graph item
     * @param {TrainLogDataOptions|WeightGraphDataOptions} dataOptions - The data options on the graph item
     */
    draw(datasets, dashBoardOptions, dataOptions) {
        super.__drawPreparation__(datasets, dashBoardOptions, dataOptions);

        // Clear the drawn elements or creating elements.
        this.drawnEle = new Map();
        this.creatingEle = new Set();

        super.__drawStart__();
    }

    /**
     * Redraw the SVG graph, typically to update some existing SVG elements.   --- UPDATED (Dexter) 20180804
     * @param {TrainLogGraphOptions|WeightGraphOptions} dashBoardOptions - The graph options on the graph item.
     * @param {TrainLogDataOptions|WeightGraphDataOptions} dataOptions - The data options on the graph item.
     * @param {bool} forceRefresh - Whether to force a refresh of all items in the graph.
     */
    redraw(dashBoardOptions = null, dataOptions = null, forceRefresh = false) {
        // Restart worker if needed.
        this.restartWorkerIfNeeded();

        // Force an update if needed, typically for those redraw that is not compatitble with simple element changes.
        if (forceRefresh) {
            this.drawnEle = new Map();
            this.creatingEle = new Set();
            mainThreadDashboardItemFtn(this.type, "clear", this.id);
        }

        // Update the graph options and data options if needed.
        this.dashBoardOptions = dashBoardOptions || this.dashBoardOptions;
        this.dataOptions = dataOptions || this.dataOptions;

        // The current action is "redraw".
        this.drawingAction = "redraw";

        // Increment a task number for worker task identification.
        this.taskID++;

        // Clear the creating elements.
        this.creatingEle = new Set();

        // Ask the sub-worker to update the graph.
        this.worker.postMessage({action: "updateGraph", type: this.type, data: this.toObject(dataOptions != null), taskID: this.taskID});
    }

    /**
     * TrainLog specific actions fired after receiving a message from the sub-worker.   --- UPDATED (Dexter) 20180723
     * @param {Object} data - A message event data object from the sub-Worker
     */
    getMsgOnMoreActions(data) {
        if (data.action == "draw") {
            // If it is to draw, add the element to .drawnEle Map, and ask the main thread to draw them.
            data.eleList.forEach(ele=>this.drawnEle.set(ele.id, ele));
            mainThreadDashboardItemFtn(this.type, "draw", this.id, data.eleList);
        } else if (data.action == "redraw") {
            // If it is to redraw, remember what have been redrawn first.
            data.eleList.forEach(ele=>{
                this.creatingEle.add(ele.id);
                this.drawnEle.set(ele.id, ele)
            });

            // Ask the main thread to update the elements.
            mainThreadDashboardItemFtn(this.type, "redraw", this.id, data.eleList);
        } else if (data.action == "Finished") {
            // If it has finished, check if the finished is from a redraw action.
            if (data.done == "redraw") {
                // If so, there may be some elements have to be removed, check through the full list of .drawnEle and the remembered list of .creatingEle during redraw() .
                var removedEle = [...this.drawnEle.keys()].filter(id=>!this.creatingEle.has(id));
                if (removedEle.length) {
                    mainThreadDashboardItemFtn(this.type, "removeEle", this.id, removedEle);
                    removedEle.forEach(id=>this.drawnEle.delete(id));
                }
            }

            // Now, no drawing action is taking now, and ask the main thread to update the notification of created graph.
            this.drawingAction = null;
            mainThreadDashboardItemFtn(this.type, "createdGraph", this.id);
        } else return true;
    }

    /**
     * Resize the SVG graph to a given size.   --- UPDATED (Dexter) 20180530
     * @param {Number} w - The new width of the SVG graph.
     * @param {Number} h - The new height of the SVG graph.
     */
    resize(w,h) {
        this.width = w; this.height = h;
        if (this.drawn) this.redraw();
    }

    /**
     * Clear and reset this GraphItem.   --- UPDATED (Dexter) 20180530
     */
    clear() {
        super.clear();
        this.drawnEle = new Map();
    }
}

/** Class representing a train log, a line chart representation for different measurements in trainlog or testlog.   --- UPDATED (Dexter) 20180530 */
class TrainLog extends GraphItem {
    /**
     * Create a train log to be shown on SVG.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The SVG item that this graph item is displaying
     * @param {Number} width - The width of the SVG element.
     * @param {Number} height - The height of the SVG element.
     */
    constructor(id, width, height) {
        super(id, width, height);
        this.type = "TrainLog";
    }

    /**
     * Draw the train log data on the SVG.   --- UPDATED (Dexter) 20180722
     * @param {Map} - A Map object with key-value pairs as the log type and File objects
     * @param {TrainLogGraphOptions} dashBoardOptions - The graph options on the graph item
     * @param {TrainLogDataOptions} dataOptions - The data options on the graph item
     */
    draw(datasets, dashBoardOptions=new TrainLogGraphOptions(), dataOptions = new TrainLogDataOptions()) {
        super.draw(datasets, dashBoardOptions, dataOptions);
    }

    /**
     * TrainLog specific actions fired after receiving a message from the sub-worker.   --- UPDATED (Dexter) 20181121
     * @param {Object} data - A message event data object from the sub-Worker
     */
    getMsgOnMoreActions(data) {
        if (super.getMsgOnMoreActions(data)) {
            if (data.action == "conData") {
                // If it's a consolidated data, remember it. If no data is given, update the notification to show as no records.
                this.conData = data.data;

                // Set up available runs or cross validation options.
                mainThreadDashboardItemFtn(this.type, "setUpRunCVOptions", this.id, data.data.availableRuns, data.data.availableCVs);
            } else if (data.action == "setUpHover") {
                // Set up data line hovering information.
                mainThreadDashboardItemFtn(this.type, "setUpHover", this.id, data.dlInfos, data.topmost, data.bottommost, data.leftmost, data.rightmost);
            }
        }
    }

    /**
     * All of the displaying TrainLog graph items.   --- UPDATED (Dexter) 20180530
     */
    static get all() { return this._all; } static set all(v) { this._all = v; }

    /**
     * Clear all train logs.   --- UPDATED (Dexter) 20180530
     */
    static clearAll() {
        TrainLog.all.forEach(db=>db.clear());
    }

    /**
     * Create a train logs with a given size.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the SVG item that this graph item is displaying
     * @param {Number} width - The width of the SVG element
     * @param {Number} height - The height of the SVG element
     */
    static create(id, w, h) {
        if (!TrainLog.all) TrainLog.all = new Map();
        TrainLog.all.set(id, new TrainLog(id, w, h));
    }

    /**
     * Remove a train log.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the SVG item that this graph item is displaying
     */
    static remove(id) {
        TrainLog.all.get(id).remove();
    }

    /**
     * Resize a train log with a given size.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the SVG item that this graph item is displaying
     * @param {Number} width - The width of the SVG element
     * @param {Number} height - The height of the SVG element
     */
    static resize(id, w, h) {
        TrainLog.all.get(id).resize(w,h);
    }
}

/** Class representing weight graph options.   --- UPDATED (Dexter) 20180722 */
class WeightGraphOptions extends DashBoardOptions {
    constructor() {
        super();
        this.channel = [[0,75,50,0], [0,0,50,.5],[120,0,50,.5], [120,75,50,1]];
    }
}

/** Class representing options for a train log, typically data extraction related options.   --- UPDATED (Dexter) 20180722 */
class WeightGraphDataOptions extends DataOptions {
    constructor() {
        super();
        this.step = "auto";
        this.sorted = false;
        this.weightItem = "auto";
        this.fixedRange = false;
    }
}

/** Class representing a weight graph, a grid color representation of weight logs.   --- UPDATED (Dexter) 20180530 */
class WeightGraph extends GraphItem {
    /**
     * Create a weight graph log to be shown on SVG.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The SVG item that this graph item is displaying
     * @param {Number} width - The width of the SVG element.
     * @param {Number} height - The height of the SVG element.
     */
    constructor(id, width, height) {
        super(id, width, height);
        this.type = "WeightGraph";
    }

    /**
     * Draw the weight log data on the SVG.   --- UPDATED (Dexter) 20180722
     * @param {Map} - A Map object with key-value pairs as the log type and File objects
     * @param {WeightGraphOptions} dashBoardOptions - The graph options on the weight graph
     * @param {WeightGraphDataOptions} dataOptions - The data options on the weight graph
     */
    draw(datasets, dashBoardOptions=new WeightGraphOptions(), dataOptions = new WeightGraphDataOptions()) {
        super.draw(datasets, dashBoardOptions, dataOptions);
    }

    /**
     * WeightGraph specific actions fired after receiving a message from the sub-worker.   --- UPDATED (Dexter) 20180721
     * @param {Object} data - A message event data object from the sub-Worker
     */
    getMsgOnMoreActions(data) {
        if (super.getMsgOnMoreActions(data)) {
            if (data.action == "conData") {
                if (data.data.hasData) {
                    // If there are records, update the current displaying type (weight / bias).
                    mainThreadDashboardItemFtn("WeightGraph", "updateType", this.id, data.data.colName.includes("bias"));

                    // Also update all available columns (weights/biases) for user selections.
                    if (!this.conData || (this.conData.allCols.some(c=>!data.data.allCols.includes(c)) || data.data.allCols.some(c=>!this.conData.allCols.includes(c)))) {
                        mainThreadDashboardItemFtn("WeightGraph", "updateAllCol", this.id, data.data.allCols, data.data.colName);
                    }

                    // Set up available runs or cross validation options.
                    mainThreadDashboardItemFtn(this.type, "setUpRunCVOptions", this.id, data.data.availableRuns, data.data.availableCVs);
                }
                
                // Remember the consolidated data.
                this.conData = data.data;
            } else if (data.action == "updateSliderAction") {
                // Set up step slider hovering information.
                mainThreadDashboardItemFtn("WeightGraph", "updateSliderAction", this.id, data.hoverList, data.allSteps, data.minY, data.maxY, data.stepNow);
            } 
        }
    }

    /**
     * All of the displaying WeightGraph graph items.   --- UPDATED (Dexter) 20180530
     */
    static get all() { return this._all; } static set all(v) { this._all = v; }

    /**
     * Clear all weight graphs.   --- UPDATED (Dexter) 20180530
     */
    static clearAll() {
        WeightGraph.all.forEach(db=>db.clear());
    }

    /**
     * Create a weight graph with a given size.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the SVG item that this graph item is displaying
     * @param {Number} width - The width of the SVG element
     * @param {Number} height - The height of the SVG element
     */
    static create(id, w, h) {
        if (!WeightGraph.all) WeightGraph.all = new Map();
        WeightGraph.all.set(id, new WeightGraph(id, w, h));
    }

    /**
     * Remove a weight graph.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the SVG item that this graph item is displaying
     */
    static remove(id) {
        WeightGraph.all.get(id).remove();
    }

    /**
     * Resize a weight graph with a given size.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the SVG item that this graph item is displaying
     * @param {Number} width - The width of the SVG element
     * @param {Number} height - The height of the SVG element
     */
    static resize(id, w, h) {
        WeightGraph.all.get(id).resize(w,h);
    }

    /**
     * Redraw a specific weight graph, typically request from the main thread on changing weight types or step.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the SVG item that this graph item is displaying
     * @param {*} args - Arguements for redrawing the weight graph
     */
    static redraw(id, ...args) {
        WeightGraph.all.get(id).redraw(...args);
    }
}

/** Class representing trace log options.   --- UPDATED (Dexter) 20180722 */
class TraceLogOptions extends DashBoardOptions {
    /**
     * Create a trace log option object.   --- UPDATED (Dexter) 20180722
     */
    constructor() {
        super();
        this.display = "auto";      // "auto": default UX /"table": show in table format
        this.hideTarget = true;     // Whether to show the target results for comparison
    }
}

/** Class representing trace log data options.   --- UPDATED (Dexter) 20180722 */
class TraceLogDataOptions extends DataOptions {
    /**
     * Create a trace log Data option object.   --- UPDATED (Dexter) 20180722
     */
    constructor() {
        super();
        this.step = "auto";
        this.finalLayer = "auto";
    }
}
/** Class representing a trace log, a visualization of traced sampled records.   --- UPDATED (Dexter) 20180721 */
class TraceLog extends DashboardItem {
    /**
     * Create a trace log to be shown.   --- UPDATED (Dexter) 20180722
     * @param {String} - The id of the dashboard item that this result is displaying.
     */
    constructor(id) {
        super(id);
        this.type = "TraceLog";
    }

    /**
     * Draw the trace log data on the div element.   --- UPDATED (Dexter) 20180722
     * @param {Map} - A Map object with key-value pairs as the log type and File objects
     * @param {TraceLogOptions} dashBoardOptions - The graph options on the trace log
     * @param {TraceLogDataOptions} dataOptions - The data options on the trace log
     */
    draw(datasets, dashBoardOptions=new TraceLogOptions(), dataOptions = new TraceLogDataOptions()) {
        super.draw(datasets, dashBoardOptions, dataOptions);
    }

    /**
     * Redraw the train log.   --- UPDATED (Dexter) 20180724
     * @param {TraceLogOptions} dashBoardOptions - The graph options on the trace log
     * @param {TraceLogDataOptions} dataOptions - The data options on the trace log
     */
    redraw(dashBoardOptions = null, dataOptions = null) {
        // Restart worker if needed.
        this.restartWorkerIfNeeded();

        // Update the graph options and data options if needed.
        this.dashBoardOptions = dashBoardOptions || this.dashBoardOptions;
        this.dataOptions = dataOptions || this.dataOptions;

        // The current action is "redraw".
        this.drawingAction = "redraw";

        // Increment a task number for worker task identification.
        this.taskID++;

        // Ask the sub-worker to update the graph.
        this.worker.postMessage({action: "updateGraph", type: this.type, data: this.toObject(dataOptions != null), taskID: this.taskID});
    }

    /**
     * TrainLog specific actions fired after receiving a message from the sub-worker.   --- UPDATED (Dexter) 20180723
     * @param {Object} data - A message event data object from the sub-Worker
     */
    getMsgOnMoreActions(data) {
        if (data.action == "draw") {
            mainThreadDashboardItemFtn(this.type, "draw", this.id, data.subAction, data.data);
        } else if (data.action == "redraw") {
            // Ask the main thread to update the elements.
            mainThreadDashboardItemFtn(this.type, "draw", this.id, data.subAction, data.data);
        } else if (data.action == "resize") {
            mainThreadDashboardItemFtn(this.type, "resize", this.id);
        } else if (data.action == "Finished") {
            // Now, no drawing action is taking now, and ask the main thread to update the notification of created graph.
            this.drawingAction = null;
            mainThreadDashboardItemFtn(this.type, "createdGraph", this.id);
        } else return true;
    }

    /**
     * All of the displaying TraceLog items.   --- UPDATED (Dexter) 20180722
     */
    static get all() { return this._all; } static set all(v) { this._all = v; }

    /**
     * Clear all trace logs.   --- UPDATED (Dexter) 20180805
     */
    static clearAll() {
        TraceLog.all.forEach(db=>db.clear());
    }

    /**
     * Create a weight graph with a given size.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the <div> item that this graph item is displaying
     */
    static create(id) {
        if (!TraceLog.all) TraceLog.all = new Map();
        TraceLog.all.set(id, new TraceLog(id));
    }

    /**
     * Redraw a specific trace log, typically request from the main thread on changing weight types or step.   --- UPDATED (Dexter) 20180530
     * @param {String} id - The id of the dashboard item that this trace log is displaying
     * @param {*} args - Arguements for redrawing the trace log
     */
    static redraw(id, ...args) {
        TraceLog.all.get(id).redraw(...args);
    }
}

/** Class representing a project folder.   --- UPDATED (Dexter) 20180530 */
class ProjectFolder {
    /**
     * Create a project folder.   --- UPDATED (Dexter) 20180530
     * @param {...TrialResult} trialResults - Multiple trial results in a project folder
     */
    constructor(...trialResults) {
        this.trialResults = trialResults;
        this.parsedData = null;
        this.fileToRead = 0;
        this.dashBoardID = null;
        this.weightGraphID = null;
    }

    /**
     * Check with this project folder includes equal dates with requested dates.   --- UPDATED (Dexter) 20180531
     * @param {Number[]} dates - An array of multiple number representations of dates to be displayed
     * @returns {Boolean} Whether the project folder has equal dates with the requested dates
     */
    checkEqualDates(dates) {
        const curDates = this.trialResults.map(tr=>tr.date);
        return curDates.length == dates.length && dates.every(d=>curDates.includes(d));
    }

    /**
     * Read a file as a CSV string.   --- UPDATED (Dexter) 20190225
     * @param {File} file - a File object
     * @returns {Promise} Resolves after the file is read and parsed; reject in case of any errors
     */
    readCSVFile(file) {
        if (file) {
            // If there is a file, create a FileReader object to read it.
            var fr = new FileReader();
            return new Promise((resolve,reject)=>{
                // Reject with error in case of any reading error.
                fr.addEventListener("error", e=>{
                    reject("frReadingErrorC")
                });
                
                // Resolve the parsed CSV Array after the file is read; reject in case of any parsing error.
                fr.addEventListener("load", e=>{
                    var txt = e.target.result;

                    // Check if there is error.
                    if (txt.startsWith("\uFEFF")) {
                        txt = txt.slice(1);
                    } else if (txt.startsWith("\u00EF\u00BB\u00BF")) {
                        txt = txt.slice(3);
                    } else if (txt.includes("�")) {
                        reject("frEncodingError");
                    } 

                    try {
                        resolve(CSV.read(txt));
                    } catch(err) {
                        reject("frReadingCSVErrorC");
                    }
                });

                // Request the file reader to read as text.
                fr.readAsText(file);
            });
        } else return null;
        // If there is no file, it resolves a null value.
    }

    /**
     * An async function to read all the CSV files.   --- UPDATED (Dexter) 20180530
     * @param {File[]} fileAry - An array of File objects
     * @returns {Array[]} An array of parsed table arrays from the files
     * @throws {String} A translatable key for a file reading error notification content
     */
    async readCSVFiles(fileAry) {
        // Typically this is reading an array of files of different builds in a type like trainLogs/testLogs. Noted some of them may be null because the file may not exist.
        return await Promise.all(fileAry.map(f=>this.readCSVFile(f)));
    }

    /**
     * Read and parse the files of this ProjectFolder.   --- UPDATED (Dexter) 20180721
     * @throws {String} A translatable key for a file reading error notification content
     */
    async readData() {
        if (!this.parsedData) {
            // Parse the train result into the array structure of [[date, [[logKey, parsed data]+]]+]: The first dimension contains multiple records of date-trial results pairs; the trial results contains builds of records of logname-parsed data pairs.
            var parsedData = await Promise.all(this.trialResults.map(tr=>Promise.all([tr.date,Promise.all(tr.map(async trInfo=>{
                const fileAry = trInfo[1], key = trInfo[0];
                if (["trainLog", "testLog", "weightLog", "cuzLog", "traceLog"].includes(key)) {
                    // For specific log files, parse them as CSV tables.
                    return [key, await this.readCSVFiles(fileAry)];
                } else {
                    // TODO [Project/Parse Data Files]
                    // Action:  Parse other log files like images. 
                    // Reason:  Other log files parsing has not been implemented.
                    return [key, true];
                }
            }))])))

            // Restructure as a Map object based on the record date.
            this.parsedData = new Map(parsedData.map(tr=>[tr[0],new Map(tr[1])]));

            // Give feedback to the user that the read-in of files has been finished.
            mainThreadFtn("ProjectFolder", "finishReadIn");
        }
    }

    /**
     * Try to draw the project folder results on the SVG graph.   --- UPDATED (Dexter) 20180722
     * @param {String} type - The type of the graph item
     * @param {String} id - The SVG item that this graph item is displaying
     * @param {TrainLogGraphOptions|WeightGraphOptions|TraceLogOptions} dashBoardOptions 
     *          - The graph options of the graph item
     * @param {TrainLogGraphOptions|WeightGraphDataOptions} dataOptions 
     *          - The data options of the graph item
     */
    tryDraw(type, id, dashBoardOptions, dataOptions = undefined) {
        // Read the data first
        this.readData().then(()=>{
            // Get the graph item and draw the graph.
            DashboardItem.all(type).get(id).draw(this.parsedData, dashBoardOptions, dataOptions);
        }, (e)=>{
            // In case of any errors, show the notification for warning the user.
            mainThreadFtn("ProjectFolder","readingError","frReadingErrorT", (e||"frReadingErrorC"), "❌")
        });
    }

    /**
     * A Map with edit date and its Trial Result key-value pair.   --- UPDATED (Dexter) 20180530
     */
    static get dir() { return this._dir; } static set dir(v) { this._dir = v; }

    /**
     * The current core Project Folder.   --- UPDATED (Dexter) 20180530
     */
    static get currentFolder() { return this._f; } static set currentFolder(v) { this._f = v; }

    /**
     * Initiation after the app is loaded, or reset the static variables.   --- UPDATED (Dexter) 20180530
     */
    static initiate() {
        ProjectFolder.dir = new Map();
        ProjectFolder.currentFolder = null;
    }

    /**
     * Read a file map given from the main thread, typically a folder read-in.   --- UPDATED (Dexter) 20190119
     * @param {Map} fileMap - A Map object using relative path as the key and File object
     */
    static read(fileMap) {
        // Reset all the static variables in ProjectFolder.
        ProjectFolder.initiate();

        if (fileMap.size == 0) {
            // If there are no files, notify the user.
            mainThreadFtn("AppNotification","show","frNofilesT", "frNofilesC", "💨");
        } else {
            // Otherwise, collect the filenames and files.
            var fileNames = [...fileMap.keys()].map(path=>path.split(/[\/\\]/gi));
            var files = [...fileMap.values()];

            // Understand what relative path level is on it. In SimTF output, the folder should be trainName/outputLogs/trailDate/logFiles .
            const currentLevel = ((fileNames[0][0].match(/\d\d\d\d \d\d\d\d/) != null || fileNames[0][0].match(/\d\d\d\d \d\d\d\d\d\d/) != null) ? -1 : fileNames[0][0] == "outputLogs" ? 0 : -2);
            const  typeI = currentLevel, trialI = 1+currentLevel, ctxI = 2+currentLevel;
            
            if (currentLevel >= -1) {
                // Action to do only a valid folder level is fed in.

                // Prepare a String to Number representation of date Map for caching the information.
                var allDateStr = new Map();

                // For each file names, prepare the structuring of the folder.
                fileNames.forEach((fn,i)=>{
                    // Get the string date and convert to a number representation of date; get previously cached number in allDateStr if needed.
                    const dateFolder = fn[trialI];
                    var editDate = null;
                    if (allDateStr.has(dateFolder)) {
                        editDate = allDateStr.get(dateFolder);
                    } else if (dateFolder.search(/^\d\d\d\d \d\d\d\d$/) == 0) {
                        editDate = Number(new Date(0, Number(dateFolder.slice(0,2))-1, Number(dateFolder.slice(2,4)), Number(dateFolder.slice(5,7)), Number(dateFolder.slice(7,9))));
                        allDateStr.set(dateFolder, editDate);
                    } else if (dateFolder.search(/^\d\d\d\d \d\d\d\d\d\d$/) == 0) {
                        editDate = Number(new Date(0, Number(dateFolder.slice(0,2))-1, Number(dateFolder.slice(2,4)), Number(dateFolder.slice(5,7)), Number(dateFolder.slice(7,9)), Number(dateFolder.slice(9,11))));
                        allDateStr.set(dateFolder, editDate);
                    }

                    // If it's a valid date, continue for structuring.
                    if (editDate != null) {
                        // Openning at either outputLogs folder or date level.
                        if (currentLevel == -1 || fn[typeI] == "outputLogs") {
                            // Ensure there is a TrialResult object for this date.
                            if (!ProjectFolder.dir.has(editDate)) ProjectFolder.dir.set(editDate, new TrialResult(editDate));
                            var trialResult = ProjectFolder.dir.get(editDate);

                            // Context name is like images_buildNo / trainLog_buildNo .
                            const ctx = fn[ctxI].split("_");

                            if (ctx.length > 1) {
                                // Ensure the files are those log files, get the build number of the log.
                                const buildNo = Number(ctx[1].slice(0, ctx[1].lastIndexOf(".")));

                                // If it's a correct syntax of file name, put the file into the structure of a TrialResult object.
                                if (buildNo != NaN) {
                                    if (ctx[0] == "trainLog") {
                                        trialResult.trainLog[buildNo] = files[i];
                                    } else if (ctx[0] == "weightLog") {
                                        trialResult.weightLog[buildNo] = files[i];
                                    } else if (ctx[0] == "testLog") {
                                        trialResult.testLog[buildNo] = files[i];
                                    } else if (ctx[0] == "cuzLog") {
                                        trialResult.cuzLog[buildNo] = files[i];
                                    } else if (ctx[0] == "traceLog") {
                                        trialResult.traceLog[buildNo] = files[i];
                                    }
                                }
                            } else if (fn[ctxI].endsWith(".json")) {
                                // TODO [Project/Open Data Files]
                                // Action:  Parse project info within a folder. 
                                // Reason:  Per trial project recording has not been implemented.
                            }
                        } 
                    }
                });

                if ([...ProjectFolder.dir.values()].every(r=>r.isBlank())) {
                    // If there is no files is every readable TrailResults object, there have been errors.
                    mainThreadFtn("ProjectFolder", "incorrectFolderReadIn");
                } else {
                    // Otherwise, display Results Folder. Firstly, get all the dates in a sort order.
                    const allDates = [...ProjectFolder.dir.keys()].sort((a,b)=>(a-b < 0) ? 1 : -1).map(d=>new Date(d));

                    // Get the latest date as default to display.
                    const dNow = allDates[0];

                    // Create a project folder based on the display date, and check how many dates are available for weight graph presentation.
                    ProjectFolder.currentFolder = new ProjectFolder(ProjectFolder.dir.get(Number(dNow)));
                    const specialLogDates = new Map(["weightLog", "traceLog"].map(specialLog=>[specialLog, new Set([...ProjectFolder.dir].filter(r=>r[1][specialLog].filter(l=>l).length).map(r=>Number(r[0])))]));
                    
                    // Give feedback to the main thread on the date information.
                    mainThreadFtn("ProjectFolder", "startFolderUI", dNow, allDates, specialLogDates);
                }
            } else {
                // Otherwise, this is not a correct SimTF output folder.
                mainThreadFtn("ProjectFolder", "incorrectFolderReadIn");
            }
        }
    }

    /**
     * Draw the results of a folder.   --- UPDATED (Dexter) 20180722
     * @param {String} type - The type of the graph item
     * @param {Number[]} dates - An array of multiple number representations of dates to be displayed
     * @param {String} graphID - The HTML element ID of the displaying SVG graph
     * @param {*} options - Graph and data options on the graph
     * @param {TrainLogGraphOptions|WeightGraphOptions|TraceLogOptions} options[0] 
     *          - The graph options on the graph item
     * @param {TrainLogDataOptions|WeightGraphDataOptions} options[1] 
     *          - The data options on the graph item
     */
    static drawFolder(type = "TrainLog", dates=null, graphID=(type == "TrainLog" ? "dashBoardSVG" : type == "WeightGraph" ? "weightGraphSVG" : "traceLogDashboard"), ...options) {
        var folder = ProjectFolder.currentFolder = (!dates || !dates.length || (ProjectFolder.currentFolder && ProjectFolder.currentFolder.checkEqualDates(dates)))? ProjectFolder.currentFolder : new ProjectFolder(...dates.map(d=>ProjectFolder.dir.get(d)));
        folder.tryDraw(type, graphID, ...options);
    }
}

/**
 * Call the main thread function.   --- UPDATED (Dexter) 20180530
 * @param {String} className - The class to be called
 * @param {String} ftn - The static function name of the class to be called
 * @param {*} args - The arguments to be passed
 */
function mainThreadFtn(className, ftn, ...args) {
    postMessage({action: "callFunction", className: className, ftn: ftn, args: args});
}

/**
 * Call the function of a DashBoard object.   --- UPDATED (Dexter) 20180530
 * @param {String} type - The sub-class name of the GraphItem
 * @param {String} ftn - The function name to be called
 * @param {String} id - The element id of the SVG graph
 * @param {*} args - The arguments to be passed
 */
function mainThreadDashboardItemFtn(type, ftn, id, ...args) {
    postMessage({action: "callFunction", className: type, id: id, ftn: ftn, args: args});
}

// Set up a random worker version to avoid the Web Worker being crashed by the browser.
const workerVer = Math.random();

/**
 * Actions fired when a message is received.   --- UPDATED (Dexter) 20180530
 * @param {MessageEvent} e - A web worker message event
 * @param {String} e.data.action - The action to be taken
 */
function receiveMsg(e) {
    if (e.data.action == "initiate") {
        ChromeWebWorker.initiate();
        ProjectFolder.initiate();
    } else if (e.data.action == "newProjectFolder") {
        ProjectFolder.read(e.data.files);
    } else if (e.data.action == "callFunction") {
        if (e.data.className == "ProjectFolder") {
            ProjectFolder[e.data.ftn](...e.data.args);
        } else if (e.data.className == "TrainLog") {
            TrainLog[e.data.ftn](...e.data.args);
        } else if (e.data.className == "WeightGraph") {
            WeightGraph[e.data.ftn](...e.data.args);
        } else if (e.data.className == "TraceLog") {
            TraceLog[e.data.ftn](...e.data.args);
        } else if (e.data.className == "DashboardItem") {
            DashboardItem[e.data.ftn](...e.data.args);
        } 
    } else if (e.data.action.startsWith("subWorker")) {
        ChromeWebWorker.receiveMsg(e);
    }
}

self.addEventListener("message", receiveMsg, false);