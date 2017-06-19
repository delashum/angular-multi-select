# angular-multi-select

An Angular directive for a multi-select field type.

### Demo

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
```

HTML
```
<multi-select ms-model="selectedElements" ms-change="OnChange" ms-options="options"></multi-select>
```

