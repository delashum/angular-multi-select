angular.module('multiSelect').directive("multiSelect", () => {
    return {
        restrict: "E",
        scope: {
            model: "=msModel",
            Change: "=msChange",
            options: "=msOptions",
            settings: "@settings"
        },
        templateUrl: "multi-select-tpl.html",
        link: ($scope, element, attr) => {
            if (!$scope.model || !Array.isArray($scope.model)) {
                $scope.model = [];
            }
            $scope.showOptions = false;

            $scope.Display = (val) => {
                return val;
            }

            $scope.Add = (val) => {
                if (!val) return;
                $scope.action = true;
                $scope.model.push(val);
                $scope.search = "";

                $scope.Change({
                    event: "add",
                    value: val
                })
            }

            $scope.Remove = (val, event) => {
                $scope.model.splice($scope.model.indexOf(val), 1)
                $scope.Change({
                    event: "remove",
                    value: val
                })
                if (event) event.stopPropagation();
            }

            $scope.Show = (val) => {
                return $scope.model.indexOf(val) < 0;
            }

            $scope.FocusSearch = () => {
                element[0].getElementsByClassName("ms-search")[0].focus();
                $scope.ShowOptions(true);
            }

            $scope.ShowOptions = (bool) => {
                bool == null ? !$scope.showOptions : bool;
                $scope.showOptions = bool;
                $scope.selected = 0;
            }

            $scope.HideOptions = () => {
                if ($scope.action) {
                    $scope.FocusSearch();
                    $scope.action = false;
                    return;
                }
                $scope.showOptions = false;
            }

            $scope.Select = (i) => {
                $scope.selected = i;
            }

            $scope.Key = (event) => {
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
        }
    }
})
