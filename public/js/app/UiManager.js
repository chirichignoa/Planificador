define(["jquery"], function ($) {

    var 
        generateHead = function (head) {
            var headRow = "<tr>";
            for (var i = 0; i < head.length; i++)
                headRow += "<th>" + head[i] + "</th>";

            return headRow + "</tr>";
        },
        generateRow = function (arr) {
            var row = "<tr>";
            for (var i = 0; i < arr.length; i++)
                row += "<td>" + arr[i] + "</td>";

            return row + "</tr>";
        },

        getBodyTable = function (id) {
            return $(id).children()[0];
        };


    function UiManager(ciclesTbId, plannedId, choosedId) {
        this.ciclesTableId = ciclesTbId;
        this.plannedTableId = plannedId;
        this.choosedTableId = choosedId;
    }

    var getRobAsArray = function (iterations) {
        var columns = [];
        for (var i = 0; i < iterations * 2; i++) {
            columns[i] = (i % 2 == 0) ? "I" : "S";
        }

        return columns;
    }

    UiManager.prototype.constructTables = function () {

        $(getBodyTable(this.ciclesTableId)).html(generateHead(["Ciclos"]));
        $(getBodyTable(this.plannedTableId)).html(generateHead(["Planificables"]));
        $(getBodyTable(this.choosedTableId)).html(generateHead(["Elegidas"]));
    }

    var getState = function (index, object) {
        var counter = 0;
        for (o in object) {
            if (counter == index)
                return object[o];
            counter++;
        }
        return null;
    }

    var getRobRow = function (instructions, states) {
        var row = [];
        var counter = 0;
        for (var i = 0; i < instructions.length; i++) {
            console.log(counter + " " + (counter + 1));
            row[counter] = instructions[i];
            row[counter + 1] = getState(i, states);
            counter = counter + 2;
        }
        return row;
    };

    UiManager.prototype.addRows = function () {
        $(getBodyTable(this.ciclesTableId)).append(generateRow([cicle]));

        $(getBodyTable(this.plannedTableId)).append(
            generateRow(dispatcherState)
        );

        $(getBodyTable(this.choosedTableId)).append(
            generateRow(reservStationsQueue)
        );
    }

    return UiManager;
});