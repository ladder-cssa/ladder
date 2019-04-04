'''
    **************************** ABOUT 有關本檔案             ****************************

        NeuralSimplycode.py:

            This is a simple and small Python library for building
            high-level neural network models, using TensorFlow as
            backend engine to train the model.
            這是一個簡單、小型的 Python 資源庫，提供高階方便使用的類神經
            網絡建構方式，以TensorFlow為運算引擎訓練類神經網絡模型。

        Creators 創作團隊: 

            Yin-Chung Leung, Kai-Hsiang Lin, Jui-Hung Chang
            梁彥聰、林凱翔、張瑞紘

            @ Creative System and Software Applications Laboratory, National Cheng Kung Univerisity, Taiwan
            @ 創新系統軟體應用實驗室 —— 台灣 國立成功大學

        Version 版本:

            1903.02

        Website & Docs 網站及文件庫:
        
            English:    http://cssa.cc.ncku.edu.tw/ladder/NeuralSimplycode/
            中文:       http://cssa.cc.ncku.edu.tw/ladder/NeuralSimplycode/?lang=zh_TW

        Production in TAIWAN | 台灣製作
        

    **************************** COPYRIGHT NOTES 版權資訊     ****************************

        Copyright © 2019 Creative System and Software Applications Laboratory

        This program is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with this program.  If not, see <https://www.gnu.org/licenses/>.

        本程式為自由軟體，在自由軟體聯盟發佈的GNU通用公共授權合約的約束下，你可以對其
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
        

'''
import collections
import tensorflow as tf
import csv
import struct
import math
from datetime import datetime
import os
import numpy as np
import functools
import random
from sklearn.metrics.cluster import normalized_mutual_info_score
import json
import sys
import re
from enum import Enum
from typing import Any, Type, List, Dict, Set, Tuple, Union, Callable, Iterable, Optional

nowPath = sys.argv[0]
nowPathLength = len(nowPath)
actualPath = nowPath[0:(max(nowPath.rfind('/'),0) or nowPathLength)][0:(max(nowPath.rfind('\\'),0) or 0)]
if (len(actualPath)): os.chdir(actualPath)

random.seed()



class CSVLogger():
    '''
			
        Class representing a helper for creating logs as a CSV file. This is often used in tracking the training steps.   --- UPDATED (Dexter) 20180615
    '''

    def __init__(self, location: str, fileName: str, header: List[str]=None):
        '''
			Creates a CSV logger.   --- UPDATED (Dexter) 20180615
            
            Parameters
            ------------------------------

            location    `str`           - The directory where the CSV file to be saved.

            fileName    `str`           - The name of the training where the logging takes place.

            header      `list[str]`     - The header column names in a 'list' format.
        '''
        # Ensure the data type of the parameters.
        location = str(location); fileName = str(fileName); 
        header = list(header) if header is not None else None

        # Create a new folder if needed.
        if not os.path.isdir(location):
            tf.gfile.MakeDirs(location)

        # Stores the attribute values.
        self._filename = filename = location + fileName+".csv"
        self._header = header
        self._logTable = []

        # Initiate a file if it's a new file.
        if (not os.path.isfile(filename)):
            with open(filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
                toWriter = csv.writer(csvfile)
                if (header):
                    toWriter.writerow(header)
    
    def __len__(self) -> int:
        '''
			Alias for `self.length`.
        '''
        return self.length
    
    @property
    def length(self) -> int:
        '''
			Get the length (row count) of the current log table.   --- UPDATED (Dexter) 20180615

            Returns
            ------------------------------

            `int`   - The length of `self._logTable`.
        '''
        return len(self._logTable)
    
    @property
    def size(self) -> int:
        '''
			Get the size (column count) of this log table.   --- UPDATED (Dexter) 20180615

            Returns
            ------------------------------

            `int`   - The length of the first column of `self._logTable`, assuming all records in the log table are the same in column count.
        '''
        return 0 if self.length == 0 else len(self._logTable[0])

    def __repr__(self) -> str:
        '''
			Get a string representation of this log table.   --- UPDATED (Dexter) 20180615

            Returns
            ------------------------------

            `str`   - The representation including the row and column count.
        '''
        return "<CSV Logger: " + self.length + " rows, " + self.size + " columns>"

    def __bool__(self) -> bool:
        '''
			Get a boolean value of this log table.   --- UPDATED (Dexter) 20180615

            Returns
            ------------------------------

            `bool`  - True if there has any rows of data.
        '''
        return self.length > 0

    def log(self, *rows: List[Any]):
        '''
			Append rows in the log table.   --- UPDATED (Dexter) 20180615

            Parameters
            ------------------------------

            *rows   `list[*]+`       - Arbitrary count of a data row.
        '''
        for r in rows:
            self._logTable.append([*r])
    
    def push(self, *rows: List[Any]):
        '''
			Alias for `self.log()`
        '''
        self.log(*rows)
    
    def append(self, *rows: List[Any]):
        '''
			Alias for `self.log()`
        '''
        self.log(*rows)
        
    def flush(self):
        '''
			Save this log table, and clear all temporarily logged rows.   --- UPDATED (Dexter) 20180615
        '''
        if (len(self._logTable)):
            with open(self._filename, 'a', newline='', encoding='utf-8-sig') as csvfile:
                toWriter = csv.writer(csvfile)

                # Write the rows into CSV file.
                for row in self._logTable:
                    toWriter.writerow([str(ele) for ele in row])

                # Clear the existing log array.
                self._logTable = []
    
    def logAndSave(self, *rows: List[Any]):
        '''
			Append new rows, then save the log table and clear all temporarily logged rows.   --- UPDATED (Dexter) 20180716

            Parameters
            ------------------------------

            *rows   `list[*]+`       - Arbitrary count of data row.
        '''
        self.log(*rows)
        self.flush()

class TimeHelper():
    '''
			Class of functions assisting time-related operations.   --- UPDATED (Dexter) 20180615
    '''

    @staticmethod
    def getDateStr(nowDate: 'datetime.datetime' = datetime.now(), expression: str = "mmdd", delimiter: str = "") -> str:
        '''
			Stringify a datetime object for the date component.   --- UPDATED (Dexter) 20180615

            Parameters
            ------------------------------

            nowDate     `datetime.datetime`     - The datetime object to be stringified.
            
            expression  `str`                   - The string format.

            delimiter   `str`                   - The delimiter between each sub-components.

            Returns
            ------------------------------

            `str`   - The date string.
        '''
        if (expression == "mmdd"):
            return '{:%m{delim}%d}'.format(nowDate, delim=delimiter)
        elif (expression == "yyyymmdd"):
            return '{:%Y{delim}%m{delim}%d}'.format(nowDate, delim=delimiter)
        elif (expression == "yymmdd"):
            return '{:%y{delim}%m{delim}%d}'.format(nowDate, delim=delimiter)
    
    @staticmethod
    def getTimeStr(nowDate: 'datetime.datetime' = datetime.now(), expression: str = "hhmm", delimiter: str = "") -> str:
        '''
			Stringify a datetime object for the time component.   --- UPDATED (Dexter) 20190119

            Parameters
            ------------------------------

            nowDate     `datetime.datetime`     - The datetime object to be stringified.
            
            expression  `str`                   - The string format.

            delimiter   `str`                   - The delimiter between each sub-components.

            Returns
            ------------------------------

            `str`   - The time string.
        '''
        if (expression == "mmss"):
            return '{:%M{delim}%S}'.format(nowDate, delim=delimiter)
        elif (expression == "hhmm"):
            return '{:%H{delim}%M}'.format(nowDate, delim=delimiter)
        elif (expression == "hhmmss"):
            return '{:%H{delim}%M{delim}%S}'.format(nowDate, delim=delimiter)
        elif (expression == "mmsstttttt"):
            return '{:%M{delim}%S{delim}%f}'.format(nowDate, delim=delimiter)
        elif (expression == "tttttt"):
            return '{:%f}'.format(nowDate, delim=delimiter)
    
    @staticmethod
    def getDateTimeStr(nowDate: 'datetime.datetime' = datetime.now(), dateExpr: str = "mmdd", timeExpr: str = "hhmm", dateDelimiter: str = "", timeDelimiter: str = "", dateTimeDelimiter: str = " ") -> str:
        '''
			Stringify a datetime object for the time component.   --- UPDATED (Dexter) 20180615

            Parameters
            ------------------------------

            nowDate     `datetime.datetime`     - The datetime object to be stringified.
            
            dateExpr            `str`           - The string format for the date component.

            timeExpr            `str`           - The string format for the time component.

            dateDelimiter       `str`           - The delimiter between each sub-components for the date component.

            timeDelimiter       `str`           - The delimiter between each sub-components for the time component.

            dateTimeDelimiter   `str`           - The delimiter between the date and time components.

            Returns
            ------------------------------

            `str`   - The datetime string.
        '''
        return TimeHelper.getDateStr(nowDate, dateExpr, dateDelimiter) + dateTimeDelimiter + TimeHelper.getTimeStr(nowDate, timeExpr, timeDelimiter)

    class Recorder():
        '''
			Class representing a time recorder.   --- UPDATED (Dexter) 20180615
        '''
        def __init__(self):
            '''
			Create a recorder.   --- UPDATED (Dexter) 20180615
            '''
            # Set the initial and current time as now.
            self._now = self._initial = datetime.now()
        
        def log(self) -> float:
            '''
			Log a time, checking the different between initial time.   --- UPDATED (Dexter) 20180615

                Returns
                ------------------------------

                `float` - The number of seconds, in micro-second accuracy in most cases, between the current time and the initial time.
            '''
            self._now = nowTime = datetime.now()
            return (nowTime - self._initial).total_seconds()
        
        def logAndRestart(self) -> float:
            '''
			Log a time, checking the different between initial time and restarting the initial time.   --- UPDATED (Dexter) 20180615

                Returns
                ------------------------------

                `float` - The number of seconds, in micro-second accuracy in most cases, between the current time and the initial time.
            '''
            oriTime = self._initial
            self._now = self._initial = nowTime = datetime.now()
            return (nowTime - oriTime).total_seconds()

        @property
        def now(self) -> 'datetime.datetime':
            '''
			Get the latest recorded time.   --- UPDATED (Dexter) 20180615

                Returns
                ------------------------------

                `datetime.datetime` - The previous time at which this recorder has logged.
            '''
            return self._now
        
        @property
        def initial(self) -> 'datetime.datetime':
            '''
			Get the initial time.   --- UPDATED (Dexter) 20180615

                Returns
                ------------------------------

                `datetime.datetime` - The initial time at which this recorder has started.
            '''
            return self._initial

def classof(obj: Any) -> str:
    '''
			Get the class name of a certain object.   --- UPDATED (Dexter) 20180615

        Parameters
        ------------------------------

        obj     `*`     - Any objects.

        Returns
        ------------------------------

        `str` - The class name of the given object.
    '''
    return obj.__class__.__name__

def escapeNaN(obj: Any) -> Any:
    '''
        Escape NaN to a string NaN for universal JSON parsing.   --- --- UPDATED (Dexter) 20190209

        Parameters
        ------------------------------

        obj     `*`     - Any objects.

        Returns
        ------------------------------

        `*` - The original object, or `"NaN"` string if it's NaN.
    '''
    return "NaN" if (obj is np.nan or obj != obj) else obj

def escapeNaNList(listObj: List[Any]) -> List[Any]:
    '''
        Escape NaN to a string NaN for universal JSON parsing in a list.   --- --- UPDATED (Dexter) 20190209

        Parameters
        ------------------------------

        obj     `*`     - Any objects.

        Returns
        ------------------------------

        `*` - The original object, or elements replacing with a `"NaN"` string if it's NaN.
    '''
    return [("NaN" if (obj is np.nan or obj != obj) else obj) for obj in listObj]

def escapeNaNNPAry(nparray: Any) -> Any:
    '''
        Escape NaN to a string NaN for universal JSON parsing in a numpy array.   --- --- UPDATED (Dexter) 20190209

        Parameters
        ------------------------------

        nparray     `np.ndarray`     - A numpy array of any type.

        Returns
        ------------------------------

        `np.ndarray` - The original object, or elements replacing with a `"NaN"` string if it's NaN.
    '''
    return np.where(np.isnan(nparray), None, nparray) if np.issubdtype(nparray.dtype, np.float) else nparray

class IndexRange:
    '''
			Class of methods handling index range strings.   --- UPDATED (Dexter) 20181210
    '''
    @staticmethod
    def parse(selectionLength: int, rangeStr: str, repeatable: bool = False) -> 'list[int]':
        '''
			Parse an index range string into a list of selected indices.   --- UPDATED (Dexter) 20181210

            Parameters
            ------------------------------

            selectionLength     `int`   - The total seleection length.

            rangeStr            `str`   - A range string, validated before submission.

            repeatable          `bool`  - Whether selection can be repeatably selected.

            Returns
            ------------------------------

            `list[int]` - A list of indices to be selected.
        '''
        if not IndexRange.validate(selectionLength, rangeStr):
            raise ValueError("Index range string is not valid.")

        if (rangeStr.startswith("[") and rangeStr.endswith("]")):
            allIdx = [((selectionLength + n) if n < 0 else n) for n in [int(string.strip()) for string in rangeStr[1:-1].split(",")] if n < selectionLength and n >= -selectionLength]
            return allIdx if repeatable else [*(set(allIdx))]
        elif (":" in rangeStr):
            rangeSel = [string.strip() for string in rangeStr.split(":")]
            if (rangeSel[0] == "None" or rangeSel[0] == ""):
                rangeSel[0] = 0
            if (rangeSel[1] == "None" or rangeSel[1] == ""):
                rangeSel[1] = selectionLength
            rangeSel = [min(max(((selectionLength + n) if n < 0 else n), 0), selectionLength) for n in [int(n) for n in rangeSel]]
            nums = []
            for i in range(rangeSel[0], rangeSel[1]):
                nums.append(i)
            return nums
        else:
            allIdx = [((selectionLength + n) if n < 0 else n) for n in [int(string.strip()) for string in rangeStr.split(",")] if n < selectionLength and n >= -selectionLength]
            return allIdx if repeatable else [*(set(allIdx))]
    
    @staticmethod
    def validate(selectionLength, rangeStr):
        '''
			Validate whether a range string is syntatically correct.   --- UPDATED (Dexter) 20181210

            Parameters
            ------------------------------

            selectionLength     `int`   - The total seleection length.

            rangeStr            `str`   - A range string, validated before submission.

            Returns
            ------------------------------

            `bool`              - Whether the range string is correct.
        '''
        if (rangeStr.startswith("[") and rangeStr.endswith("]")):
            nums = [string.strip() for string in rangeStr[1:-1].split(",")]
            return all([re.match("[0-9\-]+", num) for num in nums]) and all([(n < selectionLength and n >= - selectionLength) for n in [int(n) for n in nums]])
        elif (":" in rangeStr):
            nums = [string.strip() for string in rangeStr.split(":")]
            return len(nums) == 2 and all([(num == "" or num == "None" or re.match("[0-9\-]+", num)) for num in nums])
        else:
            nums = [string.strip() for string in rangeStr.split(",")]
            return all([re.match("[0-9\-]+", num) for num in nums]) and all([(n < selectionLength and n >= - selectionLength) for n in [int(n) for n in nums]])

class TrainSourceTensor:
    '''
			 Class representing an object containing the placeholder tensors that the training source generates.   --- UPDATED (Dexter) 20180622
    '''
    def __init__(self,**kwargs):
        '''
			Create a TrainSourceTensor.   --- UPDATED (Dexter) 20180622
        '''
        self._tensors = {**kwargs}
    
    def __getitem__(self, key) -> 'tf.Tensor':
        '''
			Get a tensor using a key.   --- UPDATED (Dexter) 20180622

            Parameters
            ------------------------------

            key     `str`   - Key of the source tensor.

            Returns
            ------------------------------

            `tf.Tensor`     - The requested input source tensor.
        '''
        return self._tensors[key]
    
    def __iter__(self) -> Iterable[str]:
        '''
			Create an iterable object on the source tensor keys.   --- UPDATED (Dexter) 20180622
            
            Returns
            ------------------------------

            `iterable[str]`     - Iterable keys of the source tensors.
        '''
        return self._tensors.__iter__()
    
    def items(self) -> Iterable[Tuple[str, 'tf.Tensor']]:
        '''
			Create an iterable object on the source tensor keys and values.   --- UPDATED (Dexter) 20180622
            
            Returns
            ------------------------------

            `iterable[str,tf.Tensor]`     - Iterable keys of the source tensor keys and values.
        '''
        return self._tensors.items()
    
    def keys(self) -> Iterable[str]:
        '''
			Create an iterable object on the source tensor keys.   --- UPDATED (Dexter) 20180622
            
            Returns
            ------------------------------

            `iterable[str]`     - Iterable keys of the source tensors.
        '''
        return self._tensors.keys()

class __DataTransformationConfig__:
    '''
        Class representing a transformation configuration on data preprocessing.   --- UPDATED (Dexter) 20190201
    '''
    def __init__(self, instanceClass: 'DataPreprocessing.Transformation.InstanceClassEnum', method: Enum):
        '''
            Create a configruation for data transformation in data preprocessing.   --- UPDATED (Dexter) 20190130

            Parameters
            ------------------------------

            instanceClass       `DataPreprocessing.Transformation.InstanceClassEnum`    - The instance class, as defined in @DataPreprocessing.Transformation.InstanceClassEnum .

            method              `Enum`      - The method type of transformation.
        '''
        self._instanceClass = instanceClass
        self._method = method
    
    @property
    def instanceClass(self) -> 'DataPreprocessing.Transformation.InstanceClassEnum':
        '''
            The enumeration for the instance class of this @DataPreprocessing.Transformation.Config node.   --- UPDATED (Dexter) 20190131

            Returns
            ------------------------------

            `DataPreprocessing.Transformation.InstanceClassEnum`    - The enumeration for the instance class of this @DataPreprocessing.Transformation.Config node.
        '''
        return self._instanceClass
    
    @property
    def method(self) -> 'Enum':
        '''
            The enumeration for the transformation method type of this @DataPreprocessing.Transformation.Confign node.   --- UPDATED (Dexter) 20190131

            Returns
            ------------------------------

            `Enum`   - The enumeration for the transformation method type of this @DataPreprocessing.Transformation.Confign node.
        '''
        return self._method

    def parseJSON(self, obj: Dict[str, Any]):
        '''
                Parse a previously saved object into this @DataPreprocessing.Transformation.Config object.   --- UPDATED (Dexter) 20190131

                Parameters
                ------------------------------

                obj    `dict<str,*>`
        '''
        # All values will be parsed directly,except the class identification, which has been set in the constructor.
        for k in obj.keys():
            if (k not in ["_instanceClass", "_method"]):
                setattr(self, k, obj[k])


class __ColumnsTransformationConfig__(__DataTransformationConfig__):
    '''
        Sub-class representing a transformation configuration on columns preprocessing for @TableSource objects.   --- RESERVED --- UPDATED (Dexter) 20190130
    '''
    def __init__(self, method: 'DataPreprocessing.Transformation.Columns.Types'):
        super().__init__(DataPreprocessing.Transformation.InstanceClassEnum.Columns, method)

class __ImageTransformationConfig__(__DataTransformationConfig__):
    '''
        Sub-class representing an image transformation configuration on columns preprocessing for @ImageSource objects.   --- UPDATED (Dexter) 20190131
    '''
    def __init__(self, method: 'DataPreprocessing.Transformation.Image.Types'):
        super().__init__(DataPreprocessing.Transformation.InstanceClassEnum.Image, method)

class __ImageTransformationConfigCrop__(__ImageTransformationConfig__):
    '''
        Sub-class representing an image transformation configuration for random cropping the size.   --- UPDATED (Dexter) 20190131
    '''
    def __init__(self, width: int, height: int):
        '''
            Create an image transformation configuration for random cropping the size.   --- UPDATED (Dexter) 20190131

            Parameters
            ------------------------------

            width   `int`   - The cropped width in pixel.

            height  `int    `- The cropped height in pixel.
        '''
        super().__init__(DataPreprocessing.Transformation.Image.Types.Crop)
        self.width = width
        self.height = height


class DataPreprocessing:
    '''
        Class including types of preprocessing nodes and related preprocessing utilities.   --- UPDATED (Dexter) 20190201
    '''
    class InstanceClassEnum(Enum):
        # Abstract class representing a data preprocessing node on a data source (@TrainSource object).
        Node = 0

        # Class representing a column configuration, i.e. preprocessing node of on a table-like source (like @TableSource object).
        ColumnsNode = 1

        # Class representing a column configuration, i.e. preprocessing node of on a image-like source (like @ImageSource object).
        ImageNode = 2
    
    @staticmethod
    def parseJSON(obj: Dict[str, Any]) -> 'Node':
        ''' 
            Parse a previously saved object into a new @DataPreprocessing.Node object. This will auto-determine the sub-class of the object, and pass the JSON object to the inner method to continue to parse.   --- UPDATED (Dexter) 20190131

            Parameters
            ------------------------------

            obj   `dict<str,*>`      - JSON object from Project file.

            Returns
            ------------------------------

            - A @DataPreprocessing.Node object.
        '''
        # Parse this DataPreprocessing.Node object.
        dataPreprocessingNode = getattr(__class__,__class__.InstanceClassEnum[obj._instanceClass].name)
        dataPreprocessingNode.parseJSON(obj)
        return dataPreprocessingNode

    class Node:
        ''' 
            Class representing a data preprocessing node on a data source (@TrainSource object).   --- UPDATED (Dexter) 20190129
        '''
        def __init__(self, instanceClass: 'DataPreProcessing.InstanceClassEnum' = None, 
                    source: str = None, dtype: 'tf.DType' = None, defaultHeader: str = None):
            ''' 
                Creates a column configuration.   --- UPDATED (Dexter) 20190129

                Parameters
                ------------------------------

                instanceClass       `DataPreProcessing.InstanceClassEnum`   - The instnace class, as defined in @DataPreprocessing.InstanceClassEnum .

                source              `str`       - The source of this @DataPreprocessing.Node, e.g. `null` if this is the root source; another key of @DataPreprocessing.Node if it's referencing to another.

                dtype               'tf.DType'  - The data type of the data output. If `null`, it will be automatically determined during data pre-processing, and converted to `tf.float32` if it's using as an input of data model.

                defaultHeader      `str`       - A list of strings specifying the default header names of the data.
            '''
            # `DataPreProcessing.InstanceClassEnum` -The instnace class, as defined in @DataPreprocessing.InstanceClassEnum .
            self._instanceClass = instanceClass
            # `str` - The source of this @DataPreprocessing.Node, e.g. `null` if this is the root source; another key of @DataPreprocessing.Node if it's referencing to another.
            self.source = source
            # `tf.DType` - The data type of the data output.
            self.dtype = dtype
            # `int` - The topological order of this @DataPreprocessing.Node in data preprocessing.
            self._order = 0
            # `list<int>` - The shape of each item of the data output, so the batch dimension is not included.
            self._shape = None
            # `list<str>` - A list of strings specifying the default header names of the data.
            self.defaultHeader = defaultHeader
            # `list<DataPreprocessing.Transformation.Config>` - An array of transformation info.
            self.transformations = []

            # `list<int>` The receiving data shape from previous node.
            self._dataShape = None
            # `TrainSource` - The @TrainSource where this @DataPreprocessing.ColumnsNode object is attached to.
            self._trainSource = None
            # `str` - The column config key of this @DataPreprocessing.ColumnsNode object.
            self._key = None

        def parseJSON(self, obj: Dict[str, Any]):
            '''
                Parse a previously saved object into this @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190201

                Parameters
                ------------------------------

                obj     `dict<str, *>`   - JSON object.
            '''
            # All values will be parsed directly except those of specific data structure.
            for k in obj.keys():
                if (k not in ["transformations", "dtype"]):
                    setattr(self, k, getattr(obj, k))
                elif (k == "transformations"):
                    # If there is .instanceClass property, use DataPreprocessing.Transformation to parse; otherwise, it's a legacy normal object.
                    setattr(self, k, [DataPreprocessing.Transformation.parseJSON(tx) for tx in getattr(obj, k)])
                elif (k == "dtype"):
                    value = obj.dtype
                    if (value is not None):
                        self.dtype = TrainSource.getDataType(value)
                    else:
                        self.dtype = None 

        @property
        def order(self) -> int:
            '''
                The topological order of this @DataPreprocessing.Node data preprocessing.   --- UPDATED (Dexter) 20190201

                Returns
                ------------------------------
                
                `int`   - The topological order of this @DataPreprocessing.Node data preprocessing.
            '''
            return self._order

        @property
        def trainSource(self) -> 'TrainSource':
            '''
                The @TrainSource where this @DataPreprocessing.Node object is attached to.   --- UPDATED (Dexter) 20190201

                Returns
                ------------------------------

                `TrainSource`  - The @TrainSource where this @DataPreprocessing.Node object is attached to.
            '''
            return self._trainSource

        @property
        def key(self) -> str:
            ''' 
                The column config key of this @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190201

                Returns
                ------------------------------

                `str`  - The column config key of this @DataPreprocessing.Node object.
            '''
            return self._key

        @property
        def dataShape(self) -> List[int]:
            ''' 
                The receiving data shape from referencing @DataPreprocessing.Node node or root source of @TrainSource object.   --- UPDATED (Dexter) 20190201

                Returns
                ------------------------------

                `list<int>`  - The receiving data shape from referencing @DataPreprocessing.Node node or root source of @TrainSource object.
            '''
            return self._dataShape
        
        @property
        def itemShape(self):
            ''' 
                The output item shape of this @DataPreprocessing.Node node.   --- UPDATED (Dexter) 20190201

                Returns
                ------------------------------

                `list<int>`  - The output item shape of this @DataPreprocessing.Node node.
            '''
            return self._shape

        @property
        def instanceClass(self):
            ''' 
                The instance class of this @DataPreprocessing.Node node, as defined in @DataPreprocessing.InstanceClassEnum.   --- UPDATED (Dexter) 20190201

                Returns
                ------------------------------

                `str`  - The instance class of this @DataPreprocessing.Node node, as defined in @DataPreprocessing.InstanceClassEnum.
            '''
            return self._instanceClass
        
        def attachToSource(self, trainSource: 'TrainSource', dppKey: str):
            '''
                Attach this @DataPreprocessing.Node object to a @TrainSource object.   --- UPDATED (Dexter) 20190130

                Parameters
                ------------------------------

                trainSource     `TrainSource`   - The @TrainSource object to attach to.

                dppKey          `str`           - The column key to identify this @DataPreprocessing.Node object.
            '''
            self._trainSource = trainSource
            self._key = dppKey

            self.refreshDataShape()
        
        def copy(self, node: 'DataPreprocessing.Node'):
            '''
                Copy the configuration of this @DataPreprocessing.Node object to another @DataPreprocessing.Node object   --- UPDATED (Dexter) 20190203

                Parameters
                ------------------------------

                node        `DataPreprocessing.Node`    - Another @DataPreprocessing.Node object.
            '''
            node.dtype = self.dtype
            node.defaultHeader = self.defaultHeader
            node.transformations = [tx.copy() for tx in self.transformations]
            node.setInputShape(self.dataShape)
            node.source = self.source
            node.updateOrder()
        
        def updateOrder(self):
            '''
                Update the topological order of the data preprocessing node.   --- UPDATED (Dexter) 20190203
            '''
            if (self.source == 0 or self.trainSource is None):
                self._order = 0
            else:
                self._order = self.trainSource.colConfigs[self.source].order + 1

        def getShape(self, refresh: bool = True) -> List[int]:
            '''
                Get the shape of the output of this @DataPreprocessing.Node object, including the batch dimension.   --- UPDATED (Dexter) 20190130

                Parameters
                ------------------------------

                refresh     `bool`      -Whether to refresh the shape from root data.

                Returns
                ------------------------------

                `list<int>` - The shape of the output of this @DataPreprocessing.Node object. This returns a new list instance instead a pointer to the original shape.
            '''
            # If refresh is needed, compute the new shapes from the source of this DataPreprocessing.Node object.
            if (refresh):
                self.refreshDataShape()
            
            # The batch dimension is always None for flexible training, conresponding to the placeholder Tensor in NeuralSimplycode
            if (self._shape is None):
                self.refreshItemShape()
            
            return [None, *self._shape]
        
        def getInputShape(self, refresh: bool = False) -> List[int]:
            '''
                Get the shape of the input of this @DataPreprocessing.Node object, including the batch dimension.   --- UPDATED (Dexter) 20190130

                Parameters
                ------------------------------

                refresh     `bool`      -Whether to refresh the shape from root data.

                Returns
                ------------------------------

                `list<int>` - The shape of the input of this @DataPreprocessing.ColumnsNode object. This returns a new list instance instead a pointer to the original shape.
            '''
            # If refresh is needed, compute the new shapes from the source of this DataPreprocessing.Node object.
            if (refresh):
                self.refreshDataShape()
            
            # The batch dimension is always None for flexible training, conresponding to the placeholder Tensor in NeuralSimplycode
            return [*self._dataShape]
        
        def setItemShape(self, shape: List[int]):
            '''
                Set the shape of the output of this @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190128

                Parameters
                ------------------------------

                shape   `list<int>` -  The new item shape of the output of this @DataPreprocessing.Node object.
            '''
            self._shape = [*shape]
        
        def setInputShape(self, shape: List[int]):
            '''
                Set the input shape of the output of this @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190130

                Parameters
                ------------------------------

                shape   `list<int>`  - The new shape of the output of this @DataPreprocessing.Node object.
            '''
            self._dataShape = [*shape]
            self.refreshItemShape()
        
        def refreshItemShape(self):
            '''
                Refresh the item shape, typically after updates of datashape.   --- UPDATED (Dexter) 20190130
            '''
            self.setItemShape(self.dataShape[1:])
        
        def refreshDataShape(self):
            '''
                Refresh the shape of this @DataPreprocessing.Node object, based on updates of previous preprocessing shapes.   --- UPDATED (Dexter) 20190130
            '''
            if (self.trainSource is not None):
                self.setInputShape(self.trainSource.getColShape(self.source, self.key, True))

        def getIDAndKey(self) -> Tuple[int, str]:
            '''
                Get the source ID and column config key.   --- UPDATED (Dexter) 20190201

                Returns
                ------------------------------

                `tuple<int, str>`       - A tuple pair of source ID and colum config key.
            '''
            # Ensure the train source is already attached to a training model.
            if (self.trainSource.train is None):
                raise ValueError("The train source is not specified in any training models.")
            
            return (self.trainSource.train.sources.index(self.trainSource), self._key)
        
        def asType(self, dtype: 'tf.DType' = tf.float32):
            '''
                Enforce a data type conversion when getting the output of this column config.   --- UPDATED (Dexter) 20190128

                Parameters
                ------------------------------

                dtype       `tf.DType`          - The TensorFlow data type of this source column config.
            '''
            self.dtype = dtype

    class ColumnsNode(Node):
        '''
                Class representing a data column configuration, typically specifying details on a data source.   --- UPDATED (Dexter) 20180622
        '''
        def __init__(self, source: str = None, sourceCol: str = "None:None", dtype: 'tf.DType' = None, order: int = 0):
            '''
                Create a configuration of a data column.   --- UPDATED (Dexter) 20190128

                Parameters
                ------------------------------

                source      `str`               - The source column config of where this config comes from.

                sourceCol   `str`               - An @IndexRange parsable string specifying the column selection from the source.

                dtype       `tf.DType`          - The TensorFlow data type of this source column config. If `None`, it will be automatically determined during data pre-processing, and converted to `tf.float32` if it's using as an input of data model.

                order       `int`               - Feedforward (Topological) order of aligning all @ConConfig in a data source.
            '''
            super().__init__(DataPreprocessing.InstanceClassEnum.ColumnsNode, source, dtype)
            # `str` - The data type of the data output.
            self.dtype = dtype
            # `str` - The source of this @DataPreprocessing.ColumnsNode, e.g. `None` if this is the root source; another key of @DataPreprocessing.ColumnsNode if it's referencing to another.
            self.source = source
            # `str` - An @IndexRange parsable string specifying the column selection from the source.
            self.sourceCol = sourceCol
            # `dict<int,Callable<<list<float|int>>,list<float|int>>>` - A data transformation `dict` object, using column index as key and column data transformation function as value.
            self.transformTo = {}
            # `dict<int,Callable<<list<float|int>>,list<float|int>>>` - A reversed data transformation `dict` object, using column index as key and column data transformation function as value.
            self.transformFrom = {}
            # `dict<int,dict>` - A circlar info `Map` object, using column index as key and circular data definition as value.
            self.circularInfo = {}
            # `dict<int,set<str>>` - The column selections on which columns to convert to one hot encoding.
            self.oneHotColumns = {}
            # `list<dict>` - The transformation definition information in action order.
            self.transformations = []
            # `list<dict>` - The cicular definition information in action order.
            self.circular = []
            # `int` - The topological order of this @DataPreprocessing.ColumnsNode in data preprocessing.
            self._order = order

        def parseJSON(self, obj: Dict[str, Any]):
            '''
                Parse a previously saved object into this @ColConfig object.   --- UPDATED (Dexter) 20190129

                Parameters
                ------------------------------

                obj     `dict{str, *}`      - @ColConfig -like object in NOM object
            '''
            for key,value in obj.items():
                if (key not in ["transformations","oneHotColumns", "dtype", "_instanceClass"]):
                    setattr(self, key, value)
                if (key == "dtype"):
                    if (value is not None):
                        self.dtype = TrainSource.getDataType(value)
                elif (key == "oneHotColums"):
                    for (oneHotIdx, oneHotList) in value:
                        setattr(self.oneHotColumns, oneHotIdx, set(oneHotList))
                elif (key == "transformations"):
                    setattr(self, key, [(DataPreprocessing.Transformation.parseJSON(tx) if "instanceClass" in tx else tx) for tx in obj[key]])
        
        def copy(self, node: 'DataPreprocessing.Node'):
            '''
                Copy the configuration of this @DataPreprocessing.Node object to another @DataPreprocessing.Node object   --- UPDATED (Dexter) 20190203

                Parameters
                ------------------------------

                node        `DataPreprocessing.Node`    - Another @DataPreprocessing.Node object.
            '''
            node.dtype = self.dtype
            node.defaultHeader = self.defaultHeader
            node.transformations = [tx.copy() for tx in self.transformations]
            node.transformTo = {idx: ftn for idx,ftn in self.transformTo.items()}
            node.circularInfo = {idx: {n:v for n,v in cirObj.items()} for idx,cirObj in self.circularInfo.items()}
            node.oneHotColumns = {idx: set([*oneHotSet]) for idx,oneHotSet in self.oneHotColumns.items()}
            node.transformations = [{n:v for n,v in tx.items()} for tx in self.transformations]
            node.circular = [{n:v for n,v in cir.items()} for cir in self.circular]
            node.source = self.source
            node.sourceCol = self.sourceCol
            node.setInputShape(self.dataShape)
            node.updateOrder()
        
        def refreshItemShape(self):
            '''
                Refresh the item shape, typically after updates of datashape.   --- UPDATED (Dexter) 20190130
            '''
            # Get the shape after column selection.
            selShape = [len(TableSource.getColList(self.getInputShape()[1], self.sourceCol))]

            # Update the shape if there is onehot columns added.
            if len(self.oneHotColumns):
                selShape[0] += sum([max([1, len(oneHotSet)]) for oneHotSet in [*self.oneHotColumns.values()]]) - len(self.oneHotColumns)
            
            # Set the item shape.
            self.setItemShape([*selShape])
        
        def getRootData(self) -> 'np.ndarray':
            '''
                Get the root data of this @DataPreprocessing.ColumnsNode object in case this belongs to a @TableSource object.   --- UPDATED (Dexter) 20190129

                Returns
                ------------------------------

                `np.ndarray<np.ndarray<float|int|str>>` - The root data
            '''
            if (isinstance(self.trainSource, TableSource)):
                return self.trainSource.getRootData(self.key)
            else:
                return None

        class StepEnum(Enum):
            '''
                Enumeration representing the step of data preprocessing within a @ColConfig object.   --- UPDATED (Dexter) 20190129
            '''
            # The initial data received from previous root data or @ColConfig object.
            Input = 0

            # Data just after transformations.
            Transformed = 1

            # Data just after circular data definitions.
            CircularDataDefined = 2
            
            # Data just after one-hot encoding column expansion. Also as the output of the data preproccessing.
            Output = 3

    class ImageNode(Node):
        '''
            Class representing a image preprocessing node, i.e. preprocessing node of on a image-like source (like @ImageSource object).   --- UPDATED (Dexter) 20190130
        '''
        def __init__(self, dtype: 'tf.DType' = None, defaultHeader: List[str] = None):
            '''
                Creates a image preprocessing node.   --- UPDATED (Dexter) 20190129

                Parameters
                ------------------------------

                dtype           `str`       - The data type of the data output. If `null`, it will be automatically determined during data pre-processing, and converted to `tf.float32` if it's using as an input of data model.

                defaultHeader   `list<str>` - A list of strings specifying the default header names of the data.
            '''
            super().__init__(instanceClass = DataPreprocessing.InstanceClassEnum.ImageNode, dtype = dtype, defaultHeader = defaultHeader)

        def refreshItemShape(self):
            '''
                Refresh the item shape, typically after updates of datashape.   --- UPDATED (Dexter) 20190130
            '''
            # Get the shape from the node input.
            selShape = self.getInputShape()[1:]

            # Update the shape if there is transformation - crop, applied.
            filterTxs = [tx for tx in self.transformations if isinstance(tx, DataPreprocessing.Transformation.Image.Crop)]
            if (len(filterTxs)):
                selShape[0] = filterTxs[-1].height
                selShape[1] = filterTxs[-1].width
            
            # Set the item shape.
            self.setItemShape([*selShape])

    class Transformation:
        '''
            Sub-class containing methods and instance classes on transformation configurations on columns from a @DataPreprocessing.Node object.   --- RESERVED --- UPDATED (Dexter) 20190130
        '''
        @staticmethod
        def parseJSON(obj:Dict[str, Any]) -> 'DataPreprocessing.Transformation.Config':
            '''
                Parse a previously saved object into a new @DataPreprocessing.Transformation.Config object. This will auto-determine the sub-class of the object, and pass the JSON object to the inner method to continue to parse.   --- UPDATED (Dexter) 20190131
                
                Parameters
                ------------------------------

                obj     `dict<str, *>`   - JSON object.

                Returns
                ------------------------------

                `DataPreprocessing.Transformation.Config`    - A @DataPreprocessing.Transformation.Config object.
            '''
            # Parse this DataPreprocessing.Transformation.Config object. If there is instanceClass attribute, parse the JSON object. Otherwise, it's a legacy ColConfig object.
            if "_instanceClass" in obj:
                instanceClass = getattr(__class__,__class__.InstanceClassEnum[obj._instanceClass].name)
                dataTransformationConfig = getattr(instanceClass, instanceClass.Types(obj._method).name)()
                dataTransformationConfig.parseJSON(obj)
                return dataTransformationConfig
            else:
                return obj
        
        class InstanceClassEnum(Enum):
            '''
                Enumeration representing the instance / sub-class type of a @DataPreprocessing.Transformation.Config object.   --- UPDATED (Dexter) 20190130
            '''
            # The subclass of @DataPreprocessing.Transformation.Columns object
            Columns = 1

            # The subclass of @DataPreprocessing.Transformation.Image object
            Image = 2
        
        Config = __DataTransformationConfig__

        class Columns:
            '''
                Sub-class containing methods and instance classes on transformation configurations on columns from a @DataPreprocessing.ColumnsNode object.   --- RESERVED --- UPDATED (Dexter) 20190130
            '''
            class Types(Enum):
                '''
                    Enumeration representing the transformation method type of a @DataPreprocessing.Transformation.Columns.Config object.   --- RESERVED --- UPDATED (Dexter) 20190131
                '''
                Normalize = 1
                Log = 2
                Exponential = 3
                Classify = 4
                Power = 5
                MissingData = 6
            
            @staticmethod
            def getFunctions(method: 'Types') -> Callable:
                '''
                    Get the transformation function from a specific transformation method.   --- RESERVED --- UPDATED (Dexter) 20190131

                    Parameters
                    ------------------------------

                    method      `Types`       -  The requested method type of transformation, as defined in @DataPreprocessing.Transformation.Columns.Types . 

                    Returns
                    ------------------------------

                    `Callable<<list<float|int>>,list<float|int>>`   -  A transformation function for transforming a single column of data, i.e. with size `[None]`.
                '''
                pass

            @staticmethod
            def getReversedFunctions(moethod: 'Types') -> Callable:
                '''
                    Get the reversed transformation function from a specific transformation method, typically used in recovering actual predictions from model outputs.   --- RESERVED --- UPDATED (Dexter) 20190131

                    Parameters
                    ------------------------------

                    method      `Types`   - The requested method type of transformation, as defined in @DataPreprocessing.Transformation.Columns.Types .
                    
                    `Callable<<list<float|int>>,list<float|int>>`   - A transformation function for transforming a single column of data, i.e. with size `[None]`.
                '''
                pass

            Config = __ColumnsTransformationConfig__
            
        class Image:
            '''
                Sub-class containing methods and instance classes on transformation configurations on images from a @DataPreprocessing.ImageNode object.   --- UPDATED (Dexter) 20190131
            '''
            class Types(Enum):
                '''
                    Enumeration representing the transformation method type of a @DataPreprocessing.Transformation.Image.Config object.   --- RESERVED --- UPDATED (Dexter) 20190131
                '''
                # Crop the input source image into a specific size.
                Crop = 1
                Flip = 2
                Rotate = 3

                Hue = 4
                Contrast = 5
                Saturation = 6
                Brightness = 7

                Normalize = 8
                ToGrayscale = 9
                ToRGB = 10
            
            Config = __ImageTransformationConfig__
            Crop = __ImageTransformationConfigCrop__

# Fallback name for old class name.
ColConfig = DataPreprocessing.ColumnsNode

class TrainSource:
    '''
			Class representing a centralized interface for handling training data source.   --- UPDATED (Dexter) 20180622
    '''
    def __init__(self, oriShape = [], batchSize = 200, training = True, shuffle = True, name = "", splittable = False):
        '''
			Create a TrainSource object.   --- UPDATED (Dexter) 20190128

            Parameters
            ------------------------------

            oriShape            `list<int>`         - The original data shape.

            batchSize           `int`               - Batch size when using batched training.

            targetItemShape     `tuple(int+)`       - Array specifying the array shape of one target item.

            training            `bool`              - Setup for training use only.

            shuffle             `bool`              - Whether the data source will be shuffled on training.

            name                `str`               - Name of this TrainSource.

            splittable          `bool`              - Whether the data source is splittable, for the purpose of partitioning validation data.
        '''
        # `str` - The type of this @TrainSource, like `"TableSource"`, `"CSVSource"`, etc.
        self._type = ""
        # `int` - Epoch size of the data, i.e. total number of records in the training dataset.
        self.epochSize = oriShape[0] if len(oriShape) > 0 else None
        # `int` - Batch size when using batched training.
        self.batchSize = batchSize
        # `TrainSource` - The validation subset of this @TrainSource object.
        self.validation = None
        # `Train` - The @Train object where this @TrainSource belongs to. If this source is just constructed, it is not belonged to any training instance. 
        self.train = None
        # `bool` - Whether the data source will be shuffled on training.
        self.shuffle = shuffle
        # `str` - The name of this @TrainSource. 
        self.name = name
        # `bool` - Whether the data source is splittable, for the purpose of partitioning validation data.
        self.splittable = splittable
        # `dict<str,DataPreprocessing.Node>`  - A `dict` object using a `str` as a key to map with a corresponding @DataPreprocessing.ColumnsNode object, storing all the column configurations (data preprocessing config) on this source.
        self.colConfigs = {}
        # `bool` - Whether this setup for training use only.
        self._training = training
        # `list<int>` - The original shape of the data source, including the batch dimension.
        self._oriShape = oriShape
        # `TrainSource` - The train subset of this @TrainSource object.
        self.trainset = self
        # `bool` - Whether the source has been initialized for data generation.
        self._initialized = False
        # `int` - The cross validation time of generating data.
        self._validationTime = 0
        # `int` - Iteration index during data generation.
        self._itrIdx = None
        
    @property
    def sourceID(self) -> int:
        '''
            Get the source id of this source in the parent @Train object.   --- UPDATED (Dexter) 20190129

            Returns
            ------------------------------

            `int` - The source id of this source in the parent @Train object.
        '''
        return self.train.sources.index(self)
    
    @property
    def oriShape(self) -> List[int]:
        '''
            Get the shape of the original (and primary) data of this @TrainSource object.   --- UPDATED (Dexter) 20190130

            Returns
            ------------------------------

            `list<int>` - The shape of the original (and primary) data of this @TrainSource object.
        '''
        return self._oriShape
    
    @property
    def training(self) -> bool:
        '''
            Whether this setup for training use only.   --- UPDATED (Dexter) 20190208

            Returns
            ------------------------------

            `bool`  Whether this setup for training use only.
        '''
        return self._training

    def setDataShape(self, shape: List[int]):
        '''
            Set the data shape of this training source, typically when full data is not available.   --- UPDATED (Dexter) 20190130

            Parameters
            ------------------------------

            shape   `list<int>`     - The enforced shape, including the batch dimension.
        '''
        self._oriShape = shape
    
    def __getitem__(self, key: str):
        '''
			Get a column configuration using a key.   --- UPDATED (Dexter) 20180622

            Parameters
            ------------------------------

            key     `str`   - The key of the column config.

            Returns
            ------------------------------

            `DataPreprocessing.Node`     - A @DataPreprocessing.Node object with the requested key.
        '''
        return self.colConfigs[key]
    
    def __setitem__(self, key: str, colConfig: 'DataPreprocessing.Node'):
        '''
			Set a column configuration using a key.   --- UPDATED (Dexter) 20190124

            Parameters
            ------------------------------

            key         `str`           - The key of the column config.
            
            colConfig   `DataPreprocessing.Node`     - The @DataPreprocessing.Node object.

            Returns
            ------------------------------

            `DataPreprocessing.Node`     - The @DataPreprocessing.Node object.
        '''
        self.colConfigs[key] = colConfig
        colConfig.attachToSource(self, key)
        return colConfig

    def __contains__(self, key):
        '''
			Whether there is a column configuration using a specific key.   --- UPDATED (Dexter) 20180716

            Parameters
            ------------------------------

            key     `str`   - The key of the column config.

            Returns
            ------------------------------

            `bool`     - True if there is a colum configuration using the requested key
        '''
        return key in self.colConfigs

    def __missing__(self, key):
        '''
			Whether there is no column configuration using a specific key.   --- UPDATED (Dexter) 20180716

            Parameters
            ------------------------------

            key     `str`   - The key of the column config.

            Returns
            ------------------------------

            `bool`     - True if there is no colum configuration using the requested key
        '''
        return key not in self.colConfigs
    
    def __len__(self) -> int:
        '''
			Get the epoch size of this training source.   --- UPDATED (Dexter) 20181111

            Returns
            ------------------------------

            `int` - The epoch size
        '''
        return self.epochSize
    
    def setColConfig(self, key, colConfig):
        '''
			Alias for .__setitem__() method.   --- UPDATED (Dexter) 20180625
        '''
        self[key] = colConfig
    
    def keys(self):
        '''
			Get an iterator for the column config keys.   --- UPDATED (Dexter) 20180622

            Returns
            ------------------------------

            `iterable[str]`     - A iterable object for the column configurations.
        '''
        return self.colConfigs.keys()

    def getTensors(self):
        '''
			Get the source tensors of this training data source.   --- UPDATED (Dexter) 20190128

            Returns
            ------------------------------

            `TrainSourceTensor`     - A TrainSourceTensor object with available source outputs.
        '''
        return TrainSourceTensor(**{dppKey: tf.placeholder(tf.float32 if colConfig.dtype is None else colConfig.dtype, shape=([None, *colConfig.getShape()[1:]])) for dppKey, colConfig in self.colConfigs.items()})
    
    def __next__(self):
        '''
			Abstract method for generating the next batch of data. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20180622
        '''
        pass
    
    def __getRandItems__(self, n):
        '''
			Abstract method for sampling n input items. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20180622

            Parameters
            ------------------------------

            n   `int`   - Number of items to get.
        '''
        pass
    
    def recoverToRawData(self, dppKey, items):
        '''
			Abstract method for recovering data items to raw-data format of the predicted data, like undo normalization or transformations, etc. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20180717

            Parameters
            ------------------------------

            dppKey      `str`                   - The column config of the data.

            items       `np.ndarray|list[*+]`   - A list of data items.
        '''
        pass

    def getPrintableItems(self, dppKey, items, recovered = True):
        '''
			Abstract method for printing some items into an array, with some further formatting. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20180717

            Parameters
            ------------------------------

            dppKey  `str`       - The key for a column configuration.

            items   `list[*+]`   - A list of items typically with original input format.

            recovered   `bool`  - Whether the data is recovered from transformation or not.
        '''
        pass

    def __prepareItr__(self):
        '''
			Abstract method for preparing a new iteration of data, typically re-initialize the iteration configurations. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20180622
        '''
        pass
    
    def changeItrConfig(self, batchSize = None, shuffle = None, training = None):
        '''
			Updates the iteration configuration, typically called in trainings with adaptive updates of training properties. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20180713

            Parameters
            ------------------------------

            batchSize   `int`       - The new batch size.

            shuffle     `bool`      - The new data shuffling option.

            training    `bool`      - Whether this source is for training purpose.
        '''
        # Update batch size and shuffle if needed.
        if (batchSize is not None):
            self.batchSize = batchSize
        if (shuffle is not None):
            self.shuffle = shuffle
        if (training is not None):
            self._training = training

        # Reset iteration if needed.
        if (self._initialized):
            self.close()
            self.__prepareItr__()
            self._initialized = True
        else:
            self.__prepareItr__()
    
    def close(self):
        '''
			Virtual method for ending a life cycle of using data source. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20180622
        '''
        self._initialized = False

    def __splitDataset__(self, prop: float = 0.2, shuffle: float = False) -> Tuple[Any,Any]:
        '''
			Virtual method for splitting current data into 2 parts. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20181111

            Parameters
            ------------------------------

            prop            `float`     - Proportion of original dataset to be the secondary dataset.

            shuffle         `bool`      - Whether to shuffle before data splitting.

            Returns
            ------------------------------

            `tuple[*,*]`        - The primary and secondary dataset.
        '''
        # Raise error if this is not a splittable data source.
        if not self.splittable:
            raise ValueError("This source cannot be split. Please consider to use seperate sources if you need to perform actions like cross validation.")

    def splitValidationDataset(self, validation: float = 0.1, shuffle: float = False):
        '''
			Virtual method for splitting current data into training and validation sets. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20180622

            Parameters
            ------------------------------

            validation      `float`     - Proportion of original dataset to be as the validation dataset.

            shuffle         `bool`      - Whether to shuffle before data splitting.
        '''
        # Raise error if this is not a splittable data source.
        if not self.splittable:
            raise ValueError("This source cannot be split. Please consider to use seperate sources if you need to perform actions like cross validation.")
    
    def splitTestDataset(self, test: float = 0.2, shuffle: float = False) -> 'TrainSource':
        '''
			Virtual method for splitting current data into training and test sets, with this source as the training set. No action taken, and a sub-class should be used.   --- UPDATED (Dexter) 20181111

            Parameters
            ------------------------------

            test            `float`     - Proportion of original dataset to be as the test dataset.

            shuffle         `bool`      - Whether to shuffle before data splitting.

            Returns
            ------------------------------

            `TrainSource`   - The test set.
        '''
        # Raise error if this is not a splittable data source.
        if not self.splittable:
            raise ValueError("This source cannot be split. Please consider to use seperate sources if you need to perform actions like cross validation.")
    
    def getColShape(self, dppKey: str, requestingDppKey: str = None, refresh: bool = None):
        '''
            Get the output shape of the parent of a @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190130

            Parameters
            ------------------------------

            dppKey              `str`       - A parent column config key.

            requestingDppKey    `str`       - The column config key of the requesting @DataPreprocessing.Node object. `None` if it's not requesting the preprocessing shape from another preprocessing node.

            refresh             `bool`      - Whether to refresh the shape from root data.

            Returns
            ------------------------------

            `list<int>`        - The output shape.
        '''
        if (dppKey in self.colConfigs):
            return self.colConfigs[dppKey].getShape(refresh)
        else:
            return self.oriShape

    def getRootDppKey(self, dppKey: str) -> str:
        '''
			Get the root column key of a specific column configuration. This is a recursive function to find the parent column configuration.   --- UPDATED (Dexter) 20180622

            Parameters
            ------------------------------
            
            dppKey  `str`   - The key for a column configuration.

            Returns
            ------------------------------

            `str`   - The key for the requested root column configuration.
        '''
        # Ensure the column key is defined.
        if dppKey not in self.colConfigs:
            raise ValueError("The column key cannot be found.")
        
        # If it's the root, the column config should have no value for the .source attribute.
        if self[dppKey].source is None:
            return dppKey
        # Otherwise, recursively call this function by referencing the source column key of this column configuration.
        else:
            return self.getRootDppKey(self[dppKey].source)
    
    def applyDataConfig(self, *toSources: 'TrainSource'):
        '''
			Apply the data configuration of this source to other sources.   --- UPDATED (Dexter) 20190203

            Parameters
            ------------------------------

            toSources      `*TrainSource`  - One or more TrainSource object to apply the same column configurations of this TrainSource.
        '''
        # Get the root column configs.
        coreDataSources = [dppKey for dppKey,col in self.colConfigs.items() if col.source is None]

        # Loop for each column configs.
        for dppKey, dppNode in self.colConfigs.items():
            # Get the root of this column config.
            thisDppKeyRoot = self.getRootDppKey(dppKey)

            # Loop every applying TrainSource objects.
            for tos in toSources:
                # Get a new preprocessing node
                newDppNode = getattr(DataPreprocessing,DataPreprocessing.InstanceClassEnum(dppNode._instanceClass).name)()
                dppNode.copy(newDppNode)
                tos[dppKey] = newDppNode

    @staticmethod
    def convertDType(npdtype):
        '''
			Convert NumPy data type object into TensorFlow datatype object.   --- UPDATED (Dexter) 20190128

            Parameters
            ------------------------------

            npdtype         `np.dtype`  - A NumPy data type object.

            Returns
            ------------------------------

            `tf.DType`      - A TensorFlow data type object
        '''
        if (npdtype == np.dtype('float64')):
            return tf.float64
        elif (npdtype == np.dtype('float32')):
            return tf.float32
        elif (npdtype == np.dtype('int64')):
            return tf.int64
        elif (npdtype == np.dtype('int32')):
            return tf.int32
        elif (npdtype.kind == "U"):
            return tf.string
        else:
            return tf.variant
    
    @staticmethod
    def getDataType(string: str) -> 'tf.DType':
        '''
			Get a TensorFlow data type from a string.   --- UPDATED (Dexter) 20190128

            Parameters
            ------------------------------

            npdtype         `np.dtype`  - A NumPy data type object.

            Returns
            ------------------------------

            `tf.DType`      - A TensorFlow data type object
        '''
        return {"tf.float32": tf.float32, "tf.int64": tf.int64}[string]

class TableSource(TrainSource):
    '''
        Class representing a data source in table format, usually rows of data records with attributes as columns.   --- UPDATED (Dexter) 20180622 
    '''
    def __init__(self, inputArray = [], outputArray = [], hasHeading = False, batchSize = 200, testRatio = 20, training = True, shuffle = True, name = ""):
        '''
			Create a TableSource object, a two-dimensional table.   --- UPDATED (Dexter) 20190128

            Parameters
            ------------------------------

            inputArray  `list[list[float|int|str]]` - An input data table.

            outputArray `list[list[float|int|str]]` - An output data table.

            hasHeading  `bool`  - Whether the table has heading.

            batchSize   `int`   - Batch size when using batched training.

            testRatio   `float` - The test data proportion, in terms of %.

            training    `bool`  - Setup for training use only.

            shuffle     `bool`  - Whether the data source will be shuffled on training.

            name        `str`   - Name of this TableSource.
        '''
        # Convert input array into NumPy array.
        inp = np.asarray(inputArray)
        out = np.asarray(outputArray)

        # Ensure the input arrray is of 2 dimension.
        if len(inp.shape) != 2:
            raise ValueError("Input Shape must be a 2-dimensional array.")
        elif len(out.shape) != 2 and len(out) != 0:
            raise ValueError("Output Shape must be a 2-dimensional array.")

        # Stack the input and output array.
        allData = np.column_stack((inp, out)) if (len(out) == len(inp) and len(inp) > 0) else inp

        # Get the data shape.
        shape = [*(allData[1:].shape if hasHeading else allData.shape)] if len(allData) else [0]

        # Create the data preprocessing node.
        super().__init__(oriShape = shape, batchSize = batchSize, training = training, shuffle = shuffle, name = name, splittable = True)

        # `np.ndarray<np.ndarray<int|float|str>>` - The original source data
        self._oriData = allData if len(allData) else np.asarray([])

        # Auto handling data preprocessing column selections if there is output array given.
        if (len(out)):
            inputColCount = len(inp[0]) if len(inp) else 0
            outputColCount = len(out[0]) if len(out) else 0
            inputCol = ("None:" + str(inputColCount)) if inputColCount > 0 else None
            targetCol = (str(inputColCount) + ":None") if outputColCount > 0 else None
            if (len(inp)):
                self["input"] = DataPreprocessing.ColumnsNode(None, inputCol)
            if (len(out)):
                self["output"] = DataPreprocessing.ColumnsNode(None, targetCol)
        
        # `str` - The type of this @TrainSource, i.e. ``"TableSource"``
        self._type = "TableSource"

        # `bool` - Whether the table has heading.
        self._hasHeading = hasHeading

        # `bool` - Whether this source is fully extracted with every data known.
        self._fullyExtracted = training

        # `float` - The test data proportion, in terms of %.
        self._testRatio = testRatio

        # `int` - Remember the row count, and find the iteration count for each epoch.
        self._itrCount = max(self.epochSize // batchSize, 1)

        # Prepare the iteration of this TrainSource.
        self.__prepareItr__()
    
    @property
    def oriData(self) -> 'np.ndarray':
        ''' 
            Get the original data of this table source.   --- UPDATED (Dexter) 20190205

            Returns
            ------------------------------
            
            `np.ndarray<np.ndarray<int|float|str>>` - The original source data
        '''
        return self._oriData
    
    def setRootData(self, data: 'np.ndarray'):
        ''' 
            Set the root data.   --- UPDATED (Dexter) 20190208

            Parameters
            ------------------------------

            `np.ndarray<np.ndarray<int|float|str>>` - The original source data
        '''
        # Ensure there is at least some data.
        if (data is None or len(data) == 0):
            raise ValueError("Some data should be set instead of `None` or array with zero length")

        # If it's replacing old data, ensure the shape is the same (except the batch dimension).
        elif ((self.oriData is not None and len(self.oriData) > 0) and data.shape[1:] != self.oriData.shape[1:]):
            raise ValueError("Data cannot be reset with a different shape")
        
        # Set the data, update the epoch size and iteration count.
        self._oriData = data
        self.epochSize = data.shape[0]
        self._itrCount = max(self.epochSize // self.batchSize, 1)

    @property
    def hasHeading(self) -> bool:
        '''
			Return whether this table source include a heading.   --- UPDATED (Dexter) 20181214

            Returns
            ------------------------------

            `bool` - Whether the table has heading.
        '''
        return self._hasHeading
    
    @property
    def testRatio(self) -> float:
        '''
            Get the test data proportion, in terms of %.   --- UPDATED (Dexter) 20190207

            Returns
            ------------------------------

            `float`  - The test data proportion, in terms of %.
        '''
        return self._testRatio

    def hasColData(self, dppKey: str = None) -> bool:
        '''
			Check if there is data for one column configuration.    --- UPDATED (Dexter) 20180622

            Parameters
            ------------------------------

            dppKey  `str`   - The key for a column configuration.

            Returns
            ------------------------------

            `bool`  - Whether the requested column has data defined from its root column configuration.
        '''
        # Ensure there is original data embedded.
        if self.oriData is None or len(self.oriData) == 0:
            return False

        if (dppKey is not None):
            # Ensure the requested key is defined, and return if it's relating to a data source.
            if dppKey not in self.colConfigs:
                return False
            
            # Check if the node has specified at least one column.
            colConfig = self.colConfigs[dppKey]
            colConfigDataIdx = [i for i in range(0, (self.oriShape[1] if colConfig.source is None else self.colConfigs[colConfig.source].getShape()[1]))]
            colSourceCols = colConfig.sourceCol
            colSourceIdx = TableSource.colSpec([colConfigDataIdx], colSourceCols)[0]
            return len(colSourceIdx)
        else:
            return self.oriData is not None and len(self.oriData) > 0                

    def getAllData(self, batchStart: int = None, batchEnd: int = None) -> 'np.ndarray':
        '''
            Get the all data of a data source, with specification of the range of the batch.   --- UPDATED (Dexter) 20181210

            Parameters
            ------------------------------

            batchStart      `int`   - Batch starting index (inclusive). If `"None"`, it notates `0`.

            batchEnd        `int`   - Batch ending index (exclusive). If `"None"`, it notes the column count.

            Returns
            ------------------------------

            `np.ndarray<np.ndarray<int|float|str>>`  - A two-dimensional data array.
        '''
        # Ensure there is original data.
        if (self.oriData is None or len(self.oriData) == 0):
            return np.asarray([])
        
        # Get the column config and the related datasource. If it's referencing another column config, it induces a recurssive function for getColData() on another column config.
        dataSource = self.getRootData()[batchStart:batchEnd]

        # Return the columns.
        return dataSource

    def getColData(self, dppKey, step: 'DataPreprocessing.ColumnsNode.StepEnum' = DataPreprocessing.ColumnsNode.StepEnum.Output, batchStart: int = None, batchEnd: int = None, batchIndexes: List[int] = None) -> 'np.ndarray':
        '''
			Get the output data of a particular data preprocessing node, with specification of the range of the batch.   --- UPDATED (Dexter) 20190130

            Parameters
            ------------------------------

            dppKey  `str`       - The key for a column configuration.

            step    `DataPreprocessing.ColumnsNode.StepEnum`     - The step of data preprocessing within a @DataPreprocessing.ColumnsNode object.

            batchStart  `int`   - The starting index (inclusive) of the data rows.

            batchEnd    `int`   - The ending index (exclusive) of the data rows.

            batchIndexes    `list[int]` - A list of indexes of data rows.

            Returns
            ------------------------------

            `np.ndarray<np.ndarray<int|float|str>>`  - A two-dimensional data array.
        '''
        # Ensure there is original data.
        if (self.oriData is None or len(self.oriData) == 0):
            return np.asarray([])

        # Ensure the column key is defined.
        if dppKey not in self.colConfigs:
            raise ValueError("The column key cannot be found.")

        # Get the column config.
        colConfig = self[dppKey]

        # Get the data source of this column config, or recursively call this function for finding the data source of the input of this column conifg.
        if batchIndexes is None:
            dataSource = self.getRootData()[batchStart:batchEnd] if colConfig.source is None else self.getColData(colConfig.source, batchStart=batchStart, batchEnd=batchEnd)
        else:
            dataSource = self.getRootData()[batchIndexes] if colConfig.source is None else self.getColData(colConfig.source, batchIndexes = batchIndexes)
        
        # Select specific columns.
        selCol = TableSource.colSpec(dataSource, colConfig.sourceCol)

        if (step == DataPreprocessing.ColumnsNode.StepEnum.Input):
            return selCol

        # If there is transformation, apply each transformation function sequentially on each of the applied column indexes.
        for idx,ftnAry in colConfig.transformTo.items():
            try:
                newCol = np.asfarray(selCol[:,[idx]])
            except:
                newCol = selCol[:,[idx]]
            newCol = functools.reduce(lambda a,b: b(a), ftnAry, newCol)
            selCol[:,[idx]] = newCol
        
        if (step == DataPreprocessing.ColumnsNode.StepEnum.Transformed):
            return selCol

        # Perform circular data range transformations on specific columns.
        for idx, ci in colConfig.circularInfo.items():
            minV, maxV, rangeV = ci.values()
            selCol[:,[idx]] = np.mod((selCol[:,[idx]].astype(float) - minV), rangeV)
        
        if (step == DataPreprocessing.ColumnsNode.StepEnum.CircularDataDefined):
            return selCol

        # Handle the one-hot columns data.
        if (len(colConfig.oneHotColumns) > 0):
            # List all columns, perform transformation if needed.
            allCols = []

            for idx in range(0, len(selCol[0])):
                if (idx in colConfig.oneHotColumns):
                    newCol = selCol[:,[idx]]
                    newCol = TableSource.convertCatToNumbers(newCol, True, {v: idx for idx,v in enumerate(colConfig.oneHotColumns[idx])})["data"]
                    allCols.extend(newCol)
                else:
                    allCols.append(selCol[:,[idx]])
            
            # Concatenate all columns.
            selCol = np.column_stack(allCols)

        # Cast the data type if needed.
        if (colConfig.dtype is not None):
            selCol = selCol.astype(colConfig.dtype.as_numpy_dtype)
        else:
            selCol = selCol.astype(float)

        # Return the transformed data.
        return selCol

    def getRootData(self, dppKey: str = None) -> 'np.ndarray':
        '''
            Get the root data of a particular root data preprocessing column node.   --- UPDATED (Dexter) 20190129

            Parameters
            ------------------------------

            dppKey - The key for the requested @DataPreprocessing.ColumnsNode object in @TrainSource.colConfigs .
        '''
        # Ensure there is original data.
        if (self.oriData is None or len(self.oriData) == 0):
            return np.asarray([])
        
        if dppKey is not None:
            # If it's not a root key, returns null.
            if (self.colConfigs[dppKey].source is not None):
                raise ValueError("getRootData() can only be applied on root data preprocessing columns node.")
            
            # Get the header names that is within the circular data definition.
            colSourceIdx = TableSource.getColList(int(self.oriShape[1]),  self.colConfigs[dppKey].sourceCol)
            return (self.oriData[1:] if self.hasHeading else self.oriData)[:, colSourceIdx].copy()
        else:
            return (self.oriData[1:] if self.hasHeading else self.oriData).copy()

    def getClassCount(self, dppKey: str = None) -> int:
        '''
			Get the class count of all values in a particular column config.   --- UPDATED (Dexter) 20190125

            Parameters
            ------------------------------

            dppKey      `str`  - The key for the requested @ColConfig object in @TrainSource.colConfigs .

            Returns
            ------------------------------

            `Number`    - The class count of all values in the requested column config.

        '''
        # Ensure there is original data.
        if (self.oriData is None or len(self.oriData) == 0):
            raise ValueError("If there is no data ready, it cannot apply getClassCount() method to find the class count.")
        
        # Ensure the data preprocessing node is present.
        elif (dppKey not in self.colConfigs):
            raise ValueError("The requested data preprocessing node key: " + dppKey + ", is not present.")

        # Get the data.
        colData = self.getColData(dppKey)

        # Ensure the data is in format of array and there are some data existed.
        if ((isinstance(colData, list) or isinstance(colData, np.ndarray)) and len(colData) > 0):
            return TableSource.getDataClassCount(colData)
        else:
            raise ValueError("There is error in getting a valid preprocessing data.")

    def getHeader(self, dppKey: str = None, step = DataPreprocessing.ColumnsNode.StepEnum.Output) -> List[str]:
        '''
			Get the header names of a particular column config.   --- UPDATED (Dexter) 20190131
            
            Parameters
            ------------------------------

            dppKey  `str`   - Column config key.

            step    `DataPreprocessing.ColumnsNode.StepEnum`     - The step of data preprocessing within a @DataPreprocessing.ColumnsNode object.

            Returns
            ------------------------------

            `list[str]`     - A list of header names.
        '''
        # Ensure the data preprocessing node key is defined.
        if dppKey is not None and dppKey not in self.colConfigs:
            raise ValueError("The data preprocessing node key cannot be found.")
        
        # Replace the header in case the header is None (The source is without a header).
        if not self.hasHeading or self.oriData is None or len(self.oriData) == 0:
            header = [str(chr(ord('A') + idx)) for idx in range(0, self.oriShape[0])]
        elif self.hasHeading and (self.oriData is not None and len(self.oriData) > 0):
            header = self.oriData[0]

        # If there is no column key, return the original header.
        if (dppKey is None):
            return header

        # Get the data preprocessing node.
        colConfig = self[dppKey]

        # Get the source header.
        sourceHeader = header if colConfig.source is None else self.getHeader(colConfig.source)

        # Select header of specific columns.
        toHeader = TableSource.colSpec([sourceHeader], colConfig.sourceCol)[0].tolist()

        # Returns if it needs to check through the data preprocessing.
        if (step not in [DataPreprocessing.ColumnsNode.StepEnum.Output]):
            return toHeader
        
        # Update the header list based on additional columns from one-hot encoding.
        oneHotIdxs = self.colConfigs[dppKey].oneHotColumns
        if (len(oneHotIdxs) > 0):
            finalHeader = []
            for idx, headerName in enumerate(toHeader):
                if (idx in oneHotIdxs):
                    # If the particular index of header is within the specification in one-hot columns, expand the headers with a postfix.
                    for oneHotName in oneHotIdxs[idx]:
                        finalHeader.append(headerName + " (" + oneHotName + ") ")
                else:
                    finalHeader.append(headerName)
            return finalHeader
        else:
            return toHeader

    def getColTable(self, dppKey: str = None, step: 'DataPreprocessing.ColumnsNode.StepEnum' = DataPreprocessing.ColumnsNode.StepEnum.Output) -> 'np.ndarray':
        '''
            Get the output table of a particular data preprocessing node, with specification of the range of the batch.   --- UPDATED (Dexter) 20190131

            Parameters
            ------------------------------

            dppKey  `str` - Data preprocessing node key.

            step    `DataPreprocessing.ColumnsNode.StepEnum`  - The step of data preprocessing within a @DataPreprocessing.ColumnsNode object.

            Returns
            ------------------------------

            `np.ndarray<np.ndarray<(int|float|str)>>` - A two-dimensional data array.

        '''
        return np.vstack((self.getHeader(dppKey, step), self.getColData(dppKey, step))) if self.hasHeading else self.getColData(dppKey, step)
    
    def getAllTable(self) -> 'np.ndarray':
        '''
            Get the table of a data source.   --- UPDATED (Dexter) 20190131

            Returns
            ------------------------------

            `np.ndarray<np.ndarray<(int|float|str)>>` - A two-dimensional data array.
        '''
        return np.vstack((self.getHeader(),*self.getAllData())) if self.hasHeading else self.getAllData()

    def selColumns(self, newDppKey: str = None, sourceDppKey: str = "input", cols: str = "None:None"):
        '''
			Select certain columns on a column config, or create a new column config on it.   --- UPDATED (Dexter) 20190208

            Parameters
            ------------------------------

            newDppKey       `str`    - Any new column key to updated as the resulted column.

            sourceDppKey    `str`    - The column key of the column config of this source to be transformed.

            cols            `str`    - Index range string for selecting certain columns for the transformation.
        '''
        nextOrder = 0

        if (sourceDppKey is not None):
            # Ensure the requested columns in one of the current column configs.
            if (sourceDppKey not in self.colConfigs):
                raise ValueError("Source data preprocessing node cannot be found.")
            
            # Find the input of this column configuration.
            prevColConfig = self[sourceDppKey]

            # Convert the column selection into a list of index.
            toColList = TableSource.getColList(prevColConfig.getShape()[1], cols)

            # Ensure there is at least some index selected.
            if len(toColList) == 0:
                raise ValueError("No columns can be applied.")

            # Assign the next order of the new data prerprocessing node.
            nextOrder = prevColConfig.order+1
        else:
            # Ensure there is a new column key when specifying on root source data.
            if (newDppKey is None):
                raise ValueError("A new data preprocessing node key should be specified when applying on root source data.")
            
        # If this is not a new column config, update the existing column config selections and shape.
        if newDppKey is None or newDppKey == sourceDppKey:
            prevColConfig.sourceCol = cols
            prevColConfig.refreshItemShape()

        # Otherwise, create a new column config on the specification.
        else:
            self[newDppKey] = DataPreprocessing.ColumnsNode(sourceDppKey, sourceCol=cols, order=nextOrder)
    
    def setTransform(self, newDppKey:str=None, sourceDppKey:str="target", cols:str="None:None", transformFunction: Callable = None, scaleType: str = "normMinMax"):
        '''
			Set a transformation on specific columns on a column config of a source.   --- UDPATED (Dexter) 20190320

            Parameters
            ------------------------------

            newDppKey       `str`    - Any new column key to updated as the resulted column.

            sourceDppKey    `str`    - The column key of the column config of this source to be transformed.

            cols            `str`     - Index range string for selecting certain columns for the transformation.

            transformFunction   `Funciton`    - A customized transformation function with parameter as a column of data and returns an object with "to" and "from" attributes for 2 different transformation functions.

            scaleType       `str`    - A predefined transformation type.
        '''

        # Ensure the requested columns in one of the current column configs.
        if (sourceDppKey not in self.colConfigs) :
            raise ValueError("The column key cannot be found.")
        
        # Get the column config of the requested key.
        sourceColConfig = self[sourceDppKey]

        # Get the column list from the column selection on the requested column configs.
        toColList = TableSource.getColList(sourceColConfig.getShape()[1],cols)

        # Determine whether pre-extraction is needed for a certain type of transformation.
        needPreExtraction = (scaleType in ["normMinMax", "normMax", "classify"] or transformFunction is not None)

        # Raise error for several scenarios.
        if len(toColList) == 0:
            raise ValueError("No columns can be applied.")
        elif (needPreExtraction and not self.hasColData(sourceDppKey)):
            raise ValueError("Data (" + sourceDppKey + ") is not set up.")
        
        # Check the number of columns to be updated.
        colCount = len(toColList)

        # Create a new column config if requested. Otherwise, we just point the column config on the existing one.
        if newDppKey is not None:
            nowColConfig = self[newDppKey] = DataPreprocessing.ColumnsNode(source=sourceDppKey, sourceCol = cols)
            nowColConfig.refreshItemShape()
            toColList = [*range(0, colCount)]
        else:
            nowColConfig = sourceColConfig
        
        # Get the data column if needed.
        dataCol = self.getColData(sourceDppKey, DataPreprocessing.ColumnsNode.StepEnum.Input) if needPreExtraction and self._fullyExtracted and (self.oriData is not None and len(self.oriData) > 0) else []

        # Prepares transformation for each of the requested columns.
        for colIdx in toColList:

            # Convert to float of the original data column if needed.
            try:
                dataCol[:,[colIdx]] = np.asfarray(dataCol[:,[colIdx]])
            except:
                pass

            # Create a new list of transformation functions for this column index if needed.
            if colIdx not in nowColConfig.transformTo:
                nowColConfig.transformTo[colIdx] = []
            if colIdx not in nowColConfig.transformFrom:
                nowColConfig.transformFrom[colIdx] = []
            
            # Append the transformation according to different scaleType, and update the dtype if needed.
            if (scaleType == "normMinMax"):
                minV = np.min(dataCol[:,[colIdx]])
                maxV = np.max(dataCol[:,[colIdx]])
                nowColConfig.transformTo[colIdx].append(lambda col: (col-minV)/(maxV-minV))
                nowColConfig.transformFrom[colIdx].append(lambda col: col*(maxV-minV) + minV)
            elif (scaleType == "normMax"):
                minV = np.min(dataCol[:,[colIdx]])
                maxV = np.max(dataCol[:,[colIdx]])
                numRange = max([0, maxV]) - min([0, minV])
                nowColConfig.transformTo[colIdx].append(lambda col: col/numRange)
                nowColConfig.transformFrom[colIdx].append(lambda col: col*numRange)
            elif (scaleType == "log"):
                nowColConfig.transformTo[colIdx].append(lambda col: np.log(np.minimum(col,0)))
                nowColConfig.transformFrom[colIdx].append(lambda col: np.exp(col))
            elif (scaleType == "exp"):
                nowColConfig.transformTo[colIdx].append(lambda col: np.exp(col))
                nowColConfig.transformFrom[colIdx].append(lambda col: np.log(np.minimum(col,0)))
            elif (scaleType == "classify"):
                convList = TableSource.convertCatToNumbers(dataCol[:,[colIdx]])["dict"]
                nowColConfig.transformTo[colIdx].append(lambda col: TableSource.convertCatToNumbers(col, manualList=convList)["data"])
                nowColConfig.transformFrom[colIdx].append(lambda col: TableSource.convertNumbersToCat(col, convList))
            elif (scaleType is not None):
                raise ValueError("Scale Type (" + scaleType + ") is not supported.")
            elif (transformFunction is not None):
                toTransform = transformFunction(dataCol[:,[colIdx]])
                nowColConfig.transformTo[colIdx].append(toTransform["to"])
                nowColConfig.transformFrom[colIdx].append(toTransform["from"])

    def setCircularOutput(self, sourceDppKey: str = "target", cols: str ="None:None", minV: float = 0, maxV: float = 360):
        '''
			Define circular data on specific columns on a column config of a source.   --- UDPATED (Dexter) 20190205

            Parameters
            ------------------------------
            sourceDppKey    `str`       - The column key of the column config of this source to be transformed.

            cols            `str`       - Index range string for selecting certain columns for the transformation.

            minV            `int|float` - The minimum value of the circular range (inclusive).

            maxV            `int|float` - The maximum value of the circular range (exclusive).
        '''

        # Raise error for several scenarios.
        if (sourceDppKey not in self.colConfigs):
            raise ValueError("Source Column cannot be found.")
        elif self[sourceDppKey].dtype == tf.string:
            raise ValueError("String data columns cannot set with circular output.")
        
        # Refer to the requested column config.
        prevColConfig = self[sourceDppKey]

        # Get the column list from the column selection on the requested column configs.
        toColList = TableSource.getColList(prevColConfig.getShape()[1], cols)

        # If no column is actually selected, raise error.
        if len(toColList) == 0:
            raise ValueError("No columns can be applied.")

        # For each of the selected column index, define a circular info object.
        for idx in toColList:
            prevColConfig.circularInfo[idx] = {"min": minV, "max": maxV, "range": maxV-minV}

    def setOneHot(self, sourceDppKey:str="target", cols="None:None"):
        '''
			Define the specific columns on a column config of a source to have a one-hot encoding.   --- UDPATED (Dexter) 20190225
            
            Parameters
            ------------------------------
            sourceDppKey    `str`       - The column key of the column config of this source to be transformed.

            cols            `str`       - Index range string for selecting certain columns for the transformation.
        '''
        # Raise error for several scenarios.
        if (sourceDppKey not in self.colConfigs):
            raise ValueError("Source Column cannot be found.")
        elif self[sourceDppKey] == tf.string:
            raise ValueError("String data columns cannot set with circular output.")
        elif (not self.hasColData(sourceDppKey)):
            raise ValueError("Data (" + sourceDppKey + ") is not set up.")

        # Refer to the requested column config.
        prevColConfig = self[sourceDppKey]

        # Get the column list from the column selection on the requested column configs.
        toColList = TableSource.getColList(prevColConfig.getShape()[1], cols)

        # If no column is actually selected, raise error.
        if len(toColList) == 0:
            raise ValueError("No columns can be applied.")

        # Clear the one hot columns.
        prevColConfig.oneHotColumns = {}

        # Set up the one hot columns.
        oriData = self.getColData(sourceDppKey, DataPreprocessing.ColumnsNode.StepEnum.CircularDataDefined)
        for idx in toColList:
            prevColConfig.oneHotColumns[idx] = set(oriData[:,idx])

    def __getRandItems__(self, n: int) -> Dict[str, Any]:
        '''
			Sample n items from the dataset.   --- UPDATED (Dexter) 20180630
            
            Parameters
            ------------------------------

            n   `int`   - Number of items to get.

            Returns
            ------------------------------

            `dict<str,*>` - The n items in a `dict` format with key corresponding to the data preprocessing key.
        '''
        idx = np.random.randint(self.epochSize, size=n)
        return {dppKey: self.getColData(dppKey, batchIndexes = idx) for dppKey in self.colConfigs}

    def __prepareItr__(self):
        '''
			Prepare a new round of data source iteration.   --- UPDATED (Dexter) 20180622
        '''
        # Reset the iteration index.
        self._itrIdx = 0

        # Reshuffle the data if needed.
        if (self.shuffle):
            self.__shuffleData__()

    def __shuffleData__(self):
        '''
			Shuffle the data.   --- UPDATED (Dexter) 20190208
        '''
        np.random.shuffle(self.oriData[1:] if self.hasHeading else self.oriData)
    
    def __next__(self):
        '''
			Generate the next batch of data rows.   --- UPDATED (Dexter) 20180622
        '''
        # 1. Initialize the Looping
        if (not self._initialized):
            self._initialized = True

        # 2. Get an index and batch size
        i = self._itrIdx
        batchSize = self.batchSize

        # 3. If this batch has touched the end of the epoch, regenerate the data 
        if ((i+1)*batchSize > self.epochSize):
            self.__prepareItr__()
            i = self._itrIdx
        
        # 4. Get the data as according to the default or specially indexed data
        returnObj = {colName: self.getColData(colName, batchStart=i*batchSize, batchEnd=(i+1)*batchSize) for colName, c in self.colConfigs.items()}
        
        # 5. Increment the index and return all the data
        self._itrIdx += 1
        return returnObj

    def __splitDataset__(self, prop: float = 0.2, shuffle: float = False) -> Tuple[Tuple['np.ndarray','np.ndarray'],Tuple['np.ndarray','np.ndarray']]:
        '''
			Splitting current data into 2 parts.   --- UPDATED (Dexter) 20190208

            Parameters
            ------------------------------

            prop            `float`     - Proportion of original dataset to be the secondary dataset.

            shuffle         `bool`      - Whether to shuffle before data splitting.

            Returns
            ------------------------------

            `tuple[tuple[np.ndarray,np.ndarray],tuple[np.ndarray,np.ndarray]]`   - The primary and secondary dataset, with each containing the input and target data.
        '''
        # 0. Check total dataset size
        rowCount = self.epochSize
        portion = math.floor(rowCount*prop)
        data = self.oriData.copy()[1:] if self.hasHeading else self.oriData.copy() 

        # 1. If needed, shuffle the data.
        if (shuffle):
            np.random.shuffle(data)

        # 2. Split the dataset
        primaryData = data[portion:]
        secondaryData = data[:portion]

        # 3. Append the heading.
        if (self.hasHeading):
            primaryData = np.vstack((self.oriData[[0]], primaryData))
            secondaryData = np.vstack((self.oriData[[0]], secondaryData))

        # Return the splitted datasets
        return (primaryData, secondaryData)

    def splitValidationDataset(self, validation: float = 0.1, shuffle: bool = False):
        '''
			Split current data into training and validation datasets.   --- UPDATED (Dexter) 20190404
            
            Parameters
            ------------------------------

            validation      `float`     - Proportion of original dataset to be as the validation dataset.

            shuffle         `bool`      - Whether to shuffle before data splitting.
        '''
        # 0. Check total dataset size
        rowCount = self.epochSize

        # 1. Consider if we need to shuffle before dataset splitting
        # 1A. If so, need to define the portion of validation data row count.
        if shuffle:
            (trainData, valData) = self.__splitDataset__(prop = validation, shuffle = shuffle)
        
        # 1B. If no shuffle is required, need to cut the suitable part of the dataset
        else:
            # 1B-1. Determine no. of validation count required.
            validationCount = math.floor(1/validation)
            i = self._validationTime % validationCount
            data = self.oriData.copy()[1:] if self.hasHeading else self.oriData.copy() 

            # 1B-2. If it's the first time to split and this dataset needs shuffling, shuffle the dataset.
            if (i == 0 and self.shuffle): 
                np.random.shuffle(data)

            # 1B-3: Split the dataset by the index.
            valPortion = math.ceil(rowCount/validationCount)
            startIdx = i*valPortion
            endIdx = (i+1)*valPortion
            trainData = np.vstack((data[:startIdx], data[endIdx:]))
            valData = data[startIdx: endIdx]

            # 1B-4. Append the heading.
            if (self.hasHeading):
                trainData = np.vstack((self.oriData[[0]], trainData))
                valData = np.vstack((self.oriData[[0]], valData))
        
        # 2. Assign the sliced dataset to the training and validation part
        self.trainset = TableSource(trainData, hasHeading = self.hasHeading, batchSize=self.batchSize, training=True, shuffle=self.shuffle)
        self.validation = TableSource(valData, hasHeading = self.hasHeading, batchSize=self.batchSize, training=False, shuffle=self.shuffle)
        
        # 3. Copy the configuration of any special column arrangements, transformation requirement or circular definiton.
        self.applyDataConfig(self.trainset, self.validation)
        
        # 4. Increment the validation time by one
        self._validationTime += 1
    
    def splitTestDataset(self, test: float = 0.2, shuffle: float = False) -> 'TableSource':
        '''
			Abstract method for splitting current data into training and test sets, with this source as the training set.   --- UPDATED (Dexter) 20190208

            Parameters
            ------------------------------

            test            `float`     - Proportion of original dataset to be as the test dataset.

            shuffle         `bool`      - Whether to shuffle before data splitting.

            Returns
            ------------------------------

            `TableSource`   - The test set.
        '''
        # Get the partiitoned datasets.
        (trainData, testData) = self.__splitDataset__(prop = test, shuffle = shuffle)
        
        # Reassign the training information.
        self.setRootData(trainData)

        # Create the test dataset.
        testSource = TableSource(inputArray = testData, hasHeading = self.hasHeading, batchSize=self.batchSize, training=False, shuffle=self.shuffle)
        self.applyDataConfig(testSource)

        # Return the test dataset.
        return testSource

    def recoverToRawData(self, dppKey, items):
        '''
			Recover data items to raw-data format of the predicted data, like undo normalization or contain by circular definition, etc.   --- UPDATED (Dexter) 20190225

            Parameters
            ------------------------------

            dppKey      `str`                   - The column config of the data.

            items       `np.ndarray|list[*+]`   - A list of data items.

            Returns
            ------------------------------

            `np.ndarray|list`    - A list of recovered data items.
        '''
        # Convert to np array for the predicted data.
        items = np.asarray(items)

        # Get the column config of the target source.
        colConfig = self[dppKey]

        # Recover from one-hot encoding.
        if (len(colConfig.oneHotColumns) > 0):
            # Sort all one hot column keys.
            oneHotKeys = [*colConfig.oneHotColumns.keys()]
            oneHotKeys.sort()

            # List all columns, perform transformation if needed.
            allCols = []
            pushIdx = 0
            oriIdx = 0
            for idx in range(0, items.shape[-1]):
                if (idx == pushIdx):
                    if (idx in oneHotKeys):
                        # Determine the original data.
                        catSet = colConfig.oneHotColumns[idx]
                        catSize = len(catSet)
                        pushIdx += catSize 
                        oriIdx += 1
                        catCols = items[:,idx:idx+catSize]
                        catIdx = np.argmax(catCols, axis=-1)
                        catDict = {i: v for i,v in enumerate(catSet)}
                        allCols.append(np.reshape(np.frompyfunc(lambda i: catDict[i], 1, 1)(catIdx), [*catCols.shape[:-1], 1]))
                    else:
                        pushIdx += 1
                        oriIdx += 1
                        allCols.append(items[:,[idx]])
            
            # Concatenate all columns.
            items = np.column_stack(allCols)

        # Ensure the predicted data is within circular definition range.
        for idx, cirInfo in colConfig.circularInfo.items():
            minV, maxV, rangeV = cirInfo.values()
            items[:, [idx]] = np.mod((items[:, [idx]] - minV), rangeV)
        
        # Transform the data back to the original distribution.
        if len(colConfig.transformFrom):
            # List all columns, perform transformation if needed.
            allCols = []

            for idx in range(0, len(items[0])):
                if idx in colConfig.transformFrom:
                    newCol = items[:,[idx]]
                    for ftn in reversed(colConfig.transformFrom[idx]):
                        newCol = ftn(newCol)
                    allCols.append(newCol)
                else:
                    allCols.append(items[:,[idx]])
            
            # Stack all new columns
            items = np.column_stack(allCols)
            
        return items

    def getPrintableItems(self, dppKey, items, recovered = True):
        '''
			Print some items into an array, with some further formatting.   --- UPDATED (Dexter) 20180717

            Parameters
            ------------------------------

            dppKey  `str`       - The key for a column configuration.

            items   `list[*+]|np.array[*+]`  - A list of items typically with original input format.

            recovered   `bool`  - Whether the data is recovered from transformation or not.

            Returns
            ------------------------------

            `list[[str,*]+]`    - A list of items in a single data column with prefix data type column.
        '''
        dataType = ""
        recoveredData = (escapeNaNNPAry(items).tolist() if items.__class__.__name__ == "ndarray" else items) if recovered else self.recoverToRawData(dppKey, items).tolist()
        is2DAry = recoveredData[0].__class__.__name__ == "list"
        if (not is2DAry) or len(recoveredData[0]) == 1:
            dataType = "Value"
            if (is2DAry):
                recoveredData = [c[0] for c in recoveredData]
        else:
            dataType = "Table"
        return [[dataType, json.dumps(i)] for i in recoveredData]

    def close(self):
        '''
			End a life cycle of using this data source.   --- UPDATED (Dexter) 20180622
        '''
        super().close()

        # Reset training/validation data.
        self.trainset = self
        self.validation = None
        self._validationTime = 0
    
    @staticmethod
    def convertCatToNumbers(column, oneHot=False, manualList=None):
        '''
			A transformation function for converting data into one-hot encoding.   --- UPDATED (Dexter) 20180622

            Parameters
            ------------------------------

            column      `np.ndarray[str]`         - The input column to be transformed

            oneHot      `bool`              - Whether to use one-hot encoding with multiple columns. Otherwise, the original column is transformed into an interger-id based values.

            manualList  `dict{str: int}`    - A pre-defined key-id map for transforming the data.

            Returns
            ------------------------------
            
            `dict{}`        - A dict object containing necessary information

            `dict{}["data"]`:   `list[list[int]]`       - The transformed data column

            `dict{}["dict"]`:   `dict{str: int}`        - A key-id map for transforming the data.
        '''
        # `column` should be a single column, while a flattening may be used if needed.
        if len(column.shape) > 1:
            column = column.reshape([-1])
        
        # If there is no `manualList`, it will be auto created.
        if manualList is None:
            manualList = {v: idx for idx, v in enumerate({*column})}
        
        # If it is one-hot encoding, split the column into several categorical columns with 1 or 0 as values; otherwise, just convert into categorial integers.
        if oneHot:
            return {"data": [[1 if c==v else 0 for c in column] for v in manualList.keys()], "dict": manualList}
        else:
            return {"data": [[manualList[c] if c in manualList else -1] for c in column], "dict": manualList}
    
    @staticmethod
    def convertNumbersToCat(columns, manualList):
        '''
			A transformation function for converting array with categorical integers to original data.   --- UPDATED (Dexter) 20190128

            Parameters
            ------------------------------

            columns     `list[list[int]]`   - One or multiple columns of indexed data.

            manualList  `dict{str: int}`    - A pre-defined key-id map for transforming the data.

            Results
            ------------------------------

            `np.ndarray[str]`     - A reverted array of the un-indexed data.

        '''
        # Return the look back value of the indexed data.
        return np.asarray([np.asarray([k for k,v in manualList.items() if v == r]) for r in columns])
    
    @staticmethod
    def getDataClassCount(array: 'np.ndarray') -> int:
        '''
            Get the categorical class count from an array.   --- UDPATED (Dexter) 20190128

            Parameters
            ------------------------------

            array    `np.ndarray<np.ndarray<(int|float|str)>>`   - An array of data.

            Returns
            ------------------------------

            `int`   - The categorical class count.
        '''
        return len({*np.reshape(array, [-1])})

    @staticmethod
    def shuffleTogether(*columns):
        '''
			Shuffle all the data together.   --- UPDATED (Dexter) 20180622

            Parameters
            ------------------------------

            *columns    `*np.ndarray<(int|float|str)>`   - One or multiple columns of data.

            Retuns
            ------------------------------

            `list<np.ndarray<(int|float|str)>>`     - The shuffled data.
        '''
        # Zip the data and convert to array.
        tempList = np.asarray(list(zip(*columns)))

        # Shuffle the data.
        np.random.shuffle(tempList)

        # Convert back to several arrays of columns.
        return (np.asarray(z) for z in zip(*tempList))

    @staticmethod
    def getColList(colCount, rangeStr:str=None)->List[int]:
        '''
			Get the indexes of a column selection.   --- UPDATED (Dexter) 20181210

            Parameters
            ------------------------------

            colCount    `int`   - The original table column count

            rangeStr         `str`   - Index range string for selecting certain columns for the transformation.

            Returns
            ------------------------------

            `list[int]`         - The list of indexes with specified column selection.
        '''
        # If no column specification requested, just return all the indexes. 
        if rangeStr is None:
            return [i for i in range(0, colCount)]

        return IndexRange.parse(colCount, rangeStr)
    
    @staticmethod
    def colSpec(nparray: 'np.ndarray', rangeStr:str=None,batchStart:str=None, batchEnd:str=None)->'np.ndarray':
        '''
			Specify certain column data by selecting some columns or batched rows of data.   --- UPDATED (Dexter) 20181210

            Parameters
            ------------------------------

            nparray     `np.ndarray<np.array<(int|float|str)>>`   - Data table to be selected.

            rangeStr    `str`   - Index range string for selecting certain columns for the transformation.

            batchStart  `int`   - The starting index (inclusive) of the data rows.

            batchEnd    `int`   - The ending index (exclusive) of the data rows.

            Returns
            ------------------------------

            `np.ndarray<np.array<(int|float|str)>>`   - Data table with requested selection range.
        '''
        # Convert to np array if it's not.
        if not isinstance(nparray, np.ndarray):
            if isinstance(nparray, list):
                try:
                    nparray = np.array(nparray)
                except:
                    raise ValueError("Data type not supported for colSpec. It should be an `np.ndarray` object.")
            else:
                raise ValueError("Data type not supported for colSpec. It should be an `np.ndarray` object.")

        # If no column specification requested, just return the orginal array with batchStart and batchEnd rows.
        if rangeStr is None:
            return nparray[batchStart:batchEnd]
        
        else:
            colCount = len(nparray[0])

            # Validate the index range range.
            if (not IndexRange.validate(colCount, rangeStr)):
                raise ValueError("Index range string is not valid.")

            # Different scenarios on the column selections:
            if ":" in rangeStr:
                # Split the ":" to find the range start and end.
                rangeInfo = [string.strip() for string in rangeStr.split(":")]

                # None should be specified for 2-valued tuples.
                if any([(ele == "None" or ele == "") for ele in rangeInfo]):
                    # Determine the scenarios for which None is used.
                    if rangeInfo[0] != "None" and len(rangeInfo[0]):
                        return nparray[batchStart:batchEnd,int(rangeInfo[0]):]
                    elif rangeInfo[1] != "None" and len(rangeInfo[1]):
                        return nparray[batchStart:batchEnd,:int(rangeInfo[1])]
                    else:
                        return nparray[batchStart:batchEnd]
                else:
                    raise nparray[batchStart:batchEnd,int(rangeInfo[0]):int(rangeInfo[1])]
            
            # Otherwise, it is specifying indexes explicitly. 
            else:
                idxs = IndexRange.parse(colCount, rangeStr)
                return nparray[batchStart:batchEnd,idxs]

class CSVSource(TableSource):
    '''
			Class representing a CSV table data source.   --- UPDATED (Dexter) 20180630
    '''
    def __init__(self, path, encoding="utf8", hasHeading = True, batchSize = 200, testRatio = 20, training = True, shuffle = True, name = ""):
        '''
			Create a CSV table data source.   --- UPDATED (Dexter) 20190128

            Parameters
            ------------------------------

            path        `str`   - The file path of the csv file.

            encoding        `str`   - Encoding format of the file.

            inputCol        `str`  - Index range string defining the columns as the model input.

            outputCol       `str`  - Index range string defining the columns as the model target.

            hasHeading      `bool`  - Whether the table has heading.

            batchSize       `int`   - Batch size when using batched training.

            testRatio       `float` - The test data proportion, in terms of %.

            training        `bool`  - Setup for training use only.

            shuffle         `bool`  - Whether the data source will be shuffled on training.

            name            `str`   - Name of this TableSource.
        '''
        # Open the CSV file.
        with open(path, encoding=encoding) as f:
            data = [*csv.reader(f)]
        
        # Convert the data into objects.
        inputData = np.vstack([np.asarray(r, dtype=object) for r in data if len(r)])
        
        super().__init__(inputArray = inputData, hasHeading = hasHeading, batchSize=batchSize, testRatio = testRatio, training=training, shuffle=shuffle, name=name)

        # `str` - The full/relative file path of the CSV file.
        self._path = path

        # `str` - The file name of the CSV file.
        self._fileName = path[max([path.rfind("/"), path.rfind("\\")])+1:]

        # `str` - The type of this @TrainSource, i.e. `"CSVSorce"`
        self._type = "CSVSource"

        # `str` - Encoding format of the file.
        self.encoding = encoding
    
    @property
    def path(self):
        '''
            The full/relative path of the CSV file to read.   --- UPDATED (Dexter) 20190206

            Returns
            ------------------------------

            `str` - The full/relative path of the CSV file to read.
        '''
        return self._path
    
    @property
    def fileName(self):
        '''
            The file name of the CSV file to read.   --- UPDATED (Dexter) 20190206

            Returns
            ------------------------------

            `str` - The file name of the CSV file to read.
        '''
        return self._fileName

class ImageSource(TrainSource):
    '''
        Class representing a centralized class for different image datasets as an input source.   --- UPDATED (Dexter) 20181209
    '''
    def __init__(self, sourceType = "cifar10", coreDataDir = None, flattenImg = False, batchSize = 64, training = True, shuffle = True):
        '''
			Create an @ImageSource object, a type of @TrainingSource handling the image data sources.   --- UPDATED (Dexter) 20190128
            
            Parameters
            ------------------------------
            
            sourceType      `str`           - The type of image source, only `cifar10`, `mnist` is supported currently.

            coreDataDir     `str`           - The directory of the data folder places.

            flattenImg      `bool`          - Whether to flatten into 1D when generating the images from the source.

            batchSize       `int`           - Batch size when using batched training.

            training        `bool`          - Whether this data source is used for training or not.

            shuffle         `bool`          - Whether this data source is shuffled for each epoch generation.
        '''
        super().__init__(batchSize = batchSize, training=training, shuffle=shuffle)
        
        # Initiate some common properties.
        # `list<int>` - The shape of the label data.
        self._labelShape = []
        # `str` - The image source type (the renowned image dataset) of this @ImageSource object. 
        self._sourceType = None
        # `str` - The type of this @TrainSource, i.e., `"ImageSource"`.
        self._type = "ImageSource"
        
        # `str` - The folder directory where the renowned data source is saved.
        self.coreDataDir = coreDataDir if (coreDataDir is not None) else ("D:/tmp/" + ("cifar10_data" if sourceType == "cirfar10" else "mnist" if sourceType == "mnist" else ""))
        # Ensure the data folder exists.
        if not os.path.exists(self.coreDataDir):
            raise ValueError("Data Folder not found")

        # `bool` - Whether to flatten into 1D when generating the images from the source
        self.flattenImg = flattenImg

        # Initiate necessary private properties.
        # `tf.Tensor` - A filename placeholder tensor for TensorFlow Dataset API to read on the image data files.
        self._fileNamesTensor = None
        # `list<str>` - A list of actual data files that the training & testing phase would extract on.
        self._fileNames = None
        # `np.ndarray` - A 4-dimension array of dimensions [batch, image height, image width, color depth], for storing all image data in case the data is pre-extracted instead of getting on-demand by handling through TensorFlow Dataset API.
        self._imgData = None
        # `np.ndarray` - A 2-dimension array of dimensions [batch, class label (must be 1)], for storing all image-label data in case the data is pre-extracted instead of getting on-demand by handling through TensorFlow Dataset API.
        self._labelData = None
        # `tf.Session` - The TensorFlow session for handling data extraction through Dataset API.
        self._sess = None
        # `tf.Graph` - The TensorFlow graph for handling data extraction through Dataset API.
        self._imgGraph = None
        # `Iterator` - The TensorFlow Dataset API iterable.
        self._itr = None
        # `tf.Tensor` - A TensorFlow tensor handling the label generation.
        self._nextLabels = None
        # `tf.Tensor` - A TensorFlow tensor handling the image generation.
        self._nextImg = None
        
        self.setSourceType(sourceType)
        
        # Prepare the iteration of the data.
        self.__prepareItr__()
    
    @property
    def sourceType(self) -> str:
        ''' 
            The source type of this @ImageSource object.   --- UPDATED (Dexter) 20190131

            Returns
            ------------------------------

            `str` - The source type.
        '''
        return self._sourceType
    
    @property
    def labelShape(self) -> List[int]:
        '''
            The label shape of this @ImageSource object.   --- UPDATED (Dexter) 20190131

            Returns
            ------------------------------

            `list<int>` - The label shape.
        '''
        return self._labelShape
    
    def setSourceType(self, sourceType: str):
        '''
            Set the source type of this @ImageSource object.   --- UPDATED (Dexter) 20190131

            Parameters
            ------------------------------

            `str` - The source type string.
        '''
        # Set the data source shape.
        inputItemShape = [32,32,3] if sourceType == "cifar10" else [28,28,1] if sourceType == "mnist" else []
        self._sourceType = sourceType
        self.setDataShape(["None", *inputItemShape])

        # The shape of the column configs will be manually setup depending on the source type as like the shape of the output Tensors.
        dppConfig = DataPreprocessing.ImageNode(tf.float32, ["Image"])
        self["input"] = dppConfig

        # Set label shapes.
        if sourceType in ["cifar10", "stl10-labeld", "mnist"]:
            self._labelShape = [None, 1]
            
        # Set the epoch size and Dataset API-related file names.
        if (sourceType == "cifar10"):
            self._fileNames = [self.coreDataDir +'/cifar-10-batches-bin/data_batch_%d.bin' % i for i in range(1, 6)] if self.training else [self.coreDataDir +'/cifar-10-batches-bin/test_batch.bin']
            self.epochSize = 50000 if self.training else 10000
        elif (sourceType == "stl10-labeled"):
            self.epochSize = 5000 if self.training else 8000
        elif (sourceType == "mnist"):
            self.epochSize = 60000 if self.training else 10000

        # Preset with a crop transformation for specific datasets.
        if (sourceType in ["cifar10"]):
            tx = DataPreprocessing.Transformation.Image.Crop(self.oriShape[2], self.oriShape[1])
            self.setTransform("input", tx)

        # Set the data type of the column config.
        if (sourceType in ["cifar10", "stl10-labeld", "mnist"]):
            targetDpp = DataPreprocessing.ColumnsNode(dtype = tf.int64)
            self["target"] = targetDpp
            self.colConfigs["target"].asType(tf.int64)

    def getColShape(self, dppKey: str, requestingDppKey: str = None, refresh: bool = False) -> List[int]:
        '''
            Get the output shape of the parent of a @DataPreprocessing.Node object.   --- UPDATED (Dexter) 20190130

            Parameters
            ------------------------------
            
            dppKey              `str`   - A parent column config key.

            requestingDppKey    `str`   - The column config key of the requesting @DataPreprocessing.Node object. `None` if it's not requesting the preprocessing shape from another preprocessing node.

            refresh             `bool`  - Whether to refresh the shape from root data.

            Returns
            ------------------------------

            `list<int>` - The output shape.
        '''
        if (dppKey in self.colConfigs):
            return self.colConfigs[dppKey].getShape(refresh)
        elif (requestingDppKey is not None):
            return self.oriShape if requestingDppKey == "input" else self.labelShape if requestingDppKey == "target" else []

    def getHeader(self, dppNodeKey = None, step = None) -> List[str]:
        '''
            Get the header names of a particular data preprocessing node.   --- UPDATED (Dexter) 20190317
            
            Parameters
            ------------------------------

            dppNodeKey  `str`   - The key for a @DataPreprocessing.Node object in @ImageSource.colConfigs .

            Returns
            ------------------------------

            `list<str>`  - A list of header names.
        '''
        return ["Images"] if dppNodeKey == "input" else ["Class Labels"] if dppNodeKey == "target" else ["Images", "Class Labels"]
    
    def getClassCount(self, dppKey = None) -> int:
        '''
            Get the class count of all values in a particular column config.   --- UPDATED (Dexter) 20190125

            Parameters
            ------------------------------

            dppKey - The key for the requested @DataPreprocessing.ColumnsNode object in @TrainSource.colConfigs .

            Returns
            ------------------------------

            - The class count of all values in the requested column config.
        '''
        if (dppKey == "target"):
            if (self.sourceType in ["cifar10", "stl10-labeled", "mnist"]):
                return 10
            else:
                raise ValueError("Source type not supported.")
        else:
            raise ValueError("Class count cannot be determined on the image data.")
    
    def setTransform(self, dppNodeKey: str = "input", transforamtionConfig: 'DataPreprocessing.Transformation.Image' = None):
        '''
            Transform data in a particular @DataPreprocessing.Transformation.Image preprocessing node.   --- UPDATED (Dexter) 20190130

            Parameters
            ------------------------------

            dppNodeKey - The data preprocessing key that is to be applied with.

            transforamtionConfig - A transformation configuration object.
        '''
        self.colConfigs[dppNodeKey].transformations.append(transforamtionConfig)

    def copyConfigAsNewSource(self, training = False):
        '''
			Copy the image configuration, but may switch the training/testing source of data. This is useful for similiar data files as defined for train/test uses in some common datasets.   --- UPDATED (Dexter) 20180725

            Parameters
            ------------------------------

            training    `bool`  - Setup for training use only.

            Returns
            ------------------------------

            `ImageSource`   - The new ImageSource object with the same configuration as this ImageSource object.
        '''
        return ImageSource(sourceType = self.sourceType, coreDataDir=self.coreDataDir, flattenImg=self.flattenImg, 
                            batchSize=self.batchSize, training=training, shuffle = False)

    def __prepareItr__(self):
        '''
			Create the TensorFlow Graph using TensorFlow Dataset API for image source iteration.   --- UPDATED (Dexter) 20190131
        '''
        # 1. Prepare a standalone TF Graph for the input pipeline and define necessary variables.
        self._imgGraph = g = tf.Graph()
        batchSize = self.batchSize
        training = self.training
        sourceType = self.sourceType

        # 2. Set as unitialized at first, and intialize one data is needed.
        self._initialized = False

        with g.as_default():
            if (sourceType == "cifar10" or sourceType == "stl10"):
                # 3. Prepare the data iterator and get data images from the input pipeline.
                self._fileNamesTensor = tf.placeholder(tf.string, shape=[None])
                imgBytes = functools.reduce(lambda a,b: a*b, self["input"].getShape()[1:], 1)
                targetBytes = 1
                dataset = tf.data.FixedLengthRecordDataset(self._fileNames, imgBytes+targetBytes)
                dataset = dataset.map(self.mapNormalizedImgWithDistortion if training else self.mapNormalizedImg)
                if (self.shuffle): dataset = dataset.shuffle(buffer_size=50000, reshuffle_each_iteration=True)
                dataset = dataset.repeat()
                dataset = dataset.batch(batchSize)
                self._itr = itr =  dataset.make_initializable_iterator()

                # 4. Shape the to-be iterated results well for output.
                itrNext = itr.get_next()
                self._nextLabels = tf.reshape(itrNext[0], [batchSize, 1])
                outputItemShape = self["input"].getShape()[1:]
                self._nextImg = tf.reshape(itrNext[1], [batchSize, outputItemShape[2], outputItemShape[0]*outputItemShape[1]]) if (self.flattenImg) else tf.reshape(itrNext[1], [batchSize, outputItemShape[0], outputItemShape[1], outputItemShape[2]])
            elif (sourceType == "mnist"):
                # Get the files that will read.
                imageFile = 'train-images.idx3-ubyte' if training else 't10k-images.idx3-ubyte'
                labelFile = 'train-labels.idx1-ubyte' if training else 't10k-labels.idx1-ubyte'

                # Read the image and label files.
                with open(self.coreDataDir + imageFile, "rb") as f:
                    magicNo, imageCount = struct.unpack(">II", f.read(8))
                    shape = struct.unpack(">II", f.read(8))
                    imgRawShape = self["input"].getInputShape()[1:]
                    self._imgData = np.array(list(f.read())).reshape(self.epochSize,imgRawShape[0],imgRawShape[1],imgRawShape[2])/255
                
                with open(self.coreDataDir + labelFile, "rb") as f:
                    magicNo, imageCount = struct.unpack(">II", f.read(8))
                    self._labelData = np.array(list(f.read())).reshape(self.epochSize,1)
                
                # Reset the iteration index.
                self._itrIdx = 0

                # Shuffle the image and label data.
                if (self.shuffle):
                    self._imgData, self._labelData = TableSource.shuffleTogether(self._imgData, self._labelData)

    def mapImg(self, tfDatasetEle):
        '''
			Map iteration of a TensorFlow Dataset element, to get the image and its label from bytes.   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            tfDatasetEle    `*`   - A TensorFlow Dataset element, the bytes for a single image (with its label).

            Returns
            ------------------------------

            tuple( tf.int32 , tf.Tensor ( shape: [`self.dataImgH`, `self.dataImgW`, `self.dataImgD`] ) )

            A tuple of the image class label, and the image pixel data with dimension (height, width, depth).
        '''
        imgRawShape = self["input"].getInputShape()[1:]
        imgBytes = functools.reduce(lambda a,b: a*b, imgRawShape, 1)
        targetBytes = 1

        # Slice the reading bytes according to the data source size definitions, and transform into a 3D array
        return (tf.cast(tf.strided_slice(tf.decode_raw(tfDatasetEle, tf.uint8), [0], [targetBytes]), tf.int32),
                tf.transpose(tf.reshape(tf.strided_slice(tf.decode_raw(tfDatasetEle, tf.uint8), [targetBytes],[targetBytes + imgBytes]),[imgRawShape[2], imgRawShape[0], imgRawShape[1]]), [1,2,0]))
    
    def mapNormalizedImgWithDistortion(self, tfDatasetEle):
        '''
			Map iteration of a TensorFlow Dataset element, to transform a normalized image with artifitial distortion.   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            tfDatasetEle    `*`   - A TensorFlow Dataset element, the bytes for a single image (with its label).

            Returns
            ------------------------------

            tuple( tf.int32 ,  tf.Tensor ( shape: [`self.dataImgH`, `self.dataImgW`, `self.dataImgD`] ) )

            A tuple of the image class label, and the image pixel data with dimension (height, width, depth).
        '''
        # 1. Get the image from reading the bytes
        label, unit8Img = self.mapImg(tfDatasetEle)
        
        # 2. Prepare the Tensor to be float32, as we've to normalize later
        floatImg = tf.cast(unit8Img, tf.float32)

        # 3. Crop and fit the data as requested output size, then perform artificial image distortion
        cropImgShape = self["input"].getShape()[1:]
        transformedImg = tf.random_crop(floatImg, [*cropImgShape])
        transformedImg = tf.image.random_flip_left_right(transformedImg)
        transformedImg = tf.image.random_brightness(transformedImg, max_delta=63)
        transformedImg = tf.image.random_contrast(transformedImg, lower=0.2, upper=1.8)

        # 4. Normalize the pixels to range [0,1]
        outputImg = transformedImg/255

        # 5. Set the shape of the label and outputImg Tensors
        label.set_shape([1])
        outputImg.set_shape([*cropImgShape])

        # 6. (Optional) Flatten the images to D-H*W if needed (like traditional Auto Encoder)
        if (self.flattenImg):
            outputImg = tf.transpose(outputImg, perm=[2,0,1])
            outputImg = tf.reshape(outputImg, [3, -1])
        
        return (label, outputImg)

    def mapNormalizedImg(self, tfDatasetEle):
        '''
			Map iteration of a TensorFlow Dataset element, to transform a normalized image.   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            tfDatasetEle    `*`   - A TensorFlow Dataset element, the bytes for a single image (with its label).

            Returns
            ------------------------------

            tuple( tf.int32 ,  tf.Tensor ( shape: [`self.dataImgH`, `self.dataImgW`, `self.dataImgD`] ) )

            A tuple of the image class label, and the image pixel data with dimension (height, width, depth).
        '''
        # 1. Get the image from reading the bytes
        label, unit8Img = self.mapImg(tfDatasetEle)
        
        # 2. Prepare the Tensor to be float32, as we've to normalize later
        floatImg = tf.cast(unit8Img, tf.float32)

        # 3. Crop and fit the data as requested output size
        outputImgSize = self["input"].getShape()[1:]
        resizedImg = tf.image.resize_image_with_crop_or_pad(floatImg, outputImgSize[0], outputImgSize[1])
        
        # 3. Normalize the pixels to range [0,1]
        outputImg = resizedImg/255

        # 4. Set the shape of the label and outputImg Tensors
        label.set_shape([1])
        outputImg.set_shape([*outputImgSize])

        # 5. (Optional) Flatten the images to D-H*W if needed (like traditional Auto Encoder)
        if (self.flattenImg):
            outputImg = tf.transpose(outputImg, perm=[2,0,1])
            outputImg = tf.reshape(outputImg, [3, -1])

        return (label, outputImg)
    
    def __next__(self):
        '''
			Get the next batch of image.   --- UPDATED (Dexter) 20190209

            Returns
            ------------------------------

            `dict{str:[*]}` - Depending on whether labels are needed, the list will contains 2 arrays of labels and images respectively.
        '''
        if (self.sourceType == "cifar10" or self.sourceType == "stl10"):
            # Initialize the data if it is not initialized.
            if (not self._initialized):
                self._sess = tf.InteractiveSession(graph=self._imgGraph)
                self._sess.run(self._itr.initializer, feed_dict={self._fileNamesTensor: self._fileNames})
                self._initialized = True
            
            # Prepare the next batch of data.
            return self._sess.run({"target": self._nextLabels, "input": self._nextImg})

        elif (self.sourceType == "mnist"):
            # Initialize the data if it is not initialized.
            if (not self._initialized):
                self._initialized = True

            # 2. Get an index and batch size
            i = self._itrIdx
            batchSize = self.batchSize

            # 3. If this batch has touched the end of the epoch, regenerate the data 
            if ((i+1)*batchSize > self.epochSize):
                self.__prepareItr__()
                i = self._itrIdx
            
            # 4. Get the data as according to the default or specially indexed data
            returnObj = {colName: c[i*batchSize:(i+1)*batchSize] for colName, c in {"input": self._imgData, "target": self._labelData}.items()}
            
            # 5. Increment the index and return all the data
            self._itrIdx += 1
            return returnObj
    
    def close(self):
        '''
			Close and free the resources for the input pipeline.   --- UPDATED (Dexter) 20180725
        '''
        if (self._sess): self._sess.close()
        self._initialized = False
    
    def __getRandItems__(self, n):
        '''
			Sample n items from the dataset.   --- BETA --- UPDATED (Dexter) 20180713
            
            Parameters
            ------------------------------

            n   `int`   - Number of items to get.
        '''
        # Initiate the return object. TODOTODO
        returnObj = {"target": [], "input": []} if self.training else {"input": []}

        # Create a temporary source with shuffling but not training use.
        tmpSource = self.copyConfigAsNewSource()
        tmpSource.changeItrConfig(shuffle=True, training=False)

        # Get the items from the temp source.
        while (n > 0):
            newImgs = next(tmpSource)
            for k,v in newImgs.items():
                returnObj[k] += v.tolist()[:n]
            n -= self.batchSize

        tmpSource.close()

        return returnObj
    
    def recoverToRawData(self, dppKey, items):
        '''
			Recover data items to raw-data format of the predicted data, like undo normalization.   --- UPDATED (Dexter) 20180725

            Parameters
            ------------------------------

            dppKey      `str`                   - The column config of the data.

            items       `np.ndarray|list[*+]`   - A list of data items.

            Returns
            ------------------------------

            `np.ndarray|list`    - A list of recovered data items.
        '''
        # Convert to np array for the predicted data.
        items = np.asarray(items)
        if self.sourceType in ["cifar10", "mnist"]:
            if dppKey == "input":
                return items*255
            else:
                return items

    def getPrintableItems(self, dppKey, items, recovered = True):
        '''
			Print some items into an array, with some further formatting.   --- UPDATED (Dexter) 20180725

            Parameters
            ------------------------------

            dppKey  `str`       - The key for a column configuration.

            items   `list[*+]`  - A list of items typically with original input format.

            recovered   `bool`  - Whether the data is recovered from transformation or not.

            Return
            ------------------------------

            `list[[str,*]+]`    - A list of items in a single data column with prefix data type column.
        '''
        dataType = ""
        if self.sourceType in ["cifar10", "mnist"]:
            if dppKey == "input":
                dataType = "Image"
            else:
                dataType = "Value"
        return [[dataType, json.dumps(i.tolist())] for i in (items if recovered else self.recoverToRawData(dppKey, items))]
        
class TrainSourceData():
    '''
			Class representing a structured data corresponding to a training object.   --- UPDATED (Dexter) 20180713
    '''
    def __init__(self, train, sourceData):
        '''
			Create a validated structured source data object that mirrors the training object structure.   --- UPDATED (Dexter) 20180713

            Parameters
            ------------------------------

            train       `Train`       - The training object that this source data follows with.

            sourceData  `list[dict]`    - A list structure data according to the list of data sources, with the data mapped using a dict structure as if different column configurations.
        '''
        # Ensure the source lengths match.
        if len(sourceData) != len(train.sources):
            raise ValueError("The number of sources does not match.")
        
        self.data = [dict() for i in range(0, len(sourceData))]

        # Loop over different sources.
        for idx,s in enumerate(sourceData):
            for key,val in s.items():
                # Ensure the source config exists.
                if key not in train.sources[idx]:
                    raise ValueError(key + " does not exist in the original source.")
                
                # Push the data into this TrainSourceData.
                self.data[idx][key] = sourceData[idx][key]
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self,idx):
        return self.data[idx]

class Event():
    '''
			Class representing an event.    --- UPDATED (Dexter) 20180622
    '''
    def __init__(self, typeArg, eventInit):
        '''
			Create an event.    --- UPDATED (Dexter) 20180622

            Parameters
            ------------------------------

            typeArg     `str`           - The event type of this event.

            eventInit   `dict{str: *}`  - The event initiation object.
        '''
        self._type = typeArg
        self._defaultPrevented = False
        self._target = eventInit["target"] if "target" in eventInit else None

    @property
    def defaultPrevented(self):
        '''
			Property of whether the event is prevented for the default behaviour.    --- UPDATED (Dexter) 20180622

            Returns
            ------------------------------

            `bool`      - Boolean value of whether default behaviour is prevented.
        '''
        return self._defaultPrevented

    @property
    def target(self):
        '''
			Get the target object of this event.    --- UPDATED (Dexter) 20180622

            Returns
            ------------------------------

            `*`         - The Event target.
        '''
        return self._target
    
    @property
    def type(self):
        '''
			Get the type name of this event.    --- UPDATED (Dexter) 20180622

            Returns
            ------------------------------

            `str`        - The Event type.
        '''
        return self._type

    def preventDefault(self):
        '''
			Prevent default behaviour of this event.    --- UPDATED (Dexter) 20180622
        '''
        self._defaultPrevented = True

class BuildEvent(Event):
    '''
			Class representing a training build event, typically on building a new unique model.   --- UPDATED (Dexter) 20181028
    '''
    def __init__(self, typeArg, buildEventInit):
        '''
			Create a new BuildEvent.   --- UPDATED (Dexter) 20181028
            
            Parameters
            ------------------------------

            typeArg     `str`           - The event type of this event.

            eventInit   `dict{str: *}`  - The event initiation object.
        '''
        # Ensure the type is one of the build events.
        if typeArg not in ["buildstart", "buildend"]:
            raise ValueError("BuildEvent can only have `buildstart` or `buildend`.")
        
        # Create the event, and assign specific event attributes.
        super().__init__(typeArg, buildEventInit)
        self.buildNo = buildEventInit["buildNo"] if "buildNo" in buildEventInit else -1
        self.runNo = buildEventInit["runNo"] if "runNo" in buildEventInit else -1
        self.cvNo = buildEventInit["cvNo"] if "cvNo" in buildEventInit else -1

class TrainEvent(Event):
    '''
			Class representing a training train event, typically on training a model.   --- UPDATED (Dexter) 20181028
    '''
    def __init__(self, typeArg, trainEventInit):
        '''
			Create a new TrainEvent.   --- UPDATED (Dexter) 20181028
            
            Parameters
            ------------------------------

            typeArg     `str`           - The event type of this event.

            eventInit   `dict{str: *}`  - The event initiation object.
        '''
        # Ensure the type is one of the train events.
        if typeArg not in ["trainbuild", "trainstart", "trainend"]:
            raise ValueError("BuildEvent can only have `trainbuild`, `trainstart` or `trainend`.")

        # Create the event, and assign specific event attributes.
        super().__init__(typeArg, trainEventInit)
        self.buildNo = trainEventInit["buildNo"] if "buildNo" in trainEventInit else -1
        self.runNo = trainEventInit["runNo"] if "runNo" in trainEventInit else -1
        self.cvNo = trainEventInit["cvNo"] if "cvNo" in trainEventInit else -1
        self.trainingProfile = trainEventInit["trainingProfile"] if "trainingProfile" in trainEventInit else None
            
class StepEvent(Event):
    '''
			Class representing a training step event, typically on training step when training a model.   --- UPDATED (Dexter) 20181028
    '''
    def __init__(self, typeArg, stepEventInit):
        '''
			Create a new StepEvent.   --- UPDATED (Dexter) 20181028
            
            Parameters
            ------------------------------

            typeArg     `str`           - The event type of this event.

            eventInit   `dict{str: *}`  - The event initiation object.
        '''
        # Ensure the type is one of the step events.
        if typeArg not in ["stepprepare", "stepstart", "stepend"]:
            raise ValueError("StepEvent can only have `stepbuild`, `stepstart` or `stepend`.")
        
        # Create the event, and assign specific event attributes.
        super().__init__(typeArg, stepEventInit)
        self.buildNo = stepEventInit["buildNo"] if "buildNo" in stepEventInit else -1
        self.runNo = stepEventInit["runNo"] if "runNo" in stepEventInit else -1
        self.cvNo = stepEventInit["cvNo"] if "cvNo" in stepEventInit else -1
        self.trainingProfile = stepEventInit["trainingProfile"] if "trainingProfile" in stepEventInit else None
        self.i = stepEventInit["i"] if "i" in stepEventInit else -1
        self.localStep = stepEventInit["localStep"] if "localStep" in stepEventInit else -1
        self.globalStep = stepEventInit["globalStep"] if "globalStep" in stepEventInit else -1
        self.feedDict = stepEventInit["feedDict"] if "feedDict" in stepEventInit else None
        self.totalLoss = stepEventInit["totalLoss"] if "totalLoss" in stepEventInit else None
        self.avgLoss = stepEventInit["avgLoss"] if "avgLoss" in stepEventInit else None

class EpochEvent(Event):
    '''
			Class representing a epoch event, typically on finishing an epoch when training a model.   --- UPDATED (Dexter) 20181028
    '''
    def __init__(self, typeArg, epochEventInit):
        '''
			Create a new EpochEvent.   --- UPDATED (Dexter) 20181028
            
            Parameters
            ------------------------------

            typeArg     `str`           - The event type of this event.

            eventInit   `dict{str: *}`  - The event initiation object.
        '''
        # Ensure the type is one of the epoch events.
        if typeArg not in ["epochstart", "epochend"]:
            raise ValueError("EpochEvent can only have `epochstart` or `epochend`.")

        # Create the event, and assign specific event attributes.
        super().__init__(typeArg, epochEventInit)
        self.runNo = epochEventInit["runNo"] if "runNo" in epochEventInit else -1
        self.cvNo = epochEventInit["cvNo"] if "cvNo" in epochEventInit else -1
        self.buildNo = epochEventInit["buildNo"] if "buildNo" in epochEventInit else -1
        self.trainingProfile = epochEventInit["trainingProfile"] if "trainingProfile" in epochEventInit else None
        self.i = epochEventInit["i"] if "i" in epochEventInit else -1
        self.localStep = epochEventInit["localStep"] if "localStep" in epochEventInit else -1
        self.globalStep = epochEventInit["globalStep"] if "globalStep" in epochEventInit else -1
        self.inputSources = epochEventInit["inputSources"] if "inputSources" in epochEventInit else None
            
class Train():
    '''
			Class representing an object for catering TensorFlow training and implementation.   --- UPDATED (Dexter) 20181028
    '''
    def __init__(self, trainName: str = "train", folder: str = "D:/tmp/", restorePath: Optional[str] = None, device: str = '/cpu:0', 
                logFreq: int = 0, saveFreq: int = 0, testFreq: int = 0, traceFreq: int = 0, weightLogFreq: int = 0, filterFreq: int = 0, 
                source: Optional[Union['TrainSource', List['TrainSource']]] = None, testSource: Optional[Union['TrainSource', List['TrainSource']]] = None, 
                runCount: Optional[int] = None, trainingProfile: Optional[Union['TrainingProfile', List['TrainingProfile']]] = None, traceRecord: int = 0):
        '''
			Create a Train object.   --- UPDATED (Dexter) 20190119

            Parameters
            ------------------------------

            trainName           `str`       - The name of this training.

            folder              `str`       - The folder that this training results folder will save to.

            restorePath         `str`       - A directory that referencing TensorFlow checkpoint files that this training will recover from.

            device              `str`       - The device like CPU or GPU this training will rely on.

            logFreq             `int`       - The train logging frequency (per training step).

            saveFreq            `int`       - The model saving frequency (per training step).

            testFreq            `int`       - The test (with either validation or test dataset) frequency (per training step).

            traceFreq           `int`       - The trace logging frequency (per training step).

            weightLogFreq       `int`       - The weight logging frequency (per training step).

            filterFreq          `int`       - The image filter logging frequency (per training step).   --- RESERVED

            source              `TrainSource|list[TrainSource]`         - A training source or a list of training source that this training is using.

            testSource          `TrainSource|list[TrainSource]`         - A testing source or a list of training source that this training is using.

            runCount             `int`       - The count of multi-run setup.

            trainingProfile     `TrainingProfile|list[TrainingProfile]` - The training profile configuration this training is using.

            traceRecord         `int`       - The count of records to trace with along the training.
        '''
        # Define folder-related names, and create folder if needed.
        self.trainName = trainName
        self.trainTime = TimeHelper.getDateTimeStr(timeExpr="hhmmss")
        self.folder = folder if folder is not None else ""
        os.makedirs(self.folder + "outputLogs/" + self.trainTime + "/", exist_ok=True)
        os.makedirs(self.folder + "builds/" + self.trainTime + "/", exist_ok=True)
        os.makedirs(self.folder + "tmpLogs/" + self.trainTime + "/", exist_ok=True)
        self.restorePath = restorePath

        # Define log frequencies.
        self.logFreq = math.inf if logFreq == -1 else logFreq
        self.saveFreq = saveFreq
        self.testFreq = math.inf if testFreq == -1 else testFreq
        self.testLogger = None
        self.traceFreq = math.inf if traceFreq == -1 else traceFreq
        self.weightLogFreq = math.inf if weightLogFreq == -1 else weightLogFreq
        self.filterFreq = math.inf if filterFreq == -1 else filterFreq
        self._printTensors = []
                
        # Define the device.
        self.device = device

        # Define the layers, training sources and training profiles.
        self.layerProfiles = {}
        # Raise Errors for `trainingProfile` not matching TrainingProfile type.
        if (trainingProfile is not None and ((classof(trainingProfile) != "list" and (not issubclass(trainingProfile.__class__, TrainingProfile))) or (classof(trainingProfile) == "list" and any([(not issubclass(tp.__class__, TrainingProfile)) for tp in trainingProfile])))):
            raise ValueError("`trainingProfile` parameters should be a `TrainingProfile` object.")
        self.trainingProfiles = [trainingProfile or TrainingProfile()] if classof(trainingProfile) != "list" else trainingProfile
        # Raise Errors for `source` not matching TrainSource type.
        if (source is not None and ((classof(source) != "list" and (not issubclass(source.__class__, TrainSource))) or (classof(source) == "list" and any([(not issubclass(s.__class__, TrainSource)) for s in source])))):
            raise ValueError("`source` parameters should be a `TrainSource` object.")
        self.sources = []
        if classof(source) == "list":
            self.setDataSources(*source)
        elif source is not None:
            self.addDataSource(source)
        # Raise Errors for `testSource` not matching TrainSource type.
        if (testSource is not None and ((classof(testSource) != "list" and (not issubclass(testSource.__class__, TrainSource))) or (classof(testSource) == "list" and any([(not issubclass(s.__class__, TrainSource)) for s in testSource])))):
            raise ValueError("`testSource` parameters should be a `TrainSource` object.")
        self.testSources = []
        if classof(testSource) == "list":
            self.testSources = testSource
        elif testSource is not None:
            self.testSources = [testSource]
        self._sourceTensors = []
        self._editingBuild = 0
        self._evalSources = None

        # Define record tracing-related items.
        self.traceRecord = traceRecord
        self.traceItems = []

        # Define graph and training-related items.
        if (runCount is not None and runCount <= 0):
            raise ValueError("The given value of runCount is inappropriate.")
        self.runCount = runCount if runCount is not None else 1
        self._graph = self._sess = None
        self._built = False; self._buildNo = -1; self._runNo = -1; self._cvNo = -1
        self.localStep = 0; self.globalStep = 0
        self.localStepTensor = 0; self.globalStepTensor = 0
        self._bnTensor = None
        
        # Define an auto-increaing id for layer auto-naming.
        self._layerIDInc = 0

        # Define an event functions holder.
        self._eventFtns = {eType: [] for eType in ["buildstart", "buildend", "stepprepare", "stepstart", "stepend", 
                                                    "epochstart", "epochend", "trainbuild", "trainstart", "trainend"]}

    def __repr__(self):
        '''
			Get a string representation of this log table.   --- UPDATED (Dexter) 20181028

            Returns
            ------------------------------

            `str`   - The representation including the row and column count.
        '''
        return "<Train: name: \"" + self.trainName + "\", run times: " + self.runCount + ", no. of layers: " + str(self.size) + ">"

    def __len__(self):
        '''
			The length of the training is the number of build times number of runs.   --- UPDATED (Dexter) 20181028
        '''
        return len(self.trainingProfiles) * self.runCount

    @staticmethod
    def activationFunctions(string):
        '''
			Get an activation function from a key.   --- UPDATED (Dexter) 20180623

            Returns
            ------------------------------

            `Function`   - A calling function for the activation function.
        '''
        return {"relu": tf.nn.relu, "relu6": tf.nn.relu6, "crelu": tf.nn.crelu, "elu": tf.nn.elu,
                "selu": tf.nn.selu, "softplus": tf.nn.softplus, "softsign": tf.nn.softsign,
                "sigmoid": tf.nn.sigmoid, "tanh": tf.nn.tanh, "hardSigmoid": tf.keras.backend.hard_sigmoid,
                "linear": lambda x: x }[string.lower()]

    @staticmethod
    def optimizers(string):
        '''
			Get an optimizer function from a key.   --- UPDATED (Dexter) 20180623

            Returns
            ------------------------------

            `Function`   - A calling function for the optimizer function.
        '''
        return {"rmsprop": tf.train.RMSPropOptimizer, "adam": tf.train.AdamOptimizer, 
                "grad": tf.train.GradientDescentOptimizer, "momentum": tf.train.MomentumOptimizer,
                "adagrad": tf.train.AdagradOptimizer, "ftrl": tf.train.FtrlOptimizer, 
                "nadam": tf.keras.optimizers.Nadam, "adamax": tf.keras.optimizers.Adamax,
                "adadelta": tf.train.AdadeltaOptimizer}[string.lower()]

    @property
    def buildNo(self):
        '''
			Get the build no, the building state of this training.   --- UPDATED (Dexter) 20180623

            Returns
            ------------------------------

            `int`   - The current build number.
        '''
        return self._buildNo
    
    @property
    def size(self):
        '''
			Count the number of layers in this training.   --- UPDATED (Dexter) 20180623

            Returns
            ------------------------------

            `int`   - The total count of all layers in this training.
        '''
        return len(self.layerProfiles)

    @property
    def length(self):
        '''
			Alias for returning the length of this training.   --- UPDATED (Dexter) 20181028
        '''
        return len(self)

    def getNewLayerID(self):
        '''
			Get a unique positive id, typically for creating a new layer.   --- UPDATED (Dexter) 20180623

            Returns
            ------------------------------

            `int`   - A new integer as the layer id.
        '''
        # Get the current number and increment it for next-time use.
        toID = self._layerIDInc
        self._layerIDInc += 1

        # Return the id.
        return toID

    def dispatchEvent(self, event):
        '''
			Dispatch an event, typically firing actions based on some event-criteria.   --- UPDATED (Dexter) 20180623

            Parameters
            ------------------------------

            `Event`     - An event to be dispatched.
        '''
        for ftn in self._eventFtns[event.type]:
            ftn(event)

    @staticmethod
    def createVar(name: str, shape: List[int], initializer: 'VarConfig.IInitializer|tf.initializers', device: str = None, dtype: 'tf.DType' = tf.float32, l1loss: bool = False, l2loss: bool = False, weightDecayRate: float = None):
        '''
			Create a new training variable.   --- DEPRECATED --- UPDATED (Dexter) 20190210

            Parameters
            ------------------------------

            name                `str`           - The variable name.

            shape               `list(int+)`    - The shape of the variable.

            initializer         `VarConfig.IInitializer|tf.initializers`   - An initializer for the variable.

            device              `str`           - The device like CPU or GPU this training will rely on.

            dtype               `tf.DType`      - The data type of this variable.

            l1loss              `bool`          - Whether to take L1-loss on this variable. 

            l2loss              `bool`          - Whether to take L2-loss on this variable.

            weightDecayRate     `float`         - The constant for weighting L2-loss of this variable.
        '''
        varConfig = VarConfig(l1Loss = l1loss, l2Loss=l2loss, l2Decay=weightDecayRate, initializer=initializer, device=device)
        return varConfig.create(name, shape, dtype)
    
    @staticmethod
    def creatVarFromConfig(name: str, shape: List[int], dtype: 'tf.DType' = tf.float32, config: 'VarConfig' = None):
        '''
			Create a new training variable based on a configuration.   --- DEPRECATED --- UPDATED (Dexter) 20181003

            Parameters
            ------------------------------

            name                `str`           - The variable name.

            shape               `list(int+)`    - The shape of the variable.

            dtype               `tf.DType`      - The data type of this variable.

            config              `bool`          - Whether to take L1-loss on this variable. [deprecated]
        '''
        return config.create(name, shape, dtype)

    @staticmethod
    def createNormDistVar(name, shape,mean=0, stdDev=5e-2, l1loss = False, l2loss = False, weightDecayRate=None, dtype=tf.float32):
        '''
			Create a new training variable with normally distributed initalizing values.   --- DEPRECATED --- UPDATED (Dexter) 20180623

            Parameters
            ------------------------------

            name                `str`           - The variable name.

            shape               `list(int+)`    - The shape of the variable.

            mean                `float`         - The initializing mean value.

            stdDev              `float`         - The initializing values standard deviation.

            device              `str`           - The device like CPU or GPU this training will rely on.

            l1loss              `bool`          - Whether to take L1-loss on this variable.

            l2loss              `bool`          - Whether to take L2-loss on this variable.

            weightDecayRate     `float`         - The constant for weighting L2-loss of this variable.

            dtype               `tf.DType`      - The data type of this variable.
        '''
        # Handler for `Train.createVar()` method but with a `tf.truncated_normal_initalizer`
        return Train.createVar(name, shape, VarConfig.TruncatedNormal(mean=mean,stddev=stdDev), l1loss = l1loss, l2loss = l2loss, weightDecayRate = weightDecayRate, dtype=dtype)
    
    def setSequentialTraining(self, *trainingProfiles: 'TrainingProfile'):
        '''
			Set sequential training by applying several training profiles.   --- UPDATED (Dexter) 20180623

            Parameters
            ------------------------------

            *trainingProfiles   `TrainingProfile+`  - Multi-build training configurations in a sequential order.
        '''
        # Ensure the training has not been built yet.
        if self._built:
            raise ValueError("Training Profile cannot be modified during training processes. Please consider to close this training before update the training profile.")
        
        # Raise Errors for not matching TrainingProfile type.
        if any([(trainingProfile is not None and ((classof(trainingProfile) != "list" and (not issubclass(trainingProfile.__class__, TrainingProfile))) or (classof(trainingProfile) == "list" and any([(not issubclass(tp.__class__, TrainingProfile)) for tp in trainingProfile])))) for trainingProfile in trainingProfiles]):
            raise ValueError("`trainingProfile` parameters should be a `TrainingProfile` object.")
        
        # Assign the training profiles.
        self.trainingProfiles = trainingProfiles

    def __build__(self, buildNo: int = 0):
        '''
			Build the TensorFlow Graph of the model.   --- UPDATED (Dexter) 20190208

            Parameters
            ------------------------------

            buildNo    `int`   - The build number of this training build.
        '''
        # 1. Create TensorFlow Graph and Session for building training model
        tf.reset_default_graph()
        self._graph = g = tf.Graph()
        self._buildNo = buildNo
        
        # 2. Dispatch buildstart event
        bs = BuildEvent("buildstart", {"target": self, "buildno": self._buildNo})
        self.dispatchEvent(bs)

        # 3. If buildstartevent is not prevented, it will go over the default model building
        if not bs.defaultPrevented:
            with g.as_default():
                # 30. Prepare a step variable.
                self.globalStepTensor = tfGlobalStep = tf.train.get_or_create_global_step()
                assignStep = tfGlobalStep.assign(self.globalStep)
                self.localStepTensor = tf.Variable(self.localStep, trainable=False, dtype=tf.int64)

                # 3A. For all Train Sources, build the placeholder Tensors
                self._sourceTensors = [x.getTensors() for x in self.sources]
                if len(self._sourceTensors) == 0:
                    raise ValueError("There is no training data sources.")

                # 3B.   Attach a final layer node if there is no final layer defined.
                if (len(self.getFinalLayers(buildNo=buildNo)) == 0):
                    targetTensors = [(idx,t) for idx,t in enumerate(self._sourceTensors) if "target" in t.keys()]
                    targetLen = len(targetTensors)
                    #   If more than 1 target tensor found, it can't be automated.
                    if (targetLen > 1):
                        raise ValueError("There is too many target tasks that can't be auto determined.")
                    #   If there is 1 target tensor, comparison will connect the final layer tensors to the target tensor for comparison
                    elif (targetLen == 1):
                        #   If all target data is a positive integer, a classification is assumed to be done
                        targetTensor = targetTensors[0][1]["target"]
                        if targetTensor.dtype in [tf.int32, tf.int64]:
                            self.appendLayer(Classifier(compareSourceID=targetTensors[0][0], compareTensorIdx="target"), buildNo = buildNo)
                        elif targetTensor.dtype in [tf.float32, tf.float64]:
                            toShape = targetTensor.shape
                            multiTask = toShape[1].value if len(toShape) > 1 else None
                            self.appendLayer(Regressor(compareSourceID=targetTensors[0][0], compareTensorIdx="target"), buildNo = buildNo)
                        else:
                            raise ValueError("The dtype of the target tensor (" + str(targetTensor.dtype) + ") is not supported for auto trainning task assignment.")
                    #   If no target tensor is found, it is assumed a reconstruction is to be done to compare with the source data.
                    else:
                        inputTensors = [(idx,t) for idx,t in enumerate(self._sourceTensors) if "input" in t]
                        if (len(inputTensors) == 1):
                            if (inputTensors[0][1]["input"].dtype in [tf.float32, tf.float64]):
                                self.appendLayer(Regressor(compareSourceID=inputTensors[0][0], compareTensorIdx="input"), buildNo = buildNo)
                            else:
                                raise ValueError("The dtype of the input tensor (" + str(inputTensors[0][1]["input"].dtype) + ") is not supported for auto trainning task assignment.")
                        else:
                            raise ValueError("There is too many target tasks that can't be auto determined.")

                # 3C. Batch Normalization Training
                self._bnTensor = tf.placeholder(tf.bool)

                # 3D. For all meta data (Layer Profiles), build the TensorFlow graph
                for x in [l for l in self.layerProfiles.values() if len(l.fromSource[buildNo]) > 0 and len(l.fromNode[buildNo]) == 0]:
                    x.__build__(buildNo)
        
        self._built = True
        
        # 5. Build end event is fired
        be = BuildEvent("buildend", {"target": self, "buildno": self._buildNo})
        self.dispatchEvent(be)
    
    def __initTraceItems__(self, traceLogger, buildNo: int = 0):
        '''
			Initialize trace items.   --- BETA --- UPDATED (Dexter) 20190225

            Parameters
            ------------------------------

            traceLogger     `CSVLogger` - A csv logger for the trace items.

            buildNo     `int`   - The build number to be built.
        '''
        # Get trace items only if there is a request, and there is no existing trace items.
        if (self.traceRecord > 0 and len(self.traceItems) == 0):
            self.traceItems = [s.__getRandItems__(self.traceRecord) for s in self.sources]
        
        # Print the trace item input data.
        initialStep = 0
        nowTime = datetime.now()
        for idx,s in self.getInputSources(buildNo = buildNo):
            sourceItems = self.traceItems[idx][s]
            traceLogger.log([nowTime,self._runNo, self._cvNo, initialStep, initialStep, "","Input", idx, s, -1, "Table", json.dumps(self.sources[idx].getHeader(s, step = DataPreprocessing.ColumnsNode.StepEnum.Input))])
            traceLogger.log(*[[nowTime,self._runNo, self._cvNo,  initialStep, initialStep, "","Input", idx, s, sii, *pi] for sii,pi in enumerate(self.sources[idx].getPrintableItems(s, sourceItems, recovered=False))])
        traceLogger.flush()

        # Ask the training source to print the trace items.
        for l in self.getFinalLayers(buildNo=buildNo):
            targetItems = l.getTraceTarget()
            traceLogger.log([nowTime,self._runNo, self._cvNo, initialStep, initialStep, "","Target", l.compareSourceID, l.compareTensorIdx, -1, "Table", json.dumps(self.sources[l.compareSourceID].getHeader(l.compareTensorIdx))])
            traceLogger.log(*[[nowTime,self._runNo, self._cvNo,  initialStep, initialStep, "","Target", *ti] for ti in targetItems])
        traceLogger.flush()

    def __train__(self, buildNo = 0):
        '''
			Train the model.   --- UPDATED (Dexter) 20190208
        
            Parameters
            ------------------------------

            buildNo    `int`   - The build number of this training build.
        '''
        #   1.  Collect current training profile.
        nowTrainingProfile = self.trainingProfiles[self._buildNo]
        
        #   2.  Basic Step Counting
        primaryTrainingSource = self.sources[0]
        coreBatchSize = primaryTrainingSource.batchSize
        batchCountPerEpoch = max(primaryTrainingSource.epochSize // coreBatchSize, 1)
        if nowTrainingProfile.numEpochsPerDecay is not None:
            decaySteps = int(batchCountPerEpoch * nowTrainingProfile.numEpochsPerDecay)
        
        #   3. Validation Setup
        validationType = nowTrainingProfile.crossValidationType
        isCrossVal = validationType is not None and self._cvNo >= 0
        if (isCrossVal):
            if (nowTrainingProfile._cvCount < nowTrainingProfile.validationRuns):
                self.__nextCrossValidation__(nowTrainingProfile)
                nowTrainingProfile._cvCount += 1
        elif (nowTrainingProfile._cvCount == nowTrainingProfile.validationRuns):
            nowTrainingProfile._cvCount = 0
        
        #   4.  Start Train Looping
        finalStep = nowTrainingProfile.noOfEpoch * batchCountPerEpoch

        #   5A.  No actions to be taken if the current local step is greater than the final step (usually from a recovered state)
        if (self.localStep >= finalStep):
            self.localStep -= finalStep

        #   5B. Continue for training if the local step is within final step.
        else:
            #   6.  Build the model if it has not built yet.
            if (not self._built):
                self.__build__(buildNo)

            #   7.  Fire trainbuild event
            tb = TrainEvent("trainbuild", {"target": self, "buildNo": self._buildNo, "trainingProfile": nowTrainingProfile})
            self.dispatchEvent(tb)

            with self._graph.as_default():
                #   8.  Define the learning rate
                if nowTrainingProfile.learningRateDecayFactor is not None and (nowTrainingProfile.learningRateDecayFactor != 1 and nowTrainingProfile.learningRateDecayFactor > 0):
                    learningRate = tf.train.exponential_decay(nowTrainingProfile.initialLearningRate, self.localStepTensor, decaySteps, nowTrainingProfile.learningRateDecayFactor, staircase=True)
                else:
                    learningRate = tf.constant(nowTrainingProfile.initialLearningRate)
                
                #   9A.  Collect all the losses.
                totalLoss = tf.add_n(tf.get_collection('losses'), name='totalLoss')
                allLosses = tf.get_collection('losses')

                #   9B. Apply moving average loss decay.
                if nowTrainingProfile.exponentialLossDecay is not None:
                    lossAvgs = tf.train.ExponentialMovingAverage(nowTrainingProfile.exponentialLossDecay, name='lossAvgs')
                    controlStep1 = lossAvgs.apply(allLosses + [totalLoss])
                else:
                    controlStep1 = totalLoss

                #   10.  Training Operation
                bnOps = tf.get_collection(tf.GraphKeys.UPDATE_OPS)
                controlStep2 = []
                with tf.control_dependencies([controlStep1, *bnOps]):
                    opt = Train.optimizers(nowTrainingProfile.optimizer)(learningRate, **nowTrainingProfile.optimizerParams)
                    controlStep2.append(opt.minimize(totalLoss, global_step=self.localStepTensor))
                
                #   11. Update Global Step
                controlStep2.append(self.globalStepTensor.assign_add(1))

                #   12. Take Moving AVerage Decay on Trainable Variables
                if nowTrainingProfile.exponentialVarDecay is not None:
                    variableAvgs = tf.train.ExponentialMovingAverage(nowTrainingProfile.exponentialVarDecay, self.localStep)
                    controlStep2.append(variableAvgs.apply(tf.trainable_variables()))
                
                #   13. Grab the final training operation
                with tf.control_dependencies(controlStep2):
                    totalLossOP = tf.add_n(allLosses, name='totalLoss')
                    avgLossOP = totalLossOP/len(allLosses)

            #   14. Create session
            sess = self._sess = tf.InteractiveSession(graph=self._graph)
            
            #   15. Restore previous training states or previous build
            sess.run(tf.global_variables_initializer())
            print("Training Initialized.\n")
            if (self.restorePath):
                self.__restoreHistory__(self.restorePath)
            elif (self._buildNo > 0):
                self.__restoreBuild__()
            
            #   16. Fire trainstart event
            recorder = TimeHelper.Recorder()
            recorderStep = self.localStep-1
            tb = TrainEvent("trainstart", {"target": self, "buildNo": self._buildNo, "runNo": self._runNo, "cvNo": self._cvNo, "trainingProfile": nowTrainingProfile})
            self.dispatchEvent(tb)
            
            #   17. Prepare Train Log and Test Log
            toLog = True if self.logFreq > 0 and self.logFreq <= math.inf else False
            if (toLog):
                trainLogger = CSVLogger(self.folder+"outputLogs/"+self.trainTime+"/", "trainLog_"+str(self._buildNo), ["Timestamp", "Run", "Cross Validation Step", "Global Step", "Local Step", "Total Loss", "Average Loss", "Learning Rate", "Examples per Second", "Seconds per Step"])
            toTest = True if self.testFreq > 0 and self.testFreq <= math.inf else False
            if (toTest):
                self.testLogger = CSVLogger(self.folder+"outputLogs/"+self.trainTime+"/", "testLog_"+str(self._buildNo), ["Timestamp", "Run", "Cross Validation Step", "Global Step", "Local Step", "Test Type", *[(l.name + ": " + l.measurement) for l in self.getFinalLayers(buildNo=buildNo)]])
            toLogWeight = True if self.weightLogFreq > 0 and self.weightLogFreq <= math.inf else False
            if (toLogWeight):
                weightLogger = CSVLogger(self.folder+"outputLogs/"+self.trainTime+"/", "weightLog_"+str(self._buildNo), ["Timestamp", "Run", "Cross Validation Step", "Global Step", "Local Step", *[w.name for w in sum([l._weights for l in self.layerProfiles.values() if l.weightLogging], [])]])
            toLogTrace = True if self.traceFreq > 0 and self.traceFreq <= math.inf else False
            if (toLogTrace):
                traceLogger = CSVLogger(self.folder+"outputLogs/"+self.trainTime+"/","traceLog_"+str(self._buildNo), ["Timestamp", "Run", "Cross Validation Step", "Global Step", "Local Step", "Task Name", "Task Type", "Source ID", "Source Config", "Item ID", "Data Type", "Data"])
                self.__initTraceItems__(traceLogger, buildNo = buildNo)
            
            #   misc. cache
            toFireEpochStart = len(self._eventFtns["epochstart"])
            toFireEpochEnd = len(self._eventFtns["epochend"])
            toFireStepPrepare = len(self._eventFtns["stepprepare"])
            toFireStepStart = len(self._eventFtns["stepstart"])
            toFireStepEnd = len(self._eventFtns["stepend"])

            for i in range(self.localStep, finalStep):
                self.localStep += 1
                self.globalStep += 1
                ii = self.localStep

                #   18A.  Fire epochstart event
                if (toFireEpochStart and ((i-1) % batchCountPerEpoch == 0)):
                    es = EpochEvent("epochstart", {"target": self, "buildNo": self._buildNo, "runNo": self._runNo, "cvNo": self._cvNo, "trainingProfile": nowTrainingProfile, "i": i, "localStep": ii, "globalStep": self.globalStep, "inputSources": self.sources})
                    self.dispatchEvent(es)

                #   18B.  Fire stepprepare event
                if (toFireStepPrepare):
                    sp = StepEvent("stepprepare", {"target": self, "buildNo": self._buildNo, "runNo": self._runNo, "cvNo": self._cvNo, "trainingProfile": nowTrainingProfile, "i": i, "localStep": ii, "globalStep": self.globalStep})
                    self.dispatchEvent(sp)
                
                #   18C.  The feeddict object with all input and dropout tensours
                feedDictInput = {}
                for si,s in enumerate(self.sources):
                    for key,data in next(s.trainset).items():
                        feedDictInput[self._sourceTensors[si][key]] = data
                feedDictDropout = {l._dropoutTensor: l.dropout for l in self.layerProfiles.values() if l.dropout < 1}
                feedDictObj = {**feedDictInput, **feedDictDropout, self._bnTensor: True}

                #   18D.  Fire stepstart event
                if (toFireStepStart):
                    ss = StepEvent("stepstart", {"target": self, "buildNo": self._buildNo, "runNo": self._runNo, "cvNo": self._cvNo, "trainingProfile": nowTrainingProfile, "i": i, "localStep": ii, "globalStep": self.globalStep, "feedDict": feedDictObj})
                    self.dispatchEvent(ss)

                #   18E.  Print debugging tensors
                if len(self._printTensors):
                    print(sess.run(self._printTensors, feed_dict=feedDictObj))

                #   18F.  Run the loss function
                [totalLoss, avgLoss] =  sess.run([totalLossOP, avgLossOP], feed_dict=feedDictObj)

                #   18G.  Log if needed
                if (toLog and (ii%self.logFreq == 0 or i == finalStep - 1)):
                    duration = recorder.logAndRestart()
                    nowTime = datetime.now()
                    examplesPerSec = self.logFreq * self.sources[0].batchSize / duration
                    secPerStep = float(duration / (self.localStep - recorderStep))
                    recorderStep = self.localStep
                    logLR, localStepNow = sess.run([learningRate, self.localStepTensor])
                    trainLogger.log([nowTime, self._runNo, self._cvNo, self.globalStep, ii, escapeNaN(totalLoss), escapeNaN(avgLoss), logLR, examplesPerSec, secPerStep])
                    if (self._cvNo == -1):
                        print('%s: Run #%d, Step %d (%d) --- loss: %f; learning rate: %f; %.1f examples/s; %.3f s/step' % (nowTime, self._runNo, self.globalStep, ii, avgLoss, logLR, examplesPerSec, secPerStep))
                    else:
                        print('%s: Run #%d - Cross Validation %d, Step %d (%d) --- loss: %f; learning rate: %f; %.1f examples/s; %.3f s/step' % (nowTime, self._runNo, self._cvNo, self.globalStep, ii, avgLoss, logLR, examplesPerSec, secPerStep))

                #   18H.  Print Weights if needed
                if (toLogWeight and (ii%self.weightLogFreq == 0 or ii == finalStep)):
                    nowTime = datetime.now()
                    weightLogger.logAndSave([nowTime, self._runNo, self._cvNo, self.globalStep, ii, *[escapeNaNNPAry(ary).tolist() for ary in sess.run(functools.reduce(lambda a,b: a+b, [l._weights for l in self.layerProfiles.values() if l.weightLogging], []))]])

                #   18I.  Save if needed
                if (self.saveFreq > 0 and (ii%self.saveFreq == 0 or ii == finalStep)):
                    #   18I-1.  Save the trained graph.
                    self.__saveTempTrain__()
                    
                    #   18-2.  Flush Training Log
                    if (toLog):
                        trainLogger.flush()
                
                #   18J.  Log trace items if needed
                if (toLogTrace and (ii % self.traceFreq == 0 or ii == finalStep)):
                    #   10J-1.  Predict acoording to the saved model.
                    predictedValues = self.predict(x=self.createSourceData(self.traceItems), buildNo = buildNo)
                    nowTime = datetime.now()
                    for l in self.getFinalLayers(buildNo = buildNo):
                        predictedItems = l.getTraceItems(predictedValues, buildNo = buildNo)
                        if predictedItems is not None:
                            traceLogger.log(*[[nowTime, self._runNo, self._cvNo, self.globalStep, self.localStep, l.name, l.__class__.__name__, *escapeNaNList(pi)] for pi in predictedItems])
                    traceLogger.flush()
                
                #   18K.  Test if needed, using cross validation data as testing if needed
                if (toTest and (ii%self.testFreq == 0 or ii == finalStep)):
                    #   18K-1.  Evaluate acoording to the saved model.
                    self.evaluate(validation = isCrossVal, event="Test Log", buildNo = buildNo)

                #   18L.  Fire stepend event
                if (toFireStepEnd):
                    se = StepEvent("stepend", {"target": self, "runNo": self._runNo, "cvNo": self._cvNo, "buildNo": self._buildNo, "trainingProfile": nowTrainingProfile, "i": i, "localStep": ii, "globalStep": self.globalStep, "feedDict": feedDictObj, "totalLoss": totalLoss, "avgLoss": avgLoss})
                    self.dispatchEvent(se)

                #   18M.  Fire epochend event
                if (toFireEpochEnd and ((i) % batchCountPerEpoch == 0)):
                    ee = EpochEvent("epochend", {"target": self, "runNo": self._runNo, "cvNo": self._cvNo, "buildNo": self._buildNo, "trainingProfile": nowTrainingProfile, "i": i, "localStep": ii, "globalStep": self.globalStep, "inputSources": self.sources})
                    self.dispatchEvent(ee)
            
            # 19B. Flush Training Log
            if (toLog):
                trainLogger.flush()

            # 20. Save current training graph   --- BETA
            with self._graph.as_default():
                tmpSaver = tf.train.Saver()
                tmpSaver.save(sess, self.folder + 'tmpLogs/' + self.trainTime + '/tmpLog.ckpt')
                tmpSaver.save(sess, self.folder + 'builds/' + self.trainTime + '/build_' + str(self._buildNo) + '/buildLog.ckpt')

            # 21. Dispatch trainend event.
            te = TrainEvent("trainend", {"target": self, "runNo": self._runNo, "cvNo": self._cvNo, "buildNo": self._buildNo, "trainingProfile": nowTrainingProfile})
            self.dispatchEvent(te)

            # 21. Close and reset TensorFlow training graph
            self.close()

    def __saveTempTrain__(self):
        '''
			Save a temp log for current train status.   --- BETA --- UPDATED (Dexter) 20190118
            '''
        with self._graph.as_default():
            tmpSaver = tf.train.Saver()
            tmpSaver.save(self._sess, self.folder + 'tmpLogs/' + self.trainTime + '/tmpLog.ckpt')
        
        with open(self.folder + 'tmpLogs/' + self.trainTime + '/tmpStep.txt', "w", encoding = "utf-8", newline="") as f:
            f.write(str(self.globalStep-1))

    def __restoreHistory__(self, restorePath = None):
        '''
			Restore model training history from a specific path.   --- BETA --- UPDATED (Dexter) 20190118

            Parameters
            ------------------------------

            restorePath     `str`   - The restore folder of the checkpoint history file.
        '''
        # Get the checkpoint info.
        restoreDirectory = ((self.folder  + 'tmpLogs/' + self.trainTime + "/") if (restorePath is None) else self.restorePath)
        tmpSaver = tf.train.Saver([x for x in tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES)])

        # Restore the training session.
        tmpSaver.restore(self._sess, restoreDirectory + "tmpLog.ckpt")
        print("Training restored.\n")

    def __restoreBuild__(self):
        '''
			Restore model build training history from a specific path.   --- BETA --- UPDATED (Dexter) 20190118
        '''
        # Get the build checkpoint info.
        restoreDirectory = self.folder  + 'builds/' + self.trainTime + '/build_' + str(self._buildNo) + "/"
        allPreviousBuildNodeNames = [n for n,l in self.layerProfiles if l.buildNo < self._buildNo]
        tmpSaver = tf.train.Saver([x for x in tf.get_collection(tf.GraphKeys.GLOBAL_VARIABLES) if any([x.name.startswith(n + "/") for n in allPreviousBuildNodeNames])])

        # Restore the training session.
        tmpSaver.restore(self._sess, restoreDirectory + "buildLog.ckpt")
        print("Build restored.\n")
    
    def __nextCrossValidation__(self, trainingProfile):
        '''
			Prepare the next cross validation dataset.   --- UPDATED (Dexter) 20180630
        '''
        # Update validation dataset if needed.
        for s in self.sources:
            if (s.splittable):
                # Dataset is split according to the training profile settings.
                s.splitValidationDataset(validation=trainingProfile.crossValidationProp, shuffle = trainingProfile.crossValidationType=="rand")
  
    def __evaluate__(self, validation: bool = False, isPredict: bool = False, event: str = "", saveOriginal: bool = False, saveResults: bool = False, buildNo: int = 0) -> Any:
        '''
			Evaluate the training model.   --- UPDATED (Dexter) 20181221

            Parameters
            ------------------------------

            validation  `bool`  - Whether this evaluation is taken on validation dataset.

            isPredict   `bool`  - Whether this evaluation requires a prediction.

            event       `str`   - An event name for this evaluation. If it is "Test Log", it is an evaluation during training.

            saveOriginal    `bool`  - Whether to save original data. (Reserved)

            saveResults     `bool`  - Whether to save result data. (Reserved)

            buildNo     `int`   - The build number to be built.

            Returns
            ------------------------------

            `*`     - Prediction results if needed.
        '''
        #   1.  Confirm the test data are with same batch-size as source data
        predictSources = self._evalSources
        if len(predictSources) == 0:
            raise ValueError("There is no test or validation data sources.")
        elif len(self.sources) != len(predictSources):
            raise ValueError("Sources and test sources are not matched.")
        isSourceData = issubclass(predictSources.__class__, TrainSourceData)

        if not isSourceData:
            for i,x in enumerate(self.sources):
                if (predictSources[i].batchSize != x.batchSize):
                    predictSources[i].changeItrConfig(batchSize = x.batchSize, shuffle=False)

        #   2.  Define the epoch size and relevant learning rate, not all data would be looped through depending on previously defined batch size 
        primaryTestSource = predictSources[0]
        totalStepCount = 1 if isSourceData or primaryTestSource.batchSize == -1 else max(primaryTestSource.epochSize // primaryTestSource.batchSize,1)

        #   3.  Loop the test source in several batches for testing
        finalTensors = self.getFinalLayers(buildNo=buildNo)
        savedResults = {lt.name: None for lt in finalTensors}
        if (self._sess is None):
            sess = self._sess = tf.InteractiveSession(graph=self._graph)
            sess.run(tf.global_variables_initializer())
            self.__restoreHistory__()
        
        #   3-0. Initialize dataSize, and all evaluation measurements.
        dataSize = 0
        for lt in finalTensors:
            lt.__clearEvalInfo__()

        for i in range(0, totalStepCount):
            #   3-1.    Get all test data and count the test data size.
            allTestData = predictSources if isSourceData else [{key: data for key,data in next(s).items()} for si,s in enumerate(predictSources)]
            feedDictInput = {}
            dataSize += max([len(colData) for colData in allTestData[0].values()])

            #   3-2.    Feed the test data into feed dict object.
            for si,s in enumerate(self._sourceTensors):
                for key,st in s.items():
                    if key in allTestData[si]:
                        feedDictInput[self._sourceTensors[si][key]] = allTestData[si][key]

            #   3-3.    Feed the dropout tensor as 1 as well.
            feedDictDropout = {l._dropoutTensor: 1 for l in self.layerProfiles.values() if l.dropout < 1}
            feedDictObj = {**feedDictInput, **feedDictDropout, self._bnTensor: False}

            #   3-4.    Run the model.
            allPredictedResults = self._sess.run({lt.name: lt._predictionTensors for lt in finalTensors}, feed_dict=feedDictObj)

            #   3-5.    Recover the predicted results from reversed data transformations or circular range bounding.
            for lt in finalTensors:
                allPredictedResults[lt.name] = lt.recoverPredictedResults(allPredictedResults[lt.name])
            
            #   3-6.    If it's an evaluation, partially evaluate this batch of test data for each final layers.
            if not isPredict:
                #   3-6-1.  Partial evaluate each final tensor.
                for lt in finalTensors:
                    lt.partialEvaluate(allTestData, allPredictedResults[lt.name])
            
            #   3-7.  Save all predicted results for all final layers.
            if isPredict:
                for lt in finalTensors:
                    if (savedResults[lt.name] is None):
                        # If it's the first batch testing, initialte with the results.
                        savedResults[lt.name] = allPredictedResults[lt.name]
                    else:
                        # Concatenate the results on the first axis (batch axis [looping on batched testing]).
                        savedResults[lt.name] = np.concatenate((savedResults[lt.name], allPredictedResults[lt.name]), axis=0)
        
        if (isPredict):
            #   4X. Return the results if it's a prediction.
            return savedResults
        else:
            #   4A.  Get the final score by aggregating all previously partially evaluated information.
            toAns = [[lt.measurement, lt.getTestScore()] for lt in finalTensors]

            #   5.  Log the test results.
            nowTime = datetime.now()
            testLog = [nowTime, self._runNo, self._cvNo, self.globalStep, self.localStep, event, *escapeNaNList([ans[1] for ans in toAns])]
            if (self._cvNo == -1):
                print('\nTEST (Validation: %s - %s) Test Data Size: %d\n%s: Run #%d, Step %d (%d) --- \n' % (validation, event, dataSize, nowTime, self._runNo, self.globalStep, self.localStep), *[ans[0] + ": " + ('%f' % ans[1]) for ans in toAns], "\n")
            else:
                print('\nTEST (Validation: %s - %s) Test Data Size: %d\n%s: Run #%d - Cross Validation %d, Step %d (%d) --- \n' % (validation, event, dataSize, nowTime, self._runNo, self._cvNo, self.globalStep, self.localStep), *[ans[0] + ": " + ('%f' % ans[1]) for ans in toAns], "\n")
            if (self.testLogger is not None):
                self.testLogger.logAndSave(testLog)
            
            #   6.  Close Test Sources
            if not isSourceData:
                for s in reversed(predictSources):
                    s.close()

    def close(self):
        '''
			Close the training model.   --- UPDATED (Dexter) 20180630
        '''
        # In a reversed order, close all the training sources.
        for x in reversed(self.sources):
            x.close()
        
        # Close the training session.
        if (self._sess):
            self._sess.close()
            self._sess = None
            print("Training closed.\n")
        
        # Revert the build status, the local step counter, clear print tensors.
        self._built = False
        for lp in self.layerProfiles.values():
            lp._built = False
        self.localStep = 0
        self._printTensors = []
    
    def fit(self,x=None,y=None, batchSize = -1, shuffle = True):
        '''
			Fit (Train) a model (A user-oriented API).   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            x   `*`             - Input data of a model.

            y   `*`             - Output data of a model.

            batchSize   `int`   - Batch size of the dataset. Only applicable if data is passed in this function.

            shuffle     `bool`  - Whether shuffling is needed.
        '''
        # Set up data source if needed.
        if (x is not None):
            self.setDataSources(TableSource(x,outputArray = y,batchSize=batchSize,training=True,shuffle=shuffle))
        
        # Train the model.
        self.fullModelTrain()
    
    def evaluate(self, x: Optional[Union['TrainSource', 'np.ndarray', List[List[Any]], List['TrainSource'], 'TrainSourceData']] = None, 
                batchSize: int = -1, shuffle: bool = False, validation: bool = False, isPredict: bool = False, event: str = "", saveOriginal: bool = False, saveResults: bool = False, buildNo: int = 0):
        '''
			Evaluation this model (A user-oriented API).   --- UPDATED (Dexter) 20181114

            Parameters
            ------------------------------

            x               `TrainSource|np.ndarray[np.ndarray]|list[list]|list[TrainSource]|TrainSourceData`     - Input data of a model.

            batchSize       `int`   - Batch size of the test dataset. -1: Full epoch evaluation will be processed.

            shuffle         `bool`  - Whether shuffling is needed.

            validation      `bool`  - Whether this evaluation is taken on validation dataset.

            isPredict       `bool`  - Whether this evaluation requires a prediction.
            
            event           `str`   - An event name for this evaluation.

            saveOriginal    `bool`  - Whether to save original data. (Reserved for future use)

            saveResults     `bool`  - Whether to save result data. (Reserved for future use)

            buildNo     `int`       - The build number to be built.
        '''
        #   1A.  If there is evaluation data, set it as test data source.
        if (x is not None and not validation):
            #   1A-1.    Dependiing on the training source and set up the test sources.
            if (issubclass(x.__class__, TrainSource)):
                self._evalSources = [x]
            elif (issubclass(x.__class__, TrainSourceData)):
                self._evalSources = x
            elif (classof(x) == "list" and all([issubclass(x.__class__, TrainSource) for t in x])):
                self._evalSources = x
            elif (classof(self.sources[0]) in ["TableSource", "CSVSource"]):
                self._evalSources = [TableSource(x,batchSize=batchSize,training=False,shuffle=shuffle)]
            
            #   1A-2.    Check the compatibility of the original source configurations.
            if (len(self._evalSources) != len(self.sources)):
                raise ValueError("Test sources length does not match originally desinged model.")
            elif (not issubclass(x.__class__, TrainSourceData) and any([not issubclass(s.__class__, self._evalSources[idx].__class__) for idx,s in enumerate(self.sources)])):
                raise ValueError("Test sources class does not match originally desinged model.")
            elif (issubclass(x.__class__, TrainSourceData) and any([any([(k not in self.sources[idx]) for k in ts.keys()]) for idx,ts in enumerate(self._evalSources)])):
                raise ValueError("Test sources class does not match originally desinged model.")

            #   1A-3.    Apply the source configuration on the test sources.
            if not issubclass(x.__class__, TrainSourceData):
                for idx,ts in enumerate(self._evalSources):
                    self.sources[idx].applyDataConfig(ts)

        #   1B. If it's a validation round, set the validation sources from the dataset.
        elif (validation):
            self._evalSources = [s.validation for s in self.sources]
        
        #   1C. Raise error if there is no available data sources.
        elif (self.testSources is None or len(self.testSources) == 0):
            raise ValueError("No test sources allowed for testing.")
        
        else:
            self._evalSources = self.testSources
        
        #   2. If there are available evaluation source, evaluate the data.
        if (len(self._evalSources)):
            if (isPredict):
                return self.__evaluate__(validation, isPredict = isPredict, event=event, saveOriginal=saveOriginal, saveResults=saveResults, buildNo = buildNo)
            else:
                self.__evaluate__(validation, event=event, saveOriginal=saveOriginal, saveResults=saveResults, buildNo = buildNo)
        
        #   3. Clear evaluation sources.
        self._evalSources = None
    
    def predict(self, x: Optional[Union['TrainSource', 'np.ndarray', List[List[Any]], List['TrainSource'], 'TrainSourceData']] = None, 
                batchSize: int = -1, shuffle: bool = False, validation: bool = False, event: str = "", saveOriginal: bool = False, saveResults: bool = False, buildNo: int = 0):
        '''
			Predict some data using this model (A user-oriented API).   --- UPDATED (Dexter) 20180713

            Parameters
            ------------------------------

            x               `TrainSource|np.ndarray[np.ndarray]|list[list]|list[TrainSource]|TrainSourceData`     - Input data of a model.

            batchSize       `int`   - Batch size of the test dataset. -1: Full epoch evaluation will be processed.

            shuffle         `bool`  - Whether shuffling is needed.

            validation      `bool`  - Whether this evaluation is taken on validation dataset.

            event           `str`   - An event name for this evaluation.

            saveOriginal    `bool`  - Whether to save original data. (Reserved for future use)

            saveResults     `bool`  - Whether to save result data. (Reserved for future use)

            buildNo     `int`   - The build number to be built.
        '''
        return self.evaluate(x=x, batchSize=batchSize, shuffle=shuffle, validation=validation, isPredict=True, event=event, saveOriginal=saveOriginal, saveResults=saveResults, buildNo = buildNo)
    
    def perBuildTrain(self, buildNo = 0):
        '''
			Perform a single model train for building once only.   --- UPDATED (Dexter) 20190118
        
            Parameters
            ------------------------------

            buildNo    `int`   - The build number of this training build.
        '''
        # Create temporary global step.
        startGlobalStep = self.globalStep

        # Run for several tiems on this build.
        for runNo in range(0, self.runCount):
            self._runNo += 1
            
            trainingProfile = self.trainingProfiles[buildNo]
            if (trainingProfile.crossValidationType is None or trainingProfile.validationRuns == 1):
                self.globalStep = startGlobalStep
                self.__train__(buildNo = buildNo)
            else:
                # Loop by each cross validation and overall performance.
                for cv in range(0, trainingProfile.validationRuns+1):
                    self.globalStep = startGlobalStep
                    self._cvNo += 1
                    if (self._cvNo == trainingProfile.validationRuns):
                        self._cvNo = -1
                    self.__train__(buildNo = buildNo)
        
        # Reset Run No.
        self._runNo = -1

    def fullModelTrain(self):
        '''
			Perform a full model train with multi-build settings.   --- UPDATED (Dexter) 20190118
        '''
        # If there is a restore path, find the from-globaleStep.   --- BETA
        if self.restorePath:
            if any([tp.crossValidationType is not None for tp in self.trainingProfiles]):
                raise ValueError("Train Resuming is not allowed for cross-validating trainings.")
            
            step = 0
            try:
                with open(self.restorePath + '/tmpStep.txt', "r", encoding = "utf-8", newline="") as f:
                    step = f.read().trim()
            except:
                raise ValueError("No model is restored from: " + str(self.restorePath))
                
            self.localStep = self.globalStep = int(step)

        # Train the model for every training profiles, loop by each run.
        for runNo in range(0, self.runCount):
            self._runNo += 1
            self.globalStep = 0

            # Loop by each build.
            for toBuildNo,x in enumerate(self.trainingProfiles):
                if (x.crossValidationType is None or x.validationRuns == 1):
                    self.__train__(buildNo = toBuildNo)
                else:
                    # Create temporary global step.
                    startGlobalStep = self.globalStep

                    # Loop by each cross validation and overall performance.
                    for cv in range(0, x.validationRuns+1):
                        self.globalStep = startGlobalStep
                        self._cvNo += 1
                        if (self._cvNo == x.validationRuns):
                            self._cvNo = -1
                        self.__train__(buildNo = toBuildNo)
        
        # Reset Run No.
        self._runNo = -1
    
    def addDataSource(self, source):
        '''
			Add a data source to existing collections of this training.   --- UPDATED (Dexter) 20180625

            Parameters
            ------------------------------

            source          `TrainSource`  - A data source to be assigned.
        '''
        self.sources.append(source)
        source.train = self
    
    def setDataSources(self, *sources):
        '''
			Set (Replace existing) several data sources into this training.   --- UPDATED (Dexter) 201825

            Parameters
            ------------------------------

            *sources        `TrainSource+`  - A data source to be assigned.
        '''
        self.sources = sources
        for s in sources:
            s.train = self
    
    def getDataSource(self, sourceID = 0, colConfigKey = "input"):
        '''
			Get a particular data source.   --- UPDATED (Dexter) 20180625

            Parameters
            ------------------------------

            sourceID        `int`   - The id of the data source.

            colConfigKey    `str`   - The particular column configuration.

            Returns
            ------------------------------

            `ColConfig`     - A specific column configuration.
        '''
        return self.sources[sourceID][colConfigKey]
    
    def getLayersUsingSource(self, sourceID: int = 0, colConfigKey: str = "input", buildNo: int = 0):
        '''
			Get a list of layers using a particular data source.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            sourceID        `int`   - The id of the data source.

            colConfigKey    `str`   - The particular column configuration.

            buildNo         `int`   - The build no.

            Returns
            ------------------------------

            `LayerProfile`          - A list of layer profile objects.
        '''
        return [l for l in self.layerProfiles.values() if any([(s[0] == sourceID and s[1] == colConfigKey) for s in l.fromSource[buildNo]])]

    def createSourceData(self, sourceData):
        '''
			Create a source data object based on structured data as if this Train object.   --- UPDATED (Dexter) 20180713

            Parameters
            ------------------------------

            sourceData      `list[dict]`    - A list structure data according to the list of data sources, with the data mapped using a dict structure as if different column configurations.

            Returns
            ------------------------------

            `TrainSourceData`   - A source data object.
        '''
        return TrainSourceData(self, sourceData)

    def getOutputTensor(self, name: str) -> 'tf.Tensor':
        '''
			Get an output tensor of a particular layer, normally called during graph building.   --- UPDATED (Dexter) 20190118

            Parameters
            ------------------------------

            name    `str`      - The layer profile name.
            
            Returns
            ------------------------------

            `tf.Tensor`     - The output output of the requested layer.
        '''
        if (name not in self.layerProfiles):
            raise ValueError("Requested layer is not within this train object.")

        return self.layerProfiles[name]._outputTensor
    
    def getInputSources(self, buildNo: int = 0):
        '''
			Get the necessary input sources.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            buildNo         `int`   - The build no.

            Returns
            ------------------------------

            `list[tuple(int,str)+]`    - A list of necessary input column information.
        '''
        return functools.reduce(lambda x,y: x+y, [l.fromSource[buildNo] for l in self.layerProfiles.values() if len(l.fromSource[buildNo]) > 0])

    def updateLayerOrder(self, layerProfile: 'LayerProfile', buildNo: int = 0):
        '''
			Initiate an update on layer profile order.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            layerProfile    `LayerProfile`  - A layer profile to update.

            buildNo         `int`           - The build no.
        '''
        layerProfile.__updateOrder__(buildNo=buildNo)
        if (not layerProfile._final):
            for lp in [lp for lp in self.layerProfiles.values() if lp._final]:
                lp.updateOrder(buildNo=buildNo)

    def getEndingLayerProfiles(self, buildNo: int = 0):
        '''
			Get the current model ending layer profiles (leaf nodes).   --- UPDATED (Dexter) 20180625

            Parameters
            ------------------------------

            buildNo         `int`           - The build no.

            Returns
            ------------------------------

            `list[LayerProfile]`    - The list of ending layer profiles.
        '''
        return [l for l in self.layerProfiles.values() if len(l.toNode[buildNo]) == 0]
    
    def getFinalLayers(self, buildNo: int = 0):
        '''
			Get the final layer profiles (layers).   --- UPDATED (Dexter) 20180701

            Parameters
            ------------------------------

            buildNo         `int`           - The build no.

            Returns
            ------------------------------

            `list[LayerProfile]`    - The list of final layer profiles.
        '''
        return [l for l in self.layerProfiles.values() if l._final and len([*l.fromSource[buildNo], *l.fromNode[buildNo]]) > 0]
    
    def getNewLayerName(self, layerProfile: 'LayerProfile'):
        '''
			Get a automated new profile name for the layer profile.   --- UPDATED (Dexter) 20181029

            Parameters
            ------------------------------

            layerProfile    `LayerProfile`      - The layer profile to be appended.
        '''
        layerProfile.name = "Layer"+str(self.getNewLayerID())
    
    def switchOffWeightLogging(self, *layerProfiles: Union[str, 'LayerProfile']):
        '''
			Optionally switch off weightLogging.   --- UPDATED (Dexter) 20181214

            Parameters
            ------------------------------

            layerProfile    `str|LayerProfile`      - The layer profile to disable weight logging.
        '''
        for lp in layerProfiles:
            if isinstance(lp, LayerProfile):
                lp.switchOffWeightLogging()
            elif isinstance(lp, str) or str(lp):
                self.layerProfiles[str(lp)].switchOffWeightLogging()
            else:
                raise ValueError("Layer profiles in Train.switchOffWeightLogging() should be a string or LayerProject object.")

    def appendLayer(self, layerProfile: 'LayerProfile', appendAt: Union[int, str, 'LayerProfile', 'ColConfig'] = None, buildNo: int = 0):
        '''
			Append a layer to existing ending node, or any specified node.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            appendAt        `None|int|str|LayerProfile|ColConfig`      - If `None`, Auto select the ending node; if `str`, a specific layer name; if `int`, a specific source id.

            layerProfile    `LayerProfile`      - The layer profile to be appended.

            buildNo         `int`               - The build no.

            Returns
            ------------------------------

            `Train`   - The current training object.
        '''
        # Ensure the name is not in existing layer profiles.
        if layerProfile.name in self.layerProfiles:
            raise ValueError("This layer exists in the model already.")
        # Ensure this layer has not been attached to any training model.
        elif layerProfile.train is not None:
            raise ValueError("This layer is in another model.")
        
        #   1.  If there has not been name given, assign a unique layer name to it.
        if layerProfile.name is None:
            self.getNewLayerName(layerProfile)

        #   2A. If there is no `appendAt`, it automatically find the ending node to append on.
        if appendAt is None:
            endingLayerProfile = self.getEndingLayerProfiles(buildNo=buildNo)
            #   2A-A.   If there is one and only one ending node, it can append on it.
            if (len(endingLayerProfile) == 1):
                endingLayerProfile[0].appendNode(layerProfile, buildNo = buildNo)
            #   2A-B.   If there is no ending node, while there is only one data source, the layer takes the data source as input
            elif (len(endingLayerProfile) == 0 and len(self.sources) <= 1):
                layerProfile.addSources(0, clear = True, buildNo = buildNo)
            #   2A-C.   Otherwise, the layer cannot be appended
            else:
                raise ValueError("Layer cannot be appended to multiple previous outputs.")
        
        #   2B. If the `appendAt` is a string, get that layer and append on it.
        elif classof(appendAt) in ["str", "String"]:
            # Ensure the requested layer is in this training model.
            if (str(appendAt) not in self.layerProfiles):
                raise ValueError("The previous layer (" + str(appendAt) + ") is not in this training model.")

            # Append the new layer to the previous layer.
            self.layerProfiles[str(appendAt)].appendNode(layerProfile, buildNo = buildNo)

        #   2C. If the `appendAt` is a layer profile, append on it.
        elif issubclass(appendAt.__class__, LayerProfile):
            # Ensure the requested layer is in this training model.
            if (appendAt.name is None):
                raise ValueError("The previous layer is not in any training models.")
            elif (appendAt.name not in self.layerProfiles):
                raise ValueError("The previous layer " + (appendAt.name) + " is not in this training models.")

            # Append the new layer to the previous layer.
            appendAt.appendNode(layerProfile, buildNo = buildNo)

        #   2D. If the `appendAt` is an integer, set the source on this new layer.
        elif classof(appendAt) in ["int"] or issubclass(appendAt, ColConfig):
            #   If it is a column config, ensure it is in this training model.
            if issubclass(appendAt.__class__, ColConfig) and (appendAt._trainSource is None or appendAt._trainSource.train != self):
                raise ValueError("The previous column config is not in this training models.")

            layerProfile.addSources(appendAt, clear = True, buildNo = buildNo)

        #   2E. Otherwise, a wrong `appendAt` was specified.
        else:
            raise ValueError("`appendAt` parameter should be either a string (previous layer name), an integer (a data source index), a LayerProfile object (previous layer profile), or a ColConfig object (a data source input data).")

        #   3.  Assign the LayerProfile to this Train object, and add to the collection of the layer profiles.
        layerProfile.train = self
        self.layerProfiles[layerProfile.name] = layerProfile

        return self
    
    def appendRepeatedLayers(self, layerProfile, appendAt = None, repeatedCount = 0, buildNo: int = 0):
        '''
			Append a layer in a repeated sequential way to existing ending node, or any specified node.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            appendAt        `None|int|str|LayerProfile|ColConfig`      - If `None`, Auto select the ending node; if `str`, a specific layer name; if `int`, a specific source id.

            layerProfile    `LayerProfile`      - The layer profile to be appended.

            repeatedCount   `int`               - Repeated layer count. 0 is the same as the `appendLayer()` method.

            buildNo         `int`               - The build no.

            Returns
            ------------------------------

            `Train`   - The current training object.
        '''
        # Ensure the layer is not a final layer.
        if (layerProfile._final):
            raise ValueError("FinalLayer layers cannot be repeated appended.")
        # Ensure the name is not in existing layer profiles.
        elif layerProfile.name in self.layerProfiles or any([re.search(layerProfile.name + "R[0-9]+", l.name) for l in self.layerProfiles]):
            raise ValueError("This layer exists in the model already.")
        # Ensure this layer has not been attached to any training model.
        elif layerProfile.train is not None:
            raise ValueError("This layer is in another model.")
        
        #   1.  If there has not been name given, assign a unique layer name to it.
        if layerProfile.name is None:
            self.getNewLayerName(layerProfile)
        
        #   2.  Set a counter for repeated layer name.
        rTotal = repeatedCount

        #   3.  Recurssively copy and append the layer.
        while (repeatedCount >= 0):
            #   3-1.    Copy the layer
            ln = layerProfile.name + "R" + str(rTotal - repeatedCount + 1)
            lp = layerProfile.copy(ln)
            #   3-2.    Append the layer
            self.appendLayer(lp, appendAt = appendAt, buildNo=buildNo)
            appendAt = lp

    def attachLayer(self, layerProfile: Union[str, 'LayerProfile'], *layerOrSources: Union[str, 'LayerProfile', int, Tuple[int, str], 'ColConfig'], buildNo: int = 0):
        '''
			Attach a layer to one or more specific sources or existing layers.   --- UPDATED (Dexter) 20181115
            
            Parameters
            ------------------------------

            layerProfile    `str|LayerProfile`          - The layer profile to be attached.

            layerOrSources   `list[str|LayerProfile|int|tuple(int,str)|ColConfig]`  - A list of source index, with its corresponding generated tensor index.

            buildNo         `int`               - The build no.
        '''
        # Convert the layer profile if needed.
        if (not isinstance(layerProfile, LayerProfile)):
            if (layerProfile not in self.layerProfiles):
                raise ValueError("The requested layer is not found in this training object.")
            else:
                layerProfile = self.layerProfiles[layerProfile]

        # Ensure there are some input for this layer.
        if (len(layerOrSources) == 0):
            raise ValueError("This layer must attach to at least one precedent source or layer.")
        # Ensure the name is not in existing layer profiles.
        elif layerProfile.name in self.layerProfiles:
            raise ValueError("This layer exists in the model already.")
        # Ensure this layer has not been attached to any training model.
        elif layerProfile.train is not None:
            raise ValueError("This layer is in another model.")
        
        #   1.  If there has not been name given, assign a unique layer name to it.
        if layerProfile.name == None:
            self.getNewLayerName(layerProfile)

        #   2. Assign the LayerProfile to this Train.
        layerProfile.train = self

        #   3.  Loop all attaching layer or sources.
        for ls in layerOrSources:
            #   3A. If this is a layer.
            if (classof(ls) == "str" or issubclass(ls.__class__, LayerProfile)):
                #   Ensure the previous layer is in this training model.
                if (classof(ls) == "str" and ls not in self.layerProfiles):
                    raise ValueError("The previous layer (" + ls + ") is not in this training model.")
                elif (issubclass(ls.__class__, LayerProfile)):
                    if (ls.name is None):
                        raise ValueError("The previous layer is not in any training models.")
                    elif (ls.name not in self.layerProfiles):
                        raise ValueError("The previous layer " + (ls.name) + " is not in this training models.")
                    
                #   Get the previous layer and append on it.
                previousLayer = self.layerProfiles[ls] if classof(ls) == "str" else ls
                previousLayer.appendNode(layerProfile, buildNo = buildNo)

            #   3B. If this is a data source.   
            else:
                #   If it is a col config, ensure it is in this training model.
                if issubclass(ls.__class__, ColConfig) and (ls._trainSource is None or ls._trainSource.train != self):
                    raise ValueError("The previous column config is not in this training models.")
                
                #   Add the source to the layer profile.
                layerProfile.addSources(ls, buildNo = buildNo)

        #   4. Set the order.
        self.updateLayerOrder(layerProfile, buildNo=buildNo)
        self.layerProfiles[layerProfile.name] = layerProfile 
      
    def appendLayers(self, appendAt: Optional[Union[int, str, 'LayerProfile', 'ColConfig']] = None, *layerProfiles: List['LayerProfile'], buildNo: int = 0):
        '''
			Append multiple layers to the network.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            appendAt        `None|int|str|LayerProfile|ColConfig`      - If `None`, Auto select the ending node; if `str`, a specific layer name; if `int`, a specific source id.

            *layerProfile    `LayerProfile+`    - One or multiple layer profile(s) to be appended.

            buildNo         `int`               - The build no.

            Returns
            ------------------------------

            `Train`   - The current training object.
        '''
        # Reverse the order all layers to be allowed for setting up the appendAt of each step of the layers.
        toAppendAt = [*reversed([appendAt, *[l.name for l in layerProfiles]][:-1])]

        # Append the layer in order.
        for l in enumerate(layerProfiles):
            self.appendLayer(l, appendAt=toAppendAt.pop(), buildNo=buildNo)

        return self

    def appendBasicLayers(self, hiddenUnitCounts: Tuple[int] = (100), activation: str = "relu", appendAt: Optional['LayerProfile'] = None, buildNo: int = 0):
        '''
			Append fully connected layers to the network.   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            hiddenUnitCounts    `tuple(int+)`   - The number of hidden units of layers in a sequential order.

            activation          `str`           - The kind of activation function of the hidden layers.

            appendAt            `LayerProfile`  - The layer to be appended on.

            buildNo             `int`               - The build no.
        '''
        nowAppendAt = appendAt
        for h in hiddenUnitCounts:
            newLayerName = "Basic"+str(self.getNewLayerID())
            self.appendLayer(LayerProfile(layerUnits=h,name=newLayerName,activation=activation), appendAt=nowAppendAt, buildNo=buildNo)
            nowAppendAt = newLayerName
        return self
    
    def appendSymmetricLayers(self, buildNo: int = 0):
        '''
			Append symmetric layer structure to the network, typically useful for Auto Encoder structure.   --- BETA --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            buildNo             `int`               - The build no.
            
            Returns
            ------------------------------

            `Train`   - This Train object
        '''
        # Get all the ending layers in the model.
        endingLayerProfile = self.getEndingLayerProfiles(buildNo=buildNo)

        # Ensure it is not a FinalLayer.
        if (len(endingLayerProfile) != 1):
            raise ValueError("Symmetric Layer Creation only allows for a single final layer scenario.")
        elif (issubclass(endingLayerProfile[0].__class__, FinalLayer)):
            raise ValueError("Symmetric Layer Creation can't be stacked on FinalLayer objects.")
        
        # Maintain a list of whether the symmetric nodes are built
        currentLayers = endingLayerProfile
        currentLayerNames = [l.name for l in currentLayers]
        builtLayerList = {ln: (True if ln in currentLayerNames else False) for ln in self.layerProfiles.keys()}

        # Loop the layer paths.
        for l in currentLayers:
            l.setSymmetricLayer(builtLayerList, startFromThis = True, buildNo = buildNo)

        return self

    def addEventListener(self, eventName, ftn):
        '''
			Add an event listener.   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            eventName   `str`       - The event name.

            ftn         `Function`  - Function to be triggered on the specified event.
        '''
        self._eventFtns[eventName].append(ftn)
    
    def removeEventListener(self, eventName, ftn):
        '''
			Remove and event listener.   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            eventName   `str`       - The event name.

            ftn         `Function`  - Function to be removed from the specified event.
        '''
        # Only remove if it has.
        if ftn in self._eventFtns[eventName]:
            self._eventFtns[eventName].pop(self._eventFtns[eventName].index(ftn))

class VarConfig():
    '''
			Class representing a variable configuration.   --- UPDATED (Dexter) 20181125
    '''
    class IInitializer():
        '''
			Class representing a variable initializer.   --- UPDATED (Dexter) 20181125
        '''
        def __init__(self, referenceCallable: Callable):
            '''
			Create an initializer.   --- UPDATED (Dexter) 20190118

            Parameters
            ------------------------------

            `Callable`  - A callable function, which should be the corresponding TensorFlow initializer.

            '''
            self._reference = referenceCallable

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {}
        
        def getTrainingInitializer(self, shape: List[int] = None) -> 'tf.initializers':
            '''
			Returns a configuration dict object.   --- UPDATED (Dexter) 20181109

                Parameters
                ------------------------------

                shape   `list[int]`     - The shape of the variable. (Optional for different subclasses.)

                Returns
                ------------------------------

                `tf.initializers`       - An initializer tensor.
            '''
            return self._reference(**self.getConfig())
        
        def fromConfig(self, initializer: type, config: Dict[str, Any]) -> 'VarInitalizer':
            '''
			Create a variable initializer using a configuration dict object.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

            '''
            return initializer(**config)
        
    class Constant(IInitializer):
        '''
			Variable initializer with constant value.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, value: Any = 0):
            '''
			Create a constant variable initializer.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                value   `*` - A constant value of this initializer.
            '''
            super().__init__(tf.constant_initializer)
            self.value = value
        
        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"value": self.value}

    class Zeros(IInitializer):
        '''
			Variable initializer with constant value zero.   --- UPDATED (Dexter) 20190118
        '''
        def __init__(self):
            '''
			Create a zero-constant variable initializer.   --- UPDATED (Dexter) 20181125
            '''
            super().__init__(tf.zeros_initializer)

    class Ones(IInitializer):
        '''
			Variable initializer with constant value one.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self):
            '''
			Create a one-constant variable initializer.   --- UPDATED (Dexter) 20190118
            '''
            super().__init__(tf.ones_initializer)

    class RandomNormal(IInitializer):
        '''
			Random value variable initializer following a normal distribution.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, mean: float = 0, stddev: float = 1.0, seed: int = None):
            '''
			Create a random variable initializer following a normal distribution.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                mean    `float` - The mean of the normal distribution of the random varaible initializer.

                stddev  `float` - The standard deviation of the normal distribution of the random varaible initializer.

                seed    `int`   - Python random seed.
            '''
            super().__init__(tf.random_normal_initializer)
            self.mean = mean
            self.stddev = stddev
            self.seed = seed
        
        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"mean": self.mean, "stddev": self.stddev, "seed": self.seed}

    class TruncatedNormal(IInitializer):
        '''
			Random value variable initializer following a truncated normal distribution with no values exceeding 2 standard deviations from the mean.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, mean: float = 0, stddev: Union[float, str] = 1.0, seed: int = None):
            '''
			-Create a random variable initializer following a truncated normal distribution with no values exceeding 2 standard deviations from the mean.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                mean    `float` - The mean of the normal distribution of the random varaible initializer.

                stddev  `float` - The standard deviation of the normal distribution of the random varaible initializer. If "auto", it will be the 1/(first dimension of weight matrix) .
                
                seed    `int`   - Python random seed.
            '''
            super().__init__(tf.truncated_normal_initializer)
            self.mean = mean
            self.stddev = stddev
            self.seed = seed

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"mean": self.mean, "stddev": self.stddev, "seed": self.seed}
        
        def getTrainingInitializer(self, shape: List[int] = None) -> 'tf.initializers':
            '''
			Returns a configuration dict object. (override)   --- UPDATED (Dexter) 20181109

                Parameters
                ------------------------------

                shape   `list[int]`     - The shape of the variable. (Optional for different subclasses.)

                Returns
                ------------------------------

                `tf.initializers`       - An initializer tensor.
            '''
            configObj = self.getConfig()
            # Implementation of auto stddev.
            if (configObj["stddev"] == "auto"):
                configObj["stddev"] = 1/shape[0]
            return self._reference(**configObj)

    class RandomUniform(IInitializer):
        '''
			Random value variable initializer following a uniform distribution within a range.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, minval: float = -1.0, maxval: float = 1.0, seed: int = None):
            '''
			Create a random variable initializer following a uniform distribution within a range.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                minval  `float` - The minimum possible initalized value of random varaible initializer.

                maxval  `float` - The maximum possible initalized value the random varaible initializer.
                
                seed    `int`   - Python random seed.
            '''
            super().__init__(tf.random_uniform_initializer)
            self.minval = minval
            self.maxval = maxval
            self.seed = seed

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"minval": self.minval, "maxval": self.maxval, "seed": self.seed}

    class Orthogonal(IInitializer):
        '''
			Random variable initializer generating an orthogonal matrix.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, gain: float = 1.0, seed: int = None):
            '''
			Create a random variable initializer generating an orthogonal matrix.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                gain  `float`   - The multiplicative factor applying on the orthogonal matrix.
                
                seed    `int`   - Python random seed.
            '''
            super().__init__(tf.orthogonal_initializer)
            self.gain = gain
            self.seed = seed

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"gain": self.gain, "seed": self.seed}

    class Identity(IInitializer):
        '''
			Variable initializer generating an identity matrix.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, gain: float = 1.0):
            '''
			Create a variable initializer generating an identity matrix.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                gain  `float`   - The multiplicative factor applying on the identity matrix.
            '''
            super().__init__(tf.keras.initializers.Identity)
            self.gain = gain

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"gain": self.gain}
    
    class GlorotNormal(IInitializer):
        '''
			A glorot normal initializer.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, seed: int = None):
            '''
			Create a glorot normal initializer.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                seed  `float`   - Python random seed.
            '''
            super().__init__(tf.glorot_normal_initializer )
            self.seed = seed

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"seed": self.seed}
    
    class GlorotUniform(IInitializer):
        '''
			A glorot uniform initializer.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, seed: int = None):
            '''
			Create a glorot uniform initializer.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                seed  `float`   - Python random seed.
            '''
            super().__init__(tf.glorot_uniform_initializer)
            self.seed = seed

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"seed": self.seed}
    
    class HeNormal(IInitializer):
        '''
			A he normal initializer.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, seed: int = None):
            '''
			Create a he normal initializer.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                seed  `float`   - Python random seed.
            '''
            super().__init__(tf.keras.initializers.he_normal)
            self.seed = seed

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"seed": self.seed}
    
    class HeUniform(IInitializer):
        '''
			A he uniform initializer.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, seed: int = None):
            '''
			Create a he uniform initializer.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                seed  `float`   - Python random seed.
            '''
            super().__init__(tf.keras.initializers.he_uniform)
            self.seed = seed

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"seed": self.seed}
    
    class LecunNormal(IInitializer):
        '''
			A LeCun normal initializer.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, seed: int = None):
            '''
			Create a LeCun normal initializer.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                seed  `float`   - Python random seed.
            '''
            super().__init__(tf.keras.initializers.lecun_normal)
            self.seed = seed

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"seed": self.seed}
    
    class LecunUniform(IInitializer):
        '''
			A LeCun uniform initializer.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, seed: int = None):
            '''
			Create a LeCun uniform initializer.   --- UPDATED (Dexter) 20190118

                Parameters
                ------------------------------

                seed  `float`   - Python random seed.
            '''
            super().__init__(tf.keras.initializers.lecun_uniform)
            self.seed = seed

        def getConfig(self) -> Dict[str, Any]:
            '''
			Get a configuration dict object describing this variable initializer.   --- UPDATED (Dexter) 20180920

                Returns
                ------------------------------

                `dict[str, *]`  - A configuration dict object describing this variable initializer.
            '''
            return {"seed": self.seed}

    def __init__(self, initializer: 'VarConfig.IInitializer' = TruncatedNormal(), l1Loss: bool = False, l2Loss: bool = False, l1Decay: float = None, l2Decay: float = None, device: str = None):
        '''
			Create a variable initializer.   --- UPDATED (Dexter) 20181125

            Parameters
            ------------------------------

            initializer         `VarConfig.IInitializer`     - The initializer configuration of this variable; default as the truncated normal initializer.

            l1Loss              `bool`          - Whether to take L1-loss on this variable.

            l2Loss              `bool`          - Whether to take L2-loss on this variable.

            l1Decay             `float`         - The constant for weighting L1-loss of this variable.

            l2Decay             `float`         - The constant for weighting L2-loss of this variable.

            device              `str`           - The device like CPU or GPU this training will rely on.
        '''
        self.initializer = initializer
        self.l1Loss = l1Loss
        self.l2Loss = l2Loss
        self.l1Decay = l1Decay
        self.l2Decay = l2Decay
        self.device = device
    
    def create(self, name: str, shape: List[int], dtype: 'tf.DType' = tf.float32, defaultDevice: str = "/cpu:0") -> 'tf.Variable':
        '''
			Create the variable in TensorFlow. Object-oriented creation over the deprecated static Train.createVar() methods.   --- UPDATED (Dexter) 20181003

            Parameters
            ------------------------------

            name                `str`           - The variable name.
            
            shape               `list(int+)`    - The shape of the variable.
            
            dtype               `tf.DType`      - The data type of this variable.
            
            Returns
            ------------------------------

            'tf.Variable'   - A TensorFlow variable.
        '''
        # Create the variable on the requested device.
        with tf.device(self.device or defaultDevice):
            # Get the variable of the requested name, shape, initializer and dtype.
            newVar = tf.get_variable(name, shape, initializer=self.initializer if isinstance(self.initializer, tf.keras.initializers.Initializer) else self.initializer.getTrainingInitializer(shape = shape), dtype=dtype)
        
        # Add to L1-loss if needed.
        if (self.l1Loss):
            l1Loss = tf.reduce_sum(newVar)
            tf.add_to_collection("losses", l1Loss if (self.l1Decay is None or self.l1Decay == 1) else tf.multiply(l1Loss, self.l1Decay, name="l1Loss"))
        
        # Add to L2-loss if needed.
        if (self.l2Loss):
            l2Loss = tf.nn.l2_loss(newVar)
            tf.add_to_collection("losses", l2Loss if (self.l2Decay is None or self.l2Decay == 1) else tf.multiply(l2Loss, self.l2Decay, name="l2Loss"))

        # Return the newly created variable.
        return newVar
    
    @staticmethod
    def getFromGraph(name: str, device: str = '/cpu:0') -> 'tf.Variable':
        '''
			Create a previously created training variable in TensorFlow graph.   --- UPDATED (Dexter) 20190118

            Parameters
            ------------------------------

            name                `str`           - The name of the model graph variable.

            device              `str`           - The device like CPU or GPU this training will rely on.

            Returns

            ------------------------------

            `tf.Variable`   - The TensorFlow variable of the requested name.
        '''
        # Get the variable on the requested device.
        with tf.device(device):
            var = tf.get_variable(name)
            
        # Return the newly created variable.
        return var

    @staticmethod
    def setAsReshape(shape: List[Union[int, 'tf.Dimension']]) -> List[int]:
        '''
			Convert a shape to be a definition of reshape.   --- UPDATED (Dexter) 20181114

            Parameters
            ------------------------------

            shape               `list(int+)|list(tf.Dimension+)`    - The shape of the variable.


            Returns
            ------------------------------

            shape               `list(int+)`    - The shape of the variable, with None shape as -1.
        '''
        if len([s for s in shape if s in [None, -1]]) > 1:
            raise ValueError("Shapes with more than 2 dynamic dimension is not reshapeable.")

        return [(lambda s: -1 if s is None else s)(s.value if isinstance(s, tf.Dimension) else s) for s in shape]

class LinearTransformTensors():
    '''
			Class representing a linear transformation results and it's corresponding weights.   --- UPDATED (Dexter) 20181003
    '''
    def __init__(self, results: 'tf.Tensor', weights: List[tf.Tensor]):
        '''
			Ccreate a linear transformation tensors object, wrapping the results and it's corresponding weights as an object.   --- UPDATED (Dexter) 20181003
        '''
        self.results = results
        self.weights = weights

class LinearTransformConfig():
    '''
			Class representing a linear transformation configuration on a given tensor, controlling the behavior of the Wx+b operation.   --- UPDATED (Dexter) 20180920
    '''
    def __init__(self, weightConfig: 'VarConfig' = None, biasConfig: 'VarConfig' = None):
        '''
			Create a linear transform option using customized variable configurations. By default, an identity transformation is given.   --- UDPATED (Dexter) 20181003

            Parameters
            ------------------------------

            weightConfig        `VarConfig`     - The weight configuration. If None, no weight will be given, i.e. identity transformation.

            biasConfig          `VarConfig`     - The bias configuration. If None, no bias will be given.
        '''
        self.weightConfig = weightConfig
        self.biasConfig = biasConfig

    def buildOn(self, incomingTensor: 'tf.Tensor', toUnit: int = 1, axis: int = -1, weightSharing: 'tf.Tensor' = None, defaultDevice: str = "/cpu:0") -> 'tf.Tensor':
        '''
			Build the linear transformation on a given tensor. Noted this function should be wrapped within a scope.   --- UDPATED (Dexter) 20190210

            Parameters
            ------------------------------

            incomingTensor      `tf.Tensor`     - An incoming tensor to undergo this linear transformation.

            toUnit              `int`           - The number of outcoming unit (channel) of the last dimension of the output tensor.

            axis                `int`           - The axis of matrix multiplication.
            
            weightSharing       `tf.Tensor`     - Any sharing weight to override this settings.

            defaultDevice       `str`           - The default device that the variable will be created.

            Returns

            ------------------------------

            `LinearTransformTensors`    - The result tensor after this linear transformation, and the list of the weights.

        '''
        w = weightSharing
        weights = []
        incomingShape = [s.value for s in incomingTensor.shape]

        # Raise Error if incoming tensor has dimension lower than the required axis.
        if (axis >= len(incomingShape)):
            raise ValueError("Linear Transformation axis should within the dimension of the incoming tensor.")
        
        # Flatten the incoming tensor to the required axis.
        elif (axis < len(incomingShape)):
            flattenSize = functools.reduce(lambda x,y: x*y, incomingShape[axis:], 1)
            incomingTensor = tf.reshape(incomingTensor, [*VarConfig.setAsReshape(incomingShape[:axis]), flattenSize])
            incomingShape = [s.value for s in incomingTensor.shape]
        
        # Temp reshape the tensor if the linear transformation axis is not the 2nd dimension.
        tempTranspose = False
        if (axis > 1 or (axis == -1 and len(incomingShape) > 2)):
            incomingTensor = tf.transpose(incomingTensor, [*[s for s in range(1, len(incomingShape) - 1)], 0, len(incomingShape) - 1])
            tempTranspose = True

        # Create weight if it's not using a sharing variable.
        if (w is None):
            
            # Create weight if there is a configuration.
            if (self.weightConfig is not None):
                w = self.weightConfig.create("weight", [*incomingShape[1:-1], incomingTensor.shape[-1].value, toUnit], dtype = incomingTensor.dtype, defaultDevice = defaultDevice)
                weights.append(w)
                wx = tf.matmul(incomingTensor, w)

            # Otherwise, just identically give the incoming tensor.
            else:
                wx = incomingTensor

        # Otherwise, use the sharing weight.
        else:
            weights.append(w)
            wx = tf.matmul(incomingTensor, w)
        
        # Create bias if there is a configuration.
        if (self.biasConfig is not None):
            b = self.biasConfig.create("bias", [toUnit], dtype = incomingTensor.dtype, defaultDevice = defaultDevice)
            results = tf.nn.bias_add(wx, b)
            weights.append(b)

        # Otherwise, there is no bias included.
        else:
            results = wx

        # Recover pre-axis dimensions.
        if (tempTranspose):
            results = tf.transpose(results, [len(incomingShape) - 2, *[s for s in range(0, len(incomingShape) - 2)], len(incomingShape) - 1])

        # Return the results and weights.
        return LinearTransformTensors(results, weights)
    
    @staticmethod
    def createBasicConfig(weightAvg: float = 0.0, weightStdDev: Union[float,str] = 0.04, weightL1Loss: bool = False, weightL2Loss: bool = True,
                            weightL1Decay: float = 1, weightL2Decay: float = 0.004, biasInitial = 0.001) -> 'LinearTransformConfig':
        '''
			Create a basic linear transform config, with truncated normal distributed initialized weight and a constant initialized bias.   --- UPDATED (Dexter) 20181109

            Parameters
            ------------------------------

            weightAvg           `float`         - The mean of the normal distributed weight. If None, no weight will be given, i.e. identity transformation.

            weightStdDev        `float|str`     - The standard deviation of the normal distributed weight. If "auto", it will be 1/(last dimension of incoming tensor).

            weightL1Loss        `bool`          - Whether to take L1-loss on this variable.

            weightL2Loss        `bool`          - Whether to take L2-loss on this variable.

            weightL1Decay       `float`         - The constant for weighting L1-loss of this variable.

            weightL2Decay       `float`         - The constant for weighting L2-loss of this variable.

            biasInitial          `float`        - Constant initial value of biases. If None, no bias will be given.

            Returns
            ------------------------------

            `LinearTransformConfig` - A LinearTransformConfig object from the given basic configuration settings.
        '''
        return LinearTransformConfig(weightConfig = None if weightAvg is None else VarConfig(initializer = VarConfig.TruncatedNormal(mean = weightAvg, stddev = weightStdDev),
                                                                                            l1Loss = weightL1Loss, l2Loss = weightL2Loss, l1Decay = weightL1Decay, l2Decay = weightL2Decay),
                                        biasConfig = None if biasInitial is None else VarConfig(initializer = VarConfig.Constant(value = biasInitial)))
    
class IncomingConfig():
    '''
			Class representing an incoming configurations of a node.   --- UPDATED (Dexter) 20180921
    '''
    class Types(Enum):
        '''
			Sub-class representing the available methods for incoming configuration.   --- UPDATED (Dexter) 20180919
        '''
        # Concat: Concatenate all incoming nodes. Nodes should have either the same number of dimensions, or higher dimension than the core incoming node.
        Concat = 1

        # Sum: Elemenally sum all incoming nodes. Nodes should be same in dimensions, or the pre-feature dimensions should be the multiple of the core incoming node. Implementation of ResNet or Highway Network may consider using this method.
        Sum = 3

        # Multiply: Elementally multiply all incoming nodes. Nodes should be same in dimensions, or the pre-feature dimensions should be the multiple of the core incoming node.
        Multiply = 4
        
        # Elementally sum and multiply the elemenental min of all incoming nodes with weighted proportion on summation and multiplication. Nodes should be same in dimensions, or the pre-feature dimensions should be the multiple of the core incoming node.
        Blend = 5
    
    class MergeDimTypes(Enum):
        '''
			Sub-class representing the type of handling merging higher dimensioned nodes to the lower dimensioned core node.   --- BETA --- UPDATED (Dexter) 20180923
        '''
        # SubSample: A subsampling is used.
        SubSample = 1

        # SpaceToDepth: Pre-operation axis are stacked in blocks of multiple of the core node dimensions as the operation dimension.
        SpaceToDepth = 2

        # Multiply: Adjacent features in the dimensions before the operation dimension will be max-pooled to the dimensions as the core node.
        MaxPool = 3
        
        # MeanPool: Adjacent features in the dimensions before the operation dimension will be mean-pooled to the dimensions as the core node.
        MeanPool = 4
    
    class Config():
        '''
			A instance class representing an incoming configruation object.   --- UPDATED (Dexter) 20181128
        '''
        def __init__(self, method: 'IncomingConfig.Types' = None, axis: int = -1, coreNode: 'LayerProfile' = None, mergeDim: 'IncomingConfig.MergeDimTypes' = None):
            '''
			Create an incoming configuration object.  --- UPDATED (Dexter) 20180921

                Parameters
                ------------------------------

                method      `IncomingConfig.Types`            - A numerical representation for the incoming option method type.

                axis        `int`                                   - The operation axis.

                coreNode    `LayerProfile`                          - The reference index of the LayerProfile.fromNode list. If None, an automated selection will be used.

                mergeDim    `IncomingConfig.MergeDimTypes`    - The type of dimension-merging methods if needed.
            '''
            if method is None or method not in IncomingConfig.Types:
                raise ValueError("Required incoming configurations is not supported.")
            self.method = method

            self.coreNode = coreNode

            if mergeDim is None:
                mergeDim = IncomingConfig.MergeDimTypes.SubSample
            elif mergeDim not in IncomingConfig.MergeDimTypes:
                raise ValueError("Required incoming configurations is not supported.")
            self.mergeDim = mergeDim

            if not (isinstance(axis, int) and axis >= -1):
                raise ValueError("axis should be an integer greater than or equal to -1.")
            self.axis = axis
        
        def __repr__(self) -> str:
            '''
			Get a string representation of this incoming configuration.   --- UPDATED (Dexter) 20180919

                Returns
                ------------------------------

                `str`   - The representation of this method.
            '''
            return "<IncomingConfig: method: \"" + str(self) + "\">"

        def __str__(self) -> str:
            '''
			Returns the method string of this incoming configuration.   --- UPDATED (Dexter) 20180919

                Returns
                ------------------------------

                `str`   - The name of this method.
            '''
            return self.method.name
    
    class Concat(Config):
        '''
			Class representing an option of concatenating incoming nodes.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, coreNode: 'LayerProfile' = None, axis: int = -1, mergeDim: int = None):
            '''
			Create an incoming concatenation option.   --- UPDATED (Dexter) 20180919

                Parameters
                ------------------------------

                coreNode    `LayerProfile`      - The reference index of the LayerProfile.fromNode list. If None, a selection on nearest and smallest dimensioned node will be used.

                axis        `int`               - Incoming node will be flattened to this axis for concatenation.

                mergeDim    `int`               - The type of dimension-merging methods if needed.
            '''
            super().__init__(IncomingConfig.Types.Concat, axis, coreNode, mergeDim)

    class ElementWiseConfig(Config):
        '''
			Class representing an option of summing incoming nodes element-wise.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, method: int = None, coreNode: 'LayerProfile' = None, axis: int = -1, mergeDim: int = None, transformGate: int = None, 
                    transformConfig: 'LinearTransformConfig' = LinearTransformConfig(weightConfig = VarConfig(initializer = VarConfig.TruncatedNormal(mean = 0.0, stddev = 0.05))),
                    dimensionMappingConfig: 'LinearTransformConfig' = LinearTransformConfig(weightConfig = VarConfig(initializer = VarConfig.TruncatedNormal(mean = 0.0, stddev = 0.05)))):
            '''
			Create an incoming configuration object with element-wise operation.   --- UPDATED (Dexter) 20190123

                Parameters
                ------------------------------

                method              `int`           - A numerical representation for the incoming option method type.

                coreNode            `LayerProfile`  - The reference index of the @LayerProfile.fromNode list. If None, a selection on the node with smallest dimensioned and longest path from the root source will be used.

                axis                `int`           - The operation axis.
                
                mergeDim            `int`           - The type of dimension-merging methods if needed.

                transformGate       `LayerProfile|int`          - The reference layer of the @LayerProfile.fromNode list of the node on which a transform gate will apply with distributed total proportion of nodes as 1. If -1, a sellection on the node with shortest path from the root source will be used. If None, no transform gate will be used. Implemenetation of Highway Network may need this option.

                transformConfig     `LinearTransformConfig`     - The linear transform configuration of the transform gate.

                dimensionMappingConfig  `LinearTransformConfig` - The linear transform configuration of any mismatched dimensioned data with the coreNode. If None, the dimensions stated in `self.axis` should be the same across all incoming nodes.
            '''
            super().__init__(method, axis, coreNode, mergeDim)

            if transformGate is not None and not (isinstance(transformGate, int) and transformGate >= -1):
                raise ValueError("transformGate should be an integer greater than or equal to -1.")
            self.transformGate = transformGate

            if (transformGate is not None and (transformConfig is None or not(isinstance(transformConfig, LinearTransformConfig)))):
                raise ValueError("Where transform gate is needed, transformConfig should be passed with a LinearTransformConfig object.")
            self.transformConfig = transformConfig

            self.dimensionMappingConfig = dimensionMappingConfig

    class Sum(ElementWiseConfig):
        '''
			Class representing an option of summing incoming nodes element-wise.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, coreNode: 'LayerProfile' = None, axis: int = -1, mergeDim: int = None, transformGate: int = None, 
                    transformConfig: 'LinearTransformConfig' = LinearTransformConfig(weightConfig = VarConfig(initializer = VarConfig.TruncatedNormal(mean = 0.0, stddev = 0.05))),
                    dimensionMappingConfig: 'LinearTransformConfig' = LinearTransformConfig(weightConfig = VarConfig(initializer = VarConfig.TruncatedNormal(mean = 0.0, stddev = 0.05)))):
            '''
			Create an incoming summation option object.   --- UPDATED (Dexter) 20180920

                Parameters
                ------------------------------

                coreNode            `LayerProfile`  - The reference index of the LayerProfile.fromNode list. If None,  a selection on the node with smallest dimensioned and longest path from the root source will be used.

                axis                `int`           - The operation axis.
                
                mergeDim            `int`           - The type of dimension-merging methods if needed.

                transformGate       `int`           - The reference index of the LayerProfile.fromNode list of the node on which a transform gate will apply with distributed total proportion of nodes as 1. If -1, a sellection on the node with shortest path from the root source will be used. If None, no transform gate will be used. Implemenetation of Highway Network may need this option.

                transformConfig     `LinearTransformConfig`     - The linear transform configuration of the transform gate.

                dimensionMappingConfig  `LinearTransformConfig` - The linear transform configuration of any mismatched dimensioned data with the coreNode. If None, the dimensions stated in `self.axis` should be the same across all incoming nodes.
            '''
            super().__init__(IncomingConfig.Types.Sum, coreNode, axis, mergeDim, transformGate, transformConfig, dimensionMappingConfig)

    class Multiply(ElementWiseConfig):
        '''
			Class representing an option of multiplying incoming nodes element-wise.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, coreNode: 'LayerProfile' = None, axis: int = -1, mergeDim: int = None, transformGate: int = None, 
                    transformConfig: 'LinearTransformConfig' = LinearTransformConfig(weightConfig = VarConfig(initializer = VarConfig.TruncatedNormal(mean = 0.0, stddev = 0.05))),
                    dimensionMappingConfig: 'LinearTransformConfig' = LinearTransformConfig(weightConfig = VarConfig(initializer = VarConfig.TruncatedNormal(mean = 0.0, stddev = 0.05)))):
            '''
			Create an incoming multiplication option object.   --- UPDATED (Dexter) 20180920

                Parameters
                ------------------------------

                coreNode            `LayerProfile`  - The reference index of the LayerProfile.fromNode list. If None, a selection on the node with smallest dimensioned and longest path from the root source will be used.

                axis                `int`           - The operation axis.
                
                mergeDim            `int`           - The type of dimension-merging methods if needed.

                transformGate       `int`           - The reference index of the LayerProfile.fromNode list of the node on which a transform gate will apply with distributed total proportion of nodes as 1. If -1, a sellection on the node with shortest path from the root source will be used. If None, no transform gate will be used. Implemenetation of Highway Network may need this option.

                transformConfig     `LinearTransformConfig`     - The linear transform configuration of the transform gate.

                dimensionMappingConfig  `LinearTransformConfig` - The linear transform configuration of any mismatched dimensioned data with the coreNode. If None, the dimensions stated in `self.axis` should be the same across all incoming nodes.
            '''
            super().__init__(IncomingConfig.Types.Multiply, coreNode, axis, mergeDim, transformGate, transformConfig, dimensionMappingConfig)

    class Blend(ElementWiseConfig):
        '''
			Class representing an option of blending incoming nodes element-wise.   --- UPDATED (Dexter) 20180920
        '''
        def __init__(self, coreNode: 'LayerProfile' = None, axis: int = -1, mergeDim: int = None, transformGate: int = None, 
                    transformConfig: 'LinearTransformConfig' = LinearTransformConfig(weightConfig = VarConfig(initializer = VarConfig.TruncatedNormal(mean = 0.0, stddev = 0.05))),
                    dimensionMappingConfig: 'LinearTransformConfig' = LinearTransformConfig(weightConfig = VarConfig(initializer = VarConfig.TruncatedNormal(mean = 0.0, stddev = 0.05))),
                    learnableBlend: bool = False):
            '''
			Create an incoming blending option object with x1 + x2 + ... + xN - N * (x1 * x2 * x3 * ... * xN).   --- UPDATED (Dexter) 20180920

                Parameters
                ------------------------------

                coreNode            `LayerProfile`  - The reference index of the LayerProfile.fromNode list. If None, a selection on the node with smallest dimensioned and longest path from the root source will be used.

                axis                `int`           - The operation axis.
                
                mergeDim            `int`           - The type of dimension-merging methods if needed.

                transformGate       `int`           - The reference index of the LayerProfile.fromNode list of the node on which a transform gate will apply with distributed total proportion of nodes as 1. If -1, a sellection on the node with shortest path from the root source will be used. If None, no transform gate will be used. Implemenetation of Highway Network may need this option.

                transformConfig     `LinearTransformConfig`     - The linear transform configuration of the transform gate.

                dimensionMappingConfig  `LinearTransformConfig` - The linear transform configuration of any mismatched dimensioned data with the coreNode. If None, the dimensions stated in `self.axis` should be the same across all incoming nodes.

                learnableBlend      `bool`          - If True, instead of originally blending, it will follow a1 * x1 + a2 * x2 + ... + aN * xN + b * (x1 * x2 * x3 * ... * xN) where a1 = a2 = ... = aN = 1 and b = N are learnable initialized constant values.
            '''
            super().__init__(IncomingConfig.Types.Blend, coreNode, axis, mergeDim, transformGate, transformConfig, dimensionMappingConfig)
            self.learnableBlend = learnableBlend

class OutputConfig():
    '''
			Class representing an output configuration of a node.   --- UPDATED (Dexter) 20180921
    '''
    class Types(Enum):
        '''
			Sub-class representing the available methods for output configuration.   --- UPDATED (Dexter) 20181003
        '''
        # Default: Output as node matrix operations.
        Default = 0
        
        # Faltten: Flatten the output on the requested axis.
        Flatten = 1
            
        # Reshape: Reshape the output as specific shape.
        Reshape = 2
        
        # SelectChannel: Select a specific dimension channel. --- RESERVED
        SelectChannel = 3
    
    class Config():
        '''
			 A instance class representing an output configruation object.   --- UPDATED (Dexter) 20181128
        '''
        def __init__(self, method: 'OutputConfig.Types' = None):
            '''
			Create an output configuration object.  --- UPDATED (Dexter) 20180921

                Parameters
                ------------------------------

                method      `OutputConfig.Types`   - A numerical representation for the incoming option method type.
            '''
            if method is None or not method in OutputConfig.Types:
                raise ValueError("Required output method is not supported.")
            self.method = method
        
        def __repr__(self) -> str:
            '''
			Get a string representation of this output configuration.   --- UPDATED (Dexter) 20180921

                Returns
                ------------------------------

                `str`   - The representation of this method.
            '''
            return "<OutuputConfig: method: \"" + str(self) + "\">"

        def __str__(self) -> str:
            '''
			Returns the method string of this output configuration.   --- UPDATED (Dexter) 20180921

                Returns 
                ------------------------------

                `str`   - The name of this method.
            '''
            return self.method.name
    
    
    class Default(Config):
        '''
			Class representing a default config for the output node.   --- UPDATED (Dexter) 20180921
        '''
        def __init__(self):
            '''
			Create a default output config.   --- UPDATED (Dexter) 20180921
            '''
            super().__init__(OutputConfig.Types.Default)

    class Flatten(Config):
        '''
			Class representing a flattening process for the output node.   --- UPDATED (Dexter) 20180921
        '''
        def __init__(self, axis: int = 1):
            '''
			Create a flattening output config.   --- UPDATED (Dexter) 20180921

                Parameters
                ------------------------------

                axis        `int`   - The flattening axis of the output node.
            '''
            super().__init__(OutputConfig.Types.Flatten)
            self.axis = axis

    class Reshape(Config):
        '''
			Class representing a reshape process for the output node.   --- UPDATED (Dexter) 20180921
        '''
        def __init__(self, shape: List[int] = (-1,)):
            '''
			Create a reshaping output config.   --- UPDATED (Dexter) 20180921

                Parameters
                ------------------------------

                shape       `list[int]`     - The shape of the available dimensions of each item.
            '''
            super().__init__(OutputConfig.Types.Reshape)
            self.shape = shape

    class SelectChannel(Config):
        '''
			Class representing a channel selection for the output node.   --- RESERVED --- UPDATED (Dexter) 20180921
        '''
        def __init__(self, axis: int = 1, channel: int = 0):
            '''
			Create a chanel selection output config.   --- RESERVED --- UPDATED (Dexter) 20181125

                Parameters
                ------------------------------

                axis        `int`           - The selection axis of the output node.

                channel     `int`           - The selection channel of the output node.
            '''
            super().__init__(OutputConfig.Types.SelectChannel)
            self.axis = axis
            self.channel = channel

class BuildItemList():
    '''
			Class representing different items according to different builds.   --- UPDATED (Dexter) 20181115
    '''
    def __init__(self):
        '''
			Create a build item list object.   --- UPDATED (Dexter) 20181115
        '''
        self.builds = {}

    def __getitem__(self, buildNo: int) -> Any:
        '''
			Get an item by a build number.   --- UPDATED (Dexter) 20181115
        
            Parameters
            ------------------------------

            buildNo     `int`           - The requested build.

            Returns
            ------------------------------

            `*`     - The requested item of a specific build.
        '''
        if (buildNo not in self.builds):
            self.builds[buildNo] = [] 
        return self.builds[buildNo]
    
    def __setitem__(self, buildNo: int, item: Any) -> Any:
        '''
			Set a list of sources on a specific build number.   --- UPDATED (Dexter) 20181115
        
            Parameters
            ------------------------------

            buildNo     `int`   - The target build.

            item        `*`     - The item of a specific build.

            Returns
            ------------------------------

            `*`     - The new item of the target build.
        '''
        self.builds[buildNo] = item
        return self.builds[buildNo]


class BuildSourceList(BuildItemList):
    '''
			Class representing different sources according to different builds.   --- UPDATED (Dexter) 20181115
    '''
    def __setitem__(self, buildNo: int, sources: List[Tuple[int, str]]) -> List[Tuple[int, str]]:
        '''
			Set a list of sources on a specific build number.   --- UPDATED (Dexter) 20181115
        
            Parameters
            ------------------------------

            buildNo     `int`                                   - The target build.

            sources     'list[Layertuple[int, str]Profile]'     - The list of sources of a specific build.

            Returns
            ------------------------------

            `list[tuple[int, str]]`     - The new list of sources.
        '''
        if (not all([(isinstance(st[0], int) and isinstance(st[1], str)) for st in sources])):
            raise ValueError("BuildSourceList should append a tuple of source information.")

        return super().__setitem__(buildNo, sources)

class BuildLayerList(BuildItemList):
    '''
			Class representing different layers according to different builds.   --- UPDATED (Dexter) 20181115
    '''
    def __setitem__(self, buildNo: int, layerProfiles: List['LayerProfile']) -> List['LayerProfile']:
        '''
			Add a layer on a specific build number.   --- UPDATED (Dexter) 20181115
        
            Parameters
            ------------------------------

            buildNo     `int`               - The target build.

            layerProfiles    'list[LayerProfile]'  - The list of layer profiles of a specific build.

            Returns
            ------------------------------

            `list[LayerProfile]`     - The new list of layers.
        '''
        if (not all([isinstance(lp, LayerProfile) for lp in layerProfiles])):
            raise ValueError("LayerNodeList should append LayerProfile objects.")

        return super().__setitem__(buildNo, layerProfiles)

class BuildOrderList(BuildItemList):
    '''
			Class representing different orders according to different builds.   --- UPDATED (Dexter) 20181115
    '''
    def __setitem__(self, buildNo: int, order: int) -> int:
        '''
			Set the order on a specific build number.   --- UPDATED (Dexter) 20181115
        
            Parameters
            ------------------------------

            buildNo     `int`           - The target build.

            order       `int`           - The order of a specific build.

            Returns
            ------------------------------

            `list[int]`                 - The new order.
        '''
        if (not isinstance(order, int)):
            raise ValueError("Order should be an integer.")

        return super().__setitem__(buildNo, order)

class LayerProfile():
    '''
			Class representing a layer module.   --- UPDATED (Dexter) 20180921
    '''
    def __init__(self, name: str = None, layerUnits: int = 150, final: bool = False, 
                    incomingConfig: 'IncomingConfig' = IncomingConfig.Concat(), 
                    linearTransform: 'LinearTransformConfig' = LinearTransformConfig.createBasicConfig(weightAvg=0, weightStdDev = 0.004, weightL1Loss = False, weightL2Loss = True, weightL2Decay = 0.004, biasInitial = 0.001),
                    activation: str = "relu", activationParams: Dict[str, Any] = {}, 
                    batchNorm: bool = True, batchNormParams: Dict[str, Any] = {}, dropout: float = 1, 
                    outputConfig: 'OutputConfig' = OutputConfig.Default()):
        '''
			Create a new layer.   --- UPDATED (Dexter) 20181011

            Parameters
            ------------------------------

            name            `str`   - The name of this layer.
            
            layerUnits      `int`   - The number of hidden units in this layer.

            final           `bool`  - Whether this is a final layer (training task).

            incomingConfig  `IncomingConfig`    - Input configurations.

            linearTransform `LinearTransformConfig` - The linear transformation configuration.
            
            activation      `str`   - The activation function of this layer.

            activationParams    `dict{str:*}`   - Activation parameters as defined in TensorFlow.

            batchNorm       `bool`  - Whether to use batch normalization before activation function.

            batchNormParams     `dict{str:*}`   - Batch normalization parameters as defined in TensorFlow.

            dropout         `float` - The keep probability of dropout during training.

            outputConfig    `OutputConfig`      - Output configurations.
        '''
        # Ensure the layer name is a string.
        if name is not None and classof(name) not in ["str", "String"]:
            raise ValueError("Layer Profile Name must be a string")
        
        # Define layer setup configurations.
        self.name = name
        self.layerUnits = layerUnits
        self.linearTransform = linearTransform
        self.batchNorm = batchNorm
        self.batchNormParams = batchNormParams
        self.activation = activation
        self.activationParams = activationParams
        self.incomingConfig = incomingConfig
        self.outputConfig = outputConfig
        
        # Define model-related information.
        self._dataType = tf.float32
        self._final = final
        self.fromSource = BuildSourceList()
        self.fromNode = BuildLayerList()
        self.toNode = BuildLayerList()
        self._order = BuildOrderList()

        # Information that is used within a build.
        self._outputTensor = None
        self._built = False
        self._inputCollections = []
        self._weights = []
        self.weightLogging = True

        # Define training-related information.
        self.train = None
        self.dropout = dropout
        self._dropoutTensor = None

    @property
    def dtype(self):
        '''
			Get the data type of this layer.   --- UPDATED (Dexter) 20181214
        '''
        return self._dataType

    def switchOffWeightLogging(self):
        '''
			Optionally switch off weightLogging.   --- UPDATED (Dexter) 20181214
        '''
        self.weightLogging = False

    def __clearTempTensors__(self):
        '''
			Clear temp tensors that are on previous graphs, usually call for a new build.   --- UPDATED (Dexter) 20181110
        '''
        self._weights = []
        self._dropoutTensor = None

    def __build__(self, buildNo: int):
        '''
			Build the TensorFlow Graph of this layer.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self.__clearTempTensors__()
        raise ValueError("LayerProfile cannot be built directly. Please opt for a specific layer profile like CNNLayer or a CustomLayerProfile.")

    def __getTensorsFromPreviousNodes__(self, buildNo: int = 0) -> List['tf.Tensor']:
        '''
			Get the output tensors of the previous layer modules.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
            
            Returns
            ------------------------------

            `list[tf.Tensor]` - Output tensor of the previous nodes.
        '''
        return [n._outputTensor for n in self.fromNode[buildNo]]
    
    def __getTensorsFromPreviousSources__(self, buildNo: int = 0) -> List['tf.Tensor']:
        '''
			Get the data source tensors of the previous sources.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
            
            Returns
            ------------------------------

            `list[tf.Tensor]` - Output tensor of the previous sources.
        '''
        return [self.train._sourceTensors[n][idx] for n,idx in self.fromSource[buildNo]]
    
    def __getTensorsFromAvailableInputs__(self, buildNo: int = 0) -> List['tf.Tensor']:
        '''
			Get the feed-in tensors from the previous layer modules or sources.   --- DEPRECATED --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
            
            Returns
            ------------------------------

            `tf.Tensor` - Collection tensor of all incoming inputs.
        '''
        return [*self.__getTensorsFromPreviousSources__(buildNo = buildNo), *self.__getTensorsFromPreviousNodes__(buildNo = buildNo)]
    
    def __combineIncomingTensors__(self, buildNo: int = 0) -> 'tf.Tensor':
        '''
			Get the feed-in tensors from the previous layer modules or sources.   --- UPDATED (Dexter) 20190210

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
            
            Returns
            ------------------------------

            `tf.Tensor` - Collection tensor of all incoming inputs.
        '''
        self._inputCollections = incomingNodes = [*self.__getTensorsFromPreviousSources__(buildNo = buildNo), *self.__getTensorsFromPreviousNodes__(buildNo = buildNo)]

        # Standardize data type.
        incomingNodes = [tf.cast(node, self._dataType) if node.dtype != self._dataType else node for node in incomingNodes]
        
        # Ensure there is at least one incoming node.
        if (len(incomingNodes) == 0):
            raise ValueError("There is no input layers for this layer (" + self.name + ").")
        
        # If there is only one node, just pass the node to the layer.
        elif (len(incomingNodes) == 1):
            startTensor = incomingNodes[0]

        # If there is more than one node, collect the incoming node according to the incoming configurations.
        else:
            # Before any checking, reshape any incoming nodes of shape [None] into [None,1].
            incomingNodes = [node if len(node.shape) > 1 else tf.reshape(node, [node.shape[0].value, 1]) for node in incomingNodes]

            # 1)    Prepare necessary information.
            coreNodeTensor = None
            incomingShapes = [tuple(s.value for s in tensor.shape) for tensor in incomingNodes]
            lowestDim = min([len(s) for s in incomingShapes])
            isElementWiseOp = self.incomingConfig.method in [IncomingConfig.Types.Sum, IncomingConfig.Types.Multiply, IncomingConfig.Types.Blend]
            
            # 1-1)  Determine the core node.
            if self.incomingConfig.coreNode is None:
                # 1-1-A1)   Find the nodes with lowest number of dimensions.
                lowDTensors = [(idx, tensor) for idx,tensor in enumerate(incomingNodes) if len(tensor.shape) == lowestDim and idx >= len(self.fromSource[buildNo])]

                # 1-1-A2)   Determine the core node according to the lowest total dimension.
                totalDims = [(idx, functools.reduce(lambda a,b:a*b.value, tensor.shape[1:-1], 1)) for idx,tensor in lowDTensors]
                lowestTotalDims = min([s for idx, s in totalDims])
                coreNodeIdx = [idx for idx,s in totalDims if s == lowestTotalDims][0]
            
            else:
                # 1-1-B1)   Ensure the coreNode is in the incoming node.
                if (self.incomingConfig.coreNode not in self.fromNode[buildNo]):
                    raise ValueError("Core node not in the from node list.")
                
                # 1-1-B2)   Assign the core node.
                coreNodeIdx = len(self.fromSource[buildNo]) + self.fromNode[buildNo].index(self.incomingConfig.coreNode)

            # 1-1-B2)    Assign the defined coreNode.
            coreNodeTensor = incomingNodes[coreNodeIdx]

            # 1-1-2)  Determine the shape of the core node.
            coreShape = tuple(s.value for s in coreNodeTensor.shape)
            
            # 1-2)    Determine the concatenation axis.
            axis = (len(coreShape) - 1) if self.incomingConfig.axis == -1 else self.incomingConfig.axis

            # 1-2-1)  Raise errors for illogical connections.
            if (axis >= len(coreShape)):
                raise ValueError("Axis is larger than or equal to the length of core node's shape.")

            elif not all([(s[:axis] == coreShape[:axis] or all([(dim == coreShape[idx] or (dim == None and coreShape[idx] == None) or (dim % coreShape[idx] == 0)) for idx,dim in enumerate(s[:axis])])) for s in incomingShapes]):
                # 1-2-1-B) Case: CoreNode: [None,4,4,6] IncomingNode: [None,5,5,7] => Error;   CoreNode: [None,4,4,6] IncomingNode: [None,8,8,8] => OK
                raise ValueError("Some incoming layers are not having the same dimension or multiplicative dimension as the core node along the dimensions before the concatenation axis.")
            
            # 1-2-2)  Align the dimensions of all tensors through reshaping.
            for idx,t in enumerate(incomingNodes):
                # 1-2-2-A)  If other nodes are having shape longer than the core node, reshape it as the same dimension length.
                if len(incomingShapes[idx]) > axis + 1:
                    axisShapes = incomingShapes[idx][axis:]
                    newAxisShape = functools.reduce(lambda x,y: x*y, axisShapes, 1)
                    incomingNodes[idx] = tf.reshape(t, [*VarConfig.setAsReshape(incomingShapes[idx][:axis]), newAxisShape])
                    

                # 1-2-2-B)  If other nodes are having shape shorter than the core node, reshape it (create 1 dimension) as the same dimension length.
                elif len(incomingShapes[idx]) <= axis:
                    incomingNodes[idx] = tf.reshape(t, VarConfig.setAsReshape([(incomingShapes[idx][dimIdx] if dimIdx < len(incomingShapes[idx]) else 1) for dimIdx in range(0,axis)]))
                    incomingShapes[idx] = tuple(s.value for s in incomingNodes[idx].shape)
                    
                # 1-3)  Handle dimension reduction on dimensions before operation axis. --- BETA
                if incomingShapes[idx][:axis] != coreShape[:axis]:
                    # 1-3-1) Understand how dimensions are to be split.
                    compareSplit = [(None if (dim is None or coreShape[dimIdx] is None) else int(dim/coreShape[dimIdx])) for dimIdx,dim in enumerate(incomingShapes[idx][:axis])]
                    
                    # 1-3-2A) Handle incoming nodes according to the defined methods.
                    if (self.incomingConfig.mergeDim in [IncomingConfig.MergeDimTypes.SpaceToDepth, IncomingConfig.MergeDimTypes.SubSample]):
                        if (len(compareSplit) == 3 and (compareSplit[1] == compareSplit[2]) and axis == len(coreShape) - 1):
                            # 1-3-2A-A) Use tensorflow space to dimension if needed.
                            incomingNodes[idx] = tf.space_to_depth(t, compareSplit[1])
                        else:
                            tempTensor = t
                            transposeIdx = []
                            oriLastDimension = incomingShapes[idx][axis]
                            newLastDimension = oriLastDimension

                            # Below algoritm of space to depth.
                            # 1-3-2A-B-1) Split the tensor on the needed dimensions.
                            splittedDim = 0
                            splitList = []
                            for sDim,split in enumerate(compareSplit):
                                if split is not None and split > 1:
                                    tempTensor = tf.convert_to_tensor(tf.split(tempTensor, split, axis=(sDim + splittedDim)))
                                    newLastDimension *= split
                                    splittedDim += 1
                                    splitList.append(True)
                                else:
                                    splitList.append(False)
                            
                            # 1-3-2A-B-2) Construct transpose index list
                            totalSplitDim = splittedDim
                            for tDim,s in enumerate(splitList):
                                if s:
                                    splittedDim -= 1
                                    transposeIdx.append(splittedDim)
                                else:
                                    transposeIdx.append(totalSplitDim + tDim)
                            spaceDims = set(range(0, len(tempTensor.shape))) - set(transposeIdx)
                            transposeIdx = [*transposeIdx, *spaceDims]
                            
                            # 1-3-2A-B-2) Transpose the tensor accordingly.
                            tempTensor = tf.transpose(tempTensor, transposeIdx)

                            # 1-3-2A-B-3) Reshape and update the tensor.
                            incomingNodes[idx] = tf.reshape(tempTensor, [*VarConfig.setAsReshape([preShape.value for preShape in tempTensor.shape[:axis]]), newLastDimension])

                            # 1-3-2A-2-A)  If it's subsampling, select the first channel.
                            if self.incomingConfig.mergeDim == IncomingConfig.MergeDimTypes.SubSample:
                                tempTensor = incomingNodes[idx][...,0:oriLastDimension]
                                incomingNodes[idx] = tf.reshape(tempTensor, [*VarConfig.setAsReshape(tempTensor.shape), 1])

                    # 1-3-2B) Handle incoming nodes according to the defined methods.  --- BETA
                    elif (self.incomingConfig in [IncomingConfig.MergeDimTypes.MaxPool, IncomingConfig.MergeDimTypes.MeanPool]):
                        # Throw error if there is no multiplicable axis.
                        if (None in compareSplit[1:]):
                            raise ValueError("There should be no varied dimensions on dimension 1 or above.")
                        
                        # 1-3-2B-1) Use TensorFlow pool in case the first dimension is batch, last dimension is channel.
                        incomingNodes[idx] = tf.nn.pool(t, compareSplit[1:], "MAX" if self.incomingConfig == IncomingConfig.MergeDimTypes.MaxPool else "AVG", "VALID")
                            
            # 1-4-A)  Concatenate all tensors.
            if self.incomingConfig.method == IncomingConfig.Types.Concat:
                # Throw error if not all incoming nodes having dimensions equal except the axis dimension.
                firstShape = tuple(s.value for s in incomingNodes[0].shape)
                if (not all([all([(s.value == firstShape[idx] or idx == axis) for idx,s in enumerate(n.shape)]) for n in incomingNodes])):
                    raise ValueError("If it's concat, all dimensions of incoming tensors should be equal, except the axis dimension.")
                startTensor = tf.concat(incomingNodes, axis=axis)
            
            # 1-4-B) If they are having element-wise operations: --- BETA
            elif isElementWiseOp:
                # 1-4-B-1) Update incoming shapes, core node and shape.
                incomingShapes = [tuple(s.value for s in tensor.shape) for tensor in incomingNodes]
                coreNodeTensor = incomingNodes[coreNodeIdx]
                coreShape = tuple(s.value for s in coreNodeTensor.shape)
                
                # 1-4-B-2) Convert the dimensions if the core axis dimension are not the same with another node.
                with tf.variable_scope(self.name + "DimMap", reuse=tf.AUTO_REUSE) as scope:
                    for idx,t in enumerate(incomingNodes):
                        if (incomingShapes[idx] != coreShape):
                            dimMapResults = self.incomingConfig.dimensionMappingConfig.buildOn(incomingShapes[idx], toUnit = coreShape[-1], defaultDevice = self.train.device)
                            incomingShapes[idx] = dimMapResults.results
                            self._weights.extend(dimMapResults.weights)

                # 1-4-B-3) Handle transformation gate.
                if self.incomingConfig.transformGate is not None:
                    # 1-4-B-3-A) Implement original Highway Network settings if there is only two incoming nodes.
                    if (len(incomingNodes) == 2):
                        # Auto Determining the transform gate node.
                        if (self.incomingConfig.transformGate == -1):
                            incomingSources = self.fromSource[buildNo]
                            incomingLayerProfiles = self.fromNode[buildNo]
                            if (len(incomingSources) > 0):
                                longestPathNodeIdx = 0
                                longestPathNode = incomingNodes[0]
                            else:
                                lowestOrder = min([lp._order[buildNo] for lp in incomingLayerProfiles])
                                longestPathNodeIdx = [idx for idx,lp in enumerate(incomingLayerProfiles) if lp._order[buildNo] == lowestOrder][0]
                                longestPathNode = incomingNodes[longestPathNodeIdx]
                        else:
                            selGateIdx = [idx for idx,lp in enumerate(self.fromNode[buildNo]) if lp == self.incomingConfig.transformGate][0]
                            longestPathNode = incomingNodes[selGateIdx]

                        with tf.variable_scope(self.name + "TransGate", reuse=tf.AUTO_REUSE) as scope:
                            transformResults = self.incomingConfig.transformConfig.buildOn(longestPathNode, toUnit = coreShape[-1], defaultDevice = self.train.device)
                        transformGate = tf.nn.sigmoid(transformResults.results)
                        self._weights.extend(transformResults.weights)
                        transformGates = [((1-transformGate) if tIdx == longestPathNodeIdx else transformGate) for tIdx,tensor in enumerate(incomingNodes)]
                    
                    # 1-4-B-3-B) Use softmax as transformation gate if there are more than 2 incoming nodes.
                    else:
                        # Create transform gate from each incoming node.
                        allTransformResults = []
                        with tf.variable_scope(self.name + "TransGate", reuse=tf.AUTO_REUSE) as scope:
                            for t in incomingNodes:
                                transformResults = self.incomingConfig.transformConfig.buildOn(t, toUnit = coreShape[-1], defaultDevice = self.train.device)
                                allTransformResults.append(transformResults.results)
                                self._weights.extend(transformResults.weights)
                        transformGates = tf.nn.softmax(tf.transpose(tf.convert_to_tensor(allTransformResults), perm=[*[dimIdx for dimIdx in range(1, axis+2)], 0]))

                    # 1-4-B-3-2) Multiply the incoming nodes with transform gates.
                    transformedNodes = [tensor * transformGates[tIdx] for tIdx, tensor in enumerate(incomingNodes)]

                    # 1-4-B-3-3A) Sum all transformed nodes if the incoming config method is Sum.
                    if self.incomingConfig.method == IncomingConfig.Types.Sum:
                        startTensor = functools.reduce(lambda a,b: a+b, transformedNodes)
                    
                    # 1-4-B-3-3B) Multiply all transformed nodes if the incoming config method is Multiply.
                    elif self.incomingConfig.method == IncomingConfig.Types.Multiply:
                        startTensor = functools.reduce(lambda a,b: a*b, transformedNodes)
                    
                    # 1-4-B-3-3C) Blend all transformed nodes if the incoming config method is Blend.
                    elif self.incomingConfig.method == IncomingConfig.Types.Blend:
                        prodAll = functools.reduce(lambda a,b: a*b, transformedNodes)

                        # 1-4-B-3-3C-A) Create learnable parameters as the coefficient if it is learnable.
                        if (self.incomingConfig.learnableBlend):
                            learnableVarConfig = VarConfig(initializer = VarConfig.Constant(1))
                            blendAlpha = learnableVarConfig.create(self.name + "BlendAlpha", [len(transformedNodes)], defaultDevice = self.train.device)
                            preSum = [tensor * blendAlpha[tIdx] for tIdx, tensor in enumerate(incomingNodes)]
                            sumAll = functools.reduce(lambda a,b: a+b, preSum)

                            learnableVarConfig = VarConfig(initializer = VarConfig.Constant(len(transformedNodes)))
                            blendBeta = learnableVarConfig.create(self.name + "BlendBeta", [1], defaultDevice = self.train.device)
                            startTensor = sumAll - prodAll * blendBeta
                        
                        # 1-4-B-3-3C-B) Just sum up and minus the product if it is not learnable.
                        else:
                            sumAll = functools.reduce(lambda a,b: a+b, transformedNodes)
                            startTensor = sumAll - prodAll * len(transformedNodes)

            else:
                raise ValueError("Incoming method --- ", self.incomingConfig.method.name , " is not supported yet.")

        return startTensor

    def __commonLayerOps__(self, operatedLayer: 'tf.Tensor') -> 'tf.Tensor':
        '''
            Apply common layer operations: batch norm, activation, dropout to a layer-specific operated layer.   --- UPDATED (Dexter) 20190208

            Parameters
            ------------------------------

            operatedLayer     `tf.Tensor`     - The processed tensor after layer-specific operations like dense, convolution, etc.

            Returns

            ------------------------------

            `tf.Tensor`     - The output tensor of this node before final output configurations.
        '''
        # 1. Apply batch norm
        if (self.batchNorm):
            mid = tf.layers.batch_normalization(operatedLayer, training = self.train._bnTensor, **self.batchNormParams)
        else:
            mid = operatedLayer

        # 2. Apply activation
        if (self.activation is not None):
            mid = Train.activationFunctions(self.activation)(mid, **self.activationParams)

        # 3. Apply drop out
        if (self.dropout < 1):
            self._dropoutTensor = tf.placeholder(tf.float32)
            mid = tf.nn.dropout(mid, self._dropoutTensor)

        return mid

    def __processOutputTensor__(self, finalTensor: 'tf.Tensor') -> 'tf.Tensor':
        '''
			Process the output tensor according to output configs.   --- UPDATED (Dexter) 20181114

            Parameters
            ------------------------------

            finalTensor     `tf.Tensor`     - The processed tensor after this node.

            Returns

            ------------------------------

            `tf.Tensor`     - The output tensor of this node after the processing defined in output configurations.

        '''
        # A)  Output with no processing.
        if (self.outputConfig.method == OutputConfig.Types.Default):
            return finalTensor
        
        # B)  Flatten the output tensor.
        elif (self.outputConfig.method == OutputConfig.Types.Flatten):
            finalShape = finalTensor.shape
            flattenShape = finalShape[self.outputConfig.axis:]
            newAxisShape = functools.reduce(lambda x,y: x*y, flattenShape, 1)
            return tf.reshape(finalTensor, [*VarConfig.setAsReshape(finalShape[:self.outputConfig.axis]), newAxisShape])
        
        # C)  Reshape the output tensor.
        elif (self.outputConfig.method == OutputConfig.Types.Reshape):
            finalShape = finalTensor.shape
            shapeTotal = functools.reduce(lambda x,y: x*y, finalShape[1:], 1)
            newShapeTotal = functools.reduce(lambda x,y: x*y, self.outputConfig.getShape()[1:], 1)
            if (shapeTotal != newShapeTotal):
                raise ValueError("Item shape does not equalt to the output shape.")
            return tf.reshape(finalTensor, [-1, *self.outputConfig.getShape()[1:]])

    def __updateOrder__(self, buildNo: int = 0):
        '''
			Update the order of this layer in a chained way.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self._order[buildNo] = max([0, *[lp._order[buildNo] for lp in self.fromNode[buildNo]]]) + 1
        for lp in self.toNode[buildNo]:
            lp.__updateOrder__(buildNo=buildNo)

    def appendNode(self, layerProfile: 'LayerProfile', buildNo: int = 0):
        '''
			Append a layer next to this layer.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            layerProfile    `LayerProfile`  - The layer profile of the next layer after this layer.

            buildNo     `int`   - The build number to be built.
        '''
        # Ensure this is not appended on a final layer.
        if (self._final):
            raise ValueError("Layer cannot be appended on a FinalLayer.")
        elif (layerProfile in self.toNode[buildNo]):
            raise ValueError("Layer already connected.")

        # Set the connection with the next layer.
        self.toNode[buildNo].append(layerProfile)
        layerProfile.fromNode[buildNo].append(self)
        self.train.updateLayerOrder(layerProfile, buildNo = buildNo)

    def addSources(self, *sources: Union[int, Tuple[int, str], 'ColConfig'], clear: bool = False, buildNo: int = 0):
        '''
			Add multiple training data sources to this layer.   --- UPDATED (Dexter) 20181009

            Parameters
            ------------------------------

            *sources    `int|tuple(int,str)|ColConfig+`     - A list of sources of the Train.sources this layer is linking to.

            clear       `bool`                              - Whether to clear previous sources.

            buildNo     `int`   - The build number to be built.
        '''
        # Clear previous sources if needed.
        if (clear):
            self.fromSource[buildNo].clear()
        
        # Append the sources to the .fromSource attribute.
        for s in sources:
            addFromSource = s.getIDAndKey() if classof(s) == "ColConfig" else (s[0],s[1]) if (classof(s) in ["tuple", "list"] and len(s) == 2 and classof(s[0]) == "int" and classof(s[1]) == "str") else (s,"input")
            if (any([(s[0] == addFromSource[0] and s[1] == addFromSource[1]) for s in self.fromSource[buildNo]])):
                raise ValueError("Layer already connected.")
            self.fromSource[buildNo].append(addFromSource)
            self.train.updateLayerOrder(self, buildNo=buildNo)

    def setSymmetricLayer(self, builtLayerList: Dict[str, bool], useSymmetricWeights: bool = True, startFromThis: bool = False, untilLayer: Union[str, 'LayerProfile'] = None, buildNo: int = 0):
        '''
			Append the next symmetric layer on a particular layer.   --- BETA --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            builtLayerList      `dict{str:bool}`    - A map storing whether the corresponding symmetric layer has been built.

            useSymmetricWeights `bool`              - Whether to use symmetric weights.

            startFromThis       `bool`              - Whether this layer is the mirror layer.

            untilLayer          `str|LayerProfile`  - The ending symmetric layer. If None, it will be mirrored up to training sources, i.e. a Regressor will be appended.

            buildNo             `int`   - The build number to be built.
        '''
        # Get the previous layers.
        previousLayers = [l for l in self.fromNode[buildNo]]
        previousSources = self.fromSource[buildNo]

        # Raise Error if there are multiple incoming data.
        if (len(previousLayers) + len(previousSources) > 0):
            raise ValueError("Layers not having one and only one layer node inputs are not able to be set with a symmetric network.")

        # Apply symmetric node.
        newLayer = self.__copySymmetricLayerConfig__(useSymmetricWeights, buildNo = buildNo)
        if startFromThis:
            newLayer.attachTo(*self.train.getEndingLayerProfiles(buildNo = buildNo), buildNo = buildNo)
        else:
            newLayer.attachTo(*[self.train.layerProfiles[l.name+"_Sym"] for l in self.toNode[buildNo]], buildNo = buildNo)
        builtLayerList[self.name] = True

        # Loop each previous layers.
        for l in previousLayers:
            # Ensure the previous layer hasn't been built, and all of the next nodes of the previous layer have been built.
            if (builtLayerList[l.name] == False and all([builtLayerList[toL.name] for toL in l.toNode[buildNo]])):
                l.setSymmetricLayer(builtLayerList, buildNo = buildNo)
        
        # Loop each source.
        for s in previousSources:
            forLayers = self.train.getLayersUsingSource(*s, buildNo = buildNo)
            if (all([builtLayerList[toL.name] for toL in forLayers])):
                colConfig = self.train.getDataSource(*s)
                if (colConfig.dtype in [tf.int64, tf.int32]):
                    newLayer = Classifier(classCount = -1, compareSourceID = s[0], compareTensorIdx = s[1])
                else:
                    newLayer = Regressor(compareSourceID = s[0], compareTensorIdx = s[1])
                newLayer.attachTo(*[self.train.layerProfiles[l.name+"_Sym"] for l in forLayers], buildNo = buildNo)

    def __copySymmetricLayerConfig__(self, useSymmetricWeights: bool = True, buildNo: int = 0) -> 'LayerProfile':
        '''
			Base class method for creating a new layer profile but with a symmetric configuration. No actions taken, and a sub-class should be used.   --- BETA --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            useSymmetricWeights `bool`              - Whether to use symmetric weights.

            buildNo             `int`   - The build number to be built.
        '''
        if (len(self.fromNode[buildNo]) != 1):
            raise ValueError("Layers not having one and only one layer node inputs are not able to be copied in a symmetric way.")

        return self.copy(self.name+"_Sym")

    def copy(self, name: str) -> 'LayerProfile':
        '''
			Copy this layer profile.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            name    `str`   - The new name of the copied layer
        '''
        # Layer can't be copied if it is already built.
        if (self._built):
            raise ValueError("This layer (" + self.name + ") cannot be copied because it has been built.")
        # Ensure this is not a subclass.
        elif (self.__class__.__name__ != "LayerProfile"):
            raise ValueError("This layer class (" + self.__class__.__name__ + ") has not supported for copying.")
        
        # Create a new Layer Profile on this.
        return LayerProfile(name = name, layerUnits = self.layerUnits, final = self._final,
                            incomingConfig = self.incomingConfig, linearTransform = self.linearTransform,
                            activation = self.activation, activationParams = self.activationParams,
                            batchNorm = self.batchNorm, batchNormParams = self.batchNormParams, dropout = self.dropout, 
                            outputConfig = self.outputConfig)

    def appendOn(self, layerOrSource: Union['LayerProfile', 'ColConfig'], buildNo: int = 0) -> 'LayerProfile':
        '''
			Append this layer on a previously another layer or data source.   --- UPDATED (Dexter) 20180625

            Parameters
            ------------------------------

            layerOrSource    `LayerProfile|ColConfig`      - The layer profile or column config on which this layer append.

            buildNo             `int`   - The build number to be built.

            Returns
            ------------------------------

            `LayerProfile`   - This layer profile object.
        '''
        if issubclass(layerOrSource.__class__, LayerProfile):
            # Ensure the previous layer is attached to a training model.
            if layerOrSource.train is None:
                raise ValueError("The layer on which this layer append is not specified in any training models.")
            
            layerOrSource.train.appendLayer(self, appendAt = layerOrSource, buildNo=buildNo)
            
        elif issubclass(layerOrSource.__class__, ColConfig):
            # Ensure the column config is attached to a training model.
            if layerOrSource._trainSource is None:
                raise ValueError("The ColConfig object on which this layer append is not specified in any training sources.")
            elif layerOrSource._trainSource.train is None:
                raise ValueError("The TrainSource object containing this ColConfig object on which this layer append is not specified in any training models.")
            
            layerOrSource._trainSource.train.appendLayer(self, appendAt = layerOrSource, buildNo=buildNo)
        
        else:
            # Ensure the layerOrSource is an appropriate object.
            raise ValueError("`layerOrSource` must be a LayerProfile or ColConfig object.")

        return self

    def attachTo(self, *layerOrSources: Union['LayerProfile', 'ColConfig'], buildNo: int = 0) -> 'LayerProfile':
        '''
			Attach this layer to several previous another layer or data source.   --- BETA --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            *layerOrSource    `LayerProfile|ColConfig+`      - The layer profile or column config on which this layer append.

            Returns
            ------------------------------

            `LayerProfile`   - This layer profile object.
        '''
        # Ensure the layerOrSource is an appropriate object.
        if any([not (issubclass(ls.__class__, LayerProfile) or issubclass(ls.__class__, ColConfig)) for ls in layerOrSources]):
            raise ValueError("`layerOrSource` must be a LayerProfile or ColConfig object.")
        
        # Ensure all previous layers and sources are under the same training model.
        else:
            allPreviousTrains = [(ls.train if issubclass(ls.__class__,LayerProfile) else None if ls._trainSource is None else ls._trainSource.train) for ls in layerOrSources]
            if (allPreviousTrains[0] is None or any([t != allPreviousTrains[0] for t in allPreviousTrains])):
                raise ValueError("All of the previous layer or sources must be within the same training model.")

        # Attach this layer.
        allPreviousTrains[0].attachLayer(self, *layerOrSources, buildNo = buildNo)
        
        return self

    def updateOnDemand(self, **kwargs):
        '''
			Update the model during training.   --- RESERVED for future use. --- UPDATED (Dexter) 20180630
        '''
        pass

    def printWhenTraining(self, *tensors):
        '''
			Add tensors that will be printed on console during training.   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            *tensors    `tf.Tensor`     - One or multiple tensors.
        '''
        self.train._printTensors[len(self.train._printTensors):] = tensors

class Collector(LayerProfile):
    '''
			Class representing a collector layer, without any dimensional transformation from all the input layers.   --- UPDATED (Dexter) 20181105
    '''
    def __init__(self, name: str = None, 
                activation: str = "linear", activationParams: Dict = {}, 
                incomingConfig: 'IncomingConfig' = IncomingConfig.Concat(), 
                batchNorm: bool = True, batchNormParams: Dict = {}, dropout: float = 1,
                outputConfig: 'OutputConfig' = OutputConfig.Default()):
        '''
			Create a collector layer, without any dimensional transformation from all the input layers.   --- UPDATED (Dexter) 20181105

            Parameters
            ------------------------------

            name            `str`   - The name of this layer.

            activation      `str`   - The activation function of this layer.
            
            activationParams    `dict{str:*}`   - Activation parameters as defined in TensorFlow.
            
            incomingConfig  `IncomingConfig`    - Input configurations.

            batchNorm       `bool`  - Whether to use batch normalization before activation function.
            
            batchNormParams     `dict{str:*}`   - Batch normalization parameters as defined in TensorFlow.
            
            dropout         `float` - The keep probability of dropout during training.

            outputConfig    `OutputConfig`      - Output configurations.
        '''
        super().__init__(name = name, layerUnits = -1, 
                        activation = activation, activationParams = activationParams, incomingConfig = incomingConfig,
                        batchNorm = batchNorm, batchNormParams = batchNormParams, dropout = dropout, outputConfig = outputConfig)
    
    def __copySymmetricLayerConfig__(self, useSymmetricWeights: bool = True, buildNo: int = 0) -> 'Collector':
        '''
			Create a symmetric layer profile, but this class is not supported.   --- UPDATED (Dexter) 20181105

            Parameters
            ------------------------------

            useSymmetricWeights `bool`              - Whether to use symmetric weights.

            buildNo             `int`   - The build number to be built.
        
            Returns
            ------------------------------

            `BasicLayer`    - A copied profile of this layer.
        '''
        if (len(self.fromNode[buildNo]) != 1):
            raise ValueError("Layers not having one and only one layer node inputs are not able to be copied in a symmetric way.")

        l = self.copy(self.name + "_Sym")
        if (useSymmetricWeights):
            l.refLayerName = self.name
        return l

    def copy(self, name: str) -> 'Collector':
        '''
			Copy this layer profile.   --- UPDATED (Dexter) 20181105

            Parameters
            ------------------------------

            name    `str`   - The new name of the copied layer
        '''
        # Ensure this is not a subclass.
        if (self.__class__.__name__ != "Collector"):
            raise ValueError("This layer class (" + self.__class__.__name__ + ") has not supported for copying.")
        
        # Create a new Layer Profile on this.
        return Collector(name = name, activation = self.activation, activationParams = self.activationParams, incomingConfig = self.incomingConfig,
                        batchNorm = self.batchNorm, batchNormParams = self.batchNormParams, dropout = self.dropout, outputConfig = self.outputConfig)
    
    def __build__(self, buildNo: int):
        '''
			Build the TensorFlow Graph of this layer.   --- UPDATED (Dexter) 20181221

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self.__clearTempTensors__()

        # 0. Ensure all incoming nodes have been built.
        if (all([n._built for n in self.fromNode[buildNo]])):
            # 1. Collect the incoming inputs.
            mid = self.__combineIncomingTensors__(buildNo = buildNo)

            # TensorFlow Graph building, using the layer name as the scope.
            with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                # 2. General layer operations.
                mid = self.__commonLayerOps__(mid)

                # 5. Final output
                self._outputTensor = self.__processOutputTensor__(mid)

            self._built = True

            # Create chain build actions
            for n in self.toNode[buildNo]:
                n.__build__(buildNo)

class BasicLayer(LayerProfile):
    '''
			Class representing a basic layer, aka fully connected layer, dense layer, etc.   --- UPDATED (Dexter) 20181105
    '''
    def __init__(self, name: str = None, layerUnits: int = 150, flattenToAxis: int = 1, refLayerName: str = None, refLayerTranspose: bool = False,
                    incomingConfig: 'IncomingConfig' = IncomingConfig.Concat(), 
                    linearTransform: 'LinearTransformConfig' = LinearTransformConfig.createBasicConfig(weightAvg = 0, weightStdDev = 0.004, weightL1Loss = False, weightL2Loss = True, weightL2Decay = 0.004, biasInitial = 0.001),
                    activation: str = "relu", activationParams: Dict = {}, 
                    batchNorm: bool = True,  batchNormParams: Dict = {}, dropout: float = 1, 
                    outputConfig: 'OutputConfig' = OutputConfig.Default(),
                    buildNo = 0, weightDecayRate = 0.004, biasInitial = 0.001, weightAvg=0, weightStdDev=0.04, weightL1Loss=False, weightL2Loss=True):
        '''
			Create a basic layer, aka fully connected layer, dense layer, etc.   --- UPDATED (Dexter) 20181105

            Parameters
            ------------------------------

            name            `str`   - The name of this layer.
            
            layerUnits      `int`   - The number of hidden units in this layer.
            
            flattenToAxis  `int`   - The flattening axis after consolidating all preceding layers.
            
            refLayerName    `str`   - Any referenced weight that this layer mirrors for.

            refLayerTranspose   `bool`  - Whether transpose is required for the referenced weight.
            
            incomingConfig  `IncomingConfig`    - Input configurations.

            linearTransform `LinearTransformConfig` - The linear transformation configuration.

            activation      `str`   - The activation function of this layer.
            
            activationParams    `dict{str:*}`   - Activation parameters as defined in TensorFlow.
            
            batchNorm       `bool`  - Whether to use batch normalization before activation function.
            
            batchNormParams     `dict{str:*}`   - Batch normalization parameters as defined in TensorFlow.
            
            dropout         `float` - The keep probability of dropout during training.
            
            outputConfig    `OutputConfig`      - Output configurations.

            buildNo         `int`   - The build number of staged training   [Deprecated]
            
            weightDecayRate `float` - The constant for weighting L2-loss of weights   [Deprecated]
            
            biasInitial     `float` - Constant initial value of biases   [Deprecated]
            
            weightAvg       `float` - The average value of the initialization of weights   [Deprecated]
            
            weightStdDev    `float` - The standard deviation of the initialization of weights   [Deprecated]
            
            weightL1Loss    `bool`  - Whether to take L1-loss on the weights   [Deprecated]
            
            weightL2Loss    `bool`  - Whether to take L2-loss on the weights   [Deprecated]
        '''
        if (linearTransform is None and any([param is not None for param in [weightAvg, weightStdDev, weightL1Loss, weightL2Loss, weightDecayRate, biasInitial]])):
            linearTransform = LinearTransformConfig.createBasicConfig(weightAvg = weightAvg, weightStdDev = weightStdDev, 
                              weightL1Loss = weightL1Loss, weightL2Loss = weightL2Loss, weightL2Decay = weightDecayRate, biasInitial = biasInitial)
        super().__init__(name = name, layerUnits = layerUnits, 
                    incomingConfig = incomingConfig, linearTransform = linearTransform, 
                    activation = activation, activationParams = activationParams, 
                    batchNorm = batchNorm, batchNormParams = batchNormParams, 
                    dropout = dropout, outputConfig = outputConfig)
        self.flattenToAxis = flattenToAxis
        self.refLayerName = refLayerName
        self.refLayerTranspose = refLayerTranspose

    def __copySymmetricLayerConfig__(self, useSymmetricWeights: bool = True, buildNo: int = 0):
        '''
			Create a symmetric layer profile.   --- BETA --- UPDATED (Dexter) 20181105

            Parameters
            ------------------------------

            useSymmetricWeights `bool`              - Whether to use symmetric weights.

            buildNo             `int`   - The build number to be built.
        
            Returns
            ------------------------------

            `BasicLayer`    - A copied profile of this layer.
        '''
        if (len(self.fromNode[buildNo]) != 1):
            raise ValueError("Layers not having one and only one layer node inputs are not able to be copied in a symmetric way.")

        l = self.copy(self.name + "_Sym")
        if (useSymmetricWeights):
            l.refLayerName = self.name
            l.refLayerTranspose = True
        return l

    def copy(self, name: str):
        '''
			Copy this layer profile.   --- UPDATED (Dexter) 20180701

            Parameters
            ------------------------------

            name    `str`   - The new name of the copied layer
        '''
        # Ensure this is not a subclass.
        if (self.__class__.__name__ != "BasicLayer"):
            raise ValueError("This layer class (" + self.__class__.__name__ + ") has not supported for copying.")
        
        # Create a new Layer Profile on this.
        return BasicLayer(name=name, layerUnits = self.layerUnits, flattenToAxis = self.flattenToAxis, refLayerName = self.refLayerName, refLayerTranspose=self.refLayerTranspose,
                    incomingConfig = self.incomingConfig, linearTransform=self.linearTransform, 
                    activation = self.activation, activationParams = self.activationParams, 
                    batchNorm = self.batchNorm, batchNormParams = self.batchNormParams, 
                    dropout = self.dropout, outputConfig = self.outputConfig)

    def __build__(self, buildNo: int):
        '''
			Build the TensorFlow Graph of this layer.   --- UPDATED (Dexter) 20190210

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self.__clearTempTensors__()

        # 0. Ensure all incoming nodes have been built.
        if (all([n._built for n in self.fromNode[buildNo]])):
            # 1. Get refrenced layer weights if required.
            w = None
            if (self.refLayerName is not None):
                refLayer = self.train.layerProfiles[self.refLayerName]

                with tf.variable_scope(self.refLayerName, reuse=tf.AUTO_REUSE) as scope:
                    refW = VarConfig.getFromGraph("weight")
                
                if self.refLayerTranspose:
                    with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                        w = tf.transpose(refW, [1,0])
                else:
                    w = refW
            
            # 2. Collect the incoming inputs.
            mid = self.__combineIncomingTensors__(buildNo = buildNo)

            # TensorFlow Graph building, using the layer name as the scope.
            with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                # 3. Perform linear Transform.
                linearTransformResults = self.linearTransform.buildOn(mid, toUnit = self.layerUnits, axis = self.flattenToAxis, weightSharing = w, defaultDevice = self.train.device)
                mid = linearTransformResults.results
                self._weights.extend(linearTransformResults.weights)
            
                # 4. General layer operations.
                mid = self.__commonLayerOps__(mid)

                # 5. Final output
                self._outputTensor = self.__processOutputTensor__(mid)

            self._built = True

            # Create chain build actions
            for n in self.toNode[buildNo]:
                n.__build__(buildNo)

class CustomLayerProfile(LayerProfile):
    '''
			Class representing a customized layer profile.  --- BETA --- UPDATED (Dexter) 20181105
    '''
    def __init__(self, name: str = None, cuzBuild: Callable = None, layerUnits: int = 150, 
                incomingConfig: 'IncomingConfig' = IncomingConfig.Concat(), 
                activation: str = "relu", activationParams: Dict = {}, 
                batchNorm: bool = True,  batchNormParams: Dict = {}, dropout: float = 1, 
                outputConfig: 'OutputConfig' = OutputConfig.Default(), buildNo = 0, **cuzArgs):
        '''
			Create a new customized layer.   --- BETA --- UPDATED (Dexter) 20181105

            Parameters
            ------------------------------

            name            `str`   - The name of this layer.
            
            cuzBuild        `Callable`  - A callback function for processing tensors during model building.

            layerUnits      `int`   - The number of hidden units in this layer.

            incomingConfig  `IncomingConfig`    - Input configurations.

            activation      `str`   - The activation function of this layer.

            activationParams    `dict{str:*}`   - Activation parameters as defined in TensorFlow.

            batchNorm       `bool`  - Whether to use batch normalization before activation function.

            batchNormParams     `dict{str:*}`   - Batch normalization parameters as defined in TensorFlow.

            dropout         `float` - The keep probability of dropout during training.

            outputConfig    `OutputConfig`      - Output configurations.

            buildNo         `int`   - The build number of staged training.   [Deprecated]

            *cuzArgs        `dict{str:*}`       - Customized parameter key-value pairs.
        '''
        super().__init__(name=name, layerUnits = layerUnits, 
                    incomingConfig = incomingConfig,
                    activation = activation, activationParams = activationParams, 
                    batchNorm = batchNorm, batchNormParams = batchNormParams, dropout = dropout, 
                    outputConfig = outputConfig)
        self._customizeBuild = cuzBuild
        self.cuzArgs = cuzArgs

    def __build__(self, buildNo: int):
        '''
			Build the TensorFlow Graph of this layer.   --- BETA --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self.__clearTempTensors__()

        # 0. Ensure all incoming nodes have been built.
        if (all([n._built for n in self.fromNode[buildNo]])):
            # 1. Collect all incoming tensors, and confirm there is incoming tensor
            fromTensor = self.__combineIncomingTensors__(buildNo = buildNo)

            # 2. If there is a custom build function, apply it instead of the default linear model below.
            if (self._customizeBuild is not None):
                self._outputTensor = self.__processOutputTensor__(self._customizeBuild(self, fromTensor))
            else:
                raise ValueError("No build action is specified.")

            self._built = True
            # Create chain build actions
            for n in self.toNode[buildNo]:
                n.__build__(buildNo)
    
    def appendWeightTensors(self, *weightTensors):
        '''
			Append a weight tensor that is loggable during trainning.   --- BETA --- UPDATED 20180630

            Parameters
            ------------------------------

            *weightTensors  `tf.Tensor` - One or multiple weight tensors.
        '''
        self._weights[len(self._weights):] = weightTensors
    
    def setOutputTensor(self, outputTensor):
        '''
			Set the output tensor of this layer.   --- BETA --- UPDATED 20180630

            Parameters
            ------------------------------

            outputTensor  `tf.Tensor` - The output tensor.
        '''
        self._outputTensor = outputTensor
    
    def applyBatchNorm(self, tensor):
        '''
			Connect a given tensor to optional batch normalization.   --- BETA --- UPDATED 20190208

            Parameters
            ------------------------------

            tensor  `tf.Tensor` - The tensor just before batch normalization.
        '''
        if (self.batchNorm):
            return tf.layers.batch_normalization(tensor, training = self.train._bnTensor, **self.batchNormParams)
        else:
            return tensor

    def applyActivationFunction(self, tensor):
        '''
			Apply activation function on a given tensor.   --- BETA --- UPDATED 20180630

            Parameters
            ------------------------------

            tensor  `tf.Tensor` - The tensor just before activation function.
        '''
        return Train.activationFunctions(self.activation)(tensor, **self.activationParams)

    def applyDropout(self, tensor):
        '''
			Apply optional dropout on a given tensor.   --- BETA --- UPDATED 20180630

            Parameters
            ------------------------------

            tensor  `tf.Tensor` - The tensor just before dropout.
        '''
        if (self.dropout < 1):
            self._dropoutTensor = tf.placeholder(tf.float32)
            return tf.nn.dropout(tensor, self._dropoutTensor)
        else:
            return tensor
    
    def setInputCollections(self, tensor):
        '''
			Define the collected input tensors before further processes.   --- BETA --- UPDATED 20180630

            Parameters
            ------------------------------

            tensor  `tf.Tensor` - The tensor just before dropout.
        '''
        self._inputCollections = tensor
      
class CNNLayer(LayerProfile):
    '''
			Class representing a CNN layer.   --- UPDATED (Dexter) 20181105
    '''
    def __init__(self, name: str = None, layerUnits: int = 30, convFilterWidth: int = 3, convPadding: bool = True, convStride: Tuple[int, int] = [1,1], convDilation: int = 0, reshape: List[int] =None, refLayerName: str = None, refLayerTranspose: bool = False, 
                incomingConfig: 'IncomingConfig' = IncomingConfig.Concat(), 
                linearTransform: 'LinearTransformConfig' = LinearTransformConfig.createBasicConfig(weightAvg = 0, weightStdDev = 5e-2, weightL1Loss = False, weightL2Loss = True, weightL2Decay = 0, biasInitial = 0.001),
                activation: str = "relu", activationParams: Dict = {},
                batchNorm: bool = True, batchNormParams: Dict = {}, 
                outputConfig: 'OutputConfig' = OutputConfig.Default(),
                buildNo = 0, weightDecayRate=0,weightStdDev=5e-2, biasInitial=0.001, weightL2Loss=True, weightAvg=0,weightL1Loss=False):
        '''
			Creates a CNN layer.   --- UPDATED (Dexter) 20181127

            Parameters
            ------------------------------

            name            `str`   - The name of this layer.
            
            layerUnits      `int`   - The number of hidden units in this layer.
            
            convFilterWidth  `int`   - The CNN filter width.
            
            convPadding      `bool`  - Whether to use padding on this CNN layer, i.e. the output image size will be the same as the previous one.

            convStride       `tuple(int, int)`   - The stride of the CNN filter.   --- BETA
            
            convDilation     `int`   - The CNN dilation of the CNN filter.
            
            reshape         `tuple(int+)`   - The shape of reshaping previous layers. If not specified, it will automatically reshaped if the previous layer can't interpret as an image.
            
            refLayerName    `str`   - Any referenced kernal that this layer mirrors for.

            refLayerTranspose   `bool`  - Whether transpose is required for the referenced weight.
            
            incomingConfig  `IncomingConfig`    - Input configurations.

            linearTransform `LinearTransformConfig` - The linear transformation configuration.

            activation      `str`   - The activation function of this layer.
            
            activationParams    `dict{str:*}`   - Activation parameters as defined in TensorFlow.
            
            batchNorm       `bool`  - Whether to use batch normalization before activation function.
            
            batchNormParams     `dict{str:*}`   - Batch normalization parameters as defined in TensorFlow.
            
            outputConfig    `OutputConfig`      - Output configurations.

            buildNo         `int`   - The build number of staged training.   [Deprecated]
            
            weightDecayRate `float` - The constant for weighting L2-loss of weights   [Deprecated]
            
            weightStdDev    `float` - The standard deviation of the initialization of weights   [Deprecated]
            
            biasInitial     `float` - Constant initial value of biases   [Deprecated]
            
            weightL2Loss    `bool`  - Whether to take L2-loss on the weights   [Deprecated]
            
            weightAvg       `float` - The average value of the initialization of weights   [Deprecated]
            
            weightL1Loss    `bool`  - Whether to take L1-loss on the weights   [Deprecated]
        '''
        if (linearTransform is None and any([param is not None for param in [weightAvg, weightStdDev, weightL1Loss, weightL2Loss, weightDecayRate, biasInitial]])):
            linearTransform = LinearTransformConfig.createBasicConfig(weightAvg = weightAvg, weightStdDev = weightStdDev, 
                              weightL1Loss = weightL1Loss, weightL2Loss = weightL2Loss, weightL2Decay = weightDecayRate, biasInitial = biasInitial)
        super().__init__(name = name, layerUnits = layerUnits, incomingConfig = incomingConfig, linearTransform = linearTransform,
                        activation = activation, activationParams = activationParams, 
                        batchNorm = batchNorm, batchNormParams = batchNormParams, outputConfig = outputConfig)
        self.convFilterWidth = convFilterWidth
        self.convPadding = convPadding
        self.convStride = convStride
        self.convDilation = convDilation
        self.reshape = reshape
        self.refLayerName = refLayerName
        self.refLayerTranspose = refLayerTranspose

    def __copySymmetricLayerConfig__(self, useSymmetricWeights = True, buildNo: int = 0):
        '''
			Create a symmetric layer profile.   --- BETA --- UPDATED (Dexter) 20181127

            Parameters
            ------------------------------

            useSymmetricWeights `bool`              - Whether to use symmetric weights.

            buildNo             `int`   - The build number to be built.
        
            Returns
            ------------------------------

            `BasicLayer`    - A copied profile of this layer.
        '''
        if (len(self.fromNode[buildNo]) != 1):
            raise ValueError("Layers not having one and only one layer node inputs are not able to be copied in a symmetric way.")

        return DCNNLayer(name=(self.name + "_Sym"), layerUnits = self.layerUnits, convFilterWidth=self.convFilterWidth, convPadding=self.convPadding, convStride=self.convStride,
                convDilation=self.convDilation, refLayerName = self.name if useSymmetricWeights else None, refLayerTranspose = True, 
                incomingConfig=self.incomingConfig, linearTransform=self.linearTransform, 
                activation=self.activation, activationParams=self.activationParams, 
                batchNorm=self.batchNorm, batchNormParams=self.batchNormParams, 
                outputConfig=self.outputConfig)

    def copy(self, name: str):
        '''
			Copy this layer profile.   --- UPDATED (Dexter) 20181127

            Parameters
            ------------------------------

            name    `str`   - The new name of the copied layer
        '''
        # Ensure this is not a subclass.
        if (self.__class__.__name__ != "CNNLayer"):
            raise ValueError("This layer class (" + self.__class__.__name__ + ") has not supported for copying.")
        
        # Create a new Layer Profile on this.
        return CNNLayer(name=name, layerUnits = self.layerUnits, convFilterWidth=self.convFilterWidth, convPadding=self.convPadding, convStride=self.convStride,
                convDilation=self.convDilation, reshape=self.reshape, refLayerName=self.refLayerName, refLayerTranspose=self.refLayerTranspose, 
                incomingConfig=self.incomingConfig, linearTransform=self.linearTransform, 
                activation=self.activation, activationParams=self.activationParams, 
                batchNorm=self.batchNorm, batchNormParams=self.batchNormParams, 
                outputConfig = self.outputConfig)

    def __build__(self, buildNo: int):
        '''
			Build the TensorFlow Graph of this layer.   --- BETA --- UPDATED (Dexter) 20190210

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self.__clearTempTensors__()

        # 0. Ensure all incoming nodes have been built.
        if (all([n._built for n in self.fromNode[buildNo]])):
            # 1. Get refrenced layer kernel if required
            if (self.refLayerName is not None):
                refLayer = self.train.layerProfiles[self.refLayerName]
                with tf.variable_scope(self.refLayerName, reuse=tf.AUTO_REUSE) as scope:
                    kernal = VarConfig.getFromGraph("weight")

                if (self.refLayerTranspose):
                    with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                        kernal = tf.transpose(kernal, [0,1,3,2])

            # TensorFlow Graph building, using the layer name as the scope
            with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                # 2. Get previous tensors and make CNN on it
                fromTensor = self.__combineIncomingTensors__(buildNo = buildNo)
                fromShape = fromTensor.shape

                # 3. Support CNN for other shapes of data
                if (len(fromShape) != 4):
                    reshape = self.reshape
                    if (reshape is None):
                        # If more than 4 dimension, flatten to the 4th dim.
                        if (len(fromShape) > 4):
                            flattenSize = functools.reduce(lambda x,y: x*y, fromTensor[3:], 1)
                            fromTensor = tf.reshape(fromTensor, [*VarConfig.setAsReshape(fromTensor.shape[:3]), flattenSize])
                            fromShape = fromTensor.shape

                        # If only 3 dimension, supplement a dimension.
                        elif (len(fromShape) == 3):
                            fromTensor = tf.reshape(fromTensor, [*VarConfig.setAsReshape(fromTensor.shape), 1])
                            fromShape = fromTensor.shape

                        # If only 2 dimension, auto reshape to a 2D picture with 1 channel.
                        elif (len(fromShape) == 2):
                            lastShape = fromTensor.shape[-1].value
                            largestDim = 1
                            anotherDim = 1
                            for d in range(2, math.floor(lastShape**.5)+1):
                                if lastShape%d == 0:
                                    largestDim = d
                                    anotherDim = lastShape//d
                            if largestDim >1:
                                fromTensor = tf.reshape(fromTensor, [-1, largestDim, anotherDim, 1])
                                fromShape = fromTensor.shape
                            else:
                                raise ValueError("Unable to reshape before CNN can be applied.")

                        elif (len(fromShape == 1)):
                            raise ValueError("One dimension data is not supported.")
                    else:
                        # Check whether the reshape is matched with fromShape.
                        originalFromShapeTotal = functools.reduce(lambda a,b: a*b, [s.value for s in fromShape[1:]], 1)
                        newReshape = functools.reduce(lambda a,b: a*b, reshape, 1)
                        if (originalFromShapeTotal != newReshape):
                            raise ValueError("Unable to reshape to specified shape.")
                        
                        # Update the reshape.
                        fromTensor = tf.reshape(fromTensor, [-1, *reshape])
                        fromShape = fromTensor.shape
                
                # 4. Apply kernal on the incoming tensors.
                transformConfig = self.linearTransform
                if (self.refLayerName is None):
                    kernal = transformConfig.weightConfig.create("weight", [self.convFilterWidth,self.convFilterWidth,fromShape[-1].value,self.layerUnits], dtype = fromTensor.dtype, defaultDevice = self.train.device)
                biases = transformConfig.biasConfig.create("biases", [self.layerUnits], dtype=fromTensor.dtype, defaultDevice = self.train.device)
                self._weights.extend([kernal, biases])

                with tf.device(self.train.device):
                    if (self.train.device.startswith("/cpu") and self.convDilation != 0):
                        raise ValueError("DCNN Dilation is not supported for CPU processing. --- at Layer: " + self.name)
                    mid = tf.nn.conv2d(fromTensor, kernal, [1, *self.convStride, 1], padding=('SAME' if self.convPadding else 'VALID'), dilations = [1, 1+self.convDilation, 1+self.convDilation, 1])
                    mid = tf.nn.bias_add(mid, biases)

                # 5. General layer operations.
                mid = self.__commonLayerOps__(mid)

                # 6. Final output
                self._outputTensor = mid

            self._built = True

            # Create chain build actions
            for n in self.toNode[buildNo]:
                n.__build__(buildNo)

class DCNNLayer(LayerProfile):
    '''
			Class representing a DCNN Layer.   --- UPDATED (Dexter) 20180701
        '''
    class PaddingTypes(Enum):
        '''
			A class definining the enumerations of DCNN padding methods.   --- UPDATED (Dexter) 20181127
        '''
        Bicubic = 0
        Bilinear = 1
        NearestNeighbor = 2
        Zeros = 3

    def __init__(self, name: str = None, layerUnits: int = 30, convFilterWidth: int = 3, convPadding: bool = True, convStride: Tuple[int,int] = [1,1], convDilation: int = 0, dconvPadding: 'DCNNLayer.PaddingTypes' = PaddingTypes.Bicubic, refLayerName: str = None, refLayerTranspose: bool = False, 
                incomingConfig: 'IncomingConfig' = IncomingConfig.Concat(), 
                linearTransform: 'LinearTransformConfig' = LinearTransformConfig.createBasicConfig(weightAvg = 0, weightStdDev = 5e-2, weightL1Loss = False, weightL2Loss = True, weightL2Decay = 0, biasInitial = 0.001),
                activation: str = "relu", activationParams: Dict = {},
                batchNorm: bool = True, batchNormParams: Dict = {}, 
                outputConfig: 'OutputConfig' = OutputConfig.Default(),
                reshape = None, buildNo = 0, weightDecayRate=0,weightStdDev=5e-2, biasInitial=0.001, weightL2Loss=True, weightAvg=0,weightL1Loss=False):
        '''
			Creates a DCNN layer.   --- UPDATED (Dexter) 20181127

            Parameters
            ------------------------------

            name            `str`   - The name of this layer.
            
            layerUnits      `int`   - The number of hidden units in this layer.
            
            convFilterWidth  `int`   - The CNN filter width.
            
            convPadding      `bool`  - Whether to use padding on this CNN layer, i.e. the output image size will be the same as the previous one.

            convStride       `tuple(int, int)`   - The stride of the CNN filter.   --- BETA
            
            convDilation     `int`   - The CNN dilation of the CNN filter.

            dconvPadding     `DCNNLayer.PaddingTypes`   - A value defined in DCNNLayer.PaddingTypes .   --- BETA

            refLayerName    `str`   - Any referenced kernal that this layer mirrors for.

            refLayerTranspose   `bool`  - Whether transpose is required for the referenced weight.
            
            incomingConfig  `IncomingConfig`    - Input configurations.

            linearTransform `LinearTransformConfig` - The linear transformation configuration.

            activation      `str`   - The activation function of this layer.
            
            activationParams    `dict{str:*}`   - Activation parameters as defined in TensorFlow.
            
            batchNorm       `bool`  - Whether to use batch normalization before activation function.
            
            batchNormParams     `dict{str:*}`   - Batch normalization parameters as defined in TensorFlow.
            
            outputConfig    `OutputConfig`      - Output configurations.

            reshape         `list[int+]`    - The shape of reshaping previous layers. If not specified, it will automatically reshaped if the previous layer can't interpret as an image. [Deprecated]

            buildNo         `int`   - The build number of staged training.   [Deprecated]
            
            weightDecayRate `float` - The constant for weighting L2-loss of weights.   [Deprecated]
            
            weightStdDev    `float` - The standard deviation of the initialization of weights.   [Deprecated]
            
            biasInitial     `float` - Constant initial value of biases.   [Deprecated]
            
            weightL2Loss    `bool`  - Whether to take L2-loss on the weights.   [Deprecated]
            
            weightAvg       `float` - The average value of the initialization of weights.   [Deprecated]
            
            weightL1Loss    `bool`  - Whether to take L1-loss on the weights.   [Deprecated]
        '''
        if (linearTransform is None and any([param is not None for param in [weightAvg, weightStdDev, weightL1Loss, weightL2Loss, weightDecayRate, biasInitial]])):
            linearTransform = LinearTransformConfig.createBasicConfig(weightAvg = weightAvg, weightStdDev = weightStdDev, 
                              weightL1Loss = weightL1Loss, weightL2Loss = weightL2Loss, weightL2Decay = weightDecayRate, biasInitial = biasInitial)
        super().__init__(name = name, layerUnits = layerUnits, incomingConfig = incomingConfig,
                        activation = activation, activationParams = activationParams, linearTransform = linearTransform,
                        batchNorm = batchNorm, batchNormParams = batchNormParams, outputConfig = outputConfig)
        self.convFilterWidth = convFilterWidth
        self.convPadding = convPadding
        self.convStride = convStride
        self.convDilation = convDilation
        self.dconvPadding = dconvPadding
        self.refLayerName = refLayerName
        self.refLayerTranspose = refLayerTranspose

    def __copySymmetricLayerConfig__(self, useSymmetricWeights = True, buildNo: int = 0):
        '''
			Create a symmetric layer profile.   --- BETA --- UPDATED (Dexter) 20181127

            Parameters
            ------------------------------

            useSymmetricWeights `bool`              - Whether to use symmetric weights.

            buildNo             `int`   - The build number to be built.
        
            Returns
            ------------------------------

            `BasicLayer`    - A copied profile of this layer.
        '''
        if (len(self.fromNode[buildNo]) != 1):
            raise ValueError("Layers not having one and only one layer node inputs are not able to be copied in a symmetric way.")

        return CNNLayer(name=(self.name + "_Sym"), layerUnits = self.layerUnits, convFilterWidth=self.convFilterWidth, convPadding=self.convPadding, convStride=self.convStride,
                convDilation=self.convDilation, refLayerName = self.name if useSymmetricWeights else None, refLayerTranspose=True, 
                incomingConfig=self.incomingConfig, linearTransform=self.linearTransform, 
                activation=self.activation, activationParams=self.activationParams, 
                batchNorm=self.batchNorm, batchNormParams=self.batchNormParams, 
                outputConfig=self.outputConfig)

    def copy(self, name: str):
        '''
			Copy this layer profile.   --- UPDATED (Dexter) 20181127

            Parameters
            ------------------------------

            name    `str`   - The new name of the copied layer
        '''
        # Ensure this is not a subclass.
        if (self.__class__.__name__ != "DCNNLayer"):
            raise ValueError("This layer class (" + self.__class__.__name__ + ") has not supported for copying.")
        
        # Create a new Layer Profile on this.
        return DCNNLayer(name=name, layerUnits = self.layerUnits, convFilterWidth=self.convFilterWidth, convPadding=self.convPadding, convStride=self.convStride,
                convDilation=self.convDilation, dconvPadding=self.dconvPadding, refLayerName = self.refLayerName, refLayerTranspose=self.refLayerTranspose, 
                incomingConfig=self.incomingConfig, linearTransform=self.linearTransform, 
                activation=self.activation, activationParams=self.activationParams, 
                batchNorm=self.batchNorm, batchNormParams=self.batchNormParams, 
                outputConfig = self.outputConfig)

    def __build__(self, buildNo: int):
        '''
			Build the TensorFlow Graph of this layer.   --- UPDATED (Dexter) 20190210

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self.__clearTempTensors__()

        # 0. Ensure all incoming nodes have been built.
        if (all([n._built for n in self.fromNode[buildNo]])):
            # 1. Get refrenced layer kernel if required
            if (self.refLayerName is not None):
                refLayer = self.train.layerProfiles[self.refLayerName]
                with tf.variable_scope(self.refLayerName, reuse=tf.AUTO_REUSE) as scope:
                    kernal = VarConfig.getFromGraph("weight")
                
                if (self.refLayerTranspose):
                    with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                        kernal = tf.transpose(kernal, [0,1,3,2])

            # TensorFlow Graph building, using the layer name as the scope
            with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                # 2. Get previous tensors
                fromTensor = self.__combineIncomingTensors__(buildNo = buildNo)
                fromShape = fromTensor.shape

                # 3. Support CNN for other shapes of data
                if (len(fromShape) != 4):
                    # If more than 4 dimension, flatten to the 4th dim.
                    if (len(fromShape) > 4):
                        flattenSize = functools.reduce(lambda x,y: x*y, fromTensor[3:], 1)
                        fromTensor = tf.reshape(fromTensor, [*VarConfig.setAsReshape(fromTensor.shape[:3]), flattenSize])
                        fromShape = fromTensor.shape

                    # If only 3 dimension, supplement a dimension.
                    elif (len(fromShape) == 3):
                        fromTensor = tf.reshape(fromTensor, [*VarConfig.setAsReshape(fromTensor.shape), 1])
                        fromShape = fromTensor.shape
                    
                    # 2 or lower dimension is not supported.
                    else:
                        raise ValueError("2 or lower dimension is not supported for DCNN Layer.")

                # 4. If no linked kernal, build a new kernal
                transformConfig = self.linearTransform
                if (self.refLayerName is None):
                    kernal = transformConfig.weightConfig.create("weight", [self.convFilterWidth,self.convFilterWidth,fromShape[-1].value,self.layerUnits], dtype=fromTensor.dtype, defaultDevice = self.train.device)

                # 5. Set biases
                biases = transformConfig.biasConfig.create("biases", [kernal.shape[-1].value], dtype=fromTensor.dtype, defaultDevice = self.train.device)
                self._weights.extend([kernal, biases])

                # 6. Apply paddings
                paddingPxH = 0
                paddingPxW = 0
                if (self.convPadding == False):
                    paddingPxH = self.convFilterWidth+self.convDilation*(self.convFilterWidth-1)-1+fromShape[1].value*(self.convStride[0] - 1)
                    paddingPxW = self.convFilterWidth+self.convDilation*(self.convFilterWidth-1)-1+fromShape[2].value*(self.convStride[1] - 1)

                if paddingPxH > 0 or paddingPxW > 0:
                    if (self.dconvPadding == DCNNLayer.PaddingTypes.Zeros):
                        fromTensor = tf.image.pad_to_bounding_box(fromTensor, int(paddingPxH/2), int(paddingPxW/2), fromShape[1].value+paddingPxH, fromShape[2].value+paddingPxW)
                    else:
                        resizeMethod = DCNNLayer.getTFResizeMethod(self.dconvPadding)
                        tfResizeMethod = tf.image.ResizeMethod.BICUBIC if resizeMethod == "BICUBIC" else tf.image.ResizeMethod.BILINEAR if resizeMethod == "BILINEAR" else tf.image.ResizeMethod.NEAREST_NEIGHBOR
                        fromTensor = tf.image.resize_images(fromTensor, (fromShape[1].value+paddingPxH, fromShape[2].value+paddingPxW), tfResizeMethod)

                with tf.device(self.train.device): 
                    # 7. Apply DCNN
                    if (self.train.device.startswith("/cpu") and self.convDilation != 0):
                        raise ValueError("DCNN Dilation is not supported for CPU processing. --- at Layer: " + self.name)
                    mid = tf.nn.conv2d(fromTensor, kernal, [1,*self.convStride,1], padding='SAME', dilations = [1, 1+self.convDilation, 1+self.convDilation, 1])
                    mid = tf.nn.bias_add(mid, biases)

                # 8. General layer operations.
                mid = self.__commonLayerOps__(mid)

                # 9. Final output
                self._outputTensor = self.__processOutputTensor__(mid)

            self._built = True
            # Create chain build actions
            for n in self.toNode[buildNo]:
                n.__build__(buildNo)
    
    @staticmethod
    def getTFResizeMethod(paddingTypes: 'DCNNLayer.PaddingTypes') -> str:
        '''
			Get the TensorFlow resize method name.   --- UPDATED (Dexter) 20181127

            Parameters
            ------------------------------

            paddingTypes  `DCNNLayer.PaddingTypes`   - A value defined in DCNNLayer.PaddingTypes .

            Returns
            ------------------------------

            `str` - The TensorFlow resize method name.
        '''
        methodDict = {0: "BICUBIC", 1: "BINEAR", 2: "NEAREST_NEIGHBOR", 3: "AREA"}
        if paddingTypes.value not in methodDict:
            raise ValueError("Resize method not supported.")
        return methodDict[paddingTypes.value]

class FinalLayer(LayerProfile):
    '''
			Class representing a final layer (training task).   --- UPDATED (Dexter) 20180630
    '''
    def __init__(self, name: str = "", compareSourceID: int = 0, compareTensorIdx: str = "target", measurement: str = "accuracy", measurementOptions: Dict[str, Any] = {}, cuzBuild: Callable = None,
            incomingConfig: 'IncomingConfig' = IncomingConfig.Concat(), 
            linearTransform: 'LinearTransformConfig' = LinearTransformConfig.createBasicConfig(weightAvg = 0, weightStdDev = 0.04, weightL1Loss = False, weightL2Loss = True, weightL2Decay = 0.004, biasInitial = 0.001),
            activation: str = "relu", activationParams: Dict[str, Any] = {}, 
            batchNorm: bool = True, batchNormParams: Dict[str, Any] = {}, dropout: float = 1, 
            totalTasks = 1, taskDimension = 1, buildNo = 0, weightDecayRate = 0.004, biasInitial = 0.001, weightAvg=0, weightStdDev=0.04, weightL1Loss=False, weightL2Loss=True):
        '''
			Creates a final layer.   --- UPDATED (Dexter) 20181110

            Parameters
            ------------------------------

            name                `str`   - The name of this layer.
            
            compareSourceID     `int`   - The source index of the source this task is comparing with.
            
            compareTensorIdx    `str`   - The key for the column config of the target this task is comparing with.
            
            measurement         `str`   - The measurement of the training task, like MSE or accuracy, in comparing the target data and model predictions.

            measurementOptions  `dict[str: *]`  - The measurement options of the measurement of this training task.
            
            cuzBuild            `Callable`  - A callback function for processing tensors during model building and returning a loss value.   [BETA]

            incomingConfig      `IncomingConfig`    - Input configurations.

            linearTransform     `LinearTransformConfig` - The linear transformation configuration.

            activation          `str`   - The activation function of this layer.
            
            activationParams    `dict{str:*}`   - Activation parameters as defined in TensorFlow.
            
            batchNorm       `bool`  - Whether to use batch normalization before activation function.
            
            batchNormParams     `dict{str:*}`   - Batch normalization parameters as defined in TensorFlow.
            
            dropout         `float` - The keep probability of dropout during training.
            
            totalTasks          `int`   - The number of tasks for multi-task learning.   [Deprecated]
            
            taskDimension       `tuple(int+)`   - The task output dimension.   [Deprecated]
            
            weightDecayRate     `float` - The constant for weighting L2-loss of weights.   [Deprecated]
            
            weightL1Loss        `bool`  - Whether to take L1-loss on the weights.   [Deprecated]
            
            weightL2Loss        `bool`  - Whether to take L2-loss on the weights.   [Deprecated]
            
            weightAvg           `float` - The average value of the initialization of weights.   [Deprecated]
            
            weightStdDev        `float` - The standard deviation of the initialization of weights.   [Deprecated]
            
            biasInitial         `float` - Constant initial value of biases.   [Deprecated]
            
            buildNo             `int`   - The build number of staged training   [Deprecated]
        '''
        super().__init__(name = name, layerUnits = -1, final=True, 
                        incomingConfig = incomingConfig, linearTransform = linearTransform,
                        activation = activation, activationParams = activationParams, 
                        batchNorm = batchNorm, batchNormParams = batchNormParams, dropout = dropout,
                        outputConfig = None)
        self.measurement = measurement
        self.measurementOptions = measurementOptions
        self.compareSourceID = compareSourceID
        self.compareTensorIdx = compareTensorIdx
        self._targetTensors = None
        self._trainTensors = []
        self._predictionTensors = None
        self._evalTotal = 0
        self._evalCumScore = 0
        self._evalCumList = []
        self._evalTotList = []
        self._customizeBuild = cuzBuild

    def __clearTempTensors__(self):
        '''
			Clear temp tensors that are on previous graphs, usually called for a new build.   --- UPDATED (Dexter) 20181114
        '''
        super().__clearTempTensors__()
        self._trainTensors = []
        self._predictionTensors = None
        self.__clearEvalInfo__()
    
    def __clearEvalInfo__(self):
        '''
			Clear evaluation information, usually called for a new build.   --- UPDATED (Dexter) 20181114
        '''
        self._evalTotal = 0
        self._evalCumScore = 0
        self._evalCumList = []
        self._evalTotList = []

    def __updateOrder__(self, buildNo: int = 0):
        '''
			Update the order of this layer, noted it should be the largest order.   --- UPDATED (Dexter) 20181115

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self._order[buildNo] = max([*[lp._order[buildNo] for lp in self.train.getEndingLayerProfiles(buildNo=buildNo) if lp != self], *[lp._order[buildNo] for lp in self.fromNode[buildNo]], 0]) + 1

    def getTraceHeader(self):
        '''
			Get the trace record header.   --- UPDATED (Dexter) 20180724

            Returns
            ------------------------------

            `list[str]`   - The list of header names of a target record.
        '''
        return [(self.name + ": " + cn) for cn in self.train.sources[self.compareSourceID].getHeader(self.compareTensorIdx)]

    def getTraceTarget(self):
        '''
			Get the target values of the trace items.   --- UPDATED (Dexter) 20180717
            
            Returns
            ------------------------------

            `list[list[*+]]`     - A list of trace values, each row prefixed with comparing tensor info and item index columns.
        '''
        if self.compareTensorIdx not in self.train.traceItems[self.compareSourceID]:
            raise ValueError("Trace Item Structure not matching with training source structure.")

        traceItems = self.train.traceItems[self.compareSourceID][self.compareTensorIdx]
        return [[self.compareSourceID, self.compareTensorIdx, tii, *ti] for tii, ti in enumerate(self.train.sources[self.compareSourceID].getPrintableItems(self.compareTensorIdx, traceItems, recovered = False))]

    def getTraceItems(self, allPredictedValues: Optional[Dict[str, 'np.ndarray']] = None, buildNo: int = 0) -> List[List[Any]]:
        '''
			Get the predicted values of the trace items.   --- UPDATED (Dexter) 20181115
            
            Parameters
            ------------------------------

            allPredictedValues      `dict{str: np.ndarray}`     - Predicted values in a layername-value dictionary.

            buildNo                 `int`                       - The build number to be built.

            Returns
            ------------------------------

            `list[list[*+]]`     - A list of trace values, each row prefixed with comparing tensor info and item index columns.
        '''
        if self.compareTensorIdx not in self.train.traceItems[self.compareSourceID]:
            raise ValueError("Trace Item Structure not matching with training source structure.")
        
        predictedValues = (self.train.predict(x=self.train.createSourceData(self.train.traceItems), buildNo = buildNo) if allPredictedValues is None else allPredictedValues)[self.name]
        return [[self.compareSourceID, self.compareTensorIdx, pii, *pi] for pii, pi in enumerate(self.train.sources[self.compareSourceID].getPrintableItems(self.compareTensorIdx, predictedValues))]

    def copy(self, name):
        '''
			Copy this layer profile.   --- UPDATED (Dexter) 20180623

            Parameters
            ------------------------------

            name    `str`   - The new name of the copied layer
        '''
        # Ensure this is not a subclass.
        raise ValueError("FinalLayer is not copyable.")
        
    def __build__(self, buildNo: int):
        '''
			Build the TensorFlow Graph of this layer.   --- BETA --- UPDATED (Dexter) 20181109

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self.__clearTempTensors__()

        # 0. Ensure all incoming nodes have been built.
        if (all([n._built for n in self.fromNode[buildNo]])):
            # 1. Collect all incoming tensors, and confirm there is incoming tensor
            fromTensor = self.__combineIncomingTensors__(buildNo = buildNo)
            targetTensors = self._targetTensors = self.train._sourceTensors[self.compareSourceID][self.compareTensorIdx]
            
            # TensorFlow Graph building, using the layer name as the scope
            with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                # 2. If there is a custom build function, apply it and it should return a loss.
                if (self._customizeBuild is not None):
                    tf.add_to_collection('losses', self._customizeBuild(self, fromTensor, targetTensors))
                else:
                    raise ValueError("FinalLayer is not buildable unless custom build function is given. Other FinalLayer classes like Classifier or Regressor can be used instead.")

            self._built = True
    
    def partialEvaluate(self, allTestData, allPredictedResults):
        '''
			Partial evaluate some predicted results, typically during batched tests. No action taken for this class.   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            allTestData         `np.ndarray|list`    - A list of test data (actual result).

            allPredictedResults `np.ndarray|list`    - A list of predicted data (model output result).
        '''
        pass
    
    def getTestScore(self):
        '''
			Get the test score of the test results. No action taken for this class.   --- UPDATED (Dexter) 20180630
        '''
        pass

    def recoverPredictedResults(self, predictedData):
        '''
			Recover the predicted results to raw-data format of the predicted data, like getting the label, undo normalization, etc.   --- UPDATED (Dexter) 20180717

            Parameters
            ------------------------------

            predictedData       `np.ndarray|list`    - A list of predicted data (model output result).

            Returns
            ------------------------------

            `np.ndarray|list`    - A list of recovered predicted data.
        '''
        return self.train.sources[self.compareSourceID].recoverToRawData(self.compareTensorIdx, predictedData)

class Classifier(FinalLayer):
    '''
			Class representing a classifier.   --- UPDATED (Dexter) 20180630
    '''
    def __init__(self, name: str = "classifier", classCount: int = 1, compareSourceID: int = 0, compareTensorIdx: str = "target", measurement: str = "accuracy", measurementOptions: Dict[str, Any] = {}, 
                incomingConfig: 'IncomingConfig' = IncomingConfig.Concat(), 
                linearTransform: 'LinearTransformConfig' = LinearTransformConfig.createBasicConfig(weightAvg = 0, weightStdDev = "auto", weightL1Loss = False, weightL2Loss = True, weightL2Decay = 0.0, biasInitial = 0.0),
                activation: str = "relu", activationParams: Dict[str, Any] = {},
                buildNo = 0, weightDecayRate = 0, weightL1Loss = False, weightL2Loss = True, weightAvg = 0, weightStdDev = "auto", biasInitial = 0.0):
        '''
			Create a classifier, comparing the class as the last dimension of the actual and predicted data.   --- UPDATED (Dexter) 20181109

            Parameters
            ------------------------------

            name                `str`   - The name of the layer.

            classCount          `int`   - The number of class. -1: Arbitrary class depending on training data source (BETA).

            compareSourceID     `int`   - The source index of the source this task is comparing with.
            
            compareTensorIdx    `str`   - The key for the column config of the target this task is comparing with.
            
            measurement         `str`   - The measurement of the training task, like MSE or accuracy, in comparing the target data and model predictions.

            measurementOptions  `dict{str:*}`           - The measurement options of the measurement of this training task.
            
            incomingConfig      `IncomingConfig`        - Input configurations.

            linearTransform     `LinearTransformConfig` - The linear transformation configuration.

            activation          `str`   - The activation function of this layer.
            
            activationParams    `dict{str:*}`   - Activation parameters as defined in TensorFlow.
            
            weightDecayRate     `float` - The constant for weighting L2-loss of weights.   [Deprecated]
            
            weightL1Loss        `bool`  - Whether to take L1-loss on the weights.   [Deprecated]
            
            weightL2Loss        `bool`  - Whether to take L2-loss on the weights.   [Deprecated]
            
            weightAvg           `float` - The average value of the initialization of weights.   [Deprecated]
            
            weightStdDev        `float` - The standard deviation of the initialization of weights.   [Deprecated]
            
            biasInitial         `float` - Constant initial value of biases.   [Deprecated]
            
            buildNo             `int`   - The build number of staged training   [Deprecated]
        '''
        super().__init__(name = name, compareSourceID=compareSourceID, compareTensorIdx=compareTensorIdx, measurement=measurement, measurementOptions=measurementOptions, 
                        incomingConfig = incomingConfig, linearTransform = linearTransform,
                        activation = activation, activationParams=activationParams, 
                        batchNorm=False)
        self.classCount = classCount

    def copy(self, name):
        '''
			Copy this layer profile.   --- UPDATED (Dexter) 20180630

            Parameters
            ------------------------------

            name    `str`   - The new name of the copied layer
        '''
        # Ensure this is not a subclass.
        if (self.__class__.__name__ != "Classifier"):
            raise ValueError("This layer class (" + self.__class__.__name__ + ") has not supported for copying.")
        
        # Create a new Layer Profile on this.
        return Classifier(name=name, classCount = self.classCount, compareSourceID = self.compareSourceID, compareTensorIdx = self.compareTensorIdx, measurement = self.measurement, 
                incomingConfig = self.incomingConfig, linearTransform = self.linearTransform,
                activation = self.activation, activationParams=self.activationParams)

    def __build__(self, buildNo: int):
        '''
			Build the TensorFlow Graph of this layer.   --- UPDATED (Dexter) 20190210

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self.__clearTempTensors__()

        # 0. Ensure all incoming nodes have been built.
        if (all([n._built for n in self.fromNode[buildNo]])):
            # 1. Collect all incoming tensors, and confirm there is incoming tensor
            mid = self.__combineIncomingTensors__(buildNo = buildNo)
            targetTensor = self._targetTensors = tf.cast(self.train._sourceTensors[self.compareSourceID][self.compareTensorIdx], tf.int32)

            # 2. TensorFlow Graph building, using the layer name as the scope
            with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                # 3. Consolidate merged input shape and target tensor shape
                fromShape = tuple(s.value for s in mid.shape)
                toShape = tuple(s.value for s in targetTensor.shape)

                # 4. Determine the from and to shape mapping, the first dimension should be the same based on the batched sampling
                # 4a. If the target tensor has the last dimension of 1 but originally flattened, reshape it.
                originalByRow = False
                if (toShape[-1] == 1):
                    targetTensor = tf.reshape(targetTensor, [*toShape[:-2], -1])
                    toShape = tuple(s.value for s in targetTensor.shape)
                    originalByRow = True

                # 4b. Handling arbitrary class counts.
                if (self.classCount == -1):
                    if (not self.train.sources[self.compareSourceID]._fullyExtracted):
                        raise ValueError("Sources not of fully extracted are not allowed to have arbitrary class setup.")

                    self.classCount = self.train.sources[self.compareSourceID].getClassCount(self.compareTensorIdx)

                # 4c. Check if the previous shape dimension is more or equal to the comparing shape.
                targetDim = len(toShape)
                if (fromShape[:targetDim] != toShape[:targetDim]):
                    raise ValueError("The shape of the output of previous layers cannot match with the target tensor.")

                # 5. Linear transform to flatten the previous layer up to the feature-realted dimensions and fully connected to the target shape.
                linearTransformResults = self.linearTransform.buildOn(mid, axis = targetDim, toUnit = self.classCount, defaultDevice = self.train.device)
                mid = linearTransformResults.results
                self._weights.extend(linearTransformResults.weights)

                # 6. Get the argument max prediction.
                argmaxPrediction = tf.argmax(tf.nn.softmax(mid), axis=targetDim)
                self._predictionTensors = tf.reshape(argmaxPrediction, [*VarConfig.setAsReshape(argmaxPrediction.shape), 1]) if originalByRow else argmaxPrediction

                # 7. Get loss function.
                targetTensor = tf.cast(targetTensor, tf.int64)
                crossEntropy = tf.nn.sparse_softmax_cross_entropy_with_logits(labels=targetTensor, logits=mid, name='crossEntropyPerExample')
                crossEntropyMean = tf.reduce_mean(crossEntropy, name='crossEntropy')
                tf.add_to_collection('losses', crossEntropyMean)
            
            self._built = True
        
    def partialEvaluate(self, allTestData: Union['np.ndarray', List[Any]], allPredictedResults: Union['np.ndarray', List[Any]]):
        '''
			Partial evaluate some predicted results, typically during batched tests. No action taken for this class.   --- UPDATED (Dexter) 20190209

            Parameters
            ------------------------------

            allTestData         `np.ndarray|list`    - A list of test data (actual result).

            allPredictedResults `np.ndarray|list`    - A list of predicted data (model output result).
        '''
        # Collect the test data and recover to the original range.
        testData = np.asarray(allTestData[self.compareSourceID][self.compareTensorIdx])
        testData = self.recoverPredictedResults(testData)

        # Evaluate the result by accumulating the evaluation.
        if (self.measurement == "accuracy"):
            compareResults = testData == allPredictedResults
            compareCount = testData.size
            self._evalCumScore += (compareResults == True).sum()
            self._evalTotal += compareCount
        elif (self.measurement == "nmi"):
            self._evalCumList[len(self._evalCumList):] = [*np.reshape(allPredictedResults, [-1])]
            self._evalTotList[len(self._evalCumList):] = [*np.reshape(testData, [-1])]
    
    def getTestScore(self):
        '''
			Get the test score of the test results. No action taken for this class.   --- UPDATED (Dexter) 20180630

            Returns
            ------------------------------

            `float`     - The test score.
        '''
        if (self.measurement == "accuracy"):
            return self._evalCumScore / self._evalTotal
        elif (self.measurement == "nmi"):
            return normalized_mutual_info_score(self._evalTotList, self._evalCumList)
    
class Regressor(FinalLayer):
    '''
			Class representing a regressor.   --- UPDATED (Dexter) 20180630
    '''
    def __init__(self, name: str = "regressor", compareSourceID: int = 0, compareTensorIdx: str = "target", loss: str = "MSE", measurement: str = "MSE", measurementOptions: Dict[str, Any] = {}, 
                incomingConfig: 'IncomingConfig' = IncomingConfig.Concat(), 
                linearTransform: 'LinearTransformConfig' = LinearTransformConfig.createBasicConfig(weightAvg = 0, weightStdDev = 0.5, weightL1Loss = False, weightL2Loss = True, weightL2Decay = 0.0, biasInitial = 0.0),
                activation: str = "relu", activationParams: Dict[str, Any] = {},
                multiTask = (1,), buildNo = 0, weightDecayRate = 0, weightL1Loss = False, weightL2Loss = True, weightAvg = 0, weightStdDev = 0.5, biasInitial = 0.0):
        '''
			Create a regressor.   --- UPDATED (Dexter) 20181110

            Parameters
            ------------------------------

            name                `str`   - The name of this layer.
            
            compareSourceID     `int`   - The source index of the source this task is comparing with.
            
            compareTensorIdx    `str`   - The key for the column config of the target this task is comparing with.
            
            loss                `str`   - The loss function of the training task. If not specified, it will equal to the measurement function.
            
            measurement         `str`   - The measurement of the training task, like MSE or accuracy, in comparing the target data and model predictions.

            measurementOptions  `dict{str:*}`           - The measurement options of the measurement of this training task.
            
            incomingConfig      `IncomingConfig`        - Input configurations.

            linearTransform     `LinearTransformConfig` - The linear transformation configuration.

            activation          `str`   - The activation function of this layer.
            
            activationParams    `dict{str:*}`   - Activation parameters as defined in TensorFlow.

            multiTask           `str`   - The shape of the multitask of the target data.   [Deprecated]
            
            weightDecayRate     `float` - The constant for weighting L2-loss of weights.   [Deprecated]
            
            weightL1Loss        `bool`  - Whether to take L1-loss on the weights.   [Deprecated]
            
            weightL2Loss        `bool`  - Whether to take L2-loss on the weights.   [Deprecated]
            
            weightAvg           `float` - The average value of the initialization of weights.   [Deprecated]
            
            weightStdDev        `float` - The standard deviation of the initialization of weights.   [Deprecated]
            
            biasInitial         `float` - Constant initial value of biases.   [Deprecated]
            
            buildNo             `int`   - The build number of staged training.   [Deprecated]
        '''
        self.loss = measurement if (loss == None) else loss
        super().__init__(name = name, compareSourceID=compareSourceID, compareTensorIdx=compareTensorIdx,measurement=measurement, measurementOptions=measurementOptions, 
                incomingConfig = incomingConfig, linearTransform = linearTransform,
                activation = activation, activationParams=activationParams, 
                batchNorm=False)
        

    def __build__(self, buildNo: int):
        '''
			Build the TensorFlow Graph of this layer.   --- BETA --- UPDATED (Dexter) 20190210

            Parameters
            ------------------------------

            buildNo     `int`   - The build number to be built.
        '''
        self.__clearTempTensors__()

        # 0. Ensure all incoming nodes have been built.
        if (all([n._built for n in self.fromNode[buildNo]])):
            # 1. Collect all incoming tensors, and confirm there is incoming tensor
            mid = self.__combineIncomingTensors__(buildNo = buildNo)
            targetTensor = self._targetTensors = self.train._sourceTensors[self.compareSourceID][self.compareTensorIdx]

            # 2. TensorFlow Graph building, using the layer name as the scope
            
            # 3. Consolidate merged input shape and target tensor shape
            fromShape = tuple(s.value for s in mid.shape)
            toShape = tuple(s.value for s in targetTensor.shape)
            
            # 4A.   If the shape is already matched, no conversion is needed.
            if (fromShape == toShape):
                self._predictionTensors = mid
            
            # 4B.   If the shape is different, futher modification is required.
            else:
                with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                    # 4B-1. Determine the from and to shape mapping, the first dimension should be the same based on the batch dimension.
                    #       If the target tensor has shape of [None] only, reshape as [None, 1] for weight multiplication.
                    if (len(toShape) == 1):
                        targetTensor = tf.reshape(targetTensor, [*VarConfig.setAsReshape(toShape), 1])
                        toShape = tuple(s.value for s in targetTensor.shape)

                    # 4B-2. Determine the shared shape dimensions so as to flatten the previous layer. 
                    #       Supplement a dimension if the dimension of the lower dimensioned array has shape same with those dimensions of another array.
                    toAxis = 0
                    for d in range(0, min(len(fromShape), len(toShape))):
                        if (fromShape[d] != toShape[d]):
                            break
                        toAxis += 1
                    if (toAxis == len(fromShape)):
                        mid = tf.reshape(mid, [*VarConfig.setAsReshape(fromShape), 1])

                    # 4B-3. Determine the hidden units and perform linear Transform.
                    toUnit = functools.reduce(lambda x,y: x*y, toShape[toAxis:], 1) if toAxis < len(toShape) else 1
                    linearTransformResults = self.linearTransform.buildOn(mid, axis = toAxis, toUnit = toUnit, defaultDevice = self.train.device)
                    mid = linearTransformResults.results
                    self._weights.extend(linearTransformResults.weights)
                
                    # 4B-4. If mutli-task dimension is over 1, reshape it:
                    if (len(toShape) != len(mid.shape)):
                        mid = tf.reshape(mid, [*VarConfig.setAsReshape(toShape)])

                    self._predictionTensors = mid

            with tf.variable_scope(self.name, reuse=tf.AUTO_REUSE) as scope:
                # 7. Get loss function
                targetTensor = tf.cast(targetTensor, mid.dtype)
                colConfig = self.train.sources[self.compareSourceID][self.compareTensorIdx]
                if (self.loss == "MSE"):
                    if len(colConfig.circularInfo) == 0:
                        mse = tf.reduce_mean(tf.squared_difference(targetTensor, mid))
                        tf.add_to_collection('losses', mse)
                    else:
                        for idx in range(0, colConfig.getShape()[1]):
                            if idx in colConfig.circularInfo:
                                minV, maxV, rangeV = colConfig.circularInfo[idx].values()
                                midTmp = tf.mod((mid[:,idx] - minV), rangeV)
                                y2 = tf.mod((targetTensor[:,idx] - minV), rangeV)
                                midTmp = tf.minimum(tf.mod((midTmp-y2)+rangeV, rangeV), tf.mod((y2-midTmp)+rangeV, rangeV))
                                mse = tf.reduce_mean(tf.square(midTmp))
                                tf.add_to_collection('losses', mse)
                            else:
                                mse = tf.reduce_mean(tf.squared_difference(targetTensor[:,idx], mid[:,idx]))
                                tf.add_to_collection('losses', mse)
                else:
                    raise ValueError("Requested loss type is not supported.")
            self._built = True

    def partialEvaluate(self, allTestData, predictedData):
        '''
			Partial evaluate some predicted results, typically during batched tests. No action taken for this class.   --- UPDATED (Dexter) 20190209

            Parameters
            ------------------------------

            allTestData         `np.ndarray|list`    - A list of test data (actual result).

            allPredictedResults `np.ndarray|list`    - A list of predicted data (model output result).
        '''
        # Collect the test data and recover to the original range.
        testData = np.asarray(allTestData[self.compareSourceID][self.compareTensorIdx])
        colConfig = self.train.sources[self.compareSourceID][self.compareTensorIdx]
        testData = self.recoverPredictedResults(testData)

        # Evaluate the result by accumulating the evaluation.
        compareCount = testData.size
        if (self.measurement == "MSE" or self.measurement == "PSNR"):
            if len(colConfig.circularInfo) == 0:
                self._evalCumScore += np.sum(np.square(np.subtract(testData, predictedData)))
                self._evalTotal += compareCount
            elif (self.measurement != "PSNR"):
                for idx in range(0, colConfig.getShape()[1]):
                    if idx in colConfig.circularInfo:
                        minV, maxV, rangeV = colConfig.circularInfo[idx].values()
                        self._evalCumScore += np.sum(np.square(np.minimum(np.mod((testData[:,idx]-predictedData[:,idx])+rangeV, rangeV), np.mod((predictedData[:,idx]-testData[:,idx])+rangeV, rangeV))))
                    else:
                        self._evalCumScore += np.sum(np.square(np.subtract(testData[:,idx], predictedData[:,idx])))
                self._evalTotal += compareCount
            else:
                raise ValueError("PSNR is not supported for circular data.")
        elif (self.measurement == "SMAPE"):
            if len(colConfig.circularInfo) == 0:
                self._evalCumScore += np.sum(np.abs(np.subtract(testData, predictedData))/((np.abs(testData) + np.abs(predictedData))/2))
                self._evalTotal += compareCount
            else:
                raise ValueError("SMAPE is not supported for circular data.")
    
    def getTestScore(self):
        '''
			Get the test score of the test results. No action taken for this class.   --- UPDATED (Dexter) 20181110

            Returns
            ------------------------------

            `float`     - The test score.
        '''
        if (self.measurement == "MSE" or self.measurement == "SMAPE"):
            return self._evalCumScore / self._evalTotal
        elif (self.measurement == "PSNR"):
            return 10 * math.log10((self.measurementOptions["max"]) ** 2 / (self._evalCumScore / self._evalTotal))

class TrainingProfile():
    '''
			Class representing a training profile configurations.   --- UPDATED (Dexter) 20180615
    '''
    def __init__(self, noOfEpoch = 200, initialLearningRate = 0.001, learningRateDecayFactor = None, numEpochsPerDecay = None, exponentialLossDecay = 0.9, exponentialVarDecay=0.9999, crossValidationCount=0, crossValidationType=None, crossValidationProportion=0.2, optimizer="adam", **optimizerParams):
        '''
			Create a training profile configuration.   --- UPDATED (Dexter) 20190209

            Parameters
            ------------------------------

            noOfEpoch                   `int`       - The number of epoches the training will go over for

            initialLearningRate         `float`     - The initial learning rate

            learningRateDecayFactor     `float`     - A decay factor for gradually reducing the learning rate

            numEpochsPerDecay           `int`       - The number of epoches to go over before each learning rate decay takes place

            exponentialLossDecay        `float`     - The exponential decay factor for reducing the moving average of the loss

            exponentialVarDecay         `float`     - The exponential decay factor for reducing the moving average of the training variables

            crossValidationCount        `int`       - The no. of rounds to go over for a cross validation epoch

            crossValidationType         `str`       - The type of cross validation

            crossValidationProportion   `float`     - The proportion of training data partition to take as a validation dataset

            optimizer                   `str`       - An optimizer for training the models

            optimizerParams             `kwargs`    - TensorFlow optimizer paramerters in an object
        '''
        # Assign the object attributes.
        self.noOfEpoch = noOfEpoch
        self.initialLearningRate = float(initialLearningRate)
        self.learningRateDecayFactor = learningRateDecayFactor
        self.numEpochsPerDecay = numEpochsPerDecay
        self.exponentialLossDecay = exponentialLossDecay
        self.exponentialVarDecay = exponentialVarDecay
        self.optimizer = optimizer
        self.optimizerParams = optimizerParams

        # Validate the cross validation type.
        if ((crossValidationType is None) or (crossValidationType in ["fold", "rand"])):
            self.crossValidationType = crossValidationType
        else: 
            raise ValueError("Validation Type (" + str(crossValidationType) +") is not supported.")
        if (crossValidationCount < 0 or crossValidationProportion < 0):
            raise ValueError("Validation Count and Proportion should be positive numbers.")
        if crossValidationProportion == 1 or crossValidationProportion == 0 or crossValidationCount == 0:
            self.crossValidationType = None
            self.crossValidationProp = 0
            self.crossValidationCount = 0
        else:
            if crossValidationProportion > 1:
                self.crossValidationProp = 1/crossValidationProportion
                self.crossValidationCount = int(crossValidationCount)
            else:
                self.crossValidationProp = crossValidationProportion
                self.crossValidationCount = int(crossValidationCount)

        # Count how many runs requires for a full cross validation, and initiate the matching runID.
        self.validationRuns = (int((1/self.crossValidationProp)*self.crossValidationCount) if self.crossValidationType == "fold" else self.crossValidationCount) if self.crossValidationType is not None else 1
        self._cvCount = 0