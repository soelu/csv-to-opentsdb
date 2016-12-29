# csv to opentsdb importer

Takes a CSV file and puts the numeric values tagged in a running OpenTSDB instance.

## Installation

`npm install`

## Usage

```
Example:  node main.js -v --tags guid=foo_guid -d ',' bar.csv

Options

  -h, --help                  Display this message.                                                         
  -v, --verbose               Enable verbose Logging                                                        
  --file string               Can also be provided as the last argument without a parameter name. The       
                              parameter is interpreted as source CSV file path.                             
  -t, --tsColumn string       The name of the column in the source file that holds the time. Default:       
                              'Timestamp'                                                                   
  -d, --delimiter string      The String the delimits two columns. Default: ';'                             
  -u, --opentsdb-url string   The full URL to the OpenTSDB instance. Default: '127.0.0.1:4242'              
  --tags string[]             A List of a tags to be added to each metric. Format Example: 'guid=asdf-123   
                              user=test_user5'   
```

## Hint
Imports are done via socket connect. So the writes are asynchronous and success messages can arrive after the csv is parsed and send completely. 

## License

MIT