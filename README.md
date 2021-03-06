# Ladder

An easy-to-use and professional tool for the public to build artificial neural network models for data mining.
給大眾輕易而專業的建立類神經網絡模型進行資料分析

Notes: Inline remarks are written in English as priority.<br/>
注意: 行內註解只以英文撰寫。


# About Ladder 有關 Ladder

  Creators 創作團隊: 

  Yin-Chung Leung, Kai-Hsiang Lin, Jui-Hung Chang <br>
  梁彥聰、林凱翔、張瑞紘

  @ Creative System and Software Applications Laboratory, National Cheng Kung Univerisity, Taiwan <br>
  @ 創新系統軟體應用實驗室 —— 台灣 國立成功大學

  Version 版本:

  1903.05

  Website & Docs 網站及文件庫:

  English:    http://cssa.cc.ncku.edu.tw/ladder/ <br>
  中文:       http://cssa.cc.ncku.edu.tw/ladder/?lang=zh_TW

  Production in TAIWAN | 台灣製作
        

# Updates 更新 (English Only 只提供英文版)
  
  1903.05   Jul-28, 2019 (Dexter)
  * Effective for NeuralSimplycode.py, script.js, index.html, style.css, lang.csv
  * <strong>New Version requires TensorFlow v1.14</strong>
  - [Feature] Deconvolutional Layer now utilizes Convolutional 2D 
    Transpose TensorFlow algorithm by default.
  - [Feature] Selecting "CPU" as training device in Ladder Web App 
    now disables discovery on any GPU in local devices. 
  - [Feature] Convolutional and deconvolutional layers can now 
    enable weight syncing in Ladder web app, which was only enabled
    in NeuralSimplycode previously.
  - [NOM] Convolutional dilation definition now follows with TensorFlow
    API. Old NOM (project) files will be automatically updated when
    reopening in current version of Ladder Web App.
  - [NOM] Version information is now included in the NOM object.
  - [UI] New page transition effect.
  - [Bug Fixed] Deconvolutional layers displayed incorrect shape 
    shown in Ladder Web App when using striding. 
    <strong>Thank you for reporting bugs!</strong>
  - [Bug Fixed] Using "crelu" activation function displayed incorrect
    shown in Ladder Web App.
    <strong>Thank you for reporting bugs!</strong>
  - [Bug Fixed] Output configuration using "Reshape" was buggy and 
    could not input for a correct shape; it might also not executable
    in NeuralSimplycode.
  - [Bug Fixed] Incoming configuration in Ladder Web App had default
    axis as 1 instead of -1 as defined in NOM.
  - [Bug Fixed] Fully Connected Layer was storing incorrect layer
    type value internally in Ladder Web App.
  - [Bug Fixed] Task layers like regressors could not enable
    layer attaching from context menu buttons in Ladder Web App.
  - [Bug Fixed] CIFAR-10 dataset was not able to read correctly.
  - Other miscelleneous updates, including variables naming
    to be better following NOM definitions.
  
  1903.04   Jul-12, 2019 (Dexter)
  * Effective for NeuralSimplycode.py, script.js, index.html, style.css, lang.csv
  - [UI] Overall updates for a cleaner user interface.
  - [Bug Fixed] [Web App Logic] Using GPU could not be switched back 
    to using CPU in most of the scenarios.
  - [Bug Fixed] [Web App Logic] Incorrect tensor shape calculation
    was made for cases with strides and keeping same dimensions on
    convolutional and deconvolutional layers. 
    <strong>Thank you for reporting bugs!</strong>
  - Other miscelleneous updates.

  1903.03   Apr-08, 2019 (Dexter)
  * Effective for NeuralSimplycode.py, script.js, index.html, style.css, lang.csv
  - [Bug Fixed] [UI] Updates on some icons which may not be 
    displayed correctly for error tooltips.
  - [Bug Fixed] [Data Preprocessing] Transformation and circular data
    definition may have conflicts on one-hot encoding columns. The
    issue affected both UI and Python training programme.

  1903.02   Apr-04, 2019 (Dexter)
  * Effective for NeuralSimplycode.py, script.js, index.html, lang.csv
  - [Bug Fixed - User Reports] [Cross Validation] Updates bugs 
    on the scenario of K-fold cross validation with data shuffling. 
    Thank you for reporting bugs!
  - [Bug Fixed] [UI] Updates on some icons which may not be 
    displayed correctly.
  
  1903.01   Mar-20, 2019 (Dexter)
  * Effective for NeuralSimplycode.py, script.js, lang.csv
  - [UI] New Ladder UI control for preventing users using string
    values as model inputs for numerical processing.
  - [DataPreprocessing > Transformation] Updates on algorithm of 
    Normalization (feature scaling) relative to zero, supporting 
    negatively ranged data.


# How to Contribute 如何貢獻

  Public contribution is not available at the moment, due to some core
  changes to be released in the upcoming months. We will also refine
  inline documentation and data structure in the meantime.
  This is our first open-source project. We are sorry if there have
  been any inconvenience or quality inadequacy. Please feel free to 
  give us feedback, bug reports or feature suggestions at 
  ladder.cssa@gmail.com .
  
  基於未來數月尚有大型改變，公開的編輯暫不開放。我們同時會在這段時間調整內行
  註解和資料結構。
  這是我們首個開源項目，若是當中有任何不便或品質不良的狀況，我們深表抱歉。不過，
  我們歡迎您提供我們意見、漏洞修正或功能性建議，請電郵至 ladder.cssa@gmail.com 。


# COPYRIGHT NOTES 版權資訊

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


# CREATORS 創作團隊

## Developers  開發人員:

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

## Acceptance Tests 驗收測試:

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


# PROJECT LEADER 項目領導

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
