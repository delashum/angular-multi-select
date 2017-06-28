# angular-multi-select

An Angular directive for a multi-select field type.

### Demo

![](https://j.gifs.com/Mj34LR.gif)

https://embed.plnkr.co/0c4dvGOsSda1soHal8mH/

## Installation

```
bower install angular-multipleselect
npm install angular-miltipleselect
```

Include ``angular-multi-select.js`` or ``angular-multi-select.min.js``

## Usage

JS
```
angular.module("app",["multiSelect"])

.controller("main", function($scope) {
    $scope.settings = {
        display: "value",
        compare: "id"
    }
    
    $scope.disabled = false
    
    $scope.options = [{
        "value": "Banana",
        "id": 0
    }, {
        "value": "Orange",
        "id": 1
    }]
    
    $scope.OnChange = function(obj) {
        console.log(obj, $scope.selectedElements);
    }
}



```

HTML
```
<multi-select ms-settings="settings" ms-disabled="disabled" ms-model="selectedElements" ms-change="OnChange" ms-options="options"></multi-select>
```

