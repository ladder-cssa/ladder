/*
    **************************** ABOUT 有關本檔案             ****************************

        script.js:

            This is the JavaScript Web Worker file of the Ladder 
            Web App to consolidate data in result folders data, and 
            to prepare SVG element information for visualizing the 
            results in data tables / graphs.
            這是 Ladder 網頁應用程式的 JavaScript Web Worker 檔案。內裡
            包括整理結果資料夾的數據資訊，並準備用作神覺化資料表或圖表的
            SVG 元素資訊。

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


/**
 * Round a number to a specific decimal place.   --- UPDATED (Dexter) 20180530
 * Accurate Rounding adapted from MDN (credits to Lam Wei Li):
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
 * @param {Number} n - The original number
 * @param {Number} precision - The precision decial place
 * @returns {Number} - The rounded number.
 */ 
function round(n, precision) {
    var shift = (n, precision) => {
        const numAry = ("" + n).split("e");
        return +(numAry[0] + "e" + (numAry[1] ? (+numAry[1] + precision) : precision));
    }
    return shift(Math.round(shift(n, +precision)), -precision);
}

/**
 * Class representing a matrix operation.   --- UPDATED (Dexter) 20181121
 */
class Matrix {
    /**
     * Flatten a multi-dimensional array; assume the dimensional lengths are consistent across elements.   --- UPDATED (Dexter) 20180530
     * @param {Array|*} ary - A multi-dimensional array; or the deepest dimensional element
     */
    static flatten(ary) {
        // Only flatten if ary is an array.
        if (ary instanceof Array) {
            return ary.map(e=>Matrix.flatten(e)).reduce((a,c)=>a.concat(c),[]);
        } else return ary;
    }

    /**
     * Add a multi-dimensional array or constant element-wise; assume the dimensional lengths are consistent across elements.   --- UPDATED (Dexter) 20181121
     * @param {[Array|Number][]} matrices - A multi-dimensional array, or a constant value.
     */
    static add(...matrices) {
        if (matrices.some(mx=>mx instanceof Array)) {
            return matrices.find(mx => mx instanceof Array).map((ele,idx)=>Matrix.add(...matrices.map(mx=>mx instanceof Array ? mx[idx] : mx)));
        } else return matrices.reduce((a,b) => a+b);
    }

    /**
     * Flatten a multi-dimensional array; assume the dimensional lengths are consistent across elements.   --- UPDATED (Dexter) 20181121
     * @param {[Array|Number][]} matrices - A multi-dimensional array, or a constant value.
     */
    static multiply(...matrices) {
        if (matrices.some(mx=>mx instanceof Array)) {
            return matrices.find(mx => mx instanceof Array).map((ele,idx)=>Matrix.multiply(...matrices.map(mx=>mx instanceof Array ? mx[idx] : mx)));
        } else return matrices.reduce((a,b) => a*b);
    }
}

/** Class representing a predefinition of an SVG element.   --- UPDATED (Dexter) 20180726 */
class PreSVGElement {
    /**
     * Create a predefinition of an SVG element.   --- UPDATED (Dexter) 20180530
     * @param {String} type - The element tag name.
     * @param {String} id - The element id.
     */
    constructor(type, id) {
        this.type = type;
        this.id = id;
        this.attr = new Map();
        this.dataset = new Map();
        this.privateData = new Map();
        this.class = new Set();
        this.clearClass = new Set();
        this.textContent = "";
        this.appendIn = "";
    }

    /**
     * Set the attribute of the SVG element.   --- UPDATED (Dexter) 20180530
     * @param {String} key - The attribute name.
     * @param {String} attr - The attribute value.
     */
    setAttribute(key, attr) {
        this.attr.set(key, attr);
    }

    /**
     * Add a class to the SVG element.   --- UPDATED (Dexter) 20180530
     * @param {String} key - The class name.
     */
    setClass(key) {
        this.class.add(key);
    }

    /**
     * Remove a class to the SVG element.   --- UPDATED (Dexter) 20180726
     * @param {String} key - The class name.
     */
    removeClass(key) {
        this.clearClass.add(key);
    }

    /**
     * Set a dataset attribute on the SVG element.   --- UPDATED (Dexter) 20180530
     * @param {String} key - The dataset key.
     * @param {String} val - The dataset value.
     */
    setDataset(key, val) {
        this.dataset.set(key, val);
    }

    /**
     * Set a private data on the SVG element.   --- UPDATED (Dexter) 20180721
     * @param {String} key - The dataset key.
     * @param {String} val - The dataset value.
     */
    setPrivateData(key, val) {
        this.privateData.set(key, val);
    }
}

/** Class representing a dashboard item, like a training log or weight graph.   --- UPDATED (Dexter) 20180722 */
class DashboardItem {
    /**
     * Create a dashboard to be shown.   --- UPDATED (Dexter) 20180722
     * @param {Object} data - The data object that is passed for creation of the dashboard item.
     * @param {String} data.id - The id of the dashboard item that this result is displaying.
     * @param {Map} data.data - A Map object on all relevant data with date and another Map object as the key-value pair; The value of each date-related data is a key-value pair of matching the log type and parsed data.
     * @param {*} data.conData - Consolidated data of any structure depending on the sub-class.
     * @param {*} data.dashBoardOptions - A graph option.
     * @param {*} data.dataOptions - An data option.
     */
    constructor(data) {
        this.id = data.id; 
        this.data = data.data;
        this.conData = data.conData;
        this.dashBoardOptions = data.dashBoardOptions
        this.dataOptions = data.dataOptions;
    }

    /**
     * Calculate all necessary SVG elements positioning and details.Only sub-classes would have codes on this.   --- UPDATED (Dexter) 20180531
     * @param {String} action - Type of action, "draw" or "redraw"
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    drawDetails(action, taskID) {
    }

    /**
     * Digest the data from a date/log related structure into a presentation cache of necessary data information. Only sub-classes would have codes on this.   --- UPDATED (Dexter) 20180721
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    consolidateData(taskID) {
    }

    /**
     * Draw the data on the SVG.   --- UPDATED (Dexter) 20180721
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    draw(taskID) {
        // Consolidate the data first then draw on the SVG.
        this.consolidateData(taskID);
        if (this.conData.hasData) this.drawDetails("draw", taskID);
        else postMessage({action: "noData", taskID: taskID});
    }

    /**
     * Redraw the SVG graph, typically to update some existing SVG elements.   --- UPDATED (Dexter) 20180721
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    redraw(taskID) {
        // Check if any cached data can be used, otherwise, consolidate then draw.
        if (this.conData == null) this.consolidateData(taskID);
        if (this.conData.hasData) this.drawDetails("redraw", taskID);
        // No message post for no data because this is only a redraw.
    }

    /**
     * Call a function, typically from the message event of this Worker.   --- UPDATED (Dexter) 20180531
     * @param {String} type - The class of the Graph Item
     * @param {Object} data - Parameters for constructing a Graph Item object
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    static assignFuntion(type, data, taskID) {
        // Create a GraphItem as called from "worker.js".
        var db = new (type == "TrainLog" ? TrainLog: type == "WeightGraph" ? WeightGraph : type == "TraceLog" ? TraceLog : DashboardItem)(data);

        // Call the function as requested.
        db[data.drawingAction](taskID);
    }
}

/** Class representing a graph item, like a training log or weight graph.   --- UPDATED (Dexter) 20180531 */
class GraphItem extends DashboardItem {
    /**
     * Create a graph item to be shown on SVG.   --- UPDATED (Dexter) 20180722
     * @param {Object} data - The data object that is passed for creation of the graph item.
     * @param {String} data.id - The id of the SVG item that this graph item is displaying
     * @param {Number} data.width - The width of the SVG element
     * @param {Number} data.height - The height of the SVG element
     * @param {Map} data.drawnEle - A Map object on previously drawn elements with id and its PreSVGElement object as the key-value pair
     * @param {Map} data.data - A Map object on all relevant data with date and another Map object as the key-value pair; The value of each date-related data is a key-value pair of matching the log type and parsed data
     * @param {*} data.conData - Consolidated data of any structure depending on the sub-class
     * @param {*} data.dashBoardOptions - A graph option
     * @param {*} data.dataOptions - An data option
     */
    constructor(data) {
        super(data);
        this.w = data.width;
        this.h = data.height;
        this.drawnEle = data.drawnEle;
    }
}

/** Class represening a log data column */
class LogDataColumn {
    /**
     * Create a log data column object.   --- UPDATED (Dexter) 20181120
     * @param {Array[][]} data - The 2D array of data.
     */
    constructor(data) {
        // Sort all the data with ascending x-values.
        data.sort((a,b)=>a[0]-b[0] > 0 ? 1 : -1);
        
        // Assign the values.
        this._data = data;
        this._xVal = new Set(data.map(coor=>coor[0]));

        // Check if aggregation is needed, typically because multiple cross validation or runs were considered.
        this._aggregation = this._xVal.size < data.length;
        this._dataAgg = null;

        // Different data plots.
        this.coreDataLine = [];
        this.mvAvgDataLine = [];
        this.stDevDataLine = [];
        this.rangeDataBox = [];
        this.aggregate();

        // Cache the min/max for future use.
        this.dMin = this.dMax = this.dRange = 0;
        this.xMin = this.coreDataLine[0][0];
        this.xMax = this.coreDataLine.slice(-1)[0][0];
    }

    /**
     * Aggregate the data, and set the core data line.   --- UPDATED (Dexter) 20181120
     */
    aggregate() {
        // If there is no need for aggregation, the core data line would be the original data.
        if (!this._aggregation) this.coreDataLine = this._data;
        else {
            // Otherwise, prepare the data aggregation by the x coordinates, typically the training step.
            var dataAgg = [], i = 0, tempAry = [], dataLen = this._data.length;

            // Since the data is sorted, make use of the order, and slice the data to different arrays by the x coordinates.
            while (dataAgg.length < this._xVal.size && dataLen) {
                if (i+1 >= dataLen || this._data[i][0] != this._data[i+1][0]) {
                    dataAgg.push([this._data[i][0], this._data.splice(0, i+1).map(row=>row[1])]);
                    i = 0;
                    dataLen = this._data.length;
                } else {
                    i += 1;
                }
            }

            // Assign as a private variable, and set the core data line as the average value.
            this._dataAgg = dataAgg;
            this.coreDataLine = dataAgg.map(row=>[row[0], row[1].reduce((a,b) => a+b)/row[1].length]);
        }
    }

    /**
     * Prepare the moving average of the data.   --- UPDATED (Dexter) 20190208
     * @param {Number} mvAvgWindow - The window of each 
     * @param {Number} mvAvgStep - The proportion of window overlapse for a moving average step. If -1, moving average at every step.
     */
    prepareMvAvg(mvAvgWindow, mvAvgStep = .3) {
        // Determine the moving average incremental step.
        var step = mvAvgStep == -1 ? 1 : Math.max(1,Math.floor(mvAvgWindow*mvAvgStep));

        // Determine the starting data point x-index, and the initial sum value;
        var idxAvg = (mvAvgWindow-1)/2, mvSum = 0;
        
        // The moving average is calculated through FIFO of x-data points if step is 1.
        var dataCol = this.coreDataLine;
        dataCol.slice(0, mvAvgWindow-1).forEach(v=>mvSum+=v[1]);
        var mvDataCol = [];

        // The same FIFO loop is implemented, but if step is 1, it will be faster without step point checks.
        if (step == 1) {
            for (let i=mvAvgWindow-1; i<dataCol.length; i++) {
                mvSum += dataCol[i][1];
                const xAvg = (idxAvg % 1 == 0 ? dataCol[idxAvg + i - (mvAvgWindow - 1)][0] : ( (dataCol[Math.floor(idxAvg) + i - (mvAvgWindow - 1)][0] + dataCol[Math.ceil(idxAvg) + i - (mvAvgWindow - 1)][0])/ 2)), yAvg = mvSum/mvAvgWindow;
                mvDataCol.push([xAvg, yAvg]);
                mvSum -= dataCol[i+1-mvAvgWindow][1];
            }
        } else {
            const startLoopIdx = -(mvAvgWindow-1);
            for (let i=mvAvgWindow-1; i<dataCol.length; i++) {
                mvSum += dataCol[i][1];
                if ((i-startLoopIdx) % step == 0 || (i+1 == dataCol.length)) {
                    const xAvg = (idxAvg % 1 == 0 ? dataCol[idxAvg + i - (mvAvgWindow - 1)][0] : ( (dataCol[Math.floor(idxAvg) + i - (mvAvgWindow - 1)][0] + dataCol[Math.ceil(idxAvg) + i - (mvAvgWindow - 1)][0])/ 2)), yAvg = mvSum/mvAvgWindow;
                    mvDataCol.push([xAvg, yAvg]);
                }
                mvSum -= dataCol[i+1-mvAvgWindow][1];
            }
        }

        this.mvAvgDataLine = mvDataCol;
    }

    /**
     * Prepare standard deviation lines.   --- UPDATED (Dexter) 20181121
     */
    prepareStdDev() {
        if (this._aggregation) {
            this.stDevDataLine = this._dataAgg.map((row, idx)=>{
                var mean = this.coreDataLine[idx][1];
                var stdDev = (row[1].reduce((a,b) => a+(b-mean)**2,0)/row[1].length)**0.5;
                return [row[0], mean-stdDev, mean+stdDev]
            });
        }
    }

    /**
     * Prepare range.   --- UPDATED (Dexter) 20181121
     */
    prepareRange() {
        if (this._aggregation) {
            this.rangeDataBox = this._dataAgg.map((row, idx)=>[row[0], Math.min(...row[1]), Math.max(...row[1])]);
        }
    }

    /**
     * Consolidate the data, including caching data range and removing original data.   --- UPDATED (Dexter) 20190209
     */
    consolidate() {
        // Get overall possible values.
        let values = [this.coreDataLine.map(coor=>coor[1]), 
                        this.mvAvgDataLine.map(coor=>coor[1]),
                        this.stDevDataLine.map(coor=>coor[2]),
                        this.stDevDataLine.map(coor=>coor[1]),
                        this.rangeDataBox.map(coor=>coor[1]),
                        this.rangeDataBox.map(coor=>coor[2])].map(ary=>ary.length ? [Math.min(...ary.filter(d=>!isNaN(Number(d)) && isFinite(Number(d)))),Math.max(...ary.filter(d=>!isNaN(Number(d)) && isFinite(Number(d))))] : [null, null]);

        // Cache the min/max for future use.
        this.dMin = Math.min(...values.map(ele=>ele[0]));
        this.dMax = Math.max(...values.map(ele=>ele[1]));
        this.dRange = this.dMax - this.dMin;

        // Remove original data.
        delete this._data;
        delete this._dataAgg;
    }
    
    /**
     * Get the length of the data column, i.e. the length of the core data line.   --- UPDATED (Dexter) 20181120
     */
    get length() {
        return this.coreDataLine.length;
    }

    /**
     * Get the size of the data column, i.e. the count of x values.   --- UPDATED (Dexter) 20181120
     */
    get size() {
        return this._xVal.size;
    }
}

/** Class representing a train log, a line chart representation for different measurements in trainlog or testlog.   --- UPDATED (Dexter) 20180531 */
class TrainLog extends GraphItem {
    /**
     * Calculate all necessary SVG elements positioning and details.Only sub-classes would have codes on this.   --- UPDATED (Dexter) 20190209
     * @param {String} action - Type of action, "draw" or "redraw"
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    drawDetails(action, taskID) {
        // The options are very frequently referenced later on.
        var dashBoardOptions=this.dashBoardOptions, dataOptions = this.dataOptions;
        
        /**
         * =================== (1) Preparing Axis Information   ===================
         */
        
        // Prepare the axis range information.
        var minMax = {y1Min: null, y1Max: null, y2Min: null, y2Max: null, xMin: null, xMax: null}, conData = this.conData.fullData;
        
        // Determine whether auto scaling is needed.
        if ([dataOptions.y1Min, dataOptions.y1Max, dataOptions.xMin, dataOptions.xMax, ...(dataOptions.y2.length ? [dataOptions.y2Min, dataOptions.y2Max] : [])].includes("auto")) {

            // If auto-scaling is needed, all datalines in the consolidated data need to be examined.
            conData.forEach((logDataCol,lineInfo)=>{

                // The line information is JSON-stringified as the key of the consolidated, get the information.
                var parsedLineInfo = JSON.parse(lineInfo);

                // In addition to one data line as the axis, need to examine the x values as well for the data points.
                [parsedLineInfo[0], "x"].forEach(axis=>{

                    // Determine whether either min or max of the axis need auto-scaling.
                    const axisMin = axis+"Min", axisMax = axis + "Max";
                    if ([dataOptions[axisMin], dataOptions[axisMax]].includes("auto")) {

                        // Get the min/max values of the data, y-axis already cached during preparation.
                        let thisMin, thisMax;
                        if (axis.startsWith("x")) {
                            let colInfo = logDataCol._xVal;
                            thisMin = logDataCol.xMin;
                            thisMax = logDataCol.xMax;
                        } else {
                            thisMin = logDataCol.dMin;
                            thisMax = logDataCol.dMax;
                        }

                        // Compare existing values and assign the min/max values of the axis.
                        if (dataOptions[axisMin] == "auto") minMax[axisMin] = Math.min(minMax[axisMin]||Infinity, thisMin);
                        else minMax[axisMin] = dataOptions[axisMin];
                        if (dataOptions[axisMax] == "auto") minMax[axisMax] = Math.max(minMax[axisMax]||-Infinity, thisMax);
                        else minMax[axisMax] = dataOptions[axisMax];

                    } else {
                        // If no auto-scaling is needed, just assign the value as the dashBoard options.
                        ["Min","Max"].forEach(m=>minMax[axis+m]=dataOptions[axis+m]);
                    }

                });

            });

        } else {
            // Otherwise, just utilize the cached min/max values in the dashBoard options.
            [...[...conData.keys()].map(lineInfo=>JSON.parse(lineInfo)[0]), "x"].forEach(axis=>["Min","Max"].forEach(m=>minMax[axis+m]=dataOptions[axis+m]));
        }

        // After the min/max values are determined, below prepares axis info in details, like scales and labels.
        var axisInfo = {};

        // For each of the axis, except the case with no y2, determine the axis details.
        (minMax.y2Min != null ? ["x","y1","y2"] : ["x","y1"]).forEach(axis=>{

            // Get an automatic plot scale using the determined min/max values. Pass the dashBoard options values as forced min/max which is defined by the user.
            var plotScale = TrainLog.findPlotScale(minMax[axis+"Min"], minMax[axis+"Max"], (dataOptions[axis+"Min"] == "auto") ? null : dataOptions[axis+"Min"], (dataOptions[axis+"Max"] == "auto") ? null : dataOptions[axis+"Max"]);

            // After getting the plot scale, convert the scale into necessary label information.
            var plotInfo = TrainLog.convertScaleToPlot(plotScale);

            // Get the maximum string length of the label for estimation of width.
            var maxLabelLen = Math.max(...plotInfo.label.map(s=>s.length));

            // Get the exact display range of the axis.
            const exactRange = plotScale.exactMax - plotScale.exactMin;

            // Assign all the above info into an object for later references.
            axisInfo[axis] = {scale: plotScale, info: plotInfo, maxLabelLen: maxLabelLen, exactRange:exactRange};

        });

        /**
         * =================== (2) Preparing Graph-Drawing Styling  ===================
         */

        // Prepare some basic styling information, like size, text margin, margins, axis ending margin, font size, mark size, etc.
        const w=this.w, h=this.h, fontSize = this.dashBoardOptions.fontSize == "auto" ? 16: this.dashBoardOptions.fontSize, labelFont = Math.round(fontSize*.85), txtMargin = Math.round(fontSize*.5), lineHeight = 1.5, fontHeight = fontSize *lineHeight, verLabelCenter=labelFont*.65*.5, fontFamily= "Segoe UI, 微軟正黑體, Arial, Calibri, Helvetica";
        const margin = 0.05, marginL = this.w*margin, marginT = this.h*margin, axisEndMargin = fontSize;
        const mark = 8, markSub = 4;
        
        // Get the total number of data lines. 
        const lineCount = [...conData.keys()].filter(lineInfo=>!JSON.parse(lineInfo)[3]).length;

        // Check if a legend has to be shown and define necessary variables.
        var showLegend = this.dashBoardOptions.showLegend;
        var legendDir, legendXCount, legendBW, legendBH, legendYCount, legendWidth, legendHeight;  

        if (showLegend) {
            
            // If legend has to be shown, determine the direction of the legend, and the size of each legend small box.
            legendDir = (w/h>1.25); legendBH = fontSize*2; legendBW = fontSize*8 + 3*txtMargin;

            // Determine whether legend is placed on the bottom or on the right, and count the small boxes should arrange depending on available width and height, and the number of lines.
            if (legendDir) {
                legendYCount = Math.min(lineCount, Math.ceil((h - marginT*2)/legendBH));
                legendXCount = Math.ceil(lineCount/legendYCount);
            } else {
                legendXCount = Math.min(lineCount, Math.ceil((w - marginT*2)/legendBW));
                legendYCount = Math.ceil(lineCount/legendXCount);
            }

            // Calculate the resulted legend total width and height.
            legendWidth = legendXCount*legendBW + txtMargin*2; legendHeight = legendYCount*legendBH + txtMargin*2;

            // If there is not enough space to display the graph as well, don't show the legend.
            if ((legendDir && ((w-legendWidth) < 350)) || (!legendDir && ((h-legendHeight) < 250))) showLegend = false;

        }

        // Determine the graph plotting size, i.e. the range where data can plot.
        const leftmost = Math.round(marginL + axisInfo["y1"].maxLabelLen*labelFont*.5 + mark + txtMargin*2 + fontHeight);
        const rightmost = Math.round(w - marginL - (axisInfo["y2"] ? (axisInfo["y2"].maxLabelLen*labelFont*.5 + mark + txtMargin*2 + fontHeight) : 0) - ((showLegend && legendDir) ? (legendWidth + fontSize) : 0) )
        const topmost = marginT;
        const bottommost = Math.round(h - marginT - mark - txtMargin*2 - fontHeight - labelFont - ((showLegend && !legendDir)?(legendHeight + fontSize) : 0));
        
        // Determine the size of the graph plotting area, while plotW and plotH are more exactly described as it excludes the axis ending margin.
        const bgW = rightmost-leftmost, bgH = bottommost-topmost;
        const plotW = bgW - (axisInfo["y2"] ? 0 : axisEndMargin), plotH = bgH - axisEndMargin;

        /**
         * =================== (3) Drawing Background Horizontal Lines & y-Axis ===================
         */

        // Define an array for all elements to be drawn, and get all the y1 label in the number format.
        var horLines = [];
        var horLinesNums = axisInfo["y1"].info.num;

        // For each core axis labels, prepare the background horizontal lines, axis marks and mark labels.
        for (let i=0; i<horLinesNums.length; i++) {

            // Calculate the y-coordinate of the current y-axis label item.
            const toY = bottommost - (horLinesNums[i] - axisInfo["y1"].scale.showMin)/axisInfo["y1"].exactRange*plotH;

            // TODO [Train Log/Axis Drawing]
            // Action:  Draw horizontal lines for labels not on the x-axis. 
            // Reason:  Customization on the cross-axis position has not been implemented.

            // Draw horizontal lines only for labels higher than the x-axis.
            if (i>0) {

                // Prepare a horizontal line SVG element. Detailed comments won't be available on later element drawing.
                var hl = new PreSVGElement("path", "horLine"+i);

                // For some information, only set when it has not drawn before.
                if (!this.drawnEle.has("horLine"+i)) {
                    hl.setClass("y1horLines");
                    hl.setAttribute("stroke-width", 1);
                }
                
                // Only update information that is updated on this draw/redraw request.
                hl.setAttribute("d", `M${leftmost} ${toY} l${bgW} ${0} z`);

                // Push the pre-element into an array for later batched call for actual drawing on the main thread.
                horLines.push(hl);

            }
            
            // Prepare a core y-axis label mark SVG element.
            var hM = new PreSVGElement("path", "horMark"+i);
            if (!this.drawnEle.has("horMark"+i)) {
                hM.setClass("axisMark");
                hM.setAttribute("stroke-width", 1);
            }
            hM.setAttribute("d", `M${leftmost} ${toY} l${-mark} ${0} z`);
            horLines.push(hM);

            // Prepare the core y-axis label text SVG element.
            var hMT = new PreSVGElement("text", "horMarkTxt"+i);
            if (!this.drawnEle.has("horMarkTxt"+i)) {
                hMT.setClass("axisMarkText");
                hMT.setAttribute("font-family", fontFamily);
                hMT.setAttribute("text-anchor", "end");
                hMT.textContent = axisInfo["y1"].info.label[i];
            }
            hMT.setAttribute("font-size", labelFont + "px");
            hMT.setAttribute("dy", verLabelCenter);
            hMT.setAttribute("x", leftmost - txtMargin - mark);
            hMT.setAttribute("y", toY);
            horLines.push(hMT);

        }

        // Draw the secondary y-axis if needed.
        if (axisInfo["y2"]) {
            // Get the y2 label in the number format.
            var y2LinesNums = axisInfo["y2"].info.num;
            for (let i=0; i<y2LinesNums.length; i++) {

                // Calculate the y-coordinate of the current y-axis label item.
                const toY = bottommost - (y2LinesNums[i] - axisInfo["y2"].scale.showMin)/axisInfo["y2"].exactRange*plotH;

                // Prepare a secondary y-axis label mark SVG element.
                var hM = new PreSVGElement("path", "y2Mark"+i);
                if (!this.drawnEle.has("y2Mark"+i)) {
                    hM.setClass("axisMark");
                    hM.setAttribute("stroke-width", 1);
                }
                hM.setAttribute("d", `M${rightmost} ${toY} l${mark} ${0} z`);
                horLines.push(hM);

                // Prepare the secondary y-axis label text SVG element.
                var hMT = new PreSVGElement("text", "y2MarkTxt"+i);
                if (!this.drawnEle.has("y2MarkTxt"+i)) {
                    hMT.setClass("axisMarkText");
                    hMT.setAttribute("font-family", fontFamily);
                    hMT.setAttribute("text-anchor", "start");
                    hMT.textContent = axisInfo["y2"].info.label[i];
                }
                hMT.setAttribute("font-size", labelFont + "px");
                hMT.setAttribute("dy", verLabelCenter);
                hMT.setAttribute("x", rightmost + txtMargin + mark);
                hMT.setAttribute("y", toY);
                horLines.push(hMT);

            }
        }

        // Draw all the y-axis related elements on the main thread.
        postMessage({action: action, taskID:taskID, eleList: horLines});

        /**
         * =================== (4) Drawing x-Axis   ===================
         */

        // Define an array for all elements to be drawn, and get all the x label in the number format.
        var xAxisEles = [];
        var xAxisElesNums = axisInfo["x"].info.num;

        // For each core axis labels, prepare the axis marks and mark labels.
        for (let i=0; i<xAxisElesNums.length; i++) {
            
            // Calculate the x-coordinate of the current y-axis label item.
            const toX = leftmost + (xAxisElesNums[i] - axisInfo["x"].scale.showMin)/axisInfo["x"].exactRange*plotW;
            const crossY = bottommost;

            // TODO [Train Log/Axis Drawing]
            // Action:  Draw the x-axis on user-requested y-axis crossing position. 
            // Reason:  Customization on the cross-axis position has not been implemented.
            
            // Prepare a x-axis label mark SVG element.
            var vM = new PreSVGElement("path", "verMark"+i);
            if (!this.drawnEle.has("verMark"+i)) {
                vM.setClass("axisMark");
                vM.setAttribute("stroke-width", 1);
            }
            vM.setAttribute("d", `M${toX} ${crossY} l${0} ${mark} z`);
            xAxisEles.push(vM);

            // Prepare a x-axis label text SVG element.
            var vMT = new PreSVGElement("text", "verMarkTxt"+i);
            if (!this.drawnEle.has("verMarkTxt"+i)) {
                vMT.setClass("axisMarkText");
                vMT.setAttribute("font-family", fontFamily);
                vMT.setAttribute("text-anchor", "middle");
                vMT.textContent = "" + xAxisElesNums[i];
            }
            vMT.setAttribute("font-size", labelFont + "px");
            vMT.setAttribute("x", toX);
            vMT.setAttribute("y", crossY + mark + txtMargin + labelFont);
            xAxisEles.push(vMT);

        }

        // Draw all the x-axis related elements on the main thread.
        postMessage({action: action, taskID: taskID, eleList: xAxisEles});

        /**
         * =================== (5) Drawing data-lines   ===================
         */

        // Prepare the array of to-be-drawn elements, a Map of data line info for hovering use, axis labels.
        var dataLines = [], dlInfos = new Map();
        var axisLabels = {y1: new Set(), y2: new Set()};
        
        // Prepare the line color, where some lines will share the same color with the moving average line.
        var lineColor = new Map();

        // Prepare the color where the lines will be used.
        var hueStart = dashBoardOptions.hueStart, satLatCount = Math.ceil(lineCount/8), hueCount = Math.ceil(lineCount/satLatCount), hueInterval = 360/hueCount, satlat = [[60,50], [30,50], [60,35], [30,35]], di=0;

        // Loop the consolidated data where each value would be a data line.
        conData.forEach((logDataCol,lineInfo)=>{
            // The line information like date and axis name are stringified as Map key. Concatenate the information to be a unique key.
            var parsedLineInfo = JSON.parse(lineInfo);
            const dateNumber = parsedLineInfo[1];
            const lineName = parsedLineInfo[2];
            const fullLineName = lineName +"_" + dateNumber;

            // Get whether there is color assigned to this data line, and use a unique color for the data line.
            const hasColor = lineColor.has(fullLineName);
            var dlColor = hasColor? lineColor.get(fullLineName): {h: hueStart+di*hueInterval, s: satlat[Math.floor(di/hueCount)][0], l: satlat[Math.floor(di/hueCount)][1]};
            
            // Prepare a pointer-hovering vertical line SVG element.
            var hoverL = new PreSVGElement("path", "hoverLine_" + fullLineName);
            if (!this.drawnEle.has("hoverLine_" + fullLineName)) {
                hoverL.setClass("hoverLine");
                hoverL.setAttribute("stroke", `hsla(${dlColor.h}, ${dlColor.s}%, ${dlColor.l}%, .5)`);
                hoverL.setAttribute("stroke-width", 1);
            }
            hoverL.setAttribute("opacity", 0);
            hoverL.setAttribute("d", `M${leftmost} ${topmost} l${0} ${bgH} z`);
            dataLines.push(hoverL);

            // If this is a core line, prepare a pointer-hovering point SVG element.
            var hoverP = new PreSVGElement("circle", "hoverPoint_" + fullLineName);
            if (!this.drawnEle.has("hoverPoint_" + fullLineName)) {
                hoverP.setClass("hoverPoint");
                hoverP.setAttribute("fill", `hsl(${dlColor.h}, ${dlColor.s}%, ${dlColor.l}%)`);
                hoverP.setAttribute("stroke", `transparent`);
                hoverP.setAttribute("stroke-width", 5);
                hoverP.setAttribute("r", 4);
            }
            hoverP.setAttribute("opacity", 0);
            hoverL.setAttribute("cx", leftmost);
            hoverL.setAttribute("cy", bottommost);
            dataLines.push(hoverP);

            // Prepare range boxes.
            if (logDataCol["rangeDataBox"].length && dataOptions.showRange) {
                // Get lower bound and upper bound, noted one side should sorted reversely to form a shape.
                const lowerBound = logDataCol["rangeDataBox"].map(info=>[info[0], info[1]]);
                lowerBound.sort((a,b) => a[0] > b[0]); 
                const upperBound = logDataCol["rangeDataBox"].map(info=>[info[0], info[2]]);
                upperBound.sort((a,b) => a[0] < b[0] ? 1 : -1); 
                const boxRange = [...lowerBound, ...upperBound, lowerBound[0]];

                const dataPoints = boxRange.map(coor => {
                    // Convert to actual coordinates and set the line path data.
                    const toX = (coor[0]-axisInfo["x"].scale.showMin)/axisInfo["x"].exactRange*plotW+leftmost;
                    const toY = bottommost-(coor[1]-axisInfo[parsedLineInfo[0]].scale.showMin)/axisInfo[parsedLineInfo[0]].exactRange*plotH;
                    return ` ${toX} ${toY}`;
                });

                // Prepare a standard deviation line.
                const lineName = "line_" +fullLineName + "(range)";
                var bdl = new PreSVGElement("path", lineName);
                if (!this.drawnEle.has(lineName)) {
                    bdl.setClass("stdLine");
                    if (dataOptions.showRange.includes("box")) {
                        bdl.setAttribute("stroke", `hsla(${dlColor.h}, ${dlColor.s}%, ${dlColor.l}%, .65)`);
                        bdl.setAttribute("stroke-width", 1);
                        bdl.setAttribute("stroke-dasharray", fontSize*.3);
                    } 
                    if (dataOptions.showRange.includes("shadow")) {
                        bdl.setAttribute("fill", `hsla(${dlColor.h}, ${dlColor.s}%, ${dlColor.l}%, .15)`);
                    } else {
                        bdl.setAttribute("fill", "transparent");
                    }
                }

                // Set the data points and prepare to draw.
                bdl.setAttribute("d", "M" + dataPoints.join(" L"));
                dataLines.push(bdl);
            }

            // Prepare standard deviation line.
            if (logDataCol["stDevDataLine"].length) {
                const stdWidth = fontSize*.25;
                logDataCol["stDevDataLine"].forEach((stdInfo, idx) => {
                    // Prepare a standard deviation line.
                    const lineName = "line_" +fullLineName + "(sd_"+idx+")";
                    var sdl = new PreSVGElement("path", lineName);
                    if (!this.drawnEle.has(lineName)) {
                        sdl.setClass("stdLine");
                        sdl.setAttribute("stroke", `hsl(${dlColor.h}, ${dlColor.s*.35}%, ${dlColor.l}%)`);
                        sdl.setAttribute("stroke-width", 1);
                        sdl.setAttribute("opacity", .65);
                    }
                    
                    // Convert to actual coordinates and set the line path data.
                    const toX = (stdInfo[0]-axisInfo["x"].scale.showMin)/axisInfo["x"].exactRange*plotW+leftmost;
                    const toY1 = bottommost-(stdInfo[1]-axisInfo[parsedLineInfo[0]].scale.showMin)/axisInfo[parsedLineInfo[0]].exactRange*plotH;
                    const toY2 = bottommost-(stdInfo[2]-axisInfo[parsedLineInfo[0]].scale.showMin)/axisInfo[parsedLineInfo[0]].exactRange*plotH;
                    sdl.setAttribute("d", `M ${toX - stdWidth} ${toY1} l ${stdWidth * 2} 0 m ${-stdWidth} 0 L ${toX} ${toY2} m ${-stdWidth} 0 l ${stdWidth * 2} 0`)
                    dataLines.push(sdl);
                });
            }

            // Prepare the data lines.
            const hasMvAvgLine = logDataCol.mvAvgDataLine.length > 0;
            const coreLine = hasMvAvgLine ? "mvAvgDataLine" : "coreDataLine";
            ["coreDataLine", "mvAvgDataLine"].forEach(lineName => {
                var lineData = logDataCol[lineName];
                if (lineData.length && (lineName != "coreDataLine" || !hasMvAvgLine || dashBoardOptions.movingAverageType != "none")) {
                    var dataPoints;
                    if (lineData.length > 1) {
                        // Prepare the data line SVG element.
                        
                        var lineID = "line_" +fullLineName + (lineName == "coreDataLine" ? "(raw)": "");
                        var dl = new PreSVGElement("path", lineID);
                        if (!this.drawnEle.has(lineID)) {
                            dl.setClass("dataLines");
                            dl.setAttribute("stroke", `hsl(${dlColor.h}, ${dlColor.s}%, ${dlColor.l}%)`);
                            dl.setAttribute("stroke-width", 2);
                            if (hasMvAvgLine && lineName == "coreDataLine") {
                                if (dashBoardOptions.movingAverageType.includes("opacity")) dl.setAttribute("opacity", .3);
                                if (dashBoardOptions.movingAverageType.includes("dotted")) dl.setAttribute("stroke-dasharray", "2");
                            }
                        } 
                    

                        // Noted when data are got, need to remember the coordinate as well as the data.
                        const roundDigit = -(axisInfo[parsedLineInfo[0]].scale.digit - 4);
                        dataPoints = lineData.map(row=>{
                            const toX = (row[0]-axisInfo["x"].scale.showMin)/axisInfo["x"].exactRange*plotW+leftmost;
                            const toY = bottommost-(row[1]-axisInfo[parsedLineInfo[0]].scale.showMin)/axisInfo[parsedLineInfo[0]].exactRange*plotH;
                            return {atX: toX, atY: toY, valX: row[0], valY: round(row[1], roundDigit)};
                        });
                        var pathPoints = dataPoints.filter(dp=>!isNaN(dp.atY)).map(row=>(row.atX.toFixed(2)+" "+row.atY.toFixed(2)));
                        pathPoints = pathPoints.join(" L");
                        dl.setAttribute("d", `M ${pathPoints}`);
                    } else {
                        // If only one point is given, prepare the data dot SVG element.
                        var lineID = "line_" +fullLineName + "(dot)";
                        var dl = new PreSVGElement("circle", lineID);
                        if (!this.drawnEle.has(lineID)) {
                            dl.setClass("dataLines");
                            dl.setAttribute("fill", `hsl(${dlColor.h}, ${dlColor.s}%, ${dlColor.l}%)`);
                            dl.setAttribute("r", 2);
                        } 
        
                        // Noted when data are got, need to remember the coordinate as well as the data.
                        const roundDigit = -(axisInfo[parsedLineInfo[0]].scale.digit - 4);
                        dataPoints = lineData.map(row=>{
                            const toX = (row[0]-axisInfo["x"].scale.showMin)/axisInfo["x"].exactRange*plotW+leftmost;
                            const toY = bottommost-(row[1]-axisInfo[parsedLineInfo[0]].scale.showMin)/axisInfo[parsedLineInfo[0]].exactRange*plotH;
                            return {atX: toX, atY: toY, valX: row[0], valY: round(row[1], roundDigit)};
                        });
                        
                        if (!isNaN(dataPoints[0].atY)) {
                            var location = [dataPoints[0].atX.toFixed(2),dataPoints[0].atY.toFixed(2)];
                            dl.setAttribute("cx", location[0]);
                            dl.setAttribute("cy", location[1]);
                        }
                    }
                    dataLines.push(dl);

                    // Plot all NaN points.
                    dataPoints.filter(dp=>isNaN(dp.atY)).forEach((dp, idx)=>{
                        var nanDpID = `line_${fullLineName}(NaN_${idx})"`;
                        var nanDp = new PreSVGElement("circle", nanDpID);
                        nanDp.setAttribute("fill", `hsl(0, 75%, 50%)`);
                        nanDp.setAttribute("r", 4);
                        nanDp.setAttribute("cx", dp.atX.toFixed(2));
                        nanDp.setAttribute("cy", bottommost);
                        dataLines.push(nanDp);
                    });

                    // If this is a core presentable line, consolidate the above data point information with a hovering list, to provide interactive data point information for the user.
                    if (lineName == coreLine) {
                        dataPoints.sort((a,b)=>(a.atX>b.atX)?1:-1);
                        const allXs = dataPoints.map(x=>x.atX);
                        var hoverList= [leftmost, ...allXs.slice(0,-1).map((s,i)=>(s+allXs[i+1])/2), rightmost];
                        hoverList.sort((a,b)=>(a>b)?1:-1);
                        dlInfos.set(fullLineName, {dataPoints: dataPoints, hoverList:hoverList});
                    }
                }
            });

            // Add the full data line name to the axislabel for later data line labelling on the axis.
            axisLabels[parsedLineInfo[0]].add(fullLineName);

            // If there has no color of this data line before, set it to lineColor Map.
            if (!hasColor) {
                di++;
                lineColor.set(fullLineName,dlColor);
            }
        });

        // Draw all the data line-related elements on the main thread.
        postMessage({action: action, taskID: taskID, eleList: dataLines});

        // Set up pointer hovering details.
        postMessage({action: "setUpHover", taskID: taskID, dlInfos: dlInfos, topmost: topmost, bottommost: bottommost, leftmost: leftmost, rightmost: rightmost});

        // Draw labels of the 2 y-axes. 
        var axisLabelEles = [];
        (axisInfo["y2"] ? ["y1","y2"] : ["y1"]).forEach(axisNow=>{
            // Create axis label only if there are data lines on that axis.
            const axisLen = axisLabels[axisNow].size;
            if (axisLen > 0) {
                // Axis label text will appear on only with 3 or less data lines using the same axis.
                if (axisLen <=3) {
                    // Prepare the axis text element.
                    const axisLabelName = "axisLabel"+axisNow;
                    var axisLabel = new PreSVGElement("text", axisLabelName);
                    if (!this.drawnEle.has(axisLabelName)) {
                        axisLabel.setClass("axisMarkText");
                        axisLabel.setAttribute("font-family", fontFamily);
                        axisLabel.setAttribute("text-anchor", "middle");
                    }
                    axisLabel.setAttribute("font-size", fontSize + "px");

                    // Noted the axis text element only appear with enough height.
                    if (bgH > 25*fontSize) {
                        axisLabel.removeClass("noDisplay");
                    } else {
                        axisLabel.setClass("noDisplay");
                    }

                    const ayLX = axisNow == "y1" ? (marginL + fontHeight) : (rightmost + axisInfo["y2"].maxLabelLen*labelFont*.5 + mark + txtMargin*2), ayLY = (bottommost+topmost)/2;
                    axisLabel.setAttribute("x", ayLX);
                    axisLabel.setAttribute("y", ayLY);
                    axisLabel.setAttribute("transform", `rotate(${axisNow == "y1" ? -90 : 90} ${ayLX} ${ayLY})`);
                    axisLabelEles.push(axisLabel);
                    
                    // For data lines, get the line label and append as a tspan element for the axis label.
                    [...axisLabels[axisNow]].forEach((fullLineName,idx)=>{
                        var y1Title = new PreSVGElement("tspan", "axisYLabel_"+fullLineName);
                        if (!this.drawnEle.has("axisYLabel_"+fullLineName)) {
                            const dlColor = lineColor.get(fullLineName);
                            y1Title.setAttribute("fill", `hsl(${dlColor.h}, ${dlColor.s}%, ${dlColor.l*.8}%)`);
                            y1Title.setAttribute("font-weight", "700");
                            y1Title.setClass("lt");
                            TrainLog.setColNameAsInnerText(y1Title, fullLineName.split("_")[0]);
                        }
                        y1Title.appendIn = axisLabelName;
                        axisLabelEles.push(y1Title);
                        
                        // If there are more than one data line using the axis, we need to add ", " commas to seperate the labels.
                        if (idx < axisLen - 1) {
                            var y1TitleSep = new PreSVGElement("tspan", "axisY1Label_sep_"+idx);
                            y1TitleSep.setAttribute("fill", `hsl(0, 0%, 50%)`);
                            y1TitleSep.textContent = ", "
                            y1TitleSep.appendIn = axisLabelName;
                            axisLabelEles.push(y1TitleSep);
                        }
                    });
                } 
                
                // For all cases, the data labels are appeared as rectengular line blocks on the axis.
                const showDot = axisLen > 3 || (bgH < 25*fontSize);
                [...axisLabels[axisNow]].forEach((fullLineName,idx)=>{
                    var y1Dot = new PreSVGElement("rect", "axisYLabelDot_"+fullLineName);
                    if (!this.drawnEle.has("axisYLabel_"+fullLineName)) {
                        const dlColor = lineColor.get(fullLineName);
                        y1Dot.setAttribute("fill", `hsl(${dlColor.h}, ${dlColor.s}%, ${dlColor.l}%)`);
                        y1Dot.setAttribute("width", .8*fontSize)
                        y1Dot.setAttribute("height", 2*fontSize);
                        y1Dot.setAttribute("rx", .3*fontSize);
                        y1Dot.setAttribute("ry", .3*fontSize);
                    }
                    const ayLX = axisNow == "y1" ? (marginL + fontHeight - .8*fontSize) : (rightmost + axisInfo["y2"].maxLabelLen*labelFont*.5 + mark + txtMargin*2), ayLY = topmost + idx*2.25*fontSize;
                    y1Dot.setAttribute("x", ayLX);
                    y1Dot.setAttribute("y", ayLY);

                    // Noted the axis dot element only appear with enough height.
                    if (showDot) {
                        y1Dot.removeClass("noDisplay");
                    } else {
                        y1Dot.setClass("noDisplay");
                    }

                    axisLabelEles.push(y1Dot);
                });
            }
        });

        // Draw all the y-axis labels-related elements on the main thread.
        postMessage({action: action, taskID: taskID, eleList: axisLabelEles});
        

        const y2Len = axisLabels["y2"].size;


        /**
         * =================== (6) Drawing Legend   ===================
         */

        // Only draw legend if needed.
        if (showLegend) {

            // Define an array for all elements to be drawn, and get the position of the legend box.
            var legendEles = [];
            const legendX = legendDir ? (w - marginL - legendWidth) : ((w-legendWidth)/2), legendY = legendDir ? ((h-legendHeight)/2) :(h - marginT - legendHeight);

            // Prepare the legend box SVG element.
            var lb = new PreSVGElement("rect", "lengendBox");
            if (!this.drawnEle.has("lengendBox")) {
                lb.setClass("lengendBox");
                lb.setAttribute("stroke-width", 1);
                lb.setAttribute("fill", "transparent");
            } 
            lb.setAttribute("width", legendWidth);
            lb.setAttribute("height", legendHeight);
            lb.setAttribute("x", legendX);
            lb.setAttribute("y", legendY);
            legendEles.push(lb);

            // Calcuate how many rows and columns of legend labels will eventually printed.
            const leRowCount = legendDir ? Math.ceil(lineCount / legendXCount) : legendYCount;
            const leColCount = legendDir ? legendXCount : Math.ceil(lineCount/legendYCount);

            // For each of the core presentable lines, prepare the line labels on the legend.
            [...lineColor.keys()].forEach((lineName,idx)=>{

                // Find the position of the small label box.
                const boxX = Math.floor(idx/leRowCount), boxY = idx%leRowCount;

                // Prepare the legend text label SVG element.
                var lt = new PreSVGElement("text", "legLineName_"+lineName);
                if (!this.drawnEle.has("legLineName_"+lineName)) {
                    lt.setClass("legendLabel");
                    lt.setAttribute("font-family", fontFamily);
                    lt.setAttribute("text-anchor", "start");
                    lt.setClass("lt");
                    TrainLog.setColNameAsInnerText(lt, lineName.split("_")[0]);
                } 
                lt.setAttribute("font-size", fontSize + "px");
                lt.setAttribute("dy", verLabelCenter);
                lt.setAttribute("x", legendX + txtMargin + boxX*legendBW + fontSize*2);
                lt.setAttribute("y", legendY + txtMargin + boxY*legendBH + fontSize);
                legendEles.push(lt);

                // Prepare the legend reference core line SVG element.
                var ll = new PreSVGElement("path", "legLineC_"+lineName);
                if (!this.drawnEle.has("legLineC_"+lineName)) {
                    ll.setClass("legendLabel");
                    ll.setAttribute("stroke-width", 2);
                    var dlColor = lineColor.get(lineName);
                    ll.setAttribute("stroke", `hsl(${dlColor.h}, ${dlColor.s}%, ${dlColor.l}%)`);
                } 
                ll.setAttribute("d", `M ${legendX + txtMargin + boxX*legendBW + fontSize*.25} ${legendY + txtMargin + boxY*legendBH + fontSize} l ${fontSize*1.5} 0`);
                legendEles.push(ll);

            })

            // Draw all the legend related elements on the main thread.
            postMessage({action: action, eleList: legendEles, taskID: taskID});

        } 
        
        /**
         * =================== (7) Drawing Graph Axis Border Lines  ===================
         */

        
        // Define an array for all axes line elements to be drawn.
        var axis = [];

        // Prepare the secondary y axis border SVG element.
        if (minMax.y2Min != null) {
            var y2 = new PreSVGElement("path", "y2");
            if (!this.drawnEle.has("y2")) {
                y2.setClass("yAxis");
                y2.setAttribute("stroke-width", 2);
            } 
            y2.setAttribute("d", `M${rightmost} ${topmost} l${0} ${bgH} z`);
            axis.push(y2);
        }

        // Prepare the core y axis border SVG element.
        var y1 = new PreSVGElement("path", "y1");
        if (!this.drawnEle.has("y1")) {
            y1.setClass("yAxis");
            y1.setAttribute("stroke-width", 2);
        } 
        y1.setAttribute("d", `M${leftmost} ${topmost} l${0} ${bgH} z`);
        axis.push(y1);

        // Prepare the core x axis border SVG element.
        var x = new PreSVGElement("path", "x");
        if (!this.drawnEle.has("x")) {
            x.setClass("xAxis");
            x.setAttribute("stroke-width", 2);
        }
        x.setAttribute("d", `M${leftmost} ${bottommost} l${bgW} ${0} z`);
        axis.push(x);

        // Prepare the core x axis label SVG element.
        var xTitle = new PreSVGElement("text", "xLabel");
        if (!this.drawnEle.has("xLabel")) {
            xTitle.setClass("axisMarkText");
            xTitle.setClass("lt");
            xTitle.setAttribute("font-family", fontFamily);
            xTitle.setAttribute("text-anchor", "middle");
            xTitle.setDataset("lt", this.dataOptions.x);
        }
        xTitle.setAttribute("font-size", fontSize + "px");
        xTitle.setAttribute("x", (leftmost+rightmost)/2);
        xTitle.setAttribute("y", bottommost + mark + txtMargin*2 + labelFont*lineHeight + fontSize);
        axis.push(xTitle);

        // Draw all the axis related elements on the main thread.
        postMessage({action: action, eleList: axis, taskID: taskID});

        // Finish the drawing.
        postMessage({action: "Finished", done: action, taskID: taskID});
    }
    
    /**
     * Digest the data from a date/log related structure into a presentation cache of necessary data information. Only sub-classes would have codes on this.   --- UPDATED (Dexter) 20190209
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    consolidateData(taskID) {
        // For TrainLog, the consolidated data is a Map object.
        var conData = new Map();

        // Define the x-axis, and see what column name in CSV table is the x-axis.
        const x = this.dataOptions.x;

        // To select the available build of data only.
        const builds = this.dataOptions.build;
        const runs = this.dataOptions.runNo;
        const cvRuns = this.dataOptions.cvNo;
        const allBuild = builds.length == 0;
        const allRuns = runs.length == 0;

        // Prepare that an error boolean to check whether the collected CSV files are inconsistent.
        var inconsistentError = false;
        
        // Check if the y-axis is auto-scaled, and prepare a set of y-axis informations and labels within primary axis.
        const autoY = this.dataOptions.yAxisType == "auto";

        // Swap y2 to y1 in case y1 has no axis.
        if (this.dataOptions.y1.length == 0 && this.dataOptions.y2.length > 0) {
            const ary = this.dataOptions.y2;
            this.dataOptions.y1 = ary;
            this.dataOptions.y2 = [];
        }

        // Loop the data for consolidation.
        this.data.forEach((dateData,dateNo)=>{

            // For Auto Data Consolidation, prepare the final consolidated y-axis info.
            var yAxisSets = [], finalYAxis = [],  firstLabels = [];
            var availableRuns = new Set(), availableCVs = new Set();

            // Loop the build results for consolidation.
            dateData.forEach((buildTables, tableKey)=>{

                // TrainLog only supports "trainLog", "testLog", "weightLog", "cuzLog".
                if (["trainLog", "testLog", "weightLog", "cuzLog"].includes(tableKey)) {

                    // For test logs, only use the test log data, instead of batch end data.
                    var filterRules = (tableKey == "testLog") ? [["Test Type", ["Test Log"]]] : [];

                    // Concatenate build data.
                    var newTable = [], tableCol = null;
                    buildTables.forEach((table, buildNo)=>{
                        // Only push data if current option is printing the matched build or all builds.
                        if (table && (allBuild || builds.includes(buildNo))) {
                            // If there is no table columns recorded before, use this table's heading as the table columns.
                            if (!tableCol) tableCol = table[0];

                            // Make sure all tables are with same columns, then push the filtered data into the new table. Otherwise, inconsistent error results.
                            if (table.every(row=>row.length == tableCol.length)) {
                                newTable.push(...TrainLog.applyFilter(table.slice(1), tableCol, filterRules));
                            } else {
                                inconsistentError = true;
                            }
                        }
                    });

                    // Initiate varaibles.
                    var xIdx, runIdx, cvIdx;

                    if (newTable.length) {
                        // Check the columne id for the x-axis data.
                        xIdx = tableCol.indexOf("Global Step");
                        runIdx = tableCol.indexOf("Run");
                        cvIdx = tableCol.indexOf("Cross Validation Step");

                        // Get available runs and cross validations.
                        availableRuns = new Set([...availableRuns, ...(new Set(newTable.map(r=>Number(r[runIdx]))))]);
                        availableCVs = new Set([...availableCVs, ...(new Set(newTable.map(r=>Number(r[cvIdx]))))]);

                        // Select necessary run or cross validations.
                        var runCVRules = [];

                        // If there is runNo and cvNo restrictions, filter the runNo.
                        if (runs.length) runCVRules.push(["Run", runs]);
                        if (cvRuns.length) runCVRules.push(["Cross Validation Step", cvRuns]);
                        else runCVRules.push(["Cross Validation Step", ["-1"]]);
                        newTable = TrainLog.applyFilter(newTable, tableCol, runCVRules)
                    }
                    
                    // If there are data in the concated table, and the table has the data info of the x-axis, continue for data consolidation.
                    if (newTable.length && tableCol.includes(x)) {
                        
                        // Match the y1/y2 (primary/secondary) y-axis and consolidate the data.
                        ["y1", "y2"].forEach(axis => {

                            // Iterate on the requested axis names.
                            this.dataOptions[axis].forEach((col, axisIdx)=>{

                                // Check if there is table columns which is to be displayed, and collect the column names.
                                var lines = [];

                                if (tableCol.includes(col)) {
                                    // If the table has the required columns, push the column name.
                                    lines.push(col);
                                } else if (col == "Tests+++" && tableKey == "testLog") {
                                    // Find the starting index of the test columns.
                                    let startIdx = Math.max(...["Timestamp","Run","Cross Validation Step","Global Step","Local Step","Test Type"].map(colName => tableCol.indexOf(colName)));
                                    
                                    // If the table is a test log and requires all test meansurements, push the test measurement columns.
                                    for (let yIdx = startIdx+1; yIdx<tableCol.length; yIdx++) {
                                        lines.push(tableCol[yIdx]);
                                    }
                                } else if (col.endsWith("***") && tableCol.includes(col.split("***")[0])) {
                                    // If the required column is ended with `***`, this is an optional column to be displayed or not depending on whether the data has range > 0.
                                    const actualKey = col.split("***")[0];
                                    const yIdx = tableCol.indexOf(actualKey);
                                    var data = newTable.map(row=>row[yIdx]);
                                    const dMin = Math.min(...data), dMax = Math.max(...data), dRange = dMax - dMin;
                                    if (dMin != dMax) lines.push(actualKey);
                                } else if (col.startsWith("weight---") && tableKey == "weightLog") {
                                    // If the table is a weight log and requires a weight column, push the weight column name.
                                    lines.push(col);
                                }
                                
                                // Continue if there are column names requested matched with this table.
                                if (lines.length) {

                                    // If there has not been primary axis labels, push the line names in it, i.e. this is determined by the order stated in dataOptions object.
                                    if (!firstLabels.length && axis == "y1") firstLabels.push(...lines);

                                    // For each column name matched, consolidate the column data.
                                    lines.forEach(colName=>{

                                        // Get the actual data of this column.
                                        var dataCol;

                                        if (!colName.startsWith("weight---")) {
                                            // If this is not a weight column, just map the data with the x and y info.
                                            const yIdx = tableCol.indexOf(colName);
                                            dataCol = newTable.map(row=>[Number(row[xIdx]), Number(row[yIdx])]);
                                        } else if (colName.split("---").length >= 2) {
                                            // If this is a weight column, and it has no specific index, flatten the weight array and set the y-value as the average of it.
                                            colName =  JSON.parse(colName.split("---")[1]);
                                            const yIdx = tableCol.indexOf(colName);
                                            dataCol = newTable.map(row=>{
                                                var weights = Matrix.flatten(JSON.parse(row[yIdx]));
                                                var avg = (weights.reduce((a,b)=>a+b),0)/weights.length;
                                                return [Number(row[xIdx]), avg];
                                            });
                                        } else if (colName.split("---").length == 3) {
                                            // If this is a weight column, and has specified some indexes, get the indexed weight values and set the y-value as the average of them.
                                            colName =  JSON.parse(colName.split("---")[1]);
                                            const yIdx = tableCol.indexOf(colName);
                                            const indexes =  JSON.parse(colName.split("---")[2]);
                                            dataCol = newTable.map(row=>{
                                                var weights = JSON.parse(row[yIdx]);

                                                // Locate the indexed weight items.
                                                indexes.forEach(idx=>{
                                                    weights = weights[idx] || [];
                                                });

                                                // The located item may either be an exact value or a list of array. eg. aaa=[[1,2,3],[4,5,6]]; // aaa[1] = [4,5,6]; aaa[1][0] = 4
                                                var avg = (weights instanceof Array) ? (weights.reduce((a,b)=>a+b),0)/weights.length : weights;

                                                return [Number(row[xIdx]), avg];
                                            });
                                        } 

                                        // Convert the array-based datacolumn into a LogDataColumn object.
                                        const toMvAvg = this.dataOptions.movingAvg.has(col) && (dataCol.length > 200);
                                        dataCol = new LogDataColumn(dataCol, toMvAvg);
                                        if (toMvAvg) {
                                            // If there is a need for moving average calculation, define the number of data points.
                                            const mvAvgType = this.dataOptions.movingAvg.get(col);
                                            const mvAvgWindow = mvAvgType == "auto" ? Math.floor(dataCol.size/20) : Math.min(mvAvgType,dataCol.size);

                                            // Prepare the moving average line.
                                            dataCol.prepareMvAvg(mvAvgWindow, this.dataOptions.mvAvgStep);
                                        }

                                        // Prepare standard deviation.
                                        if (this.dataOptions.showDev) dataCol.prepareStdDev();
                                        if (this.dataOptions.showRange) dataCol.prepareRange();

                                        // Consolidate the data, typically finding the range of it.
                                        dataCol.consolidate();
                                        
                                        // If no auto axis range is required, just push the data line with releavant info.
                                        if (!autoY) conData.set(JSON.stringify([axis, dateNo, colName]), dataCol);

                                        // Otherwise, put it into a temp axis sets with relavent to-be-updated axis ranges.
                                        else yAxisSets.push({dateNo: dateNo, actualKey: colName, data: dataCol, dMax: dataCol.dMax, dMin: dataCol.dMin, dRange: dataCol.dRange});
                                        
                                    });
                                
                                }

                            });

                        });
                        

                    }

                }

            });

            // Sort the current recorded y-axis by their range in ascending order.
            yAxisSets.sort((a,b)=>a.dRange-b.dRange > 0 ? 1 : -1);

            // Iterate the recorded y-axis info.
            yAxisSets.forEach((a) => {

                // If there has not been any final consolidated axis, just put this as the first one.
                if (finalYAxis.length == 0) finalYAxis.push({dMin: a.dMin, dMax: a.dMax, dRange: a.dRange, data:[a]});
                else {
                    // Otherwise, it needs to understand whether to use along an axis or open a new axis.
                    // Suppose this axis has not been pushed to the final consolidated array.
                    var pushed = false;

                    // Loop over all current consolidated axis info.
                    for (let yi=0; yi<finalYAxis.length; yi++) {

                        // Check with that recorded final axis info.
                        var obsv = finalYAxis[yi];

                        // Understand how the range of this axis info is covered by or covers over the comparing axis info.
                        const smallerInclude = a.dRange < obsv.dRange*1.1 && obsv.dRange <= 3*a.dRange;
                        const largerInclude = obsv.dRange < a.dRange*1.1 && a.dRange <= 3*obsv.dRange;

                        // In case the current axis and the comparing axis are mergable, merge and combine the axis info.
                        if ((smallerInclude || largerInclude)  && ((a.dMin >= obsv.dMin && a.dMin <= obsv.dMax) || (a.dMax <= obsv.dMax && a.dMax >=obsv.dMin))) {
                            obsv.data.push(a);
                            obsv.dMin = Math.min(a.dMin, obsv.dMin);
                            obsv.dMax = Math.max(a.dMax, obsv.dMax);
                            obsv.dRange = obsv.dRange;
                            pushed = true;
                            break;
                        }
                    }

                    // If none of the existing final axis are comparable with this axis, add this to a new group.
                    if (!pushed) {
                        finalYAxis.push({dMin: a.dMin, dMax: a.dMax, dRange: a.dRange, data:[a]});
                    }

                }
            });

            
            if (finalYAxis.reduce((a,b)=>a+b.data.length, 0) > 32) {
                // Only at most 32 data lines are supported, otherwise, raise an error and show notification to the end user.
                postMessage({action: "tooMuchData", taskID: taskID})
            } else {
                // The original first axis should go first, so find out the actual consolidated axis to be y1.
                const coreIndex = finalYAxis.findIndex(fi=>fi.data.some(fid=>firstLabels.includes(fid.actualKey)));

                // Redistribute all the data into consolidated data using only y1 or y2 as the primary/secondary axis.
                finalYAxis.forEach((fi,idx)=>{
                    fi.data.forEach(fid=>{
                        conData.set(JSON.stringify([(idx==coreIndex ? "y1" : "y2"), fid.dateNo, fid.actualKey]), fid.data);
                    })
                })

                // Sort all the data with ascending x-values. -- handled in LogDataColumn constructor
                //conData.forEach((data)=>data.sort((a,b)=>a[0]-b[0] > 0 ? 1 : -1));
            }

            // Pass the consolidated data to the "worker.js".
            this.conData = {hasData: conData.size>0, fullData: conData, availableRuns: [...availableRuns], availableCVs: [...availableCVs]};

        });

        
        postMessage({action: "conData", data: this.conData, taskID: taskID});
    }

    /**
     * Apply filters to the data table, only equal strings are supported at the moment.   --- UPDATED (Dexter) 20180610
     * @param {Array[]} table - A 2D array of the data table
     * @param {String[]} colNames - An array of the column names of the table, same order as how the table arranges the row data
     * @param {Array[]} filter - An array of all filters
     * @param {String} filter[][0] - The first value of the filter should be the column name
     * @param {String[]} filter[][1] - The second value of the filter is a list of values where it has to be matched, i.e. this is a OR rule to match with any of the values
     */
    static applyFilter(table, colNames, filter) {
        // If there is no filter, just returns the table.
        if (filter.length == 0) return table;
        else {
            // If there is filter, filter the table that matches the required values of certain columns, i.e. there are such a column.
            var inFilter = filter.map(f=>[colNames.indexOf(f[0]),f[1]]).filter(f=>f[0]>=0);
            
            // If the table contains no columns stated in the filter, just return the full table.
            return inFilter.length == 1 ? table.filter(row=>inFilter[0][1]==row[inFilter[0][0]]) : inFilter.length ? table.filter(row=>inFilter.every(f=>f[1].includes(row[f[0]]))) : table;
        }
    }

    /**
     * Find the plot scale based on a given range.   --- UPDATED (Dexter) 20190209
     * @param {Number} nowMin - The current minimum value of the data points
     * @param {Number} nowMax - The current maximum value of the data points
     * @param {Number} forceMin - Any specific minimum value of the plot axis
     * @param {Number} forceMax - Any specific maximum value of the plot axis
     * @param {Boolean} fitZero - Whether the plot must align zero as the mimumal
     */
    static findPlotScale(nowMin, nowMax, forceMin = null, forceMax = null, fitZero = null) {
        // Force a range for the plot scale in case of only one data point is given.
        if (nowMin == nowMax) {
            if (nowMin == 0) {
                nowMax = 1;
                if (forceMax == null) forceMax = 1;
            } else if (nowMin > 0) {
                nowMin = 0;
                if (forceMin == null) forceMin = 0;
            } else if (nowMin < 0) {
                nowMax = 0;
                if (forceMax == null) forceMax = 0;
            }
        }

        // Define the max and min value, and how much margin will the plot to show more on.
        const maxV = nowMax, minV = nowMin, more = (maxV - minV)/20;
        
        // Define the plot max and min values to be shown.
        const maxShowV = (forceMax || (maxV + more)), minShowV = (forceMin || ((Math.abs(Math.sign(minV) - Math.sign(maxV)) == 2 || (!fitZero && (minV/maxV > 2/3) )) ? (minV - more) : 0));

        // Find out a reasonable and presentable scale for the data display.
        var digit = (Math.floor(Math.log10(Math.abs(maxShowV-minShowV)))-1);
        var sugInt = 10**(digit), avaSet = new Array();
        [sugInt, sugInt * 2, sugInt * 2.5, sugInt * 3, sugInt * 5, sugInt * 7.5, sugInt * 10, sugInt * 15, sugInt * 20, sugInt * 25].forEach(i => {
            var atMax = (maxShowV-minShowV) / i, noOfInt = Math.ceil(atMax);
            if (noOfInt <= 12 && noOfInt >= 5) {
                avaSet.push([i, noOfInt, minShowV + noOfInt*i-maxShowV]);
            }
        })

        // Get the optimal scale with the minimum reasonable axis mark counts.
        const minDiff = Math.min(...avaSet.map(ele=>ele[2]));
        avaSet = avaSet.filter(ele=>ele[2] == minDiff);

        // Get the interval value.
        const minInt = Math.min(...avaSet.map(ele=>ele[1]));
        const toNoOfInt = avaSet.find(ele=>ele[1] == minInt);

        // NOTE: Algorithm above have not been proven to be applied to all the ranges within the real number domain
        if (toNoOfInt) {
            // Find out the exact axis min/max values because sometimes the auto scaling may not fit the axis interval.
            const exactMin = minShowV >= 0 ? (minShowV - minShowV%toNoOfInt[0]) : (minShowV - (minShowV%toNoOfInt[0] == 0 ? 0 : (toNoOfInt[0] + minShowV%toNoOfInt[0]))) ;
            const exactMax = maxShowV >= 0 ? (maxShowV + (maxShowV%toNoOfInt[0] == 0 ? 0 : (toNoOfInt[0] - maxShowV%toNoOfInt[0]))) : (maxShowV - maxShowV%toNoOfInt[0]) ;
            return {max: maxV, min: minV, interval: toNoOfInt[0], digit: digit, showMin: (forceMin || exactMin), exactMin: exactMin, showMax: (forceMax || exactMax), exactMax: exactMax };
        } else {
            return {info: "error"};
        }
        
    }

    /**
     * Convert the plot scale into a list of numbers (and the corresponding strings) of the axis label marks.   --- UPDATED (Dexter) 20180610
     * @param {Object} plotScale - An object returned from TrainLog.findPlotScale() function
     */
    static convertScaleToPlot(plotScale) {
        // Define the list of numbers of the axis marks.
        var plotNum = [];

        // Get the rounding digit for the current scale.
        const roundDigit = plotScale.interval % 10**(plotScale.digit) == 0 ? plotScale.digit : (plotScale.digit - 1);

        // Find the minimum and maximum label numbers.
        const minInt = round(Math.max(plotScale.exactMin, plotScale.showMin), -roundDigit), maxInt = round(Math.min(plotScale.exactMax, plotScale.showMax), -roundDigit);

        // Loop over the plot range and push the labels.
        var nextInt = minInt, i=1;
        while (nextInt < maxInt) {
            plotNum.push(nextInt);
            nextInt = round(minInt + i*plotScale.interval,-roundDigit);
            i++;
        }
        plotNum.push(maxInt);

        // Convert the numbers into strings.
        var plotLabel = plotNum.map(n=>{
            if ((n>100000 && plotNum.digit >=4) || (n<0.0001 && plotNum.digit <= -4)) {
                return Number.parseFloat(n).toExponential();
            } else {
                return ""+n;
            }
        })

        // Return the numerical and string values of the axis marks.
        return {num: plotNum, label: plotLabel};
    }

    /**
     * Set the innertext as the name of a column.   --- UPDATED (Dexter) 20181111
     * @param {PreSVGElement} preEle - A preSVGElement.
     * @param {String} name - The name of the column.
     */
    static setColNameAsInnerText(preEle, name) {
        if (name.indexOf(": ") == -1) {
            preEle.setDataset("lt", name);
        } else {
            const actualName = name.split(": ");
            preEle.setDataset("lt", actualName[1]);
            preEle.setDataset("ltTemp", actualName[0] + ": $$$");
        }
    }
}

/** Class representing a weight graph, a grid color representation of weight logs.   --- UPDATED (Dexter) 20180531 */
class WeightGraph extends GraphItem {
    /**
     * Calculate all necessary SVG elements positioning and details.   --- UPDATED (Dexter) 20180721
     * @param {String} action - Type of action, "draw" or "redraw"
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    drawDetails(action, taskID) {
        // The options are very frequently referenced later on.
        var dashBoardOptions=this.dashBoardOptions, dataOptions = this.dataOptions;

        /**
         * =================== (1) Preparing Graph-Drawing Styling  ===================
         */

        // Prepare some basic styling information, like size, text margin, margins, axis ending margin, font size, mark size, etc.
        var w=this.w, h=this.h, fontSize = this.dashBoardOptions.fontSize == "auto" ? 16: this.dashBoardOptions.fontSize;
        const margin = 0.05, marginL = this.w*margin, marginT = this.h*margin, labelFont = Math.round(fontSize*.85), axisEndMargin = fontSize, lineHeight = 1.5, fontHeight = fontSize *lineHeight, verLabelCenter=labelFont*.65*.5;
        const mark = 8, markSub = 4, txtMargin = Math.round(fontSize*.5);
        
        // Determine which step is showing.
        const atStep = this.dashBoardOptions.step == "auto" ? this.conData.maxStep : this.dashBoardOptions.step;

        // Check if a legend has to be shown and define necessary variables.
        var showLegend = this.dashBoardOptions.showLegend;
        var legendDir, legendWidth, legendHeight;  

        if (showLegend) {

            // If legend has to be shown, determine the direction of the legend, and the size of each legend small box.
            legendDir = (w/h>1);
            
            // Determine whether legend is placed on the bottom or on the right, and determine how the box should be sized.
            if (legendDir) {
                legendWidth = fontSize * 7 + mark; // 1.5 + 0.5 + 3 + 1*2 | (Color scale Width) + (Margin between Color Scale & Text Label) + (Text Label Width) + (Box Padding * 2)
                legendHeight = Math.min((h - marginT*2) * .75, fontSize*14); // 2*3*2 + 1*2 | (Text Label Height * 3 Labels * scale) + (Box Padding * 2)
            } else {
                legendWidth = Math.min((w - marginL*2) * .85, fontSize*20); // 3*3*2 + 1*2 | (Text Label Width * 3 Labels * scale) + (Box Padding * 2)
                legendHeight = fontSize *6 + mark; // 1.5 + 0.5 + 2 + 1*2 | (Color scale Height) + (Margin between Color Scale & Text Label) + (Text Label Height) + (Box Padding * 2)
            }

            // If there is not enough space to display the graph as well, don't show the legend.
            if ((legendDir && ((w-legendWidth) < 350)) || (!legendDir && ((h-legendHeight) < 250))) showLegend = false;

        }

        // Get the current consolidated data.
        var wg = this.conData.fullData.get(atStep);

        // Check the dimension count and shape of the weight data.
        var dimCount = 0, dimTest = wg, dimShape = [];
        if (dimTest instanceof Array) {
            while (dimTest[0]){
                dimCount++;
                dimShape.push(dimTest.length);
                dimTest = dimTest[0];
            }
        }

        // Check the number of x and y axis intervals, i.e. the last 2 dimension value of the weight grid.
        var yLen = dimShape.length >= 2 ? dimShape[(dimShape.length)-2] : 0, xLen = dimShape.length >= 1 ? dimShape[(dimShape.length)-1] : 0;

        // Determine the graph plotting size, i.e. the range where data can plot.
        const leftmost = Math.round(marginL + (""+yLen).length*labelFont*.5 + mark + txtMargin*2 + fontHeight);
        const rightmost = Math.round(w - marginL - ((showLegend && legendDir) ? (legendWidth + fontSize) : 0) )
        const topmost = marginT + lineHeight + fontSize;
        const bottommost = Math.round(h - marginT - mark - txtMargin*2 - fontHeight - labelFont - ((showLegend && !legendDir)?(legendHeight + fontSize) : 0)) - fontSize*3.5;
        
        // Determine the size of the graph plotting area, while plotW and plotH are more exactly described as it excludes the axis ending margin.
        const bgW = rightmost-leftmost, bgH = bottommost-topmost;
        const plotW = bgW, plotH = bgH;
        const fontFamily= "Segoe UI, 微軟正黑體, Arial, Calibri, Helvetica";

        /**
         * =================== (2) Drawing Weight Grids ===================
         */

        // Define the minimum and maximum values, and whether the weight scale range will go across zero, eg. [-0.1,0.2] vs [0.1,0.2]
        const minMaxInfo = this.dashBoardOptions.fixedRanged ? this.conData.minMax : this.conData.minMaxs.get(atStep);
        const valMin = minMaxInfo.min, valMax = minMaxInfo.max, crossZero = minMaxInfo.crossZero;

        // FInd the indexes that the dimension will be responsible for the partiioning the x-axis.
        var dimOnX = dimShape.map((x,idx)=>idx).reverse().map(ele=>ele%2==0);

        // Get the dimensions that are responsible for partitioning the x/y-axis.
        const dimXs = dimShape.filter((ele,idx)=>dimOnX[idx]), dimYs = dimShape.filter((ele,idx)=>!dimOnX[idx]);

        // Get the accumulated dimensional count of every dimensions for the x/y-axis.
        const accDimXs = dimXs.map((ele,idx)=>dimXs.slice(0,idx).reduce((a,b)=>a*b,1)), accDimYs = dimYs.map((ele,idx)=>dimYs.slice(0,idx).reduce((a,b)=>a*b,1));

        // Get the number of grids for the x/y-axis.
        const gridPerAxisLabelX = dimXs.slice(0,-1).reduce((a,b)=>a*b,1), gridPerAxisLabelY = dimYs.slice(0,-1).reduce((a,b)=>a*b,1);

        // Get the grid size, and the value scaling of the weight data.
        const gridWidth = plotW / dimXs.reduce((a,b)=>a*b,1), gridHeight = plotH / dimYs.reduce((a,b)=>a*b,1), valScale = TrainLog.findPlotScale(valMin, valMax);
        
        // Define an array for all elements to be drawn.
        var grids = []; 

        // Get the color profile of the current weight dashBoard options.
        const colorProfile = this.dashBoardOptions.channel;

        /**
         * Get the dimensional data of the weight array.
         * @param {Array} ary - A possibly multi-dimensional array
         * @param {Number[]} at - The dimension selector
         * @returns {*} The selected dimension of the array, can be an array value or another array
         */
        function getDim(ary,at) {
            try {
                return at.length ? getDim(ary[at[0]], at.slice(1)) : ary;
            } catch(e) {
                return at.length ? getDim(ary[at[0]], at.slice(1)) : ary;
            }
        }

        // Whether the grid must force a refresh for this drawing.
        var refreshed = action == "draw" || this.drawnEle.size == 0 || (this.drawnEle.has("weightGraphTitle") && this.drawnEle.get("weightGraphTitle").textContent != this.conData.colName);
        var colorUpdated = false;

        /**
         * Select a certain index of the weight array to create a weight grid.
         * @param {Array} ary - A possibly multi-dimensional array
         * @param {Number[]} dim - The shape of this array
         * @param {Number[]} at - The index of a required sub-dimension
         */
        function subDim(ary,dim,at) {
            if (at.length<dim.length) {
                // If the selection is not as the dimension of the array, go deeper for selection of array data.
                for (let i=0; i<dim[at.length]; i++)
                    subDim.bind(this)(ary,dim,[...at,i])
            } else {
                // Stringify the array index and this will be part of the id of the grid element.
                const nowAt = JSON.stringify(at);
                
                // Prepare a grid SVG element.
                var grid = new PreSVGElement("rect", "grid_"+nowAt);

                // If the grid has not been drawn or the data value is changed (possibly because of switching training step), force update the grid.
                var toVal = round(getDim(wg,at), -(valScale.digit-2));
                var toUpdateColor = (refreshed || this.dashBoardOptions.changed || (!this.drawnEle.has("grid_"+nowAt) || this.drawnEle.get("grid_"+nowAt).dataset.get("val") != toVal));
                var toUpdateGrid = refreshed;
                if (toUpdateGrid) {
                    grid.setPrivateData("relX", at.filter((i,idx)=>dimOnX[idx]).map((i,idx)=>i*accDimXs[idx]).reduce((a,b)=>a+b,0));
                    grid.setPrivateData("relY", at.filter((i,idx)=>!dimOnX[idx]).map((i,idx)=>i*accDimYs[idx]).reduce((a,b)=>a+b,0)+1);
                } 
                if (toUpdateColor) {
                    colorUpdated = true;

                    // Define the color to be used, and the value of this particular index of the weight. 
                    var toH, toS, toL;

                    // Get the color of the grid depending on the value and whether the whole color profile ranges across the zero.
                    if (crossZero) {
                        if (toVal >= 0) {
                            const prop = (toVal-0)/(valMax);
                            [toH, toS, toL] = [0,1,2].map(cv => (prop*(colorProfile[3][cv]-colorProfile[2][cv])+colorProfile[2][cv]));
                        } else {
                            const prop = (toVal-valMin)/(-valMin);
                            [toH, toS, toL] = [0,1,2].map(cv => (prop*(colorProfile[1][cv]-colorProfile[0][cv])+colorProfile[0][cv]));
                        }
                    } else {
                        const prop = (toVal-valMin)/(valMax-valMin);
                        [toH, toS, toL] = [0,1,2].map(cv => prop*(colorProfile[3][cv]-colorProfile[0][cv])+colorProfile[0][cv]);
                    }
                    grid.setDataset("val", toVal);
                    grid.setAttribute("fill", `hsl(${toH}, ${toS}%, ${toL}%)`);
                }
                if (this.drawnEle.has("grid_"+nowAt)) {
                    // On updating the elements, the dataset value should be kept.
                    var oriEle = this.drawnEle.get("grid_"+nowAt);
                    if (!toUpdateColor) grid.setDataset("val", oriEle.dataset.get("val"));
                    if (!toUpdateGrid) {
                        grid.setPrivateData("relX", oriEle.privateData.get("relX"));
                        grid.setPrivateData("relY", oriEle.privateData.get("relY"));
                    }
                }
                grid.setAttribute("x", leftmost + grid.privateData.get("relX")*gridWidth);
                grid.setAttribute("y", bottommost - grid.privateData.get("relY")*gridHeight);
                grid.setAttribute("width", gridWidth);
                grid.setAttribute("height", gridHeight);
                grids.push(grid);
                
                // If there have been many grids, flush them and drawn using the UI thread.
                if (grids.length > 10) {
                    postMessage({action: action, taskID:taskID, eleList: grids});
                    grids = [];
                }
            }
        }

        // Loop all the values in the weight grid.
        subDim.bind(this)(wg,dimShape,[]);

        // Draw the remaining grids that have not been flushed.
        postMessage({action: action, taskID:taskID, eleList: grids});

        /**
         * =================== (3) Drawing axis   ===================
         */

        // Define an array for all elements to be drawn.
        var marks = [];

        // Get the interval of y-axis marks that should be printed, noted some marks labels are hidden in case of not enough vertical space.
        const maxHText = Math.min(yLen+1, Math.floor(plotH/(fontSize*2))+1), hTextInterval = Math.ceil((yLen+1)/maxHText);
        
        // Loop using the number of y-axis labels to be printed.
        for (let i=0; i<=yLen; i++) {

            // Prepare a y-axis mark SVG element.
            var hM = new PreSVGElement("path", "horMark"+(i+1));
            if (!this.drawnEle.has("horMark"+(i+1))) {
                hM.setClass("axisMark");
                hM.setAttribute("stroke-width", 1);
            }
            const toY= bottommost - (i)*gridHeight*gridPerAxisLabelY;
            hM.setAttribute("d", `M${leftmost} ${toY} l${-mark} ${0} z`);
            marks.push(hM);

            // Show axis mark label if needed, or if it is the ending axis mark.
            if (i%hTextInterval == 0 || i == yLen) {
                // Prepare a y-axis mark label SVG element.
                var hMT = new PreSVGElement("text", "horMarkTxt"+i);
                if (!this.drawnEle.has("horMarkTxt"+i)) {
                    hMT.setClass("axisMarkText");
                    hMT.setAttribute("font-family", fontFamily);
                    hMT.setAttribute("text-anchor", "end");
                    hMT.textContent = "" + i;
                }
                hMT.setAttribute("font-size", labelFont + "px");
                hMT.setAttribute("dy", verLabelCenter);
                hMT.setAttribute("x", leftmost - txtMargin - mark);
                hMT.setAttribute("y", toY);
                marks.push(hMT);
            }

        }

        // Get the interval of x-axis marks that should be printed, noted some marks labels are hidden in case of not enough horizontal space.
        const maxVText = Math.min(xLen+1, Math.floor(plotW/(labelFont*.75*((""+xLen).length)))+1), vTextInterval = Math.ceil((xLen+1)/maxVText);

        // Loop using the number of x-axis labels to be printed.
        for (let i=0; i<=xLen; i++) {

            // Prepare a x-axis mark SVG element.
            var hM = new PreSVGElement("path", "verMark"+(i+1));
            if (!this.drawnEle.has("verMark"+(i+1))) {
                hM.setClass("axisMark");
                hM.setAttribute("stroke-width", 1);
            }
            const toX = leftmost + i*gridWidth*gridPerAxisLabelX;
            hM.setAttribute("d", `M${toX} ${bottommost} l${0} ${mark} z`);
            marks.push(hM);

            // Show axis mark label if needed, or if it is the ending axis mark.
            if (i%vTextInterval == 0 || i == xLen) {
                // Prepare a x-axis mark label SVG element.
                var hMT = new PreSVGElement("text", "verMarkTxt"+i);
                if (!this.drawnEle.has("verMarkTxt"+i)) {
                    hMT.setClass("axisMarkText");
                    hMT.setAttribute("font-family", fontFamily);
                    hMT.setAttribute("text-anchor", "middle");
                    hMT.textContent = "" + i;
                }
                hMT.setAttribute("font-size", labelFont + "px");
                hMT.setAttribute("x", toX);
                hMT.setAttribute("y", bottommost + mark + txtMargin + labelFont);
                marks.push(hMT);
            }

        }

        // If there is more than one y-axis marks, place a axis label text on it.
        if (yLen > 1) {
            // Prepare a y-axis label text SVG element.
            var ayL = new PreSVGElement("text", "axisYLabel");
            if (!this.drawnEle.has("axisYLabel")) {
                ayL.setClass("axisMarkText");
                ayL.setAttribute("font-family", fontFamily);
                ayL.setAttribute("text-anchor", "middle");
                ayL.setClass("lt");
                ayL.setDataset("lt","wgFromDim");
            }
            ayL.setAttribute("font-size", fontSize);
            const ayLX = marginL + fontHeight, ayLY = (bottommost+topmost)/2;
            ayL.setAttribute("x", ayLX);
            ayL.setAttribute("y", ayLY);
            ayL.setAttribute("transform", `rotate(-90 ${ayLX} ${ayLY})`);
            marks.push(ayL);
        }

        // Prepare a x-axis label text SVG element.
        var axL = new PreSVGElement("text", "axisXLabel");
        if (!this.drawnEle.has("axisXLabel")) {
            axL.setClass("axisMarkText");
            axL.setAttribute("font-family", fontFamily);
            axL.setAttribute("text-anchor", "middle");
            axL.setClass("lt");
            axL.setDataset("lt","wgToDim");
        }
        axL.setAttribute("font-size", fontSize + "px");
        const ayXX = (leftmost + rightmost)/2, axLY = bottommost+mark+txtMargin*2 + labelFont*lineHeight + fontSize;
        axL.setAttribute("x", ayXX);
        axL.setAttribute("y", axLY);
        marks.push(axL);
        
        // Prepare a graph title  SVG element, showing what weight is displaying.
        var wgT = new PreSVGElement("text", "weightGraphTitle");
        if (!this.drawnEle.has("weightGraphTitle")) {
            wgT.setClass("axisMarkText");
            wgT.setClass("resultsHeading");
            wgT.setAttribute("font-family", fontFamily);
            wgT.setAttribute("text-anchor", "middle");
        } 
        wgT.setAttribute("font-size", fontSize + "px");
        wgT.textContent = this.conData.colName;
        wgT.setAttribute("x", (leftmost + rightmost)/2);
        wgT.setAttribute("font-weight", 700);
        wgT.setAttribute("y", topmost - fontSize - txtMargin);
        marks.push(wgT);
        
        // Draw all the axis related elements on the main thread.
        postMessage({action: action, taskID:taskID, eleList: marks});
        
        /**
         * =================== (4) Drawing Legend   ===================
         */

        // Only draw legend if needed.
        if (showLegend) {

            // Define an array for all elements to be drawn, and get the position of the legend box.
            var legendEles = [];
            const legendX = legendDir ? (w - marginL - legendWidth) : ((w-legendWidth)/2), legendY = legendDir ? ((h-legendHeight)/2) :(h - marginT - legendHeight - fontSize*3);
            
            // Prepare the legend box SVG element.
            var lb = new PreSVGElement("rect", "lengendBox");
            if (!this.drawnEle.has("lengendBox")) {
                lb.setClass("lengendBox");
                lb.setAttribute("stroke-width", 1);
                lb.setAttribute("fill", "transparent");
            } 
            lb.setAttribute("width", legendWidth);
            lb.setAttribute("height", legendHeight);
            lb.setAttribute("x", legendX);
            lb.setAttribute("y", legendY);
            legendEles.push(lb);
            
            // Prepare the legend color scale graident definition SVG element.
            var def = new PreSVGElement("defs", "gradientDef");
            legendEles.push(def);

            // Prepare the legend color scale linear graident SVG element.
            var lg = new PreSVGElement("linearGradient", "lengendLG");
            if (!this.drawnEle.has("lengendLG")) {
                lg.appendIn = "gradientDef";
            }
            if (legendDir) {
                lg.setAttribute("x1", "0%");
                lg.setAttribute("x2", "0%");
                lg.setAttribute("y1", "100%");
                lg.setAttribute("y2", "0%");
            } else {
                lg.setAttribute("x1", "0%");
                lg.setAttribute("x2", "100%");
                lg.setAttribute("y1", "0%");
                lg.setAttribute("y2", "0%");
            }
            legendEles.push(lg);

            // Prepare the legend color scale linear graident color stops SVG elements.
            if (colorUpdated) {
                var allColors = crossZero ? [...colorProfile] : [colorProfile[0], colorProfile[3]];
                const interval = 4, totalColor = allColors.length-1;
                var nowIdx = 0;
                // Add intervals to the color range.
                for (let i=0; i<totalColor; i++) {
                    const toColor = allColors[nowIdx+1];
                    const fromColor = allColors[nowIdx];
                    const pDiff = toColor[3] - fromColor[3];
                    if (pDiff > 0) {
                        const hDiffPre = Math.abs(toColor[0] - fromColor[0]) % 360;
                        const hDiff = (hDiffPre > 180 ? hDiffPre-360 : hDiffPre) * Math.sign(toColor[0] - fromColor[0]);
                        const sDiff = toColor[1] - fromColor[1];
                        const lDiff = toColor[2] - fromColor[2];
                        const intervalC = [];
                        for (let j=1; j<interval; j++) {
                            intervalC.push([fromColor[0]+hDiff/interval*j, fromColor[1]+sDiff/interval*j, fromColor[2]+lDiff/interval*j, fromColor[3]+pDiff/interval*j]);
                        }
                        allColors.splice(nowIdx+1, 0, ...intervalC);
                        nowIdx += interval;
                    } else {
                        nowIdx += 1;
                    }
                }
                // Add the stop elements according to the calculated gradients.
                allColors.forEach((c,idx)=>{
                    var ls = new PreSVGElement("stop", "ls_"+idx);
                    ls.appendIn = "lengendLG";
                    ls.setAttribute("offset", (c[3]*100)+"%");
                    ls.setAttribute("style", `stop-color: hsl(${c[0]},${c[1]}%,${c[2]}%); stop-opacity: 1`);
                    legendEles.push(ls);
                })
            } else {
                // Keep all the color stops.
                legendEles.push(...[...this.drawnEle.keys()].filter(kn=>kn.startsWith("ls_")).map(kn=>this.drawnEle.get(kn)));
            }
            

            // Prepare the legend marks
            for (let i=0; i<3; i++) {
                if (i!=1 || crossZero) {
                    const perct = (i/2*100);
                    var lmk = new PreSVGElement("path", "lgMark"+(i));
                    if (!this.drawnEle.has("lgMark"+(i))) {
                        lmk.setClass("axisMark");
                        lmk.setAttribute("stroke-width", 1);
                    }
                    const toX = legendDir ? (legendX + fontSize*2.5) : (legendX + fontSize*1 + (1-perct/100)* (legendWidth-fontSize*2));
                    const toY = legendDir ? (legendY + fontSize*1 + (perct/100)*(legendHeight-fontSize*2)) : (legendY + fontSize*2.5);
                    const mkX = legendDir ? mark : 0 ;
                    const mkY = legendDir ? 0: mark;
                    lmk.setAttribute("d", `M ${toX} ${toY} l ${mkX} ${mkY}`);
                    legendEles.push(lmk);
                }
            }

            // Prepare the legend color scale rect box SVG elements.
            var lc = new PreSVGElement("rect", "lengendCB");
            if (!this.drawnEle.has("lengendCB")) {
                lc.setAttribute("fill", `url(#${this.id}-lengendLG)`);
            }
            lc.setAttribute("x", legendX + fontSize*1);
            lc.setAttribute("y", legendY +fontSize*1);
            lc.setAttribute("width", (legendDir) ? fontSize*1.5 : (legendWidth - fontSize*2));
            lc.setAttribute("height", (legendDir) ? (legendHeight - fontSize*2) : fontSize*1.5);
            legendEles.push(lc);

            // Prepare the legend max color scale text label SVG elements.
            var lMinT = new PreSVGElement("text", "legendMax");
            var valMinRounded = round(valMin, -(valScale.digit - 2));
            var valMaxRounded = round(valMax, -(valScale.digit - 2));
            if (!this.drawnEle.has("legendMax")) {
                lMinT.setAttribute("font-family", fontFamily);
            } 
            lMinT.setAttribute("font-size", fontSize + "px");
            lMinT.setAttribute("dy", verLabelCenter);
            lMinT.textContent = valMaxRounded;
            if (legendDir){
                lMinT.setAttribute("x", legendX+fontSize*3+mark);
                lMinT.setAttribute("y", legendY+fontSize*2);
            } else {
                lMinT.setAttribute("x", legendX+fontSize*1);
                lMinT.setAttribute("y", legendY+legendHeight-fontSize*2);
            }
            legendEles.push(lMinT);

            // If the weight scale is crossing zero, prepare the legend zero color scale text label SVG elements.
            if (crossZero) {
                var lZeroT = new PreSVGElement("text", "legendZero");
                if (!this.drawnEle.has("legendZero")) {
                    lZeroT.setAttribute("font-family", fontFamily);
                    lZeroT.textContent = "0";
                }
                lZeroT.setAttribute("font-size", fontSize + "px");
                lZeroT.setAttribute("dy", verLabelCenter);
                if (legendDir){
                    lZeroT.setAttribute("x", legendX+fontSize*3+mark);
                    lZeroT.setAttribute("y", legendY+legendHeight/2);
                } else {
                    lZeroT.setAttribute("x", legendX+legendWidth/2);
                    lZeroT.setAttribute("y", legendY+legendHeight-fontSize*2);
                }
                legendEles.push(lZeroT);
            }

            // Prepare the legend min color scale text label SVG elements.
            var lMaxT = new PreSVGElement("text", "legendMin");
            if (!this.drawnEle.has("legendMin")) {
                lMaxT.setAttribute("font-family", fontFamily);
            }
            lMaxT.setAttribute("font-size", fontSize + "px");
            lMaxT.setAttribute("dy", verLabelCenter);
            lMaxT.textContent = valMinRounded;
            if (legendDir){
                lMaxT.setAttribute("text-anchor", "start");
                lMaxT.setAttribute("x", legendX+fontSize*3+mark);
                lMaxT.setAttribute("y", legendY+legendHeight-fontSize*2);
            } else {
                lMaxT.setAttribute("text-anchor", "end");
                lMaxT.setAttribute("x", legendX+legendWidth - fontSize*1);
                lMaxT.setAttribute("y", legendY+legendHeight-fontSize*2);
            }
            legendEles.push(lMaxT);

            // Draw all the legend related elements on the main thread.
            postMessage({action: action, eleList: legendEles, taskID: taskID});
            
        } 

        /**
         * =================== (5) Drawing Step Changing Box    ===================
         */

        // Define an array for all step box elements to be drawn.
        var stepB = [];
        const stepBoxX = marginL, stepBoxY = h-marginT-fontSize*2.5, stepBoxW = w-marginL*2, stepBoxH = fontSize * 2.5;

        // Prepare the step box SVG element.
        var sbb = new PreSVGElement("rect", "stepBox");
        if (!this.drawnEle.has("stepBox")) {
            sbb.setClass("lengendBox");
            sbb.setClass("stepBox");
            sbb.setAttribute("stroke-width", 1);
            sbb.setAttribute("fill", "transparent");
        } 
        sbb.setAttribute("width", stepBoxW);
        sbb.setAttribute("height", stepBoxH);
        sbb.setAttribute("x", stepBoxX);
        sbb.setAttribute("y", stepBoxY);
        stepB.push(sbb);

        // Prepare the step box range slider line SVG element.
        var sbl = new PreSVGElement("path", "stepBoxRange");
        if (!this.drawnEle.has("stepBoxRange")) {
            sbl.setClass("range");
            sbl.setAttribute("stroke-width", 2);
        } 
        const sblLen = stepBoxW - fontSize*(10+(""+this.conData.maxStep).length*.6);
        sbl.setAttribute("d", `M ${stepBoxX+fontSize*8} ${stepBoxY + fontSize*1.25} l ${sblLen} 0`);
        stepB.push(sbl);

        // Prepare the step box text title SVG element.
        var sbxL = new PreSVGElement("text", "stepBoxText");
        if (!this.drawnEle.has("stepBoxText")) {
            sbxL.setAttribute("font-family", fontFamily);
            sbxL.setAttribute("font-weight", 700);
            sbxL.setClass("lt");
            sbxL.setDataset("lt", "Global Step");
        }
        sbxL.setAttribute("font-size", fontSize + "px");
        sbxL.setAttribute("dy", verLabelCenter);
        sbxL.setAttribute("text-anchor", "start");
        sbxL.setAttribute("x", stepBoxX+fontSize);
        sbxL.setAttribute("y", stepBoxY+stepBoxH/2);
        stepB.push(sbxL);

        // Prepare the step box current step text indicator SVG element.
        var sbxN = new PreSVGElement("text", "stepBoxNum");
        if (!this.drawnEle.has("stepBoxNum")) {
            sbxN.setAttribute("font-family", fontFamily);
        }
        sbxN.setAttribute("font-size", fontSize + "px");
        sbxN.setAttribute("dy", verLabelCenter);
        sbxN.textContent = atStep;
        sbxN.setAttribute("text-anchor", "start");
        sbxN.setAttribute("x", stepBoxX+stepBoxW - fontSize - fontSize*(""+this.conData.maxStep).length*.6);
        sbxN.setAttribute("y", stepBoxY+stepBoxH/2);
        stepB.push(sbxN);

        // Prepare the step box range marker SVG elements.
        const xRange = (this.conData.maxStep-this.conData.minStep);
        var stepMarkers = [];
        if (xRange > 0) {
            this.conData.allSteps.sort((a,b)=>a>b?1:-1);
            stepMarkers = this.conData.allSteps.map(s=>stepBoxX+fontSize*8+(s-this.conData.minStep)/xRange*sblLen);
        } else {
            stepMarkers = [stepBoxX+fontSize*8+sblLen];
        }
        stepMarkers.forEach(v=>{
            var sbxs = new PreSVGElement("path", "stepBoxMarkers_"+v);
            if (!this.drawnEle.has("stepBoxMarkers_"+v)) {
                sbxs.setClass("axisMark");
            }
            sbxs.setAttribute("d", `M ${v} ${stepBoxY+stepBoxH/2-fontSize/2} l 0 ${fontSize}`);
            stepB.push(sbxs);
        });

        // Prepare the step box hovering slider pin SVG element.
        var sbxs = new PreSVGElement("circle", "stepBoxSliderShadow");
        if (!this.drawnEle.has("stepBoxSliderShadow")) {
            sbxs.setClass("stepBoxSliderShadow")
            sbxs.setAttribute("r", fontSize*.5);
        }
        sbxs.setAttribute("cx", stepBoxX+fontSize*8+sblLen*(xRange > 0 ? (atStep-this.conData.minStep)/xRange : 1));
        sbxs.setAttribute("cy", stepBoxY+stepBoxH/2);
        stepB.push(sbxs);

        // Prepare the step box slider pin SVG element.
        var sbxsO = new PreSVGElement("circle", "stepBoxSlider");
        if (!this.drawnEle.has("stepBoxSlider")) {
            sbxsO.setClass("stepBoxSlider")
            sbxsO.setAttribute("r", fontSize*.5);
        }
        sbxsO.setAttribute("cx", stepBoxX+fontSize*8+sblLen*(xRange > 0 ?(atStep-this.conData.minStep)/xRange : 1));
        sbxsO.setAttribute("cy", stepBoxY+stepBoxH/2);
        stepB.push(sbxsO);
        
        // Draw all the step box related elements on the main thread.
        postMessage({action: action, eleList: stepB, taskID: taskID});

        // Get the step box hovering x-intervals for later checking pointer movement on which step is selected.
        var hoverList= [stepBoxX, ...this.conData.allSteps.slice(0,-1).map((s,i,ary)=>(((s+this.conData.allSteps[i+1])/2)-this.conData.minStep)/xRange*sblLen+stepBoxX+fontSize*8), (stepBoxX+stepBoxW)];
        postMessage({action: "updateSliderAction", taskID: taskID, hoverList: hoverList, allSteps:this.conData.allSteps, minY: stepBoxY, maxY: stepBoxY+stepBoxH, stepNow: atStep});

        // Finish the drawing.
        postMessage({action: "Finished", done: action, taskID: taskID});
    }

    /**
     * Digest the data from a date/log related structure into a presentation cache of necessary data information.   --- UPDATED (Dexter) 20190209
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    consolidateData(taskID) {
        // Reinitialize the consolidated data.
        var conData = this.conData = {};

        // Get what weight / bias name is displaying.
        var weightItem = this.dataOptions.weightItem;
        
        // To select the available data only.
        const builds = this.dataOptions.build;
        const runs = this.dataOptions.runNo;
        const cvRuns = this.dataOptions.cvNo;
        const allBuild = builds.length == 0;
        const allRuns = runs.length == 0;

        // Prepare that an error boolean to check whether the collected CSV files are inconsistent.
        var inconsistentError = false;

        // Filter rules by runs and cross validations.
        var filterRules = [];

        // Loop the data for consolidation.
        this.data.forEach((dateData,dateNo)=>{

            // Loop the build results for consolidation.
            dateData.forEach((buildTables, tableKey)=>{
                
                // Only check the "weightLog".
                if (["weightLog"].includes(tableKey)) {
                    // Concatenate build information
                    var newTable = [], tableCol = null;
                    buildTables.forEach((table, buildNo)=>{
                        // Only push data if current option is printing the matched build or all builds.
                        if (table && (allBuild || builds.includes(buildNo))) {
                            // If there is no table columns recorded before, use this table's heading as the table columns.
                            if (!tableCol) tableCol = table[0];
                            
                            // Make sure all tables are with same columns, then push the filtered data into the new table. Otherwise, inconsistent error results.
                            if (table.every(row=>row.length == tableCol.length)) {
                                newTable.push(...TrainLog.applyFilter(table.slice(1), tableCol, filterRules));
                            } else {
                                inconsistentError = true;
                            }
                        }
                    });
                    
                    // Find the starting index of the weight columns.
                    let startIdx = Math.max(...["Timestamp","Run","Cross Validation Step","Global Step","Local Step"].map(colName => tableCol.indexOf(colName)));
                                    
                    // If the there is no defined weight item, just use the first weight item.
                    if (weightItem == "auto") weightItem = tableCol[startIdx+1];

                    // Initiate varaibles.
                    var xIdx, runIdx, cvIdx;

                    if (newTable.length) {
                        // Check the columne id for the x-axis data.
                        xIdx = tableCol.indexOf("Global Step");
                        runIdx = tableCol.indexOf("Run");
                        cvIdx = tableCol.indexOf("Cross Validation Step");

                        // Get available runs and cross validations.
                        var availableRuns = [...new Set(newTable.map(r=>Number(r[runIdx])))];
                        var availableCVs = [...new Set(newTable.map(r=>Number(r[cvIdx])))];

                        // Select necessary run or cross validations.
                        var runCVRules = [];

                        // If there is runNo and cvNo restrictions, filter the runNo.
                        if (runs.length) runCVRules.push(["Run", runs]);
                        if (cvRuns.length) runCVRules.push(["Cross Validation Step", cvRuns]);
                        else runCVRules.push(["Cross Validation Step", ["-1"]]);
                        newTable = TrainLog.applyFilter(newTable, tableCol, runCVRules)
                    }
        
                    // Get all the weight column names, and find the index of the current weight item.
                    var allCols = tableCol.slice(startIdx+1);
                    const yIdx = tableCol.indexOf(weightItem);
                    
                    // Reduce memory size by caching only the x and weight information.
                    try {
                        newTable = newTable.map((row) => [Number(row[xIdx]), JSON.parse(row[yIdx])]);
                    } catch(e) {
                        inconsistentError = true;
                    }

                    // If there are data in the concated table, and the table has the data info of the x-axis, continue for data consolidation.
                    if (newTable.length && tableCol.includes("Global Step")) {
                        
                        // Get all the steps available, for using the global step selection later on.
                        const stepSet = new Set(newTable.map(ele=>ele[0]));
                        const allSteps = [...stepSet];

                        // Get the min and max step.
                        const maxStep = Math.max(...stepSet);
                        const minStep = Math.min(...stepSet);
                        
                        // Determine if aggregation is needed. Store all weights into a step-weight map.
                        const toAggregate = allSteps.length < newTable.length;
                        var aggWGs;
                        if (toAggregate) {
                            // Push each row into the step map.
                            aggWGs = new Map(allSteps.map(step=>[step, []]));
                            newTable.forEach(row=>aggWGs.get(row[0]).push(row[1]));

                            // Get the average weight matrix
                            aggWGs.forEach((v,k,ary)=>{
                                ary.set(k, Matrix.multiply(Matrix.add(...v), 1/v.length));
                            })
                        } else {
                            // The original structure can already be fitted into a map object.
                            aggWGs = new Map(newTable);
                        }

                        // Set min max calc.
                        var minMaxs = new Map(allSteps.map(step=>{
                            // If there is a fixed range of weight, parse all the weights no matter the step. Otherwise, just flatten the current weight.
                            const allNum = Matrix.flatten(aggWGs.get(step));

                            // Get the min, max and whether to cross zero of the current weight.
                            const min = Math.min(...allNum), max = Math.max(...allNum), crossZero = Math.sign(min*max) < 1;

                            return [step, {min: min, max: max, crossZero: crossZero}];
                        }));

                        // Get the min, max and whether to cross zero of the current weight.
                        var allMinMax = [...minMaxs.values()];
                        const min = Math.min(...allMinMax.map(mm=>mm.min)), max = Math.max(...allMinMax.map(mm=>mm.max)), crossZero = Math.sign(min*max) < 1;

                        // Formulate the consolidated as an Object.
                        console.log(newTable.length)
                        this.conData = {hasData: newTable.length, fullData: aggWGs, colName: weightItem, allCols: allCols, minMaxs: minMaxs, minMax: {min: min, max: max, crossZero: crossZero}, maxStep:maxStep, allSteps: allSteps, minStep: minStep, availableRuns: availableRuns, availableCVs: availableCVs};
                    }

                }

            });

        });

        // Pass the consolidated data to the "worker.js".
        postMessage({action: "conData", data: this.conData, taskID: taskID});
    }
    
}

/** Class representing a trace log, a visualization of traced sampled records.   --- UPDATED (Dexter) 20180721 */
class TraceLog extends DashboardItem {
    /**
     * Calculate all necessary SVG elements positioning and details.   --- UPDATED (Dexter) 20180722
     * @param {String} action - Type of action, "draw" or "redraw"
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    drawDetails(action, taskID) {
        var conData = this.conData;

        /**
         * =================== (1) Preparing Header Information   ===================
         */

        // Prepare the final layer title.
        const finalLayer = conData.finalLayer;
        postMessage({action: action, subAction: "setTitle", taskID: taskID, data: {current: conData.finalLayer, all: conData.allFinalLayers, allSteps: conData.allSteps, atStep: conData.atStep}});

        // Prepare the header.
        const displayTarget = this.dashBoardOptions.displayTarget;
        const targetDisplay = displayTarget == "hide" ? "hide" : conData.targetData.dataType == "Image" ? "side" : displayTarget;
        postMessage({action: action, subAction: "setHeader", taskID: taskID, data: {display: targetDisplay, input: conData.inputData.header, target: conData.targetData.header}});

        // Prepare data rows.
        const batchSize = 10;
        const totalBatch = Math.ceil(conData.recordCount / batchSize);
        var missing = conData.recordCount;
        postMessage({action: action, subAction: "prepareRows", taskID: taskID, data: {display: targetDisplay, size: missing}});

        function prepareData(dataInfo, sliceStart = null, sliceEnd = null) {
            var data = (sliceStart != null && sliceEnd != null)? dataInfo.data.slice(sliceStart, sliceEnd) : dataInfo.data;
            const dataType = dataInfo.dataType;
            if (dataType == "Table"){
                // If it is a table or value, round the digits if needed.
                return data.map(r=>r.map((c,idx)=>{
                    const roundCol = dataInfo.roundCols[idx];
                    return (roundCol!=null) ? round(c,roundCol) : c;
                }));
            } else if (dataType == "Value"){
                // If it is a table or value, round the digits if needed.
                const roundCol = dataInfo.roundCols;
                return data.map(c=>[((roundCol!=null) ? round(c,roundCol) : c)]);
            } else if (dataType == "Image") {
                // Transform data into image data.
                return data.map(ary=>{
                    var dimTest = ary, dimShape = [];
                    while (dimTest.length){
                        dimShape.push(dimTest.length);
                        dimTest = dimTest[0];
                    }
                    if (!dimShape[2]) {
                        ary.forEach(r=>r=r.forEach((c,idx,rOri)=>{
                            rOri[idx] = [c,c,c,255];
                        }));
                    } else if (dimShape[2] == 1) {
                        ary.forEach(r=>r.forEach(c=>{
                            c[1] = c[2] = c[0];
                            c[3] = 255;
                        }));
                    } else if (dimShape[2] == 3) {
                        ary.forEach(r=>r.forEach(c=>c.push(255)));
                    }
                    return new ImageData(new Uint8ClampedArray(Matrix.flatten(ary)), dimShape[0], dimShape[1]);
                })
            }
        }
        for (let i=0; i<totalBatch; i++) {
            const fromIdx = i*batchSize, toIdx = fromIdx+Math.min(batchSize,missing);
            postMessage({action: action, subAction: "setData", taskID: taskID, data: {display: targetDisplay,length: toIdx-fromIdx, fromIdx: fromIdx, input: {data: prepareData(conData.inputData), dataType: conData.inputData.dataType}, 
                                                                                    truth: displayTarget == "hide" ? null : {data: prepareData(conData.targetData), dataType: conData.targetData.dataType},
                                                                                    predicted: {data: prepareData(conData.predictedData), dataType: conData.predictedData.dataType}}});
            missing-=batchSize;
        }

        postMessage({action: "resize", taskID: taskID});
        postMessage({action: "Finished", done: action, taskID: taskID});
    }

    /**
     * Digest the data from a date/log related structure into a presentation cache of necessary data information.   --- UPDATED (Dexter) 20180722
     * @param {Number} taskID - A unique identifier for the current task as matched with "worker.js"
     */
    consolidateData(taskID) {
        // Reinitialize the consolidated data.
        var oldConData = this.conData;

        // Get what final layer is displaying.
        var finalLayer = this.dataOptions.finalLayer;

        // To select the available data only.
        const builds = this.dataOptions.build;
        const runNo = this.dataOptions.runNo;
        const cvNo = this.dataOptions.cvNo;
        const allBuild = builds.length == 0;

        // Filter rules by runs and cross validations.
        var filterRules = [];

        // If there is runNo and cvNo restrictions, filter the runNo.
        if (runNo != -1) filterRules.push(["Run", [runNo]]);
        if (cvNo != -1) filterRules.push(["Cross Validation Step", [cvNo]]);
        else filterRules.push(["Cross Validation Step", ["-1"]]);

        // Prepare that an error boolean to check whether the collected CSV files are inconsistent.
        var inconsistentError = false;

        // The conData is an object.
        var conData = {};

        // Loop the data for consolidation.
        this.data.forEach((dateData,dateNo)=>{

            // Loop the build results for consolidation.
            const buildTables = dateData.get("traceLog");

            // Concatenate build information
            var newTable = [], tableCol = null;
            buildTables.forEach((table, buildNo)=>{
                // Only push data if current option is printing the matched build or all builds.
                if (table && (allBuild || builds.includes(buildNo))) {
                    // If there is no table columns recorded before, use this table's heading as the table columns.
                    if (!tableCol) tableCol = table[0];
                    
                    // Make sure all tables are with same columns, then push the filtered data into the new table. Otherwise, inconsistent error results.
                    if (table.every(row=>row.length == tableCol.length)) {
                        newTable.push(...TrainLog.applyFilter(table.slice(1), tableCol, filterRules));
                    } else {
                        inconsistentError = true;
                    }
                }
            });

            // Cache useful indexes.
            const taskNameIdx = tableCol.indexOf("Task Name"), taskTypeIdx  = tableCol.indexOf("Task Type"), globalStepIdx = tableCol.indexOf("Global Step"), 
                    dataTypeIdx = tableCol.indexOf("Data Type"), itemIDIdx = tableCol.indexOf("Item ID"),
                    dataIdx = tableCol.indexOf("Data"), runIdx = tableCol.indexOf("Run"), cvIdx = tableCol.indexOf("Cross Validation Step");

            // Get available runs and cross validations.
            var availableRuns = [...new Set(newTable.map(r=>Number(r[runIdx])))];
            var availableCVs = [...new Set(newTable.map(r=>Number(r[cvIdx])))];

            // Filter latest runs.
            if (runNo == -1) {
                const maxRun = Math.max(...availableRuns);
                newTable = newTable.filter(r=>Number(r[runIdx]) == maxRun);
            }
            
            // Get all the weight column names, and find the index of the current weight item.
            var allFinalLayers = [...new Set(newTable.map(r=>r[taskNameIdx]))].filter(fn=>fn!="");

            // If the there is no defined final layer, just use the first final layer.
            if (finalLayer == "auto") finalLayer = allFinalLayers[0];
            
            /** Get the suggested rounding digit of each column of a datatable. 
             * @param {Array[]} - The data table to get data.
             * @param {String} - The data type of this table.
             * @param {String|Number} - The round type for making the presentation.
            */
            function getRoundDigitCols(dataTable, dataType, roundType) {
                if (roundType == "auto") {
                    if (dataType == "Table") {
                        return dataTable[0].map((v,idx)=>{
                            if (dataTable.some(r=>isNaN(Number(r[idx])))) return null;
                            else {
                                var allData = dataTable.map(r=>Number(r[idx]));
                                return -TrainLog.findPlotScale(Math.min(...allData), Math.max(...allData)).digit+2;
                            }
                        });
                    } else if (dataType == "Value") {
                        if (dataTable.some(r=>isNaN(Number(r)))) return null; 
                        else {
                            var allData = dataTable.map(r=>Number(r));
                            return -TrainLog.findPlotScale(Math.min(...allData), Math.max(...allData)).digit+2;
                        }
                    }
                } else if (!!isNaN(Number(roundType))) {
                    if ((dataType == "Table" && (dataTable.some(r=>isNaN(Number(r[idx]))))) || (dataType == "Value" && (dataTable.some(r=>isNaN(Number(r)))))) return null;
                    else return Number(roundType);
                }
            }

            // Get the input data.
            var inputData = {};
            var inputTable = newTable.filter(r=>r[taskTypeIdx] == "Input" && r[globalStepIdx] == "0");
            const inputHeaderPre = inputTable.find(r=>r[itemIDIdx] == "-1");
            const inputCoreData = inputTable.filter(r=>r[itemIDIdx] != "-1");
            const inputDT = inputData.dataType = inputCoreData[0][dataTypeIdx];
            inputData.header = inputHeaderPre ? JSON.parse(inputHeaderPre[dataIdx]) : inputDT == "Table" ? JSON.parse(inputCoreData[0][dataIdx]).map((v,idx)=>idx) : [inputDT];
            inputData.data = inputCoreData.map(r=>JSON.parse(r[dataIdx]));
            inputData.roundCols = (inputDT == "Table" || inputDT == "Value") ? getRoundDigitCols(inputData.data, inputDT, this.dataOptions.round) : null;

            // Get the global step that the use requests, or use the latest step.
            const allSteps = [...new Set(newTable.map(ele=>Number(ele[globalStepIdx])))].sort((a,b)=>a>b?1:-1).filter(s=>s>0);
            const step = this.dataOptions.step == "auto" ? allSteps[allSteps.length-1] : this.dataOptions.step;

            // Get the target final layer predicted results.
            var predictedData = {};
            var predictedTable = newTable.filter(r=>r[taskNameIdx] == finalLayer && Number(r[globalStepIdx]) == step);
            
            // Set the record Count
            var recordCount = predictedTable.length;
            
            if (predictedTable.length) {
                const predictedCoreData = predictedTable.filter(r=>r[itemIDIdx] != "-1");
                predictedData.data = predictedCoreData.map(r=>JSON.parse(r[dataIdx]));
                predictedData.taskType = predictedCoreData.length ? predictedCoreData[0][taskTypeIdx] : "";

                // Get the target results.
                var targetData = {};
                var sourceID = predictedTable[0][tableCol.indexOf("Source ID")], colConfig = predictedTable[0][tableCol.indexOf("Source Config")];
                var targetTable = newTable.filter(r=>r[taskTypeIdx] == "Target" && r[tableCol.indexOf("Source ID")] == sourceID && r[tableCol.indexOf("Source Config")] == colConfig);
                const targetHeaderPre = targetTable.find(r=>r[itemIDIdx] == "-1");
                const targetCoreData = targetTable.filter(r=>r[itemIDIdx] != "-1");
                const targetDT = predictedData.dataType = targetData.dataType = targetCoreData[0][dataTypeIdx];
                targetData.header = targetHeaderPre ? JSON.parse(targetHeaderPre[dataIdx]) : targetDT == "Table" ? JSON.parse(targetCoreData[0][dataIdx]).map((v,idx)=>idx) : [targetDT];
                targetData.data = targetCoreData.map(r=>JSON.parse(r[dataIdx]));
                targetData.roundCols = (targetDT == "Table" || targetDT == "Value") ? getRoundDigitCols(targetData.data, targetDT, this.dataOptions.round) : null;
                predictedData.roundCols = (targetDT == "Table" || targetDT == "Value") ? getRoundDigitCols(predictedData.data, targetDT, this.dataOptions.round) : null;
            }

            // Set the consolidated data.
            conData = {hasData: recordCount > 0, inputData: inputData, predictedData: predictedData, targetData: targetData,
                            fullData: newTable, minStep: Math.min(...allSteps), maxStep: Math.max(...allSteps), atStep: step,
                            allSteps: allSteps, finalLayer: finalLayer, allFinalLayers: allFinalLayers, recordCount: recordCount, 
                            availableCVs: availableCVs, availableRuns: availableRuns };
                        
        });

        this.conData = conData;

        // Pass the consolidated data to the "worker.js".
        postMessage({action: "conData", data: this.conData, taskID: taskID});
    }
}

/**
 * Actions fired when a message is received.   --- UPDATED (Dexter) 20180722
 * @param {MessageEvent} e - A web worker message event
 * @param {String} e.data.action - The action to be taken
 * @param {String} e.data.type - The class of the Graph Item
 * @param {Object} e.data.data - Parameters for constructing a Graph Item object
 * @param {Number} e.data.taskID - A unique identifier for the current task as matched with "worker.js"
 */
function receiveMsg(e) {
    if (e.data.action == "updateGraph") {
        DashboardItem.assignFuntion(e.data.type,e.data.data, e.data.taskID);
    }
}

self.addEventListener("message", receiveMsg, false);