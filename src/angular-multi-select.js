var A = angular.module('multiSelect', [])

.directive("multiSelect", function () {
    return {
        restrict: "E",
        scope: {
            model: "=msModel",
            Change: "=msChange",
            options: "=msOptions",
            settings: "=msSettings",
            disabled: "=msDisabled"
        },
        templateUrl: 'multi-select-tpl.html',
        link: function ($scope, element, attr) {
            if (!$scope.model || !Array.isArray($scope.model)) {
                $scope.model = [];
            }
            $scope.showOptions = false;

            $scope.Display = function (val) {
                if ($scope.settings && $scope.settings.display && /^[a-zA-Z\.]+$/.test($scope.settings.display)) {
                    return eval("val." + $scope.settings.display);
                }
                return val;
            }

            $scope.Add = function (val) {
                if (!val) return;
                $scope.action = true;
                $scope.model.push(val);
                $scope.search = "";

                $scope.Change({
                    event: "add",
                    value: val
                })
            }

            $scope.Remove = function (val, event) {
                if (!val) return;
                $scope.model.splice($scope.model.iOf(val), 1)
                $scope.Change({
                    event: "remove",
                    value: val
                })
                if (event) event.stopPropagation();
            }

            $scope.Show = function (val) {
                return $scope.model.iOf(val) < 0;
            }

            $scope.FocusSearch = function () {
                if ($scope.disabled) return
                element[0].getElementsByClassName("ms-search")[0].focus();
                $scope.ShowOptions(true);
            }

            $scope.ShowOptions = function (bool) {
                bool == null ? !$scope.showOptions : bool;
                $scope.showOptions = bool;
                $scope.selected = 0;
            }

            $scope.HideOptions = function () {
                if ($scope.action) {
                    $scope.FocusSearch();
                    $scope.action = false;
                    return;
                }
                $scope.showOptions = false;
            }

            $scope.Select = function (i) {
                $scope.selected = i;
            }

            $scope.Key = function (event) {
                if (!event.key) return;
                switch (event.key) {
                    case "Enter":
                        if ($scope.shown.length < 0) break;
                        $scope.Add($scope.shown[$scope.selected]);
                        $scope.selected = 0;
                        $scope.action = false;
                        break;
                    case "ArrowDown":
                        $scope.selected++;
                        $scope.selected %= $scope.shown.length;
                        break;
                    case "ArrowUp":
                        $scope.selected--;
                        $scope.selected += $scope.shown.length;
                        $scope.selected %= $scope.shown.length;
                        break;
                    case "Backspace":
                        if (!$scope.search) {
                            $scope.Remove($scope.model[$scope.model.length - 1])
                        }
                        break;
                }
            }

            function Same(one, two) {
                if ($scope.settings && $scope.settings.compare && /^[a-zA-Z\.]+$/.test($scope.settings.compare)) {
                    return eval("one." + $scope.settings.compare + " === two." + $scope.settings.compare);
                }
                return one === two;
            }

            Array.prototype.iOf = function (obj) {
                for (var i = 0; i < this.length; i++) {
                    if (Same(obj, this[i])) return i;
                }
                return -1;
            }
        }
    }
})

var html = `<div>
    <style>
        .ms-main {
            min-height: 50px;
            position: relative
        }
        
        .ms-input {
            outline: none;
            border-radius: 4px;
            border: 1px solid #a7a7a7;
            padding: 2px 34px 4px 4px;
            cursor: text;
        }
        
        .ms-options {
            position: absolute;
            left: 0;
            margin-top: -3px;
            right: 0;
            background-color: white;
            border: 1px solid #b7b7b7;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            max-height: 200px;
            overflow-y: scroll;
        }
        
        .ms-option {
            padding: 5px 15px;
            cursor: pointer;
        }
        
        .ms-search {
            outline: none;
            border: none;
            font-size: 13px;
            padding: 7px;
            width: 30px;
        }
        
        .ms-caret {
            position: absolute;
            right: 18px;
            cursor: pointer;
            top: 10px;
            margin-top: 6px;
            margin-right: -8px;
            color: gray;
        }
        
        .ms-caret:hover {
            opacity: 0.8
        }
        
        .ms-item {
            margin: 3px;
            background-color: #dbe3f7;
            border: 1px solid #9ba8ce;
            border-radius: 3px;
            display: inline-block;
        }
        
        .ms-item-remove {
            cursor: pointer;
            color: #505050;
            border-left: 1px solid #9ba8ce;
            vertical-align: middle;
            display: inline-block;
            padding: 0px 5px 2px 5px;
        }
        
        .ms-item-remove:hover {
            background-color: #cdd7f4
        }
        
        .ms-item-label {
            padding: 0px 5px 0px 5px;
            vertical-align: middle;
            font-size: 15px;
        }
        
        .arrow-down {
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid;
        }
        
        .selected {
            background-color: aliceblue;
        }

        .ms-input[disabled],
        .ms-input[disabled] .ms-search {
            background-color: #eee;
            cursor: default !important;
        }


        .ms-input[disabled] .ms-caret,
        .ms-input[disabled] .ms-item-remove {
            display: none;
        }

    </style>
    <div class="ms-main">
        <div ng-disabled="disabled" ng-click="FocusSearch()" class="ms-input">
            <div class="ms-item" ng-repeat="item in model">
                <span class="ms-item-label">{{Display(item)}}</span>
                <span class="ms-item-remove" ng-click="Remove(item,$event)">&times;</span>
            </div>
            <input ng-disabled="disabled" ng-keyup="Key($event)" ng-blur="HideOptions()" class="ms-search" ng-model="search">
            <span ng-click="ShowOptions()" class="ms-caret arrow-down"></span>
        </div>
        <div ng-show="showOptions" class="ms-options">
            <div ng-mouseover="Select($index)" ng-mousedown="Add(option)" ng-class="{\'selected\':selected===$index}" class="ms-option" ng-repeat="option in (shown = (options | filter:Show | filter:search))">{{Display(option)}}</div>
            <div class="ms-option" ng-show="shown.length == 0">No Matches</div>
        </div>
    </div>
</div>`;

A.run(["$templateCache", function ($templateCache) {
    $templateCache.put("multi-select-tpl.html", html)
}])
