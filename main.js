var csv = require("fast-csv"), 
    fs = require("fs"), 
    path = require("path"),
    request = require('request'),
    http = require('http'),
    commandLineArgs = require('command-line-args'),
    moment = require('moment');
    getUsage = require("command-line-usage"),
    createSocket = require( 'opentsdb-socket' );

const cliDefinitons = [
    { name: 'help', alias: 'h', type: Boolean, description: 'Display this message.' },
    { name: 'verbose', alias: 'v', type: Boolean, description: 'Enable verbose Logging' },
    { name: 'file', type: String, defaultOption: true, description: "Can also be provided as the last argument without a parameter name. The parameter is interpreted as source CSV file path."},
    { name: 'tsColumn', alias: 't', type: String, defaultValue: 'Timestamp', description: "The name of the column in the source file that holds the time. Default: 'Timestamp'"},
    { name: 'delimiter', alias: 'd', type: String, defaultValue: ';', description: "The String the delimits two columns. Default: ';'"},
    { name: 'opentsdb-url', alias: 'u', type: String, defaultValue: '127.0.0.1:4242', description: "The full URL to the OpenTSDB instance. Default: '127.0.0.1:4242'"},
    { name: 'tags', type: String, multiple: true, defaultValue: [], description: "A List of a tags to be added to each metric. Format Example: 'guid=asdf-123 user=test_user5'"}
];

const getUsageOptions = [
    {
        header: 'csv-to-opentsdb',
        content: 'Takes a CSV file and puts the numeric values tagged in a running OpenTSDB instance.'
    },
    {
        header: 'Options',
        optionList: cliDefinitons
    },
    {
        header:'Link',
        content:'Project home: [underline]{https://github.com/soeren-lubitz/csv-to-opentsdb}'
    }
]

var options = commandLineArgs(cliDefinitons)

var vlog = function() {
  options.verbose && console.log(Array.prototype.slice.call(arguments));
};

vlog(options);

var globalTags = {
    import:true
};

if (options.tags) {
    for (var i = options.tags.length - 1; i >= 0; i--) {
        var tagkv = options.tags[i].split('=', 2);
        if (tagkv.length == 2) {
            globalTags[tagkv[0]] = tagkv[1];
        } else {
            console.warn('Could not parse tag', options.tags[i]);
        }
    }
}

var globalTagsString = '';
for (tagkey in globalTags) {
    if ({}.hasOwnProperty.call(globalTags, tagkey)) {
        globalTagsString += tagkey + '=' + globalTags[tagkey] + ' ';
    }
}

if (!options.file) {
    console.error("Please provide source csv file!");
    console.log(getUsage(getUsageOptions));
    process.exit(1);
}

var sourceFileName = options.file;

var openTSDBQueryString = options['opentsdb-url'] + '/api/put/?details';//&sync&sync_timeout=60000'

var socket = createSocket();

var connectOptions = options['opentsdb-url'].split(':', 2);

var port = 4242;
var host = '127.0.0.1';
if (connectOptions.length == 2) {
    host = connectOptions[0];
    port = parseInt(connectOptions[1]);
} else {
    host = connectOptions[0];
}

vlog('connecting to ', host, port);

socket
    .host( host)
    .port( port )
    .strict( false );

socket.on( 'error', onError );
socket.on( 'close', onClose );
socket.on( 'connect', onConnect );

connect();

function connect() {
    socket.connect();
}

function onError( error ) {
    console.error( error.message );
    console.error( error.stack );
}

function onClose() {
    console.log( '...attempting to reconnect in 2 seconds...' );
    setTimeout( function reconnect() {
        connect();
    }, 2000 );
}

function onConnect() {
    vlog('Connected to openTSDB Socket.');
}

function onWrite() {
    vlog( '...data written to socket...' );
}

function write(data) {
    setTimeout( function onTimeout() {
        if ( socket.status() ) {
            socket.write( data, onWrite );
        }
    }, 60000);
}


// var csvStream = csv.createWriteStream({headers: true, delimiter: ";", quote:null});
// var writableStream = fs.createWriteStream(destFielName);

// writableStream.on("finish", function(){
//   console.log("DONE!");
// });

// csvStream.pipe(writableStream);


var lastRow = null;
var work = 0;
var granularity = null;
var firstRun = true;

var stream = fs.createReadStream(sourceFileName)
    .pipe(csv.parse({headers: true, delimiter: options.delimiter}))
    .transform(function (row) {
        var rowObject = {
            timestamp: parseInt(row[options.tsColumn])
        };

        for (rowKey in row) {
            if (rowKey != options.tsColumn && {}.hasOwnProperty.call(row, rowKey)) {
                var v = row[rowKey].replace(',','.');
                rowObject[rowKey] = parseFloat(v)
            }
        }  
        return rowObject;
    })
    .on("readable", function () {
        while (null !== (row = stream.read())) {
            if (isNaN(row.timestamp)) {
                console.warn('Error Parsing Timestamp');
                continue;
            }

            // vlog(row);
            writeToOpenTSDB(row);
            //write to openTSDB
        }
    })
    .on("end", function() {
        console.log("Done.");
        process.exit;
    });

var myAgent = http.Agent({keepAlive:false, maxSockets:8});
var dataArray = [];

function writeToOpenTSDB(row) {
    // var dataArray = []

    for (rowKey in row) {
        if (rowKey != 'timestamp' && {}.hasOwnProperty.call(row, rowKey)) {
            var line = 'put ';
            line += rowKey + ' ';
            line += row.timestamp + ' ';
            line += row[rowKey] + ' ';
            line += globalTagsString;
            line += '\n';
            write(line);      
        }
    }
}
