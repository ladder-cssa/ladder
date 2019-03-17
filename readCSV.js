/*
    **************************** ABOUT 有關本檔案             ****************************

        readCSV.js:

            This is the JavaScript Web Worker file for the functionality 
            of asynchronous parsing of CSV strings.
            這是 Ladder 網頁應用程式運作的 JavaScript Web Worker 檔案，包括
            擷取 CSV 字串的非同步執行功能。

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



/** Class defining CSV-related functions.   --- UPDATED 20180524 */
class CSV {
    /**
     * Read the string into a table (2D-array).   --- UPDATED 20190220
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

/**
 * Actions fired when a message is received.   --- UPDATED 20180524
 * @param {MessageEvent} e - A web worker message event
 * @param {String} e.data.str - The original string to be parsed as CSV
 * @param {String[]} e.data.del - Characters acts as the delimiters
 */
function receiveMsg(e) {
    try {
        self.postMessage({action: "ok", data: CSV.read(e.data.str, e.data.del)})
    } catch (e) {
        self.postMessage({action: "fail", error: e})
    }
}

self.addEventListener("message", receiveMsg, false);